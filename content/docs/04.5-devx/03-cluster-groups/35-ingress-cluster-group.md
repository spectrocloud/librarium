---
title: "Set Up Ingress"
metaTitle: "Set Up Ingress for Cluster Groups"
metaDescription: "Learn how to set up a Kubernetes Ingress for a Palette Cluster Group"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

Cluster Groups may have a cluster endpoint type of either Load Balancer or Ingress. The cluster endpoint type determines how Palette Virtual Clusters deployed in a Cluster Group are exposed. You specify the cluster endpoint in Cluster Group Settings.

Using **Ingress** as the cluster endpoint type is a more cost effective way to access your Kubernetes workloads than using type **Load Balancer**, which requires a new cloud load balancer to be provisioned for each virtual cluster.

When you enable **Ingress** as the endpoint for a Cluster Group, you must deploy an NGINX Ingress Controller add-on profile on each host cluster in the Cluster Group. The NGINX Ingress Controller provides the necessary routing functionality for external traffic to reach the Kubernetes API server of each virtual cluster, as well as any apps each virtual cluster contains.

# Prerequisite

- At least one infrastructure or cloud-based cluster you’ve created at the tenant level.

# Set Up Ingress

1. Log in to Palette as **Tenant Admin**.
<br />
2. Identify each host cluster that requires the addition of an NGINX Ingress Controller profile.

    This can be:

    - All the host clusters in an existing Cluster Group, <br />
        or
    
    - Existing host clusters that you will add to a new Cluster Group you'll create later. <br /><br />

3. Add ```ingress-nginx-host-cluster``` profile to each host cluster. <br />
    a. From the main menu, choose **Clusters** and select a cluster.<br />
    b. In the **Profile** tab, click **Add add-on profile (+)** and select ```ingress-nginx-host-cluster```. <br />
    c. Confirm and save your changes.
<br />
4. For each host cluster with ingress deployed, use webkubectl and invoke the ```kubectl -n nginx get service nginx-ingress-controller``` command to identify the External-IP of the ```ingress-nginx-host-cluster``` LoadBalancer service. 

    Copy the record to your clipboard or to a text file. You'll use it to create a CNAME DNS record.
    <br />

5. Use your Domain Name System (DNS) provider to create a wildcard canonical name (CNAME) record that maps to the External-IP for the NGINX Ingress Controller. Paste the External-IP you copied from webkubectl to create the CNAME record.<br /><br />

    <InfoBox>
    The CNAME record is also known as the host cluster DNS pattern.
    </InfoBox>

6. Copy the CNAME record to your clipboard.
<br />

7. In Palette Cluster Mode, Tenant Admin scope, select **Cluster Groups** in the main menu and select the Cluster Group that requires ingress.<br />
    a. From the **Host Clusters** tab, select **Settings > Clusters**.<br />
    b. Choose **Ingress** as the **Cluster endpoint type**. <br />
    c. Paste the name of the wildcard DNS record you created in the previous step into the **Host DNS** field.

If you haven’t yet created a Cluster Group, you can configure each host cluster as described and add them to a new Cluster Group later.

# Validation

To validate that ingress is functioning as expected, do the following: 

1. Switch to App Mode and deploy a new virtual cluster.
2. Download the virtual cluster kubeconfig and verify you can connect. For example:

```bash
export KUBECONFIG=~/Downloads/virtual-cluster-algenib.yaml
kubectl get namespaces
```
This should display a list of namespaces.

If there is no connection, an error message displays, and you must verify the following:

- Each host cluster is deployed with NGINX Ingress Controller.
- The CNAME record correctly maps to the External-IP of the NGINX Ingress Controller’s LoadBalancer Service.
- Cluster Group Settings specify the Cluster endpoint type as **Ingress**, and the Host DNS includes the CNAME record you created.

# Resources

[Cluster Groups](https://docs.spectrocloud.com/devx/cluster-groups)






