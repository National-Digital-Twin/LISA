# MULTITENANCY  

**Repository:**  `LISA`  
**Description:**  `This repository contains both the frontend and backend of LISA, along with a transparent proxy that will mask sensitive requests. LISA (Local Incident Services Application) is a web-based crisis and incident management application designed to support real-time decision-making, structured logging, and cross-agency collaboration during emergency incidents.`  
**SPDX-License-Identifier:**  `Apache-2.0 AND OGL-UK-3.0`

## Overview

Multitenancy is supported in L!SA via the method of namespace isolation. The full stack of LISA (Frontend, Backend, Transparent Proxy and IA Node) as shown in the diagram below, gets replicated in a different namespace and routed to via a different subdomain and access role on the user. This document covers how to configure a new instance of L!SA on an existing environment - namely DEV. For other environments, simply replace references to DEV with the appropriate environment (ie. Staging, Prod etc)

![L!SA Tenant Resources](diagrams/c4/LISA.svg)

## Repository Changes

### ndtp-application-continuous-delivery

This repository holds the Flux configuration that is responsible for maintaining the state of the deployed applications and reconciling it back to what is in the continuous-delivery repository.

This repository will require 3 changes:

##### Change 1:
Navigate to `applications/environments/dev`, find the lisa folder and make a copy of it, rename this folder to lisa-(your-tenant-name). Within this new folder, modify any paths that point to the continuous-delivery repository to include the new tenant as part of the path, and any paths that point to the L!SA deployment scripts to also include the new tenant as part of the path.

Update any namespace or targetnamespace to lisa-(your-tenant-name).

Within the root kustomization of your new tenant folder, ensure you include `nameSuffix: (your-tenant-name)`.

Within the root kustomization of the `applications/environment/dev`, ensure you add your new tenant folder so that it is run as part of the continuous delivery process.

##### Change 2:
Navigate to `applications/environments/dev/ia-node/workload/core/3-smart-cache-graph`, find the 3.1-smart-cache-graph-lisa folder and make a copy of it. Rename this new folder 3.X-smart-cache-graph-lisa-(your-tenant-name) - where X is the next sequence number available.

Update any references per the matrix below:

| Old reference | New reference |
|--|--|
| lisa-app-allow-ingress-to-server | lisa-(your-tenant-name)-app-allow-ingress-to-server |
| lisa-app-graph-server | lisa-(your-tenant-name)-app-graph-server |
| lisa-kafka-auth-config | lisa-(your-tenant-name)-kafka-auth-config |
| lisa-app-smart-cache-graph-vault-auth | lisa-(your-tenant-name)-app-smart-cache-graph-vault-auth |
| allow-lisa-app-to-graph-server | allow-lisa-(your-tenant-name)-app-to-graph-server |

Open `config.ttl` under config and replace the following references:

| Old reference | New reference |
|--|--|
| lisa-knowledge | lisa-(your-tenant-name)-knowledge |
| lisa-ontology | lisa-(your-tenant-name)-ontology |

Open `lisa-app-authorizationPolicy.yaml`  at the root of your new folder and change the references as above, along with the `principal` and `namespace`. The principal should become 
`cluster.local/ns/lisa-(your-tenant-name)/sa/lisa-backend-sa`
and the namespace should become
`lisa-(your-tenant-name)`.

Open `kustomization.yaml` at the root of your new folder and change the references as above. Add in this namePrefix:
`namePrefix: lisa-(your-tenant-name)-app-`

In the root `kustomization.yaml` in the ia-node folder, add in your new folder under resources.

##### Change 3:
Navigate to `applications/environments/dev/base/istio` and open `oidc-authorization-policy.yaml`, add two new hosts under hosts:

- lisa-(your-tenant-name).dev.ndtp.co.uk
- lisa-(your-tenant-name).dev.ndtp.co.uk:443

### ndtp-application-infrastructure
This repository is responsible for deploying the relevant cloud infrastructure for supporting your new instance of L!SA. This consists of OpenTofu/Terraform files that is run via make commands. Review the README of this repository before applying changes.

##### Change 1:
Open `aws/02-region/02-01-infrastructure/cognito.tf`, duplicate the resource lisa_cognito_group and replace "lisa_cognito_group" with "lisa_(your-tenant-name)_cognito_group" and "lisa_access" with "lisa__(your-tenant-name)_access". Modify the description to indicate which instance of L!SA this role is for.

##### Change 2:
Open `aws/03-environments/03-03-apps-shared-infra`.
Open `cloudfront.tf` and add in a record of `lisa-(your-tenant-name).${var.hosted_zone_domain}`.
Open `route53.tf` and add in your new subdomain as `lisa-(your-tenant-name)`.

