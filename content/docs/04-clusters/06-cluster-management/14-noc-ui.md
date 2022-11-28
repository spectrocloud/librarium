---
title: "NOC-UI"
metaTitle: "Pause NOC UI"
metaDescription: "Clusters Location view on Map"
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


* Select the cluster to which the location needs to be updated and go to the `cluster details` page of the cluster.


* Open `Settings` and then `Cluster Settings`.


* Select `Location` from the left menu and set the location of that cluster to the wizard and save the changes.


* The location is then visualized on the UI map display.


# Monitor your Cluster Location


To monitor the cluster location follow the below steps:

<br />

* Login to the Palette console and select `Clusters` from the left main menu.


* Go to `Map View` from the top menu.


The map will display all the cluster locations under that user’s scope. 
