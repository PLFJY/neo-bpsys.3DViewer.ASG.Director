using CommunityToolkit.Mvvm.ComponentModel;

namespace neo_bpsys_wpf._3DViewerIDV.Models;

public partial class PluginSettings : ObservableObject
{
    [ObservableProperty]
    private int _webServerPort = 8080;
}
