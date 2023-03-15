---
title: "Register Edge Host"
metaTitle: "Register your edge hosts with the Palette Management Console"
metaDescription: "Learn how to register your edge hosts with the Palette Management Console"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Edge hosts should be registered with the Palette Management Console so that they can be used to deploy edge clusters.

# Auto Registration

If an auto registration token was provided as user data to the edge host, then they automatically get registered with the Palette Management console. The default project, if any selected for the registration token determines the exact project within your tenant that the edge host is registered under. The project can be overriden in user data to change to a different project.

# Manual Registration

In this mode, the edge host needs to be registered manually by providing the host's unique identifier. Navigate to the clusers page and click on the 'Edge Hosts' tab. Create 'Add New' option to bring up the edge host addition screen. Provide the unique ID and optinally one or more tags as name, value pairs.

The unique ID for the edge host can be auto-generated from the serial number. Alternately, it can be provided in the user data or generated using a specialized macro.
