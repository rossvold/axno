# Quick Start Guide - First Time Setup

This guide will get you up and running with Docker development in under 5 minutes.

**Note:** This setup uses pnpm inside Docker.

## Prerequisites Check

First, verify Docker is installed and running:

```bash
docker --version
docker compose version
docker ps
```

If any of these fail, see the "Prerequisites" section in `docker-setup.md`.

## Step-by-Step First Time Setup

### 1. Navigate to Project Directory

```bash
cd /home/rossvold/work/bankid_portal/sveltekit
# TODO: update this path to your actual project directory
```

### 2. Build and Install Dependencies (First Time Only)

**You do NOT need to run `pnpm install` on your host machine!** Everything happens inside Docker.

```bash
# Build the development container (installs deps with pnpm)
docker compose build
```

This will:
- Download Node.js LTS image (pnpm is included via corepack)
- Install all project dependencies from `package.json` (inside the container)
- Generate `pnpm-lock.yaml` if it doesn't exist (will be visible on your host)

**Note:**
- This may take a few minutes the first time
- The `pnpm-lock.yaml` file will be created in your project directory after the first build
- You never need Node.js or pnpm installed on your host machine

### 3. Start the Container

```bash
# Start the container in detached mode (runs in background)
docker compose up -d
```

### 4. Verify Container is Running

```bash
docker compose ps
```

You should see the `dev` service with status "Up".

### 5. Install Dependencies (if needed)

If dependencies weren't fully installed during build, or if you've updated `package.json`:

```bash
docker compose exec dev pnpm install
```

### 6. Start Development Server

**Option A: Using docker compose directly**
```bash
docker compose exec dev pnpm dev
```

**Option B: Using your tmux script**
```bash
tmux-docker-cmd pnpm dev
```

**Option C: Using tmux initializer (recommended)**
```bash
tmux-docker-initializer
```

The dev server will start and be available at: **http://localhost:3001**

### 7. Verify Everything Works

1. Open your browser to `http://localhost:3001`
2. You should see your SvelteKit app
3. Make a change to any `.svelte` file
4. The page should hot-reload automatically

## Common First-Time Issues

### Issue: "Cannot connect to Docker daemon"

**Solution:**
```bash
# Start Docker service (Linux)
sudo systemctl start docker

# Add your user to docker group (Linux)
sudo usermod -aG docker $USER
# Then log out and back in
```

### Issue: "Port 3001 is already in use"

**Solution:**
```bash
# Find what's using the port
lsof -i :3001

# Kill the process or change the port in docker-compose.yml
```

### Issue: "Container keeps stopping"

**Solution:**
```bash
# Check the logs
docker compose logs dev

# Common causes:
# - Missing environment variables
# - Build errors
# - Port conflicts
```

### Issue: "Permission denied" errors

**Solution:**
```bash
# Ensure you're in the docker group (Linux)
groups | grep docker

# If not, add yourself:
sudo usermod -aG docker $USER
# Log out and back in
```

## Daily Workflow (After First Setup)

Once everything is set up, your daily workflow is simple:

1. **Start container** (if not running):
   ```bash
   docker compose up -d
   ```

2. **Run commands** using your tmux scripts:
   ```bash
   tmux-docker-cmd pnpm dev       # Start dev server
   tmux-docker-cmd pnpm add zod   # Add a package
   tmux-docker-cmd pnpm build     # Build for production
   ```

3. **Access shell** when needed:
   ```bash
   tmux-docker-shell
   ```

4. **Stop container** when done:
   ```bash
   docker compose down
   ```

## What's Happening Behind the Scenes

- **Source code** is mounted from your host → container (hot reload works)
- **node_modules** is bind-mounted (`./node_modules:/app/node_modules`) for LSP; installs still run in Docker
- **All Node.js/pnpm commands** run inside the container
- **Port 3001** is forwarded from container → host

## Next Steps

- Read `docker-setup.md` for detailed documentation
- Configure Kamal deployment (see `config/deploy.yml`)
- Set up production secrets (see `.kamal/secrets`)

## Quick Reference

```bash
# Build container
docker compose build

# Start container
docker compose up -d

# Stop container
docker compose down

# View logs
docker compose logs -f dev

# Run command in container
docker compose exec dev pnpm <command>

# Access shell
docker compose exec dev sh

# Rebuild after Dockerfile changes
docker compose build --no-cache
docker compose up -d
```


