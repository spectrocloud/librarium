FROM node:20-alpine

WORKDIR /librarium

# ENV DISABLE_RSPACK_INCREMENTAL=true

COPY --chown=node . .

RUN apk add --no-cache util-linux bash && \
    npm install @docusaurus/faster &&\
    npm ci && \
    chmod -R +x scripts 


RUN chown -R node:node /librarium


EXPOSE 9000
USER node

CMD ["npm","run","start"]
