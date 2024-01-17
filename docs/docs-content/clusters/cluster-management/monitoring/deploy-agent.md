---
sidebar_label: 'Enable Monitoring on Host Cluster'
title: 'Enable Monitoring on Host Cluster'
description: 'Learn how to configure your host cluster to forward metrics to a Prometheus server.'
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster management", "monitoring"]
---


Observability (O11y) of Kubernetes clusters and their metrics is an important operational capability. Palette provides a pack that collects metrics from host clusters, which can be scraped by a monitoring stack.

The steps below will teach you how to create a Prometheus agent cluster add-on profile to deploy on the host clusters you would like to monitor. Creating an add-on profile makes it easier for you to deploy the Prometheus agent to other host clusters in the future. You will use this add-on profile when deploying a new host cluster, but you can also apply the add-on profile to an existing cluster to send metrics to the monitoring stack.


## Create Add-on Profile and Deploy Cluster

Use the following steps to create an add-on profile and deploy a host cluster with the Prometheus agent installed. You can choose to deploy the Prometheus agent with or without authentication and encryption.

- [Without Authentication](#without-authentication)

- [With Authentication and Encryption](#with-authentication-and-encryption)


### Prerequisites


- A monitoring stack. Check out the [Deploy Monitoring Stack](deploy-monitor-stack.md) guide to learn how to deploy a monitoring stack in your Palette environment.


- An infrastructure provider environment registered in Palette. Refer to the [Clusters](../../clusters.md) documentation for guidance on how to register your infrastructure provider environment in Palette.

<!-- <Tabs queryString="security">

<TabItem label="Without Authentication" value="without-auth-agent"> -->

### Without Authentication

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Add-on**. Click on **Next**.


5. In the following screen, select **Add New Pack**.


6. Use the following information to find the Prometheus Agent pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Agent
    - **Pack Version**: 19.0.X or newer.


7. Review the YAML configuration on the right. Navigate down the file until you find the parameter `url` in the `remoteWrite` section. The `remoteWrite.url` is exposed by the monitoring stack. The Prometheus server URL can be found by reviewing the details of the monitoring stack. Use the URL exposed by the Prometheus service. 

    The following image displays the cluster details page of a monitoring stack. Use the URL exposed for port 9090 to populate the `remoteWrite.url` parameter.

![A view of the cluster details page with a highlighted box around the Prometheus service URL](/integrations_prometheus-agent_cluster-detail-view.png)

<br />

:::warning

The Prometheus server URL must be in the format of `http://HOST:PORT/api/v1/write`. 
Example: `http://a2c938972938b4f0daee5f56edbd40af-1690032247.us-east-1.elb.amazonaws.com:9090/api/v1/write`

:::

<br />

```yaml
charts:
  prometheus:
    server:
      remoteWrite:
        - url: "http://a2c938972938b4f0daee5f56edbd40af-1690032247.us-east-1.elb.amazonaws.com:9090/api/v1/write"
```

8. Confirm your changes by selecting **Confirm & Create**.


9. Click on **Add New Pack**.


10. Use the following information to find the Spectro Cluster Metrics pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or newer


11. Use the default values. Confirm your changes by selecting **Confirm & Create**.


12. Click on **Next** to review the cluster profile. Save the cluster profile.


13. Navigate to the left **Main Menu** and select **Clusters**.


14. Click on **Add New Cluster**. Select **Deploy New Cluster**.


15. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


16. Assign a name to the host cluster and select the registered account that will deploy it.  Click on **Next**.


17. Select a cluster profile to apply to your cluster. Click on **Next**.


18. The next screen displays all the layers of your cluster profile. You need to apply your add-on profile to this cluster profile. Click on the **+** button above the cluster profile layers.


19. Select the add-on profile you created earlier. Selecting the add-on profile ensures the Prometheus agent is installed with the correct configuration. Click on **Next** to proceed.


20. Complete the remainder of the cluster creation process.

After the cluster deployment process, you will have a host cluster with the Prometheus agent installed and ready to send metrics to the monitoring stack.

 Refer to the [Validate](#validate) section to learn how to validate the Prometheus agent is successfully installed and sending metrics to the monitoring stack.
### With Authentication and Encryption


1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Add-on**. Click on **Next**.


5. In the following screen, select **Add New Pack**.


6. Use the following information to find the Prometheus Agent pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Agent
    - **Pack Version**: 19.0.X or newer.


7. Review the YAML configuration on the right. Scroll down in the file until you find the parameter `url` in the `remoteWrite` section. The `remoteWrite.url` is exposed by the monitoring stack. You can find the Prometheus server URL by reviewing the details of the monitoring stack. Use the URL exposed by the Prometheus service. 

    The following image displays the cluster details page of a monitoring stack. Use the URL exposed for port 9090 to populate the `remoteWrite.url` parameter.

![A view of the cluster details page with a highlighted box around the Prometheus service URL](/integrations_prometheus-agent_cluster-detail-view.png)

<br />

:::warning

The Prometheus server URL must be in the format `http://HOST:PORT/api/v1/write`. 
Example: `https://metrics.example.com:9090/api/v1/write`

:::

  ```yaml
  charts:
    prometheus:
      server:
        remoteWrite:
          - url: "https://metrics.example.com:9090/api/v1/write"
  ```

8. Add the `basic_auth` parameters shown below. Replace `<USERNAME>` and `<PASSWORD>` with the actual credential values. Use the username you created to authenticate with the Prometheus API server. If you followed the [Deploy a Monitoring Stack](deploy-monitor-stack.md#deploy-a-monitoring-stack) with authentication guide, then the username is `agent`.

<br />

```yaml
charts:
  prometheus:
    server:
      remoteWrite:
        - url: "http://metrics.example.com:9090/api/v1/write"
          remote_timeout: "5s"
          basic_auth:
            username: "<USERNAME>"
            password: <PASSWORD>
```

8. Confirm your changes.


9. Click on **Add New Pack**.


10. Use the following information to find the Spectro Cluster Metrics pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Spectro Cluster Metrics
    - **Pack Version**: 3.3.X or newer


11. Use the default values. Confirm your changes by selecting **Confirm & Create**.


12. Click on **Next** to review the cluster profile. Save the cluster profile.


13. Navigate to the left **Main Menu** and select **Clusters**.


14. Click on **Add New Cluster**. Select **Deploy New Cluster**.


15. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


16. Assign a name to the host cluster and select the registered account that will deploy it.  Click on **Next**.


17. Select a cluster profile to apply to your cluster. Click on **Next**.


18. The next screen displays all the layers of your cluster profile. You need to apply your add-on profile to this cluster profile. Click on the **+** button above the cluster profile layers.


19. Select the add-on profile you created earlier. Selecting the add-on profile ensures the Prometheus agent is installed with the correct configuration. Click on **Next** to proceed.


20. Complete the remainder of the cluster creation process.

When you deploy the cluster deployment, you will have a host cluster with the Prometheus agent installed and ready to send metrics to the monitoring stack.


### Validate

To validate that the Prometheus agent is successfully installed and sending metrics to the monitoring stack, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the monitoring stack cluster to review the details page.


4. Ensure the cluster is in the **Running** state.


5. Click on the exposed service URL for the service **prometheus-operator-kube-prometheus-stack-grafana**. 


6. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile. 


7. In the Grafana dashboard, click on the left **Main Menu** and click on **Dashboards**. Palette exposes a set of Grafana dashboards by default.


8. Select the **Spectro Cloud/ Spectro Clusters** dashboard.


9. Use the **cluster** filter and review the list of available clusters. Select your newly deployed cluster to review its metrics.


![A grafana dashboard view of the cluster metric displaying pack status](/clusters_cluster-management_grafana_spectro_metrics.png)

<br />

:::warning

Pods without the defined attributes `request` and `limit` will display no metrics data in the Grafana out-of-the-box Kubernetes Pods dashboard.

:::


Use the other dashboard created by Palette to learn more about your environment.


## Next Steps

Visit your Grafana dashboard and explore the Palette-created dashboard to learn more about your environment. To learn how to create dashboards tailored to your environment, check out the [Grafana tutorials](https://grafana.com/tutorials/).
