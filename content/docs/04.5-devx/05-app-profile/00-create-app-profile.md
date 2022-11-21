---
title: "Create an App Profile"
metaTitle: "Learn how to create an App Profile"
metaDescription: "This guide provides guidance on how to create a Palette App Profile"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Create an App Profile

You can create as many App Profiles as you need to fit your various types of workloads. Each App Profile may contain multiple services, also called tiers. Palette Dev Engine supports the creation of multiple versions of an App Profile. To learn more visit the App versioning documentation [page](/devx/app-profile/versioning-app-profile).


### Create Your App Profile

To create an App Profile, follow the steps below.

1. Log in to the Palette Dev Engine console


2. Select the **App Profiles** from the left **Main Menu** and click on the **New App Profile** button at the top right handside of the main screen. 

3. Provide the wizard with the following information and click on **Next** button after you have filled out the information.

**Basic Information: **

|         Parameter           | Description  |
|-------------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Description (optional)   | Description of the App Profile, if any | 
|Tag (optional)               | Tags on a cluster group are propagated to the cloud/datacenter environments.|

4. **Add Service**: Select a service to start configuring the App Profile from the list of services available. The service you select will require you provide information to generate the configuration. The following is an explanation of the types of services available. 

  * [Container Deployment](/devx/app-profile/container-deployment): Containers are methods of building, packaging, and deploying an application. A container includes the code, runtime, libraries, and all the dependencies required by a containerized workload. Container deployment deploys containers to their target environment.
 

 * [Helm](/devx/registries#palettehelmregistry): Palette App profile Pack from Helm registry charts. The public Palette Pack registry and a few popular Helm chart repositories are already available out of the box. Add additional pack registries or public or private chart registries to Palette.
 

 * Manifest: Layers can be constructed using raw manifests to provision Kubernetes resources that are unavailable in Palette or Charts. Pack Manifests provide a pass-through mechanism in which additional Kubernetes resources can be orchestrated onto a cluster and the rest of the stack. Specific integrations may require the creation of Secrets or CustomResourceDefinition (CRDs). Manifest files can be attached to the layer to achieve this. 

    <br />

    <WarningBox>
    When adding tiers to the App profile using manifest files, specify a namespace name to which the resource must belong.
    </WarningBox>

 *  Database Services: Different database applications such as MongoDB, PostgreSQl, Redis, etc.

    <br />

    <InfoBox>

    The applications follows a hierarchy, where in the output variables values from the application added first can be passed to application tiers added after that. The reverse is not possible.

    To view the available output variables from the below tiers in the code editor, type in ```{{.spectro.}}```.
    </InfoBox>



When you select a service, you will see the configuration options for that service on the righthand side of the screen. Once you have provided all the required information for the service you may click on the **Review** button to proceed. You may also add additional services or tiers, by clicking on the blue **Actions** button on the top lefthand of the screen. 

<br />


5. **Review** the configuration and click on the **Finish Configuration** button.


The Palette Dev Engine App Profile is now created and and can be used for Apps deployment. To edit or delete the App Profile, navigate to the **App Profile** page. Select the desired App Profile and click on the  **Settings** button at the top righthand side. 

<br />

## Validation

You can validate the App Profile is avaiable and ready for us by visiting the App Profiles page. In the App Profiles page, you will find your App Profile listed.

<br />

<br />

## Security

Palette encourages the developers to [securely distribute their credential using secrets](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/). We can achieve security by constructing their manifests to consume the parameter by references. They can also add a manifest to create their Kubernetes secrets, using macros to inject the values. In the App tier, set the environment variables using a secret reference. 

**Example Scenario**

```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  namespace: {{.spectro.system.apptier.NAMESPACE}}
data:
  
  namespace: "{{.spectro.system.apptier.NAMESPACE}}" # Resolves to a value of the variable defined in App Profile tier parameters.yaml file.

  password: "{{.spectro.app.$appDepName-mongodb.PASSWORD}}" # To refer the tier output variables of the top tiers.
	
```
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myweb
  namespace: mywebnamespace
  ...
spec:
  template:
  ...
      containers:
        - env:
            - name: PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysecret
                  key: password
```



<br />
<br />