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

<Tabs groupId="Workflows">

<TabItem label="UI Workflow" value="UI Workflow">

<PartialsComponent category="vmo" name="vmo-tutorial-requirements" />

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform Workflow">

<PartialsComponent category="vmo" name="vmo-tutorial-requirements" />

- The following software installed locally

  - [Git](https://git-scm.com/downloads)

  - [Terraform v1.12.1](https://developer.hashicorp.com/terraform/install)

- Clone the Spectro Cloud Tutorials repo.

```shell
git clone https://github.com/spectrocloud/tutorials.git
```

- Navigate to the vmo-cluster folder

```shell
cd tutorials/terraform/vmo-cluster
```
</TabItem>

</Tabs>

## Create a VMO Cluster Profile

<Tabs groupId="Workflows">

<TabItem label="UI Workflow" value="UI Workflow">

This section will guide you through creating a cluster profile using the Palette UI. 

In Palette, navigate to the left main menu, select **Profiles** > **Add Cluster Profile**.

In the **Basic Information** section, enter the name, version number, and any tags you wish to apply to the profile. Set the type value to **Full**. Select **Next**.

The **Cloud Type** screen appears with all available infrastructure options for the automated deployment of your Kubernetes cluster. Select **MAAS** from the **Infrastructure provider** column. Select **Next**.

The **Profile Layers** section allows you to select the packs that will compose your cluster profile.

Add the **Ubuntu v22.04** to the OS layer.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| Ubuntu | 22.04 | Public Repo | Operating System |



Ubuntu requires customizations to support VMO. Select **Values** and paste the following configuration
into the **Manifest Editor**.

```yaml {9}
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

Update the value for `NETWORKS` to the appropriate "subnet for your environment. The value you enter must be in CIDR
notation and encapsulated in quotes. For example, `"192.168.0.0/16"`. The image below displays the OS layer with the custom manifest and updated `NETWORKS` value.

![image of the OS Layer configuration](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_OS-Layer.webp)

Select **Next layer**. Add the **Palette Extended Kubernetes** pack to your cluster profile.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| Palette eXtended Kubernetes | 1.32.2 | Public Repo | Kubernetes |

If necessary, set the **Pack Version** to `1.32.2` and select **Confirm Changes**. Select  **Values** to display the **OIDC Identity Provider** options.

The Palette eXtended Kubernetes pack defaults to use a custom OIDC provider. This tutorial uses the Palette OIDC
Identity Provider. By using Palette as your OIDC provider, your cluster is configured to send authentication requests to
your Palette tenant's configured OIDC provider.

Select **Palette** as the OIDC Identity Provider.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_configure-OIDC-properties.webp)

Select the **Values** icon to open the **Manifest Editor**.

The Palette eXtended Kubernetes pack is pre-configured with subnets for the clusters internal pods and services.
Review the values for **podCIDR** and **serviceClusterIpRange** and update them if necessary.

![Image of the configuration lines where Pod and Services Subnets are set.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_pod-service-ips.webp)

This template contains security configurations that restrict pod actions. While this is a good practice, it can prevent some services from functioning correctly. One such service is the **Rook-Ceph** Container Storage Interface (CSI), which you will configure later in this tutorial. 

The **Rook-Ceph** deployment must be excluded from default pod security settings by excluding the namespace to which it will be deployed. Search the **Manifest Editor** for `namespaces` and update the value to include `rook-ceph`. The following screenshot displays the **Manifest Editor** with the `namespaces` field highlighted and the value updated.

![Image of the pod security namespace exclusion values](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_podSecurity.webp)

Select **Next layer** to advance to the Container Network Interface (CNI) layer.

Add the **Cilium** pack to your cluster profile.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| Cilium | 1.17.1 | Public Repo | Network |

If necessary, set the **Pack Version** to `1.17.1` and select **Confirm Changes**.

Select **Values**. Cilium requires customizations to support VMO. From the **Presets** drop-down menu, set the value for **VMO
Compatibility** to **Enable**, and the value for **Cillium Operator** to **For Multi-Node Cluster**.

Select **Next layer** to advance to the CSI layer.

Add the **Rook-Ceph (Helm)** pack to your cluster profile.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| Rook-Ceph (Helm) | 1.16.3 | Public Repo | Storage |

If necessary, set the **Pack Version** to `1.16.3` and select **Confirm Changes**.

Select **Values**. From the **Presets** drop-down menu, set the value for **Cluster Configuration** to **Single Node Cluster**. The preset for 'Single Node Cluster' in the rook-ceph pack implies that a single worker node is used, not that the
Kubernetes Control Plane and workloads use a single node.

When deploying a single workload cluster, running multiple CSI pods is unnecessary. Search the **Manifest Editor** for `replica` and change all values for `provisionerReplicas` and `replicated.size`, to `1`. The following image displays the CSI manifest with the `replicated.size` value set.

![Image of the pod security namespace exclusion values](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_CSI-Config.webp)

Select **Confirm** once all the infrastructure layers of your cluster profile are complete.

Additional layers are needed to enable connectivity to your cluster, enable VMO services, and deploy VM templates. Select **Add New Pack**. Search for metallb and add the following pack to your cluster profile.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| MetalLB (Helm) | 0.14.9| Public Repo | Load Balancer |

If necessary, set the **Pack Version** to `0.14.9` and select **Confirm Changes**.

Select **Values**. The MetalLB YAML manifest editor appears.

MetalLB needs a range of routable IP Addresses. Locate the configuration block containing the **addresses:** value. The
value for this field can be either an IP Address range or a subnet using CIDR
notation. For example, `192.168.40.10` and  `192.168.1.0/24` are valid values.

Ensure these IP addresses are reserved from the subnet connected to your MAAS servers.

![Image of the configuration lines where Pod and Services Subnets are set.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_metallb-ips.webp)

Select **Confirm & Create** to add the MetalLB pack to your cluster profile.

Select **Add New Pack**, search for **Virtual Machine Orchestrator**, and add the following pack to your cluster profile.

| **Pack Name** | **Version** | **Registry** | **Layer** |
|---------------|-------------|--------------|-----------|
| Virtual Machine Orchestrator | 4.6.3 | Public Repo | VM Hypervisor |

If necessary, set the **Pack Version** to **4.6.3** and select **Confirm Changes**.

VMO has two different connectivity options, **Proxied** and **Direct**.

| **Connectivity Mode** | **Description**                                                                                                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Proxied               | Communications between your Palette tenant and the VMO dashboard utilize Spectro Proxy services in your cluster. This method is commonly used in environments with high security requirements. If the Spectro Proxy pack is not installed in your cluster, the VMO pack installs it for you. |
| Direct                | This mode is intended for use in an environment with no access restrictions. Communications to the cluster are open and reachable from your corporate networks. This mode will configure the MetallB load balancer to allow ingress to VMO services.                                         |

For more information on the Spectro proxy, visit the
[Official Spectro Proxy documentation page](https://docs.spectrocloud.com/integrations/packs/?pack=spectro-proxy&version=1.5.6&parent=1.5.x&tab=main)

Select **Values** and set the **Access** option to **Proxied**.

The VMO pack contains prerequisite CRDs for subsequent packs. The **Install Order** field lets you control your packs' installation order using numerical values. The install order value defaults to `0`, which implies top
priority. The higher the value is, the lower the install priority is.

Set the **Install Order** value to `10`. Packs that depend on this pack will have their install order value set to 11 or greater, ensuring they are installed after the VMO pack. 

Select the **Values** icon, remove all configurations in the **Manifest Editor**, and paste in the configuration below.

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

Select **Confirm & Create** to add the **Virtual Machine Orchestrator** pack to your cluster profile.

Next, you will configure the VM deployment templates, data volumes containing OS Images, and storage
profiles available in VMO. These configurations can be customized, allowing you control of the OS images, image
repositories, storage, and VM configurations.

Select **Add Manifest**. Name the new layer **vmo-extras**. Set the value of the **Install Order** field to 20 to ensure these configurations apply after the VMO pack is installed. Select **New manifest** and name the manifest **vmo-extras-manifest**. Select the
**blue check mark**.

The **Manifest Editor** appears. Copy the YAML config below and paste it into the **Manifest Editor**. This configuration applies some configuration templates to the VMO services, such as the VM deployment template, storage profiles, and data volumes.

:::warning

The configurations below include setting up the default Ubuntu Administrator account for the VM you will deploy. This example uses clear-text passwords for testing purposes only. We recommend that any deployments use methods to encrypt the password or pull it
from a system for managing secure data, such as HashiCorp Vault or CyberArk.

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

Select **Confirm and Create** to add the vmo-extras layer to your cluster profile.

The visual of the cluster profile reflects the install order you defined while adding and configuring your packs. Your cluster profile should reflect the following image. 

![Image of completed cluster profile.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_complete-cluster-profile.webp)

If the install order is incorrect, you can select the pack that needs to be modified and update the **Install order** field in the **Edit additional pack section**.

Select **Next** to proceed to the **Cluster Profile Review** screen. Select **Finish Configuration** to save your cluster profile.

</TabItem>

<TabItem label="Terraform Worklow" value="Terraform Workflow">

The Terraform workflow creates the cluster profile and the cluster in a single step. Cluster profile configurations using Terraform are included in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) section.

</TabItem>

</Tabs>

## Deploy a VMO Cluster

<Tabs groupId="Workflows">

<TabItem label="UI Workflow" value="UI Workflow">

From the left main menu, select **Clusters** > **Add New Cluster**.

The **Cluster Type** screen displays all available options for automated deployment of Kubernetes clusters. In the **Data
Center** section, select **MAAS**. In the bottom-right corner, select **Start MAAS Configuration**.

The **Cluster Information** screen allows you to provide details about your cluster, such as its name. Enter
the values for **Cluster name**, **Description**, and **Tags**. Select the PCG deployed in your MAAS environment from
the **Cloud Account** drop-down menu. Select **Next** to proceed to the cluster profile selection screen.

Select **Add Cluster Profile**.

In the **Choose a Profile** slide-out menu, locate and select the cluster profile you created in the [Create a VMO Cluster Profile](#create-a-vmo-cluster-profile) section.
Cluster Profile_ section. Select **Confirm**.

The **Cluster Profile** screen provides the details of all the packs in the selected cluster profile. Palette
enables the same profile to be used for multiple clusters by allowing you to change pack values, modify presets, or set
variable values for your packs when they are used to create a new cluster. Select **Next** to accept the cluster profile.

The wizard begins to guide you through configuring the hardware Palette will use to build your cluster. Select your target MAAS domain from the **Domain drop-down menu**. Select **Next**.

The **Node pools configuration** screen allows customization of the control plane node pool, worker node pool, and
which MAAS machines will be used to build your cluster.

The **CONTROL-PLANE-POOL-CONFIGURATION** section allows changes to Kubernetes values that will apply to your
control plane nodes. No changes are required in this section.


The Control Plane—Cloud Configuration section lets you control the specifications of the MAAS machines for your control plane nodes. The following table provides information about the values and how to set them.

| **Variable**        | **Instruction**                                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Enter the name of the MAAS resource pool you want your control plane server to use.                                                                                                                                                                                                                 |
| Minimum CPU         | Enter the minimum number of CPU cores you want your Control Plane server to have. We recommend values higher than 4.                                                                                                                                                                                         |
| Minimum Memory (GB) | Enter the minimum memory you want your Control Plane server to have.                                                                                                                                                                                        |
| Availability zones  | This optional value allows you to specify which MAAS Availability Zones to use for your control plane node deployments. This configuration is critical to consider when planning high-availability infrastructure deployments.                                                                 |
| Tags                | This optional value allows you to assign a tag to the MAAS machine selected for the build. <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |


The **WORKER-POOL-CONFIGURATION**  section requires no changes. We recommend reviewing these values to understand how they
impact the deployment and how you might use them in a production deployment.

The **Worker Pool - Cloud Configuration** section lets you control the specifications of the MAAS machines for your worker nodes The following table provides information about the values and how to set them.

| **Variable**        | **Instruction**                                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Set this value to the name of the MAAS resource pool from which your control plane server will be taken.                                                                                                                                                                                                 |
| Minimum CPU         | Set this to the minimum number of CPU cores you want your Control Plane server to have. We recommend that you set values higher than 5.                                                                                                                                                                                   |
| Minimum Memory (GB) | Set this to the minimum memory you want your Control Plane server to have.                                                                                                                                                                                   |
| Availability zones  | This optional value lets you specify which AZs to use for your node deployment. This configuration is critical when planning high availability patterns for your infrastructure.                                                                                             |
| Tags                | This optional value allows you to assign a tag to the MAAS machine selected for the build. <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |

Select **Next** to accept your node pool configurations.

<PartialsComponent category="vmo" name="vmo-rbac-config" />

![Image of the configured Cluster Role Bindings](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_Configure-RBAC.webp)

Select **Validate**.

:::Warning

If the cluster used for this tutorial is not a test cluster, we strongly recommend adhering to your company's security
standards when configuring RBAC for your cluster. If no standards exist, we recommend following the
[Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security model.

:::

Select **Finish Configuration** to begin deployment of your cluster.

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform Workflow">

#### Terraform Resources Review

To help you get started with Terraform, the tutorial code is structured to support deploying a cluster to either AWS,
Azure, GCP, or VMware vSphere. Before you deploy a host cluster to Azure, review the following files in the folder
structure.

| **File**                | **Description**                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **provider.tf**         | This file contains the Terraform providers used to support the deployment of the cluster.                     |
| **inputs.tf**           | This file contains all the Terraform variables required for the deployment logic.                                      |
| **data.tf**             | This file contains all the query resources that perform read actions.                                                  |
| **cluster_profiles.tf** | This file contains the cluster profile definitions for each cloud provider.                                            |
| **clusters.tf**         | This file has the cluster configurations required to deploy a host cluster to one of the cloud providers.              |
| **terraform.tfvars**    | Use this file to target a specific cloud provider and customize the deployment. This is the only file you must modify. |
| **virtual-machines.tf**           | This file contains the configuration that will be applied to the VM you create in your VMO cluster.                     |

Expand the details boxes for more info on the Terraform files used in this tutorial.

<details>
  <summary>provider.tf</summary>

The **provider.tf** file contains the Terraform providers used in the tutorial and their respective versions. This
tutorial uses four providers:

- [Spectro Cloud](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
- [TLS](https://registry.terraform.io/providers/hashicorp/tls/latest)
- [Local](https://registry.terraform.io/providers/hashicorp/local/latest)

Note how the project name is specified in the `provider "spectrocloud" {}` block. You can change the target project by
modifying the value of the `palette-project` variable in the **terraform.tfvars** file.

```hcl
terraform {
  required_providers {
    spectrocloud = {
      version = "0.23.6"
      source  = "spectrocloud/spectrocloud"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "4.0.4"
    }

    local = {
      source  = "hashicorp/local"
      version = "2.4.1"
    }
  }

  required_version = ">= 1.9"
}

provider "spectrocloud" {
  # API key set through the environment variable SPECTROCLOUD_APIKEY
  project_name = var.palette-project
}
```

</details>

<details>
  <summary>cluster_profiles.tf</summary>

The `spectrocloud_cluster_profile`
resource allows you to create a cluster profile and customize its layers. You can specify the packs and versions to use
or add a manifest or Helm chart.

Cluster profiles include layers for the Operating System (OS), Kubernetes, container network interface, and
container storage interface. The first `pack {}` block in the list equates to the bottom layer of the cluster profile.
Ensure you define the bottom layer of the cluster profile - the OS layer - first in the list of `pack {}` blocks, as the
order in which you arrange the contents of the `pack {}` blocks plays an important role in the cluster profile creation.
The table below displays the packs deployed in each version of the cluster profile.

| **Pack Type** | **Pack Name**      | **Version** |
|---------------|--------------------|-------------|
| OS | `ubuntu-maas 22.04` | `22.04` |
| Kubernetes | `kubernetes` | `1.32.3` |
| Network | `cni-ccilium-oss 1.17.1` | `1.17.1` |
| Storage | `csi--rook-ceph-helm 1.16.3` | `1.16.3` |
| Load Balancer | `lb-metallb-helm 0.14.9` | `0.14.9` |
| App Services | `virtual-machine-orchestrator 4.6.3` | `4.6.3` |
| Custom Manifest | `vmo-extras' | `1.0.0` |

```hcl
##########################
# MAAS VMO Cluster Profile
##########################
resource "spectrocloud_cluster_profile" "maas-vmo-profile" {
  count = var.deploy-maas ? 1 : 0

  name        = "tf-maas-vmo-profile"
  description = "A basic cluster profile for MAAS VMO"
  tags        = concat(var.tags, ["env:maas"])
  cloud       = "maas"
  type        = var.cluster-profile-type
  version     = var.cluster-profile-version

  pack {
    name = data.spectrocloud_pack.maas_ubuntu.name
    tag  = data.spectrocloud_pack.maas_ubuntu.version
    uid  = data.spectrocloud_pack.maas_ubuntu.id
    values = templatefile("manifests/ubuntu-values.yaml", {
      node-network = var.node-network
    })
    type = "spectro"
  }

  pack {
    name = data.spectrocloud_pack.maas_k8s.name
    tag  = data.spectrocloud_pack.maas_k8s.version
    uid  = data.spectrocloud_pack.maas_k8s.id
    values = templatefile("manifests/k8s-values.yaml", {
      pod-CIDR            = var.pod-CIDR,
      clusterServicesCIDR = var.cluster-services-CIDR
      type                = "spectro"
    })
  }

  pack {
    name   = data.spectrocloud_pack.maas_cni.name
    tag    = data.spectrocloud_pack.maas_cni.version
    uid    = data.spectrocloud_pack.maas_cni.id
    values = file("manifests/cni-values.yaml")
    type   = "spectro"
  }

  pack {
    name = data.spectrocloud_pack.maas_csi.name
    tag  = data.spectrocloud_pack.maas_csi.version
    uid  = data.spectrocloud_pack.maas_csi.id
    values = templatefile("manifests/csi-values.yaml", {
      worker_nodes = var.maas-worker-nodes
    })
    type = "spectro"
  }

  pack {
    name = data.spectrocloud_pack.maas_metallb.name
    tag  = data.spectrocloud_pack.maas_metallb.version
    uid  = data.spectrocloud_pack.maas_metallb.id
    values = templatefile("manifests/metallb-values.yaml", {
      metallb-ip-pool = var.metallb-ip-pool
    })
    type = "spectro"
  }

  pack {
    name = data.spectrocloud_pack.maas_vmo.name
    tag  = data.spectrocloud_pack.maas_vmo.version
    uid  = data.spectrocloud_pack.maas_vmo.id
    values = templatefile("manifests/vmo-values.yaml", {
      vmo-network-interface = var.vmo-network-interface,
      vm-vlans              = var.vm-vlans,
      host-vlans            = var.host-vlans
    })
    type = "spectro"
  }

  pack {
    name   = "vmo-extras"
    type   = "manifest"
    tag    = "1.0.0"
    values = file("manifests/vmo-extras-values.yaml")
    manifest {
      name = "vmo-extras"
      content = templatefile("manifests/vmo-extras-manifest.yaml", {
        palette-user-id = var.palette-user-id
      })
    }
  }

}
```

</details>

<details>
  <summary>cluster.tf</summary>

The **clusters.tf** file contains the definitions required for deploying a host cluster to one of the infrastructure
providers. To create an MAAS host cluster, you must set the `deploy-maas` variable in the **terraform.tfvars** file to true.

When deploying a cluster using Terraform, you must provide the same parameters as those available in the Palette UI for
the cluster deployment step, such as the instance size and number of nodes. You can learn more about each parameter by
reviewing the
[MAAS cluster resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_maas)
documentation.

```hcl
# Copyright (c) Spectro Cloud
# SPDX-License-Identifier: Apache-2.0

################
# MAAS Cluster
################

resource "spectrocloud_cluster_maas" "maas-cluster" {
  count = var.deploy-maas ? 1 : 0

  name                 = var.vmo-cluster-name
  tags                 = concat(var.tags, ["env:maas"])
  cloud_account_id     = data.spectrocloud_cloudaccount_maas.account[0].id
  pause_agent_upgrades = "unlock"

  cloud_config {
    domain = var.maas-domain
  }

  cluster_profile {
    id = resource.spectrocloud_cluster_profile.maas-vmo-profile[0].id
  }

  machine_pool {
    name          = "maas-control-plane"
    count         = 1
    control_plane = true
    azs           = var.maas-control-plane-azs
    node_tags     = var.maas-control-plane-node-tags
    instance_type {
      min_cpu       = var.ctl-node-min-cpu
      min_memory_mb = var.ctl-node-min-memory-mb
    }
    placement {
      resource_pool = var.maas-control-plane-resource-pool
    }
  }

  machine_pool {
    name      = "maas-worker-basic"
    count     = 1
    azs       = var.maas-worker-azs
    node_tags = var.maas-worker-node-tags
    instance_type {
      min_cpu       = var.wrk-node-min-cpu
      min_memory_mb = var.wrk-node-min-memory-mb
    }
    placement {
      resource_pool = var.maas-worker-resource-pool
    }
  }
}
```

</details>

<details>
  <summary>data.tf</summary>

Each pack {} block contains references to a data resource. Data resources are used to perform read actions in Terraform. The Spectro Cloud Terraform provider exposes several data resources to help you make your Terraform code more dynamic. The data resource used in the cluster profile is spectrocloud_pack. This resource lets you query Palette for information about a specific pack, such as its unique ID, registry ID, available versions, and YAML values.

Below is the data resource used to query Palette for information about the Kubernetes pack for version 1.32.2.

```hcl
data "spectrocloud_pack" "maas_k8s" {
  name         = "kubernetes"
  version      = "1.32.2"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
Using the data resource helps you avoid manually entering the parameter values required by the cluster profile's pack {} block.

</details>

<details>
  <summary>virtual-machines.tf</summary>

The **clusters.tf** file contains the definitions required for deploying a host cluster to one of the infrastructure
providers. To create an MAAS host cluster, you must set the `deploy-maa-vm` variable in the **terraform.tfvars** file to true.

When deploying a VM using Terraform, you must provide the same parameters as those available in the Palette UI for
the VM deployment step, such as the CPU and storage to allocate to the VM. You can learn more about each parameter by
reviewing the
[virtual machine resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/virtual_machine)
documentation.

```hcl
##########################
# MAAS Virtual Machine
##########################
resource "spectrocloud_virtual_machine" "virtual-machine" {
  count      = var.deploy-maas-vm ? 1 : 0
  depends_on = [spectrocloud_cluster_maas.maas-cluster]

  cluster_uid     = data.spectrocloud_cluster.maas_vmo_cluster[0].id
  cluster_context = data.spectrocloud_cluster.maas_vmo_cluster[0].context

  #run_on_launch = true
  run_strategy = "Halted"
  namespace    = var.vm-deploy-namespace
  name         = var.vm-deploy-name

  timeouts {
    create = "60m"
  }

  labels = {
    #var.vm-labels
    # "tf"             = "spectrocloud-tutorials"
    "kubevirt.io/vm" = "ubuntu-2204"
  }

  data_volume_templates {
    metadata {
      name      = "ubuntu-2204"
      namespace = var.vm-deploy-namespace
    }
    spec {
      source {
        pvc {
          name      = "template-ubuntu-2204"
          namespace = "vmo-golden-images"
        }
      }
      pvc {
        access_modes = ["ReadWriteMany"]
        resources {
          requests = {
            storage = var.vm-storage-Gi
          }
        }
        storage_class_name = "ceph-block"
        volume_mode        = "Block"
      }
    }
  }

  volume {
    name = "ubuntu-2204"
    volume_source {
      data_volume {
        name = "ubuntu-2204"
      }
    }
  }

  volume {
    name = "cloudinitdisk"
    volume_source {
      cloud_init_no_cloud {
        user_data = file("virtual-machines/cloud-init")
      }
    }
  }

  disk {
    name = "ubuntu-2204"
    disk_device {
      disk {
        bus = "virtio"
      }
    }
  }
  disk {
    name = "cloudinitdisk"
    disk_device {
      disk {
        bus = "virtio"
      }
    }
  }

  cpu {
    cores   = var.vm-cpu-cores
    sockets = var.vm-cpu-sockets
    threads = var.vm-cpu-threads
  }
  memory {
    guest = var.vm-memory-Gi
  }

  resources {}

  interface {
    name                     = "default"
    interface_binding_method = "InterfaceMasquerade"
  }

  network {
    name = "default"
    network_source {
      pod {}
    }
  }
}
```

</details>

#### Custom Network Configuration

The VMO pack may require custom network configurations to function correctly in your environment. Expand the following details box for more information.

<PartialsComponent category="vmo" name="custom-network-requirements" />

#### Terraform Cluster Deployment

To deploy a cluster using Terraform, you must first modify the **terraform.tfvars** file. Open it in the editor of your choice. 

The **terraform.tf** file is structured into sections. Each section contains variables that need to be filled in, identified by the placeholder `REPLACE_ME`. Additionally, there is a toggle variable named `deploy-maas` must be set to `true` to deploy your MAAS cluster.

In the **Palette Settings** section, modify the name of the palette-project variable if you wish to deploy to a Palette project different from the default one.

For more information about the variables and their usage, refer to the `.readme` file in the `vmo-cluster` folder of the tutorial package..

<PartialsComponent category="vmo" name="vmo-terraform-plan" />

Execute the `terraform apply` command. Depending on your environment, this process may take up to an hour or more. You can monitor the progress of your cluster build by logging into your [Palette](https://console.spectrocloud.com) tenant and selecting **Clusters** from the left main menu. 

Lastly, you must configure cluster role bindings for your user account and the `virtual-machine-orchestrator` service account

In Palette, select the **Clusters** option in the left main menu and select the cluster you created. Select **Settings** > **Cluster Settings** to access the **Optional Cluster Settings** menu.

<PartialsComponent category="vmo" name="vmo-rbac-config" />

Your cluster role bindings have now been applied to your cluster.

</TabItem>

</Tabs>

## Verify the Cluster Deployment

Select the **Clusters** option in the left main menu in Palette. Select the cluster you created in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) section. On the **Cluster Overview** page, ensure the cluster status is healthy, and the **Virtual Machines** tab appears. No further validation is required.

![Image of succesfully deployed cluster](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_verify-cluster.webp)

## Deploy a Virtual Machine

<Tabs groupId="Workflows">

<TabItem label="UI Workflow" value="UI Workflow">

From the left main menu, select **Clusters** to open the cluster management console. Select the cluster you deployed in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) section to open its **Cluster Overview** page.

Select the **Virtual Machines** tab to connect to the **VM Dashboard**. If the **Virtual Machines** tab is not displayed, review the RBAC configuration in the [Create a VMO Cluster](#create-a-vmo-cluster-profile) section and ensure your `user account` and the `virtual-machine-orchestrator` service account have been configured as instructed.

The `default` namespace is automatically displayed on the **VM Dashboard**. Select the **virtual-machines** namespace from the **Namespace** drop-down menu. The display will update to show the status of any VMs running in that namespace. This also specifies the namespace where your VMs will be deployed. Select **New Virtual Machine** to begin deploying your VM.

The next screen allows you to select and configure the OS for your VM. The VM template displayed is the one you deployed in the [Create a VMO Cluster Profile](#create-a-vmo-cluster-profile) section. Select the **Ubuntu 22.04** template.

The **VM settings** page allows you to customize the basic configuration for your VM. Set the values as instructed in the following table. When you are done, select **Next** to accept your settings.

| **Configuration**                     | **Value**       | **Description**                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                                  | `Choose a name` | The name of the VM to be deployed.                                                                                                                                                                                                                                                                                                                                              |
| CPUs (cores)                          | `2`             | The number of CPU cores your VM needs.                                                                                                                                                                                                                                                                                                                                          |
| Memory (GiB)                          | `2`             | The amount of Memory your VM needs have in GiB                                                                                                                                                                                                                                                                                                                                  |
| Storage Access Mode                   | `ReadWriteMany` | We recommend always using ReadWriteMany. This configuration allows your VM to read the storage volume from any node in your cluster. This is required if you plan to migrate your VM between nodes. <br /> This configuration also helps avoid node congestion as Kubernetes attempts to schedule your VM on a node with a Volume with the matching Storage Access Mode. |
| OS image URL                          | `N/A`           | Your image location is defined in the Ubuntu 22.04 template. This field is used to specify custom OS images or custom image repositories for a VM.                                                                                                                                                                                                                                |
| Start VM automatically after creation | `Halted`        | We recommend setting this value to halted to ensure no issues occur during the cloud-init process |

The **Customize Configuration** screen displays the YAML used to build your VM. KubeVirt enables
configuration, deployment, and management of your VMs using the same process used to configure and deploy pods.

The YAML configuration can be integrated into many deployment tools that support the deployment of Kubernetes configurations. The configuration can also be manually applied using kubectl by using the
`kubectl apply --filename <filename>` command.

Select **Next** to apply your customizations. Select **Create Virtual Machine**.

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform Workflow">

This section introduces and reviews the Terraform scripts used to deploy a VM into your MAAS VMO cluster.

Before deploying your VM, you must modify the `terraform.tfvars` file to reflect the configuration you want your VM to
have. Update terraform.tfvars as instructed in the following table.

| **Variable**       | **Data Type** | **Instruction**                                                                                                                                                              |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **deploy-maas-vm** | `boolean`     | This is a true of false value. If true, an Ubuntu 22.04 VM with Docker installed is deployed in your VMO cluster. Set this value to `true` for this section of the tutorial. |
| **vm-deploy-namespace** | `string`      | Set this value to the name of the VLAN you want your VMs to deploy on.<br/><br/>These namespaces are standard Kubernetes namespaces. Your VM is impacted by any configurations applied at the namespace level, such as network policies and quotas. |
| **vm-deploy-name**      | `string`      | Set this value to the name you want your VM to have.                                                                                                                                                                                               |
| **vm-labels**           | `string`      | Set this value to a single label you want applied to your VM. For multiple labels, you must modify _virtual_machines.tf_ to include one line for each label.                                                                                       |
| **vm-storage-Gi**       | `string`      | Set this value to the disk size you want your VM to have. You must include 'Gi' in your value. Example `50Gi`                                                                                                                                   |
| **vm-vpu-cores**        | `number`      | Set this value to the number of CPU cores your VM will have.                                                                                                                                                                                       |
| **vm-cpu-sockets**      | `number`      | Set this value to the number of physical CPU sockets your VM needs. This is intended to enable hardware resilience in case of a single CPU socket-related failure.                                                                            |
| **vm-cpu-threads**      | `number`      | The number of CPU threads your VM can use. You can assign 1 CPU core and a single thread if desired.                                                                                                                                     |
| **vm-memory-Gi**        | `string`      | Set this value to the amount of RAM (memory) you want your VM to have. You must include 'Gi' in your value. Example `4Gi`                                                                                                                          |

<PartialsComponent category="vmo" name="vmo-terraform-plan" />

Execute the `terraform apply` command to create the VM in your VMO Cluster.

</TabItem>

</Tabs>

## Deploy the Application

From the left main menu, select **Clusters** to open the cluster management console. Select the cluster you deployed in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) section to open its **Cluster Overview** page.

Select the **Virtual Machines** tab to connect to the **VM Dashboard**. If the **Virtual Machines** tab is not displayed, review the RBAC configuration in the [Create a VMO Cluster Profile](#create-a-vmo-cluster-profile) section and ensure your `user account` and the `virtual-machine-orchestrator` service account have been configured as instructed.

Select the **Virtual Machines** namespace from the **Namespace** drop-down menu. Select the VM you created in the
[Deploy a Virtual Machine](#deploy-a-virtual-machine) section.

Select the **Start Icon** to start your VM.

![Image of the start icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_start-vm.webp)

Select the **Open web console** option. Palette will connect to your VM and display a terminal window.

Log in to your VM using the following username and password:

| **User Name** | **Password** |
| ------------- | ------------ |
| ubuntu        | spectro      |

Execute the `docker version` command to confirm Docker was successfully installed during the cloud-init process.

Next, you must pull and run the `Hello Universe` container.

Execute `docker run -d --restart=always -p 9080:8080 ghcr.io/spectrocloud/hello-universe:1.2.0`.

In Palette, open the **Cluster Overview** page for the cluster you built in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) section. Select the download link for your cluster's admin kubeconfig file.

![Image of the admin kubeconfig link](/tutorials/deploy-vmo-maas/tutorials_vmo-mass_admin-kubeconfig.webp)

Open a terminal on your workstation. Update the following command to set the `KUBECONFIG` environment variable to your downloaded file.

```shell

export KUBECONFIG=<path-to-your-kubeconfig-file>

```

Use the following command to confirm the kubeconfig environment variable has been successfully exported.

```shell

user@vmo-tutorial ~ % kubectl version
Client Version: v1.32.3
Kustomize Version: v5.5.0
Server Version: v1.32.2

```

To access your app, you must create a service in Kubernetes. The service configures MetalLB to provide ingress access to
your Kubernetes cluster by mapping a network port on the nodes to the network port your app is listening on inside the
cluster.

Once the connection passes through MetalLB, the Kubernetes service acts as a load balancer inside your cluster. Since
pods dynamically scale, the service keeps track of all pods running your app using a label selector. In this
tutorial, the label `kubevirt.io/domain: hellouni` uniquely identifies pods running the hello-universe app.

Use the following command to create the Kubernetes service for the hello-universe app.

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

In Palette, navigate to the left main menu and select **Clusters**. Select the cluster you created in the [Deploy a VMO Cluster](#deploy-a-vmo-cluster) to display the **Cluster Overview** screen.

The **Services** section of the cluster overview screen displays any active services or port-forwards in your cluster. Select the **:9080** link for the **hello-universe-service** to access the Hello Universe app.

:::tip

It may take up to 5 minutes for Palette to refresh your cluster's information and display the **hello-universe-service** on the **Cluster Overview** screen.

:::

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_hello-uni-service.webp)

Your result should be similar to the following screenshot.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

## Clean Up

<Tabs groupId="Workflows">

<TabItem label="UI Workflow" value="UI Workflow">

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, select **Clusters** from the left main menu. On the **Cluster Overview** page, select Settings** > Delete Cluster**.

![Delete cluster](/getting-started/azure/getting-started_deploy-k8s-cluster_delete-cluster-button.webp)

Enter the name of the cluster to confirm the delete action. The process takes several minutes to complete.

<br />

<PartialsComponent category="vmo" name="clean-up-tip" />

<br />

In Palette, navigate to the left main menu and select **Profiles**. Find the cluster profile you created in the [Create a VMO Cluster Profile](#create-a-vmo-cluster-profile) section and select the three-dot
menu to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile.

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform Workflow">

Use the `terraform destroy` command to clean up the resources you deployed.

<PartialsComponent category="vmo" name="clean-up-tip" />

</TabItem>

</Tabs>

## Wrap-up

In this tutorial, you created a new cluster profile and used it to deploy a new Kubernetes cluster with the Palette Virtual
Machine Orchestrator service. You deployed a VM and used Palette's features to connect to the VM and deploy the
**Hello Universe** and confirmed it was operating successfully.

For more information on VMO, visit the [VMO architecture](../../vm-management/architecture.md) page.