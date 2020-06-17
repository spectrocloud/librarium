---
title: "Task: Upgrade a VMware cloud gateway"
metaTitle: "Task: Upgrade a VMware cloud gateway"
metaDescription: "The method of updating a cloud gateway on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Upgrading a cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations or other components need to be upgraded to resolve security or functionality issues. Spectro cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.

Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any down time for the tenant clusters. During the upgrade process, provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded, and are processed as soon as the gateway upgrade is complete.
