FROM node:18-alpine

RUN apk add util-linux
WORKDIR /librarium
COPY ./scripts/entry.sh /entry.sh
USER node
ENTRYPOINT ["/entry.sh"]
CMD ["npm", "run", "start"]