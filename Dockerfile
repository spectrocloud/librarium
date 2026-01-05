FROM node:22-alpine

WORKDIR /librarium

ENV DISABLE_PACKS_INTEGRATIONS=true
ENV DISABLE_SECURITY_INTEGRATIONS=true

COPY --chown=node . .

RUN apk add --no-cache util-linux bash git && \
    npm install @docusaurus/faster &&\
    npm ci && \
    chmod -R +x scripts 


RUN chown -R node:node /librarium


EXPOSE 9000
USER node

CMD ["npm","run","start"]
