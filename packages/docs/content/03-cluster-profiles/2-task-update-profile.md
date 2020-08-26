---
title: "Updating Cluster Profiles"
metaTitle: "Updating Cluster Profiles"
metaDescription: "The method for updating or editing an existing Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

## Updating Cluster Profiles

Cluster profiles are typically updated to change the configuration of various layers in a Kubernetes stack. Basic information like name, description, and tags can also be updated. However, the environment associated with the profile cannot be updated.

Following are the steps to update a cluster profile:-

* Navigate  to the desired cluster profile’s details page.

* To update the basic information, invoke the edit dialog, and make changes to name, description, and tags as required. Updates to the tags are not propagated to the cloud environment for previously created clusters. However, any new clusters created from the profile will have their virtual machines tags in the cloud environment.

* To make updates to the profile configuration, navigate to the ‘Layers and Parameter’ section. Make one or more of the following changes as relevant.
  * Add and configure a new layer
  * Remove an existing layer. Please note that OS, Kubernetes, Networking, and Storage are considered as core layers and these cannot be removed.
  * Reconfigure an existing layer to change to a different pack version or  pick a different pack or update pack parameters.
  * Save your changes. Optionally provide a comment to describe the reason for the change. This is useful for audit purposes.

All clusters previously created from this profile will be notified of the changes made to the profile. The clusters can be updated to the latest definition of the profile whenever deemed appropriate.
