FROM node:20-alpine
RUN mkdir -p /home/node/dist

WORKDIR /home/node
COPY --chown=root:root --chmod=755 ../../backend/dist ./dist

USER node

EXPOSE 3000
ENV HOST=0.0.0.0

CMD [ "node", "--enable-source-maps", "dist/server.mjs" ]
