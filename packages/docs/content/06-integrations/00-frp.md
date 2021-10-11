---
title: 'Forward Reverse Proxy'
metaTitle: 'Spectro Cloud Forward Reverse Proxy'
metaDescription: 'Forward Reverse Proxy Authentication pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['authentication']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png'
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Forward Reverse Proxy
FRP is a fast and straightforward reverse proxy that lets you forward a port of your local server behind a NAT or firewall to a public server. The proxy server pack is available as an add on pack for authentication. Users can attach this layer to the cluster profile while profile creation. This will enable the Kubernetes endpoint to be accessible via a Proxy Server and the endpoint can be found in the kubeconfig downloaded from our Cluster Overview page and in the Kubernetes API section of Cluster Overview page.


<InfoBox>
 
Port 443 needs to be Open for Outbound Communication. <br />
Do not change any values which are available by default, as it is required by our backend system to set the correct configurations.

</InfoBox>

## Versions Supported
<Tabs>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

**1.0.x**

</Tabs.TabPane>
</Tabs>

