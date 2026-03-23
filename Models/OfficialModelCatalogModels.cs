namespace neo_bpsys_wpf._3DViewerIDV.Models;

public sealed record OfficialModelCatalogEntry(
    string Name,
    string RawName,
    string ModelUrl,
    string LocalFolderName,
    string FileName);

public sealed record OfficialModelDownloadStatus(
    int Total,
    int Downloaded,
    bool Complete);

public sealed record OfficialModelDownloadProgress(
    int Current,
    int Total,
    string RoleName,
    int Progress,
    int Overall);

public sealed record OfficialModelPrepareResult(
    bool Success,
    int Total,
    int Downloaded,
    int Skipped,
    string? Error = null);
