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


### Sample SecretStore YAML file

<br />

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

### Sample ExternalSecret YAML file

<br />

```yml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: custom-name
spec:
  provider:
    vault:
      server: "http://12.34.567.133:0000" # custom server end point
      path: "secret" # custom path
      version: "v2" # custom version
      auth:
        # points to a secret that contains a vault token
        # https://www.vaultproject.io/docs/auth/token
        tokenSecretRef:
          name: "vault-token1"  # Custom name and key
          key: "token1"
---
apiVersion: v1
kind: Secret
metadata:
  name: vault-token1
data:
  token: cm9vdA== # "root"   # custome value
```

# References

[Amazon IAM-Policy-Examples-ASM-Secrets](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html)

[External Secrets](https://github.com/external-secrets/external-secrets)





