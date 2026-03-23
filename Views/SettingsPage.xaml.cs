using System.Windows.Controls;
using neo_bpsys_wpf._3DViewerIDV.ViewModels;
using neo_bpsys_wpf.Core.Attributes;
using neo_bpsys_wpf.Core.Enums;
using Wpf.Ui.Controls;

namespace neo_bpsys_wpf._3DViewerIDV.Views;

[BackendPageInfo(
    id: "8786f5d3-ae4d-44a4-a725-eee3147e8491",
    name: "3DViewer.ASG.Director",
    icon: SymbolRegular.Cube24,
    category: BackendPageCategory.External
)]
public partial class SettingsPage : Page
{
    public SettingsPage(SettingsPageViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
