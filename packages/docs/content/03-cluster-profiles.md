---
title: "Cluster Profiles"
metaTitle: "Understanding Cluster Profiles"
metaDescription: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
icon: "bundles"
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Cluster Profiles

Cluster profiles are like templates that are created with pre-configured layers/components needed for cluster deployments. A user can create as many profiles as needed. Choose one, add a cluster, and deploy. A cluster profile contains the details of the configurations needed for a particular type of deployment. The mandatory layers are the OS, the Kubernetes itself, the networking, and the storage layers. Beyond this, other available layers are:

- System apps.
- Authentication.
- Security.
- Monitoring.
- Logging.
- Ingress.
- Load balancer.

There exist possibilities of having multiple copies of the same layer, should you choose to have a profile in such a manner. The profile would then read, as an example: OS, Kubernetes, Networking, Storage, Monitoring, Monitoring, Ingress, Ingress.

The next sections detail the process of creating and saving a profile.
