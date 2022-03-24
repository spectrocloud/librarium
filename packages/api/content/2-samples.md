---
title: "Sample Workflow"
metaTitle: "Sample Workflow"
metaDescription: "Spectro Cloud API Sample Workflow"
icon: ""
hideToC: true
fullWidth: false
hiddenFromNav: false
hideToCSidebar: true
---
import {Intro, IntroButtons} from "@librarium/shared/src/components"
import {Layout} from "@librarium/shared"
import InfoBox from "@librarium/shared/src/components/InfoBox"

<Intro>

# Sample Workflows

</Intro>

## Introduction

This page outlines a sample workflow for a use case where a user (either a tenant or an admin) that is already registered performs these steps, all with the use of APIs:

* Login to the Palette management console.
* Create a cluster profile named *cluster-profile-1* with the these (example) layers -
    * OS: Ubuntu, 18.4.X (LTS).
    * Kubernetes: select version 1.19.X.
    * Network: Calico 3.10.X.
    * Storage: vSphere Storage Class.
* Create a cluster in VMware.
* Update the cluster profile to bring the Kubernetes version to 1.21.X.
* Update the cluster to reflect the changes of the Kubernetes version.

For example, let us consider a non-admin user with the email janedoe@thefirm.com and the password *password1234*.

## API Key Authentication

```bash
POST → https://api.spectrocloud.com/v1/apiKeys
```

**REQUEST**

BODY:

```json
{
  {
  "metadata":
    "name": "string"
  },
  "spec": {
    "expiry": "date-time",
    "userUid": "string"
  }
}
```

**RESPONSE**

HTTP CODE: 201

DESCRIPTION: Created successfully

RESPONSE BODY:
```bash
{
  "uid": "string"
}
```
API Key creation successful.

## Authentication

```bash
POST → https://api.spectrocloud.com/v1/auth/authenticate
```

**REQUEST**

BODY:

```json
{
  "emailId": "janedoe@thefirm.com",
  "password": "password1234"
}
```

**RESPONSE**

HTTP CODE: 200<p></p>
DESCRIPTION: OK<p></p>
RESPONSE BODY:

```json
    {
    "Authorization": "string"
    }
```

With this the user is authenticated successfully.

## Creating a cluster profile

```bash
POST → https://api.spectrocloud.com/v1/clusterprofiles
```

BODY:

```json
{
  "metadata": {
    "annotations": "object",
    "creationTimestamp": "date-time",
    "deletionTimestamp": "date-time",
    "labels": "object",
    "name": "cluster-profile-1",
    "namespace": "string",
    "resourceVersion": "string",
    "selfLink": "string",
    "uid": "string"
  },
  "spec": {
    "template": {
      "cloudType": "vmware",
      "packs": [
        {
          "name": "string",
          "tag": "string",
          "uid": "string",
          "values": "string"
        }
        {
          "name": "string",
          "tag": "string",
          "uid": "string",
          "values": "string"
        }
        {
          "name": "string",
          "tag": "string",
          "uid": "string",
          "values": "string"
        }
        {
          "name": "string",
          "tag": "string",
          "uid": "string",
          "values": "string"
        }
      ],
      "type": "string"
    }
  }
}
```

**RESPONSE**

HTTP CODE: 201<p></p>
DESCRIPTION: Created successfully<p></p>
RESPONSE BODY:
```json
{
  "uid": "string"
}
```

## Creating a VMware cluster

```bash
POST → https://api.spectrocloud.com/v1/spectroclusters/vsphere
```

**REQUEST**

BODY:

```json
{
  "metadata": {
    "annotations": "object",
    "creationTimestamp": "date-time",
    "deletionTimestamp": "date-time",
    "labels": "object",
    "name": "string",
    "namespace": "string",
    "resourceVersion": "string",
    "selfLink": "string",
    "uid": "string"
  },
  "spec": {
    "cloudAccountUid": "string",
    "cloudConfig": {
      "network": {
        "networkName": "string"
      },
      "ntpServers": [
        "string"
      ],
      "placement": {
        "cluster": "string",
        "datacenter": "string",
        "datastore": "string",
        "folder": "string",
        "imageTemplateFolder": "string",
        "resourcePool": "string"
      },
      "sshKeys": [
        "string"
      ]
    },
    "machinepoolconfig": [
      {
        "cloudConfig": {
          "instanceType": {
            "diskGiB": "integer",
            "memoryMiB": "integer",
            "numCPUs": "integer"
          }
        },
        "poolConfig": {
          "isControlPlane": "boolean",
          "labels": [
            "string"
          ],
          "name": "string",
          "size": "integer",
          "useControlPlaneAsWorker": "boolean"
        },
        "profileConfig": {
          "infraProfileUid": "string",
          "packValues": [
            {
              "name": "string",
              "tag": "string",
              "values": "string"
            }
          ]
        }
      }
    ],
    "packValues": [
      {
        "name": "string",
        "tag": "string",
        "values": "string"
      }
    ],
    "profileUid": "string"
  }
}
```

**RESPONSE**

HTTP CODE: 201 <p></p>
DESCRIPTION: Created successfully<p></p>
RESPONSE BODY:

```json
{
  "uid": "string"
}
```

## Updating the Cluster Profile

```bash
PUT → https://api.spectrocloud.com/v1/clusterprofiles/{uid}/packs/{packName}/versions/{packVersion}/values
```

**RESPONSE**

HTTP CODE: 204<p></p>
DESCRIPTION: The resource was updated successfully

## Updating the cluster

```bash
PUT → https://api.spectrocloud.com/v1/spectroclusters/vsphere/{uid}
```

**REQUEST**

```json
{
  "metadata": {
    "annotations": "object",
    "creationTimestamp": "date-time",
    "deletionTimestamp": "date-time",
    "labels": "object",
    "name": "string",
    "namespace": "string",
    "resourceVersion": "string",
    "selfLink": "string",
    "uid": "string"
  },
  "spec": {
    "cloudAccountUid": "string",
    "cloudConfig": {
      "network": {
        "networkName": "string"
      },
      "ntpServers": [
        "string"
      ],
      "placement": {
        "cluster": "string",
        "datacenter": "string",
        "datastore": "string",
        "folder": "string",
        "imageTemplateFolder": "string",
        "resourcePool": "string"
      },
      "sshKeys": [
        "string"
      ]
    },
    "machinepoolconfig": [
      {
        "cloudConfig": {
          "instanceType": {
            "diskGiB": "integer",
            "memoryMiB": "integer",
            "numCPUs": "integer"
          }
        },
        "poolConfig": {
          "isControlPlane": "boolean",
          "labels": [
            "string"
          ],
          "name": "string",
          "size": "integer",
          "useControlPlaneAsWorker": "boolean"
        },
        "profileConfig": {
          "infraProfileUid": "string",
          "packValues": [
            {
              "name": "string",
              "tag": "string",
              "values": "string"
            }
          ]
        }
      }
    ],
    "packValues": [
      {
        "name": "string",
        "tag": "string",
        "values": "string"
      }
    ],
    "profileUid": "string"
  }
}
```

**RESPONSE**

HTTP CODE: 204<p></p>
DESCRIPTION: The resource was updated successfully
