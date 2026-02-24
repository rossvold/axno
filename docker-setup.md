# Docker Setup Guide

This guide explains how to set up and use Docker for development in this SvelteKit project. All Node.js operations (pnpm install, pnpm dev, etc.) run exclusively inside Docker containers for security and isolation.

## Prerequisites

### 1. Install Docker

**Linux (Arch-based):**
```bash
sudo pacman -S docker docker-compose
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

**macOS:**
Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Verify installation:**
```bash
docker --version
docker compose version
```

### 2. Start Docker Service

**Linux:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**macOS:**
Docker Desktop should start automatically.

### 3. Verify Docker is Running

```bash
docker ps
```

If this command works without errors, Docker is running correctly.

## Initial Setup

### 1. Build the Development Container

From the project root directory:

```bash
docker compose build
```

This will:
- Build the development stage of the Dockerfile
- Install Node.js LTS and pnpm
- Install all project dependencies

### 2. Start the Development Container

```bash
docker compose up -d
```

This starts the container in detached mode. The container will keep running in the background.

### 3. Verify Container is Running

```bash
docker compose ps
```

You should see the `dev` service running.

## Development Workflow

### Running Commands Inside the Container

All Node.js and pnpm commands must be run inside the Docker container:

**Using docker compose exec:**
```bash
docker compose exec dev pnpm install
docker compose exec dev pnpm dev
docker compose exec dev pnpm build
docker compose exec dev pnpm test
```

**Using your tmux scripts:**
Your custom scripts (`tmux-docker-cmd`, `tmux-docker-shell`) will automatically:
- Check if the container is running
- Start it if needed
- Execute commands inside the container

Example:
```bash
tmux-docker-cmd pnpm install zod
tmux-docker-cmd pnpm dev
```

### Starting the Development Server

```bash
docker compose exec dev pnpm dev
```

Or use your tmux initializer:
```bash
tmux-docker-initializer
```

The dev server will be available at `http://localhost:3001`

### Accessing the Container Shell

**Interactive shell:**
```bash
docker compose exec dev sh
```

Or use your script:
```bash
tmux-docker-shell
```

Once inside the shell, you can run commands directly:
```bash
pnpm install
pnpm dev
pnpm build
```

### Installing New Dependencies

```bash
docker compose exec dev pnpm add package-name
```

Or:
```bash
tmux-docker-cmd pnpm add package-name
```

The `package.json` and `pnpm-lock.yaml` files are updated on your host machine, and the container will use the new dependencies.

## File System Behavior

### Source Code
- Your source code is **mounted as a volume** from the host
- Changes you make on the host are immediately visible in the container
- Hot reload works normally during development

### node_modules
- `node_modules` is bind-mounted (`./node_modules:/app/node_modules`)
- Installs still run inside Docker; the host just sees the files (useful for LSP)
- If you need to clear node_modules: `rm -rf node_modules` (on host) and then `docker compose exec dev npm install`

## Common Tasks

### View Container Logs

```bash
docker compose logs -f dev
```

### Stop the Container

```bash
docker compose down
```

### Restart the Container

```bash
docker compose restart dev
```

### Rebuild After Dockerfile Changes

```bash
docker compose build --no-cache
docker compose up -d
```

### Clean Up Everything

```bash
docker compose down -v  # Removes containers and volumes
docker system prune -a  # Removes all unused Docker resources (be careful!)
```

## Troubleshooting

### Container Won't Start

1. Check if port 3001 is already in use:
   ```bash
   lsof -i :3001
   ```
   If something is using it, either stop that process or change the port in `docker-compose.yml`

2. Check Docker logs:
   ```bash
   docker compose logs dev
   ```

3. Verify Docker is running:
   ```bash
   docker ps
   ```

### Permission Errors

If you see permission errors:

1. **Linux:** Ensure your user is in the docker group:
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

2. **File permissions:** If files created in the container have wrong permissions, you may need to adjust your umask or use a different user in the container.

### Dependencies Not Updating

If new dependencies aren't being recognized:

1. Rebuild the container:
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

2. Reinstall dependencies:
   ```bash
   docker compose exec dev pnpm install
   ```

### Container Keeps Stopping

Check the logs to see why:
```bash
docker compose logs dev
```

Common causes:
- Port conflicts
- Missing environment variables
- Build errors

## Integration with Your Workflow

### tmux-docker-cmd
This script automatically:
- Checks for `docker-compose.yml`
- Starts the container if not running
- Executes your command inside the container

Usage:
```bash
tmux-docker-cmd pnpm add zod
tmux-docker-cmd pnpm dev
```

### tmux-docker-shell
Drops you into an interactive shell inside the container:
```bash
tmux-docker-shell
```

### tmux-docker-initializer
Automatically starts the dev server when opening a new tmux window:
```bash
tmux-docker-initializer
```

## Security Benefits

Running Node.js exclusively in Docker provides:

1. **Isolation from host system** - npm/npm packages can't directly access your host filesystem
2. **Network isolation** - Container networking is separate from host
3. **Supply chain protection** - Malicious packages are contained within the container
4. **Reproducible environment** - Same Node.js version and dependencies across all machines

**Note:** This protects against supply chain attacks from npm packages, but:
- The Docker daemon itself must be trusted
- Volume mounts can still expose host filesystem
- You should still review package sources and use lock files

## Next Steps

Once Docker development is working:

1. Test your development workflow
2. Configure Kamal deployment (see `config/deploy.yml`)
3. Set up production secrets in `.kamal/secrets`
4. Deploy to your servers with `kamal setup`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Kamal Documentation](https://kamal-deploy.org/)



