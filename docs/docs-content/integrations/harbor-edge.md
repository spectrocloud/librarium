---
sidebar_label: "harbor-edge"
title: "Harbor Edge Native Config"
description: "Harbor Edge Native Config pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["system-app", "registry"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/harbor/blobs/sha256:5cf19a83449d41a6eb2398194dd4563d31d371074375255ba8a2fc4feff4ef33?type=image/png"
tags: ["packs", "harbor-edge-native-config", "system-app"]
---

Harbor is an open-source registry that secures artifacts with policies and role-based access control. You can install
Harbor on your Edge clusters and use it to store all the images used by the cluster, including your provider images and
all packs used by your cluster. After the initial download, the cluster can pull images from Harbor instead of an
external registry, allowing your cluster to reboot containers or add new nodes without a connection to the external
network.

## Versions Supported

:::info The Harbor Edge-Native Config pack is a system application pack. When you provision a cluster with a profile
that includes this pack, Palette automatically chooses the latest version of Harbor supported by Palette to install on
the cluster. You cannot manually choose a version of this pack.  
:::

<Tabs>
<TabItem value="1.0.0" label="1.0.0">

### Prerequisites

- All Edge devices in your cluster must have at least 4 CPUs and 8 GB of RAM.

- At least 160 GB of persistent storage volume for the cluster. The actual volume required depends on the size of the
  images used by your cluster.

- A Container Storage Interface (CSI) pack is required in your cluster profile.

### Parameters

:::tip You can use a macro to avoid providing credentials in plain text. For more information about macros, refer to
[Macros guide](../clusters/cluster-management/macros.md). :::

| **Parameter**                           | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `harbor-config.auth.password`           | Specifies the password used with the default user name `admin` to authenticate with the Harbor image registry. You cannot change the username. If you don't provide password, a random password is generated and saved to a secret in the cluster named `registry-info` in the `cluster_CLUSTER_UID` namespace, where `CLUSTER_UID` is the unique ID for your cluster. You find this namespace by listing all namespaces in your cluster. This password is automatically configured to be used internally inside the cluster for image pulls, and you would only need it for accessing the Harbor registry from outside the cluster. |
| `harbor-config.auth.certs`              | Specifies the certificate and private key used for authentication with Harbor. The common name or subject alternative name must include the host name `spectro.registry.local` and the Edge cluster's virtual IP address. If you don't provide a certificate or private key, Palette generates a certificate and a private key to use internally within the cluster. You can find the certificate in a secret named `harbor-tls` in the `harbor` namespace.                                                                                                                                                                          |
| `harbor-config.service.serviceType`     | Specifies the service type for the Harbor service. The default service type is NodePort.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `harbor-config.service.harbor`          | Specifies the ports that harbor is exposed on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `harbor-config.storage`                 | Specifies the size of the Harbor's persistent volume claim in GB. You can configure persistent volume claims for `registry`, `jobService`, `database`, `redis`, and `trivy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `harbor-config.service.metrics.enabled` | Specify whether to enable metrics on Harbor. For more information about the kinds of metrics that are exposed, refer to [Harbor metrics documentation](https://goharbor.io/docs/main/administration/metrics/).                                                                                                                                                                                                                                                                                                                                                                                                                       |

### Usage

#### Enable Harbor to Protect Against Outage

You can use Harbor in an Edge cluster that is connected to external networks. Harbor stores all container images
downloaded from the internet and future image pulls from the cluster will be from the local harbor registry. If your
cluster experiences an internet outage, it can still reboot containers or add new nodes using images stored locally in
Harbor. For more information, refer to
[Deploy a Cluster with a Local Harbor Registry](../clusters/edge/networking/local-registry.md).

#### Log in to Harbor Web UI

With Harbor enabled on your Edge cluster, you can log in to Harbor via its web UI. By default, the Harbor service is
accessible as a NodePort-type service with HTTPS enabled on port `30003`. You can use the following steps to log in to
Harbor via the web UI.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, navigate to **Clusters**. Choose your Edge cluster.

3. Navigate to the **Nodes** tab, in the **Private Ips** column, you can find the IP addresses of your Edge hosts.

4. Ensure you have network access to your Edge hosts. Open a new tab in your browser and navigate to
   `https://NODE_IP:30003` and replace `NODE_IP` with any IP address in your cluster. NodePort-type services are exposed
   on the same port on all nodes in your cluster. If you changed the HTTPS port in the configurations, replace the port
   with the HTTPS port you used.

5. If you didn't provide a certificate or used a self-signed certificate, your browser might warn you about an unsafe
   connection. Dismiss the warning, and you will be directed to Harbor's web UI. If you use Google Chrome, you can click
   anywhere in your browser tab and type `this is unsafe` using your keyboard to dismiss the warning.

