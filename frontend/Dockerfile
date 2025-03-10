FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

ARG BACKEND_URL
ARG BACKEND_HOST
ARG NPM_TOKEN

RUN echo "@national-digital-twin:registry=https://npm.pkg.github.com/" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

COPY ../package.json ../package-lock.json* ./
COPY . .
RUN npm install --no-cache --legacy-peer-deps --verbose
RUN rm -f .npmrc

ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_BACKEND_HOST=$BACKEND_HOST

RUN npm run build

# Start a new stage from scratch
FROM nginx as runner

# Copy the built files from the builder stage to the runner stage
COPY --from=builder /app/dist /usr/share/nginx/html
