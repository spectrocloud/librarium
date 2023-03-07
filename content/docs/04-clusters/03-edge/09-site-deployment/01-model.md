---
title: "Model Edge Native Cluster Profile"
metaTitle: "Instructions for creating an Edge Native Cluster Profile"
metaDescription: "Instructions for creating an Edge Native Cluster Profile"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

CLuster profiles encapsulate the desried specifications for clusters. The K8s flavor, version, the CNI to use etc. are specified in an Edge Native Infrastructure profile. As with any other environment in Palette, additional add-on cluster proifies can be created to define specifications for integraratoins or applications that need to be deployed on the cluster.

<br/>

# Profile Scope

Profile may be defined in the tenant scope (requires tenant admin acceess) or the project scope. The choice depends on how you would like to organize your edge deployments. If all of your edge deployments are going to be organized within a single project, then you can define the cluster profile in the project scope. However, if you would like to use projects to group related sites or have one site per project, then define the profile in the tenant scope. Profiles defined in the tenant scope can be shared amongst all the projects in that tenant.

# Create edge native cluster profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired project or 'Tenant Admin' on the top left to switch to the desired scope.

![scope-switcher.png](/scope-switcher.png)

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Invoke the cluster profile creation wizard by clicking on  'Add new Profile' button. Provide basic information for the profile such as name, description and version.

5. In the next step select 'Edge Native' as the cloud type.

6. In the profile layers screen, for the OS layer, choose the desired OS type &  OS version. The Bring Your Own OS (BYOOS) option can be chosen for advanced scenarios and it requires additional setup. You can optionallly provide additional cloud-init configruation in the OS pack values for setting up Edge Host Users, installing additional OS packages, installing certificates etc. Following is an example of such configuration.

7. For the Kubernetes layer choose the desired K8s Flavor & K8s Version.

8. For the CNI layer choose the desired CNI Type & CNI Version.

9. Review and save your cluster profile.

10. Consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other capabilities. If remote access to the cluster is desired, consider adding the [Spectro Proxy](/integrations/frp) pack to one of the add-on profiles.

11. Optionally, add additional Helm or OCI registries and include applications hosted in those registries in add-on profiles. Check out the guide for adding a [Helm](/registries-and-packs/helm-charts) or [OCI](/registries-and-packs/oci-registry) registry to learn more.

<InfoBox>

To learn more about cloud-init stages and how they can be used to customize the installation process, check out the [Cloud Init Stages](/clusters/edge/cloud-init) resource. You should also review the [Edge Install Configuration](/clusters/edge/stylus-reference) resource to review all user-data parameters.

</InfoBox>
