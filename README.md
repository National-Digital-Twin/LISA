# Configuring

1. Install docker and nodejs (version 20+)

2. Make sure you build the docker image for the smart cache graph. This can be done by navigating to the deployment/scg folder and running the following command:
```bash
docker build -t lisa/smart-cache-graph .
```

3. Ask for the AWS API token. It is required to access the Cognito API.
4. Copy backend/.env-iam-template to backend/.env-iam replacing the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

For the OS Maps API the key must be set as an SSM parameter with name `/lisa/os-maps-key` and no encryption.
See https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-create-console.html

# Running

1. In deployment/scg run

```shell
docker compose up
```

2. In the main app folder run:

```shell
npm run dev
```

This will start watchers for both the frontend and the backend.

## Running local code development tools

See [RUNNING_CODE_DEV_TOOLS.md](./developer_docs/RUN_CODE_DEV_TOOLS.md) for more information.

## Contributors
The development of these works has been made possible with thanks to our [contributors](https://github.com/National-Digital-Twin/LISA/graphs/contributors).
