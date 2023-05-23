---
title: "Upgrade Notes"
metaTitle: "Upgrade Notes"
metaDescription: "Spectro Cloud upgrades notes for specific Palette versions."
icon: ""
hideToC: false
fullWidth: false
---


# Overview


This page is a reference resource to help you better prepare for a Palette upgrade. Review each version's upgrade notes for more information about required actions and other important messages to be aware of. If you have questions or concerns, reach out to our support team by opening up a ticket through our [support page](http://support.spectrocloud.io/).


# Palette 3.4

Prior versions of Palette installed internal Palette components' ingress resources in the default namespace. The new version of the Helm Chart ensures all Palette required ingress resources are installed in the correct namespace. Self-hosted Palette instances deployed to Kubernetes and upgrading from Palette versions 3.3.X or older must complete the following action.

<br />

1. Connect to the cluster using the cluster's kubeconfig file.



2. Identify all Ingress resources that belong to *Hubble* - an internal Palette component.

  <br />

 	```shell
  kubectl get ingress --namespace default
  ```

3. Remove each Ingress resource listed in the output that starts with the name Hubble. Use the following command to delete an Ingress resource. Replace `REPLACE_ME` with the name of the Ingress resource you are removing.

  <br />

  ```shell
  kubectl delete ingress --namespace default <REPLACE_ME>
  ```


<br />