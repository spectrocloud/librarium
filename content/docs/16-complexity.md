---
title: "Components Complexity Matrix"
metaTitle: "Palette Components Complexity Matrix"
metaDescription: "Version details of Palette Components Complexity Matrix"
icon: "audits"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

The page embodies the version details of various Palette components with respect to Palette releases. 

# Palette CLI Versions

|Palette Release|Recommended CLI Version|
|----------------|-----------------------|
|Release 2.3.0 | **OSX**:https://spectro-cli.s3.amazonaws.com/v2.3.0/osx/spectro 
|              | **Linux**: https://spectro-cli.s3.amazonaws.com/v2.3.0/linux/spectro |
|Release 2.2.0|**OSX**: https://spectro-cli.s3.amazonaws.com/v2.2.0/osx/spectro
|             |**Linux:** https://spectro-cli.s3.amazonaws.com/v2.2.0/linux/spectro |

#  Palette Docker Image Version

|Palette Release|Spectro Cloud Pack Registry Docker Image|
|-----------------------|----------------------------------------|
|Release 2.3.0 |docker pull gcr.io/spectro-images-public/release/spectro-registry:2.3.0|
|Release 2.2.0 |docker pull gcr.io/spectro-images-public/release/spectro-registry:2.2.0 | 

# On-Prem Installer Version

|Palette Release|On-Prem Installer Version|
|--|--|
|2.3|2.0.2|

# Latest Air Gapped OVA Version

|Palette Release|Air Gapped Version|
|--|---|
|2.3|2.0.1|

# vSphere PCG Image Version

|Palette Release|vSphere PCG Version|
|--|---|
|2.3|2.0.2|
------

# MAAS PCG Image Version

|Palette Release|MAAS PCG Version|
|--|---|
|2.3|1.0.9|
---------

# OpenStack PCG Image

|Palette Release|OpenStack PCG Version|
|--|---|
|2.3|1.0.9|
-------

# Kubernetes Versions

<Tabs>
<Tabs.TabPane tab="Kubernetes" key="Kubernetes">


|Kubernetes Major and Minor Version|Corresponding Patch Versions|
|--|--|
|**1.19.x**|1.19.16
||1.19.15
||1.19.14
||1.19.13
||1.19.12
||1.19.11
||1.19.10
||1.19.9
||1.19.8
||1.19.7
||1.19.6
||1.19.5
||1.19.4
||1.19.3
|**1.20.x**|1.20.12
||1.20.11
||1.20.10
||1.20.9
||1.20.8
||1.20.7
||1.20.6
||1.20.5
||1.20.4
||1.20.2
||1.20.1
||1.20.0
|**1.21.x**|1.21.6
||1.21.5
||1.21.4
||1.21.3
||1.21.2
||1.21.1
||1.21.0
|**1.22.x**|1.22.11|
|**1.23.x**|1.23.4|

</Tabs.TabPane>


<Tabs.TabPane tab="EKS-Distro Versions" key="EKS-Distro Versions">

|EKS-Distro Major and Minor Version|Corresponding Patch Versions|
|--|--|
|**1.21.x**|v1-21-eks-4|
|**1.20.x** | v1-20-eks-6|
|**1.18.x** | 1.18.9-eks-1-18-1|

</Tabs.TabPane>
</Tabs>

# Storage Layer Version

<Tabs>

<Tabs.TabPane tab="Azure Disk" key="Azure Disk Versions">

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.0.x|1.0.0|

</Tabs.TabPane>

<Tabs.TabPane tab="GCE Persistent Disk" key="GCE Persistent Disk Versions">

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.0.x|1.0.0|

</Tabs.TabPane>

<Tabs.TabPane tab="NFS Subdir External Provisioner" key="NFS Subdir External Provisioner">

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.0.x|1.0.0|

</Tabs.TabPane>

<Tabs.TabPane tab="Open Stack Cinder" key="Open Stack Cinder">

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.21.x|1.21|
|1.20.x|1.20|
|1.19.x|1.19|
|1.18.x|1.18|

</Tabs.TabPane>

<Tabs.TabPane tab="Portworx" key="Portworx"> 

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|2.6.x|2.6.1|

</Tabs.TabPane>

<Tabs.TabPane tab="Rook Ceph" key="Rook Ceph"> 

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.5.x|1.5.9|


</Tabs.TabPane>

<Tabs.TabPane tab="vSphere CSI" key="vSphere CSI"> 

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|2.3.x|2.3.0|


</Tabs.TabPane>

<Tabs.TabPane tab="vSphere Volume" key="vSphere Volume"> 

|Major and Minor Version|Corresponding Patch Versions|
|--|--|
|1.0.x|1.0.0|

</Tabs.TabPane>

</Tabs>


# Operating System Layer Versions

|Operating System |Versions|
|--|--|
|Ubuntu|Ubuntu 18.4|
|centOS|CentOS 7.7|


# Network Layer Versions

<Tabs>

<Tabs.TabPane tab="Calico" key="Calico Version">

|Calico |Versions|
|--|--|
|3.22.x|3.22.0|
|3.19.x|3.19.0|
|3.16.x|3.16.0|
|3.10.x|3.10.0|
|3.9.x|3.9.4|

</Tabs.TabPane>

<Tabs.TabPane tab="Cilium" key="Cilium Version">

|Cilium |Versions|
|--|--|
|1.10.x|1.10.5|
|1.6.x|1.6.0|



</Tabs.TabPane>

<Tabs.TabPane tab="Cilium Enterprise" key="Cilium Enterprise Version">

|Cilium Enterprise|Versions|
|--|--|
|1.10.x|1.10.5|

</Tabs.TabPane>

</Tabs>

<InfoBox>

For more details on Palette Integrations [click here](/integrations#integrations).

For more details on Palette downloadable artefacts [click here](/spectro-downloads#palettedynamicartifacts)

</InfoBox>









