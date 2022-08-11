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

External Secrets Operator (ESO) is a Kubernetes operator that integrates external secret management systems like AWS Secrets Manager, HashiCorp Vault, Google Secrets Manager, Azure Key Vault. The ESO automatically injects the values from the external APIs into a Kubernetes Secret.

You can use the External-Secrets-Operator Add-on pack as an authenticator, within the Palette provisions orchestrator, to read secrets from external secret stores to place the values read into a Kubernetes Secrets.  


# Versions Supported

<Tabs>
<Tabs.TabPane tab="0.5.6" key="5.0.x">

*  **external-secrets-operator 0.5.6**

</Tabs.TabPane>
</Tabs>



# Pack Manifest

```yaml

pack:
  #The namespace (on the target cluster) to install this chart
  namespace: "external-secrets-operator"
  
  # For AWS ensure that IAM policy with access is created and added to the Node policy
  # https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html

charts:
  external-secrets:
    # Default values for external-secrets-operator.
    # This is a YAML-formatted file.
    # Declare variables to be passed into your templates.

    replicaCount: 1

    image:
      repository: ghcr.io/external-secrets/external-secrets
      pullPolicy: IfNotPresent
      # -- The image tag to use. The default is the chart appVersion.
      tag: ""

    # -- If set, install and upgrade CRDs through helm chart.
    installCRDs: true

    crds:
      # -- If true, create CRDs for Cluster External Secret.
      createClusterExternalSecret: true
      # -- If true, create CRDs for Cluster Secret Store.
      createClusterSecretStore: true

    imagePullSecrets: []
    nameOverride: ""
    fullnameOverride: ""

    # -- If true, external-secrets will perform leader election between instances to ensure no more
    # than one instance of external-secrets operates at a time.
    leaderElect: false

    # -- If set external secrets will filter matching
    # Secret Stores with the appropriate controller values.
    controllerClass: ""

    # -- If set external secrets are only reconciled in the
    # provided namespace
    scopedNamespace: ""

    # -- Must be used with scopedNamespace. If true, create scoped RBAC roles under the scoped namespace
    # and implicitly disable cluster stores and cluster external secrets
    scopedRBAC: false

    # -- if true, the operator will process cluster external secret. Else, it will ignore them.
    processClusterExternalSecret: true

    # -- if true, the operator will process cluster store. Else, it will ignore them.
    processClusterStore: true

    # -- Specifies whether an external secret operator deployment be created.
    createOperator: true

    # -- Specifies the number of concurrent ExternalSecret Reconciles external-secret executes at
    # a time.
    concurrent: 1

    serviceAccount:
      # -- Specifies whether a service account should be created.
      create: true
      # -- Annotations to add to the service account.
      annotations: {}
      # -- The name of the service account to use.
      # If not set and create is true, a name is generated using the fullname template.
      name: ""

    rbac:
      # -- Specifies whether role and rolebinding resources should be created.
      create: true

    ## -- Extra environment variables to add to container.
    extraEnv: []

    ## -- Map of extra arguments to pass to container.
    extraArgs: {}

    # -- Annotations to add to Deployment
    deploymentAnnotations: {}

    # -- Annotations to add to Pod
    podAnnotations: {}

    podLabels: {}

    podSecurityContext: {}
      # fsGroup: 2000

    securityContext: {}
      # capabilities:
      #   drop:
      #   - ALL
      # readOnlyRootFilesystem: true
      # runAsNonRoot: true
      # runAsUser: 1000

    resources: {}
      # requests:
      #   cpu: 10m
      #   memory: 32Mi

    prometheus:
      # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead.
      enabled: false
      service:
        # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead.
        port: 8080

    serviceMonitor:
      # -- Specifies whether to create a ServiceMonitor resource for collecting Prometheus metrics
      enabled: false

      # -- Additional labels
      additionalLabels: {}

      # --  Interval to scrape metrics
      interval: 30s

      # -- Timeout if metrics can't be retrieved in given time interval
      scrapeTimeout: 25s

    nodeSelector: {}

    tolerations: []

    affinity: {}

    # -- Pod priority class name.
    priorityClassName: ""

    # -- Pod disruption budget - for more details see https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
    podDisruptionBudget:
      enabled: false
      minAvailable: 1
      # maxUnavailable: 1

    webhook:
      # -- Specifies whether a webhook deployment be created.
      create: true
      certCheckInterval: "5m"
      replicaCount: 1
      certDir: /tmp/certs
      # -- specifies whether validating webhooks should be created with failurePolicy: Fail or Ignore
      failurePolicy: Fail
      # -- Specifies if webhook pod should use hostNetwork or not.
      hostNetwork: false
      image:
        repository: ghcr.io/external-secrets/external-secrets
        pullPolicy: IfNotPresent
      # -- The image tag to use. The default is the chart appVersion.
        tag: ""
      imagePullSecrets: []
      nameOverride: ""
      fullnameOverride: ""
      # -- The port the webhook will listen to
      port: 10250
      rbac:
      # -- Specifies whether role and rolebinding resources should be created.
        create: true
      serviceAccount:
        # -- Specifies whether a service account should be created.
        create: true
        # -- Annotations to add to the service account.
        annotations: {}
        # -- The name of the service account to use.
        # If not set and create is true, a name is generated using the fullname template.
        name: ""
      nodeSelector: {}

      tolerations: []

      affinity: {}

        # -- Pod priority class name.
      priorityClassName: ""

      # -- Pod disruption budget - for more details see https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
      podDisruptionBudget:
        enabled: false
        minAvailable: 1
        # maxUnavailable: 1
      prometheus:
        # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead
        enabled: false
        service:
          # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead
          port: 8080

      serviceMonitor:
        # -- Specifies whether to create a ServiceMonitor resource for collecting Prometheus metrics
        enabled: false

        # -- Additional labels
        additionalLabels: {}

        # --  Interval to scrape metrics
        interval: 30s

        # -- Timeout if metrics can't be retrieved in given time interval
        scrapeTimeout: 25s

        ## -- Extra environment variables to add to container.
      extraEnv: []

        ## -- Map of extra arguments to pass to container.
      extraArgs: {}

        # -- Annotations to add to Secret
      secretAnnotations: {}

        # -- Annotations to add to Deployment
      deploymentAnnotations: {}

        # -- Annotations to add to Pod
      podAnnotations: {}

      podLabels: {}

      podSecurityContext: {}
          # fsGroup: 2000

      securityContext: {}
          # capabilities:
          #   drop:
          #   - ALL
          # readOnlyRootFilesystem: true
          # runAsNonRoot: true
          # runAsUser: 1000

      resources: {}
          # requests:
          #   cpu: 10m
          #   memory: 32Mi

    certController:
      # -- Specifies whether a certificate controller deployment be created.
      create: true
      requeueInterval: "5m"
      replicaCount: 1
      image:
        repository: ghcr.io/external-secrets/external-secrets
        pullPolicy: IfNotPresent
        tag: ""
      imagePullSecrets: []
      nameOverride: ""
      fullnameOverride: ""
      rbac:
      # -- Specifies whether role and rolebinding resources should be created.
        create: true
      serviceAccount:
        # -- Specifies whether a service account should be created.
        create: true
        # -- Annotations to add to the service account.
        annotations: {}
        # -- The name of the service account to use.
        # If not set and create is true, a name is generated using the fullname template.
        name: ""
      nodeSelector: {}

      tolerations: []

      affinity: {}

        # -- Pod priority class name.
      priorityClassName: ""

      # -- Pod disruption budget - for more details see https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
      podDisruptionBudget:
        enabled: false
        minAvailable: 1
        # maxUnavailable: 1

      prometheus:
        # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead
        enabled: false
        service:
          # -- deprecated. will be removed with 0.7.0, use serviceMonitor instead
          port: 8080

      serviceMonitor:
        # -- Specifies whether to create a ServiceMonitor resource for collecting Prometheus metrics
        enabled: false

        # -- Additional labels
        additionalLabels: {}

        # --  Interval to scrape metrics
        interval: 30s

        # -- Timeout if metrics can't be retrieved in given time interval
        scrapeTimeout: 25s

        ## -- Extra environment variables to add to container.
      extraEnv: []

        ## -- Map of extra arguments to pass to container.
      extraArgs: {}

        # -- Annotations to add to Deployment
      deploymentAnnotations: {}

        # -- Annotations to add to Pod
      podAnnotations: {}

      podLabels: {}

      podSecurityContext: {}
          # fsGroup: 2000

      securityContext: {}
          # capabilities:
          #   drop:
          #   - ALL
          # readOnlyRootFilesystem: true
          # runAsNonRoot: true
          # runAsUser: 1000

      resources: {}
          # requests:
          #   cpu: 10m
          #   memory: 32Mi
```

# References

[Amazon IAM-Policy-Examples-ASM-Secrets](https://docs.aws.amazon.com/mediaconnect/latest/ug/iam-policy-examples-asm-secrets.html)

[External Secrets](https://github.com/external-secrets/external-secrets)


