# Run NEXGEN CRM locally

Needs Docker (on Windows: Docker Desktop, or Docker inside WSL).

```bash
# from the repo root: build the NEXGEN image (~20-40 min the first time)
docker buildx build -f packages/twenty-docker/nexgen/Dockerfile -t nexgen-crm:latest .

cd nexgen/local
cp .env.example .env    # then fill in the two secrets
docker compose up -d
```

Open http://localhost:3000 and create the first account (it becomes the workspace owner).

The worker shares the server's network (`network_mode: service:server`) because logic functions
call `SERVER_URL`, which is `http://localhost:3000` here.
