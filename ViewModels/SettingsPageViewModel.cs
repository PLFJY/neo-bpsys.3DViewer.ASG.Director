using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using neo_bpsys_wpf._3DViewerIDV.Models;
using neo_bpsys_wpf._3DViewerIDV.Services;
using neo_bpsys_wpf.Core.Abstractions;
using neo_bpsys_wpf.Core.Helpers;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows;
using neo_bpsys_wpf._3DViewerIDV.Views;

namespace neo_bpsys_wpf._3DViewerIDV.ViewModels;

public partial class SettingsPageViewModel : ViewModelBase
{
    private readonly PluginSettings _settings;
    private readonly PluginRuntimeContext _runtimeContext;
    private readonly CharacterModel3DWebHostService _webHostService;
    private readonly CharacterModel3DOfficialModelService _officialModelService;
    private readonly StatsViewerWindow _statsViewerWindow;

    [ObservableProperty]
    private bool _isServerRunning;

    [ObservableProperty]
    private string _serverUrl = "Server stopped";

    [ObservableProperty]
    private int _portInput;

    private readonly string _settingsFilePath;

    [ObservableProperty]
    private string _editorUrl = "Server stopped";

    [ObservableProperty]
    private string _officialModelStatus = "官方模型: 未检测";

    [ObservableProperty]
    private string _officialModelDetail = "模型将下载到插件自己的配置目录。";

    [ObservableProperty]
    private double _officialModelProgress;

    [ObservableProperty]
    private bool _isOfficialModelDownloadInProgress;

    [ObservableProperty]
    private string _officialModelFolderPath = string.Empty;

    public SettingsPageViewModel(
        PluginSettings settings,
        PluginRuntimeContext runtimeContext,
        CharacterModel3DWebHostService webHostService,
        CharacterModel3DOfficialModelService officialModelService,
        StatsViewerWindow statsViewerWindow)
    {
        _settings = settings;
        _runtimeContext = runtimeContext;
        _webHostService = webHostService;
        _officialModelService = officialModelService;
        _statsViewerWindow = statsViewerWindow;
        PortInput = _settings.WebServerPort;
        _settingsFilePath = System.IO.Path.Combine(runtimeContext.PluginConfigFolder, "Settings.json");
        OfficialModelFolderPath = _runtimeContext.OfficialModelsFolder;
        _webHostService.StatusChanged += RefreshServerState;
        _officialModelService.DownloadProgressChanged += HandleOfficialModelDownloadProgress;
        _officialModelService.StatusChanged += HandleOfficialModelStatusChanged;
        RefreshServerState();
        RefreshOfficialModelStatus();
    }

    [RelayCommand]
    private void StartServer()
    {
        try
        {
            _settings.WebServerPort = PortInput;
            SaveSettings();
            _webHostService.Start();
            RefreshServerState();
        }
        catch (Exception ex)
        {
            ServerUrl = $"Failed to start: {ex.Message}";
            IsServerRunning = false;
        }
    }

    [RelayCommand]
    private void StopServer()
    {
        try
        {
            _webHostService.Stop();
            RefreshServerState();
        }
        catch (Exception ex)
        {
            ServerUrl = $"Error: {ex.Message}";
        }
    }

