---
title: "Manage Dev Engine"
metaTitle: "Palette Dev Engine Management"
metaDescription: "Palette Dev Engine Management"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Disable Social Sign-In

Palette provides the flexibility to disable social sign in to restrict this capability. To disable Social Sign In, the user as a Palette tenant admin must set up SSO authentication in the Palette console.

* Log in to the Palette console as a Tenant Admin.


* Go to `Tenant Settings` and select `SSO` from the left main menu.


* From **Manage SSO**, go to `Auth Providers` and toggle the `Enable Provider Login` button.

   Note: This button will be enabled by default.


* To enable it again, toggle the button and select the Social Sign In platform the developers want to use. For example, we currently support Google and Git Hub-based Sign in.


* Log out of the Palette console


* Login back to the Palette console selecting the Social Sign In platform enabled in the previous step. The log in can progress in two ways:

  * If no Tenant exists in that Log In, Palette will create a new Tenant under a new organization and log in to that tenant console.

  * If a Tenant already exists in that Log In, then Palette will directly log the developer into that Tenant console.
 
<br />

# Troubleshooting

In the free tier, Palette specifies a [LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/) for each Palette Virtual Cluster namespace as part of the values.yaml in Cluster Groups. Therefore, every `resources:` section in every pack's values.yaml file should specify **BOTH** `requests` and `limits` or **NEIGHTER**.

**Example:**
If you specify requests but not limits, the default limits imposed by the LimitRange will likely be lower than the requests, causing an error as below:

<br />

```
Invalid value: "300m": must be less than or equal to CPU limit spec.containers[0].resources.requests: Invalid value: "512Mi": must be less than or equal to memory limit]
```
<br />

