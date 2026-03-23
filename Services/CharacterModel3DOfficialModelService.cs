using neo_bpsys_wpf._3DViewerIDV.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DOfficialModelService
{
    private static readonly HttpClient HttpClient = CreateHttpClient();

    private readonly PluginRuntimeContext _runtimeContext;
    private readonly object _catalogGate = new();
    private readonly SemaphoreSlim _prepareGate = new(1, 1);

    private IReadOnlyList<OfficialModelCatalogEntry>? _catalog;
    private Task<OfficialModelPrepareResult>? _prepareTask;

    public CharacterModel3DOfficialModelService(PluginRuntimeContext runtimeContext)
    {
        _runtimeContext = runtimeContext;
        Directory.CreateDirectory(_runtimeContext.OfficialModelsFolder);
    }

    public event Action<OfficialModelDownloadProgress>? DownloadProgressChanged;

    public event Action? StatusChanged;

    public IReadOnlyList<OfficialModelCatalogEntry> GetCatalogEntries()
    {
        if (_catalog != null)
        {
            return _catalog;
        }

        lock (_catalogGate)
        {
            if (_catalog != null)
            {
                return _catalog;
            }

            if (!File.Exists(_runtimeContext.OfficialModelCatalogFilePath))
            {
                _catalog = Array.Empty<OfficialModelCatalogEntry>();
                return _catalog;
            }

            try
            {
                var root = JsonNode.Parse(File.ReadAllText(_runtimeContext.OfficialModelCatalogFilePath));
                var entries = new List<OfficialModelCatalogEntry>();
                if (root?["entries"] is JsonArray array)
                {
                    foreach (var node in array.OfType<JsonObject>())
                    {
                        var name = node["name"]?.GetValue<string>() ?? string.Empty;
                        var rawName = node["rawName"]?.GetValue<string>() ?? name;
                        var modelUrl = node["modelUrl"]?.GetValue<string>() ?? string.Empty;
                        var localFolderName = node["localFolderName"]?.GetValue<string>() ?? string.Empty;
                        var fileName = node["fileName"]?.GetValue<string>() ?? string.Empty;
                        if (string.IsNullOrWhiteSpace(name)
                            || string.IsNullOrWhiteSpace(modelUrl)
                            || string.IsNullOrWhiteSpace(localFolderName)
                            || string.IsNullOrWhiteSpace(fileName))
                        {
                            continue;
                        }

                        entries.Add(new OfficialModelCatalogEntry(
                            name,
                            string.IsNullOrWhiteSpace(rawName) ? name : rawName,
                            modelUrl,
                            localFolderName,
                            fileName));
                    }
                }

                _catalog = entries;
            }
            catch
            {
                _catalog = Array.Empty<OfficialModelCatalogEntry>();
            }

            return _catalog;
        }
    }

    public OfficialModelCatalogEntry? FindEntry(string? roleName)
    {
        var key = NormalizeKey(roleName);
        if (string.IsNullOrWhiteSpace(key))
        {
            return null;
        }

        return GetCatalogEntries().FirstOrDefault(entry =>
            NormalizeKey(entry.Name) == key
            || NormalizeKey(entry.RawName) == key);
    }

    public OfficialModelDownloadStatus GetDownloadStatus()
    {
        var entries = GetCatalogEntries();
        var downloaded = entries.Count(entry => File.Exists(GetLocalModelPath(entry)));
        return new OfficialModelDownloadStatus(
            entries.Count,
            downloaded,
            entries.Count > 0 && downloaded == entries.Count);
    }

    public string GetServedModelPath(OfficialModelCatalogEntry? entry)
    {
        if (entry == null)
        {
            return string.Empty;
        }

        var localPath = GetLocalModelPath(entry);
        if (File.Exists(localPath))
        {
            return "/official-models/"
                   + Uri.EscapeDataString(entry.LocalFolderName)
                   + "/"
                   + Uri.EscapeDataString(entry.FileName);
        }

        return entry.ModelUrl;
    }

    public string GetLocalModelPath(OfficialModelCatalogEntry entry)
    {
        return Path.Combine(_runtimeContext.OfficialModelsFolder, entry.LocalFolderName, entry.FileName);
    }

    public async Task<OfficialModelPrepareResult> PrepareOfficialModelsAsync(CancellationToken cancellationToken = default)
    {
        await _prepareGate.WaitAsync(cancellationToken);
        try
        {
            if (_prepareTask != null)
            {
                return await _prepareTask;
            }

            _prepareTask = PrepareOfficialModelsCoreAsync(cancellationToken);
        }
        finally
        {
            _prepareGate.Release();
        }

        try
        {
            return await _prepareTask;
        }
        finally
        {
            await _prepareGate.WaitAsync(CancellationToken.None);
            try
            {
                _prepareTask = null;
            }
            finally
            {
                _prepareGate.Release();
            }
        }
    }

    private async Task<OfficialModelPrepareResult> PrepareOfficialModelsCoreAsync(CancellationToken cancellationToken)
    {
        var entries = GetCatalogEntries();
        if (entries.Count == 0)
        {
            return new OfficialModelPrepareResult(false, 0, 0, 0, "官方模型目录清单不存在或为空");
        }

        var downloadedCount = 0;
        var skippedCount = 0;

        for (var i = 0; i < entries.Count; i++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var entry = entries[i];
            var localPath = GetLocalModelPath(entry);
            var alreadyExists = File.Exists(localPath);
            if (!alreadyExists)
            {
                await DownloadFileAsync(
                    entry.ModelUrl,
                    localPath,
                    progress =>
                    {
                        var overall = (int)Math.Round(((i + (progress / 100d)) / Math.Max(1, entries.Count)) * 100d);
                        DownloadProgressChanged?.Invoke(new OfficialModelDownloadProgress(
                            i + 1,
                            entries.Count,
                            entry.Name,
                            progress,
                            overall));
                    },
                    cancellationToken);
            }
            else
            {
                skippedCount++;
            }

            if (localPath.EndsWith(".gltf", StringComparison.OrdinalIgnoreCase))
            {
                await EnsureGltfDependenciesAsync(entry.ModelUrl, localPath, cancellationToken);
            }

            downloadedCount++;
            DownloadProgressChanged?.Invoke(new OfficialModelDownloadProgress(
                i + 1,
                entries.Count,
                entry.Name,
                100,
                (int)Math.Round((downloadedCount / (double)Math.Max(1, entries.Count)) * 100d)));
        }

        StatusChanged?.Invoke();
        return new OfficialModelPrepareResult(true, entries.Count, downloadedCount, skippedCount);
    }

    private async Task EnsureGltfDependenciesAsync(string modelUrl, string localPath, CancellationToken cancellationToken)
    {
        try
        {
            var root = JsonNode.Parse(await File.ReadAllTextAsync(localPath, cancellationToken)) as JsonObject;
            if (root == null)
            {
                return;
            }

            var dependencies = new List<string>();
            CollectDependencies(root["buffers"], dependencies);
            CollectDependencies(root["images"], dependencies);

            foreach (var uri in dependencies.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                cancellationToken.ThrowIfCancellationRequested();
                if (string.IsNullOrWhiteSpace(uri) || uri.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var targetPath = Path.Combine(
                    Path.GetDirectoryName(localPath) ?? _runtimeContext.OfficialModelsFolder,
                    uri.Replace('/', Path.DirectorySeparatorChar));

                if (File.Exists(targetPath))
                {
                    continue;
                }

                var dependencyUrl = new Uri(new Uri(modelUrl), uri).ToString();
                await DownloadFileAsync(dependencyUrl, targetPath, null, cancellationToken);
            }
        }
        catch
        {
            // Keep the main model available even if auxiliary files fail.
        }

        static void CollectDependencies(JsonNode? node, List<string> output)
        {
            if (node is not JsonArray array)
            {
                return;
            }

            foreach (var item in array.OfType<JsonObject>())
            {
                var uri = item["uri"]?.GetValue<string>() ?? string.Empty;
                if (!string.IsNullOrWhiteSpace(uri))
                {
                    output.Add(uri);
                }
            }
        }
    }

    private static async Task DownloadFileAsync(
        string url,
        string destinationPath,
        Action<int>? onProgress,
        CancellationToken cancellationToken)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(destinationPath) ?? ".");

        using var response = await HttpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        var totalBytes = response.Content.Headers.ContentLength;
        await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        await using var fileStream = new FileStream(destinationPath, FileMode.Create, FileAccess.Write, FileShare.None);

        var buffer = new byte[81920];
        long downloadedBytes = 0;
        int read;
        while ((read = await responseStream.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken)) > 0)
        {
            await fileStream.WriteAsync(buffer.AsMemory(0, read), cancellationToken);
            downloadedBytes += read;
            if (onProgress != null && totalBytes.GetValueOrDefault() > 0)
            {
                var total = totalBytes.GetValueOrDefault();
                var progress = (int)Math.Round((downloadedBytes / (double)total) * 100d);
                onProgress(Math.Max(0, Math.Min(100, progress)));
            }
        }
    }

    private static HttpClient CreateHttpClient()
    {
        var client = new HttpClient
        {
            Timeout = TimeSpan.FromMinutes(5)
        };
        client.DefaultRequestHeaders.UserAgent.ParseAdd("neo-bpsys-wpf.3DViewerIDV/1.0");
        return client;
    }

    private static string NormalizeKey(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? string.Empty
            : value.Replace(".png", "", StringComparison.OrdinalIgnoreCase)
                .Replace("\"", "")
                .Replace("“", "")
                .Replace("”", "")
                .Replace("'", "")
                .Trim()
                .ToLowerInvariant();
    }
}
