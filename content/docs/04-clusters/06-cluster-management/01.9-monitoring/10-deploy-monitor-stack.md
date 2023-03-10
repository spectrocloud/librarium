---
title: 'Deploy Monitoring Stack'
metaTitle: 'Deploy Monitoring Stack'
metaDescription: 'Learn how to deploy a monitoring stack in your Palette environment.'
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The monitoring stack you will deploy uses the open-source tool, [Prometheus](https://prometheus.io/docs/introduction/overview/), to support your environment's monitoring requirements. The monitoring stack is a centralized server or aggregation spot to which all other clusters will forward metrics. The monitoring stack is a dedicated Kubernetes cluster for monitoring and metrics aggregation in your Palette environment. 

The monitoring stack uses a server-client architecture. The monitoring stack uses the [Prometheus Operator](/integrations/prometheus-operator) pack to deploy all the dependencies the Prometheus server requires. The server exposes an API endpoint for all other clients to forward metrics. The clients are Kubernetes clusters with the [Prometheus Agent](/integrations/prometheus-agent) pack installed and configured.

Use the following steps to deploy a monitoring stack, and learn how to configure a host cluster to forward metrics to the monitoring stack.

<br />

<WarningBox>

We recommend you avoid installing applications in your monitoring stack. The monitoring stack will require all the allocated resources to support Prometheus and incoming metrics from all other clusters.

</WarningBox>

# Deploy a Monitoring Stack

The steps below will deploy a new host cluster with the Prometheus Operator pack. You can add the Prometheus Operator pack to an existing cluster if you already have a host cluster deployed in your environment.

The Prometheus Operator pack will install an unsecured Prometheus server by default. Use the **With Authentication** tab for guidance on how to enable authentication.



# Prerequisites

- An infrastructure provider environment registered in Palette. Refer to the [Clusters](/clusters) documentation for guidance on how to register your infrastructure provider environment in Palette.


- A custom domain name. Only needed when enabling authentication.


- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) or similar basic auth password file generator tool. Only needed when enabling authentication.


- The minimum required size for the Prometheus server is 4 CPU, 8 GB Memory, and 10 GB Storage. We recommend the monitoring stack have 1.5x to 2x the minimum required size:

  Recommended size:
  - 8 CPU 
  - 16 GB Memory
  - 20 GB Storage. 
 
 
  As new clusters with the Prometheus agent are added to your environment, review the resource utilization and consider increasing resources if needed. As the Prometheus documentation recommends, each additional agent requires the following resources from the monitoring stack:

  Each added agent:
    - 0.1 CPU
    - 250 MiB Memory
    - 1 GB Storage.

  Refer to the [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects) documentation for additional guidance.


# Enablement

<Tabs>

<Tabs.TabPane tab="Without Authentication" key="without-auth">

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Full**. Click on **Next**.


5. Select the infrastructure provider and continue.


6. Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and container storage interface (CSI). Click on **Next Layer** after each selection. When you have completed selecting core infrastructure for the profile, click **Confirm**.


7. In the next screen that displays, select **Add New Pack**.


8. Use the following information to find the Prometheus Operator pack.
    - Pack Type: Monitoring
    - Registry: Public Repo
    - Pack Name: Prometheus Grafana
    - Pack Version: 44.3.X or newer. <br />



9. Review the YAML configuration on the right. Scroll down in the file until you find the parameter `adminPassword`. Input the password value for the admin user. The default admin user name is `admin`.


10. Next, click on the **Presets** button to expand the options drawer.


11. Scroll down the presets option menu and enable **Remote Monitoring**. Confirm your changes. You can enable several options to expand the functionality of the monitoring stack. Review the [Prometheus Operator](/integrations/prometheus-operator) pack documentation to learn more about the available options.


12. Click on **Next** to review the cluster profile and save it.


13. Navigate to the left **Main Menu** and select **Clusters**.


14. Click on **Add New Cluster**. Select **Deploy New Cluster**.


15. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


16. Assign a name to the host cluster and select the registered account you wish to deploy the host cluster to. Click on **Next**.


17. Pick the cluster profile you created earlier and complete the remainder of the cluster creation process.

When you deploy the cluster, a host cluster with Prometheus will be installed and ready to receive information from Prometheus agents.


</Tabs.TabPane>

<Tabs.TabPane tab="With Authentication" key="with-auth">

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile** to create a new cluster profile.


4. Provide the cluster profile a name and select the type **Full**. Click on **Next**.


