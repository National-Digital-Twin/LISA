# Transparent Proxy

The transparent proxy forwards requests to various third parties for whom:

1. We don't want to leak API keys, or
2. For whom cross-origin requests aren't an option, or
3. Both.

It's nginx, in a Docker container. The config is brought in from files in this directory and substituted with environment variables.

Building it, as an example:

```bash
docker build --tag lisa/transparent-proxy:latest .
```

When run, various access keys need to be passed in as environment variables. Currently this is:

- `OS_RASTER_API_KEY`

It can be run for example as:

```bash
docker run -ti -p 5013:80 --env OS_RASTER_API_KEY=... lisa/transparent-proxy:latest
```
