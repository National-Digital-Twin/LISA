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

© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.  
Licensed under the Open Government Licence v3.0.  
