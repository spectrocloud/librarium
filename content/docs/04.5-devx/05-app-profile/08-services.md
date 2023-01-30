---
title: "Services"
metaTitle: "Palette Dev Engine App Services"
metaDescription: "Palette Dev Engine App Services"
hideToC: false
fullWidth: false
---

# Services

Palette offers you different types of services to help you model all the dependencies and resources required for deploying an application. You can choose from several different service types in Palette.

<br />

## Container Deployment

[Containers](https://www.docker.com/resources/what-container/) are methods of building, packaging, and deploying an application. A container includes the code, run-time, libraries, and all the dependencies required by a containerized workload. Containers are deployed to their target environment. For steps on how to deploy a container in Palette, refer to [Container Deployment](/devx/app-profile/container-deployment).


## Helm

Palette provides out-of-box Helm registries and allows you to add registries. For more information, visit [Palette Helm Registry](/devx/registries/helm-registry#palettehelmregistry).


## Manifest 

You can construct App Profile layers using raw manifests to provision Kubernetes resources that are unavailable in Palette or Helm Charts. Pack Manifests provide a pass-through mechanism to orchestrate Kubernetes resources in a cluster. For example, specific integrations may require creation of Secrets or Custom Resource Definitions (CRDs). To achieve this, you can attach a Manifest file to the layer.

# Out-of-the-box Services

Palette also offers a set of common services or resources that application authors frequently use to expand or add capabilities to an application. These services are managed by Palette and help reduce the burden of maintaining and deploying resources required by your application.

<!-- <InfoBox>
We encourage you to securely distribute credentials using secrets. You can achieve this by constructing manifests to consume parameters that use references. You can also add a manifest to create your Kubernetes secrets using macros to inject the values. In the App layer, set the environment variables using a Secret reference.

**Example**

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

</InfoBox> -->

<br />

<!-- <WarningBox>
    When adding services to App Profiles using manifest files, specify a namespace name to which the resource belongs.
</WarningBox>  -->

## Messaging System Services

A messaging system service is a platform that enables the exchange of messages between users. It allows people to send and receive messages in real-time, using different devices and communication channels.

<br />

## Object Storage Services

Object storage is a data storage solution for unlimited, unstructured data like images, videos, and backups. It's managed as objects, not files or blocks, and is scalable and durable.

<br />


## Database Services

A database stores structured data electronically for fast search and retrieval. It's commonly used for applications and websites to store information such as user data, transactions, and analytics.

<br />

## Available Services

Check out the available service offerings in Palette by visiting the [Service Listings](/devx/app-profile/service-listings) resource.



<!-- <InfoBox>

  Variables used in services follow a usage hierarchy. Variable values from the first services you add, which become the first layer in the App Profile stack, can pass to services you add next, which appear higher in the stack. Variable values _cannot_ pass from the top service layers down.

  To view the available output variables from lower layers in the stack, type ```{{.spectro.}}``` in a text editor.
</InfoBox> -->