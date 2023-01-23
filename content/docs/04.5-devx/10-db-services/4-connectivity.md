---
title: "Database Connectivity"
metaTitle: "Palette Dev Engine Database Connectivity"
metaDescription: "Palette Dev Engine Database Connectivity"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Database Connectivity

Database Connectivity is the process of establishing communication between the database service and the app services. Connectivity is required to send commands and receive answers as result sets from the database. Palette database services establish the connectivity by distributing underlying driver or provider with connection strings, defined as output variables corresponding to individual database services.

The primary considerations in this regard are:

* Each database service comes with service-specific output variables. These output variables in the form of macros are passed to lower-layer app services to establish connectivity.


* While adding services to the App Profile, consider downward compatibility, where the DB service needs to be at the topmost layer (the first layer to be added to the app profile). This is because the variables used in services follow a usage hierarchy where variable values from the first services you add, which become the first layer in the App Profile stack, can pass to services you add next, which appear higher in the stack. However, variable values cannot pass from the top service layers downwards.


* Pass the output variables to the different service layers as YAML values. The value can be passed on as arguments, secrets, as part of the manifest, or any YAML parameter per the user's requirement.


**Example:**

```
env:
   - name: USER_NAME
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.USERNAME}}"
   - name: PASSWORD
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.PASSWORD}}"
   - name: MONGO_URI
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI}}"
   - name: MONGO_URI_SRV
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI_SRV}}"
```





  

