---
title: "Stand-alone and Integrated Packs"
metaTitle: "AStand-alone and Integrated Packs"
metaDescription: "Learn about Palette Stand-Alone Packs and Integrated Packs."
icon: ""
hideToC: false
fullWidth: false
---

import {Content} from "shared/layouts/Default";
import Tabs from "shared/components/ui/Tabs";
import Packs from "shared/components/common/Integrations/Packs"
import AppTiers from "shared/components/common/Integrations/AppTiers"

# Overview

Palette provides many add-on packs that are stand-alone and do not have dependencies. For more complex configurations, Palette has introduced integrated packs, which have dependencies that are handled internally, giving users convenience over configuration. Integrated packs are available in cluster profiles.

Say you want to add the Kubernetes Dashboard to your cluster profile. Typically, this would require manually adding a dependency proxy pack to enable the use of a reverse proxy with a Kubernetes cluster. It also requires configuring third-party authentication through OIDC.

Palette’s integrated version of the Kubernetes dashboard pack, called Spectro Kubernetes Dashboard, has pre-set defaults and does not require configuration. However, integrated packs offer the flexibility to change defaults if needed. Changing the defaults in an integrated pack would require some configuration. 

<WarningBox>
Default settings provide best practices for your clusters. Changing the default settings can introduce security issues by exposing your clusters. We recommend using the defaults.
</WarningBox>

<br />

<br />


