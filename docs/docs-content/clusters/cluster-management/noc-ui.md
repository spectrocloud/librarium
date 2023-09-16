---
sidebar_label: "NOC-UI"
title: "Clusters Location view on Map - NOC UI"
description: "Clusters Location View on Map - NOC UI"
hide_table_of_contents: false
sidebar_position: 180
tags: ["clusters", "cluster management"]
---


Palette provides an intuitive user interface (UI) based on location monitoring for the clusters running at multiple locations. The Palette 
UI displays the region set during the cluster creation process for public cloud clusters and the location on the UI map. You can set the location for private cloud clusters through the Palette UI. You can also monitor the location details of all the clusters running under a specific scope. 

## Set the Cluster Location

The private cloud clusters must set the location explicitly. To set the location:

* Login to [Palette](https://console.spectrocloud.com).


* Select the cluster to which the location needs to be updated and go to the **Cluster details** page of the cluster.


* Open **Settings** and then navigate to the **Cluster Settings**.


* Select **Location** from the left menu, set the cluster's location, and save the changes.


* The location is then visualized on the UI map display.


## Monitor your Cluster Location


To monitor the cluster location follow the below steps:


* Log in to Palette and select **Clusters** from the left **Main Menu**.


* Go to **Map View Icon** below the **Clusters** tab.


The map will display all the cluster locations under that user’s scope. 

## Map Filters

Palette Map Filters filter out specific clusters using built-in or custom filters for an enhanced user experience. The map filter allows you to narrow down clusters that may be dispersed geographically, across multiple scopes, or different cloud providers. You have two types of filters:- **Built-in Filters** and **Custom Filters**.

### Built-In Filters

Built-in filters are available in the Palette console by default and can be selected from the **Add Filter** drop-down menu. You can use the following built-in filters.


|**Built-In Filters** |Description|
|---------------------|-----------|
|Deleted Only| To dispaly the deleted Clusters for the last 72 hours|
|Imported Only| To display the brown field clusters|
|Updates Pending| To display the clusters with pending updates| 


### Custom Filters

Palette supports a wide range of custom filters in a fixed format. To add a custom filter:
<br />

* Log in to Palette and select **Clusters** from the left **Main Menu**.


* Click on the **+Add Filter** button on the top menu and select **+ Add custom filter** from the top menu.


* The format for adding a cluster is as follows:

  `Conjunction - Condition - Operator - Value`


* You can add more than one custom filter simultaneously, and they work together with the chosen conjunction.

<br />

You can apply these filters for both map view and cluster listing view.


|Conjunction| Condition |Operator|Value
|--|--|--|---|
|and/or|Cloud Account|[operator](#operators) |Custom value |
|and/or|Name|[operator](#operators) | Custom value|
|and/or|Profiles|[operator](#operators) |Custom value |
|and/or|Status|[operator](#operators) |Custom value|
|and/or|Environment|[operator](#operators) |Custom value|
|and/or|Environment|[operator](#operators) |Custom value|
|and/or|Health Status|[operator](#operators) |Custom value|
|and/or|Deleted|[operator](#operators) |Custom value|
|and/or|Read Only Import| [operator](#operators)|Custom value|
|and/or|Imported|[operator](#operators) |Custom value|
|and/or|Updates Pending|[operator](#operators) |Custom value|
|and/or|Tags|[operator](#operators) |Custom value|
|and/or|Region| [operator](#operators)|Custom value|


### Operators


| **Operator** | **Description** |
|----------|-------------|
|is|The value is equal to the custom value.|
|is not|The value is not equal to the custom value.|
|contains|The value contains the custom value.|
|does not contain|The value does not contain the custom value.|
|begins with|The value begins with the custom value.|
|does not begin|The value does not begin with the custom value.|


