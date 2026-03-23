param(
    [string]$SourcePath = "",
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pluginRoot = Split-Path -Parent $scriptRoot

if ([string]::IsNullOrWhiteSpace($SourcePath)) {
    $SourcePath = Join-Path $pluginRoot "..\..\ASG.Director\extracted_roles.json"
}

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $pluginRoot "Data\OfficialModelCatalog.json"
}

function Normalize-Name([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) { return "" }
    return ([string]$Value).
        Replace('"', '').
        Replace("'", '').
        Replace('“', '').
        Replace('”', '').
        Replace('‘', '').
        Replace('’', '').
        Trim()
}

function Sanitize-Segment([string]$Value) {
    $normalized = Normalize-Name $Value
    if ([string]::IsNullOrWhiteSpace($normalized)) { return "role" }
    $sanitized = $normalized -replace '[\\/:*?<>|]', '_'
    if ([string]::IsNullOrWhiteSpace($sanitized)) { return "role" }
    return $sanitized
}

if (-not (Test-Path $SourcePath)) {
    throw "Source file not found: $SourcePath"
}

$raw = Get-Content $SourcePath -Raw -Encoding UTF8 | ConvertFrom-Json
$items = @()
$allRoles = @()
if ($raw.survivors) { $allRoles += $raw.survivors }
if ($raw.hunters) { $allRoles += $raw.hunters }

foreach ($role in $allRoles) {
    if (-not $role) { continue }
    $rawName = if ($role.zy) { [string]$role.zy } else { [string]$role.name }
    $name = Normalize-Name $rawName
    $modelUrl = [string]$role.model
    if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($modelUrl)) { continue }

    try {
        $uri = [Uri]$modelUrl
        $fileName = [System.IO.Path]::GetFileName($uri.AbsolutePath)
        if ([string]::IsNullOrWhiteSpace($fileName)) { continue }

        $items += [pscustomobject]@{
            name            = $name
            rawName         = $rawName
            modelUrl        = $modelUrl
            localFolderName = (Sanitize-Segment $name)
            fileName        = $fileName
        }
    }
    catch {
        continue
    }
}

$unique = $items |
    Group-Object name, modelUrl |
    ForEach-Object { $_.Group[0] } |
    Sort-Object name

$outputObject = [pscustomobject]@{
    generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
    entries     = $unique
}

$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$outputObject | ConvertTo-Json -Depth 5 | Set-Content -Path $OutputPath -Encoding UTF8
Write-Host "Official model catalog written to $OutputPath"
