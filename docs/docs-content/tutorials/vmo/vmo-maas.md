---
sidebar_position: 10
sidebar_label: "Deploy and Manage VMs with VMO and Terraform"
title: "Deploy and Manage VMs with VMO and Terraform"
description:
  "Learn how to create and manage Virtual Machines using Palette VMO on host clusters deployed to Canonical MAAS."
tags: ["VMO", "tutorial", "maas"]
category: ["tutorial"]
---

In this tutorial, you will deploy a VM using Palette Virtual Machine Orchestrator (VMO). You will learn about the
components that make up VMO, how to create and customize them for a Canonical MAAS VMO cluster deployment, and how to
customize and deploy a VM.

<PartialsComponent category="vmo" name="intro-to-vmo" />

## Prerequisites

- Access to a MAAS data center environment.

- Two MAAS machines with the following minimum hardware requirements:

  - 8 CPU Cores
  - 32 GB RAM
  - 250 GB Storage
  - Worker node must have two disks

- Three routable, static IP addresses available in your MAAS environment's network.

- An existing [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) in your MAAS environment.

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally.

- Terraform Only

  - [Git](https://git-scm.com/downloads) installed locally.

  - [Terraform v1.12.1](https://developer.hashicorp.com/terraform/install) installed locally.

#### Packs Used

| **Pack Name**                    | **Version** | **Description**                                                                                                                                                                                                                                                                                                                                                                                  | **ReadMe Link**                                                                                                                        |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Virtual Machine Orchestrator | `4.6.3`     | The Palette Virtual Machine Orchestrator (VMO) pack consolidates all components that you need to deploy and manage Virtual Machines (VMs) alongside containers in a Kubernetes host cluster. You can deploy VMO as an add-on cluster profile on top of an existing data center or edge cluster.                                                                                                  | <VersionedLink text="Virtual Machine Orchestrator Readme" url="/integrations/packs/?pack=virtual-machine-orchestrator&version=4.6.3"/> |
| MetalLB (Helm)              | `0.14.9`    | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols. Offers a network load balancer implementation that integrates with standard network equipment.                                                                                                                                                                                              | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=lb-metallb-helm&version=1.14.9"/>                                   |
| Rook-Ceph (Helm)           | `v1.16.3`   | **Rook** is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for Ceph storage to natively integrate with Kubernetes. **Ceph** is a distributed storage system that provides file, block and object storage and is deployed in large scale production clusters.                                                                    | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=csi-rook-ceph-helm&version=1.16.3"/>                                |
| Cilium                       | `v1.17.1`   | Cilium is a networking, observability, and security solution with an eBPF-based data plane.                                                                                                                                                                                                                                                                                                      | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=cni-cilium-oss&version=1.17.1"/>                                    |
| Palette eXtended Kubernetes  | `v1.32.2`   | Palette eXtended Kubernetes (PXK) is a recompiled version of the open source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette | <VersionedLink text="Palette eXtended Kubernetes Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                   |
| Ubuntu Mass                  | `v22.04`    | Ubuntu is a free, open source Operating System (OS) based on Linux used on desktops, servers, in the cloud, and for IoT devices. Ubuntu is a Linux distribution derived from Debian.                                                                                                                                                                                                             | <VersionedLink text="Ubuntu Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                                        |

## Create a VMO Cluster Profile

<Tabs groupId="Workflows">

<TabItem label="UI" value="UI Workflow">

Log in to [Palette](https://console.spectrocloud.com).

From the left main menu, select **Profiles** > **Add Cluster Profile**.

Enter the name, version number, and any tags you wish to apply to the profile. Set the type value to **Full**. Select
**Next**.

The **Cloud Type** screen appears with all available options for automated deployment of Kubernetes clusters. Select **MAAS**
from the **Infrastructure provider** column. Select **Next**.

The first profile layer is the OS layer. This tutorial uses the _Ubuntu v22.04_ OS image from the _Palette Registry (OCI)_.

Select **Ubuntu latest: v22.04**.

Ubuntu requires customizations to support VMO. Select **Values** and paste the following configuration
into the text editor frame.

Update the value for `NETWORKS` to the appropriate subnet for your environment. The value you enter must be in CIDR
notation and encapsulated in quotes. For example, `192.169.0.0/16`.

```yaml
kubeadmconfig:
  preKubeadmCommands:
    - 'echo "====> Applying pre Kubeadm commands"'
    # Force specific IP address as the Node IP for kubelet
    - apt update
    - apt install -y grepcidr
    - |
      # Enter as a CIDR '192.168.1.0/24'
      NETWORKS="REPLACE_ME"  
      IPS=$(hostname -I)
      for IP in $IPS
      do
        echo "$IP" | grepcidr "$NETWORKS" >/dev/null && echo " --node-ip=$IP" >> /etc/default/kubelet
        if [ $? == 0 ]; then break; fi
      done
    # Increase audit_backlog_limit
    - sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX="audit_backlog_limit=256"/g' /etc/default/grub
    - update-grub
    # Clean up stale container images
    - (crontab -l || true; echo "0 4 * * * /usr/bin/crictl -c /etc/crictl.yaml rmi --prune")| crontab -
    # Update CA certs
    - update-ca-certificates
    # Start containerd with new configuration
    - systemctl daemon-reload
    - systemctl restart containerd
  postKubeadmCommands:
    - 'echo "====> Applying post Kubeadm commands"'
  files:
    - targetPath: /etc/containerd/config.toml
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        ## template: jinja

        # Use config version 2 to enable new configuration fields.
        # Config file is parsed as version 1 by default.
        version = 2

        imports = ["/etc/containerd/conf.d/*.toml"]

        [plugins]
          [plugins."io.containerd.grpc.v1.cri"]
            sandbox_image = "registry.k8s.io/pause:3.9"
            device_ownership_from_security_context = true
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
            runtime_type = "io.containerd.runc.v2"
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            SystemdCgroup = true
```

Select **Next layer**.

Select **Palette eXtended Kubernetes v1.32.2** from the Palette Registry (OCI).

Select the **Properties** icon.

The Palette eXtended Kubernetes pack defaults to use a custom OIDC provider. This tutorial uses the Palette OIDC
Identity Provider. By using Palette as your OIDC provider, your cluster is configured to send authentication requests to
your Palette tenant's configured OIDC provider.

Select **Palette** as the OIDC Identity Provider.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_configure-OIDC-properties.webp)

Select the **Values** icon.

You may configure a different OIDC provider by uncommenting the OIDC `clientConfig` section, and adding your
configuration values.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_Configure-OIDC-Values.webp)

The Palette eXtended Kubernetes pack is pre-configured with subnets for both the clusters internal Pods and Services.
Review the values for **podCIDR** and **serviceClusterIpRange** and update them if necessary.

![Image of the configuration lines where Pod and Services Subnets are set.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_pod-service-ips.webp)

This template contains security configurations that restrict pod actions. In order for the Rook-Ceph Container Storage
Interface (CSI) to function properly, the namespace it is deployed to must be excluded from these security
configurations.

Search for `PodSecurity` and update the exceptions value for `namespaces` to include `rook-ceph`.

![Image of the pod security namespace exclusion values](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_podSecurity.webp)

Select **Next layer**

Select **Cilium v1.17.1** from the Palette Registry (OCI).

Select **Values**.

Cilium requires customizations to support VMO. From the **Presets** drop down menu, set the value for **VMO
Compatibility** to **Enable**, and the value for **Cillium Operator** to **For Multi-Node Cluster**.

Visit the Cilium documentation site for more information on
[socket load balancers](https://docs.cilium.io/en/latest/network/Kubernetes/kubeproxy-free/#socketlb-host-netns-only)
and
[CNI configuration adjustments](https://docs.cilium.io/en/latest/network/kubernetes/configuration/#adjusting-cni-configuration).

Select **Next layer**.

Search for and select **Rook-Ceph (Helm) v1.16.3** from the Palette Registry (OCI).

Select **Values**.

From the **Presets** drop down menu, set the value for **Cluster Configuration** to **Single Node Cluster**.

:::info

The preset for 'Single Node Cluster' in the rook-ceph pack implies that a single is worker node is used, not that the
Kubernetes Control Plane and workloads use a single node.

:::

Search the text editor for `replica` and change all values for **replicas** and **size** to `1`.


```yaml title="Example code block"
    cephBlockPools:
  - name: ceph-blockpool
    # see https://github.com/rook/rook/blob/master/Documentation/CRDs/Block-Storage/ceph-block-pool-crd.md#spec for available configuration
    spec:
      failureDomain: host
      replicated:
        size: 1
```

Select **Confirm**.

The infrastructure layers of your Cluster Profile are now complete. You need to add some additional layers to deploy VMO
and supporting services.

Select **Add New Pack**.

Search for metallb and select the **MetalLB (Helm) 0.14.9** pack from the Palette Registry (OCI).

Select **Values**. The MetalLB YAML manifest editor appears.

MetalLB needs a range of routable IP Addresses. Locate the configuration block containing the **addresses:** value. The
value for this field can be either an IP Address range or a subnet using CIDR
notation. For example, `192.168.40.10` and  `192.168.1.0/24` are both valid values.

Ensure these IP addresses are reserved from the subnet connected to your MAAS servers.

![Image of the configuration lines where Pod and Services Subnets are set.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_metallb-ips.webp)

Select **Confirm & Create**.

Then, select **Add New Pack**.

Search for and select the **Virtual Machine Orchestrator** pack from the Palette Registry (OCI).

Set the **Pack Version** to **4.6.3** and select **Confirm Changes**.

VMO has two different connectivity options, **Proxied** and **Direct**.

| **Connectivity Mode** | **Description**                                                                                                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Proxied               | Communications between your Palette tenant and the VMO dashboard utilize Spectro Proxy services in your cluster. This method is commonly used in environments with high security requirements. If the Spectro Proxy pack is not installed in your cluster, the VMO pack installs it for you. |
| Direct                | This mode is intended for use in an environment with no access restrictions. Communications to the cluster are open and reachable from your corporate networks. This mode will configure the MetallB load balancer to allow ingress to VMO services.                                         |

For more information on the Spectro proxy, visit the
[Official Spectro Proxy documentation page](/integrations/spectro-proxy.mdx)

Select the **Properties** icon. Select **Proxied**.

The VMO pack contains prerequisite CRDs for subsequent packs. The **Install Order** field allows you to control the
installation order of your packs by using numerical values. The install order value defaults to `0` which implies top
priority. The higher the value is, the lower the install priority is.

Set the **Install Order** value to `10`, ensuring VMO is installed last.

Select the **Values** icon. Remove all configurations in the YAML manifest editor and paste in the configuration below.

```yaml
pack:
  content:
    images:
      - image: us-docker.pkg.dev/palette-images/palette/spectro-vm-dashboard:4.6.3
      - image: us-docker.pkg.dev/palette-images/third-party/kubevirt-ui:v19
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-operator:v1.4.0
      - image: registry.k8s.io/sig-storage/snapshot-validation-webhook:v8.1.0
      - image: registry.k8s.io/sig-storage/snapshot-controller:v8.1.0
      - image: registry.k8s.io/descheduler/descheduler:v0.32.0
      - image: ghcr.io/k8snetworkplumbingwg/multus-cni:v4.1.4-thick
      - image: ghcr.io/k8snetworkplumbingwg/multus-dynamic-networks-controller:latest-amd64
      - image: quay.io/kubevirt/cdi-operator:v1.61.0
      - image: quay.io/kubevirt/cdi-uploadproxy:v1.61.0
      - image: quay.io/kubevirt/cdi-controller:v1.61.0
      - image: quay.io/kubevirt/cdi-apiserver:v1.61.0
      - image: quay.io/kubevirt/cdi-importer:v1.61.0
      - image: quay.io/kubevirt/cdi-uploadserver:v1.61.0
      - image: quay.io/kubevirt/cdi-cloner:v1.61.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-handler:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-launcher:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-exportproxy:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-exportserver:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-controller:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-api:v1.4.0
      - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/os/ubuntu-container-disk:22.04
      - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/os/fedora-container-disk:37
      - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/vlan-filtering/ubuntu:latest
      - image: us-docker.pkg.dev/palette-images/palette/spectro-cleanup:1.0.3
      - image: us-docker.pkg.dev/palette-images/palette/spectro-kubectl:v1.31.5-vmo
  namespace: vm-dashboard
  palette:
    config:
      dashboard:
        access: private
  spectrocloud.com/install-priority: "10"
charts:
  virtual-machine-orchestrator:
    image:
      repository: us-docker.pkg.dev/palette-images/palette/spectro-vm-dashboard
      tag: "4.6.3"
    service:
      type: "ClusterIP"
    appConfig:
      clusterInfo:
        consoleBaseAddress: ""
    fullnameOverride: "virtual-machine-orchestrator"
    serviceAccount:
      # Specifies whether a service account should be created
      create: true
      # Annotations to add to the service account
      annotations: {}
      # The name of the service account to use.
      # If not set and create is true, a name is generated using the fullname template
      name: "virtual-machine-orchestrator"
    sampleTemplates:
      fedora37: false
      ubuntu2204: false
      ubuntu2204WithVol: false
      ubuntu2204staticIP: false
      fedora37staticIP: false
      # To create additional vm templates refer to https://docs.spectrocloud.com/vm-management/create-manage-vm/create-vm-template
    # This namespace used to store golden images.

    goldenImagesNamespace: "vmo-golden-images"
    # These namespaces are created and set up to deploy VMs into
    vmEnabledNamespaces:
      - "default"
      - "virtual-machines"
      - ns-adv
      - ns-edge
      - ns-product
      - ns-packs
    grafana:
      namespace: monitoring
    vlanFiltering:
      enabled: true
      namespace: kube-system
      image:
        repository: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/vlan-filtering/ubuntu
        pullPolicy: IfNotPresent
        tag: "latest"
      env:
        # Which bridge interface to control
        bridgeIF: "br0"
        # Beginning of VLAN range to enable
        allowedVlans: "1"
        # Set to "true" to enable VLANs on the br0 interface for the host to use itself
        allowVlansOnSelf: "true"
        # Beginning of VLAN range to enable for use by the node itself
        allowedVlansOnSelf: "1"
    snapshot-controller:
      enabled: true
      replicas: 1
      # controller image and policies
      image:
        repository: registry.k8s.io/sig-storage/snapshot-controller
        pullPolicy: IfNotPresent
        tag: "v8.1.0"
      # A list/array of extra args to use
      # when running the controller. Default args include log verbose level
      # and leader election
      extraArgs: []
      # snapshot webhook config
      webhook:
        # all below values take effect only if webhook is enabled
        enabled: true
        # webhook controller image and policies
        image:
          # change the image if you wish to use your own custom validation server image
          repository: registry.k8s.io/sig-storage/snapshot-validation-webhook
          pullPolicy: IfNotPresent
          # Overrides the image tag whose default is the chart appVersion.
          tag: "v8.1.0"
        validatingWebhook:
          failurePolicy: Fail
          timeoutSeconds: 2
        # Validating webhook is exposed on an HTTPS endpoint, and so
        # TLS certificate is required. This Helm chart relies on
        # cert-manager.io for managing TLS certificates.
        tls:
          # If not empty, this issuer is used to sign the certificate.
          # If none is provided, a new, self-signing issuer is created.
          issuerRef: {}
          # name: <ISSUER NAME>
          # kind: <ClusterIssuer|Issuer>
          # group: cert-manager.io

          # Certificate duration. The generated certificate is automatically
          # renewed 1/3 of `certDuration` before its expiry.
          # Value must be in units accepted by Go time.ParseDuration.
          # See https://golang.org/pkg/time/#ParseDuration for allowed formats.
          # Minimum accepted duration is `1h`.
          # This option may be ignored/overridden by some issuer types.
          certDuration: 8760h
        service:
          type: ClusterIP
          port: 443
        serviceAccount:
          # Specifies whether a service account should be created.
          create: true
          # Annotations to add to the service account.
          annotations: {}
          # The name of the service account to use.
          # If not set and create is true, a name is generated using the fullname template.
          name: ""
        # Log verbosity level.
        # See https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md
        # for description of individual verbosity levels.
        logVerbosityLevel: 2
        podAnnotations: {}
        resources: {}
        nodeSelector: {}
        tolerations: []
        affinity: {}
        nameOverride: ""
        fullnameOverride: ""
      imagePullSecrets: []
      nameOverride: ""
      fullnameOverride: ""
      resources: {}
      # We usually recommend not to specify default resources and to leave this as a conscious
      # choice for the user. This also increases chances charts run on environments with little
      # resources, such as Minikube. If you do want to specify resources, uncomment the following
      # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
      # limits:
      #   cpu: 100m
      #   memory: 128Mi
      # requests:
      #   cpu: 100m
      #   memory: 128Mi

      nodeSelector: {}
      tolerations: []
      affinity: {}
      # create a default volume snapshot class
      volumeSnapshotClass:
        create: true
        name: "ceph-block-snapshot-class"
        driver: "rook-ceph.rbd.csi.ceph.com"
        # deletionPolicy determines whether a VolumeSnapshotContent created through
        # the VolumeSnapshotClass should be deleted when its bound VolumeSnapshot is deleted.
        # Supported values are "Retain" and "Delete".
        deletionPolicy: "Delete"
        # params is a key-value map with storage driver specific parameters for creating snapshots.
        params:
          clusterID: rook-ceph
          csi.storage.k8s.io/snapshotter-secret-name: csi-rbd-secret
          csi.storage.k8s.io/snapshotter-secret-namespace: rook-ceph
        # key-value pair of extra labels to apply to the volumesnapshotclass
        extraLabels:
          velero.io/csi-volumesnapshot-class: "true"
      # time for sleep hook in seconds
      hooksleepTime: 12
    kubevirt:
      enabled: true
      # defaults to kubevirt
      namespace: kubevirt
      namespaceLabels:
        pod-security.kubernetes.io/enforce: privileged
        pod-security.kubernetes.io/enforce-version: v{{ .spectro.system.kubernetes.version | substr 0 4 }}
      replicas: 1
      service:
        type: LoadBalancer
        port: 443
        targetPort: 8443
      image:
        repository: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-operator
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v1.4.0"
      ## The Kubevirt CR that gets created
      kubevirtResource:
        name: kubevirt
        useEmulation: false
        # below gates are required for virtual machine orchestrator pack, users can append additional gates
        additionalFeatureGates:
          - LiveMigration
          - HotplugVolumes
          - Snapshot
          - VMExport
          - ExpandDisks
          - HotplugNICs
          - VMLiveUpdateFeatures
          - VMPersistentState
          - VolumesUpdateStrategy
          - VolumeMigration
          - CPUManager
          - Sidecar
        #- VMPersistentState
        # for additional feature gates refer to https://docs.spectrocloud.com/vm-management#featuregates
        config:
          evictionStrategy: "LiveMigrate"
          # additionalConfig lets you define any configuration other than developerConfiguration and evictionStrategy
          additionalConfig:
            vmStateStorageClass: "ceph-filesystem"
            #vmStateStorageClass: "" #fileSystem-based storageclass for persistent TPM
            migrations:
              allowAutoConverge: true
              completionTimeoutPerGiB: 800
          # additionalDevConfig lets you define dev config other than emulation and feature gate
          additionalDevConfig: {}
          # vmRolloutStrategy lets you define how changes to a VM object propagate to its VMI objects
          vmRolloutStrategy: LiveUpdate
        certificateRotateStrategy: {}
        customizeComponents:
        # flags:
        #   api:
        #     v:
        #       "5"
        #     port:
        #       "8443"
        imagePullPolicy: IfNotPresent
        infra: {}
        # The name of the Prometheus service account that needs read-access to KubeVirt endpoints
        monitorAccount: "prometheus-operator-prometheus"
        # The namespace Prometheus is deployed in
        monitorNamespace: "monitoring"
        # The namespace the service monitor is deployed to. Either specify this or the monitorNamespace
        serviceMonitorNamespace: "monitoring"
        workloads: {}
        workloadsUpdateStrategy:
          workloadUpdateMethods:
            - LiveMigrate
        # uninstallStrategy to use, options are RemoveWorkloads, BlockUninstallIfWorkloadsExist
        uninstallStrategy: ""
      ingress:
        enabled: false
        ingressClassName: nginx
        annotations:
          cert-manager.io/issuer: kubevirt-selfsigned-issuer
          nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        labels: {}
        hosts:
          - host: virt-exportproxy.maas.sc
            paths:
              - path: /
                pathType: ImplementationSpecific
                # tls:
                #   - secretName: chart-example-tls
                #     hosts:
                #       - virt-exportproxy.maas.sc
    cdi:
      enabled: true
      namespaceLabels:
        pod-security.kubernetes.io/enforce: privileged
        pod-security.kubernetes.io/enforce-version: v{{ .spectro.system.kubernetes.version | substr 0 4 }}
      replicas: 1
      image:
        repository: quay.io/kubevirt/cdi-operator
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v1.61.0"
      # set enabled to true and add private registry details to bring up VMs in airgap environment
      privateRegistry:
        enabled: false
        registryIP: #Ex: 10.10.225.20
        registryBasePath:
        #Ex: specto-images
      serviceAccount:
        # Specifies whether a service account should be created
        create: true
        # Annotations to add to the service account
        annotations: {}
        # The name of the service account to use.
        # If not set and create is true, a name is generated using the fullname template
        name: ""
      service:
        type: LoadBalancer
        port: 443
        targetPort: 8443
      ingress:
        enabled: false
        className: "nginx"
        annotations:
          cert-manager.io/issuer: cdi-selfsigned-issuer
          nginx.ingress.kubernetes.io/proxy-body-size: "0"
          nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
          nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
          nginx.ingress.kubernetes.io/proxy-request-buffering: "off"
          nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        hosts:
          - host: cdi-uploadproxy.maas.sc
            paths:
              - path: /
                pathType: ImplementationSpecific
        tls: []
        #  - secretName: chart-example-tls
        #    hosts:
        #      - cdi-uploadproxy.maas.sc
      resources: {}
      # We usually recommend not to specify default resources and to leave this as a conscious
      # choice for the user. This also increases chances charts run on environments with little
      # resources, such as Minikube. If you do want to specify resources, uncomment the following
      # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
      # limits:
      #   cpu: 100m
      #   memory: 128Mi
      # requests:
      #   cpu: 100m
      #   memory: 128Mi

      ## The CDI CR that gets created
      cdiResource:
        additionalFeatureGates: # - FeatureName
        additionalConfig:
          filesystemOverhead:
            global: "0.08"
            storageClass:
              spectro-storage-class: "0.08"
          podResourceRequirements:
            requests:
              cpu: 250m
              memory: 1G
            limits:
              cpu: 1
              memory: 8G
          insecureRegistries: [] # List of insecure registries to allow in the CDI importer, preffered in air-gapped environments
          importProxy:
          #HTTPProxy: "http://username:password@your-proxy-server:3128"
          #HTTPSProxy: "http://username:password@your-proxy-server:3128"
          #noProxy: "127.0.0.1,localhost,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.company.local"
          #TrustedCAProxy: configmap-name # optional: the ConfigMap name of an user-provided trusted certificate authority (CA) bundle to be added to the importer pod CA bundle
        additionalSpec:
          infra:
            nodeSelector:
              kubernetes.io/os: linux
            tolerations:
              - key: CriticalAddonsOnly
                operator: Exists
          workload:
            nodeSelector:
              kubernetes.io/os: linux
          imagePullPolicy: IfNotPresent
    multus:
      enabled: true
      image:
        repository: ghcr.io/k8snetworkplumbingwg/multus-cni
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v4.1.4-thick"
      networkController:
        criSocket:
          enableK3SHostPath: false # true for K3S and RKE2, false for PXK-E
          paletteAgentMode: false # true for running Palette Agent Mode clusters with PXK-E
          # criSocketHostPathOverride: /run/containerd/containerd.sock
      imagePullSecrets: []
      podAnnotations: {}
      resources:
        # We usually recommend not to specify default resources and to leave this as a conscious
        # choice for the user. This also increases chances charts run on environments with little
        # resources, such as Minikube. If you do want to specify resources, uncomment the following
        # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
        limits:
          cpu: 100m
          memory: 1Gi
        requests:
          cpu: 100m
          memory: 50Mi
      nodeSelector: {}
      affinity: {}
      dpdkCompatibility: false
      cleanup:
        image: us-docker.pkg.dev/palette-images/palette/spectro-cleanup
        tag: "1.0.3"
      networkAttachDef:
        create: false
        # a json string to apply
        config: ""
        # a sample config
        # '{
        #   "cniVersion": "0.3.0",
        #   "type": "macvlan",
        #   "master": "ens5",
        #   "mode": "bridge",
        #   "ipam": {
        #     "type": "host-local",
        #     "subnet": "192.168.1.0/24",
        #     "rangeStart": "192.168.1.200",
        #     "rangeEnd": "192.168.1.216",
        #     "routes": [
        #       { "dst": "0.0.0.0/0" }
        #     ],
        #     "gateway": "192.168.1.1"
        #   }
        # }'
    descheduler:
      enabled: true
      namespace: "kube-system"
      # CronJob or Deployment
      kind: CronJob
      image:
        repository: registry.k8s.io/descheduler/descheduler
        # Overrides the image tag whose default is the chart version
        tag: "v0.32.0"
        pullPolicy: IfNotPresent
      imagePullSecrets: #   - name: container-registry-secret
      resources:
        requests:
          cpu: 500m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 256Mi
      ports:
        - containerPort: 10258
          protocol: TCP
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL
        privileged: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
        runAsUser: 1000
      # podSecurityContext -- [Security context for pod](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
      podSecurityContext: {} # fsGroup: 1000
      nameOverride: ""
      fullnameOverride: "descheduler"
      # -- Override the deployment namespace; defaults to .Release.Namespace
      namespaceOverride: ""
      # labels that'll be applied to all resources
      commonLabels: {}
      cronJobApiVersion: "batch/v1"
      schedule: "*/15 * * * *"
      suspend: false
      # startingDeadlineSeconds: 200
      # successfulJobsHistoryLimit: 3
      # failedJobsHistoryLimit: 1
      # ttlSecondsAfterFinished 600
      # timeZone: Etc/UTC

      # Required when running as a Deployment
      deschedulingInterval: 15m
      # Specifies the replica count for Deployment
      # Set leaderElection if you want to use more than 1 replica
      # Set affinity.podAntiAffinity rule if you want to schedule onto a node
      # only if that node is in the same zone as at least one already-running descheduler
      replicas: 1
      # Specifies whether Leader Election resources should be created
      # Required when running as a Deployment
      # NOTE: Leader election can't be activated if DryRun enabled
      leaderElection: {}
      #  enabled: true
      #  leaseDuration: 15s
      #  renewDeadline: 10s
      #  retryPeriod: 2s
      #  resourceLock: "leases"
      #  resourceName: "descheduler"
      #  resourceNamespace: "kube-system"

      command:
        - "/bin/descheduler"
      cmdOptions:
        v: 3
      # Recommended to use the latest Policy API version supported by the Descheduler app version
      deschedulerPolicyAPIVersion: "descheduler/v1alpha2"
      # deschedulerPolicy contains the policies the descheduler executes.
      # To use policies stored in an existing configMap use:
      # NOTE: The name of the cm should comply to {{ template "descheduler.fullname" . }}
      # deschedulerPolicy: {}
      deschedulerPolicy:
        nodeSelector: kubevirt.io/schedulable=true
        maxNoOfPodsToEvictPerNode: 10
        # maxNoOfPodsToEvictPerNamespace: 10
        metricsCollector:
          enabled: true
        # ignorePvcPods: true
        # evictLocalStoragePods: true
        # evictDaemonSetPods: true
        # tracing:
        #   collectorEndpoint: otel-collector.observability.svc.cluster.local:4317
        #   transportCert: ""
        #   serviceName: ""
        #   serviceNamespace: ""
        #   sampleRate: 1.0
        #   fallbackToNoOpProviderOnError: true
        profiles:
          - name: default
            pluginConfig:
              - name: DefaultEvictor
                args:
                  ignorePvcPods: true
                  evictLocalStoragePods: true
                  nodeFit: true
                  ignorePodsWithoutPDB: true
              - name: RemoveDuplicates
              - name: RemovePodsHavingTooManyRestarts
                args:
                  podRestartThreshold: 100
                  includingInitContainers: true
              - name: RemovePodsViolatingNodeAffinity
                args:
                  nodeAffinityType:
                    - requiredDuringSchedulingIgnoredDuringExecution
              - name: RemovePodsViolatingNodeTaints
                args:
                  excludedTaints:
                    - node.kubernetes.io/unschedulable
              - name: RemovePodsViolatingInterPodAntiAffinity
              - name: RemovePodsViolatingTopologySpreadConstraint
              - name: LowNodeUtilization
                args:
                  thresholds:
                    cpu: 20
                    memory: 25
                    pods: 100
                  targetThresholds:
                    cpu: 60
                    memory: 75
                    pods: 100
                  metricsUtilization:
                    metricsServer: true
                  evictableNamespaces:
                    exclude:
                      - "cert-manager"
                      - "kube-system"
                      - "palette-system"
                      - "metallb-system"
                      - "cluster-{{ .spectro.system.cluster.uid }}"
                      - "kubevirt"
                      - "monitoring"
                      - "nginx"
                      - "vm-dashboard"
            plugins:
              balance:
                enabled:
                  - RemoveDuplicates
                  - RemovePodsViolatingTopologySpreadConstraint
                  - LowNodeUtilization
              deschedule:
                enabled:
                  - RemovePodsHavingTooManyRestarts
                  - RemovePodsViolatingNodeTaints
                  - RemovePodsViolatingNodeAffinity
                  - RemovePodsViolatingInterPodAntiAffinity
      priorityClassName: system-cluster-critical
      nodeSelector: {}
      #  foo: bar

      affinity: {}
      # nodeAffinity:
      #   requiredDuringSchedulingIgnoredDuringExecution:
      #     nodeSelectorTerms:
      #     - matchExpressions:
      #       - key: kubernetes.io/e2e-az-name
      #         operator: In
      #         values:
      #         - e2e-az1
      #         - e2e-az2
      #  podAntiAffinity:
      #    requiredDuringSchedulingIgnoredDuringExecution:
      #      - labelSelector:
      #          matchExpressions:
      #            - key: app.kubernetes.io/name
      #              operator: In
      #              values:
      #                - descheduler
      #        topologyKey: "kubernetes.io/hostname"
      topologySpreadConstraints: []
      # - maxSkew: 1
      #   topologyKey: kubernetes.io/hostname
      #   whenUnsatisfiable: DoNotSchedule
      #   labelSelector:
      #     matchLabels:
      #       app.kubernetes.io/name: descheduler
      tolerations: []
      # - key: 'management'
      #   operator: 'Equal'
      #   value: 'tool'
      #   effect: 'NoSchedule'

      rbac:
        # Specifies whether RBAC resources should be created
        create: true
      serviceAccount:
        # Specifies whether a ServiceAccount should be created
        create: true
        # The name of the ServiceAccount to use.
        # If not set and create is true, a name is generated using the fullname template
        name: # Specifies custom annotations for the serviceAccount
        annotations: {}
      podAnnotations: {}
      podLabels:
        spectrocloud.com/connection: proxy
      dnsConfig: {}
      livenessProbe:
        failureThreshold: 3
        httpGet:
          path: /healthz
          port: 10258
          scheme: HTTPS
        initialDelaySeconds: 3
        periodSeconds: 10
      service:
        enabled: false
        # @param service.ipFamilyPolicy [string], support SingleStack, PreferDualStack and RequireDualStack
        #
        ipFamilyPolicy: ""
        # @param service.ipFamilies [array] List of IP families (e.g. IPv4, IPv6) assigned to the service.
        # Ref: https://kubernetes.io/docs/concepts/services-networking/dual-stack/
        # E.g.
        # ipFamilies:
        #   - IPv6
        #   - IPv4
        ipFamilies: []
      serviceMonitor:
        enabled: false
        # The namespace where Prometheus expects to find service monitors.
        # namespace: ""
        # Add custom labels to the ServiceMonitor resource
        additionalLabels: {} # prometheus: kube-prometheus-stack
        interval: ""
        # honorLabels: true
        insecureSkipVerify: true
        serverName: null
        metricRelabelings: []
        # - action: keep
        #   regex: 'descheduler_(build_info|pods_evicted)'
        #   sourceLabels: [__name__]
        relabelings: []
        # - sourceLabels: [__meta_kubernetes_pod_node_name]
        #   separator: ;
        #   regex: ^(.*)$
        #   targetLabel: nodename
        #   replacement: $1
        #   action: replace
```

<PartialsComponent category="vmo" name="custom-network-requirements" />

Select **Confirm & Create**.

Next, you will configure the VM deployment templates, data volumes containing OS Images, and storage
profiles available in VMO. These configurations can be customized, allowing you control of the OS images, image
repositories, storage, and VM configurations.

Select **Add Manifest**.

Name the new layer **vmo-extras**. Set the value of the **Install Order** field to 20 to ensure these configurations
apply after the VMO pack is installed. Select **New manifest** and name the manifest **vmo-extras-manifest**. Select the
**blue check mark**.

Copy the YAML config below and paste it in the manifest editor.

:::info

The configurations below include setting up the default Ubuntu Administrator account. This example uses Clear text
passwords for testing purposes only. We recommend that any deployments use methods to encrypt the password or pull it
from a system for managing secure data such as HashiCorp Vault, or CyberArk.

:::

```yaml
apiVersion: spectrocloud.com/v1
kind: VmTemplate
metadata:
  name: ubuntu-2204
spec:
  description: Ubuntu 22.04
  displayName: Ubuntu 22.04
  icon: https://s3.amazonaws.com/manifests.spectrocloud.com/logos/ubuntu.png
  dataVolumeTemplates:
    - metadata:
        name: ubuntu-2204
      spec:
        source:
          pvc:
            name: template-ubuntu-2204
            namespace: vmo-golden-images
        pvc:
          accessModes:
            - ReadWriteMany
          resources:
            requests:
              storage: 50Gi
          volumeMode: Block
          storageClassName: ceph-block
  template:
    metadata:
      annotations:
        descheduler.alpha.kubernetes.io/evict: "true"
      labels:
        kubevirt.io/size: small
        kubevirt.io/domain: hellouni
    spec:
      domain:
        cpu:
          cores: 2
          sockets: 1
          threads: 1
        devices:
          disks:
            - disk:
                bus: virtio
              name: datavolume-os
            - disk:
                bus: virtio
              name: cloudinitdisk
          interfaces:
            - masquerade: {}
              name: default
              model: virtio
              #macAddress: '00:5e:ab:cd:ef:01'
        machine:
          type: q35
        resources:
          limits:
            memory: 2Gi
          requests:
            memory: 2Gi
      networks:
        - name: default
          pod: {}
      volumes:
        - dataVolume:
            name: ubuntu-2204
          name: datavolume-os
        - cloudInitNoCloud:
            userData: |
              #cloud-config
              ssh_pwauth: True
              chpasswd: { expire: False }
              password: spectro
              disable_root: false
              runcmd:
                - apt-get update
                - apt-get install -y qemu-guest-agent
                - systemctl start qemu-guest-agent
                - | 
                  apt-get -y install ca-certificates curl
                  install -m 0755 -d /etc/apt/keyrings
                  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
                  chmod a+r /etc/apt/keyrings/docker.asc
                  echo \
                    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
                    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                    tee /etc/apt/sources.list.d/docker.list > /dev/null
                  apt-get update
                  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
                  groupadd docker
                  gpasswd -a ubuntu docker
          name: cloudinitdisk
---
apiVersion: cdi.kubevirt.io/v1beta1
kind: DataVolume
metadata:
  name: "template-ubuntu-2204"
  namespace: "vmo-golden-images"
  annotations:
    cdi.kubevirt.io/storage.deleteAfterCompletion: "false"
    cdi.kubevirt.io/storage.bind.immediate.requested: ""
spec:
  storage:
    accessModes:
      - ReadWriteMany
    resources:
      requests:
        storage: 50Gi
    volumeMode: Block
    storageClassName: ceph-block
  source:
    registry:
      url: "docker://gcr.io/spectro-images-public/release/vm-dashboard/os/ubuntu-container-disk:22.04"
---
apiVersion: cdi.kubevirt.io/v1beta1
kind: StorageProfile
metadata:
  name: ceph-filesystem
spec:
  claimPropertySets:
    - accessModes:
        - ReadWriteMany
      volumeMode: Filesystem
  cloneStrategy: csi-clone
---
apiVersion: cdi.kubevirt.io/v1beta1
kind: StorageProfile
metadata:
  name: ceph-block
spec:
  claimPropertySets:
    - accessModes:
        - ReadWriteMany
      volumeMode: Block
  cloneStrategy: csi-clone
```

21. Select **Confirm and Create**

22. Select **Next**

23. Select **Finish Configuration**

</TabItem>

<TabItem label="Terraform" value="Terraform Workflow">

#### Update terraform.tfvars

This file allows you to set values to use for your variables in one place. We recommend creating and setting variables
terraform.tfvars file whenever possible as it helps reduce human error and makes updating and reusing your Terraform
scripts more efficient.

The provided terraform.tfvars file is broken into sections to relate the variables to the files that use them.

Update **terraform.tfvars** as instructed in the table below.

**Palette Settings**

| **Variable**    | **Data Type** | **Instruction**                                     |
| --------------- | ------------- | --------------------------------------------------- |
| palette-project | `string`      | Set this value to the name of your Palette project. |

**MAAS Deployment Settings**

| **Variable**                     | **Data Type**   | **Instruction**                                                                                                                                                                                                                           |
| -------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| deploy-maas                      | `boolean`       | This is a true or false value. If true, a VMO cluster is deployed to MAAS. Set this value to `true` for this section of the tutorial.                                                                                                     |
| deploy-maas-vm                   | `boolean`       | This is a true of false value. If true, an Ubuntu 22.04 VM with Docker pre-installed is deployed in your VMO cluster. Set this to `false` for this section of the tutorial.                                                               |
| pcg-name                         | `string`        | Set this value to the name of your MAAS PCG. This can be pre-existing or one you created in the [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) tutorial.                                                            |
| maas-domain                      | `string`        | Set this value to the domain your MAAS environment is in. example `spectronaut.com`.                                                                                                                                                      |
| maas-control-plane-nodes         | `number`        | Set this value to the number of control plane nodes you want to create.                                                                                                                                                                   |
| maas-control-plane-resource-pool | `string`        | Set this value to match the MAAS resource pool you want your control plane nodes deployed to.                                                                                                                                             |
| maas-control-plane-azs           | `set of string` | This is an optional value that allows you to specify which MAAS availability zones to use for your control plane node deployments. This configuration is critical to consider when planning high availability infrastructure deployments. |
| maas-control-plane-node-tags     | `set of string` | Enter any tags used to target specific machines in MAAS.                                                                                                                                                                                  |
| ctl-node-min-cpu                 | `number`        | Set this value to the minimum number of CPU cores you want assigned to your control plan nodes.                                                                                                                                           |
| ctl-node-min-mem-mb              | `number`        | Set this value to the minimum amount of RAM (Memory) you want assigned to your control plan nodes.                                                                                                                                        |
| maas-worker-nodes                | `number`        | Set this value to the number of worker nodes you want to create.                                                                                                                                                                          |
| maas-worker-resource-pool        | `string`        | Set this value to match the MAAS resource pool you want your worker nodes deployed to.                                                                                                                                                    |
| maas-worker-azs                  | `set of string` | This is an optional value that allows you to specify which MAAS availability zones to use for your worker node deployments. This configuration is critical to consider when planning high availability infrastructure deployments.        |
| maas-worker-node-tags            | `set of string` | Enter any tags used to target specific machines in MAAS.                                                                                                                                                                                  |
| wrk-node-min-cpu                 | `number`        | Set this value to the minimum number of CPU cores you want assigned to your worker nodes.                                                                                                                                                 |
| wrk-node-min-mem-mb              | `number`        | Set this value to the minimum amount of RAM (Memory) you want assigned to your worker nodes.                                                                                                                                              |

**cluster_profiles.tf**

| **Variable**            | **Data Type** | **Instruction**                                                                                                                                      |
| ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| vmo-cluster-name        | `string`      | Enter the name you want your VMO cluster to have.                                                                                                    |
| cluster-profile-type    | `string`      | Values must be `Infrastructure`,`Add-On`, or `Full`. Enter `Full`. Visit the [cluster profiles](profiles/cluster-profiles/cluster-profiles.md) page. |
| cluster-profile-version | `number`      | The version number that is assigned to your Palette Cluster Profile.                                                                                 |

**vmo_values.tf**

| **Variable**          | **Data Type**   | **Instruction**                                                 |
| --------------------- | --------------- | --------------------------------------------------------------- |
| vmo-network-interface | `set of string` | Enter the id of the network interface VMO will use.             |
| vm-vlans              | `number`        | Enter the VLAN IDs your VMs will be able to communicate on.     |
| host-vlans            | `number`        | Enter the VLAN IDs you VMO nodes will be able to communicate on |

<PartialsComponent category="vmo" name="custom-network-requirements" />

**manifests/k8s-values.yaml**

| **Variable**          | **Data Type**    | **Instruction**                                                                                                 |
| --------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| pod-CIDR              | `set of string`  | Enter the subnet you want your pod network to use. Format must be standard CIDR notation `192.168.0.0/24`.      |
| cluster-services-CIDR | ` set of string` | Enter the subnet you want your cluster services to use. Format must be standard CIDR notation `192.168.0.0/24`. |

**manifests/metallb-values.yaml**

| **Variable**    | **Data Type**   | **Instruction**                                                                                                                                    |
| --------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| metallb-ip-pool | `set of string` | Enter the IP address range you want MetalLB to use. These IPs should be routable and align to VLAN subnets in your network and VMO congfiguration. |

#### Update ubuntu-values.yaml

| **Variable** | **Data Type** | **Instruction**                       |
| ------------ | ------------- | ------------------------------------- |
| node-network | `string`      | Enter the subnet your nodes will use. |

</TabItem>

</Tabs>

## Deploy a VMO Cluster

<Tabs groupId="Workflows">

<TabItem label="UI" value="UI Workflow">

Log in to [Palette](https://console.spectrocloud.com).

From the left main menu, select **Clusters** > **Add New Cluster**.

The **Cluster Type** screen displays all available options fo automated deployment of Kubernetes clusters. In the **Data
Center** section, select **MAAS**. In the bottom-right corner, select **Start MAAS Configuration**.

The **Cluster Information** screen allows you to provide details about your cluster such as the name it will have. Enter
the values for **Cluster name**, **Description**, and **Tags**. Select the PCG deployed in your MAAS environment from
the **Cloud Account** drop down menu. Select **Next**.

Select **Add Cluster Profile**.

In the **Choose a Profile** slide out menu, locate and select the cluster profile you created in the _Create a VMO
Cluster Profile_ section. Select **Confirm**.

The **Cluster Profile** screen provides the details of all the packs in the cluster profile you selected. This screen
enables use of the same profile for multiple cluster by allowing you to change pack values, modify presets, or set
variable values for your packs. Select **Next**.

Select your target MAAS domain from the **Domain drop-down menu**. Select **Next**.

The **Node pools configuration** screen allows customization of the control plane node pool, worker node pool, and
control of which MAAS machines will be used to build your cluster.


The control plane pool configuration section allows configuration of the Kubernetes values that will apply to your
control plane nodes. No changes are required in this section.


The **Control Plane - Cloud Configuration** section allows you to control which MAAS machines your cluster can use. The
table below reviews each value and provides guidance on how to set them.

| **Variable**        | **Instruction**                                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Enter the name of the MAAS resource pool you want your control plane server to used from.                                                                                                                                                                                                                 |
| Minimum CPU         | Enter the minimum number of CPU cores you want your Control Plane server to have. We recommend values higher than 4.                                                                                                                                                                                         |
| Minimum Memory (GB) | Enter the maximum amount of memory you want your Control Plane server to have. Do not set values lower than 8 GB.                                                                                                                                                                                         |
| Availability zones  | This is an optional value that allows you to specify which MAAS Availability Zones to use for your control plane node deployments. This configuration is critical to consider when planning high availability infrastructure deployments.                                                                 |
| Tags                | This is an optional value that allows you to assign a tag to the MAAS machine selected for the build. <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |


The worker pool configuration section requires no changes. We recommend reviewing these values to understand how they
impact the deployment and how you might use them in a production deployment.


The **Worker Pool - Cloud Configuration** section allows you to control which MAAS machines your cluster can use. The
table below reviews each value and provides guidance on how to set them.

| **Variable**        | **Instruction**                                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Set this value to the name of the MAAS resource pool you want your control plane server to be taken from.                                                                                                                                                                                                 |
| Minimum CPU         | Set this to the minimum number of CPU cores you want your Control Plane server to have. We recommend that you set values higher than 5.                                                                                                                                                                                   |
| Minimum Memory (GB) | Set this to the maximum amount of memory you want your Control Plane server to have. Do not set values lower than 8 GB.                                                                                                                                                                                   |
| Availability zones  | This is an optional value that allows you to specify which AZ's to use for your node deployment. This configuration is critical to consider when planning high availability patterns for your infrastructure.                                                                                             |
| Tags                | This is an optional value that allows you to assign a tag to the MAAS machine selected for the build. <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |

Select **Next**.

The **Optional cluster settings** screen is displayed. VMO requires permissions to be granted to users as well as the
VMO service account.

Select **RBAC**.

Select **Add New Binding** and enter information as instructed in the table below.

| **Field**         | **Instruction**                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Cluster Role Name | For this tutorial, use the `cluster-admin` role.                                                                           |
| Subject Type      | Set this value to `user`.                                                                                                  |
| Subject Name      | The VMO cluster you created is set to use Palette for OIDC. In this field, enter the ID you use when logging into Palette. |

Select **Add Subject** to create another binding. Enter the information as instructed in the table below.

| **Field**         | **Instruction**                      | **Description**                                                                                                                                                       |
| ----------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject Type      | Set this value to `Service Account`  | Identifies the type of resource to map to the Cluster Role                                                                                                            |
| Subject Name      | Enter `virtual-machine-orchestrator` | This value is the name of the service account that is granted permissions to access the VM-dashboard. This service account is created when the VMO pack is installed. |
| Subject Namespace | Enter `vm-dashboard`                 | This is the namespace the service account is granted access to.                                                                                                       |

Select **Confirm**.

Select **Validate**.

![Image of the configured Cluster Role Bindings](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_Configure-RBAC.webp)

:::Warning

If the cluster used for this tutorial is not a test cluster, we strongly recommend adhering to your companies security
standards when configuring RBAC for your cluster. If no clear standards exist, we recommend following the
[Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security model.

:::

Select **Finish Configuration** to begin deployment of your cluster.

</TabItem>

<TabItem label="Terraform" value="Terraform Workflow">

First, you must set the `SPECTROCLOUD_APIKEY` environment variable to your API key by using the command below.

```shell
export SPECTROCLOUD_APIKEY="YOUR KEY HERE"
```

Execute the `terraform plan` command to ensure there are no errors and you have connectivity to your Spectro Cloud
tenant.

```shell
terraform plan
data.spectrocloud_registry.public_registry: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Read complete after 0s [id=680a7a2321e9c36a9a0efa4f]
data.spectrocloud_registry.public_registry: Read complete after 0s [id=5eecc89d0b150045ae661cef]
data.spectrocloud_pack.maas_csi: Reading...
data.spectrocloud_pack.maas_metallb: Reading...
data.spectrocloud_pack.maas_vmo: Reading...
data.spectrocloud_pack.maas_k8s: Reading...
data.spectrocloud_pack.maas_cni: Reading...
data.spectrocloud_pack.maas_ubuntu: Reading...
data.spectrocloud_pack.maas_metallb: Read complete after 0s [id=678d28cce2561ecca5cf0aea]
.
.
.
              + name    = "vmo-extras"
              + uid     = (known after apply)
            }
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
\
```

Execute the `terraform apply` command. This process may take up to an hour or more depending on your environment.

</TabItem>

</Tabs>

## Verify the Cluster Deployment

Navigate to the **Clusters** option in the left main menu in Palette. Select the cluster you created. On the overview
page, ensure the cluster status is healthy. 

## Deploy a Virtual Machine

<Tabs groupId="Workflows">

<TabItem label="UI" value="UI Workflow">

Navigate to [Palette](https://console.spectrocloud.com).

From the left main menu, select **Clusters**.

Select the cluster you deployed in the _Deploy a VMO Cluster with the Palette UI_ section.

Select the **Virtual Machines** tab. If the **Virtual Machines** tab is not displayed, review the RBAC configuration in
the _Create a VMO Cluster_ section and ensure your `user account` and the `virtual-machine-orchestrator` service account
have been configured as instructed.

Select the **virtual-machines** namespace from the **Namespace** drop down menu. This value is used as the target
deployment namespace in your VM manifest. Select **New Virutal Machine**.

Select the **Ubuntu 22.04** template.

The **VM settings** page allows you to customize basic VM configurations. Set the values as instructed in the table
below. Select **Next**.

| **Configuration**                     | **Value**       | **Description**                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                                  | `Choose a name` | The name of the VM to be deployed.                                                                                                                                                                                                                                                                                                                                              |
| CPUs (cores)                          | `2`             | The number of CPU cores your VM needs.                                                                                                                                                                                                                                                                                                                                          |
| Memory (GiB)                          | `2`             | The amount of Memory your VM needs have in GiB                                                                                                                                                                                                                                                                                                                                  |
| Storage Access Mode                   | `ReadWriteMany` | We recommend always using ReadWriteMany. This configuration allows your VM to read the storage volume from any node in your cluster. This is required if you plan to migrate your VM between nodes. <br /> This configuration also helps to avoid node congestion as Kubernetes attempts to schedule your VM on a node that has a Volume with the matching Storage Access Mode. |
| OS image URL                          | `N/A`           | Your image location is defined in the Ubuntu 22.04 template. This field is used to specify custom OS images or custom image repositories for VM.                                                                                                                                                                                                                                |
| Start VM automatically after creation | `Halted`        | We recommend setting this value to halted to ensure no issues occur during the cloud-init process                                                                                                                                                                                                                                                                               |

The **Customize Configuration** screen displays the yaml that will be used to build your VM. KubeVirt enables
configuration deployment, and management of your VMs using the same process used to configure and deploy pods.

The YAML configuration can be deployed using any deployment tools you are currently using for your Kubernetes clusters, giving
you a single platform to manage your pods and VMs. The configuration can also be manually applied using standard
`kubectl apply -f <filename>` YAML commands.

Select **Next**.

Select **Create Virtual Machine**.

</TabItem>

<TabItem label="Terraform" value="Terraform Workflow">

In this section, the Terraform scripts to deploy a new VMO Cluster to your MAAS environment are modified and executed.


Prior to deploying your VM you must modify the `terraform.tfvars` file to reflect the configuration you want your VM to
have. Update terraform.tfvars as instructed in the table below.

**MAAS Deployment Settings**

| **Variable**       | **Data Type** | **Instruction**                                                                                                                                                              |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **deploy-maas-vm** | `boolean`     | This is a true of false value. If true, an Ubuntu 22.04 VM with Docker installed is deployed in your VMO cluster. Set this value to `true` for this section of the tutorial. |

**virtual_machines.tf**

| **Variable**            | **Data Type** | **Instruction**                                                                                                                                                                                                                                    |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vm-deploy-namespace** | `string`      | Set this value to the name of the VLAN you want your VMs to deploy on.<br/><br/>These namespaces are standard Kubernetes namespaces. Your VM is impacted by any configurations applied at the namespace level such as network policies and quotas. |
| **vm-deploy-name**      | `string`      | Set this value to the name you want your VM to have.                                                                                                                                                                                               |
| **vm-labels**           | `string`      | Set this value to a single label you want applied to your VM. For multiple labels, you must modify _virtual_machines.tf_ to include one line for each label.                                                                                       |
| **vm-storage-Gi**       | `string`      | Set this value to the size of disk you want your VM to have. You must include 'Gi' in your value. Example `50Gi`                                                                                                                                   |
| **vm-vpu-cores**        | `number`      | Set this value to the number of CPU cores your VM will have.                                                                                                                                                                                       |
| **vm-cpu-sockets**      | `number`      | Set this value to the number of physical CPU sockets your VM needs. This is intended to enable hardware resilience in the event of a single CPU socket related failure.                                                                            |
| **vm-cpu-threads**      | `number`      | The number of CPU threads your VM is allowed to use. You can assign 1 CPU core and a single thread if desired.                                                                                                                                     |
| **vm-memory-Gi**        | `string`      | Set this value to the amount of RAM (memory) you want your VM to have. You must include 'Gi' in your value. Example `4Gi`                                                                                                                          |


Execute the `terraform plan` command to ensure there are no errors, and you have connectivity to your Spectro Cloud
tenant.

Execute the `terraform apply` command to create the VM in your VMO Cluster.

</TabItem>

</Tabs>

## Deploy the Application

Log in to [Palette](https://console.spectrocloud.com).

From the left main menu, select **Clusters**.

Select the cluster you deployed in the _Deploy a VMO Cluster with the Palette UI_ section.

Select the **Virtual Machines** tab. If the **Virtual Machines** tab is not displayed, review the RBAC configuration in
the _Deploy a VMO Cluster with the Palette UI_ section and ensure your user account and the VMO service account is
configured as instructed.

Select the **Virtual Machines** namespace from the **Namespace** drop down menu. Select the VM you created in the
_Deploy a Virtual Machine_ section.

Select the **Open web console** option.

Login to your VM with the following user name and password.

| **User Name** | **Password** |
| ------------- | ------------ |
| ubuntu        | spectro      |

Execute the `docker version` command to confirm Docker was successfully installed during the cloud init process.

Next, you need to pull and run the `Hello Universe` container.

Execute `docker run -d --restart=always -p 9080:8080 ghcr.io/spectrocloud/hello-universe:1.2.0`.

Docker will pull the specified container image from the repository if a local copy is not present. Once the image is
pulled, docker will start the container.

In Palette, open the **Cluster Overview** page for the cluster you built. Select the download link for your clusters
admin kubeconfig file.

![Image of the admin kubeconfig link](/tutorials/deploy-vmo-maas/tutorials_vmo-mass_admin-kubeconfig.webp)

Open a terminal on your workstation. Update the command below to point to the location of the kubeconfig file you
downloaded. 

```shell

export KUBECONFIG=<path-to-your-kubeconfig-file>

```

Use the command below to confirm the kubeconfig environment variable has been successfully exported.

```shell

user@vmo-tutorial ~ % kubectl version
Client Version: v1.32.3
Kustomize Version: v5.5.0
Server Version: v1.32.2

```

To access your app, you must create a service in Kubernetes. The service configures MetalLB to provide ingress access to
your Kubernetes cluster by mapping a network port on the nodes to the network port your app is listening on in the
cluster.

Once the connection passes through MetalLB, the Kubernetes service acts as a load balancer inside your cluster. Since
pods dynamically scale, the service keeps track of all pods running your app by using a label selector. In this
tutorial, the label `kubevirt.io/domain: hellouni` is used to uniquely identify pods running the hello-universe app.

Execute the command below to create the Kubernetes service for the app.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
  namespace: virtual-machines
spec:
  type: LoadBalancer
  selector:
    kubevirt.io/domain: hellouni
  ports:
  - protocol: TCP
    port: 9080
    targetPort: 9080
EOF
```

## Verify the Application

In Palette, navigate to the left main menu and select **Clusters**. Select the cluster you created.

The **hello-universe-service** is displayed in the **Services** section.

Select the URL link **:9080** for the **hello-universe-service** to access the Hello Universe app.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_hello-uni-service.webp)

Your result should be similar to the below screenshot.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

## Clean Up

<Tabs groupId="Workflows">

<TabItem label="UI" value="UI Workflow">

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left Main Menu and select **Clusters**. Select the cluster you want to delete to
access its overview page.

Select the **Settings** drop down menu. Select **Delete Cluster**.

![Delete cluster](/getting-started/azure/getting-started_deploy-k8s-cluster_delete-cluster-button.webp)

Enter the name of the cluster to confirm the delete action. The deletion process takes several minutes to complete.

<br />

:::tip

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for a forced delete. To trigger a
forced delete, navigate to the cluster’s details page, select **Settings**, then select **Force Delete Cluster**.
Palette automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

If a force delete is required, ensure you use the MAAS console to manually release the resources you used for this
tutorial.

:::

<br />

Navigate to the left main menu and select **Profiles**. Find the cluster profile you created and select the **three-dot
Menu** to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile.

</TabItem>

<TabItem label="Terraform" value="Terraform Workflow">

To clean up the resources you deployed, execute the `terraform destroy` command.

</TabItem>

</Tabs>

## Wrap-up

In this tutorial, you created a new cluster profile and used it to deploy new Kubernetes cluster with Palette Virtual
Machine Orchestrator configured on it. You deployed a VM and used Palette's features to connect to the VM and deploy the
**Hello Universe** and confirmed it was running successfully.

 For more information on VMO, Visit the [VMO architecture](/vm-management/architecture.md) page.
