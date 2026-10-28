# railway-deploy

Generated branch. Do not edit or merge it: `nexgen/deploy/publish-railway-frontend.sh` on `main`
rebuilds it from scratch (single commit, force-pushed) every time the frontend is published.

It holds the NEXGEN-built frontend (`front/`) and a Dockerfile that layers it onto Twenty's
official server image. Railway's `nexgen-server` and `nexgen-worker` services deploy this branch,
because compiling all of Twenty exceeds Railway's build time limit.
