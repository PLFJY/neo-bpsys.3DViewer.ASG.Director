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
    private readonly PluginRuntimeContext _runtimeContext;
    private readonly ISharedDataService _sharedDataService;
    private readonly object _gate = new();
    private Dictionary<string, string>? _map;

    public CharacterModel3DModelIndexService(
        PluginRuntimeContext runtimeContext,
        ISharedDataService sharedDataService)
    {
        _runtimeContext = runtimeContext;
        _sharedDataService = sharedDataService;
    }

    public IReadOnlyDictionary<string, string> GetOfficialModelMap()
    {
        EnsureIndexed();
        return _map!;
    }

    public string GetOfficialModelUrl(string? roleName)
    {
        EnsureIndexed();
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return string.Empty;
        }

        var key = NormalizeKey(roleName);
        return _map!.TryGetValue(key, out var url) ? url : string.Empty;
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

            var result = new Dictionary<string, string>();
            IndexCamp("survivors", _sharedDataService.SurCharaDict.Values);
            IndexCamp("hunters", _sharedDataService.HunCharaDict.Values);
            _map = result;
            return;

            void IndexCamp(string folderName, IEnumerable<Character> characters)
            {
                var campRoot = Path.Combine(_runtimeContext.WwwRootFolder, folderName);
                if (!Directory.Exists(campRoot))
                {
                    return;
                }

                var folderLookup = Directory
                    .GetDirectories(campRoot)
                    .Select(path => new
                    {
                        FolderName = Path.GetFileName(path),
                        Url = GetRelativeModelUrl(folderName, path)
                    })
                    .Where(x => !string.IsNullOrWhiteSpace(x.Url))
                    .ToDictionary(x => NormalizeKey(x.FolderName), x => x, StringComparer.OrdinalIgnoreCase);

                foreach (var item in folderLookup.Values)
                {
                    TryAddAlias(item.FolderName, item.Url);
                }

                foreach (var character in characters)
                {
                    var folderNameFromImage = Path.GetFileNameWithoutExtension(character.ImageFileName ?? string.Empty);
                    if (string.IsNullOrWhiteSpace(folderNameFromImage))
                    {
                        continue;
                    }

                    if (!folderLookup.TryGetValue(NormalizeKey(folderNameFromImage), out var entry))
                    {
                        continue;
                    }

                    TryAddAlias(character.Name, entry.Url);
                    TryAddAlias(character.ImageFileName, entry.Url);
                    TryAddAlias(folderNameFromImage, entry.Url);
                }
            }

            void TryAddAlias(string? alias, string url)
            {
                var key = NormalizeKey(alias);
                if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(url))
                {
                    return;
                }

                result.TryAdd(key, url);
            }
        }
    }

    private static string GetRelativeModelUrl(string campFolder, string physicalFolder)
    {
        var directoryName = Path.GetFileName(physicalFolder);
        if (string.IsNullOrWhiteSpace(directoryName))
        {
            return string.Empty;
        }

        var files = Directory.GetFiles(physicalFolder)
            .Where(file =>
            {
                var ext = Path.GetExtension(file).ToLowerInvariant();
                return ext is ".gltf" or ".glb";
            })
            .ToList();

        if (files.Count == 0)
        {
            return string.Empty;
        }

        var preferred = files.FirstOrDefault(file =>
                            Path.GetFileNameWithoutExtension(file).Equals(
                                directoryName,
                                StringComparison.OrdinalIgnoreCase))
                        ?? files[0];

        return "/" + campFolder + "/" + EncodePathSegment(directoryName) + "/" + EncodePathSegment(Path.GetFileName(preferred));
    }

    private static string EncodePathSegment(string value)
    {
        return Uri.EscapeDataString(value);
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
