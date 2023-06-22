---
title: "Attach an Add-on Profile"
metaTitle: "Attach an Add-on Profile"
metaDescription: "Learn how to attach an addon-profile to an imported cluster."
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Imported clusters lack the ability for Palette to manage the core layers found in a cluster profile, such as the Operating System, Kubernetes distribution and version, along with the container network interface and storage interface. 
You can, however, use add-on cluster profiles to deploy additional software dependencies into your cluster and have Palette manage these dependencies through the normal cluster profile lifecycle. 


In this how-to, you learn how to add an add-on cluster profile to an imported cluster.


# Prerequisites

* An imported cluster with full permissions. Refer to the [Migrate to Full Permissions](/clusters/imported-clusters/migrate-full-permissions) to learn how to migrate an imported cluster from read-only mode to full-permissions mode.



# Add an Add-on Profile

1. Log in to [Palette](https://console.spectrocloud.com).


2. If you have an add-on cluster profile created, skip to step 12. Otherwise, follow along to create an add-on profile.


3. Navigate to the left **Main Menu** and select **Profiles**.


4. Click on **Add Cluster Profile**.


5. Use the following input values and click **Next**.

  <br />

  | Field | Value |
  |----|----|
  | **Name**| `demo-add-on-profile`|
  |**Description**| `An example of using an add-on profile with an import cluster.` |
  | **Version**| `1.0.0` |
  | **Type**| **Add-on** |
  | **Tags**| `"spectro-cloud-education", "app:hello-universe", "terraform_managed:true"`|


6. Select **Add Manifest**.



7. Provide the manifest layer with the name `app` and click on **New Manifest**.


8. Assign the manifest the name `hello-universe` and click on the blue checkmark button.


9. Paste the following code into the text editor on the right.

  <br />

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: hello-universe-service
  spec:
    type: LoadBalancer
    ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
    selector:
      app: hello-universe
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: hello-universe-deployment
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: hello-universe
    template:
      metadata:
        labels:
          app: hello-universe
      spec:
        containers:
        - name: hello-universe
          image: ghcr.io/spectrocloud/hello-universe:1.0.12
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 8080
  ```

  <br />

  ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.png)

  <br />

10. Click on  **Confirm & Create**, followed by **Next** to arrive at the cluster profile summary page.


11. Click on **Finish Configuration** to complete the cluster profile creation.


12. Navigate to left **Main Menu** and select **Clusters**.


13. Select your imported cluster to access its details page.


14. From the cluster details page, select the **Profile** and click on **Attach Profile**.

  <br />

  ![The view of a cluster details when the profile tab is selected](/clusters_imported-clusters_attach-add-on-profile_cluster-details-profile-tab.png)

  <br />

15. Select the **demo-add-on-profile** or a custom add-on profile if available. Click on **Confirm**.


16. In the following screen, you can update the add-on profile if desired. Click on **Save** to deploy the add-on cluster profile


17. Navigate to the **Overview** tab to monitor the deployment. Once the add-on cluster profile is deployed, the page's **Cluster Profiles** section will display a green circle next to the layer.
  <br />

  ![A cluster profile with an add-on profile deployed successfully](/clusters_imported-clusters_attach-add-on-profile_cluster-details-app-deployed.png)


  <br />

  <WarningBox>

  The deployed manifest containing the [Hello Universe](https://github.com/spectrocloud/hello-universe) application requires your cluster to support the service type `LoadBalancer` to deploy successfully. Refer to the official Kubernetes [service documentation](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) to learn more about service types.

  </WarningBox>


You now have an add-on cluster profile deployed onto your imported cluster. Use the steps above to add your custom add-on cluster profile to an imported cluster.


# Validate

1. Log in to [Palette](https://console.spectrocloud.com).



2.  Navigate to left **Main Menu** and select **Clusters**.



3. Select your imported cluster to access its details page.



4. Verify the **Cluster Profile** section of the page has a green circle next to each layer. If your application exposes a service URL, use the URL to visit the application and verify it's operational.