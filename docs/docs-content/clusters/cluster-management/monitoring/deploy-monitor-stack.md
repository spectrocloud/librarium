---
sidebar_label: "Deploy Monitoring Stack"
title: "Deploy Monitoring Stack"
description: "Learn how to deploy a monitoring stack in your Palette environment."
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management", "monitoring"]
---

The monitoring stack you will deploy uses the open source tool,
[Prometheus](https://prometheus.io/docs/introduction/overview/), to support your environment's monitoring requirements.
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

<br />

### Without Authentication

#### Prerequisites

- An infrastructure provider environment registered in Palette. Refer to the [Clusters](../../clusters.md) documentation
  for guidance on how to register your infrastructure provider environment in Palette.

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

    <br />

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
   - Pack Version: 44.25.X or newer. <br />

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

- Experience with DNS and setting up custom domains that use SSL certificates are required for this guide. In addition,
  the following actions are needed.

  - Ability to create and update DNS record names.

  - Two custom domain names. One domain is for the Grafana dashboard, and another is for host clusters to forward
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

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Click on **Add Cluster Profile** to create a new cluster profile.

4. Provide the cluster profile a name and select the type **Full**. Click on **Next**.

5. Select the infrastructure provider and continue.

6. Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and
   container storage interface (CSI). Click on **Next Layer** after each selection. When you have completed selecting
   core infrastructure for the profile, click **Confirm**.

7. In the next screen that displays, select **Add New Pack**.

8. Use the following information to add the Nginx ingress controller pack.

   - Pack Type: Ingress
   - Registry: Public Repo
   - Pack Name: Nginx
   - Pack Version: 1.5.X or newer. <br />

9. Review the YAML configuration on the right and add the following changes:

<br />

```yaml
charts:
  ingress-nginx:
    controller:
      extraArgs:
        enable-ssl-passthrough: true
```

10. Click on **Confirm & Create**.

11. Select **Add New Pack**.

12. Use the following information to find the Prometheus Operator pack.

    - Pack Type: Monitoring
    - Registry: Public Repo
    - Pack Name: Prometheus Grafana
    - Pack Version: 44.3.X or newer. <br />

13. Next, click on the **Presets** button to expand the options drawer.

14. Scroll down the presets option menu and enable **Remote Monitoring**.

15. Review the YAML configuration on the right. Scroll down in the file until you find the parameter
    `grafana.adminPassword`. Input the password value for the admin user. The default admin user name is `admin`.

    <br />

    ```yaml
    charts:
      kube-prometheus-stack:
        grafana:
          adminPassword: "YourPassword"
    ```

16. Next, update the `prometheus.service.type` parameter to `ClusterIP`.

        <br />

        ```yaml
        charts:
          kube-prometheus-stack:
            prometheus:
              service:
                type: ClusterIP
        ```

<!-- prettier-ignore-start -->

17. Confirm your changes by selecting **Confirm & Create**. You can enable several options to expand the functionality
of the monitoring stack. Review the
<VersionedLink text="Prometheus Operator" url="/integrations/packs/?pack=prometheus-operator"/> pack documentation to
learn more about the available options.
<!-- prettier-ignore-end -->

18. Click on **Add New Pack**.

19. Use the following information to find the Spectro Cluster Metrics pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or newer

20. Use the default values. Confirm your changes by selecting **Confirm & Create**.

21. Click on **Add New Pack**.

22. Use the following information to find the Spectro Grafana Dashboards pack.

    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Grafana Dashboards
    - **Pack Version**: 1.0.X or newer

23. Use the default values. Confirm your changes by selecting **Confirm & Create**.

24. Click on **Next** to review the cluster profile and save it.

25. Navigate to the left **Main Menu** and select **Clusters**.

26. Click on **Add New Cluster**. Select **Deploy New Cluster**.

27. Choose the infrastructure provider you selected for the cluster profile you created earlier.

28. Assign a name to the host cluster and select the registered account you will deploy it to. Click on **Next**.

29. Choose the cluster profile you created earlier and complete the remainder of the cluster creation process.

30. Once the host cluster is deployed, navigate to the left **Main Menu** and select **Clusters**. Click on your cluster
    to display the details page and ensure its status is **Running**.

31. Download the Kubernetes configuration file. Click on the URL that has the name of your cluster followed by a period
    and the word _kubeconfig_. Refer to the [Access Cluster with CLI](../palette-webctl.md#access-cluster-with-cli) for
    additional guidance.

32. Open a terminal window and set the environment variable `KUBECONFIG` to point to kubeconfig file you downloaded.

    <br />

    ```shell
    export KUBECONFIG=~/Downloads/dev-monitoring-stack.config
    ```

33. Create an htpasswd file for the user `agent` and assign a password. You can choose a different username if you
    prefer.

    <br />

    ```shell
    htpasswd -c auth agent
    ```

    Output:

    ```shell
    New password: [agent_password_here]
    New password:
    Re-type new password:
    Adding password for user agent
    ```

34. Convert the htpasswd file into a Kubernetes secret.

    <br />

    ```shell
      kubectl create secret generic basic-auth --from-file=auth --namespace monitoring
    ```

    Output:

    ```shell
      secret "basic-auth" created
    ```

35. Navigate back to Palette, and review the cluster profile you created for the monitoring stack. From the left **Main
    Menu** > **Profiles** > select your cluster profile. Click on the Prometheus operator layer to edit the YAML.

36. Locate the `prometheus.ingress` section near the end of the file. Update the ingress configuration with the values
    provided below. Replace the `hosts` parameter with your custom domain.

    <br />

    ```yaml
    ingress:
      enabled: true
      ingressClassName: nginx
      annotations:
        nginx.ingress.kubernetes.io/auth-type: basic
        nginx.ingress.kubernetes.io/auth-secret: basic-auth
        nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
      hosts:
        - metrics.example.com
    ```

37. Confirm your updates on the next screen that displays.

38. From the left **Main Menu**, select **Clusters** and access the monitoring stack host cluster.

39. Click on the **Updates Available** button to review the changes.

40. Accept the changes and select **Confirm Updates**.

:::warning

The following steps can be complex, depending on your environment and your access. Discuss the remaining step with your
network administrator team if you need additional guidance.

:::

41. Create a Canonical Name (CNAME) record for each of the following services and add the load balancer hostname to the
    CNAME record value. Use the table below to identify which mapping to use between the domain and each load balancer
    hostname.

| Service                                             | Domain                   | CNAME Value Example                                                       |
| --------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `nginx-ingress-controller`                          | `metrics.example.com`    | `a57b622a0c0a148189ed00df614481c9-1803006767.us-east-1.elb.amazonaws.com` |
| `prometheus-operator-kube-prometheus-stack-grafana` | `monitoring.example.com` | `a702f8a14b9684a30b18b875d2cca997-1676466159.us-east-1.elb.amazonaws.com` |

![A screenshot of the Palette user interface with two boxes highlighting the load balancers that you need to add to your CNAME.](/clusters_monitoring_deploy-monitor-stack_loadbalancers.webp)

:::info

You can also use `kubectl` to retrieve the load balancer hostname.

Grafana:

```shell
kubectl get service prometheus-operator-kube-prometheus-stack-grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Prometheus:

```shell
kubectl get service nginx-ingress-controller --namespace nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

:::

42. Create a public certificate for each domain. If you are using a public cloud provider, use the native certificate
    manager service to generate a public certificate that you can attach to the load balancers with minimal overhead.
    On-prem, use the default certificate manager used by your organization.

43. Update the network rules for each of the load balancers to allow inbound port 443.

<br />

44. Next, update the load balancer listeners to forward requests from port 443 to the respective target port on the
    monitoring stack. The following table will map the service's load balancer listener with the respective
    configuration. Refer to the architecture diagram from the introduction to help you visualize the mapping.

| Inbound Load Balancer Port | Domain                   | Monitoring Stack Port                                               | Service                                             |
| -------------------------- | ------------------------ | ------------------------------------------------------------------- | --------------------------------------------------- |
| 443                        | `monitoring.example.com` | Use the same instance port the original entry for port 80 is using. | `prometheus-operator-kube-prometheus-stack-grafana` |
| 443                        | `metrics.example.com`    | Use the same instance port the original entry for port 80 is using. | `nginx-ingress-controller`                          |

45. Wait for the DNS changes to propagate. This can take up to five minutes.

Your monitoring stack is now enabled with authentication and network encryption.

#### Validate

To validate the monitoring stack is successfully deployed and ready to receive Prometheus agent requests, use the
following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the monitoring stack cluster to review the details page.

4. Ensure the cluster is in **Running** state.

5. Next, open up your web browser and visit the domain name you specified for the Grafana dashboard. Example:
   `https://monitoring.example.com`.

<br />

6. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile.

7. After you have verified you can log in to the Grafana dashboard, open a new tab and visit the Prometheus endpoint.
   Example: `https://metrics.example.com`

8. Log in with the user `agent` and use the password you specified in the htpasswd file.

:::info

A common error is not updating the network rules to allow inbound connections for port 443 to the load balancers. Ensure
you have updated all the required network rules to allow inbound network requests for port 443.

:::

## Next Steps

Now that you have a monitoring stack deployed and available in your environment, start adding the Prometheus agent to
new and existing clusters. Check out the [Enable Monitoring on Host Cluster](deploy-agent.md) to get started.
