---
title: "Import a Cluster"
metaTitle: "Import a Cluster"
metaDescription: "Learn how to manage imported clusters and what operations are supported with Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview


When importing a cluster into Palette, you can select the mode in which you want Palette to manage the cluster. You can choose between read-only mode or select full-permissions. You can learn more about each mode on the [Imported Clusters](/clusters/imported-clusters#importmodes) reference page.


Select the mode you want to use when importing a cluster into Palette.

<br />


<Tabs>
<Tabs.TabPane tab="Full Permission Mode" key="full-permission-mod">

## Prerequisites

- Kubernetes version >= 1.23.X


- Ensure your environment has network access to Palette SaaS or your self-hosted Palette instance.


- Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.


- Access to your cluster environment through kubectl. 


## Import a Cluster

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Click on **Add New Cluster** and select **Import Cluster** in the pop-up box.


4. Fill out the required information and make the proper selections:
   * Cluster Name - The name of the cluster you want to import.
   * Cloud Type - Select the infrastructure environment your cluster resides in. Select **Generic** if the environment list doesn't contain your specific environment but be aware of the limitations with generic clusters.
   * Proxy - Optional and only available for generic clusters. Specify a network proxy address or DNS value.
   * No Proxy - Optional and only available for generic clusters. Specify a no proxy address or DNS value.

5. Select **Full-permission mode** and click on **Create & Open Cluster Instance** to start the import action.




6. You will be taken to the cluster details page. A set of instructions with commands is displayed on the right-hand side of the screen. You will need to issue the following commands to complete the import process. 

   <br />


   ![A view of the cluster details page with the sidebar instructions box](/clusters_imported-clusters_full-permissions-instructions.png)

   <br />

7. We recommend you install the metrics server so that Palette can expose and provide you with information about the cluster. Installing the metrics server is not required but needed Palette to expose information about the cluster. Issue the commands below if you want to enable the metrics server.

   <br />

   ```shell
   helm repo add bitnami https://charts.bitnami.com/bitnami && \
   helm install my-release bitnami/metrics-server
   ```

8. To install the Palette agent, issue the command displayed in the cluster details page's **Install the agent** section. The command is customized for your cluster as it contains the assigned cluster ID. Below is an example of the install command.

   <br />

   ```shell hideClipboard
   kubectl apply -f https://api.spectrocloud.com/v1/spectroclusters/6491d4a94c39ad82d3cc30ae/import/manifest
   ```

   Output
   ```shell hideClipboard
   namespace/cluster-6491d4a94c39ad82d3cc30ae created
   serviceaccount/cluster-management-agent created
   clusterrole.rbac.authorization.k8s.io/read-only-mode created
   clusterrolebinding.rbac.authorization.k8s.io/read-only-mode created
   configmap/log-parser-config created
   configmap/upgrade-info-8kfc2m8mt8 created
   configmap/version-info-kbk5hk992f created
   secret/spectro-image-pull-secret created
   priorityclass.scheduling.k8s.io/spectro-cluster-critical created
   deployment.apps/cluster-management-agent-lite created
   configmap/cluster-info created
   configmap/hubble-info created
   secret/hubble-secrets created
   ```

9. Once the Palette agent completes the initialization, the side view drawer on the right will disappear, and your cluster will transition to a status of **Running** after a few moments.

   <br />

   ![A view of an imported cluster's details page](/clusters_imported-clusters_full-permissions.png)

   <br />

You now have a cluster imported into Palette with full permissions.



## Validate

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select your imported cluster from the cluster list.


4. Review the **Cluster Status** row from the cluster details view. A successful cluster import will have the cluster status **Running**.


</Tabs.TabPane>
<Tabs.TabPane tab="Read Only Mode" key="read-only-mod">

## Prerequisites

- Kubernetes version >= 1.23.X


- Ensure your environment has network access to Palette SaaS or your self-hosted Palette instance.


- Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.


- Access to your cluster environment through kubectl. 

## Import a Cluster

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Click on **Add New Cluster** and select **Import Cluster** in the pop-up box.


4. Fill out the required information and make the proper selections:
   * Cluster Name - The name of the cluster you want to import.
   * Cloud Type - Select the infrastructure environment your cluster resides in. Select **Generic** if the environment list doesn't contain your specific environment but be aware of the limitations with generic clusters.
   * Proxy - Optional and only available for generic clusters. Specify a network proxy address or DNS value.
   * No Proxy - Optional and only available for generic clusters. Specify a no proxy address or DNS value.

5. Select **Read-only mode** and click on **Create & Open Cluster Instance** to start the import action.


6. You will be taken to the cluster details page. A set of instructions with commands is displayed on the right-hand side of the screen. You will need to issue the following commands to complete the import process. 

   <br />


   ![A view of the cluster details page with the sidebar instructions box](/clusters_imported-clusters_read-only-instructions.png)

   <br />

7. We recommend you install the metrics server so that Palette can expose and provide you with information about the cluster. Installing the metrics server is not required but needed Palette to expose information about the cluster. Issue the commands below if you want to enable the metrics server.

   <br />

   ```shell
   helm repo add bitnami https://charts.bitnami.com/bitnami && \
   helm install my-release bitnami/metrics-server


8. To install the Palette agent, issue the command displayed in the cluster details page's **Install the read-only agent** section. The command is customized for your cluster as it contains the assigned cluster ID. Below is an example of the install command.

   <br />

   ```shell hideClipboard
   kubectl apply -f https://api.spectrocloud.com/v1/spectroclusters/6491d4a94c39ad82d3cc30ae/import/manifest
   ```

   Output
   ```shell hideClipboard
   namespace/cluster-6491d4a94c39ad82d3cc30ae created
   serviceaccount/cluster-management-agent created
   clusterrole.rbac.authorization.k8s.io/read-only-mode created
   clusterrolebinding.rbac.authorization.k8s.io/read-only-mode created
   configmap/log-parser-config created
   configmap/upgrade-info-8kfc2m8mt8 created
   configmap/version-info-kbk5hk992f created
   secret/spectro-image-pull-secret created
   priorityclass.scheduling.k8s.io/spectro-cluster-critical created
   deployment.apps/cluster-management-agent-lite created
   configmap/cluster-info created
   configmap/hubble-info created
   secret/hubble-secrets created
   ```

9. Once the Palette agent completes the initialization, the side view drawer on the right will disappear, and your cluster will transition to a status of **Running** after a few moments.

   <br />

   ![A view of an imported cluster's details page](/clusters_imported-clusters_read-only.png)

   <br />


You now have a cluster imported into Palette in read-only mode. Keep in mind that a cluster imported in read-only mode has limited capabilities. You can migrate to Full-Permissions at any time by clicking on the **Migrate To Full Permissions**.



## Validate

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select your imported cluster from the cluster list.


4. Review the **Cluster Status** row from the cluster details view. A successful cluster import will have the cluster status **Running**.


</Tabs.TabPane>

</Tabs>


# Next Steps

Depending on what mode you selected for the migration, your next step is to either [Attach an Add-on Profile](/clusters/imported-clusters/attach-add-on-profile) or you can [Migrate to Full Permissions](/clusters/imported-clusters/migrate-full-permissions).



<!-- 


## Import Steps

Run the following steps to import a brownfield cluster into the Palette platform:

<br />

1. Log in to the Palette Management Console as a **Project Administrator**.

2. Select **Clusters** from the slide menu.

3. Find and select the **+ Add New Cluster** button.

4. Click the **Import Cluster** button to bring in your own cluster into Palette.

5. Provide a **Cluster Name** for the cluster.

6. Choose from the **Cloud Type** list where the cluster is currently deployed.

   **Note**: If you are importing a generic cluster, there is an option to provide the proxy/non-proxy information, if applicable.

7. Select **Import mode** by choosing the permissions level and clicking the **Create & Open Cluster Instance** button.

<InfoBox>
<b>Read-Only mode</b>: Starting with minimal permissions allows health check monitoring, event logging, cost, and usage analysis. This state is optimal for those who want to restrict access during initial setup. When you are ready to raise the permissions levels, migrate to full permissions mode.

<br />
<br />

<b>Full Permission mode</b>: This mode grants Palette the ability to apply add-on cluster profiles to an imported cluster.
</InfoBox>

## Install the Agent

<InfoBox>
   It is essential to follow through with the steps in the call-out box to complete the cluster import procedure. Otherwise, the instance will stay in pending mode, and the metrics server will not visualize the full capabilities.
</InfoBox>
<br />

<br />

### Install the Read-Only Agent

1. Follow the steps in the Cluster Import procedure (Read-Only) slide-out. This installs the Palette Cluster Management Agent to use with your imported brownfield cluster.

2. Copy and paste in a terminal window the following kubectl command to the cluster that you are importing:
   <br />

   ```yml
   kubectl apply -n cluster-xxxxxxxxxx -f https://api.dev.spectrocloud.com/v1/spectroclusters/xxxxxxxxx/import/manifest`
   ```

   After this command is applied, the cluster will go to an _Importing_ state and eventually show as _Running_ in the console interface. At this point, metrics and installed services will be populated.

3. Install the metrics server.

   The Read-Only Agent relies on the metrics server to capture usage metrics in the cluster. If the metrics server is not installed already, execute the following command(s):
   <br />

   ```yml
   helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

   ```yml
   helm install my-release bitnami/metrics-server
   ```

   <br />

4. Wait for the import process to complete. The cluster status will transition from _Pending_ to _Running_, and the cluster health will transition to _Healthy_, signaling a successful import of the brownfield cluster.

## Migrate to Full Permissions Mode

When you are ready to expand the permissions or enable day 2 operations, migrate to Full Permissions mode.
<br />

1. To migrate to Full Permissions mode, go to the slide menu and select **Clusters**.

2. Pick the read-only cluster you wish to migrate and click the **Migrate To Full Permissions** button.

3. Click **OK** to confirm.

4. Proceed to install the agent.

<br />

### Install the Agent (Full Permissions Mode)

1. Copy and paste the command in a Terminal window to apply the following `kubectl` command to the cluster that you are migrating:
   <br />

   ```yml
   kubectl apply -n cluster-xxxxx -f https://api.dev.spectrocloud.com/v1/spectroclusters/xxxxx/import/manifest
   ```

   <br />

2. Wait for the import process to complete. The cluster status will transition from _Pending_ to _Running_, and the cluster health will transition to _Healthy_, signaling a successful import of the brownfield cluster.

# Attach Add-on Profiles

Add-on cluster profiles can be attached to brownfield clusters following import in order to install and manage various applications/integrations. The following steps need to be performed to attach add-on profiles to existing clusters:

<br />

1. Choose the desired cluster from the **Clusters** list and navigate to the **Profile** tab.

2. Select the **Add add-on profile** dialog from the menu on the left-hand side and choose the desired cluster profile. Multiple add-on profiles can be attached to a cluster.

3. In addition of a new add-on profile, the default configuration for all the layers that are part of the add-on profile are displayed. You can customize or override the default parameters in any of the layers as needed.

4. Click **Save**. The cluster configuration and the new layers from the attached profiles will then be installed on the cluster.



# Example Cluster Imports Illustration

## EKS Cluster Import to Palette Console

`video: title: "eks cluster import": cluster-import/eks.mp4`

## Generic Cluster Import to Palette Console

`video: title: "generic cluster import": cluster-import/generic.mp4` -->
