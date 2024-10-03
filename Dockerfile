FROM node:20-alpine

WORKDIR /librarium

ARG PALETTE_API_KEY

COPY ./scripts/entry.sh /entry.sh
COPY --chown=node . .
RUN apk add util-linux && \
chmod +x /entry.sh && \
mkdir .cache && \
npm ci && \
chown -R node:node /librarium && \
echo -e "ALGOLIA_APP_ID=1234567890\nALGOLIA_SEARCH_KEY=1234567890\nALGOLIA_INDEX_NAME=spectrocloud\nPALETTE_API_KEY=${PALETTE_API_KEY}" > .env

EXPOSE 9000
USER node
ENTRYPOINT ["/entry.sh"]
CMD ["npm", "run", "start"]
