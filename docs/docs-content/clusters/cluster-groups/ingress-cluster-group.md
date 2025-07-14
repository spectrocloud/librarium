---
sidebar_label: "Set Up Ingress"
title: "Set Up Ingress for Cluster Groups"
description: "Learn how to configure Ingress for a Palette Cluster Group"
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster groups"]
---

Cluster Groups may have a cluster endpoint type of either Load Balancer or Ingress. The cluster endpoint type determines
how Palette Virtual Clusters deployed in a Cluster Group are exposed. You specify the cluster endpoint in Cluster Group
Settings.

Using **Ingress** as the cluster endpoint type is a more cost effective way to access your Kubernetes workloads than
using type **Load Balancer**, which requires a new cloud Load Balancer to be provisioned for each virtual cluster.

When you enable **Ingress** as the endpoint for a Cluster Group, you must deploy an
[Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) add-on profile, such
as Nginx, on each host cluster in the Cluster Group. The Ingress Controller provides the necessary routing functionality
for external traffic to reach the Kubernetes API server of each virtual cluster, as well as any apps each virtual
cluster contains.

## Prerequisites

- At least one infrastructure or cloud-based cluster.

- The Ingress Controller must have Secure Socket Layer (SSL) passthrough enabled so that Transport Layer Security (TLS)
  is not terminated at the ingress controller. Palette provides the `nginx-ingress` add-on profile where SSL passthrough
  can be enabled. The following example shows how you can enable SSL-passthrough for the Nginx Ingress Controller.

  ```yaml {5}
  charts:
    ingress-nginx:
      controller:
        extraArgs:
          enable-ssl-passthrough: true
  ```

If you are using an ingress controller other than the Nginx Ingress Controller and would like to terminate TLS at your
ingress controller's cloud load balancer, an equivalent TCP service configuration would be required. Alternatively, you
may handle all TLS termination inside the cluster by configuring cert-manager to issue a certificate for each
application's ingress.<br />

The following example shows how port rerouting is achieved for the Nginx Ingress Controller. You would add an equivalent
Transmission Control Protocol (TCP) service configuration to the profile of the add-on you are using. <br /><br />

    ```yaml
    tcp:
      6443: "nginx/nginx-ingress-controller:443"
    ```

## Set Up Ingress

The following steps describe how to enable an Ingress Controller for a Cluster Group. You will use the `nginx-ingress`
add-on profile, but you may choose another ingress controller.

1. Log in to Palette as **Tenant Admin**.

2. Identify each host cluster that requires the addition of an Nginx Ingress Controller profile.

   This can be:

   - All the host clusters in an existing Cluster Group, <br /> or
   - Existing host clusters that you will add to a new Cluster Group. <br /><br />

3. Either add the `nginx-ingress` add-on profile to each host cluster, or manually configure your own ingress controller
   add-on profile with the customizations described in the [Prerequisites](ingress-cluster-group.md#prerequisites)
   section.

a. From the **Main Menu**, choose **Clusters** and select a cluster.

b. In the **Profile** tab, click **Add add-on profile (+)** and select `nginx-ingress`.

c. Confirm and save your changes.

4. For each host cluster with an ingress controller add-on profile deployed, follow these steps to open a web shell,
   identify the External-IP of the LoadBalancer Service, and copy the record you will need to create a canonical Name
   (CNAME) Domain Name System (DNS) record:

   a. From the **Main Menu**, select a cluster. The cluster **Overview** tab displays.

   b. In the **Details** section beneath **Metrics**, click the **Connect** button next to the Kubernetes config file to
   open a web shell.

   c. Invoke the following command to display the External-IP of the `nginx-ingress` LoadBalancer Service: <br /><br />

   ```shell
   kubectl get service nginx-ingress-controller --namespace nginx
   ```

   d. Copy the record to your clipboard or to a text file. You will use the External-IP address to create a CNAME DNS
   record. <br />

   e. Close the web shell.

5. Use your DNS provider to create a wildcard CNAME record that maps to the External-IP for the NGINX Ingress
   Controller. Paste the External-IP you copied from the web shell to create the CNAME record.

:::info

The CNAME record is also known as the host cluster DNS pattern.

:::

<br />

6. Copy the CNAME record to your clipboard.

7. Ensure you are in Palette's Cluster Mode, under the Tenant Admin scope. From the **Main Menu**, select **Cluster
   Groups**, then select the Cluster Group that requires ingress. <br /> <br /> a. From the **Host Clusters** tab,
   select **Settings > Clusters**.

   b. Choose **Ingress** as the **Cluster endpoint type**.

   c. Paste the name of the wildcard CNAME record into the **Host DNS** field.

:::info

If you haven’t yet created a Cluster Group, you can configure each host cluster as described and add them to a new
Cluster Group later.

:::

## Validate

To validate that ingress is functioning as expected, do the following:

1. From the **User Menu**, switch to App Mode and deploy a new virtual cluster. <br /> To learn how to deploy a virtual
   cluster, check out the
   [Add Virtual Clusters to a Cluster Group](../palette-virtual-clusters/deploy-virtual-cluster.md) guide.

2. Use a web shell and type the following command to verify you can connect to the newly deployed virtual cluster:

```shell
 kubectl get namespaces --all-namespaces
```

This should display a list of namespaces as shown in the example:

<br />

```shell hideClipboard
NAME                               STATUS   AGE
default                            Active   4d11h
kube-system                        Active   4d11h
kube-public                        Active   4d11h
kube-node-lease                    Active   4d11h
cluster-63c91f359ae82b46c9bad615   Active   4d11h
app-gamebox-lb-spectro-gamebox     Active   4d11h
```

If an error message displays, it indicates something is wrong with the configuration. Verify the following:

- Each host cluster is deployed with Nginx Ingress Controller.

- The CNAME record correctly maps to the External-IP of the Nginx Ingress Controller’s LoadBalancer Service.

- Cluster Group Settings specify the Cluster endpoint type as **Ingress**, and **Host DNS** specifies the CNAME record
  you created.
