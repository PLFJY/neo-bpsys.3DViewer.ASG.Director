using neo_bpsys_wpf._3DViewerIDV.Models;
using System;
using System.Collections.Generic;
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

    public AssetImportResult ImportUploadedFiles(
        IReadOnlyCollection<UploadedBrowserFile> files,
        string? entryRelativePath,
        string? copyMode = "auto")
    {
        if (files == null || files.Count == 0)
        {
            throw new FileNotFoundException("Uploaded files are empty.");
        }

        var normalizedEntryPath = NormalizeRelativePath(entryRelativePath);
        var entryFile = files.FirstOrDefault(file =>
            string.Equals(NormalizeRelativePath(file.RelativePath), normalizedEntryPath, StringComparison.OrdinalIgnoreCase)
            || string.Equals(file.FileName, Path.GetFileName(normalizedEntryPath), StringComparison.OrdinalIgnoreCase))
            ?? files.First();

        var ext = Path.GetExtension(entryFile.FileName).ToLowerInvariant();
        var category = GetAssetCategory(ext);
        var categoryRoot = Path.Combine(_runtimeContext.AssetsFolder, category);
        Directory.CreateDirectory(categoryRoot);

        var requiresFolderMode = files.Count > 1
                                 || files.Any(file => NormalizeRelativePath(file.RelativePath).Contains('/'));
        var mode = ResolveCopyMode(copyMode, ext);
        if (requiresFolderMode && string.Equals(mode, "file", StringComparison.OrdinalIgnoreCase))
        {
            mode = "folder";
        }

        if (mode == "folder")
        {
            var targetDirectory = Path.Combine(
                categoryRoot,
                $"{SanitizeFileName(Path.GetFileNameWithoutExtension(entryFile.FileName))}_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetDirectory);

            foreach (var file in files)
            {
                var relativePath = NormalizeRelativePath(file.RelativePath);
                if (string.IsNullOrWhiteSpace(relativePath))
                {
                    relativePath = file.FileName;
                }

                var targetPath = Path.Combine(targetDirectory, relativePath.Replace('/', Path.DirectorySeparatorChar));
                Directory.CreateDirectory(Path.GetDirectoryName(targetPath)!);
                File.WriteAllBytes(targetPath, file.Bytes);
            }

            var normalizedEntry = NormalizeRelativePath(entryFile.RelativePath);
            if (string.IsNullOrWhiteSpace(normalizedEntry))
            {
                normalizedEntry = entryFile.FileName;
            }

            var copiedFilePath = Path.Combine(targetDirectory, normalizedEntry.Replace('/', Path.DirectorySeparatorChar));
            return new AssetImportResult(ToAssetsUrl(copiedFilePath), true, "folder");
        }

        var targetFileName = $"{SanitizeFileName(Path.GetFileNameWithoutExtension(entryFile.FileName))}_{Guid.NewGuid():N}{ext}";
        var targetFilePath = Path.Combine(categoryRoot, targetFileName);
        File.WriteAllBytes(targetFilePath, entryFile.Bytes);
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

    private static string NormalizeRelativePath(string? path)
    {
        var normalized = (path ?? string.Empty).Trim().Replace('\\', '/').Trim('/');
        while (normalized.StartsWith("../", StringComparison.Ordinal))
        {
            normalized = normalized[3..];
        }

        return normalized;
    }
}

public sealed record AssetImportResult(string Path, bool Copied, string Mode);

public sealed record UploadedBrowserFile(string FileName, string RelativePath, byte[] Bytes);
