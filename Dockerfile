FROM node:18-alpine

WORKDIR /librarium

COPY ./scripts/entry.sh /entry.sh
COPY --chown=node . .
RUN apk add util-linux && \
chmod +x /entry.sh && \
mkdir .cache && \
npm ci && \
chown -R node:node /librarium

EXPOSE 3000
USER node
ENTRYPOINT ["/entry.sh"]
CMD ["npm", "run", "start"]
