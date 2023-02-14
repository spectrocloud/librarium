---
title: "Architecture"
metaTitle: "Palette Edge Architecture"
metaDescription: "Learn about Palette Edge and the architecture used to suppport edge clusters."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

The following are architectural highlights of Palette-provisioned Edge native clusters.

<br />

* Kubernetes is natively installed onto the host.


* Support for bare metal and virtualized edge devices.


* Customizable site properties such as network proxies, certificates, etc.


* Configure the Kubernetes API servers to work with virtual IP address (VIP) or Dynamic DNS.


* Edge supports adding multiple devices to the site to form a multi-node Kubernetes cluster.


* Operating system (OS) images are derived from immutable container-based OS images provided by the open-source project, [Kairos](http://kairos.io).


* The installation is bootstrapped using a relatively small distribution-agnostic installer image named *Stylus*. The appropriate version or flavor of the operating system Kubernetes combination is derived from the cluster profile settings, associated with the edge site, and dynamically downloaded and installed.


* Palette Edge Distribution supports use cases that require customization of OS packages, device drivers, etc.

![native-edge.png](/native-edge.png)