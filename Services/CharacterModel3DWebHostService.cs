using neo_bpsys_wpf._3DViewerIDV.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DWebHostService : IDisposable
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = false
    };

    private readonly PluginRuntimeContext _runtimeContext;
    private readonly Models.PluginSettings _settings;
    private readonly CharacterModel3DLayoutService _layoutService;
    private readonly CharacterModel3DBpSnapshotService _snapshotService;
    private readonly CharacterModel3DGuidanceBridgeService _guidanceBridgeService;
    private readonly CharacterModel3DAssetService _assetService;
    private readonly CharacterModel3DModelIndexService _modelIndexService;
    private readonly ConcurrentDictionary<Guid, SseClient> _sseClients = new();
    private readonly object _serverGate = new();

    private HttpListener? _listener;
    private CancellationTokenSource? _cts;
    private Task? _serverTask;

    public CharacterModel3DWebHostService(
        PluginRuntimeContext runtimeContext,
        Models.PluginSettings settings,
        CharacterModel3DLayoutService layoutService,
        CharacterModel3DBpSnapshotService snapshotService,
        CharacterModel3DGuidanceBridgeService guidanceBridgeService,
        CharacterModel3DAssetService assetService,
        CharacterModel3DModelIndexService modelIndexService)
    {
        _runtimeContext = runtimeContext;
        _settings = settings;
        _layoutService = layoutService;
        _snapshotService = snapshotService;
        _guidanceBridgeService = guidanceBridgeService;
        _assetService = assetService;
        _modelIndexService = modelIndexService;

        _snapshotService.StateChanged += snapshot =>
            _ = BroadcastAsync(new JsonObject
            {
                ["type"] = "state",
                ["state"] = snapshot.DeepClone()
            });

        _layoutService.LayoutChanged += change =>
            _ = BroadcastAsync(new JsonObject
            {
                ["type"] = "layout",
                ["layout"] = change.Layout?.DeepClone(),
                ["sourceId"] = string.IsNullOrWhiteSpace(change.Origin) ? null : change.Origin
            });

        _guidanceBridgeService.CameraEventRequested += eventKey =>
            _ = BroadcastAsync(new JsonObject
            {
                ["type"] = "cameraEvent",
                ["key"] = eventKey
            });
    }

    public event Action? StatusChanged;

    public bool IsRunning => _listener is { IsListening: true };

    public string BaseUrl => $"http://localhost:{_settings.WebServerPort}";

    public string EditorUrl => $"{BaseUrl}/editor/index.html";

    public void Start()
    {
        lock (_serverGate)
        {
            if (_listener is { IsListening: true })
            {
                return;
            }

            Directory.CreateDirectory(_runtimeContext.AssetsFolder);
            Directory.CreateDirectory(_runtimeContext.OfficialModelsFolder);

            _cts = new CancellationTokenSource();
            _listener = new HttpListener();
            _listener.Prefixes.Add($"{BaseUrl}/");
            _listener.Start();
            _serverTask = Task.Run(() => ListenAsync(_cts.Token));
        }

        StatusChanged?.Invoke();
        _snapshotService.PublishCurrentSnapshot();
    }

    public void Stop()
    {
        lock (_serverGate)
        {
            _cts?.Cancel();

            try
            {
                _listener?.Stop();
                _listener?.Close();
            }
            catch
            {
                // Ignore shutdown races.
            }

            _listener = null;
        }

        foreach (var client in _sseClients.Values)
        {
            client.Dispose();
        }

        _sseClients.Clear();

        try
        {
            _serverTask?.Wait(TimeSpan.FromSeconds(2));
        }
        catch
        {
            // Ignore stop errors.
        }

        _serverTask = null;
        _cts?.Dispose();
        _cts = null;
        StatusChanged?.Invoke();
    }

    private async Task ListenAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested && _listener is { IsListening: true } listener)
        {
            try
            {
                var context = await listener.GetContextAsync();
                _ = Task.Run(() => HandleRequestAsync(context, cancellationToken), cancellationToken);
            }
            catch (HttpListenerException)
            {
                break;
            }
            catch (ObjectDisposedException)
            {
                break;
            }
        }
    }

    private async Task HandleRequestAsync(HttpListenerContext context, CancellationToken cancellationToken)
    {
        var request = context.Request;
        var response = context.Response;
        AddCorsHeaders(response);

        try
        {
            if (request.HttpMethod == "OPTIONS")
            {
                response.StatusCode = (int)HttpStatusCode.NoContent;
                return;
            }

            var path = request.Url?.AbsolutePath ?? "/";
            if (path == "/" || path == "/editor")
            {
                await WriteFileAsync(response, Path.Combine(_runtimeContext.WwwRootFolder, "editor", "index.html"));
                return;
            }

            switch (path)
            {
                case "/api/state":
                    await WriteJsonAsync(response, BuildStatePayload());
                    return;
                case "/api/layout":
                    if (request.HttpMethod == "GET")
                    {
                        await WriteJsonAsync(response, _layoutService.GetLayout());
                        return;
                    }

                    if (request.HttpMethod == "POST")
                    {
                        var body = await ReadJsonBodyAsync(request);
                        var origin = TryGetString(body, "sourceId");
                        var layout = TryGetLayoutNode(body);
                        _layoutService.SaveLayout(layout, origin);
                        await WriteJsonAsync(response, new JsonObject { ["success"] = true });
                        return;
                    }

                    break;
                case "/api/models/index":
                    await WriteJsonAsync(response, JsonSerializer.SerializeToNode(_modelIndexService.GetOfficialModelMap(), JsonOptions));
                    return;
                case "/api/import-asset":
                    if (request.HttpMethod == "POST")
                    {
                        await HandleImportAssetAsync(request, response);
                        return;
                    }

                    break;
                case "/api/sse":
                    await HandleSseAsync(response, cancellationToken);
                    return;
            }

            var staticFilePath = ResolveStaticFilePath(path);
            if (!string.IsNullOrWhiteSpace(staticFilePath) && File.Exists(staticFilePath))
            {
                await WriteFileAsync(response, staticFilePath);
                return;
            }

            response.StatusCode = (int)HttpStatusCode.NotFound;
        }
        catch (Exception ex)
        {
            response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await WriteJsonAsync(response, new JsonObject
            {
                ["success"] = false,
                ["error"] = ex.Message
            });
        }
        finally
        {
            if (request.Url?.AbsolutePath != "/api/sse")
            {
                TryClose(response);
            }
        }
    }

    private JsonObject BuildStatePayload()
    {
        var payload = _snapshotService.GetSnapshot();
        payload["characterModel3DLayout"] = _layoutService.GetLayout();
        return payload;
    }

    private async Task HandleImportAssetAsync(HttpListenerRequest request, HttpListenerResponse response)
    {
        var body = await ReadJsonBodyAsync(request) as JsonObject;
        var copyMode = body?["copyMode"]?.GetValue<string>() ?? "auto";
        AssetImportResult result;

        var uploadedFiles = ReadUploadedBrowserFiles(body);
        if (uploadedFiles.Count > 0)
        {
            var entryRelativePath = body?["entryRelativePath"]?.GetValue<string>() ?? string.Empty;
            result = _assetService.ImportUploadedFiles(uploadedFiles, entryRelativePath, copyMode);
        }
        else
        {
            var sourcePath = body?["path"]?.GetValue<string>() ?? string.Empty;
            result = _assetService.ImportAsset(sourcePath, copyMode);
        }

        await WriteJsonAsync(response, new JsonObject
        {
            ["success"] = true,
            ["path"] = result.Path,
            ["copied"] = result.Copied,
            ["mode"] = result.Mode
        });
    }

    private static List<UploadedBrowserFile> ReadUploadedBrowserFiles(JsonObject? body)
    {
        var files = new List<UploadedBrowserFile>();
        if (body?["files"] is not JsonArray array)
        {
            return files;
        }

        foreach (var item in array.OfType<JsonObject>())
        {
            var fileName = item["name"]?.GetValue<string>() ?? string.Empty;
            var relativePath = item["relativePath"]?.GetValue<string>() ?? fileName;
            var base64 = item["base64"]?.GetValue<string>() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(fileName) || string.IsNullOrWhiteSpace(base64))
            {
                continue;
            }

            files.Add(new UploadedBrowserFile(
                fileName,
                relativePath,
                Convert.FromBase64String(base64)));
        }

        return files;
    }

    private async Task HandleSseAsync(HttpListenerResponse response, CancellationToken cancellationToken)
    {
        response.StatusCode = (int)HttpStatusCode.OK;
        response.ContentType = "text/event-stream";
        response.SendChunked = true;
        response.KeepAlive = true;
        response.AddHeader("Cache-Control", "no-cache");

        var client = new SseClient(response);
        _sseClients[client.Id] = client;

        await client.SendAsync(new JsonObject
        {
            ["type"] = "state",
            ["state"] = BuildStatePayload()
        }, cancellationToken);

        try
        {
            await Task.Delay(Timeout.Infinite, cancellationToken);
        }
        catch (OperationCanceledException)
        {
            // Expected during shutdown.
        }
        finally
        {
            _sseClients.TryRemove(client.Id, out _);
            client.Dispose();
        }
    }

    private async Task BroadcastAsync(JsonObject payload)
    {
        if (_sseClients.IsEmpty)
        {
            return;
        }

        foreach (var client in _sseClients.Values)
        {
            try
            {
                await client.SendAsync(payload, _cts?.Token ?? CancellationToken.None);
            }
            catch
            {
                _sseClients.TryRemove(client.Id, out _);
                client.Dispose();
            }
        }
    }

    private string ResolveStaticFilePath(string rawPath)
    {
        var path = Uri.UnescapeDataString(rawPath.TrimStart('/'));
        if (path.StartsWith("user-assets/", StringComparison.OrdinalIgnoreCase))
        {
            return Path.Combine(_runtimeContext.AssetsFolder, path["user-assets/".Length..].Replace('/', Path.DirectorySeparatorChar));
        }

        if (path.StartsWith("official-models/", StringComparison.OrdinalIgnoreCase))
        {
            return Path.Combine(_runtimeContext.OfficialModelsFolder, path["official-models/".Length..].Replace('/', Path.DirectorySeparatorChar));
        }

        if (path.StartsWith("official/", StringComparison.OrdinalIgnoreCase))
        {
            var officialModelPath = path["official/".Length..];
            return Path.Combine(_runtimeContext.OfficialModelsFolder, officialModelPath.Replace('/', Path.DirectorySeparatorChar));
        }

        return Path.Combine(_runtimeContext.WwwRootFolder, path.Replace('/', Path.DirectorySeparatorChar));
    }

    private static async Task<JsonNode?> ReadJsonBodyAsync(HttpListenerRequest request)
    {
        using var reader = new StreamReader(request.InputStream, request.ContentEncoding ?? Encoding.UTF8);
        var body = await reader.ReadToEndAsync();
        return string.IsNullOrWhiteSpace(body) ? null : JsonNode.Parse(body);
    }

    private static JsonNode? TryGetLayoutNode(JsonNode? body)
    {
        if (body is JsonObject obj && obj.TryGetPropertyValue("layout", out var layout))
        {
            return layout;
        }

        return body;
    }

    private static string? TryGetString(JsonNode? body, string propertyName)
    {
        if (body is JsonObject obj && obj.TryGetPropertyValue(propertyName, out var node))
        {
            return node?.GetValue<string>();
        }

        return null;
    }

    private static void AddCorsHeaders(HttpListenerResponse response)
    {
        response.AddHeader("Access-Control-Allow-Origin", "*");
        response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.AddHeader("Access-Control-Allow-Headers", "*");
    }

    private static async Task WriteJsonAsync(HttpListenerResponse response, JsonNode? payload)
    {
        response.ContentType = "application/json; charset=utf-8";
        var bytes = Encoding.UTF8.GetBytes(payload?.ToJsonString(JsonOptions) ?? "null");
        response.ContentLength64 = bytes.Length;
        await response.OutputStream.WriteAsync(bytes);
    }

    private static async Task WriteFileAsync(HttpListenerResponse response, string filePath)
    {
        response.ContentType = GetContentType(filePath);
        await using var stream = File.OpenRead(filePath);
        response.ContentLength64 = stream.Length;
        await stream.CopyToAsync(response.OutputStream);
    }

    private static void TryClose(HttpListenerResponse response)
    {
        try
        {
            response.Close();
        }
        catch
        {
            // Ignore close races.
        }
    }

    private static string GetContentType(string filePath)
    {
        return Path.GetExtension(filePath).ToLowerInvariant() switch
        {
            ".html" => "text/html; charset=utf-8",
            ".css" => "text/css; charset=utf-8",
            ".js" => "application/javascript; charset=utf-8",
            ".json" => "application/json; charset=utf-8",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".svg" => "image/svg+xml",
            ".gltf" => "model/gltf+json",
            ".glb" => "model/gltf-binary",
            ".obj" => "text/plain; charset=utf-8",
            ".mtl" => "text/plain; charset=utf-8",
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".ogg" => "video/ogg",
            ".wav" => "audio/wav",
            ".bin" => "application/octet-stream",
            _ => "application/octet-stream"
        };
    }

    public void Dispose()
    {
        Stop();
    }

    private sealed class SseClient : IDisposable
    {
        private readonly HttpListenerResponse _response;
        private readonly SemaphoreSlim _writeLock = new(1, 1);
        private readonly StreamWriter _writer;

        public SseClient(HttpListenerResponse response)
        {
            _response = response;
            _writer = new StreamWriter(response.OutputStream, new UTF8Encoding(false))
            {
                AutoFlush = true
            };
        }

        public Guid Id { get; } = Guid.NewGuid();

        public async Task SendAsync(JsonObject payload, CancellationToken cancellationToken)
        {
            var json = payload.ToJsonString(JsonOptions);
            await _writeLock.WaitAsync(cancellationToken);
            try
            {
                await _writer.WriteAsync($"data: {json}\n\n");
                await _writer.FlushAsync();
            }
            finally
            {
                _writeLock.Release();
            }
        }

        public void Dispose()
        {
            _writeLock.Dispose();
            _writer.Dispose();
            TryClose(_response);
        }
    }
}
