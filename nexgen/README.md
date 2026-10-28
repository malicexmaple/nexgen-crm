# NEXGEN CRM

NEXGEN Solutions' CRM, built on [Twenty](https://github.com/twentyhq/twenty) v2.52.0.

| Where | What |
|---|---|
| `packages/` | Twenty itself, with NEXGEN branding in `twenty-front` (name, icons, sign-in copy). Keep other changes small so Twenty updates merge cleanly. |
| `nexgen/apps/lead-engine/` | The lead engine app: Google Maps import, website scoring, sizing/pricing, AI pitch sites, Call queue and Lead pipeline views. See its README. |
| `nexgen/deploy/` | How the frontend reaches Railway (see below). |
| `nexgen/local/` | Run the whole CRM on your own machine with Docker. |
| `packages/twenty-docker/nexgen/Dockerfile` | Full production image (server + frontend), generated from Twenty's Dockerfile by `sync-dockerfile.sh`. |

## Production (Railway)

Project `nexgen-crm`: `nexgen-server` (public web), `nexgen-worker` (background jobs), `Postgres`, `Redis`, bucket `nexgen-files`.

Railway cannot compile all of Twenty within its build time limit, so the two app services deploy the
generated `railway-deploy` branch: Twenty's official server image plus the NEXGEN frontend.

To ship frontend/branding changes from `main`:

```bash
bash nexgen/deploy/publish-railway-frontend.sh   # needs Docker; Railway redeploys automatically
```

To ship lead-engine changes: `cd nexgen/apps/lead-engine && twenty app apply` (see its README).

Changing Twenty's **server** code breaks the overlay approach: build the full image
(`packages/twenty-docker/nexgen/Dockerfile`) in CI, push it to a registry, and point Railway at that image.

## Updating Twenty

```bash
git fetch upstream tag twenty/v2.53.0          # whichever release
git merge twenty/v2.53.0
bash packages/twenty-docker/nexgen/sync-dockerfile.sh
# bump ARG TWENTY_IMAGE in nexgen/deploy/railway/Dockerfile happens automatically on publish
```

## License

Twenty is AGPLv3. Changes to Twenty's code stay AGPL: if you give a modified CRM to clients, offer them
that source. Files marked `/* @license Enterprise */` need a Twenty Enterprise subscription in
production and are not used here. The lead engine app talks to Twenty through its public app API, so it
can stay proprietary.
