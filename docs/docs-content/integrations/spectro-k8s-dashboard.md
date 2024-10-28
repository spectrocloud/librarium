---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description:
  "Palette's pre-configured Kubernetes Dashboard Monitoring pack reduces the complexity of standing up the Kubernetes
  dashboard for a cluster."
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "arm64", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image.webp"
tags: ["packs", "spectro-k8s-dashboard", "monitoring"]
---

## Versions Supported

<Tabs groupId="parent">
<TabItem label="2.7.x" value="2.7.x">

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->

The Kubernetes Dashboard pack automatically installs the
<VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse
proxy to expose the Kubernetes dashboard and give you access to the host cluster.

1.  To access the dashboard, connect to the cluster remotely. Refer to the
    [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide for
    further details on how to connect using [Kubectl](https://kubernetes.io/docs/tasks/tools/).

2.  Execute the following command from the terminal window to obtain a bearer token. Make a note of the issued token.

    ```bash
    kubectl create token kubernetes-dashboard --namespace kubernetes-dashboard
    ```

    The following example shows what a token value might look like.

    ```yaml hideClipboard
    eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
    ```

3.  Issue the following command to forward connections from the deployed Kubernetes Dashboard to your local port 8080.
    <!-- prettier-ignore-end -->

        ```bash
        kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
        ```

4.  Navigate to `https://localhost:8080` in a browser of your choice to access the Kubernetes Dashboard. The dashboard
    login page appears.

        ![Kubernetes dashboard login page](/integrations_spectro-k8s-dashboard_login-page.webp)

5.  Ensure that **Token** is selected. Then, paste the token value you issued earlier into the token field. Click **Sign
    in**. The Kubernetes Dashboard appears.

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Log in to [Palette](https://console.spectrocloud.com) and click **Profiles** from the left **Main Menu**. Select the
   profile configured with the Kubernetes Dashboard.

2. Select the **spectro-k8s-dashboard** pack and click **Values** under the **Pack Details** section.

3. Ensure the `service.type` parameter is set to "ClusterIP".

4. Set the `ingress.enabled` parameter to "true" to enable ingress.

5. Set ingress rules, such as annotations, path, hosts, and any other rules. This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>
</Tabs>

## Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s-dashboard" {
 name    = "spectro-k8s-dashboard"
 version = "2.7.1"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```
