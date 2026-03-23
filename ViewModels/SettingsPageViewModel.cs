using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using neo_bpsys_wpf._3DViewerIDV.Models;
using neo_bpsys_wpf._3DViewerIDV.Services;
using neo_bpsys_wpf.Core.Abstractions;
using neo_bpsys_wpf.Core.Helpers;
using System;
using System.Diagnostics;
using neo_bpsys_wpf._3DViewerIDV.Views;

namespace neo_bpsys_wpf._3DViewerIDV.ViewModels;

public partial class SettingsPageViewModel : ViewModelBase
{
    private readonly PluginSettings _settings;
    private readonly CharacterModel3DWebHostService _webHostService;
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

    public SettingsPageViewModel(
        PluginSettings settings,
        PluginRuntimeContext runtimeContext,
        CharacterModel3DWebHostService webHostService,
        StatsViewerWindow statsViewerWindow)
    {
        _settings = settings;
        _webHostService = webHostService;
        _statsViewerWindow = statsViewerWindow;
        PortInput = _settings.WebServerPort;
        _settingsFilePath = System.IO.Path.Combine(runtimeContext.PluginConfigFolder, "Settings.json");
        _webHostService.StatusChanged += RefreshServerState;
        RefreshServerState();
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

    private void RefreshServerState()
    {
        IsServerRunning = _webHostService.IsRunning;
        ServerUrl = IsServerRunning ? _webHostService.BaseUrl : "Server stopped";
        EditorUrl = IsServerRunning ? _webHostService.EditorUrl : "Server stopped";
    }
}
