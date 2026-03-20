---
sidebar_label: "Deploy Monitoring Stack"
title: "Deploy Monitoring Stack"
description: "Learn how to deploy a monitoring stack in your Palette environment."
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management", "monitoring"]
---

The monitoring stack you will deploy uses the open source tool
[Prometheus](https://prometheus.io/docs/introduction/overview/) to support your environment's monitoring requirements.
The monitoring stack is a centralized server or aggregation spot to which all other clusters will forward metrics. The
monitoring stack is a dedicated Kubernetes cluster for monitoring and metrics aggregation in your Palette environment.

<!-- prettier-ignore-start -->

The monitoring stack uses a server-client architecture. The monitoring stack uses the
<VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator"/> pack to deploy all the dependencies the Prometheus
server requires. The server exposes an API endpoint for all other clients to forward metrics. The clients are Kubernetes
clusters with the <VersionedLink text="Prometheus Agent" url="/integrations/packs/?pack=prometheus-agent"/> pack installed and configured.

Use the following steps to deploy a monitoring stack, and learn how to configure a host cluster to forward metrics to
the monitoring stack.

<!-- prettier-ignore-end -->

:::warning

We recommend you avoid installing applications in your monitoring stack. The monitoring stack will require all the
allocated resources to support Prometheus and incoming metrics from all other clusters.

:::

## Deploy a Monitoring Stack

The steps below will deploy a new host cluster with the Prometheus Operator pack. You can add the Prometheus Operator
pack to an existing cluster if you already have a host cluster deployed in your environment.

The Prometheus Operator pack will install an unsecured Prometheus server by default. Use the **With Authentication and
Encryption** tab for guidance on how to enable authentication.

You can choose to deploy the monitoring stack with or without authentication.

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

#### Create Cluster Profile and Deploy

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Click on **Add Cluster Profile** to create a new cluster profile.

4. Provide the cluster profile a name and select the type **Full**. Click on **Next**.

5. Select the infrastructure provider and continue.

6. Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and
   container storage interface (CSI). Click on **Next Layer** after each selection. When you have completed selecting
   core infrastructure for the profile, click **Confirm**.

7. In the next screen that displays, select **Add New Pack**.

8. Use the following information to find the Prometheus Operator pack.

   - Pack Type: Monitoring
   - Registry: Public Repo
   - Pack Name: Prometheus Grafana
   - Pack Version: 44.25.X or newer.

9. Review the YAML configuration on the right. Scroll down in the file until you find the parameter `adminPassword`.
   Input the password value for the admin user. The default admin user name is `admin`.

10. Next, click on the **Presets** button to expand the options drawer.

<!-- prettier-ignore-start -->

11. Scroll down the presets option menu and enable **Remote Monitoring**. Confirm your changes. You can enable several
options to expand the functionality of the monitoring stack. Review the
<VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator"/> pack documentation to
learn more about the available options.
<!-- prettier-ignore-end -->

12. Confirm your changes by selecting **Confirm & Create**.

13. Click on **Add New Pack**.

14. Use the following information to find the Spectro Cluster Metrics pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or newer

15. Use the default values. Confirm your changes by selecting **Confirm & Create**.

16. Click on **Add New Pack**.

17. Use the following information to find the Spectro Grafana Dashboards pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Grafana Dashboards
    - **Pack Version**: 4.0.X or newer

18. Use the default values. Confirm your changes by selecting **Confirm & Create**.

19. Click on **Next** to review the cluster profile and save it.

20. Navigate to the left **Main Menu** and select **Clusters**.

21. Click on **Add New Cluster**. Select **Deploy New Cluster**.

22. Choose the infrastructure provider you selected for the cluster profile you created earlier.

23. Assign a name to the host cluster and select the registered account you will deploy it to. Click on **Next**.

24. Choose the cluster profile you created earlier and complete the remainder of the cluster creation process.

When you deploy the cluster, a host cluster with Prometheus will be installed and ready to receive information from
Prometheus agents.

#### Validate

To validate the monitoring stack is successfully deployed and ready to receive Prometheus agent requests, use the
following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the monitoring stack cluster to review the details page.

4. Ensure the cluster is in **Running** state.

5. Click on the exposed service URL for the service **prometheus-operator-kube-prometheus-stack-grafana**.

6. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile.

### With Authentication and Encryption

To enable Hypertext Transfer Protocol Secure (HTTPS), you must make several architectural decisions and decide on
various options for setting up the environment. These options range from choosing what will generate the Secure Socket
Layer (SSL) certificates to how incoming requests for Grafana or Prometheus are handled.

The approach presented in this guide is one pattern you can use. However, we encourage you to discuss this pattern with
your system administrator or platform engineering team before changing your infrastructure and Domain Name System (DNS)
resources.

The following diagram represents the infrastructure pattern you will use in this guide to enable HTTPS.

![An architecture diagram that displays the network flow and infrastructure components](/clusters_monitoring_deploy-monitor-stack_https-architecture.webp)

In this guide, the following domains are used to expose the monitoring stack:

| Domain                   | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `metrics.example.com`    | The endpoint that all host clusters will forward Prometheus metrics. |
| `monitoring.example.com` | The Grafana dashboard.                                               |

#### Prerequisites

  - Ability to create and update DNS record names. Two custom domain names are needed: one for the Grafana dashboard, and another for workload clusters to forward
    metrics to the monitoring stack.

  - Ability to create a public certificate for each domain.

- An infrastructure provider environment registered in Palette. Refer to the [Clusters](../../clusters.md) documentation
  for guidance on how to register your infrastructure provider environment in Palette.

- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) or similar basic auth password file generator
  tool.

