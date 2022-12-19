---
title: "NOC-UI"
metaTitle: "Clusters Location view on Map - NOC UI"
metaDescription: "Clusters Location view on Map - NOC UI"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Palette provides Intuitive UI-based location monitoring for the clusters running at multiple locations. For public cloud clusters Palette displays the `Region` set during the cluster creation process and displays the location on the UI Map. For private cloud clusters the user can set the location through the Palette UI. The user can monitor the location details of all the clusters running under a specific scope. 

# Set the Cluster Location

The private cloud clusters must set the location explicitly. To set the location:
<br />

* Login to the Palette console.


* Select the cluster to which the location needs to be updated and go to the **cluster details** page of the cluster.


* Open **Settings** and then **Cluster Settings**.


* Select **Location** from the left menu and set the location of that cluster to the wizard and save the changes.


* The location is then visualized on the UI map display.


# Monitor your Cluster Location


To monitor the cluster location follow the below steps:

<br />

* Log in to the Palette console and select **Clusters** from the left main menu.


* Go to **Map View Icon** below the `Clusters` tab.


The map will display all the cluster locations under that user’s scope. 

# Map Filters

Palette Map Filters filter out specific cluster(s) using built-in or custom filters for an enhanced user experience. This map filter provides an enhanced user experience when you have many clusters dispersed geographically across multiple scopes and clouds. You have two types of filters:- **Built in Filters** and **Custom Filters**.

## Built-in filters

The filters are available in the Palette console by default and can be selected from the **Add Filter** drop-down menu. You can have the following built-in filters from the Palette console.


|**Built-In Filters** |
|---------------------|
|Deleted Only|
|Imported Only|
|Updates Pending|


## Custom Filters

Palette supports a wide range of custom filters in a fixed format. To add a custom filter:
<br />

* Log in to the Palette console and select **Clusters** from the left main menu.


* Go to **Map View Icon** below the `Clusters` tab.


* Click on the **+Add Filter** button on the top menu and select **+ Add custom filter** from the top menu.


* The format for adding a cluster is as follows:

  `Conjunction - Condition - Operator - Value`


* You can add more than one custom filter simultaneously, and they work together with the `conjunction` added.

<br />

|Conjunction| Condition |Operator|Value
|--|--|--|---|
|and/or|Cloud Account|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value |
|and/or|Name|[operator](/clusters/cluster-management/noc-ui#operators) | Custom value|
|and/or|Profiles|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value |
|and/or|Status|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Environment|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Environment|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Health Status|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Deleted|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Read Only Import| [operator](/clusters/cluster-management/noc-ui#operators)|Custom value|
|and/or|Imported|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Updates Pending|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Tags|[operator](/clusters/cluster-management/noc-ui#operators) |Custom value|
|and/or|Region| [operator](/clusters/cluster-management/noc-ui#operators)|Custom value|


## Operators
| |
|-|
is <br />
is not  <br />
contains  <br />
does not contain  <br />
begins with  <br />
does not begin  <br /> 


