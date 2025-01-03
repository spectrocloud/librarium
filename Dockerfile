FROM node:20-alpine

WORKDIR /librarium

COPY ./scripts/entry.sh /entry.sh
COPY --chown=node . .
RUN apk add util-linux && \
apk add bash && \
chmod +x /entry.sh && \
mkdir .cache && \
npm ci

RUN npm install axios -g && \
chown -R node:node /librarium

EXPOSE 9000
USER node
ENTRYPOINT ["/entry.sh"]
CMD ["npm", "run", "start"]
