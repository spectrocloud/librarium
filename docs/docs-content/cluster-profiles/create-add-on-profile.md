---
sidebar_label: "Create an Add-on Profile"
title: "Create an Add-on Profile"
description: "Learn how to create an add-on cluster profile."
icon: ""
hide_table_of_contents: true
sidebar_position: 10
---
# Overview


Add-on cluster profiles offer a range of benefits for workload cluster deployments. These profiles provide enhanced functionality by allowing the addition of various layers such as system apps, authentication, security, monitoring, logging, ingress, and load balancers to the cluster. 

This capability allows you to customize and configure clusters based on specific requirements. Add-on cluster profiles follow a modular approach, making managing and maintaining cluster configurations more flexible. Add-on profiles also promote reusability, allowing profiles to be used across multiple environments, projects, and tenants. Additionally, add-on cluster profiles support integration-specific templates, charts, and manifests, providing flexibility and customization options for workload cluster deployments.


## Pack Labels and Annotations

You can specify Namespace labels and annotations to Add-on packs, and packs that are for Container Storage Interfaces (CSI) and Container Network Interfaces (CNI) drivers. These labels and annotations are applied to the Namespace that the pack is deployed to, or to a specific Namespace if specified. You can apply labels and annotations to the pack's YAML file.

The following parameters are available for specifying Namespace labels and annotations:

| **Parameter** | **Description** | **Type** |
| --- | --- | --- |
| `namespace` | The Namespace that the pack is deployed to. If the Namespace does not exists, then Palette will create the Namespace. | string |
| `additionalNamespaces`| A list of additional Namespaces that Palette will create. | map |
| `namespaceLabels` | A list of key-value pairs for labels applied to the Namespace. | map |
| `namespaceAnnotations` | A list of key-value pairs for annotations applied to the Namespace. | map |



The following example shows how to specify Namespace labels and annotations for an Add-on Pack, a CSI pack, and a CNI pack. In the example pack YAML configuration, the `wordpress` Namespace is created. An additional Namespace titled `wordpress-storage` is also created. In the parameters sections, `namespaceLabels` and `namespaceAnnotations`, each entry has a key and a value. The key is the name of the target Namespace, and the value is the value of the label or annotation.


<br />

```yaml 
pack:
  namespace: "wordpress"
  additionalNamespaces:
    "wordpress-storage"

  namespaceLabels:
    "monitoring": "org=spectro,team=dev"
    "wordpress-storage": "user=demo-user"
    "default": "user=demo-user"
    
  namespaceAnnotations:
    "monitoring": "monitoring.io/enable=true"
    "wordpress-storage": "storage.metrics.io/format=json"
```




# Create an Add-on Profile

Use the following steps to learn how to create an add-on cluster profile.


## Prerequisites

* Your Palette account role must have the `clusterProfile.create` permission to create an Add-on cluster profile. Refer to the [Cluster Profile](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofile) permissions documentation for more information about roles and permissions.


## Create Steps


1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile**.


4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

  <br />

  | Field | Description |
  |----|----|
  | **Name**| The name of the profile. |
  |**Description**| Use the description to provide context about the profile. |
  | **Version**| Assign a version to the profile. The default value is `1.0.0`. |
  | **Type**| **Add-on** |
  | **Tags**| Assign any desired profile tags you want. |


5. Select the type of layer to add to the cluster profile. 

  <br />

  | Type | Description |
  |---|---|
  | **Pack** | A pack is a collection of files and configurations that can be deployed to a cluster to add functionality or customize the cluster's behavior.|
  | **Helm**| You can specify a Helm chart as a layer in an add-on profile.|
  | **Manifest**| A manifest is a Kubernetes configuration file that describes the desired state of a Kubernetes resource, such as deployment, service, or pod and is used to create or modify that resource in a cluster.|




6. Depending on your selected type, fill out the required input fields and click on **Confirm & Create**.


  <br />

  ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.png)

  <br />

7. If you want to add additional layers, repeat steps five and six. Otherwise, click on **Next** to review the profile.


8. Click on **Finish Configuration** to create the cluster profile.



You now have an add-on cluster profile. You can reuse the profile and apply it to several clusters. You can also update a cluster profile and decide what clusters to apply the new version to. Refer to the [Update Cluster Profile](/cluster-profiles/task-update-profile) guide for more information about update operations.


# Validate

1. Log in to [Palette](https://console.spectrocloud.com).



2.  Navigate to left **Main Menu** and select **Profiles**.



3. Select your cluster profile to review its layers or make changes.


<br />
