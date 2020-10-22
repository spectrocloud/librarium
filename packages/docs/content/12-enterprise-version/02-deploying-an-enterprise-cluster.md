---
title: "Enterprise Cluster"
metaTitle: "Enterprise Cluster"
metaDescription: "Deploying a cluster in Spectro Cloud Enterprise cluster."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Deploy platform installer

Spectro Cloud On-Prem Enterprise Cluster is a multi-node highly avaialble installation of the Spectro Cloud platform suitable for production purposes. Installation involves instantiaing the on-prem platform installer VM and invoking the enterprise cluster migration wizard. Please follow [these] steps to deploy the installer VM and observe the [monitoring console] to ensure installation is successful. After successfull installaton of the platform installer, proceed to enterprise cluster migration. 

Note: Deployment of an enterprise cluster is a migration process from the quick start mode. You may choose to deploy the enterprise cluster on day 1 right after instantiating the platform installer VM, or use the system in the quick start mode intially and at a later point invoke the enterprise cluster migration wizard to deploy the enterprise cluster. All the data from quick start is migrated to the enterprise cluster as part of this migration process. 


# Enterprise Cluster Migration

1. Open the On-Prem system console from a browser window by navigating to https://< VM Ip Address >:/system and login. 
2. Navigate to the Enterprise Cluster Migration wizard from the mennu on the left hand side. 
3. Enter vCenter credentials to be used to launch the enterprise cluster. Provide the vCenter server, username, and password. Check the `Use self-signed certificates` if applicable. Validate your credentials and click on `Next` buttorn to proceed to IP Pool Configuration.
4. Enter IPs to be used for Enterprise Cluster VMs as a `Range` or `Subnet`. At least 5 IP address should be required in the range for installation and ongoing management. Provide the details of the `Gateway` and the `Nameserver addresses`. Any search suffixes being used can be entered in the `Nameserver search suffix` box. Click on `Next` to proceed to Cloud Settings.
4. Select the datacenter and the folder to be used for enterprise cluster VMs. Select the desired compute Cluster, resource Pool, datastore, and network. For high availability purposes, you may choose to distribute the three VMs across multiple compute clusters. If this is desired, invoke the 'Add Domain' option to enter multiple sets of properties. 
5. Add SSH Public key and optionally NTP servers and click 'Confirm'.
6. Enterprise cluster deployment will proceed through the following three steps. 
   * Deployment - A 3 node Kubernetes cluster is launched and Spectro Cloud Platform is deployed on it. This typically takes 10 mins. 
   * Data Migration - Data from the installer VM is migrated to the newly created enterprise cluster. 
   * Tenant Migration - If any tenants were created prior to enterprise cluster migration, which would typically be the case if the system was used in the quick start mode initially, all those tenants and management of any tenant clusters previously deployed will be migrated to the enterprise cluster. 
7. Once Enterprise Cluster is fully deployed, the On-Prem System and Management Console should be accessed on this new cluster. The platform installer VM can be safely powered off at this point. 
