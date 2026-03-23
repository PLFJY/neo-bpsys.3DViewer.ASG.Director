using neo_bpsys_wpf._3DViewerIDV.Models;
using neo_bpsys_wpf.Core.Abstractions.Services;
using neo_bpsys_wpf.Core.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DModelIndexService
{
    private readonly ISharedDataService _sharedDataService;
    private readonly CharacterModel3DOfficialModelService _officialModelService;
    private readonly object _gate = new();
    private Dictionary<string, OfficialModelCatalogEntry>? _map;

    public CharacterModel3DModelIndexService(
        ISharedDataService sharedDataService,
        CharacterModel3DOfficialModelService officialModelService)
    {
        _sharedDataService = sharedDataService;
        _officialModelService = officialModelService;
    }

    public IReadOnlyDictionary<string, string> GetOfficialModelMap()
    {
        EnsureIndexed();
        return _map!.ToDictionary(
            item => item.Key,
            item => _officialModelService.GetServedModelPath(item.Value),
            StringComparer.OrdinalIgnoreCase);
    }

    public string GetOfficialModelUrl(string? roleName)
    {
        EnsureIndexed();
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return string.Empty;
        }

        var key = NormalizeKey(roleName);
        return _map!.TryGetValue(key, out var entry)
            ? _officialModelService.GetServedModelPath(entry)
            : string.Empty;
    }

    private void EnsureIndexed()
    {
        if (_map != null)
        {
            return;
        }

        lock (_gate)
        {
            if (_map != null)
            {
                return;
            }

            var result = new Dictionary<string, OfficialModelCatalogEntry>(StringComparer.OrdinalIgnoreCase);
            var catalogLookup = _officialModelService.GetCatalogEntries()
                .SelectMany(entry => BuildAliases(entry).Select(alias => new KeyValuePair<string, OfficialModelCatalogEntry>(alias, entry)))
                .GroupBy(item => item.Key, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(group => group.Key, group => group.First().Value, StringComparer.OrdinalIgnoreCase);

            foreach (var entry in catalogLookup.Values.Distinct())
            {
                foreach (var alias in BuildAliases(entry))
                {
                    TryAddAlias(alias, entry);
                }
            }

            IndexCharacters(_sharedDataService.SurCharaDict.Values);
            IndexCharacters(_sharedDataService.HunCharaDict.Values);
            _map = result;
            return;

            void IndexCharacters(IEnumerable<Character> characters)
            {
                foreach (var character in characters)
                {
                    if (character == null)
                    {
                        continue;
                    }

                    var candidates = new[]
                    {
                        character.Name,
                        character.ImageFileName,
                        Path.GetFileNameWithoutExtension(character.ImageFileName ?? string.Empty)
                    };

                    foreach (var candidate in candidates)
                    {
                        var normalized = NormalizeKey(candidate);
                        if (string.IsNullOrWhiteSpace(normalized))
                        {
                            continue;
                        }

                        if (!catalogLookup.TryGetValue(normalized, out var entry))
                        {
                            continue;
                        }

                        foreach (var alias in candidates)
                        {
                            TryAddAlias(alias, entry);
                        }

                        foreach (var alias in BuildAliases(entry))
                        {
                            TryAddAlias(alias, entry);
                        }
                        break;
                    }
                }
            }

            void TryAddAlias(string? alias, OfficialModelCatalogEntry entry)
            {
                var key = NormalizeKey(alias);
                if (string.IsNullOrWhiteSpace(key))
                {
                    return;
                }

                result.TryAdd(key, entry);
            }
        }
    }

    private static IEnumerable<string> BuildAliases(OfficialModelCatalogEntry entry)
    {
        yield return entry.Name;
        if (!string.Equals(entry.RawName, entry.Name, StringComparison.OrdinalIgnoreCase))
        {
            yield return entry.RawName;
        }
    }

    private static string NormalizeKey(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? string.Empty
            : value.Replace(".png", "", StringComparison.OrdinalIgnoreCase)
                .Replace("\"", "")
                .Replace("“", "")
                .Replace("”", "")
                .Replace("'", "")
                .Trim()
                .ToLowerInvariant();
    }
}
