---
sidebar_position: 10
sidebar_label: "Integrate Palette MCP in an Agentic Workflow"
title: "Integrate Palette MCP in an Agentic Workflow"
description:
  "Learn how to integrate the Palette MCP server into an agentic workflow using Langchain. The workflow will identify
  packs in cluster profiles that you want to upgrade or remove, and tag cluster profiles using that instance of a pack,
  along with deployed clusters using that cluster profile"
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

<!-- Tutorial Diagrams: https://app.excalidraw.com/s/172R1vSdAWD/99RvSdETLlo -->

One of the key value propositions of MCP servers is that they provide Large Language Models (LLMs) with access to the
tools that allow them to perform actions. The alternative to using MCP servers is to implement custom logic to interact
with APIs to perform actions. The Palette MCP server can help you power various AI use cases and workflows without
having to implement custom logic.

In this tutorial, you will learn how to integrate the Palette MCP into an agentic workflow that identifies if a specific
pack is present in your environment's cluster profiles and deployed clusters. If the pack is present, the workflow will
ask you what tags you want to apply to the cluster profiles containing the pack and any active clusters using cluster
profiles containing the pack. This will allow you to more readily identify the cluster profiles and active clusters that
are using the pack.

Below is a high-level diagram of the agentic workflow.

![Palette MCP in an agentic workflow](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_architecture.webp)

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - Kind. Use the [Kind Installation](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) guide to install
    Kind.

  - uv. Use the [uv Installation](https://docs.astral.sh/uv/getting-started/installation/) guide to install uv.

  - git. Use the [git Installation](https://git-scm.com/downloads) guide to install git.

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

  - The Palette MCP server is configured in your environment. Refer to the
    [Palette MCP Server](../../../automation/palette-mcp/palette-mcp.md) section for more information.

  - Helm. Use the [Helm Installation](https://helm.sh/docs/intro/install/) guide to install Helm.

- A Palette account.

- A Palette API key. Check out the
  [Create a Palette API Key](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) guide to learn how to
  create a Palette API key. guide for further instructions.
- An OpenAI API key. You can get your OpenAI API key from the
  [OpenAI Platform site](https://platform.openai.com/api-keys).

- Internet access to clone the Palette tutorial repository and interact with OpenAI API.

## Setup

Start by opening a terminal window and clone the Palette tutorial repository.

```bash
git clone git@github.com:spectrocloud/tutorials.git
```

If you already have the Palette tutorial repository cloned, pull the latest changes.

```bash
git pull origin main && git fetch --tags
```

<PartialsComponent category="tutorials" name="checkout-tutorials-tag" />

Change to the tutorial directory that contains the code for this tutorial.

```bash
cd tutorials/ai/palette-mcp/integrate-palette-mcp/
```

Next, initialize the tutorial environment by issuing the following command. This installs the dependencies required for
the tutorial.

```bash
uv sync
```

Start a Kind cluster by issuing the following command.

```bash
kind create cluster --name palette-mcp-agentic-tutorial
```

This starts a Kind cluster named `palette-mcp-agentic`.

```bash hideClipboard
Creating cluster "palette-mcp-agentic-tutorial" ...
 ✓ Ensuring node image (kindest/node:v1.33.1) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-palette-mcp-agentic-tutorial"
You can now use your cluster with:

kubectl cluster-info --context kind-palette-mcp-agentic-tutorial
```

Once the cluster is ready, use the following command to deploy the Kubernetes `metrics-server` through Helm.

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
helm upgrade --install --set args={--kubelet-insecure-tls} metrics-server metrics-server/metrics-server --namespace kube-system
```

:::tip

The flag `--kubelet-insecure-tls` is provided to allow the metrics-server to connect to the Kubernetes API server in the
Kind cluster. Otherwise, the metrics-server will not start due to the self-signed SSL certificate used by the Kubernetes
API server.

:::

### Import Cluster

Use the freshly created Kind cluster to act as a Palette-deployed cluster, reducing deployment time and removing the
need real infrastructure.

Open up a web browser and log in to your Palette account. Navigate to the left main menu and select **Clusters**. From
the cluster list page, click on **Import Cluster** in the top right corner.

![A view of the cluster list page with the Import Cluster button](/tutorials/ai/palette-mcp/ai_palette-mcp_import-cluser-view.webp)

Fill out the following fields.

- Cluster Name: `palette-mcp-agentic-tutorial`
- Cloud Type: `Generic`
- Import mode: `Full-permission mode`

Select **Create & Open Cluster Instance**. Palette redirects you to the cluster details page. A set of instructions with
commands is displayed on the right side of the screen.

![A view of the cluster details page with the import instructions](/tutorials/ai/palette-mcp/ai_palette-mcp_import-instructions.webp)

Copy the command to your clipboard, then paste it into your terminal window where you created the Kind cluster. After a
few moments, the cluster reports a status of **Running** in the cluster details page.

:::tip

In the event you need more detailed instructions on how to import a cluster into Palette, check out the
[Import a Cluster](../../../clusters/imported-clusters/cluster-import.md) guide.

:::

### Import Cluster Profile

The next step is to deploy a Cluster Profile onto the cluster. For this tutorial, a cluster profile is provided for you
to use that contains the Hello Universe pack and the Nginx pack.

Navigate back to the Palette UI. From the left main menu, select **Profiles** > **Import Cluster Profile**. Paste the
following snippet into the text area.

<PartialsComponent category="integrate-palette-mcp-agentic" name="cluster-profile-import" />

![A view of the cluster profile import flow](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_cluster-profile-import.webp)

Select **Validate** and **Confirm** to create the cluster profile.

### Deploy Cluster Profile

Next, deploy the add-on cluster profile to the kind cluster. From the cluster profile list view page, select the row for
the tutorial profile. The details page appears. Then, select **Deploy**.

![A view of the user deploying the add-on profile by selecting the tutorial cluster](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_deploy-cluster-profile.webp)

Palette redirects you to the cluster details page. Select **Save** to deploy the cluster profile. After a few moments,
the hello-universe application and Nginx application are deployed. You can verify the pods are in the "running" state by
issuing the following command.

```shell
kubectl get pods --all-namespaces
```

```shell {8,19} title="Example Output"
NAMESPACE                          NAME                                                                 READY   STATUS    RESTARTS      AGE
cert-manager                       cert-manager-74877f76bd-nwtg7                                        1/1     Running   2 (54m ago)   41h
cert-manager                       cert-manager-cainjector-7f7664d9d8-qkrjg                             1/1     Running   4 (53m ago)   41h
cert-manager                       cert-manager-webhook-75c58f95c4-c267w                                1/1     Running   2 (54m ago)   41h
cluster-69af4d3e45baa7b0b501055a   cluster-management-agent-lite-9d6c5c765-hdltb                        1/1     Running   2 (54m ago)   41h
cluster-69af4d3e45baa7b0b501055a   crony-56c6bc6bdd-fpx6m                                               1/1     Running   3 (54m ago)   41h
cluster-69af4d3e45baa7b0b501055a   palette-lite-controller-manager-56f4f84685-wbq5q                     2/2     Running   0             4m6s
hello-universe                     hello-universe-deployment-7c584458b4-fbkh9                           1/1     Running   0             68s
kube-system                        coredns-674b8bbfcf-8x6k9                                             1/1     Running   2 (54m ago)   42h
kube-system                        coredns-674b8bbfcf-v2q6b                                             1/1     Running   2 (54m ago)   42h
kube-system                        etcd-palette-mcp-agentic-tutorial-control-plane                      1/1     Running   2 (54m ago)   42h
kube-system                        kindnet-nwtf4                                                        1/1     Running   2 (54m ago)   42h
kube-system                        kube-apiserver-palette-mcp-agentic-tutorial-control-plane            1/1     Running   2 (54m ago)   42h
kube-system                        kube-controller-manager-palette-mcp-agentic-tutorial-control-plane   1/1     Running   2 (54m ago)   42h
kube-system                        kube-proxy-jql5v                                                     1/1     Running   2 (54m ago)   42h
kube-system                        kube-scheduler-palette-mcp-agentic-tutorial-control-plane            1/1     Running   2 (54m ago)   42h
kube-system                        metrics-server-5dd7b49d79-gpnlp                                      1/1     Running   3 (54m ago)   41h
local-path-storage                 local-path-provisioner-7dc846544d-s692f                              1/1     Running   3 (54m ago)   42h
nginx                              nginx-ingress-nginx-controller-5567d85c84-jd76d                      1/1     Running   0             68s
palette-system                     palette-webhook-7bf445d996-tdj7j                                     1/1     Running   2 (54m ago)   37h
```

:::info

You may notice that in the cluster details page, the add-on cluster profile remains stuck in a "deploying" state. This
is because the Nginx and Hello Universe both deploy Services that expect a LoadBalancer to be provisioned. Kind does not
natively support the type, LoadBalancer, so the Services remain in a "deploying" state. You can ignore this and proceed
with the tutorial.

:::

## Create Agentic Workflow

It's time to start building out the agentic workflow. Open your favorite text editor and navigate to the
**/agentic-workflow** directory.

The following is the directory structure of the agentic workflow, excluding the `__pycache__` directory.

```shell
.
├── agents
│   ├── __init__.py
│   ├── active_cluster_agent.py
│   ├── palette_profile_agent.py
│   ├── reporter_agent.py
│   └── tagging_agent.py
├── helpers.py
├── main.py
├── pyproject.toml
├── README.md
├── Taskfile.yaml
├── tools.py
└── uv.lock
```

There are a few key files in the agentic workflow:

- `main.py` - The main entry point for the agentic workflow. This is the starting point for the agentic workflow.
- `tools.py` - Custom tools for the agentic workflow. This is where you can add additional custom tools that are not
  part of an MCP server.
- `agents/palette_profile_agent.py` -This agent is responsible for finding the cluster profiles that contain the
  selected pack.
- `agents/active_cluster_agent.py` - This agent is responsible for identifying the active clusters in Palette that are
  using the cluster profiles that contain the selected pack.
- `agents/reporter_agent.py` - This agent is responsible for reporting the results of the agentic workflow.
- `agents/tagging_agent.py` - This agent is responsible for tagging the cluster profiles and the active clusters using
  the cluster profiles with the pack you are looking for.

The agentic workflow is built using the [Langchain](https://langchain.readthedocs.io/en/stable/) framework. The workflow
consists of four agents, each responsible for a different part.

![A diagram of the agentic workflow](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_agentic-overview.webp)

Two agents interact with the Palette MCP to obtain the information they need to perform their tasks. One agent leverages
custom Python logic to perform the tagging of the cluster profiles and the active clusters. The use of custom logic is
common when an MCP server does not have a tool that can perform the task the agent needs. The final agent is responsible
for reporting the results of the agentic workflow, and it does not require any interaction with the Palette MCP or
custom Python logic.

Open each agent Python file and uncomment all code that is commented out. As you uncomment the code, take a moment to
review the comments to gain a deeper understanding. You will notice a pattern of an `init` function that is used to
initialize the agent and an `invoke` function that is used to start the agent.

Next, open the `main.py` file. This is the main entry point for the agentic workflow. Uncomment the code for the `main`
function and review the code.

<PartialsComponent category="integrate-palette-mcp-agentic" name="main-func" />

At a high level, the `main` function initializes the Palette MCP, the agents, and the tools. It also orchestrates the
workflow by calling the agents in the correct order.

## Initalize MCP Overview

In Langchain, you can define an MCP client using the
[`MultiServerMCPClient`](https://docs.langchain.com/oss/python/langchain/mcp) class. By default, an MCP server
connection is stateless. This means that the connection is closed after each request. In a production environment, you
may want to consider using a stateful connection by using the
[`ClientSession`](https://docs.langchain.com/oss/python/langchain/mcp#stateful-sessions) class.

```python
mcp_client = MultiServerMCPClient(
    build_palette_server_config(
        default_env_file=DEFAULT_ENV_FILE,
        default_kubeconfig_dir=DEFAULT_KUBECONFIG_DIR,
        default_mcp_image=DEFAULT_MCP_IMAGE,
    )
)
mcp_tools = await mcp_client.get_tools()
```

The `build_palette_server_config` function is a helper function that builds the configuration for the Palette MCP. The
function is displayed below for your reference. The function is responsible for starting the Docker container that
contains the Palette MCP.

```python
def build_palette_server_config(
    default_env_file: str,
    default_kubeconfig_dir: str | None,
    default_mcp_image: str,
) -> dict[str, dict[str, Any]]:
    container_runtime = resolve_container_runtime()
    env_file = os.getenv("PALETTE_MCP_ENV_FILE", default_env_file)
    kubeconfig_dir = os.getenv("PALETTE_MCP_KUBECONFIG_DIR") or default_kubeconfig_dir
    mcp_image = os.getenv("PALETTE_MCP_IMAGE", default_mcp_image)

    args: list[str] = ["run", "--rm", "-i"]
    if kubeconfig_dir:
        args += ["--mount", f"type=bind,source={kubeconfig_dir},target=/tmp/kubeconfig"]
    args += ["--env-file", env_file, mcp_image]

    return {
        "palette": {
            "transport": "stdio",
            "command": container_runtime,
            "args": args,
        }
    }
```

Each agent is passed the Palette MCP client as a tool. Below is an example of the `initialize_profile_finder_agent`
function receiving the Palette MCP client as a tool.

```python {3}
profile_finder_agent = await initialize_profile_finder_agent(
    model=args.model,
    mcp_tools=mcp_tools,
)
```

Lastly, inside each agent, the agent is created using the
[`create_agent`](https://docs.langchain.com/oss/python/langchain/agents#create_agent) function. This is where the agent
is configured with the LLM, tools, system prompt, and response format.

```python {4}
llm = ChatOpenAI(model=model)
    return create_agent(
        model=llm,
        tools=mcp_tools,
        system_prompt=PROFILE_FINDER_SYSTEM_PROMPT,
        response_format=ProfileDiscoveryOutput,
        checkpointer=InMemorySaver(),
    )
```

:::info

The patterns and functions used in this tutorial are one way to achieve the desired outcome. There are other ways to
initialize agents and configure tools. Check out the
[Langchain Agents](https://docs.langchain.com/oss/python/langchain/agents) guide for more in-depth information.

:::

## Invoke the Agentic Workflow

Once you have uncommented the code for the `main` function and all agent files. The last step is set an OpenAI API key
as an environment variable. Use the following command to set the OpenAI API key as an environment variable.

```shell
export OPENAI_API_KEY=<your-openai-api-key>
```

Replace `<your-openai-api-key>` with your OpenAI API key.

You are now ready to start the agentic workflow. In your terminal, issue the following command.

```shell
uv run python main.py --pack nginx --log-level debug
```

This will start the agentic workflow and search for the Nginx pack in your Palette environment.

```shell hideClipboard
Debug level: debug
Run ID: 1e63f40e
Options:
  --pack:                 'nginx'
  --model:                gpt-5.4
Initializing MCP client...
```

Ater finding the Nginx pack in your Palette environment, the workflow prompts you to enter the tags you want to apply to
the cluster profiles and the active clusters that are using the Nginx pack.

```shell hideClipboard title="Workflow Output"
Matches found. Enter tags to apply to matched cluster profiles and active clusters.
Supported formats:
  key:value -> nginx:found, date:2026-03-11
  single -> review
Press Enter with no input to skip tagging.
```

For example purposes, enter the following tags.

```shell
nginx:found, review
```

Upon completion, the results of the agentic workflow are displayed in your terminal.

```shell
1. Summary

Pack `nginx` was found in 3 of 14 scanned cluster profiles. Among 1 active cluster(s) scanned, 1 active cluster(s) were
confirmed to be using one of the matched profiles; tagging succeeded for 1 active cluster and 2 non-system matched
cluster profiles.

2. Matching cluster profiles

- UID: `63dce2a01ffb92baccb5b5c0`
  - Name: `nginx-ingress`
  - Evidence: spec.published.packs includes pack name 'nginx' with version '1.4.0'.
- UID: `696a800dc5e3142e6896220b`
  - Name: `basic-cluster`
  - Evidence: spec.published.packs includes pack name 'nginx' with version '1.14.3'.
- UID: `69b1a33f308084634c14d377`
  - Name: `tutorial-profile`
  - Evidence: spec.published.packs includes pack name 'nginx' with version '1.14.3'.

3. Active clusters using the matched cluster profiles

- UID: `69b1a2b54d0877725c4205e5`
  - Name: `palette-mcp-agentic-tutorial`
  - Cluster profile UID: `69b1a33f308084634c14d377`
  - Cluster profile name: `tutorial-profile`

// ... remaining output removed for brevity ...
```

## Review Results

Return to your web browser session with the Palette UI and navigate to the **Cluster Profiles** page. Select the cluster
profile you created called **tutorial-profile**. The cluster profile now has the two tags `nginx:found` and `review`.

![The cluster profile details page with the tutorial-profile cluster profile and the nginx:found and review tags](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_tagged-cluster-profile.webp)

Next, navigate to left main menu and select **Clusters**. Select the **palette-mcp-agentic-tutorial** cluster. The
cluster also has the two tags `nginx:found` and `review`.

![The cluster details page with the palette-mcp-agentic-tutorial cluster and the nginx:found and review tags](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_tagged-cluster.webp)

## Clean-up

Use the following steps to clean up the resources you created for this tutorial. Start by deleting the cluster you
created called **palette-mcp-agentic-tutorial**. To delete the cluster, navigate to the left main menu and select
**Clusters**. Select the **palette-mcp-agentic-tutorial** cluster. Then, select **Settings** > **Delete Cluster**.
Confirm the deletion by entering the cluster name when prompted.

Next, navigate to the left main menu and select **Profiles**. Select the **tutorial-profile** cluster profile.
Then, select the three-dot menu > **Delete**. Confirm the deletion by entering the cluster profile name when prompted.

The last step is to delete the Kind cluster you created. Issue the following command in your terminal.

```shell
kind delete cluster --name palette-mcp-agentic-tutorial
```

```shell title="Expected Output"
Deleting cluster "palette-mcp-agentic-tutorial" ... Deleted nodes: ["palette-mcp-agentic-tutorial-control-plane"]
```

## Wrap-up

In this tutorial, you imported a Kind cluster and deployed a cluster profile containing the Hello Universe and Nginx
packs onto the cluster. You then created an agentic workflow that searches for a given pack in your Palette environment
and tags the cluster profiles and active clusters that are using the pack. In this scenario, you found the Nginx pack in
at least one cluster profile and one active cluster.

To achieve this outcome, you used the Langchain framework to create four agents that are responsible for different
parts. The most important aspect of this tutorial is that the agents use the Palette MCP server to interact with your
Palette environment to find all the cluster profiles and active clusters that are using the specified pack.

Without the Palette MCP server, you would have to implement custom logic to interact with the Palette API to find the
cluster profiles and active clusters that are using the pack. This would be more time-consuming but also increase the
maintenance burden. By using the Palette MCP, you can instead leverage the power of LLMs and have them perform the
required tasks through the Palette MCP server without having to implement custom logic.

You can use the code in this tutorial as a starting point to create your own agentic workflows that leverage the Palette
MCP server to interact with your Palette environment. You can craft more complex agentic workflows to solve your
business problems by combining the Palette MCP server with custom tools, other MCP servers, and custom logic.
