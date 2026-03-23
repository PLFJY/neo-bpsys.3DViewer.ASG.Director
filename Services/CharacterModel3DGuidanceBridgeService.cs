using CommunityToolkit.Mvvm.Messaging;
using neo_bpsys_wpf.Core.Abstractions.Services;
using neo_bpsys_wpf.Core.Enums;
using neo_bpsys_wpf.Core.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DGuidanceBridgeService : IDisposable
{
    private readonly IGameGuidanceService _gameGuidanceService;
    private readonly CharacterModel3DBpSnapshotService _snapshotService;

    public CharacterModel3DGuidanceBridgeService(
        IGameGuidanceService gameGuidanceService,
        CharacterModel3DBpSnapshotService snapshotService)
    {
        _gameGuidanceService = gameGuidanceService;
        _snapshotService = snapshotService;
        WeakReferenceMessenger.Default.Register<HighlightMessage>(this, static (recipient, message) =>
        {
            ((CharacterModel3DGuidanceBridgeService)recipient).HandleHighlightMessage(message);
        });
    }

    public event Action<string>? CameraEventRequested;

    private void HandleHighlightMessage(HighlightMessage message)
    {
        if (!_gameGuidanceService.IsGuidanceStarted)
        {
            return;
        }

        string eventKey = message.GameAction switch
        {
            GameAction.PickSur => ResolveSurvivorCameraEvent(message.Index),
            GameAction.PickHun => "hunterSelected",
            GameAction.BanSur => "banUpdated",
            GameAction.BanHun => "banUpdated",
            GameAction.BanMap => "banUpdated",
            GameAction.PickMap => "banUpdated",
            _ => string.Empty
        };

        if (!string.IsNullOrWhiteSpace(eventKey))
        {
            CameraEventRequested?.Invoke(eventKey);
        }
    }

    private string ResolveSurvivorCameraEvent(IReadOnlyList<int>? indexes)
    {
        if (indexes is { Count: > 0 })
        {
            var maxIndex = indexes.Max();
            return $"survivor{Math.Clamp(maxIndex + 1, 1, 4)}";
        }

        var snapshot = _snapshotService.GetSnapshot();
        var selectedCount = 0;
        if (snapshot["survivors"] is JsonArray survivors)
        {
            selectedCount = survivors.Count(node => node is not null && !string.IsNullOrWhiteSpace(node.ToString()));
        }

        return $"survivor{Math.Clamp(selectedCount, 1, 4)}";
    }

    public void Dispose()
    {
        WeakReferenceMessenger.Default.UnregisterAll(this);
    }
}