    [RelayCommand]
    private void OpenServerUrl()
    {
        if (IsServerRunning)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = ServerUrl,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to open URL: {ex.Message}");
            }
        }
    }

    [RelayCommand]
    private void OpenEditorWindow()
    {
        StartServer();

        if (!_statsViewerWindow.IsVisible)
        {
            _statsViewerWindow.Show();
        }

        if (_statsViewerWindow.WindowState == System.Windows.WindowState.Minimized)
        {
            _statsViewerWindow.WindowState = System.Windows.WindowState.Normal;
        }

        _statsViewerWindow.Activate();
    }

    [RelayCommand]
    private void OpenEditorUrl()
    {
        if (!IsServerRunning)
        {
            StartServer();
        }

        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = EditorUrl,
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Failed to open editor URL: {ex.Message}");
        }
    }

    [RelayCommand(CanExecute = nameof(CanDownloadOfficialModels))]
    private async Task DownloadOfficialModelsAsync()
    {
        try
        {
            IsOfficialModelDownloadInProgress = true;
            OfficialModelDetail = "正在下载官方模型资源...";
            OfficialModelProgress = 0;
            DownloadOfficialModelsCommand.NotifyCanExecuteChanged();

            var result = await _officialModelService.PrepareOfficialModelsAsync();
            if (!result.Success)
            {
                OfficialModelDetail = $"下载失败: {result.Error ?? "unknown"}";
                return;
            }

            OfficialModelDetail = $"下载完成: {result.Downloaded}/{result.Total}，跳过 {result.Skipped} 个已存在模型。";
            RefreshOfficialModelStatus();
        }
        catch (Exception ex)
        {
            OfficialModelDetail = $"下载失败: {ex.Message}";
        }
        finally
        {
            IsOfficialModelDownloadInProgress = false;
            DownloadOfficialModelsCommand.NotifyCanExecuteChanged();
        }
    }

    [RelayCommand]
    private void RefreshOfficialModelStatus()
    {
        try
        {
            var status = _officialModelService.GetDownloadStatus();
            OfficialModelStatus = status.Total > 0
                ? $"官方模型: {status.Downloaded}/{status.Total}"
                : "官方模型: 未找到目录清单";
            if (!IsOfficialModelDownloadInProgress)
            {
                OfficialModelProgress = status.Total > 0
                    ? Math.Round(status.Downloaded * 100d / Math.Max(1, status.Total), 2)
                    : 0;
            }

            OfficialModelDetail = status.Total == 0
                ? "目录清单不存在或为空，请先更新插件内的目录清单文件。"
                : status.Complete
                    ? "官方模型已全部缓存到插件配置目录。"
                    : $"缓存目录: {OfficialModelFolderPath}";
        }
        catch (Exception ex)
        {
            OfficialModelStatus = "官方模型: 状态读取失败";
            OfficialModelDetail = ex.Message;
        }
    }

    [RelayCommand]
    private void OpenOfficialModelFolder()
    {
        try
        {
            System.IO.Directory.CreateDirectory(OfficialModelFolderPath);
            Process.Start(new ProcessStartInfo
            {
                FileName = OfficialModelFolderPath,
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            OfficialModelDetail = $"打开目录失败: {ex.Message}";
        }
    }

    [RelayCommand]
    private void SaveSettings()
    {
        try
        {
            ConfigureFileHelper.SaveConfig(_settingsFilePath, _settings);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to save settings: {ex.Message}");
        }
    }

    public void Dispose()
    {
        StopServer();
    }

    private bool CanDownloadOfficialModels()
    {
        return !IsOfficialModelDownloadInProgress;
    }

    partial void OnIsOfficialModelDownloadInProgressChanged(bool value)
    {
        DownloadOfficialModelsCommand.NotifyCanExecuteChanged();
    }

    private void RefreshServerState()
    {
        IsServerRunning = _webHostService.IsRunning;
        ServerUrl = IsServerRunning ? _webHostService.BaseUrl : "Server stopped";
        EditorUrl = IsServerRunning ? _webHostService.EditorUrl : "Server stopped";
    }

    private void HandleOfficialModelDownloadProgress(OfficialModelDownloadProgress progress)
    {
        RunOnUiThread(() =>
        {
            IsOfficialModelDownloadInProgress = true;
            OfficialModelProgress = progress.Overall;
            OfficialModelStatus = $"官方模型: {progress.Current}/{progress.Total}";
            OfficialModelDetail = $"正在下载 {progress.RoleName} ({progress.Progress}%)";
        });
    }

    private void HandleOfficialModelStatusChanged()
    {
        RunOnUiThread(RefreshOfficialModelStatus);
    }

    private static void RunOnUiThread(Action action)
    {
        if (Application.Current?.Dispatcher == null || Application.Current.Dispatcher.CheckAccess())
        {
            action();
            return;
        }

        _ = Application.Current.Dispatcher.InvokeAsync(action);
    }
}
