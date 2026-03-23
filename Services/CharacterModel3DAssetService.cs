using neo_bpsys_wpf._3DViewerIDV.Models;
using System;
using System.IO;
using System.Linq;

namespace neo_bpsys_wpf._3DViewerIDV.Services;

public sealed class CharacterModel3DAssetService
{
    private readonly PluginRuntimeContext _runtimeContext;

    public CharacterModel3DAssetService(PluginRuntimeContext runtimeContext)
    {
        _runtimeContext = runtimeContext;
        Directory.CreateDirectory(_runtimeContext.AssetsFolder);
    }

    public AssetImportResult ImportAsset(string sourcePath, string? copyMode = "auto")
    {
        var rawPath = sourcePath?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(rawPath))
        {
            throw new FileNotFoundException("Source path is empty.");
        }

        if (IsWebPath(rawPath))
        {
            return new AssetImportResult(rawPath, false, "passthrough");
        }

        if (!File.Exists(rawPath))
        {
            throw new FileNotFoundException("Source file not found.", rawPath);
        }

        var ext = Path.GetExtension(rawPath).ToLowerInvariant();
        var mode = ResolveCopyMode(copyMode, ext);
        var category = GetAssetCategory(ext);
        var categoryRoot = Path.Combine(_runtimeContext.AssetsFolder, category);
        Directory.CreateDirectory(categoryRoot);

        if (mode == "folder")
        {
            var sourceDirectory = Path.GetDirectoryName(rawPath)
                                  ?? throw new DirectoryNotFoundException(rawPath);
            var targetDirectory = Path.Combine(
                categoryRoot,
                $"{SanitizeFileName(Path.GetFileNameWithoutExtension(rawPath))}_{Guid.NewGuid():N}"
            );
            CopyDirectory(sourceDirectory, targetDirectory);
            var copiedFilePath = Path.Combine(targetDirectory, Path.GetFileName(rawPath));
            return new AssetImportResult(ToAssetsUrl(copiedFilePath), true, "folder");
        }

        var targetFileName = $"{SanitizeFileName(Path.GetFileNameWithoutExtension(rawPath))}_{Guid.NewGuid():N}{ext}";
        var targetFilePath = Path.Combine(categoryRoot, targetFileName);
        File.Copy(rawPath, targetFilePath, true);
        return new AssetImportResult(ToAssetsUrl(targetFilePath), true, "file");
    }

    private string ToAssetsUrl(string physicalPath)
    {
        var relative = Path.GetRelativePath(_runtimeContext.AssetsFolder, physicalPath)
            .Replace(Path.DirectorySeparatorChar, '/');
        return "/user-assets/" + string.Join('/', relative.Split('/').Select(Uri.EscapeDataString));
    }

    private static string ResolveCopyMode(string? copyMode, string extension)
    {
        if (string.Equals(copyMode, "folder", StringComparison.OrdinalIgnoreCase))
        {
            return "folder";
        }

        if (string.Equals(copyMode, "file", StringComparison.OrdinalIgnoreCase))
        {
            return "file";
        }

        return extension is ".gltf" or ".obj" or ".mtl" ? "folder" : "file";
    }

    private static string GetAssetCategory(string extension)
    {
        return extension switch
        {
            ".mp4" or ".webm" or ".ogg" or ".mov" or ".m4v" => "videos",
            ".gltf" or ".glb" or ".obj" or ".mtl" or ".fbx" => "models",
            _ => "misc"
        };
    }

    private static bool IsWebPath(string path)
    {
        return path.StartsWith("/", StringComparison.Ordinal)
               || path.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
               || path.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
               || path.StartsWith("data:", StringComparison.OrdinalIgnoreCase)
               || path.StartsWith("blob:", StringComparison.OrdinalIgnoreCase);
    }

    private static void CopyDirectory(string sourceDirectory, string destinationDirectory)
    {
        Directory.CreateDirectory(destinationDirectory);

        foreach (var file in Directory.GetFiles(sourceDirectory, "*", SearchOption.AllDirectories))
        {
            var relative = Path.GetRelativePath(sourceDirectory, file);
            var target = Path.Combine(destinationDirectory, relative);
            Directory.CreateDirectory(Path.GetDirectoryName(target)!);
            File.Copy(file, target, true);
        }
    }

    private static string SanitizeFileName(string fileName)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var sanitized = new string(fileName.Select(ch => invalid.Contains(ch) ? '_' : ch).ToArray());
        return string.IsNullOrWhiteSpace(sanitized) ? "asset" : sanitized;
    }
}

public sealed record AssetImportResult(string Path, bool Copied, string Mode);