- The minimum required size for the Prometheus server is 4 CPU, 8 GB Memory, and 10 GB Storage. We recommend the
  monitoring stack have 1.5x to 2x the minimum required size:

  Recommended size:

  - 8 CPU
  - 16 GB Memory
  - 20 GB Storage.

  As new clusters with the Prometheus agent are added to your environment, review the resource utilization and consider
  increasing resources if needed. As the Prometheus documentation recommends, each additional agent requires the
  following resources from the monitoring stack:

  Each added agent:

  - 0.1 CPU
  - 250 MiB Memory
  - 1 GB Storage.

  Refer to the
  [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects)
  documentation for additional guidance.

#### Create Cluster Profile and Deploy

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left **Main Menu** and select **Profiles**.

3.  Click on **Add Cluster Profile** to create a new cluster profile.

4.  Provide the cluster profile a name and select the type **Full**. Click on **Next**.

5.  Select the infrastructure provider and continue.

6.  Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and
    container storage interface (CSI). Click on **Next Layer** after each selection. When you have completed selecting
    core infrastructure for the profile, click **Confirm**.

7.  In the next screen that displays, select **Add New Pack**.

8.  Use the following information to add the Traefik ingress controller pack.

    - **Pack Type**: Ingress
    - **Registry**: Public Repo
    - **Pack Name**: Traefik
    - **Pack Version**: 39.0.X or newer

9. Use the default values. Select **Confirm & Create**.

10. Select **Add New Pack**.

11. Use the following information to find the Prometheus Operator pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Grafana
    - **Pack Version**: 44.3.X or newer.

12. Next, select **Values** and expand the **Presets** drawer.

13. Under **Remote Monitoring**, select **Enable**.

14. Review the YAML configuration on the right. Locate the parameter `grafana.adminPassword`, and enter a password for
    the default `admin` user.

    ```yaml
    charts:
      kube-prometheus-stack:
        grafana:
          adminPassword: "YourPassword"
    ```

15. Next, update the `prometheus.service.type` parameter to `ClusterIP`.

    ```yaml
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
    - **Pack Version**: 3.3.X or newer

19. Use the default values. Select **Confirm & Create**.

20. Select **Add New Pack**.

21. Use the following information to find the Spectro Grafana Dashboards pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Grafana Dashboards
    - **Pack Version**: 1.0.X or newer

22. Use the default values. Select **Confirm & Create**.

23. Select **Next** to review your cluster profile stack. If no changes are needed, select **Finish Configuration**.

24. From the left main menu, select **Clusters** > **Add New Cluster**, and proceed through the cluster creation
    process. The cluster infrastructure must match the type selected when creating the cluster profile for your
    monitoring stack.

    <PartialsComponent category="clusters" name="cluster-deployment-guides" />

25. Once the cluster is deployed, navigate to the left main menu and select **Clusters**. Select your cluster and ensure
    its status is **Running**.

26. Download the cluster's **Kubeconfig File**. Refer to the
    [Access Cluster with CLI](../palette-webctl.md#access-cluster-with-cli) for additional guidance.

27. Open a terminal session and set the variable `KUBECONFIG` to point to kubeconfig file you downloaded.

    ```shell
    export KUBECONFIG=~/Downloads/dev-monitoring-stack.config
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

30. Create a Traefik Middleware resource for basic authentication. This resource references the `basic-auth` secret you
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

31. Return to Palette. From the left main menu, select **Profiles** and choose your monitoring stack profile.

32. From the version drop-down menu, create a new profile version and **Confirm** your changes.
33. Select the `prometheus-operator` layer to edit the YAML.

34. Locate the `prometheus.ingress` section near the end of the file. Update the ingress configuration with the values
    provided below. Replace the `hosts` parameter with your custom domain.

    ```yaml
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

35. Select **Confirm Updates** > **Save Changes**.

36. From the left main menu, select **Clusters** and access the monitoring stack cluster.

37. On the **Profile** tab, expand the version drop-down menu to select the new cluster profile version, and choose
    **Review changes in Editor**. If no changes are needed, select **Apply Changes**.

    :::warning

    The following steps can be complex, depending on your environment and your access. Discuss the remaining step with
    your network administrator team if you need additional guidance.

    :::

38. Create a Canonical Name (CNAME) record for each of the following services and add the load balancer hostname to the
    CNAME record value. Use the table below to identify which mapping to use between the domain and each load balancer
    hostname.

    Use the following commands to retrieve the load balancer hostname for each service.

    ```shell title="Prometheus Grafana"
    kubectl get service prometheus-operator-kube-prometheus-stack-grafana --namespace monitoring --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    ```shell title="Traefik"
    kubectl get service traefik --namespace traefik --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    | **Service**                                         | **Domain**               | **CNAME Example Value**                                                   |
    | --------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
    | `traefik`                                           | `metrics.example.com`    | `a57b622a0c0a148189ed00df614481c9-1803006767.us-east-1.elb.amazonaws.com` |
    | `prometheus-operator-kube-prometheus-stack-grafana` | `monitoring.example.com` | `a702f8a14b9684a30b18b875d2cca997-1676466159.us-east-1.elb.amazonaws.com` |

39. Create a public certificate for each domain. If you are using a public cloud provider, use the native certificate
    manager service to generate a public certificate that you can attach to the load balancers with minimal overhead.
    For on-premises environments, use the default certificate manager used by your organization.

40. Wait for the DNS changes to propagate.

Your monitoring stack is now enabled with authentication and network encryption.

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
