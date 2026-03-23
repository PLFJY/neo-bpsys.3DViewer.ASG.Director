using System.Windows.Controls;
using neo_bpsys_wpf._3DViewerIDV.ViewModels;
using neo_bpsys_wpf.Core.Attributes;
using neo_bpsys_wpf.Core.Enums;
using Wpf.Ui.Controls;

namespace neo_bpsys_wpf._3DViewerIDV.Views;

[BackendPageInfo(
    id: "3DViewerSettings",
    name: "3DViewerIDV",
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
