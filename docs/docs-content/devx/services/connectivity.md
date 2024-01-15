---
sidebar_label: "Service Connectivity"
title: "Service Connectivity"
description: "Palette Dev Engine Database Connectivity"
hide_table_of_contents: false
sidebar_position: 0
tags: ["devx", "app mode", "pde"]
---

Using the exposed output variables, you can connect different service layers. For example, assume you have one application and database defined in an app profile. You can connect the two using the exposed output variable containing the Kubernetes service hostname.

It's important to consider the order of service layers. Using the previous example, you must add the application after the database service layer to use the output variables of the database service. In other words, the database service should be at the app profile's bottom-most layer.

The order of the service layers is important because the output variables used in services follow a usage hierarchy. The output variables for a service are only available if the service comes after the service that exposes the output variable. Output variables from the first services you add, which become the first layer in the app profile stack, can be consumed by other services after it. However, output variables cannot be passed downwards from the top service layers.

## Connectivity Example

The following diagram is an example of an app profile containing three different service layers. The bottom layer is a Postgres database, the second layer is a container application, and the top layer is a Helm application.

The API server communicates with the database, and the application sends requests to the API. For each service to establish network connectivity, each layer needs to reference the output variable of the lower layer. The API will use the output variable Postgres exposes that contains the Kubernetes hostname.

![Output Variables example](/devx-services-connectivity-output-variables-example.png)

The API server can consume the output variable `{{.spectro.app.$appDeploymentName.postgresql-3.POSTGRESMSTR_SVC}}` from the Postgres service layer to connect to the database. The output variable would be consumed as an environment variable.

![The API layer consuming the DB output variable](/devx-services-connectivity-container-env-example.png)

The application would use the output variable `{{.spectro.app.$appDeploymentName.api.CONTAINER_SVC}}` from the API service layer to connect to the API. The output variable value can be referenced as a YAML value in the Helm manifest file.

![The App layer consuming the API output variable](/devx-services-connectivity-helm-env-example.png)