6. Type in `admin` as the username and your password to log in to Harbor. If you don't know your password, refer to
   [Retrieve Harbor Credentials](#retrieve-harbor-credentials) to retrieve your password.

#### Retrieve Harbor Credentials

During cluster creation, Palette creates two secrets that store the password used to authenticate the `admin` user in
Harbor and the X509 certificate used for TLS. You can access both of these credentials using the following steps:

1. Configure kubectl to access your Kubernetes cluster. For more information, refer to
   [Access a Cluster with CLI](../clusters/cluster-management/palette-webctl.md).

2. Depending on the credential you want to retrieve, use the commands described below.

<Tabs>
<TabItem value="password" label="Password">

1. Issue the command `kubectl get namespaces` to get all namespaces. Look for a namespace called `cluster-CLUSTER-ID`,
   where `CLUSTER-ID` is a string of alphanumeric characters. This is the namespace where the secret for your Harbor
   password is stored.

2. Issue the following command to get the password of your Harbor user. Replace `CLUSTER-ID-NAMESPACE` with the
   namespace you identified in the previous step. This command outputs your password.

```shell
kubectl get secret registry-info --namespace CLUSTER-ID-NAMESPACE --output jsonpath="{.data.SPECTRO_USER_PASSWORD}" | base64 --decode
```

</TabItem>

<TabItem value="certificate" label="X509 certificate">
Issue the following command to retrieve the certificate.

```shell
kubectl get secret harbor-tls --namespace harbor --output jsonpath="{.data.tls\.crt}" | base64 --decode
```

</TabItem>

<TabItem value="private-key" label="Private key">
Issue the following command to retrieve the private key.

```shell
kubectl get secret harbor-tls --namespace harbor --output jsonpath="{.data.tls\.key}" | base64 --decode
```

</TabItem>
</Tabs>

#### Push and Pull Images to Harbor

You can use the following steps to push images to and pull images from the Harbor registry.

:::info If you didn't provide a certificate or are using a self-signed certificate, Docker will refuse to connect to the
registry unless you configure Docker to trust the certificate authority or use a insecure connection for your Harbor
registry. You can configure Docker to use a insecure connection by adding a line
`"insecure-registries": ["REGISTRY_URL"]` in your Docker `daemon.json` file. For more information about `daemon.json`,
refer to [Docker documentation](https://docs.docker.com/config/daemon/). :::

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, navigate to **Clusters**. Choose your Edge cluster.

3. Navigate to the **Nodes** tab, in the **Private Ips** column, you can find the IP addresses of your Edge hosts.

4. Ensure you have network access to your Edge hosts. Log in to Harbor from your command-line interface. The following
   example uses Docker, but you can use any other image management tool. Replace `NODE_IP` with the IP address of any of
   the nodes and replace `HARBOR_PASSWORD` with the password of your Harbor user. If you don't know your password, refer
   to [Retrieve Harbor Credentials](#retrieve-harbor-credentials).

   ```shell
   docker login NODE_IP:30003 --user admin --password HARBOR_PASSWORD
   ```

5. After a successful login, you can start to pull and push images.

  <Tabs>
  <TabItem value="pull-image" label="Pull images">
   To pull an image from the Harbor registry, issue the following command.

```shell
docker pull REGISTRY_URL/PROJECT_NAME/IMAGE_NAME:TAG
```

For example, the following command pulls the image for `kube-vip` from the Harbor registry.

```shell
docker pull 10.10.137.220:30003/spectro-images/gcr.io/spectro-images-public/kube-vip/kube-vip:v0.6.3
```

  </TabItem>

  <TabItem value="push-image" label="Push images">
  To push an image to the Harbor registry, first tag the image with your registry URL.

```shell
docker tag LOCAL_IMAGE:LOCAL_IMAGE_TAG REGISTRY_URL/PROJECT_NAME/IMAGE_NAME:TAG
```

After tagging the image, you can push it to the Harbor registry.

```shell
docker push REGISTRY_URL/PROJECT_NAME/IMAGE_NAME:TAG
```

For example, the following commands tag the local image `alpine:latest` and push it to the Harbor registry.

```
docker tag alpine:latest 10.10.137.220:30003/spectro-images/alpine:latest
docker push 10.10.137.220:30003/spectro-images/alpine:latest
```

  </TabItem>
  </Tabs>

### Known Issues

The following known issues exist in the Harbor 1.0.0 release.

- The Harbor database pod might fail to start due to file permission issues. This is a
  [known issue](https://github.com/goharbor/harbor-helm/issues/1676) in the Harbor GitHub repository. Refer to the
  [Troubleshooting section](#scenario---harbor-db-pod-fails-to-start) for a workaround.

- A cluster may get stuck in the provisioning state if it uses Longhorn as its storage layer. If this happens, remove
  the cluster and try again.

</TabItem>
</Tabs>

## Troubleshooting

### Scenario - Harbor DB Pod Fails to Start

When you start a cluster with the Harbor pack, the **harbor-database** pod might fail to start and get stuck on the
**CrashLoopBackoff** state. It's possible that this is due to known issue with the Harbor pack related to file
permissions. The workaround is to delete the pod and a new pod will be automatically created.

#### Debug Steps

1. Issue the following command to identify the pods with names that start with `harbor-database`.

```shell
kubectl get pods --namespace harbor --output wide
```

2. Delete the pod you identified in the previous step. Replace `POD_NAME` with the name of the pods. If there are
   multiple pods, use the command for each pod.

```shell
kubectl delete pod POD_NAME --namespace harbor
```

## Terraform

You can reference the Harbor Edge-Native Config pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "harbor-edge-native-config" {
  name    = "harbor-edge-native-config"
  version = "1.0.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## Resources

- [Deploy a Cluster with a Local Harbor Registry](../clusters/edge/networking/local-registry.md)

- [Harbor documentation](https://goharbor.io/docs/2.4.0/install-config/)
