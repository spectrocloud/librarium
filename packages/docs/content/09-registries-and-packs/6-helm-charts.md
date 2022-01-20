---
title: "Helm Registry"
metaTitle: "Spectro Helm Registry"
metaDescription: "Description of Helm registries and charts and their usages within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";


# Spectro Helm Registry

Helm Charts is a collection of Kubernetes resource files capable of deploying services ranging in varying complexities. Spectro Cloud provides a few stable public helm registries out of the box. Tenants can also additionally add any public or private helm registries to leverage charts from those registries. Spectro Cloud makes deploying typical Kubernetes applications easier with native support for [Helm charts](https://www.helm.sh). We also allow the addition of any public or private helm chart registry to the system. Spectro Cloud ships a few stable public helm chart registries out of the box. Charts from these system registries or any additional ones added by tenant administrators are modelled into cluster profiles for cluster deployment. 

<WarningBox>
Spectro Cloud mandates the use of Helm OCI version 3.7.0 and above for the best security experiences.
</WarningBox>

## Deploying Helm Charts

Spectro cloud allows the deployment of Helm charts in two levels, one from the default Public Repo and another as user’s custom helm registry.

### Default System Helm Registry

Spectro Cloud is providing the users with a stable repo of Helm Charts accessible to all the tenants. This repository syncs all the helm charts to the Spectro system resources. Hence, enabling the tenants to model cluster profiles using out-of-the-box charts from the stable repo. Therefore helps in the straightforward utilization of charts by the users. 

### Setting up Helm Registry with Tenant Scope

Spectro Cloud also provisions an exclusive Helm Registry for tenants to help users own private helm repo. For creating your repo from the management console,
* Login as  a tenant administrator, navigate to Admin -> Settings -> Registries.
* Click on “Add New Helm Registry” and provide the registry name, endpoint, and user credentials.
* Enable "**Protected**" mode if the user helm registry is deployed within a private network. Palette's orchestrator running in the tenant clusters deployed in private networks downloads and deploys charts from these protected chart registries.
* Enable “**No authentication**” if the tenant choice is not to set up credentials for the registry.
* Click “Confirm”

**Note:**
* In protected mode the users can manually input the Helm chart names and versions to the Helm Registries during cluster profile creation.
* In unprotected mode the charts need to be synchronized into the management console. Hence charts are selected from the drop-down menu during the cluster profile creation.
* If the user wants to create the registry without authentication, only a custom registry name and endpoint are enough for the validation to complete. Otherwise, a specific user name and password are set up along with the custom registry name and endpoint. Upon successful registration, users can build and deploy custom charts onto the custom Helm registry and use these packs while cluster profiles creation.

## Helm Chart Discovery for Brownfield Clusters

* Discover helm charts already installed in the imported cluster
* Sync all discovered charts into the system

