<#
  package_delivery_dev.ps1

  Builds the development Docker image (from Dockerfile.dev), saves it as a tar and
  packages a runtime docker-compose file so the target server doesn't rebuild or
  `npm install`.

  Result: artifact_dev\notinfi-dev.tar + docker-compose.dev.run.yml + README_delivery_dev.txt
#>

param(
  [string]$imageName = "notinfi-dev",
  [string]$artifactDir = "artifact_dev",
  [string]$tarName = "notinfi-dev.tar"
)

Write-Host "Preparing artifact folder: $artifactDir"
if (Test-Path $artifactDir) { Remove-Item $artifactDir -Recurse -Force }
New-Item -ItemType Directory -Path $artifactDir | Out-Null

Write-Host "Building dev image from Dockerfile.dev -> $imageName"
docker build -f Dockerfile.dev -t $imageName .
if ($LASTEXITCODE -ne 0) { throw "Docker build failed with exit code $LASTEXITCODE" }

Write-Host "Saving image to tar: $tarName"
docker save -o "$artifactDir\$tarName" $imageName
if ($LASTEXITCODE -ne 0) { throw "Docker save failed with exit code $LASTEXITCODE" }

Write-Host "Including runtime compose file in artifact"
if (Test-Path "docker-compose.dev.run.yml") {
  Copy-Item "docker-compose.dev.run.yml" "$artifactDir\docker-compose.dev.run.yml" -Force
} else {
  # create a minimal compose that references the saved image so the server won't build
  $compose = @'
version: "3.8"
services:
  web:
    image: notinfi-dev
    ports:
      - "4201:4201"
    restart: unless-stopped
'@
  Set-Content -Path "$artifactDir\docker-compose.dev.run.yml" -Value $compose -Encoding UTF8
}

Write-Host "Writing README_delivery_dev.txt"
$readme = @"
Dev environment delivery (artifact):

Files included:
  - $tarName : Docker image tar for the development image (notinfi-dev)
  - docker-compose.dev.run.yml : Compose file that references the preloaded image (no build)

Server steps (PowerShell):
  # copy artifact to server and extract (if zipped). Assuming artifact folder is present:
  docker load -i .\artifact_dev\$tarName
  docker-compose -f .\artifact_dev\docker-compose.dev.run.yml up -d

Notes:
  - The compose binds host port 4201 to container 4201 (ng serve inside container).
  - If your server is Linux, adapt paths accordingly and run the same docker commands.
"@

Set-Content -Path "$artifactDir\README_delivery_dev.txt" -Value $readme -Encoding UTF8

Write-Host "Dev artifact packaging complete: $artifactDir\$tarName"
