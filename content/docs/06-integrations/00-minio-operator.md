---
title: 'MinIO Operator'
metaTitle: 'MinIO Operator'
metaDescription: 'MinIO Operator Distributed Object Storage pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/palette-upgrader/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# MinIO Operator Overview

MinIO is a Kubernetes-native high performance object store with an Amazon S3-compatible API. Use MinIO to build high performance infrastructure for machine learning, analytics, and application data workloads.

The MinIO Kubernetes Operator supports deploying MinIO tenants onto private and public cloud infrastructures, bare metal infrastructure, orchestrated environments, and edge infrastructure. Each MinIO tenant represents an independent MinIO object store in the Kubernetes cluster. It supports one MinIO tenant per Namespace.

The MinIO Operator extends the Kubernetes API to support deploying MinIO-specific resources as a tenant in a Kubernetes cluster. 

The MinIO `kubectl minio` plugin wraps the Operator to provide a simplified interface for deploying and managing MinIO Tenants in a Kubernetes cluster through the `kubectl` command line tool.

# Prerequisites

- An existing Kubernetes deployment where at least one worker node has a locally-attached drive.
- A local ``kubectl`` installation configured to create and access resources on the target Kubernetes deployment.

# Version Supported

MinIO Operator **4.5.4**.

# Contents

MinIO Operator provides the following templates:

- Helm Chart
- Cluster role and cluster role binding
- Console templates for deployment, ingress, service, user interface, 
- Tenants
- Deployment
- Service account and operator service.  

# References

[MinIO](https://min.io/docs/minio/linux/index.html)