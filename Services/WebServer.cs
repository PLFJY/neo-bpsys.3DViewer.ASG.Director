using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public class WebServer : IDisposable
{
    private readonly Func<string> _jsonProvider;
    private HttpListener? _listener;
    private CancellationTokenSource? _cts;
    private Task? _runTask;
    private readonly string _wwwrootPath;
    private readonly int _port;

    public WebServer(Func<string> jsonProvider, int port = 8080)
    {
        _jsonProvider = jsonProvider;
        _port = port;

        // Determine wwwroot path
        var pluginFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "neo-bpsys-wpf", "Plugins", "3DViewerIDV"
        );
        _wwwrootPath = Path.Combine(pluginFolder, "wwwroot");
    }

    public void Start()
    {
        if (_listener != null)
        {
            return; // Already started
        }

        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://localhost:{_port}/");

        try
        {
            _listener.Start();
            System.Diagnostics.Debug.WriteLine($"Web server started at http://localhost:{_port}");

            _cts = new CancellationTokenSource();
            _runTask = Task.Run(() => ListenAsync(_cts.Token));
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to start web server: {ex.Message}");
            _listener?.Close();
            _listener = null;
        }
    }

    private async Task ListenAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested && _listener != null && _listener.IsListening)
        {
            try
            {
                var context = await _listener.GetContextAsync();
                _ = Task.Run(() => HandleRequest(context), cancellationToken);
            }
            catch (HttpListenerException)
            {
                // Listener was stopped
                break;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Web server error: {ex.Message}");
            }
        }
    }

    private void HandleRequest(HttpListenerContext context)
    {
        try
        {
            var request = context.Request;
            var response = context.Response;

            // Add CORS headers
            response.AddHeader("Access-Control-Allow-Origin", "*");
            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.AddHeader("Access-Control-Allow-Headers", "*");

            // Handle OPTIONS preflight
            if (request.HttpMethod == "OPTIONS")
            {
                response.StatusCode = 204;
                response.Close();
                return;
            }

            // Handle API endpoint
            if (request.Url?.AbsolutePath == "/api/characters")
            {
                var json = _jsonProvider();
                System.Diagnostics.Debug.WriteLine($"[WebServer] /api/characters called, returning: {json}");
                var buffer = Encoding.UTF8.GetBytes(json);
                response.ContentType = "application/json";
                response.ContentLength64 = buffer.Length;
                response.OutputStream.Write(buffer, 0, buffer.Length);
                response.Close();
                return;
            }

            // Serve static files
            var urlPath = request.Url?.AbsolutePath?.TrimStart('/') ?? "";
            if (string.IsNullOrEmpty(urlPath))
            {
                urlPath = "scene.html";
            }

            // Decode URL-encoded characters (e.g., Chinese characters)
            urlPath = Uri.UnescapeDataString(urlPath);

            var filePath = Path.Combine(_wwwrootPath, urlPath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath))
            {
                var contentType = GetContentType(filePath);
                response.ContentType = contentType;

                using var fileStream = File.OpenRead(filePath);
                response.ContentLength64 = fileStream.Length;
                fileStream.CopyTo(response.OutputStream);
                response.Close();
            }
            else
            {
                response.StatusCode = 404;
                response.Close();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error handling request: {ex.Message}");
            try
            {
                context.Response.StatusCode = 500;
                context.Response.Close();
            }
            catch { }
        }
    }

    private static string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".html" => "text/html",
            ".css" => "text/css",
            ".js" => "application/javascript",
            ".json" => "application/json",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".svg" => "image/svg+xml",
            ".woff" => "font/woff",
            ".woff2" => "font/woff2",
            ".ttf" => "font/ttf",
            ".gltf" => "model/gltf+json",
            ".bin" => "application/octet-stream",
            ".glb" => "model/gltf-binary",
            _ => "application/octet-stream"
        };
    }

    public void Stop()
    {
        if (_listener == null)
        {
            return; // Not started
        }

        try
        {
            _cts?.Cancel();
            _listener?.Stop();
            _listener?.Close();
            _runTask?.Wait(TimeSpan.FromSeconds(5));
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error stopping web server: {ex.Message}");
        }
        finally
        {
            _cts?.Dispose();
            _cts = null;
            _runTask = null;
            _listener = null;
        }

        System.Diagnostics.Debug.WriteLine("Web server stopped");
    }

    public void Dispose()
    {
        Stop();
    }
}
