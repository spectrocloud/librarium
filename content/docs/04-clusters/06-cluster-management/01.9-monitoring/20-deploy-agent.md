---
title: 'Enable Monitoring on Host Cluster'
metaTitle: 'Enable Monitoring on Host Cluster'
metaDescription: 'Learn how to configure your host cluster to forward metrics to a Prometheus server.'
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The steps below will teach you how to create a Prometheus agent cluster addon profile. Creating an addon profile makes it easier for you to deploy the Prometheus agent to other host clusters in the future. You will use this addon profile when deploying a new host cluster, but you can also add the addon profile to an existing cluster to send metrics to the monitoring stack.

# Prerequisites


- A monitoring stack. Check out the [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) guide to learn how to deploy a monitoring stack in your Palette environment.


- An infrastructure provider environment registered in Palette. Refer to the [Clusters](/clusters) documentation for guidance on how to register your infrastructure provider environment in Palette.

# Create Addon Profile and Deploy Cluster

<Tabs>

<Tabs.TabPane tab="Without Authentication" key="without-auth-agent">

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Addon**. Click on **Next**.


5. In the following screen, select **Add New Pack**.


6. Use the following information to find the Prometheus Operator pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Agent
    - **Pack Version**: 19.0.X or newer.


7. Review the YAML configuration on the right. Navigate down the file until you find the parameter `url` in the `remoteWrite` section. The `remoteWrite.url` is exposed by the monitoring stack. The Prometheus server URL can be found by reviewing the details of the monitoring stack. Use the URL exposed by the Prometheus service. 

    The following image displays the cluster details page of a monitoring stack. Use the URL exposed for port 9090 to populate the `remoteWrite.url` parameter.

![A view of the cluster details page with a highlighted box around the Prometheus service URL](/integrations_prometheus-agent_cluster-detail-view.png)

<br />

<WarningBox>

The Prometheus server URL must be in the format of `http://HOST:PORT/api/v1/write`. 
Example: `http://a2c938972938b4f0daee5f56edbd40af-1690032247.us-east-1.elb.amazonaws.com:9090/api/v1/write`

</WarningBox>

<br />

```yaml
charts:
  prometheus:
    server:
      remoteWrite:
        - url: "http://a2c938972938b4f0daee5f56edbd40af-1690032247.us-east-1.elb.amazonaws.com:9090/api/v1/write"
```

8. Confirm your changes by selecting **Confirm & Create**.


9. Click on **Next** to review the cluster profile. Save the cluster profile.


10. Navigate to the left **Main Menu** and select **Clusters**.


11. Click on **Add New Cluster**. Select **Deploy New Cluster**.


12. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


13. Go ahead and assign a name to the host cluster and select the registered account you wish to deploy the host cluster to.  Click on **Next**.


14. Pick a cluster profile for your cluster. Click on **Next**.


15. The following screens will display all the layers of your cluster profile. You need to add your addon profile to this cluster profile. Click on the **+** button above all the cluster profile layers. A side drawer will appear.


16. Select the addon profile you created earlier. By selecting the addon profile, you will ensure the Prometheus agent is installed with the correct configuration. Click on **Next** to proceed.


17. Complete the remainder of the cluster creation process.

After the cluster deployment process, you will have a host cluster with the Prometheus agent installed and ready to send metrics to the monitoring stack.

</Tabs.TabPane>

<Tabs.TabPane tab="With Authentication" key="with-auth-agent">

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Addon**. Click on **Next**.


5. In the following screen, select **Add New Pack**.


6. Use the following information to find the Prometheus Operator pack.
    - **Pack Type**: Monitoring
    - **Registry**: Public Repo
    - **Pack Name**: Prometheus Agent
    - **Pack Version**: 19.0.X or newer.


7. Review the YAML configuration on the right. Navigate down the file until you find the parameter `url` in the `remoteWrite` section. The `remoteWrite.url` is exposed by the monitoring stack. The Prometheus server URL can be found by reviewing the details of the monitoring stack. Use the URL exposed by the Prometheus service. 

    The following image displays the cluster details page of a monitoring stack. Use the URL exposed for port 9090 to populate the `remoteWrite.url` parameter.

![A view of the cluster details page with a highlighted box around the Prometheus service URL](/integrations_prometheus-agent_cluster-detail-view.png)

<br />

<WarningBox>

The Prometheus server URL must be in the format of `http://HOST:PORT/api/v1/write`. 
Example: `http://example.custom.myCompany.com:9090/api/v1/write`

</WarningBox>

  ```yaml
  charts:
    prometheus:
      server:
        remoteWrite:
          - url: "http://example.custom.myCompany.com:9090/api/v1/write"
  ```

8. Add the `basic_auth` parameters provided below. Replace `<USERNAME>` and `<PASSWORD>` with the actual credential values. Use the username you created for authenticating with the Prometheus API server. If you followed the [Deploy a Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack#deployamonitoringstack) with authentication guide, then the username is `agent`.

<br />

```yaml
charts:
  prometheus:
    server:
      remoteWrite:
        - url: "http://example.custom.myCompany.com:9090/api/v1/write"
          remote_timeout: "5s"
          basic_auth:
            username: "<USERNAME>"
            password: <PASSWORD>
```

8. Confirm your changes by selecting **Confirm & Create**.


9. Click on **Next** to review the cluster profile. Save the cluster profile.


10. Navigate to the left **Main Menu** and select **Clusters**.


11. Click on **Add New Cluster**. Select **Deploy New Cluster**.


12. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


13. Go ahead and assign a name to the host cluster and select the registered account you wish to deploy the host cluster to.  Click on **Next**.


14. Pick a cluster profile for your cluster. Click on **Next**.


15. The following screens will display all the layers of your cluster profile. You need to add your addon profile to this cluster profile. Click on the **+** button above all the cluster profile layers. A side drawer will appear.


16. Select the addon profile you created earlier. By selecting the addon profile, you will ensure the Prometheus agent is installed with the correct configuration. Click on **Next** to proceed.


17. Complete the remainder of the cluster creation process.

After the cluster deployment process, you will have a host cluster with the Prometheus agent installed and ready to send metrics to the monitoring stack.


</Tabs.TabPane>

</Tabs>

# Validation

To validate that the Prometheus agent is successfully installed and sending metrics to the monitoring stack, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the monitoring stack cluster to review the details page.


4. Ensure the cluster is in the status **Running**.


5. Click on the exposed service URL for the service **prometheus-operator-kube-prometheus-stack-grafana**. 


6. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile. 


7. In the Grafana dashboard, click on the left **Main Menu** and click on **Dashboards**. Palette exposes a set of Grafana dashboards by default.


8. Select the **Spectro Cloud/ Kubernetes / Views / Global** dashboard.


9. Use the **cluster** filter and review the list of available clusters. Select your newly deployed cluster to review its metrics.


Use the other dashboard created by Platte to learn more about your environment.


# Next Steps

Visit your Grafana dashboard and explore the Palette-created dashboard to learn more about your environment. You should also check out the [Grafana tutorials](https://grafana.com/tutorials/) to learn how to create dashboards tailored to your environment.