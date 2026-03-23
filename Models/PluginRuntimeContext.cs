using System.IO;

namespace neo_bpsys_wpf._3DViewerIDV.Models;

public sealed class PluginRuntimeContext(string pluginConfigFolder, string contentRootFolder)
{
    public string PluginConfigFolder { get; } = pluginConfigFolder;

    public string ContentRootFolder { get; } = contentRootFolder;

    public string DataFolder => Path.Combine(ContentRootFolder, "Data");

    public string WwwRootFolder => Path.Combine(ContentRootFolder, "wwwroot");

    public string AssetsFolder => Path.Combine(PluginConfigFolder, "Assets");

    public string OfficialModelsFolder => Path.Combine(PluginConfigFolder, "OfficialModels");

    public string OfficialModelCatalogFilePath => Path.Combine(DataFolder, "OfficialModelCatalog.json");

    public string WebViewUserDataFolder => Path.Combine(PluginConfigFolder, "WebView2");
}
