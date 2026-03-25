---
sidebar_label: "Deploy Prometheus Monitoring Stack"
title: "Deploy Prometheus Monitoring Stack"
description: "Learn how to deploy a monitoring stack in your Palette environment."
toc_max_heading_level: 4
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management", "monitoring"]
---

You can deploy a dedicated Kubernetes cluster to serve as a centralized monitoring stack for clusters deployed through
Palette. The monitoring stack uses the open source tool [Prometheus](https://prometheus.io/docs/introduction/overview/)
to collect, aggregate, and store metrics forwarded from all other clusters in your environment.

<!-- prettier-ignore-start -->

The monitoring stack uses a server-client architecture. The server uses the
<VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator"/> pack to deploy
Prometheus and its dependencies. It exposes an API endpoint that Kubernetes clusters with the
<VersionedLink text="Prometheus Agent" url="/integrations/packs/?pack=prometheus-agent"/> pack use to forward
metrics. When authentication is enabled, the <VersionedLink text="Traefik" url="/integrations/packs/?pack=traefik"/>
pack provides ingress with Transport Layer Security (TLS) termination and basic authentication for the Prometheus endpoint.

Use the following steps to deploy a monitoring stack, and learn how to configure a host cluster to forward metrics to
the monitoring stack.

<!-- prettier-ignore-end -->

:::warning

We recommend you avoid installing applications in your monitoring stack. The monitoring stack requires all allocated
resources to support Prometheus and incoming metrics from all other clusters.

:::

## Deploy a Monitoring Stack

Use the following steps to deploy a new host cluster with the Prometheus Operator pack. You can add the Prometheus
Operator pack to an existing cluster if you already have a host cluster deployed in your environment.

The Prometheus Operator pack installs an unsecured Prometheus server by default. You can choose to deploy the monitoring
stack with or without authentication.

- [Without Authentication](#without-authentication)
- [With Authentication and Encryption](#with-authentication-and-encryption)

### Without Authentication

#### Prerequisites

- An infrastructure provider environment registered in Palette. Refer to the [Clusters](../../clusters.md) documentation
  for guidance on how to register your infrastructure provider environment in Palette.

- The minimum required size for the Prometheus server is 4 CPUs, 8 GB of memory, and 10 GB of storage. We recommend the
  monitoring stack have 1.5x to 2x the minimum required size. For example:

  - 8 CPUs
  - 16 GB of memory
  - 20 GB of storage

  As new clusters with the Prometheus agent are added to your environment, review the resource utilization and consider
  increasing resources if needed. Each additional agent requires the following resources from the monitoring stack:

  - 0.1 CPUs
  - 250 MiB of memory
  - 1 GB of storage

  Refer to the
  [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects)
  documentation for additional guidance.

#### Create Profile and Deploy Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Profiles**.

3.  Select **Add Cluster Profile** to create a new cluster profile.

4.  Enter a unique cluster profile **Name** and choose **Full** for the cluster profile **Type**. Select **Next**.

5.  Choose the applicable **Infrastructure provider** or **Managed Kubernetes** service and select **Next**.

6.  Select the desired OS, Kubernetes distribution, Container Network Interface (CNI), and Container Storage Interface
    (CSI). Click **Next layer** after each selection. When you have finished building your cluster's core
    infrastructure, select **Confirm**.

7.  On the **Profile Layers** screen, select **Add New Pack**.

8.  Use the following information to find the Prometheus Grafana pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Grafana
    - **Pack Version**: 44.3.X or later

9.  Next, select **Values** and expand the **Presets** drawer.

10. Under **Remote Monitoring**, select **Enable**.

11. Review the YAML configuration. Locate the parameter `grafana.adminPassword`, and enter a password for the default
    `admin` user.

        ```yaml {4}
        charts:
          kube-prometheus-stack:
            grafana:
              adminPassword: "YourPassword"
              podLabels:
                spectrocloud.com/connection: proxy
        ```

    <!-- prettier-ignore-start -->

12. Confirm your changes by selecting **Confirm & Create**. You can enable several options to expand the functionality
    of the monitoring stack. Review the
    <VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator" /> pack documentation
    to learn more about the available options.

<!-- prettier-ignore-end -->

13. Select **Add New Pack**.

14. Use the following information to find the Spectro Cluster Metrics pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or later

15. Use the default values. Select **Confirm & Create**.

16. Select **Add New Pack**.

17. Use the following information to find the Spectro Grafana Dashboards pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Grafana Dashboards
    - **Pack Version**: 1.0.X or later

18. Use the default values. Select **Confirm & Create**.

19. Select **Next** to review your cluster profile stack. If no changes are needed, select **Finish Configuration**.

20. From the left main menu, select **Clusters** > **Add New Cluster**, and proceed through the cluster creation
    process. The cluster infrastructure must match the type selected when creating the cluster profile for your
    monitoring stack.

    <PartialsComponent category="clusters" name="cluster-deployment-guides" />

21. Once the cluster is deployed, navigate to the left main menu and select **Clusters**. Select your cluster and ensure
    its status is **Running** and ready to receive information from Prometheus agents.

#### Validate

To validate the monitoring stack is successfully deployed and ready to receive Prometheus agent requests, use the
following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Select the monitoring stack cluster. Ensure the cluster is in **Running** state.

4. Click on the exposed service URL for the service `prometheus-operator-kube-prometheus-stack-grafana`.

   ![Accessing Grafana using exposed service URL](/deploy-monitor-stack_prometheus-validate.webp)

5. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile.

### With Authentication and Encryption

To enable Hypertext Transfer Protocol Secure (HTTPS), you must make several architectural decisions and decide on
various options for setting up the environment. These options range from choosing what will generate the Secure Socket
Layer (SSL) certificates to how incoming requests for Grafana or Prometheus are handled.

The approach presented in this guide is one pattern you can use. However, we encourage you to discuss this pattern with
your system administrator or platform engineering team before changing your infrastructure and Domain Name System (DNS)
resources.

The following diagram represents the infrastructure pattern you will use in this guide to enable HTTPS.

![An architecture diagram that displays the network flow and infrastructure components](/clusters_monitoring_deploy-monitor-stack_https-architecture.webp)

In this guide, the following domains are used to expose the monitoring stack.

| **Domain**               | **Description**                                                    |
| ------------------------ | ------------------------------------------------------------------ |
| `metrics.example.com`    | The endpoint that all host clusters forward Prometheus metrics to. |
| `monitoring.example.com` | The Grafana dashboard.                                             |

#### Prerequisites

- Ability to create and update DNS record names. Two custom domain names are needed: one for the Grafana dashboard, and
  another for workload clusters to forward metrics to the monitoring stack.

- Ability to create a public certificate for each domain.

- An infrastructure provider environment registered in Palette. Refer to the [Clusters](../../clusters.md) documentation
  for guidance on how to register your infrastructure provider environment in Palette.

- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) or similar basic auth password file generator
  tool.

- The minimum required size for the Prometheus server is 4 CPUs, 8 GB of memory, and 10 GB of storage. We recommend the
  monitoring stack have 1.5x to 2x the minimum required size. For example:

  - 8 CPUs
  - 16 GB of memory
  - 20 GB of storage

  As new clusters with the Prometheus agent are added to your environment, review the resource utilization and consider
  increasing resources if needed. Each additional agent requires the following resources from the monitoring stack:

  - 0.1 CPUs
  - 250 MiB of memory
  - 1 GB of storage

  Refer to the
  [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects)
  documentation for additional guidance.

#### Create Profile and Deploy Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Profiles**.

3.  Select **Add Cluster Profile** to create a new cluster profile.

4.  Enter a unique cluster profile **Name** and choose **Full** for the cluster profile **Type**. Select **Next**.

5.  Choose the applicable **Infrastructure provider** or **Managed Kubernetes** service and select **Next**.

6.  Select the desired OS, Kubernetes distribution, Container Network Interface (CNI), and Container Storage Interface
    (CSI). Click **Next layer** after each selection. When you have finished building your cluster's core
    infrastructure, select **Confirm**.

7.  On the **Profile Layers** screen, select **Add New Pack**.

8.  Use the following information to add the Traefik ingress controller pack.

    - **Pack Type**: Ingress
    - **Registry**: Public Repo
    - **Pack Name**: Traefik
    - **Pack Version**: 39.0.X or later

9.  Use the default values. Select **Confirm & Create**.

10. Select **Add New Pack**.

11. Use the following information to find the Prometheus Grafana pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Grafana
    - **Pack Version**: 44.3.X or later

12. Next, select **Values** and expand the **Presets** drawer.

13. Under **Remote Monitoring**, select **Enable**.

14. Review the YAML configuration. Locate the parameter `grafana.adminPassword`, and enter a password for the default
    `admin` user.

    ```yaml {4}
    charts:
      kube-prometheus-stack:
        grafana:
          adminPassword: "YourPassword"
          podLabels:
            spectrocloud.com/connection: proxy
    ```

15. Locate the `prometheus.ingress` section. Update the ingress configuration with the values provided below. Replace
    the `hosts` parameter with your custom domain.

    ```yaml {13}
    charts:
      kube-prometheus-stack:
        prometheus:
          ingress:
            enabled: true
            ingressClassName: "traefik"
            annotations:
              {
                traefik.ingress.kubernetes.io/router.middlewares: monitoring-basic-auth@kubernetescrd,
                traefik.ingress.kubernetes.io/router.entrypoints: websecure,
                traefik.ingress.kubernetes.io/router.tls: "true",
              }
            hosts: [metrics.example.com]
    ```

16. Next, update the `prometheus.service.type` parameter to `ClusterIP`.

    ```yaml {5}
    charts:
      kube-prometheus-stack:
        prometheus:
          service:
            type: ClusterIP
    ```

<!-- prettier-ignore-start -->

16. Confirm your changes by selecting **Confirm & Create**. You can enable several options to expand the functionality
of the monitoring stack. Review the
<VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator"/> pack documentation to
learn more about the available options.

<!-- prettier-ignore-end -->

17. Select **Add New Pack**.

18. Use the following information to find the Spectro Cluster Metrics pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or later

19. Use the default values. Select **Confirm & Create**.

20. Select **Add New Pack**.

21. Use the following information to find the Spectro Grafana Dashboards pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Grafana Dashboards
    - **Pack Version**: 1.0.X or later

22. Use the default values. Select **Confirm & Create**.

23. Select **Next** to review your cluster profile stack. If no changes are needed, select **Finish Configuration**.

24. From the left main menu, select **Clusters** > **Add New Cluster**, and proceed through the cluster creation
    process. The cluster infrastructure must match the type selected when creating the cluster profile for your
    monitoring stack.

    <PartialsComponent category="clusters" name="cluster-deployment-guides" />

25. Once the cluster is deployed, navigate to the left main menu and select **Clusters**. Select your cluster and ensure
    its status is **Running**.

26. Download the cluster's **Kubeconfig File**. Refer to
    [Access Cluster with CLI](../palette-webctl.md#access-cluster-with-cli) for additional guidance.

27. Open a terminal session and set the variable `KUBECONFIG` to point to kubeconfig file you downloaded.

    ```shell
    export KUBECONFIG=<path-to-kubeconfig>
    ```

28. Create an `htpasswd` file for the user `agent` and assign a password. You can choose a different username if you
    prefer.

    ```shell
    htpasswd -c auth agent
    ```

    ```shell title="Example output" hideClipboard
    New password: <agent-password>
    Re-type new password:
    Adding password for user agent
    ```

29. Convert the `htpasswd` file into a Kubernetes secret. If you created a user other than `agent`, update the value for
    the `--from-file` flag.

    ```shell
    kubectl create secret generic basic-auth --from-file=auth --namespace monitoring
    ```

    ```shell title="Example output" hideClipboard
    secret/basic-auth created
    ```

30. Create a Traefik Middleware resource for basic authentication. This resource references the `basic-auth` secret
    created in the previous step.

    ```shell
    cat <<EOF | kubectl apply --namespace monitoring --filename -
    apiVersion: traefik.io/v1alpha1
    kind: Middleware
    metadata:
      name: basic-auth
      namespace: monitoring
    spec:
      basicAuth:
        secret: basic-auth
    EOF
    ```

    ```shell title="Example output" hideClipboard
    middleware.traefik.io/basic-auth created
    ```

    :::warning

    The following steps can be complex, depending on your environment and your access. Discuss the remaining steps with
    your network administrator team if you need additional guidance.

    :::

31. Create a Canonical Name (CNAME) record for each of the following services and add the load balancer hostname to the
    CNAME record value.

    Use the following commands to retrieve the load balancer hostname for each service.

    ```shell title="Prometheus Grafana"
    kubectl get service prometheus-operator-kube-prometheus-stack-grafana --namespace monitoring --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    ```shell title="Traefik"
    kubectl get service traefik --namespace traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    Use the following table to identify which mapping to use between the domain and each load balancer hostname.

    | **Service**                                         | **Domain**               | **CNAME Example Value**                                                   |
    | --------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
    | `prometheus-operator-kube-prometheus-stack-grafana` | `monitoring.example.com` | `a702f8a14b9684a30b18b875d2cca997-1676466159.us-east-1.elb.amazonaws.com` |
    | `traefik`                                           | `metrics.example.com`    | `a57b622a0c0a148189ed00df614481c9-1803006767.us-east-1.elb.amazonaws.com` |

32. Create a public certificate for each domain. If you are using a public cloud provider, use the native certificate
    manager service to generate a public certificate that you can attach to the load balancers with minimal overhead.
    For on-premises environments, use the default certificate manager used by your organization.

33. Wait for the DNS changes to propagate. This may take several minutes.

#### Validate

To validate the monitoring stack is successfully deployed and ready to receive Prometheus agent requests, use the
following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Select the monitoring stack cluster. Ensure the cluster is in **Running** state.

4. Open your web browser and visit the domain name you specified for the Grafana dashboard. For example:
   `https://monitoring.example.com`.

5. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile.

6. After you have verified you can log in to the Grafana dashboard, open a new tab and visit the Prometheus endpoint.
   For example: `https://metrics.example.com`.

7. Log in with the user `agent` and use the password you specified in the `htpasswd` file.

## Next Steps

Now that you have a monitoring stack deployed and available in your environment, start adding the Prometheus agent to
new and existing clusters. Check out [Enable Monitoring on Host Cluster](deploy-agent.md) to get started.
