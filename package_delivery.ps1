<#
package_delivery.ps1
Usa este script para crear un ZIP listo para entregar que incluya:
 - frontapp-dev.tar (ruta pasada como parámetro o ubicada en el directorio actual)
 - docker-compose.dev.run.yml
 - Dockerfile.dev
 - Dockerfile.prod
 - README_docker.md
 - .dockerignore

Uso:
 PowerShell> .\package_delivery.ps1 -TarPath .\frontapp-dev.tar

Si no se proporciona -TarPath, el script buscará `frontapp-dev.tar` en el directorio actual.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$TarPath = "artifact_dev\notinfi-dev.tar",
    [Parameter(Mandatory=$false)]
    [string]$OutName = $("srd-front-delivery-{0}.zip" -f (Get-Date -Format yyyyMMdd_HHmm))
)

Write-Host "Creating delivery package..."

if (-Not (Test-Path $TarPath)) {
    Write-Error "Tar file not found at '$TarPath'. Download the artifact from GitHub Actions and place it here, or pass -TarPath with the full path."
    exit 1
}

$files = @(
    $TarPath,
    'docker-compose.dev.run.yml',
    'docker-compose.dev.yml',
    'Dockerfile.dev',
    'Dockerfile.prod',
    'README_docker.md',
    '.dockerignore'
)

$existing = $files | Where-Object { Test-Path $_ }

if ($existing.Count -eq 0) {
    Write-Error "No files found to include in the package."
    exit 1
}

Write-Host "Files to include:`n$($existing -join "`n")"

if (Test-Path $OutName) {
    Remove-Item $OutName -Force
}

Compress-Archive -Path $existing -DestinationPath $OutName -Force

Write-Host "Package created: $OutName"
Write-Host "Deliver this ZIP to the target team; they can run 'docker load -i artifact_dev\notinfi-dev.tar' and then 'docker compose -f docker-compose.dev.run.yml up -d --no-build'"
