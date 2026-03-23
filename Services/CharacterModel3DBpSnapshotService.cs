using neo_bpsys_wpf.Core.Abstractions.Services;
using neo_bpsys_wpf.Core.Models;
using System;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DBpSnapshotService : IDisposable
{
    private readonly ISharedDataService _sharedDataService;
    private Game? _currentGame;

    public CharacterModel3DBpSnapshotService(ISharedDataService sharedDataService)
    {
        _sharedDataService = sharedDataService;

        _sharedDataService.CurrentGameChanged += OnSharedDataChanged;
        _sharedDataService.TeamSwapped += OnSharedDataChanged;
        _sharedDataService.PickedMapChanged += OnSharedDataChanged;
        _sharedDataService.MapV2BannedChanged += OnSharedDataChanged;

        AttachGame(_sharedDataService.CurrentGame);
    }

    public event Action<JsonObject>? StateChanged;

    public JsonObject GetSnapshot()
    {
        var game = _sharedDataService.CurrentGame;
        var survivors = new JsonArray();
        foreach (var player in game.SurPlayerList.Take(4))
        {
            survivors.Add(ToJsonValue(player.Character?.Name));
        }
        while (survivors.Count < 4)
        {
            survivors.Add(null);
        }

        var hunterBannedSurvivors = ToNameArray(game.CurrentSurBannedList);
        var survivorBannedHunters = ToNameArray(game.CurrentHunBannedList);
        var globalBannedSurvivors = ToNameArray(game.SurTeam.GlobalBannedSurRecordList);
        var globalBannedHunters = ToNameArray(game.HunTeam.GlobalBannedHunRecordList);

        return new JsonObject
        {
            ["survivors"] = survivors,
            ["hunter"] = ToJsonValue(game.HunPlayer.Character?.Name),
            ["hunterBannedSurvivors"] = hunterBannedSurvivors,
            ["survivorBannedHunters"] = survivorBannedHunters,
            ["globalBannedSurvivors"] = globalBannedSurvivors,
            ["globalBannedHunters"] = globalBannedHunters,
            ["pickedMap"] = ToJsonValue(game.PickedMap?.ToString()),
            ["bannedMap"] = ToJsonValue(game.BannedMap?.ToString()),
            ["currentRoundData"] = new JsonObject
            {
                ["selectedSurvivors"] = survivors.DeepClone(),
                ["selectedHunter"] = ToJsonValue(game.HunPlayer.Character?.Name),
                ["hunterBannedSurvivors"] = hunterBannedSurvivors.DeepClone(),
                ["survivorBannedHunters"] = survivorBannedHunters.DeepClone()
            }
        };
    }

    public void PublishCurrentSnapshot()
    {
        StateChanged?.Invoke(GetSnapshot());
    }

    private void OnSharedDataChanged(object? sender, EventArgs e)
    {
        AttachGame(_sharedDataService.CurrentGame, true);
        PublishCurrentSnapshot();
    }

    private void AttachGame(Game game, bool forceRefresh = false)
    {
        if (ReferenceEquals(_currentGame, game) && !forceRefresh)
        {
            return;
        }

        if (_currentGame != null)
        {
            DetachGame(_currentGame);
        }

        _currentGame = game;

        if (_currentGame == null)
        {
            return;
        }

        _currentGame.PropertyChanged += OnGamePropertyChanged;
        _currentGame.CurrentSurBannedList.CollectionChanged += OnCollectionChanged;
        _currentGame.CurrentHunBannedList.CollectionChanged += OnCollectionChanged;
        _currentGame.SurTeam.GlobalBannedSurRecordList.CollectionChanged += OnCollectionChanged;
        _currentGame.HunTeam.GlobalBannedHunRecordList.CollectionChanged += OnCollectionChanged;

        foreach (var player in _currentGame.SurPlayerList)
        {
            player.PropertyChanged += OnPlayerPropertyChanged;
        }

        _currentGame.HunPlayer.PropertyChanged += OnPlayerPropertyChanged;
    }

    private void DetachGame(Game game)
    {
        game.PropertyChanged -= OnGamePropertyChanged;
        game.CurrentSurBannedList.CollectionChanged -= OnCollectionChanged;
        game.CurrentHunBannedList.CollectionChanged -= OnCollectionChanged;
        game.SurTeam.GlobalBannedSurRecordList.CollectionChanged -= OnCollectionChanged;
        game.HunTeam.GlobalBannedHunRecordList.CollectionChanged -= OnCollectionChanged;

        foreach (var player in game.SurPlayerList)
        {
            player.PropertyChanged -= OnPlayerPropertyChanged;
        }

        game.HunPlayer.PropertyChanged -= OnPlayerPropertyChanged;
    }

    private void OnPlayerPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(Player.Character))
        {
            PublishCurrentSnapshot();
        }
    }

    private void OnGamePropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(Game.PickedMap) or nameof(Game.BannedMap) or nameof(Game.GameProgress))
        {
            PublishCurrentSnapshot();
        }
    }

    private void OnCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        PublishCurrentSnapshot();
    }

    private static JsonArray ToNameArray(IEnumerable<Character?> source)
    {
        var array = new JsonArray();
        foreach (var item in source)
        {
            array.Add(ToJsonValue(item?.Name));
        }

        return array;
    }

    private static JsonNode? ToJsonValue(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : JsonValue.Create(value);
    }

    public void Dispose()
    {
        _sharedDataService.CurrentGameChanged -= OnSharedDataChanged;
        _sharedDataService.TeamSwapped -= OnSharedDataChanged;
        _sharedDataService.PickedMapChanged -= OnSharedDataChanged;
        _sharedDataService.MapV2BannedChanged -= OnSharedDataChanged;

        if (_currentGame != null)
        {
            DetachGame(_currentGame);
        }
    }
}
