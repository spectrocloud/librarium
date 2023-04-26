---
title: "Create a Namespace"
metaTitle: "Create a Namespace"
metaDescription: "Learn how to create a Namespace for VMs."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Although you can deploy virtual machines from the default namespace, we recommend creating at least one namespace dedicated to VMs as a way to organize and manage them. 

Below are benefits of having a dedicated namespace for your VMs.

<br />

- Namespaces provide a way to isolate groups of resources within a single cluster.


- RBAC can be configured based on namespaces, for example:

    - User A has permissions to manage VMs in alpha namespace only.
    - User B can see VMs in all namespaces.
    

- Resource names need to be unique within a namespace but not across namespaces.


- Namespaces are a way to divide cluster resources among multiple users via resource quota.

# Prerequisites

- A running cluster. 


- Permission to create a namespace.


- A unique namespace name that complies with DNS naming conventions.