##### Change 3:
Navigate to `aws/03-environments/03-04-apps/03-04-03-lisa`. Duplicate the folder `03-04-03a-lisa` and rename it `03-04-03X-lisa-(your-tenant-name)` where X is the next sequential letter available from the list of L!SA instances.

Modify the names of the resources to include your new tenant name. Antivirus.tf is fully covered by the matrix below. Extend this out to the other files in this folder.

| File | Old reference | New reference |
|--|--|--|
| antivirus.tf | lisa_guard_duty_s3_malware_scanner_s3_policy | lisa_(your-tenant-name)_guard_duty_s3_malware_scanner_s3_policy |
| antivirus.tf | GuardDutyMalwareScannerLisa${upper(tofu.workspace)}S3AccessPolicy | GuardDutyMalwareScannerLisa(your-tenant-name)${upper(tofu.workspace)}S3AccessPolicy |
| antivirus.tf | aws_s3_bucket.lisa_storage_bucket.arn | aws_s3_bucket.lisa_(your-tenant-name)_storage_bucket.arn |
| antivirus.tf | lisa_guard_duty_scanner_assumed_role | lisa_(your-tenant-name)_guard_duty_scanner_assumed_role |
| antivirus.tf | GuardDutyS3MalwareScannerLisa${upper(tofu.workspace)}Role | GuardDutyS3MalwareScannerLisa(your-tenant-name)${upper(tofu.workspace)}Role |
| antivirus.tf | lisa_guard_duty_s3_policy_attach | lisa_(your-tenant-name)_guard_duty_s3_policy_attach |
| antivirus.tf | aws_iam_role.lisa_guard_duty_scanner_assumed_role.name | aws_iam_role.lisa_(your-tenant-name)_guard_duty_scanner_assumed_role.name |
| antivirus.tf | aws_iam_policy.lisa_guard_duty_s3_malware_scanner_s3_policy.arn | aws_iam_policy.lisa_(your-tenant-name)_guard_duty_s3_malware_scanner_s3_policy.arn |
| antivirus.tf | lisa_guard_duty_s3_malware_scanner | lisa_(your-tenant-name)_guard_duty_s3_malware_scanner |
| antivirus.tf | aws_iam_role.lisa_guard_duty_scanner_assumed_role.arn | aws_iam_role.lisa_(your-tenant-name)_guard_duty_scanner_assumed_role.arn |
| antivirus.tf | aws_s3_bucket.lisa_storage_bucket.id | aws_s3_bucket.lisa_(your-tenant-name)_storage_bucket.id |

Once all resource names are updated in the folder to include the tenant name, and references to those resources are updated too. Open `backends/dev-backend.tfvars` and modify the key to include your tenant name after "lisa".

Now open `tfvars/dev.tfvars`, change `lisa_storage_bucket` to include the tenant name after the "lisa".

Finally modify `main.tf` and change APP to "Lisa-(your-tenant-name)".

##### Change 4:
Navigate to `vault/02-applications/02-01-ia-node/role.tf`. Add in your new graph server name - `lisa-(your-tenant-name)-app-graph-server`.

##### Change 5:
Navigate to `vault/02-applications/02-03-lisa`. Duplicate the folder `02-03a-lisa` and name it `02-03X-lisa-(your-tenant-name)` where X is the next sequential letter available from the list of L!SA instances.

As with Change 3, update all resource names and references to include your new tenant name. Pay special attention to `bound_service_account_namespaces` properties - these should be updated to your chosen namespace, likely "lisa-(your-tenant-name)".

Update `backends/dev-backend.tfvars` so that the key references the tenant name after "lisa".

Once all these changes are done, you will be able to _make_ the changes via Tofu's init-plan-apply process - refer to the repository README for this information. These are the following directories you will need to run:

- aws/02-region/02-01-infrastructure
- aws/03-environments/03-04-apps/03-04-03-lisa/03-04-X-lisa-(your-tenant-name)
- vault/02-applications/02-01-ia-node
- vault/02-applications/02-03-lisa/02-03X-lisa-(your-tenant-name)
- aws/03-environments/03-03-apps-shared-infra

### LISA
This repository holds the source code for LISA, and also specific deployment overlays for each tenant.

##### Change 1:
Navigate to `deployment/k8s/backend/overlays`. Create a new folder as your tenant name. Copy the relevant stages (dev, staging, prod) into your new tenant folder.
Update `allow-ingress.yaml` and  `service-account.yaml` with the new backend access role name.

Add 2 new files; `vaultAuth.yaml` and `vaultStaticSecret.yaml` - these two will overlay the base with your new tenant values.

`vaultAuth.yaml`:

    - op: replace
	  path: "/spec/kubernetes/role"
      value: lisa-(your-tenant-name)-backend-role

`vaultStaticSecret.yaml`:

    apiVersion: secrets.hashicorp.com/v1beta1
    kind: VaultStaticSecret
    metadata:
	    name: lisa-backend-static-secret
    spec:
	    path: applications/lisa-(your-tenant-name)/backend