5. Select the infrastructure provider and continue.


6. Go ahead and select the desired operating system, Kubernetes distribution, container network interface (CNI), and container storage interface (CSI). Click on **Next Layer** after each selection. When you have completed selecting core infrastructure for the profile, click **Confirm**.


7. In the next screen that displays, select **Add New Pack**.


8. Use the following information to add the NGINX ingress controller pack.
    - Pack Type: Ingress
    - Registry: Public Repo
    - Pack Name: Nginx
    - Pack Version: 1.5.X or newer. <br />


9. Click on **Confirm & Create**.


10. Select **Add New Pack**.


11. Use the following information to find the Prometheus Operator pack.

    - Pack Type: Monitoring
    - Registry: Public Repo
    - Pack Name: Prometheus Grafana
    - Pack Version: 44.3.X or newer. <br />


12. Next, click on the **Presets** button to expand the options drawer.


13. Scroll down the presets option menu and enable **Remote Monitoring**. 


14. Review the YAML configuration on the right. Scroll down in the file until you find the parameter `adminPassword`. Input the password value for the admin user. The default admin user name is `admin`.


15. Confirm your changes by selecting **Confirm & Create**. You can enable several options to expand the functionality of the monitoring stack. Review the [Prometheus Operator](/integrations/prometheus-operator) pack documentation to learn more about the available options.


16. Click on **Next** to review the cluster profile and save it.


17. Navigate to the left **Main Menu** and select **Clusters**.


18. Click on **Add New Cluster**. Select **Deploy New Cluster**.


19. Pick the infrastructure provider you selected for the cluster profile you created earlier. 


20. Assign a name to the host cluster and select the registered account you wish to deploy the host cluster to. Click on **Next**.


21. Pick the cluster profile you created earlier and complete the remainder of the cluster creation process.


22. Once the host cluster is deployed, navigate to the left **Main Menu** and select **Clusters**. Click on your cluster to display the details page and ensure its status is **Running**. 


23. Create a CNAME in your domain's DNS record for the exposed load balancer URL. You can find the load balancer URL by reviewing the cluster details page and reviewing the prefix to any of the exposed service URLs. Discuss this step with your system administrator if you need help and guidance.


24. Download the Kubernetes config file. Click on the URL that has the name of your cluster followed by a period and the word *kubeconfig*. Example: `dev-monitoring-stack.config`.


25. Open a terminal window and set the environment variable `KUBECONFIG` to point to kubeconfig file you downloaded.

  ```shell
  export KUBECONFIG=~/Downloads/dev-monitoring-stack.config
  ```

26. Create a htpasswd file for the user `agent` and assign a password. You can choose a different username if you prefer something else. 

  <br />

  ```shell
  htpasswd -c auth agent
  New password: [agent_password_here]
  New password:
  Re-type new password:
  Adding password for user agent
  ```

27. Convert the htpasswd file into a Kubernetes secret.

  <br />

  ```shell
    kubectl create secret generic basic-auth --from-file=auth --namespace monitoring
  ```

  ```shell
    secret "basic-auth" created
  ```

28. Navigate back to Palette, and review the cluster profile you created for the monitoring stack. From the left **Main Menu** > **Profiles** > select your cluster profile. Click on the Prometheus operator layer to edit the YAML.


29. Locate the `prometheus.ingress` section located towards the end of the file. Update the ingress configuration with the values provided below. Replace the `hosts` parameter with your custom domain.

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
      - example.custom.myCompany.com
  ```

30. Confirm your updates on the next screen that displays.


31. From the left **Main Menu**, select **Clusters** and access the monitoring stack host cluster.


32. Click on the **Updates Available** button to review the changes.


33. Accept the changes and select **Confirm Updates**.


</Tabs.TabPane>

</Tabs>


# Validation

To validate the monitoring stack is successfully deployed and ready to receive Prometheus agent requests, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the monitoring stack cluster to review the details page.


4. Ensure the cluster is in **Running** state.


5. Click on the exposed service URL for the service **prometheus-operator-kube-prometheus-stack-grafana**.


6. Log in to the Grafana dashboard using the user `admin` and the password you specified in the cluster profile. 


7. If you enabled authentication, visit your custom domain name and log in with the user `agent` and use the password you specified in the htpasswd file.

# Next Steps

Now that you have a monitoring stack deployed and available in your environment, start adding the Prometheus agent to new and existing clusters. Check out the [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent) to get started.