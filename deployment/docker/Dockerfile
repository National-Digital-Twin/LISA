FROM node:20-alpine
RUN mkdir -p /home/node/dist

WORKDIR /home/node
USER node
COPY --chown=node:node backend/dist ./dist

EXPOSE 3000
ENV HOST=0.0.0.0

CMD [ "node", "--enable-source-maps", "dist/server.mjs" ]
