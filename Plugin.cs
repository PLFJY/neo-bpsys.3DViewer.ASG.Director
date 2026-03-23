using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using neo_bpsys_wpf.Core;
using neo_bpsys_wpf.Core.Abstractions;
using neo_bpsys_wpf.Core.Extensions.Registry;
using neo_bpsys_wpf.Core.Helpers;
using neo_bpsys_wpf._3DViewerIDV.Models;
using neo_bpsys_wpf._3DViewerIDV.Services;
using neo_bpsys_wpf._3DViewerIDV.ViewModels;
using neo_bpsys_wpf._3DViewerIDV.Views;
using System.IO;

namespace neo_bpsys_wpf._3DViewerIDV;

public class Plugin : PluginBase
{
    public override void Initialize(HostBuilderContext context, IServiceCollection services)
    {
        Directory.CreateDirectory(PluginConfigFolder);

        var settingsFilePath = Path.Combine(PluginConfigFolder, "Settings.json");
        var settings = ConfigureFileHelper.LoadConfig<PluginSettings>(settingsFilePath);

        settings.PropertyChanged += (sender, args) =>
        {
            ConfigureFileHelper.SaveConfig(settingsFilePath, settings);
        };

        var contentRoot = Path.GetDirectoryName(typeof(Plugin).Assembly.Location) ?? PluginConfigFolder;
        var runtimeContext = new PluginRuntimeContext(PluginConfigFolder, contentRoot);

        services.AddSingleton(runtimeContext);
        services.AddSingleton(settings);
        services.AddSingleton<CharacterModel3DLayoutService>();
        services.AddSingleton<CharacterModel3DAssetService>();
        services.AddSingleton<CharacterModel3DModelIndexService>();
        services.AddSingleton<CharacterModel3DBpSnapshotService>();
        services.AddSingleton<CharacterModel3DGuidanceBridgeService>();
        services.AddSingleton<CharacterModel3DWebHostService>();

        services.AddFrontedWindow<StatsViewerWindow, StatsViewerWindowViewModel>();
        services.AddBackendPage<SettingsPage, SettingsPageViewModel>();
    }
}
