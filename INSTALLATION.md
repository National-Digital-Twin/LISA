# INSTALLATION  

**Repository:** `LISA`  
**Description:** `Details how to install and run the software`  
**SPDX-License-Identifier:** `Apache-2.0 AND OGL-UK-3.0 ` 

## Prerequisites  
Before using this repository, ensure you have the following dependencies installed:  
- **Required Tooling:** Docker, NodeJS (20+), NPM  
- **System Requirements:** Dual-Core CPU (Intel i5 or AMD Ryzen 3 equivalent), 8GB RAM, SSD/HDD with 10GB free space


### 1. Download

Clone and download the repository:
```sh  
git clone https://github.com/National-Digital-Twin/LISA.git  
cd LISA  
```

### 2. Build

Before building the Secure Agent Graph, login in to the GitHub container registry using the following command:

```bash
echo <my-pat-token> | docker login ghcr.io -u <my-username> --password-stdin
```

Build the docker image for the Secure Agent Graph. This can be done by navigating to the deployment/sag folder and running the following command:

```bash
docker build -t lisa/secure-agent-graph .
```

Run the following command to start the frontend:

```bash
npm run dev:frontend
```

Run the following command to start the backend:

```bash
npm run dev:backend
```


## Running local code development tools

See [RUNNING_CODE_DEV_TOOLS.md](./developer_docs/RUN_CODE_DEV_TOOLS.md) for more information.

### 3. Configuration

Copy backend/.env-iam-template to backend/.env-iam replacing the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

Github Access Token:

1. Create a personal access token on GitHub - https://github.com/settings/tokens - create a classic token with read:packages permission store this safely and make sure to add as an environment variable;
2. Create a environment variable to store and persist this token. In your terminal run: vim or nano ~/.bashrc
3. In the file place export GITHUB_ACCESS_TOKEN=ghp_xxxxx
4. Restart your bash session source ~/.bashrc. Then run echo $GITHUB_ACCESS_TOKEN to confirm it's worked.
5. Run the usual npm install.


© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.  
Licensed under the Open Government Licence v3.0.  
