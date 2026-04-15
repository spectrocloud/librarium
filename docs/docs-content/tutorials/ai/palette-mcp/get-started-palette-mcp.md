---
sidebar_position: 10
sidebar_label: "Get Started with the Palette MCP Server"
title: "Get Started with the Palette MCP Server"
description: "Learn how to use the Palette MCP Server to connect to and debug cluster deployments."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) provides an abstraction layer over the
Palette API, allowing you to interact with Kubernetes resources through natural language. It interprets user intent,
translates it into appropriate API requests, and returns structured responses for LLMs to process. By handling the
complexity of the underlying API, it allows language models to interact with Palette in a consistent and reliable way
without requiring that users have a detailed knowledge of the API itself.

In this tutorial, you will learn how to use the Palette MCP server to debug cluster deployment issues. You will begin by
importing a cluster profile which has some deliberate errors and use this profile to create a new Palette cluster. Then,
you will use the Palette MCP server to debug these errors and ensure that your cluster works as expected.

This tutorial uses [Amazon Web Services](https://aws.amazon.com) and
[Claude Code](https://code.claude.com/docs/en/overview) with the Claude Sonnet 4.6 model. You can use a cloud provider
and MCP client that suits your needs to follow along.

Below is a high-level diagram of the MCP server workflow. Your MCP client interacts with the Palette MCP server, which
directly communicates with the Palette API. The Palette MCP Server downloads the
[kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file for your cluster, which is then used by the MCP
client to gather information about the cluster using the [kubectl](https://kubernetes.io/docs/reference/kubectl/)
command line tool.

![MCP Server operation overview](/tutorials/ai/get-started-palette-mcp_mcp-overview.webp)

## MCP Server Capabilities

<PartialsComponent category="palette-mcp" name="mcp-tools" />

Refer to the [Palette MCP Server Operations](../../../automation/palette-mcp/palette-mcp-operations.md) page to learn
what operations the MCP server provides.

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - The Palette MCP server configured and set up. Refer to the applicable setup guide for
    [Claude](../../../automation/palette-mcp/setup/mcp-setup-claude.md),
    [Cursor](../../../automation/palette-mcp//setup/mcp-setup-cursor.md), or the
    [Gemini CLI](../../../automation/palette-mcp/setup/mcp-setup-gemini.md).

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

  - Kubectl installed locally. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) for
    additional guidance.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Import a Cluster Profile

In this section, you will import a cluster profile into Palette. This profile will be used to deploy a cluster.

:::warning

For learning purposes, there are two errors in these cluster profiles. Avoid using them in workloads outside this
tutorial.

:::

<PartialsComponent category="palette-mcp" name="getting-started-mcp-cluster-profiles" />

Click **Validate**. Palette displays a _Validated successfully_ message. Click **Confirm**. The cluster profile is
created.

## Deploy a Cluster

Next, you will deploy a cluster using the imported cluster profile. From the left main menu, select **Profiles**. Then,
select the row for the tutorial profile. The details page appears. Then, select **Deploy**. Select **OK** in the
**Create a new cluster?** dialog.

Fill in the required cluster information and configuration deploy cluster wizard. Refer to the
[Deploy a Cluster to Amazon Web Services (AWS)](../../getting-started/palette/aws/aws.md) or
[Deploy a Cluster to Microsoft Azure](../../getting-started/palette/azure/azure.md) sections for more information on
cluster creation.

Navigate to the left **Main Menu** and select **Clusters**. The cluster deployment process can take 15 to 30 minutes.
Deployment time varies depending on the cloud provider, cluster profile, cluster size, and node pool configurations
provided.

![Deployed cluster](/tutorials/ai/get-started-palette-mcp_deployed-cluster.webp)

Palette indicates that the cluster is deployed successfully, but the Hello Universe add-on is unable to deploy
succesfully.

## Debug the Cluster

The cluster you have deployed does not succesfully deploy the Hello Universe add-on application. In this section, uou
will use the Palette MCP server investigate and debug these errors.

Open your MCP client.

Send a query asking to download the [kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file for one of
your running clusters. For example, you can ask "Download the kubeconfig file for the `<cluster-name>` Palette cluster."
Replace the placeholder with your cluster name. The Palette MCP server uses the `getKubeconfig` tool to download the
kubeconfig file for you cluster from Palette.

```shell hideClipboard title="Example Output"
❯ Download the kubeconfig file for the `get-started-palette-mcp-cluster` Palette cluster.

⏺ I'll first find the cluster UID by listing clusters, then download the kubeconfig.

  Called palette (ctrl+o to expand)

⏺ Found the cluster. Now let me load and call the getKubeconfig tool.

  Called palette (ctrl+o to expand)

⏺ The kubeconfig for get-started-palette-mcp-cluster has been downloaded successfully.

  As noted in the CLAUDE.md instructions, the file was written inside the MCP container at /tmp/kubeconfig/69df9741978d9f786aacf13a.kubeconfig, which is synced to
  your host machine at $HOME/.palette/kubeconfig.

  To use it with kubectl:

  export KUBECONFIG="$HOME/.palette/kubeconfig"
  kubectl get nodes

  Or per-command:

  kubectl --kubeconfig="$HOME/.palette/kubeconfig" get pods -A
```

Investigate if there any failing pods or deployments on your cluster. For example, you can ask "Run kubectl to connect
to the `<cluster-name>` Palette cluster and list any failing pods or deployments." Replace the placeholder with your
cluster name. Your MCP client uses the previously downloaded kubeconfig file to connect to your cluster using kubectl
and investigate the failures.

```shell hideClipboard title="Example Output"
❯ Run kubectl to connect to the `get-started-palette-mcp-cluster` Palette  cluster and list any failing pods or deployments.

⏺ The kubeconfig path is a directory. Let me find the actual file.
  Listed 1 directory (ctrl+o to expand)

⏺ Bash(KUBECONFIG="$HOME/.palette/kubeconfig/69df9741978d9f786aacf13a.kubeconfig" kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded 2>…)

  ⎿  NAMESPACE        NAME                                         READY   STATUS             RESTARTS   AGE
     hello-universe   hello-universe-deployment-84ff79b6cc-42ggl   0/1     ImagePullBackOff   0          19m

⏺ Bash(KUBECONFIG="$HOME/.palette/kubeconfig/69df9741978d9f786aacf13a.kubeconfig" kubectl describe pod -n hello-universe hello-universe-deployment-84ff79b6cc-42ggl 2>&…)
  ⎿      Environment:  <none>
         Mounts: /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-84hpm (ro)
     … +29 lines (ctrl+o to expand)

⏺ Here's a summary of what's failing:

  Failing Pod
  - Namespace: hello-universe
  - Pod: hello-universe-deployment-84ff79b6cc-42ggl
  - Status: ImagePullBackOff

  Root Cause
  The pod is trying to pull a container image with an invalid tag:
  ghcr.io/spectrocloud/hello-universe:invalid
  The tag invalid does not exist in the registry, so Kubernetes can't pull it and the pod never starts.

  Affected Deployment

  - hello-universe/hello-universe-deployment — 0/1 ready (0 available replicas)

  All other deployments across the cluster are healthy (READY matches desired count). The only issue is the bad image tag in the hello-universe deployment.
```

The Palette MCP server idenfities that the cluster profile provides an invalid image tag for the Hello Universe
deployment.

Navigate back to your [Palette](https://console.spectrocloud.com) tab in the browser. From the left main menu, select
**Profiles**. Then, select the row for the tutorial profile.

Select the **Hello Universe** pack layer. View the configuration of the pack values.

The `hello-universe` pack sets the image tag used for deploying the
[`hello-universe` application](https://github.com/spectrocloud/hello-universe) in the
`manifests.hello-universe.images.hellouniverse` field of the `hello-universe` add-on pack. The configured image tag does
not exist.

```yaml {4}
manifests:
  hello-universe:
    images:
      hellouniverse: ghcr.io/spectrocloud/hello-universe:invalid
    apiEnabled: false
    namespace: hello-universe
    port: 8080
    replicas: 1
```

Change the `manifests.hello-universe.images.hellouniverse` field to the valid
`ghcr.io/spectrocloud/hello-universe:1.3.1` tag.

```yaml {4}
manifests:
  hello-universe:
    images:
      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.1
    apiEnabled: false
    namespace: hello-universe
    port: 8080
    replicas: 1
```

Select **Confirm Updates** and then **Save Changes**.

From the left main menu, select **Clusters**. Then, select the row for the tutorial cluster.

The cluster has a pending update for for the fixed cluster profile. Select **Updates** to apply the cluster profile
update. Review the changes and select **Apply Changes**.

Wait for Palette to reconcile and apply the changes. All layers of the cluster are now successfully deployed.

![Healthy cluster](/tutorials/ai/get-started-palette-mcp_deployed-cluster-healthy.webp)

Download the [kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file for your cluster from the Palette UI.
This file enables you and other users to issue kubectl commands against the host cluster.

Open a terminal window and set the environment variable `KUBECONFIG` to point to the kubeconfig file you downloaded.
Issue the following command, replacing the placeholder `<local-path>/admin.<cluster-name>.kubeconfig` with the path to
your kubeconfig file.

```shell
export KUBECONFIG=<local-path>/admin.<cluster-name>.kubeconfig
```

Forward the Kubecost UI to your local network, as described in
[Navigating the Kubecost UI](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=navigating-kubecost-ui). The
Kubecost dashboard is not exposed externally by default, so the command below will allow you to access it locally on
port **9090**. If port 9090 is already taken on your machine, you can choose a different one.

```shell
kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090
```

Open your browser window and navigate to `http://localhost:9090`. The Kubecost UI does not display succesfully. There is
another issue with the deployed cluster profile. Navigate back to your terminal and check the output of the port-forward
command. The output shows that it cannot connect to port `9090`.

```shell hideClipboard title="Example Output"
kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
Handling connection for 9090
E0415 15:42:50.279509   35707 portforward.go:409] an error occurred forwarding 9090 -> 9090: error forwarding port 9090 to pod f9a0eb6a998a66293c374695a291d64d4ef96dfa93a1bd7c29c74cc60139c675, uid : failed to execute portforward in network namespace "/var/run/netns/cni-86d3ee8d-8794-adcf-b7f4-961cc63aafe4": failed to connect to localhost:9090 inside namespace "f9a0eb6a998a66293c374695a291d64d4ef96dfa93a1bd7c29c74cc60139c675", IPv4: dial tcp4 127.0.0.1:9090: connect: connection refused IPv6 dial tcp6 [::1]:9090: connect: connection refused
E0415 15:42:50.284677   35707 portforward.go:347] error creating error stream for port 9090 -> 9090: EOF
error: lost connection to pod
```

Navigate back to your MCP client.

Send a query asking the Palette MCP server to investigate why the port-forward command does not work as expected. For
example, you can ask "Investigate why the following command
`kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090` fails to connect to a pod in the
`<cluster-name>` Palette cluster." Replace the placeholder with your cluster name. Your MCP client uses the downloaded
kubeconfig file to connect to your cluster using kubectl and investigate the cause of the error.

```shell hideClipboard title="Example Output"
❯ Investigate why the following command `kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090` fails to connect to a pod in the `get-started-palette-mcp-cluster` Palette cluster.

⏺ I'll investigate this step by step — first getting the kubeconfig for the cluster, then examining the deployment and pods.

⏺ Let me start by getting the kubeconfig for the cluster using the Palette MCP tools.

⏺ Agent(Get kubeconfig for Palette cluster)
  ⎿  Done (4 tool uses · 17.6k tokens · 29s)
  (ctrl+o to expand)

⏺ Good, kubeconfig is ready. Now let me investigate the kubecost deployment and pods.

⏺ Bash(KUBECONFIG="$HOME/.palette/kubeconfig/69df9741978d9f786aacf13a.kubeconfig" kubectl get pods -n kubecost 2>&1 && echo "---" &&
      KUBECONFIG="$HOME/.palette/kubecon…)
  ⎿  NAME                                                              READY   STATUS    RESTARTS   AGE
     cost-analyzer-cost-analyzer-7fbcd75b49-wn5x9                      2/2     Running   0          53m
     cost-analyzer-cost-analyzer-kube-state-metrics-79d95b67d8-qls2q   1/1     Running   0          53m
     … +6 lines (ctrl+o to expand)

⏺ The pods are running fine. Let me check what ports the cost-analyzer container exposes and verify port 9090.

⏺ Port 9090 is exposed by cost-model container. Let me now try the port-forward and capture the exact error.

⏺ Found the root cause. The error shows connection refused when trying to connect to localhost:9090 inside the pod's network namespace. Let me verify what the cost-model container is actually listening on.

⏺ Now I have the full picture. Here's the diagnosis:

  Root Cause
  The port-forward fails because port 9090 is not listening inside the cost-analyzer-cost-analyzer deployment. The error from kubectl is explicit:

  failed to connect to localhost:9090 inside namespace "...": connection refused

  Here's what's actually listening across the kubecost deployments:
  ┌───────────────────────────────────────────────┬────────────────────────────────┬──────────────────┐
  │                  Deployment                   │           Container            │      Ports       │
  ├───────────────────────────────────────────────┼────────────────────────────────┼──────────────────┤
  │ cost-analyzer-cost-analyzer                   │ cost-model                     │ 8080, 8443, 9003 │
  ├───────────────────────────────────────────────┼────────────────────────────────┼──────────────────┤
  │ cost-analyzer-cost-analyzer                   │ cost-analyzer-frontend (nginx) │ 8080             │
  ├───────────────────────────────────────────────┼────────────────────────────────┼──────────────────┤
  │ cost-analyzer-cost-analyzer-prometheus-server │ prometheus                     │ 9090 ✓           │
  └───────────────────────────────────────────────┴────────────────────────────────┴──────────────────┘
  Port 9090 belongs to the Prometheus server deployment, not the cost-analyzer deployment. The Helm chart declares port 9090 in the cost-analyzer-cost-analyzer
  container spec, but the running application does not bind to it — it uses port 9003 (cost-model API) and 8080 (nginx UI frontend) instead. This is a change in
  newer Kubecost versions where the UI and API were split.

  Fix

  Depending on what you want to access:

  Kubecost UI (nginx frontend):
  kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090:8080
  Then open http://localhost:9090.

  Kubecost cost-model API:
  kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9003

  Prometheus directly:
  kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer-prometheus-server 9090
```

Navigate back to your [Palette](https://console.spectrocloud.com) tab in the browser. From the left main menu, select
**Profiles**. Then, select the row for the tutorial profile.

Select the **Kubecost** pack layer. View the configuration of the pack values. The cluster profile has configured the
pack to expose the service on port 8080. The solution identified by the Palette MCP server is correct.

```yaml {4}
service:
  type: ClusterIP
  port: 8080
  targetPort: 8080
  # nodePort:
  labels: {}
  annotations: {}
```

Navigate back to your terminal window and change the port forward command to forward the service port 8080, as suggested
by the response from your MCP client.

```shell
kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090
```

Navigate back to your browser window and view`http://localhost:9090`. The Kubecost now successfully appears and UI
provides you with a variety of cost visualization tools.

![Image that shows the Kubecost UI](/getting-started/getting-started_update-k8s-cluster_kubecost-ui.webp)

Once you are done exploring locally, you can stop the `kubectl port-forward` command by closing the terminal window it
is executing from.

## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters**. Select the tutorial cluster to
access its details page.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with
the delete step. The deletion process takes several minutes to complete.

<PartialsComponent category="clusters" name="force-delete-callout" />

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you
created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the
selection to remove the cluster profile.

## Wrap-up

In this tutorial, you imported a cluster profile that had two errors and deployed a cluster using this cluster profile.
Then, you used the Palette MCP Server to debug the cluster, understand the cause of the errors, and identify fixes to
the errors encountered. This is a common engineering workflow that can be greatly streamlined using the MCP Server.

The Palette MCP Server has many more capabilities than those we have explored in this tutorial. We encourage you to
check out [Integrate Palette MCP in an Agentic Workflow](./integrate-palette-mcp-agentic.md) tutorial to explore a more
advanced usecase for the tools in the MCP server.