Edit the `kustomization.yaml` file, set namespace to lisa-(your-tenant-name) and include your new patches like so:

    patches:
	    - path: patches/service-account.yaml
	      target:
		    kind: ServiceAccount
		    name: lisa-backend-sa
	    - path: patches/allow-ingress.yaml
	      target:
		    kind: AuthorizationPolicy
	    - path: patches/vaultStaticSecret.yaml
	      target:
		    kind: VaultStaticSecret
		    name: lisa-backend-static-secret
	    - path: patches/vaultAuth.yaml
	      target:
		    kind: VaultAuth
		    name: lisa-backend-vault-auth

Finally, update `params.env` with your new server url, SCG url and Cognito user group name.

##### Change 2:
Navigate to `deployment/k8s/bootstrap/overlays`.  Create a new folder as your tenant name. Copy the relevant stages (dev, staging, prod) into your new tenant folder.
Update `gateway.yaml` with your new L!SA host
Replace all instances of the old host in `virtualService.yaml` with your new one.
Finally, replace the namespace in `kustomization.yaml` with your new namespace. 

##### Change 3:
Navigate to `deployment/k8s/transparent-proxy/overlays`.  Create a new folder as your tenant name. Copy the relevant stages (dev, staging, prod) into your new tenant folder.
Update `service-account.yaml` with your new transparent proxy access role name.
Add 3 new files under patches:

`allow-ingress-to-lisa-transparent-proxy.yaml`:

    - op: replace
      path: /spec/rules/0/when/0/values
      value:
	    - lisa_(your-tenant-name)_access

`vaultAuth.yaml`:

    - op: replace
      path: "/spec/kubernetes/role"
      value: lisa-(your-tenant-name)-transparent-proxy-role

`vaultStaticSecret.yaml`:

    apiVersion: secrets.hashicorp.com/v1beta1
    kind: VaultStaticSecret
    metadata:
	    name: lisa-transparent-proxy-static-secret
    spec:
	    path: applications/lisa-(your-tenant-name)/transparent-proxy

Edit the `kustomization.yaml` file, set namespace to lisa-(your-tenant-name) and include your new patches like so:

    patches:
	    - path: patches/service-account.yaml
	      target:
		    kind: ServiceAccount
	    - path: patches/vaultStaticSecret.yaml
	      target:
		    kind: VaultStaticSecret
		    name: lisa-transparent-proxy-static-secret
	    - path: patches/allow-ingress-to-lisa-transparent-proxy.yaml
	      target:
		    kind: AuthorizationPolicy
		    name: allow-ingress-to-transparent-proxy
	    - path: patches/vaultAuth.yaml
	      target:
		    kind: VaultAuth
		    name: lisa-transparent-proxy-vault-auth

##### Change 4:
Navigate to `deployment/k8s/webapp/overlays`.  Create a new folder as your tenant name. Copy the relevant stages (dev, staging, prod) into your new tenant folder.
Update `service-account.yaml` with the new frontend/webapp access role.
Add one more file into patches:

`allow-ingress-authorization-policy.yaml`:

    - op: replace
      path: /spec/rules/0/when/0/values
      value:
	    - lisa_(your-tenant-name)_access

Edit the `kustomization.yaml` file, set namespace to lisa-(your-tenant-name) and include your new patches like so:

    patches:
	    - path: patches/service-account.yaml
	      target:
		    kind: ServiceAccount
		    name: lisa-sa
	    - path: patches/allow-ingress-authorization-policy.yaml
	      target:
		    kind: AuthorizationPolicy
		    name: allow-ingress-to-lisa-webapp

### landing-page
This repository contains the frontend and API for the initial landing page - this controls sign-in and access to the individual demonstrators.

##### Change 1: 
Navigate to `api/src/index.ts`, locate the ndtp_apps array and add a new record for your new tenant (taking a copy of the existing L!SA entry). Update the index, name, displayName, href and role.
With the other (APP)_URL properties, add a new one for your new tenant. 
Add the new URL for your new tenant in `params.env` with the same name as the one you are referencing in `index.ts`.

Finally, update `api/test/index.test.ts` in a similar manner.

##### Change 2:
Navigate to `frontend/src/components/AppSelector/AppSelector.tsx`. Locate the applicationLogos map and add in a record for your new App name, using the LisaLogo.

Finally, update `frontend/src/mocks/handlers.ts` with the new application.


## Document Maintenance
This document is a living resource and may evolve alongside the NDTP demonstrator programme. As such, its content may become outdated over time. We encourage all maintainers and contributors to review and update this document regularly to ensure it remains accurate, relevant, and aligned with current implementation practices.



© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.  
Licensed under the Open Government Licence v3.0.  
