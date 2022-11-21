---
title: "Dev Engine Registries"
metaTitle: "Palette Dev Engine for Enterprise Developers"
metaDescription: "Palette Dev Engine Registries"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Palette Dev Engine Registries

The Pack registry is a server-side application that stores and serves packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of multiple registries.

## Default Registry
The default pack registry is Spectro Cloud's public pack registry. It consists of several packs that make it simple for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Spectro Cloud maintains all packs in the default pack registry, this includes taking care of upgrades in the pack registry whenever required.

## Custom Pack Registry
Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

Palette Dev Engine supports the following types of custom registries:

* [Helm Registry](/devx/registries/helm-registry#palettehelmregistry): Visit here for more information on Palette Helm Registry
* [OCI Registry](/devx/registries/oci-registry#setupociregistry:): Visit here for more information on Palette OCI Registry



<br />
<br />

