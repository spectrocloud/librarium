---
title: "Create a Namespace for VMs"
metaTitle: "Create a Namespace for VMs"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

At the top of the VM dashboard, a **drop-down Menu** allows you to select the relevant namespace.

Although it is fine to deploy VMs from the default namespace, we recommend that you create at least one namespace that is dedicated to VMs. 

Benefits of deploying VMs in different namespaces are:

- Namespaces provide a way to isolate groups of resources within a single cluster.


- RBAC can be configured based on namespaces, for example:

    - Clark Kent has permissions to manage VMs in alpha namespace only.
    - Bruce Wayne can see VMs from all namespaces.


- Names of resources need to be unique within a namespace, but not across namespaces.


- Namespaces are a way to divide cluster resources between multiple users (via resource quota).

# Prerequisites

- A registered Custom Registry to store the Spectro VM Dashboard pack.


# Enablement




# Validation


# Next Steps