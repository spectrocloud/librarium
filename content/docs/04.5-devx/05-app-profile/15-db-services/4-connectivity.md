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


# Service Connectivity

Connectivity is the process of establishing communication between the database service and clients. Connectivity is required to send SQL queries from clients to the database. Palette database services expose output variables that contain the required connectivity information such as the hostname, database user, user password, and database port. You can use these output variables to connect your application to the database.
The primary considerations in this regard are:

The primary considerations are:

* When adding services to the app profile, consider the order of service layers. Services must be added after the database service layer for other services that require connectivity with the database. In other words, the database service should be at the app profile's bottom-most layer.


* The order of the service layers is important because the output variables used in services follow a usage hierarchy. The output variables for a service are only available if the service comes after the service that exposes the output variable. Output Variables from the first services you add, which become the first layer in the app profile stack, can be consumed by other services after it. However, output variables cannot be passed downwards from the top service layers.


* You can pass the output variables to the different service layers as YAML values. The value can be passed on as arguments, secrets, as part of the manifest, or any YAML parameter per the user's requirement. You can also consume the output variables as environment variables in container services.


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

<br />


## Postgres Connectivity

* For [Postgres](https://www.postgresql.org/docs/current/libpq-ssl.html) if you want to establish connectivity, set `sslMode` to `require`. 


* To get the Postgres database user secret use the following kubectl command:


<br />

```
kubectl get secret <app-name>-<service-name>-postgres-<user-name>-credentials -n <app-name>-<service-name>-ns -o jsonpath='{.data.password}' | base64 --decode
```
Where, 

  * app-name: represents the custom app name.
  * service-name: represents the custom service name.
  * user-name: represents the custom username for database access.

<br />







  

