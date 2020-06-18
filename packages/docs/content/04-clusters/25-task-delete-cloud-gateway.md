---
title: "Task: Delete a VMware cloud gateway"
metaTitle: "Task: Delete a VMware cloud gateway"
metaDescription: "The method of deleting a cloud gateway on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Deleting a cloud gateway

The following steps need to performed to delete a cloud gateway.

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry deletion of the cloud gateway.
* Delete the gateway Virtual Machines from vSphere.
