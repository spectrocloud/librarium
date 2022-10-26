---
title: 'External Secrets Operator'
metaTitle: 'external-secrets-operator'
metaDescription: 'external-secrets-operator pack in Palette'
hiddenFromNav: true
isIntegration: true
category: ['authentication']
logoUrl: 'https://registry.spectrocloud.com/v1/external-secrets-operator/blobs/sha256:ee6f7f347d381852582f688c70b2564b0a346c2b2ed1221310889075a4453c6d?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# External Secrets Operator

External Secrets Operator (ESO) is a Kubernetes operator that integrates external secret management systems like AWS Secrets Manager, HashiCorp Vault, Google Secrets Manager, or Azure Key Vault. The ESO automatically injects the values from the external APIs into a Kubernetes Secret.

You can use the External-Secrets-Operator Add-on pack as an authenticator, within the Palette orchestrator, to read secrets from external secret stores to place the values read into a Kubernetes Secrets.  


# Version Supported

<br />

*  **external-secrets-operator 0.5.6**


<br />


### Example ExternalSecret YAML file

<br />

First example.

```yml
apiVersion: [external-secrets.io/v1beta1](http://external-secrets.io/v1beta1)
kind: ExternalSecret
metadata:
  name: vault-example # Custom name
spec:
  refreshInterval: "15s"
  secretStoreRef:
    name: vault-backend # Custom value
    kind: SecretStore
  target:
    name: mysecretfoobar
  data:
  - secretKey: foobar
    remoteRef:
      key: secret/foo   # custom value
      property: my-value # custom value

```

<br />

Second example.

```yml
apiVersion: [external-secrets.io/v1beta1](http://external-secrets.io/v1beta1)
kind: ExternalSecret
metadata:
  name: vault-example # Custom name
spec:
  refreshInterval: "15s"
  secretStoreRef:
    name: vault-backend # Custom value
    kind: SecretStore
  target:
    name: mysecretfoobar
  data:
  - secretKey: foobar
    remoteRef:
      key: secret/foo   # custom value
      property: my-value # custom value

```

# References

[Amazon IAM-Policy-Examples-ASM-Secrets](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html)

[External Secrets](https://github.com/external-secrets/external-secrets)





