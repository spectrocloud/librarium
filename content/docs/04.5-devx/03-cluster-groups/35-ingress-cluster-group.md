---
title: "Set Up Ingress"
metaTitle: "Set Up Ingress for Cluster Groups"
metaDescription: "Learn how to configure Ingress for a Palette Cluster Group"
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

Using **Ingress** as the cluster endpoint type is a more cost effective way to access your Kubernetes workloads than using type **Load Balancer**, which requires a new cloud Load Balancer to be provisioned for each virtual cluster.

When you enable **Ingress** as the endpoint for a Cluster Group, you must deploy an Ingress Controller add-on profile, such as NGINX, on each host cluster in the Cluster Group. The Ingress Controller provides the necessary routing functionality for external traffic to reach the Kubernetes API server of each virtual cluster, as well as any apps each virtual cluster contains. 

# Prerequisites

- At least one infrastructure or cloud-based cluster you’ve created in Tenant scope.
- The Ingress Controller must have Secure Socket Layer (SSL) passthrough enabled so that Transport Layer Security (TLS) is not terminated. <br /><br />

    ```yml
    extraArgs:        
  enable-ssl-passthrough: true
    ```

    Palette provides the ```ingress-nginx-host-cluster``` add-on profile with SSL passthrough already enabled. Palette's NGINX add-on profile also reroutes incoming requests through port 443 to use the cloud Load Balancer. 

- If you are not using Palette's NGINX add-on profile, you can add the following to the profile you're using: <br /><br />

    ```
    tcp:   
    6443: "nginx/nginx-ingress-controller:443"  
    # 8080: "default/example-tcp-svc:9000"
    ```

    This will terminate TLS for your Apps at the cloud Load Balancer while still allowing you to connect to the API servers of your Virtual Clusters. Alternatively, you must use Cert Manager to issue certificates for App Ingress within the cluster.


# Set Up Ingress

1. Log in to Palette as **Tenant Admin**.
<br />
2. Identify each host cluster that requires the addition of an NGINX Ingress Controller profile.

    This can be:

    - All the host clusters in an existing Cluster Group, <br />
        or
    
    - Existing host clusters that you will add to a new Cluster Group. <br /><br />

3. Add the ```ingress-nginx-host-cluster``` add-on profile to each host cluster. <br />
    a. From the **Main Menu**, choose **Clusters** and select a cluster.<br />
    b. In the **Profile** tab, click **Add add-on profile (+)** and select ```ingress-nginx-host-cluster```. <br />
    c. Confirm and save your changes.
<br />
4. For each host cluster with ingress deployed, follow these steps to open a web shell, identify the External-IP of the LoadBalancer Service, and copy the record you will need to create a canonical Name (CNAME) Domain Name System (DNS) record:

    a. From the **Main Menu**, select a cluster. The cluster **Overview** tab displays. 
    <br />

    b. In the **Details** section beneath **Metrics**, click the **Connect** button next to the Kubernetes config file to open a web shell. 
    <br />
    
    c. Invoke the following command to display the External-IP of the ```ingress-nginx-host-cluster``` LoadBalancer Service: <br /><br />

    ```
    kubectl -n nginx get service nginx-ingress-controller
    ``` 

    d. Copy the record to your clipboard or to a text file. You will use the External-IP address to create a CNAME DNS record.
    <br />
    
    e. Close the web shell.
    <br />

5. Use your DNS provider to create a wildcard CNAME record that maps to the External-IP for the NGINX Ingress Controller. Paste the External-IP you copied from the web shell to create the CNAME record.
<br />

<InfoBox>
    The CNAME record is also known as the host cluster DNS pattern.
</InfoBox>
    
    <br />

6. Copy the CNAME record to your clipboard.
<br />

7. Ensure you are in Palette's Cluster Mode, under the Tenant Admin scope, and select **Cluster Groups** in the **Main Menu**, then select the Cluster Group that requires ingress.<br /><br />
    a. From the **Host Clusters** tab, select **Settings > Clusters**.<br />
    
    b. Choose **Ingress** as the **Cluster endpoint type**. <br />

    c. Paste the name of the wildcard CNAME record into the **Host DNS** field.

<InfoBox>
If you haven’t yet created a Cluster Group, you can configure each host cluster as described and add them to a new Cluster Group later.
</InfoBox>

# Validation

To validate that ingress is functioning as expected, do the following: 

1. Switch to App Mode and deploy a new virtual cluster.
2. Use a web shell and type the following command to verify you can connect to the newly deployed virtual cluster:

```
kubectl get namespaces
```
This should display a list of namespaces as shown in the example:

``` 
NAME                               STATUS   AGE
default                            Active   4d11h
kube-system                        Active   4d11h
kube-public                        Active   4d11h
kube-node-lease                    Active   4d11h
cluster-63c91f359ae82b46c9bad615   Active   4d11h
app-gamebox-lb-spectro-gamebox     Active   4d11h
```

If an error message displays, it indicates something is wrong with the configuration. Verify the following:

- Each host cluster is deployed with NGINX Ingress Controller.
- The CNAME record correctly maps to the External-IP of the NGINX Ingress Controller’s LoadBalancer Service.
- Cluster Group Settings specify the Cluster endpoint type as **Ingress**, and **Host DNS** specifies the CNAME record you created.

# Resources

[Cluster Groups](https://docs.spectrocloud.com/devx/cluster-groups)






