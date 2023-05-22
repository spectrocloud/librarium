---
title: "Palette Upgrade"
metaTitle: "Palette Upgrade"
metaDescription: "Troubleshooting steps for errors encountered with upgrade actions."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Palette Upgrades

We recommend you review the [Release Notes](/release-notes) and the [Upgrade Notes](/enterprise-version/upgrade) before attempting to upgrade Palette. Use this information to address common issues that may occur during an upgrade.



# Ingress Errors

If you receive the following error message when attempting to upgrade to Palette versions greater than Palette 3.4.X in a Kubernetes environment, use the debugging steps to address the issue.

<br />

```text
Error: UPGRADE FAILED: failed to create resource: admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: host "_" and path "/v1/oidc" is already defined in ingress default/hubble-auth-oidc-ingress-resource
```


## Debugging Steps

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


4. Restart the upgrade process.

<br />

