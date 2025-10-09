<#
  Packaging script for Windows (PowerShell).
  Builds the production image locally, then saves it to a tar file and copies compose files
  into a folder ready to be uploaded as a single artifact (e.g., GitHub Actions artifact).
#>

param(
  [string]$imageName = "asi-web:prod",
  [string]$artifactDir = "artifact",
  [string]$tarName = "asi-web-prod.tar"
)

Write-Host "Cleaning previous artifact folder..."
if (Test-Path $artifactDir) { Remove-Item $artifactDir -Recurse -Force }
New-Item -ItemType Directory -Path $artifactDir | Out-Null

Write-Host "Building production Docker image: $imageName"
docker build -f Dockerfile.prod -t $imageName .
if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }

Write-Host "Saving image to tar: $tarName"
docker save -o "$artifactDir\$tarName" $imageName
if ($LASTEXITCODE -ne 0) { throw "Docker save failed" }

Write-Host "Copying compose files and README to artifact folder"
Copy-Item docker-compose.prod.yml $artifactDir -Force
Copy-Item docker-compose.dev.run.yml $artifactDir -Force
Copy-Item Dockerfile.prod $artifactDir -Force

$readme = @"
Delivery contents:
  - $tarName : Docker image tar. On the target server run `docker load -i $tarName` to import the image.
  - docker-compose.prod.yml : Compose file referencing the image tag used by this tar. The application is mapped to host port 4201.

Example server steps (PowerShell):
  Expand-Archive artifact.zip -DestinationPath ./artifact; docker load -i ./artifact/$tarName; docker-compose -f ./artifact/docker-compose.prod.yml up -d

Notes:
  - The app will be served on host port 4201. If you run the dev container instead, it will expose port 4201 for ng serve.
"@

Set-Content -Path "$artifactDir\README_delivery.txt" -Value $readme

Write-Host "Packaging complete. Artifact directory: $artifactDir"
