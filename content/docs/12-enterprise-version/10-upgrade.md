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

# Palette 4.0

Palette 4.0 includes the following major enhancements that require user intervention to facilitate the upgrade process. 

<br />

- **Enhanced security for Palette microservices** - To enhance security, all microservices within Palette now use `insecure-skip-tls-verify` set to `false`. When upgrading to Palette 4.0, you must provide a certificate in the system console. 

  <br />

  If you already have a configured certificate, key, or Certificate Authority (CA) certificate, you can use it. To learn how to add a certificate to Palette, refer to [Add Certificate](/enterprise-version/upgrade#addcertificate).


- **Upgraded on-prem Palette Kubernetes** - the Kubernetes version used for on-prem Palette is upgraded from 1.24 to 1.25. You will need to copy the new Kubernetes YAML to the Kubernetes layer in the Enterprise cluster profile. If you have customized your Kubernetes configuration, you will need to manually adjust custom values and include any additional configuration in the upgraded YAML we provide. Refer to [Upgrade Kubernetes](/enterprise-version/upgrade#upgradekubernetes.)

## Upgrade to Palette 4.0

From the Enterprise cluster system console, click the **Update version** button. Palette will be temporarily unavailable while system services update.

![Screenshot of the "Update version" button in the system consoles.](/enterprise-version_sys-console-update-palette-version.png)

<br />

## Add Certificate

A certificate, key, or CA certificate is required to upgrade to Palette 4.0 and access the Palette console.

<br />

1.  If you do not already have a certificate from a legitimate Certificate Authority, you must generate one for the IP address or Fully Qualified Domain Name (FQDN) if one is specified in **Administration** > **DNS Host** in the system console.


2. Convert the generated certificate, key, or CA certificate to base64 format.


3. In the system console, navigate to **Administration** > **Certificates**.


4. Copy your base64-format certificate, key, and CA certificate to the relevant field.


5. Save your changes.

<br />

## Upgrade Kubernetes

1. In the system console, click on **Enterprise Cluster Migration**.


2. Click on the **Profiles** tab, and select the Kubernetes layer. The Kubernetes YAML is displayed in the editor at right.


3. <<< Should we add a step here advising users to make a backup of their Kubernetes configuration so they can see the configuration changes they may need to copy to the new Kubernetes YAML?>>>


4. Copy the Kubernetes YAML from <<< where?? >>> and paste it into the editor.


5. If you have made any additional configuration changes or additions, add your customizations to the new YAML.


6. Paste the combined values into the Kubernetes Layer Values section. << I could not find a values section in the Kubernetes 1.25 YAML. Does this step mean to copy any intertwined changes from the user's old configuration file to the new one we provide? >>


7. Save your changes.

The Enterprise cluster initiates the Kubernetes upgrade process, leading to the reconciliation of all three nodes.


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