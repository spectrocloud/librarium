---
sidebar_label: "App Profile Cloning"
title: "App Profile Cloning"
description: "Palette Dev Engine App Profile Cloning"
hide_table_of_contents: false
sidebar_position: 30
tags: ["devx", "app mode", "pde"]
---

Palette supports the cloning of App Profiles across multiple projects. For example, you can clone an app profile created under a specific project to another project within the same [tenant](/glossary-all#tenant). The ability to clone App Profiles can be useful for the following use cases.

* Share system scope App Profiles to projects scope.


* Share App Profiles amongst different projects.

## Prerequisites

* An App Profile created in Palette. Check out the [Create an App Profile](/devx/app-profile/create-app-profile) for guidance.

## Clone an App Profile

To clone an App Profile follow the steps below:

1. Login to [Palette](/devx#quickstartwithpaletteappmode)


2. Select **App Profiles** from the left **Main Menu**. Identify the App Profile you want to clone and click on the three dots at the right handside of the row. Click on the **Clone** button from the drop down.


4. You will be prompted to fill out the following information:
   * **Name:** Name of the new app profile.
   * **Profile Version:** Version number for the new app profile.
   * **Source Profile Version:** The version number of the source app profile getting cloned.
   * **Target Project:** The target project to which the profile is to be cloned. Select the project name from the drop-down menu.


5. Click **Confirm** to conclude the cloning of the App Profile. 

In the target project specified during the clone process, you can now use the App Profile for app deployments.


## Validate

To validate the App Profile is cloned and available in the target project conduct the following steps:


1. Login to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.     


3. This page will list all the App Profiles available to you. In addition, this should list all the cloned App Profiles as well. Use the cloned App Profile for App deployment under the target scope.



 



