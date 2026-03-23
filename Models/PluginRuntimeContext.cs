using System.IO;

namespace neo_bpsys_wpf._3DViewerIDV.Models;

public sealed class PluginRuntimeContext(string pluginConfigFolder, string contentRootFolder)
{
    public string PluginConfigFolder { get; } = pluginConfigFolder;

    public string ContentRootFolder { get; } = contentRootFolder;

    public string WwwRootFolder => Path.Combine(ContentRootFolder, "wwwroot");

    public string AssetsFolder => Path.Combine(PluginConfigFolder, "Assets");

    public string WebViewUserDataFolder => Path.Combine(PluginConfigFolder, "WebView2");
}
