# Docker - Instrucciones de entrega de la imagen (dev)

Este documento explica cómo descargar, cargar y ejecutar la imagen de desarrollo que generamos como artifact (`frontapp-dev.tar`) y cómo usar los `docker-compose` incluidos en el repo.

Contenido entregado
- `frontapp-dev.tar` — imagen dev exportada en formato tar (generada por GitHub Actions).  
- `docker-compose.dev.run.yml` — Compose para ejecutar la imagen dev ya construida (`frontapp-dev:latest`).
- `docker-compose.prod.yml` — Compose para ejecutar la imagen prod (`frontapp-prod:latest`) si se genera.
- `Dockerfile.dev`, `Dockerfile.prod` — Dockerfiles usados para construir las imágenes (informativo).

Pre-requisitos
- Docker (Engine) instalado en la máquina destino. Para Windows es recomendable usar Docker Desktop (con WSL2).  
- Opcional: `docker compose` (plugin v2). Si no está disponible, se puede usar `docker-compose` (v1) con sintaxis similar.

1) Descargar el artifact desde GitHub Actions

- Ir al repositorio en GitHub → pestaña **Actions** → seleccionar el workflow "Build dev Docker image and upload tar".  
- Abrir el run más reciente y descargar el artifact llamado `frontapp-dev-tar` (contiene `frontapp-dev.tar`).

2) Cargar la imagen en el host (PowerShell)

```powershell
# desde la carpeta donde guardaste frontapp-dev.tar
docker load -i .\frontapp-dev.tar
```

Comando equivalente en Linux/macOS:

```bash
docker load -i ./frontapp-dev.tar
```

3) Ejecutar la imagen con docker compose (modo recomendado)

Usando el `docker-compose` preparado para ejecutar la imagen:

PowerShell:

```powershell
docker compose -f docker-compose.dev.run.yml up -d
docker logs -f frontapp-dev
```

Linux/macOS:

```bash
docker compose -f docker-compose.dev.run.yml up -d
docker logs -f frontapp-dev
```

Si el sistema solo tiene la versión legacy `docker-compose` (v1):

```powershell
docker-compose -f docker-compose.dev.run.yml up -d
docker-compose logs -f frontapp-dev
```

4) Alternativa: ejecutar con `docker run`

Si no quieres usar compose, puedes ejecutar directamente la imagen:

```powershell
docker run --rm -it -p 4200:4200 frontapp-dev:latest
```

5) Notas importantes y troubleshooting

- Binarios nativos: la imagen construida en GitHub Actions (ubuntu-latest) contiene `node_modules` compilados para Linux. Ejecutar la imagen en Windows sin WSL2 puede provocar errores si hay módulos nativos. La solución: ejecutar en host Linux o Docker Desktop con WSL2.
- Tamaño: la imagen dev incluye `devDependencies` y el código fuente; puede ser grande. Tenlo en cuenta al transferir el tar.
- Montajes y `node_modules`: si se monta el directorio del proyecto sobre `/app` en el contenedor se sobrescribe lo que hay dentro, incluyendo `node_modules`. Si el receptor quiere mapear su código para desarrollo, use el patrón:

```yaml
volumes:
  - ./path/to/code:/app:delegated
  - /app/node_modules
```

De este modo se preservan los `node_modules` dentro del contenedor y se permite hot-reload.

- Variables de entorno: si la app requiere variables de entorno o archivos de configuración, pásalos con `-e` o usando un archivo `.env` y `env_file` en compose. No incluyas secretos en el repo.

6) Entrega alternativa: subir la imagen a un registry

Si prefieres no transmitir un `.tar`, puedes publicar la imagen en un registry (Docker Hub o GitHub Container Registry). Entonces el receptor solo necesitaría ejecutar `docker pull <registry>/frontapp-dev:tag` y `docker compose up`. Puedo ayudarte a ajustar el workflow para empujar la imagen al registry si quieres.

7) Verificaciones rápidas

- Comprobar que la imagen existe localmente:

```powershell
docker images | Select-String frontapp-dev
```

- Inspeccionar size y capas:

```bash
docker image inspect frontapp-dev:latest --format '{{.Size}}'
```

8) Preguntas frecuentes

- Q: ¿La imagen incluye todas las dependencias?  
  A: Sí — `Dockerfile.dev` ejecuta `npm ci` durante el build, por lo que la imagen contiene `node_modules` con las dependencias listadas en `package-lock.json`.

- Q: ¿Pueden ejecutar la imagen en Windows nativo?  
  A: Es posible, pero si la imagen contiene módulos nativos compilados para Linux, pueden tener problemas. Recomendado usar Docker Desktop + WSL2 o un host Linux.

--