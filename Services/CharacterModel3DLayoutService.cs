using neo_bpsys_wpf._3DViewerIDV.Models;
using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DLayoutService
{
    private static readonly JsonSerializerOptions WriteOptions = new()
    {
        WriteIndented = true
    };

    private readonly object _gate = new();
    private readonly string _layoutPath;
    private JsonNode? _cachedLayout;
    private bool _loaded;

    public CharacterModel3DLayoutService(PluginRuntimeContext runtimeContext)
    {
        Directory.CreateDirectory(runtimeContext.PluginConfigFolder);
        _layoutPath = Path.Combine(runtimeContext.PluginConfigFolder, "CharacterModel3DLayout.json");
    }

    public event Action<CharacterModel3DLayoutChangedEvent>? LayoutChanged;

    public JsonNode? GetLayout()
    {
        lock (_gate)
        {
            EnsureLoaded();
            return CloneNode(_cachedLayout);
        }
    }

    public void SaveLayout(JsonNode? layout, string? origin = null)
    {
        JsonNode? clonedLayout = CloneNode(layout);

        lock (_gate)
        {
            _cachedLayout = clonedLayout;
            _loaded = true;
            File.WriteAllText(
                _layoutPath,
                clonedLayout?.ToJsonString(WriteOptions) ?? "null",
                Encoding.UTF8
            );
        }

        LayoutChanged?.Invoke(new CharacterModel3DLayoutChangedEvent(origin, CloneNode(clonedLayout)));
    }

    private void EnsureLoaded()
    {
        if (_loaded)
        {
            return;
        }

        _loaded = true;
        if (!File.Exists(_layoutPath))
        {
            _cachedLayout = null;
            return;
        }

        var json = File.ReadAllText(_layoutPath, Encoding.UTF8);
        _cachedLayout = string.IsNullOrWhiteSpace(json) ? null : JsonNode.Parse(json);
    }

    private static JsonNode? CloneNode(JsonNode? node)
    {
        return node is null ? null : JsonNode.Parse(node.ToJsonString());
    }
}

public sealed record CharacterModel3DLayoutChangedEvent(string? Origin, JsonNode? Layout);
