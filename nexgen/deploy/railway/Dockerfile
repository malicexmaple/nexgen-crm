# NEXGEN image for Railway: Twenty's official server image plus the NEXGEN-branded frontend
# built from main. Copied to the railway-deploy branch by nexgen/deploy/publish-railway-frontend.sh.
ARG TWENTY_IMAGE=twentycrm/twenty:v2.52.0
FROM ${TWENTY_IMAGE}

RUN rm -rf /app/packages/twenty-server/dist/front
COPY --chown=1000 front /app/packages/twenty-server/dist/front
