---
title: "Palette Onboarding Workflow"
metaTitle: "Palette Onboarding Workflow"
metaDescription: "Palette Onboarding Workflow"
icon: ""
hideToC: true
fullWidth: false
hideToCSidebar: true
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Palette Onboarding Workflow

Palette offers a product tour to help you get familiar with the console and many of its key components.

## Product Tour
Upon a successful sign-in to our platform, we start the onboarding process with a product tour—an introduction to the platform, to familiarize the users with our Palette features.


## Start your Palette Experience

![user-experience.png](/user-experience.png)


The product tour is followed by a Palette experience session.  Here we make sure that our users are guided through a successful deployment pipeline in their first use, instead of them just figuring things out along the way towards cluster creation.  The major components of this session are as follows:

* [Create New Cluster](/clusters)

  * Create a new cluster from scratch using any cloud environment or bare metal.

  * A system-level cluster profile is included for the users to explore the Palette functionalities easier and faster.

* [Import Cluster](/clusters/brownfield-clusters#overview)
  * Bring your own cluster into Palette in two easy steps.

* Out-of-the-box (OOTB) Configurations:
  * Try one of our out-of-the-box cluster profile configurations applicable on your own cluster or in our Palette Virtual Cluster environment.

<InfoBox>
Once the user experience session is finished, the user will be familiar with Palette's workflow and deployment pipeline. This section of the document is a quick start to the deployment process with simple instructions to jump start the Palette journey. The different Palette features and Day-2 operations are detailed in the remainder of this documentation site.
</InfoBox>


### Connect with us
* [Slack](https://spectrocloudcommunity.slack.com/join/shared_invite/zt-g8gfzrhf-cKavsGD_myOh30K24pImLA#/shared-invite/email)

* support@spectrocloud.com


# Palette Workflow

Palette requires the creation of a cluster profile before a workload cluster can be created. This is because [cluster profiles](/cluster-profiles) are
templates created with preconfigured layers that define the required dependencies, such as the Operating System (OS) and Kubernetes version for your cluster.  The cluster profile is a core component of Palette. You can learn more about cluster profiles by reviewing the [cluster profile](/cluster-profiles) reference page.

# Resources

* [Create your Cluster Profile](/cluster-profiles/task-define-profile/#creatingclusterprofiles)


* [Create your Cluster](/clusters)


* [Imported Clusters](/clusters/imported-clusters)


* [Cluster Management](/clusters/cluster-management/#managecl)

