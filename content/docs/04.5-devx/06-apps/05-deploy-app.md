---
title: "Deploy an Application using Palette Dev Engine"
metaTitle: "Deploy an Application using Palette Dev Engine"
metaDescription: "Learn how to deploy applications to a Kubernetes cluster without the traditional overhead accompanied by Kubernetes. Palette’s App Mode reduces the deployment time and complexity when deploying applications to Kubernetes. Learn how to get started with Palette’s App Mode in this tutorial. Get started with the free tier of Palette App Mode"
icon: ""
category: ["app mode"]
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Deploy an Application using Palette Dev Engine

Kubernetes is a popular container orchestration system that helps organizations manage and scale their containerized applications. It offers a range of features and tools that allow you to deploy, scale, and manage containerized applications consistently and reliably. Despite its complex architecture and learning curve, Kubernetes offers significant benefits for organizations willing to invest in learning and using this technology.

Palette’s mission is to reduce the challenges you, as a user, face when interacting with Kubernetes. Whether you are a system administrator or an application developer, Kubernetes can introduce overhead that slows down the development process. One of Palette’s core components, *Dev Engine*, focuses on reducing the application development time by enabling builders to deploy applications to Kubernetes with minimal friction. 

In this tutorial, you will learn how to deploy a single application and multiple applications to Kubernetes through Palette’s Dev Engine experience. You will learn about *App Mode*, *App Profiles*, and *Palette Virtual Clusters* and understand how they enable you to deploy applications to Kubernetes quickly with minimal overhead. 

# Prerequisites

To complete this tutorial, you will need the following items.

A Spectro Cloud account
Basic knowledge about Kubernetes and containers.

 If you select the Terraform workflow, you will need the following software installed.
Terraform v1.3.6 or greater
Git v2.30.0 or greater

There are no expenses associated with this tutorial as everything falls under the Palette Free Tier.


# Architecture 

The tutorial includes two scenarios, and for each scenario, you will deploy a separate Kubernetes environment. The following diagram illustrates the different layers that will power the tutorial environment.

![Architecutre diagram depicting two virtual clusters](devx_apps_deploy-apps_architecture-diagram.png)

The top layer is Palette, which is the product platform. Palette can be used in two modes: app mode or cluster mode. Each mode is intended for different use cases and personas, but for this tutorial, you will use app mode. For an in-depth explanation of each mode’s differences, check out the documentation for [App Mode and Cluster Mode](/introduction/palette-modes). 

# Deploy The Environment

The following steps will guide you through deploying the two scenarios. You will start with the single application scenario to build up your knowledge before deploying the multiple applications scenario.


## Deploy a Single Application 

From Palette, you will deploy two Palette Virtual Clusters. Palette Virtual Clusters will be referred to as virtual clusters for the rest of the tutorial. Each virtual cluster will be hosted on a host cluster group managed by Spectro Cloud, called beehive. You can deploy up to two virtual clusters in the beehive group for free. Each scenario’s virtual cluster will sit on the beehive host cluster group.

<br />

<InfoBox>


Virtual clusters are standalone Kubernetes environments that sit on top of what you would consider a traditional Kubernetes cluster or host cluster. Palette Virtual Clusters are Kubernetes clusters that run as nested clusters within an existing host cluster and share the host cluster resources, such as CPU, memory, and storage. Palette Virtual Clusters use k3s, a highly available, certified Kubernetes distribution designed for production workloads. Palette Virtual Clusters are also powered by vCluster.

</InfoBox>

You can complete this tutorial by using the Palette console, simulating a manual workflow. Or you may leverage infrastructure as code and complete the tutorial using Terraform.

<br />


<Tabs>
<Tabs.TabPane tab="UI Workflow" key="UI">

### UI Workflow.

Start by log in to Palette. From the landing page, click on the user **drop-down Menu** and click on **App Mode**.

![Image with an  arrow pointing to the user drop down menu](devx_apps_deploy-apps_toggle-app-mode.png)


From the app mode landing page, navigate to the left **Main Menu** and click on **Virtual Clusters**.  Next, click on the button **New Virtual Cluster**

![View of the virtual cluster list](devx_apps_deploy-apps_virtual-cluster-list.png)

In the following screen, you will be prompted for the cluster group, virtual cluster name, and the cluster size in terms of CPU, memory, and storage. Select beehive for the cluster group, name the cluster cluster-1,  and allocate 4 CPU, 4 GiB memory, and 2 GiB of storage. Click on **Deploy Virtual Cluster** after you have filled out all the required information.

It will take a few minutes for the virtual cluster to deploy. In the meantime, go ahead and navigate to the left **Main Menu** and click on **App Profiles**.


![The App Profile page with arrows guiding](devx_apps_deploy-apps_app-profiles.png)


App Profiles are templates that contain all the configurations and settings required to deploy applications to virtual clusters. App Profiles provide a way to drive consistency across virtual clusters as you can re-use app profiles and deploy them to different virtual clusters. You can think of app profiles as declarative templates that inform the Kubernetes cluster of the desired application or set of applications. 

Click on the **New App Profile** button to get started with creating your first app profile. Give the app profile the name `hello-universe-ui` and add the tag `scenario-1`. Click on **Next**. The following screen is the service type selection page. You have the option to deploy applications through containers, Helm, or Manifests. You can also consume services such as databases and more. Click on **Container Deployment**.

Name the container `ui`, select a public registry, and provide the following image URL `ghcr.io/spectrocloud/hello-universe:1.0.7`. Change the network access to **Public** and add the port `8080`

![App Profile container creation page with details](devx_apps_deploy-apps_app-profile-creation.png)


Click on **Review** once you have filled out the provided information. On the next page, click on the **Deploy New App** button. 

It’s time to deploy your app profile containing your application to a virtual cluster.  Go ahead and name the application “single-scenario.” For the **App profile** input field, click on the button to the right of the input field to get a list of all your available app profiles. Select the hello-universe-ui profile and click on **Confirm** to continue.

Next, click the radio button **Deploy in An Existing Palette Virtual Cluster**. Select the cluster-1 you created earlier and click on **Create App** to deploy the app profile onto the virtual cluster.

<br />

<WarningBox>

If no clusters are available, then **cluster-1** is not yet available. Wait a few more moments and return to the above steps. You can refresh the page, but you must fill out all the required input fields.

</WarningBox>

The app profile deployment takes a few moments to finish. You can review the application's progress by navigating to the left **Main Menu** and clicking on Virtual Clusters. Click on cluster-1 to view its details page.  You can review cluster information, log events, access a remote shell session in the cluster, and more from the cluster details page.

![Cluster details view displaying exposed services](devx_apps_deploy-apps_cluster-details-view.png)

When the application is deployed and ready for use, the **Services** row on the details page will automatically be updated by Palette with the app's public-facing URL. Click on the **:8080** link to view the application.

<br />


<WarningBox>


It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.
</WarningBox>


![Hello Universe landing page displaying global clicks](devx_apps_deploy-apps_hello-universe.png)

Welcome to Hello Universe, a demo application to help you learn more about Palette and its features. Feel free to click on the logo to increase the global counter and for a fun image change. 

You now have deployed your first app profile to Palette. Your first application is a single container application with no dependencies. In a production environment, you often deploy applications that consume other services and require connectivity with other resources. The next scenario expands on the single application scenario by adding an API server and Postgres database to simulate better a common application architecture encountered in a production environment.



## Deploy Multiple Applications 




</Tabs.TabPane>
<Tabs.TabPane tab="Terraform" key="terraform">
    WIP
</Tabs.TabPane>

</Tabs>
