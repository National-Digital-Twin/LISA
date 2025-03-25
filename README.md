# Configuring

1. Install docker and nodejs (version 20+)

2. Make sure you build the docker image for the secure agent graph. This can be done by navigating to the deployment/sag folder and running the following command:

Before running the command please login in to the GitHub container registry using the following command:
```bash
echo <my-pat-token> | docker login ghcr.io -u <my-username> --password-stdin
```

```bash
docker build -t lisa/secure-agent-graph .
```

3. Ask for the AWS API token. It is required to access the Cognito API.
4. Copy backend/.env-iam-template to backend/.env-iam replacing the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

# Github Access Token

1. Create a personal access token on GitHub - https://github.com/settings/tokens - create a classic token with read:packages permission store this safely and make sure to add as an environment variable;
2. Create a environment variable to store and persist this token. In your terminal run: vim or nano ~/.bashrc
3. In the file place export GITHUB_ACCESS_TOKEN=ghp_xxxxx
4. Restart your bash session source ~/.bashrc. Then run echo $GITHUB_ACCESS_TOKEN to confirm it's worked.
5. run the usual npm install.

# Running

1. In the main app folder run:

```shell
npm run start
```

This will start watchers for both the frontend and the backend.

# Docker build configuration

### Backend

Ensure the backend layer has been bundled and then run the following command from the root directory.
```shell
docker build -t lisa/backend -f Dockerfile.backend .
```
The built image can then be run, but requires the appropriate env vars to be passed in on start.

### Frontend

Run the following command from the root directory.
```shell
docker build \
  --build-arg BACKEND_URL="http://localhost:3000" \
  --build-arg BACKEND_HOST="localhost:3000" \
  --build-arg NPM_TOKEN="<GithubAccessToken>" \
  -t lisa/frontend \
  -f Dockerfile.frontend \
  .
```
The built image can then be run.

## Running local code development tools

See [RUNNING_CODE_DEV_TOOLS.md](./developer_docs/RUN_CODE_DEV_TOOLS.md) for more information.

## Contributors

The development of these works has been made possible with thanks to our [contributors](https://github.com/National-Digital-Twin/LISA/graphs/contributors).
