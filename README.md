# README  

**Repository:** `LISA`  
**Description:** `This repository contains both the frontend and backend of LISA, along with a transparent proxy that will mask sensitive requests. LISA (Local Incident Services Application) is a web-based crisis and incident management application designed to support real-time decision-making, structured logging, and cross-agency collaboration during emergency incidents.`  
**SPDX-License-Identifier:** `Apache-2.0 AND OGL-UK-3.0 `  

## Overview  
LISA (Local Incident Services Application) is a web-based crisis and incident management application designed to support real-time decision-making, structured logging, and cross-agency collaboration during emergency incidents. It allows teams to digitally manage incidents, capture critical information, and securely share updates across stakeholders, improving coordination and response times. L!SA is part of the NDTP Demonstrator Programme.
 
This repository functions as the frontend and backend of LISA. It provides the necessary REST styled endpoints to serve and route data from the IA (Integration Architecture) to the frontend and provides the necessary UI components to allow users to add and view incidents and log entries.

## Prerequisites  
Before using this repository, ensure you have the following dependencies installed:  
- **Required Tooling:** Docker, NodeJS (20+), NPM  
- **System Requirements:** Dual-Core CPU (Intel i5 or AMD Ryzen 3 equivalent), 8GB RAM, SSD/HDD with 10GB free space

## Quick Start  
Follow these steps to get started quickly with this repository. For detailed installation, configuration, and deployment, refer to the relevant MD files.  

### 1. Download and Build  

Clone and download the repository:
```sh  
git clone https://github.com/National-Digital-Twin/LISA.git  
cd LISA  
```

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

### 2. Run Build Version  
```sh  
npm build --version  
```

### 3. Full Installation  
Refer to [INSTALLATION.md](INSTALLATION.md) for detailed installation steps, including required dependencies and setup configurations.  

### 4. Uninstallation  
For steps to remove this repository and its dependencies, see [UNINSTALL.md](UNINSTALL.md).  

## Multitenancy
L!SA supports multitenancy via namespace isolation within Kubernetes. The steps to add new instances are all covered in [MULITENANCY.md](MULTITENANCY.md).

## Features  
Include a brief list of key features provided by this repository. These should highlight what makes the project valuable to users and contributors. Examples of features might include:  
- **Core functionality** LISA (Local Incident Services Application) is a web-based crisis and incident management application designed to support real-time decision-making, structured logging, and cross-agency collaboration during emergency incidents. It allows teams to digitally manage incidents, capture critical information, and securely share updates across stakeholders, improving coordination and response times. 
- **Key integrations** Provides REST API endpoints for integration with the IA node.
- **Scalability & performance** Optimised for high performance under significant load.

## Public Funding Acknowledgment  
This repository has been developed with public funding as part of the National Digital Twin Programme (NDTP), a UK Government initiative. NDTP, alongside its partners, has invested in this work to advance open, secure, and reusable digital twin technologies for any organisation, whether from the public or private sector, irrespective of size.  

## License  
This repository contains both source code and documentation, which are covered by different licenses:  
- **Code:** Originally developed by [Original Developer, if applicable], now maintained by National Digital Twin Programme. Licensed under the Apache License 2.0.  
- **Documentation:** Licensed under the Open Government Licence v3.0.  

See `LICENSE.md`, `OGL_LICENCE.md`, and `NOTICE.md` for details.  

## Security and Responsible Disclosure  
We take security seriously. If you believe you have found a security vulnerability in this repository, please follow our responsible disclosure process outlined in `SECURITY.md`.  

## Contributing  
We welcome contributions that align with the Programme’s objectives. Please read our `CONTRIBUTING.md` guidelines before submitting pull requests.  

## Acknowledgements  
This repository has benefited from collaboration with various organisations. For a list of acknowledgments, see `ACKNOWLEDGEMENTS.md`.  

## Support and Contact  
For questions or support, check our Issues or contact the NDTP team on ndtp@businessandtrade.gov.uk.

**Maintained by the National Digital Twin Programme (NDTP).**  

© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
