---
title: "Cluster Profiles"
metaTitle: "Cluster Profiles"
metaDescription: "Learn about Palette Cluster Profiles and how to apply them to your clusters."
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview 

When you create a cluster in Palette, you apply an environment-specific cluster profile to it that includes core layers - or infrastructure - that clusters require: an Operating System (OS), Kubernetes layer, Network, and Storage. Infrastructure profiles and Full cluster profiles both include these core layers. Full cluster profiles have both the core layers and add-on layers that enhance cluster functionality.

Optionally, you can create Add-on profiles to add specific functionality, such as security, monitoring, and logging. You can think of add-on profiles as special purpose profiles. To learn more about add-on profiles, refer to the [Add-On Profiles]() guide. 

The diagram illustrates the contents of each profile type and the relationship between them. 

<!-- Optionally, you can create Add-on profiles or add layers to the Infrastructure profile to apply to clusters to add specific functionality. Or you can add layers to the Core Infrastructure profile itself. To learn more about add-on profiles, refer to the [Add-On Profiles]() guide. The diagram illustrates what each profile -->


![Cluster Profile Types](/cluster_profiles.png)


The following sections show how Palette displays each profile type.  

<<< SEE ABOUT UPDATING DIAGRAM >>>

<br />

#### Infrastructure Cluster Profile

You create an infrastructure profile by adding preconfigured OS, Kubernetes, network, and storage layers. The infrastructure layers are cloud-specific, and the first layer in the stack is always the OS layer.

![Core Infra Profile - Azure](/cluster_profile_azure.png)

<<< UPDATE SCREENSHOT >>>

<br />

#### Add-On Cluster Profile

Use Add-on cluster profiles to enhance cluster functionality. An Add-on cluster profile consists of various integrations and can be constructed using layers such as the following.

<br />

- System apps
- Authentication
- Security
- Monitoring
- Logging
- Ingress
- Load balancer
- Helm Charts


![Add-On Profile](/addon_profile.png)

<<< UPDATE SCREENSHOT >>>

<br />

#### Full Cluster Profile

A Full cluster profile consists of the Infrastructure layers and as many Add-on layers as needed. 

![Full Cluster Profile](/full_profile.png)


<<< UPDATE SCREENSHOT >>>

<br />

<br />
