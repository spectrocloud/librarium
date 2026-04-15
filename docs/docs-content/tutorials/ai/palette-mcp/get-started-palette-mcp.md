---
sidebar_position: 20
sidebar_label: "Get Started with the Palette MCP Server"
title: "Get Started with the Palette MCP Server"
description: "Learn how to use the Palette MCP Server to connect to and debug cluster deployments."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

YOLO THE INTRO HERE

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - The Palette MCP server configured and set up. Refer to the applicable setup guide for
    [Claude](../../../automation/palette-mcp/setup/mcp-setup-claude.md),
    [Cursor](../../../automation/palette-mcp//setup/mcp-setup-cursor.md), or the
    [Gemini CLI](../../../automation/palette-mcp/setup/mcp-setup-gemini.md).

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Import a Cluster Profile

In this section, you will import a cluster profile into Palette. This profile will be used to deploy a cluster.

:::warning

For learning purposes, there are two errors in these cluster profiles. Avoid using them in workloads outside this
tutorial.

:::

<Tabs queryString="cloud">

<TabItem label="AWS" value="aws">

| **Pack Type** | **Pack Name**    | **Version** |
| ------------- | ---------------- | ----------- |
| OS            | `ubuntu-aws`     | `24.04`     |
| Kubernetes    | `kubernetes`     | `1.33.9`    |
| Network       | `cni-calico`     | `3.31.4`    |
| Storage       | `csi-aws-ebs`    | `1.57.1`    |
| App Services  | `hello-universe` | `invalid`   |
| Monitoring    | `cost-analyzer`  | `1.103.3`   |

</TabItem>

<TabItem label="Azure" value="azure">

| **Pack Type** | **Pack Name**      | **Version** |
| ------------- | ------------------ | ----------- |
| OS            | `ubuntu-azure`     | `24.04`     |
| Kubernetes    | `kubernetes`       | `1.33.9`    |
| Network       | `cni-calico-azure` | `3.31.4`    |
| Storage       | `csi-azure`        | `1.34.2`    |
| App Services  | `hello-universe`   | `invalid`   |
| Monitoring    | `cost-analyzer`    | `1.103.3`   |

</TabItem>

</Tabs>

Log in to [Palette](https://console.spectrocloud.com). From the left main menu, select **Profiles** and click **Import
Cluster Profile**.

In the slide drawer that opens, paste the following JSON snippet for your cloud provider.

<Tabs queryString="cloud">

<TabItem label="AWS" value="aws">

```json
{
  "metadata": {
    "name": "get-started-palette-mcp-aws",
    "description": "Cluster profile for Get Started with Palette MCP tutorial.",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "aws",
      "packs": [
        {
          "name": "ubuntu-aws",
          "type": "oci",
          "layer": "os",
          "version": "24.04",
          "tag": "24.04",
          "values": "# Spectro Golden images includes most of the hardening as per CIS Ubuntu Linux 24.04 LTS Server L1 v1.0.0 standards\n\n# Uncomment below section to\n# 1. Include custom files to be copied over to the nodes and/or\n# 2. Execute list of commands before or after kubeadm init/join is executed\n#\n#kubeadmconfig:\n#  preKubeadmCommands:\n#  - echo \"Executing pre kube admin config commands\"\n#  - update-ca-certificates\n#  - 'systemctl restart containerd; sleep 3'\n#  - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo \"Waiting for containerd...\"; sleep 1; done'\n#  postKubeadmCommands:\n#  - echo \"Executing post kube admin config commands\"\n#  files:\n#  - targetPath: /usr/local/share/ca-certificates/mycom.crt\n#    targetOwner: \"root:root\"\n#    targetPermissions: \"0644\"\n#    content: |\n#      -----BEGIN CERTIFICATE-----\n#      MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n#      cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE\n#      AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA\n#      nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz\n#      qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN\n#      fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2\n#      7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL\n#      9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK\n#      jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB\n#      /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki\n#      HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y\n#      g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ\n#      ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6\n#      b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56\n#      IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=\n#      -----END CERTIFICATE-----",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "kubernetes",
          "type": "oci",
          "layer": "k8s",
          "version": "1.33.9",
          "tag": "1.33.x",
          "values": "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube Scheduler:loopback-scheduler,Azure Disk Encryption Set:disable-azure-disk-encryption\npack:\n  content:\n    images:\n      - image: registry.k8s.io/coredns/coredns:v1.12.0\n      - image: registry.k8s.io/etcd:3.5.24-0\n      - image: registry.k8s.io/kube-apiserver:v1.33.9\n      - image: registry.k8s.io/kube-controller-manager:v1.33.9\n      - image: registry.k8s.io/kube-proxy:v1.33.9\n      - image: registry.k8s.io/kube-scheduler:v1.33.9\n      - image: registry.k8s.io/pause:3.9\n      - image: registry.k8s.io/pause:3.8\n      - image: registry.k8s.io/pause:3.10\n  #CIDR Range for Pods in cluster\n  # Note : This must not overlap with any of the host or service network\n  podCIDR: \"192.168.0.0/16\"\n  #CIDR notation IP range from which to assign service cluster IPs\n  # Note : This must not overlap with any IP ranges assigned to nodes for pods.\n  serviceClusterIpRange: \"10.96.0.0/12\"\n  # serviceDomain: \"cluster.local\"\n\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note : secure-port flag is used during kubeadm init. Do not change this flag on a running cluster\n      secure-port: \"6443\"\n      anonymous-auth: \"true\"\n      profiling: \"false\"\n      disable-admission-plugins: \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds: \"60\"\n      default-unreachable-toleration-seconds: \"60\"\n      enable-admission-plugins: \"AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity\"\n      admission-control-config-file: \"/etc/kubernetes/pod-security-standard.yaml\"\n      audit-log-path: /var/log/apiserver/audit.log\n      audit-policy-file: /etc/kubernetes/audit-policy.yaml\n      audit-log-maxage: \"30\"\n      audit-log-maxbackup: \"10\"\n      audit-log-maxsize: \"100\"\n      authorization-mode: RBAC,Node\n      kubelet-certificate-authority: \"/etc/kubernetes/pki/ca.crt\"\n      tls-cipher-suites: \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384\"\n    extraVolumes:\n      - name: audit-log\n        hostPath: /var/log/apiserver\n        mountPath: /var/log/apiserver\n        pathType: DirectoryOrCreate\n      - name: audit-policy\n        hostPath: /etc/kubernetes/audit-policy.yaml\n        mountPath: /etc/kubernetes/audit-policy.yaml\n        readOnly: true\n        pathType: File\n      - name: pod-security-standard\n        hostPath: /etc/kubernetes/pod-security-standard.yaml\n        mountPath: /etc/kubernetes/pod-security-standard.yaml\n        readOnly: true\n        pathType: File\n  controllerManager:\n    extraArgs:\n      profiling: \"false\"\n      terminated-pod-gc-threshold: \"25\"\n      use-service-account-credentials: \"true\"\n      feature-gates: \"RotateKubeletServerCertificate=true\"\n  scheduler:\n    extraArgs:\n      profiling: \"false\"\n  kubeletExtraArgs:\n    read-only-port: \"0\"\n    event-qps: \"0\"\n    feature-gates: \"RotateKubeletServerCertificate=true\"\n    protect-kernel-defaults: \"true\"\n    rotate-server-certificates: \"true\"\n    tls-cipher-suites: \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384\"\n  files:\n    - path: hardening/audit-policy.yaml\n      targetPath: /etc/kubernetes/audit-policy.yaml\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n    - path: hardening/90-kubelet.conf\n      targetPath: /etc/sysctl.d/90-kubelet.conf\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n    - targetPath: /etc/kubernetes/pod-security-standard.yaml\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n      content: |\n        apiVersion: apiserver.config.k8s.io/v1\n        kind: AdmissionConfiguration\n        plugins:\n        - name: PodSecurity\n          configuration:\n            apiVersion: pod-security.admission.config.k8s.io/v1\n            kind: PodSecurityConfiguration\n            defaults:\n              enforce: \"baseline\"\n              enforce-version: \"v1.33\"\n              audit: \"baseline\"\n              audit-version: \"v1.33\"\n              warn: \"restricted\"\n              warn-version: \"v1.33\"\n            exemptions:\n              # Array of authenticated usernames to exempt.\n              usernames: []\n              # Array of runtime class names to exempt.\n              runtimeClasses: []\n              # Array of namespaces to exempt.\n              namespaces: [kube-system]\n\n  preKubeadmCommands:\n    # For enabling 'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required\n    - 'echo \"====> Applying kernel parameters for Kubelet\"'\n    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'\n    - 'test -f /etc/containerd/ca.crt && cp /etc/containerd/ca.crt /usr/local/share/ca-certificates/container.crt && update-ca-certificates && systemctl restart containerd'\n  \n  postKubeadmCommands:\n    - 'chmod 600 /var/lib/kubelet/config.yaml'\n    # - 'echo \"List of post kubeadm commands to be executed\"'\n\n# Client configuration to add OIDC based authentication flags in kubeconfig\n#clientConfig:\n  #oidc-issuer-url: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}\"\n  #oidc-client-id: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}\"\n  #oidc-client-secret: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-secret }}\"\n  #oidc-extra-scope: profile,email",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "cni-calico",
          "type": "oci",
          "layer": "cni",
          "version": "3.31.4",
          "tag": "3.31.4",
          "values": "# spectrocloud.com/enabled-presets: Microk8s:microk8s-false\npack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/cni:v3.31.4\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/node:v3.31.4\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/kube-controllers:v3.31.4\n\nmanifests:\n  calico:\n    microk8s: \"false\"\n    images:\n      cni: \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type to use. Supported types are calico-ipam, host-local\n    ipamType: \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4: true\n      assign_ipv6: false\n\n    # Should be one of CALICO_IPV4POOL_IPIP or CALICO_IPV4POOL_VXLAN  \n    encapsulationType: \"CALICO_IPV4POOL_IPIP\"\n\n    # Should be one of Always, CrossSubnet, Never\n    encapsulationMode: \"Always\"\n\n    env:\n      # Additional env variables for calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT: \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR: \"192.168.0.0/16\"\n        # For EKS cluster with static provisioning, set IP_AUTODETECTION_METHOD to \"interface=eth0\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env variables for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL: \"info\"\n        #SYNC_NODE_LABELS: \"true\"",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "csi-aws-ebs",
          "type": "oci",
          "layer": "csi",
          "version": "1.57.1",
          "tag": "1.57.1",
          "values": "pack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/aws-ebs-csi-driver:v1.57.1\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-provisioner:v6.2.0-eksbuild.2\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-attacher:v4.11.0-eksbuild.3\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-resizer:v2.1.0-eksbuild.3\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/livenessprobe:v2.18.0-eksbuild.3\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/node-driver-registrar:v2.16.0-eksbuild.3\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-snapshotter/csi-snapshotter:v8.5.0-eksbuild.3\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/volume-modifier-for-k8s:v0.9.4-eksbuild.1\n    charts:\n      - repo: https://kubernetes-sigs.github.io/aws-ebs-csi-driver\n        name: aws-ebs-csi-driver\n        version: 2.57.1\n  namespace: \"kube-system\"\ncharts:\n  aws-ebs-csi-driver:\n    storageClasses:\n      # Default Storage Class\n      - name: spectro-storage-class\n        # annotation metadata\n        annotations:\n          storageclass.kubernetes.io/is-default-class: \"true\"\n          # label metadata\n          # labels:\n          #   my-label-is: supercool\n          # defaults to WaitForFirstConsumer\n        volumeBindingMode: WaitForFirstConsumer\n        # defaults to Delete\n        reclaimPolicy: Delete\n        parameters:\n          # File system type: xfs, ext2, ext3, ext4\n          csi.storage.k8s.io/fstype: \"ext4\"\n          # EBS volume type: io1, io2, gp2, gp3, sc1, st1, standard\n          type: \"gp2\"\n          # I/O operations per second per GiB. Required when io1 or io2 volume type is specified.\n          # iopsPerGB: \"\"\n          # Applicable only when io1 or io2 volume type is specified\n          # allowAutoIOPSPerGBIncrease: false\n          # I/O operations per second. Applicable only for gp3 volumes.\n          # iops: \"\"\n          # Throughput in MiB/s. Applicable only for gp3 volumes.\n          # throughput: \"\"\n          # Whether the volume should be encrypted or not\n          # encrypted: \"\"\n          # The full ARN of the key to use when encrypting the volume. When not specified, the default KMS key is used.\n          # kmsKeyId: \"\"\n    # Additional Storage Class \n    # - name: addon-storage-class\n    # annotations:\n    #   storageclass.kubernetes.io/is-default-class: \"false\"\n    # labels:\n    #   my-label-is: supercool\n    # volumeBindingMode: WaitForFirstConsumer\n    # reclaimPolicy: Delete\n    # parameters:\n    # csi.storage.k8s.io/fstype: \"ext4\"\n    # type: \"gp2\"\n    # iopsPerGB: \"\"\n    # allowAutoIOPSPerGBIncrease: false\n    # iops: \"\"\n    # throughput: \"\"\n    # encrypted: \"\"\n    # kmsKeyId: \"\"\n\n    image:\n      repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/aws-ebs-csi-driver\n      # Overrides the image tag whose default is v{{ .Chart.AppVersion }}\n      tag: \"v1.57.1\"\n      pullPolicy: IfNotPresent\n    # -- Custom labels to add into metadata\n    customLabels: {}\n    # k8s-app: aws-ebs-csi-driver\n\n    sidecars:\n      provisioner:\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-provisioner\n          tag: \"v6.2.0-eksbuild.2\"\n        logLevel: 2\n        # Additional parameters provided by csi-provisioner.\n        additionalArgs: []\n        # Grant additional permissions to csi-provisioner\n        additionalClusterRoleRules:\n        resources: {}\n        # Tune leader lease election for csi-provisioner.\n        # Leader election is on by default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        securityContext:\n          seccompProfile:\n            type: RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      attacher:\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-attacher\n          tag: \"v4.11.0-eksbuild.3\"\n        # Tune leader lease election for csi-attacher.\n        # Leader election is on by default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel: 2\n        # Additional parameters provided by csi-attacher.\n        additionalArgs: []\n        # Grant additional permissions to csi-attacher\n        additionalClusterRoleRules: []\n        resources: {}\n        securityContext:\n          seccompProfile:\n            type: RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      snapshotter:\n        # Enables the snapshotter sidecar even if the snapshot CRDs are not installed\n        forceEnable: false\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-snapshotter/csi-snapshotter\n          tag: \"v8.5.0-eksbuild.3\"\n        logLevel: 2\n        # Additional parameters provided by csi-snapshotter.\n        additionalArgs: []\n        # Grant additional permissions to csi-snapshotter\n        additionalClusterRoleRules: []\n        resources: {}\n        securityContext:\n          seccompProfile:\n            type: RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      metadataLabeler:\n        # ALPHA: Enable the metadata-labeler sidecar to label Kubernetes Nodes with\n        # information from the EC2 API (e.g. number of ENIs)\n        # Also requires using metadata-labeler as the node's metadata source\n        enabled: false\n        logLevel: 2\n        # Additional parameters provided by metadataLabeler.\n        additionalArgs: []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      livenessProbe:\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/livenessprobe\n          tag: \"v2.18.0-eksbuild.3\"\n        # Additional parameters provided by livenessprobe.\n        additionalArgs: []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      resizer:\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/external-resizer\n          tag: \"v2.1.0-eksbuild.3\"\n        # Tune leader lease election for csi-resizer.\n        # Leader election is on by default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel: 2\n        # Additional parameters provided by csi-resizer.\n        additionalArgs: []\n        # Grant additional permissions to csi-resizer\n        additionalClusterRoleRules: []\n        resources: {}\n        securityContext:\n          seccompProfile:\n            type: RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n      nodeDriverRegistrar:\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/node-driver-registrar\n          tag: \"v2.16.0-eksbuild.3\"\n        logLevel: 2\n        # The port the health probe is bound to.\n        healthPort: 9809\n        # Additional parameters provided by node-driver-registrar.\n        additionalArgs: []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n        livenessProbe:\n          httpGet:\n            path: /healthz\n            port: healthz-ndr\n          initialDelaySeconds: 30\n          periodSeconds: 90\n          timeoutSeconds: 15\n      volumemodifier:\n        env: []\n        image:\n          pullPolicy: IfNotPresent\n          repository: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.57.1/volume-modifier-for-k8s\n          tag: \"v0.9.4-eksbuild.1\"\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel: 2\n        # Additional parameters provided by volume-modifier-for-k8s.\n        additionalArgs: []\n        resources: {}\n        securityContext:\n          seccompProfile:\n            type: RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation: false\n    proxy:\n      http_proxy:\n      no_proxy:\n    imagePullSecrets: []\n    nameOverride:\n    fullnameOverride:\n    awsAccessSecret:\n      name: aws-secret\n      keyId: key_id\n      accessKey: access_key\n    controller:\n      batching: true\n      volumeModificationFeature:\n        enabled: false\n      # Enable support for node-local volumes that use pre-attached EBS volumes\n      enableNodeLocalVolumes: false\n      # Additional parameters provided by aws-ebs-csi-driver controller.\n      additionalArgs: []\n      sdkDebugLog: false\n      loggingFormat: text\n      affinity:\n        nodeAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n            - weight: 1\n              preference:\n                matchExpressions:\n                  - key: eks.amazonaws.com/compute-type\n                    operator: NotIn\n                    values:\n                      - fargate\n                      - auto\n                      - hybrid\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n            - podAffinityTerm:\n                labelSelector:\n                  matchExpressions:\n                    - key: app\n                      operator: In\n                      values:\n                        - ebs-csi-controller\n                topologyKey: kubernetes.io/hostname\n              weight: 100\n      # The default filesystem type of the volume to provision when fstype is unspecified in the StorageClass.\n      # If the default is not set and fstype is unset in the StorageClass, then no fstype will be set\n      defaultFsType: ext4\n      env: []\n      # Use envFrom to reference ConfigMaps and Secrets across all containers in the deployment\n      envFrom: []\n      # If set, add pv/pvc metadata to plugin create and modify requests as parameters.\n      extraCreateMetadata: true\n      # Extra volume tags to attach to each dynamically provisioned volume.\n      # ---\n      # extraVolumeTags:\n      #   key1: value1\n      #   key2: value2\n      extraVolumeTags: {}\n      httpEndpoint:\n      # (deprecated) The TCP network address where the prometheus metrics endpoint\n      # will run (example: `:8080` which corresponds to port 8080 on local host).\n      # The default is empty string, which means metrics endpoint is disabled.\n      # ---\n      enableMetrics: false\n      # If metrics are enabled, add prometheus.io/scrape and prometheus.io/port\n      # annotations to the metrics services.\n      enablePrometheusAnnotations: true\n      serviceMonitor:\n        # Enables the ServiceMonitor resource even if the prometheus-operator CRDs are not installed\n        forceEnable: false\n        # Additional labels for ServiceMonitor object\n        labels: {}\n        interval: \"15s\"\n      # If set to true, AWS API call metrics will be exported to the following\n      # TCP endpoint: \"0.0.0.0:3301\"\n      # ---\n      # ID of the Kubernetes cluster used for tagging provisioned EBS volumes (optional).\n      k8sTagClusterId:\n      logLevel: 2\n      userAgentExtra: \"helm\"\n      nodeSelector: {}\n      deploymentAnnotations: {}\n      podAnnotations: {}\n      podLabels: {}\n      podDisruptionBudget:\n        # Warning: Disabling PodDisruptionBudget may lead to delays in stateful workloads starting due to controller\n        # pod restarts or evictions.\n        enabled: true\n        # unhealthyPodEvictionPolicy:\n        # Configure the maxUnavailable or minAvailable for the PDB\n        # If either parameter is non-null, no default is used for both\n        # maxUnavailable:\n        # minAvailable:\n      priorityClassName: system-cluster-critical\n      # AWS region to use. If not specified then the region will be looked up via the AWS EC2 metadata\n      # service.\n      # ---\n      # region: us-east-1\n      region:\n      replicaCount: 2\n      revisionHistoryLimit: 10\n      socketDirVolume:\n        emptyDir: {}\n      updateStrategy:\n        type: RollingUpdate\n        rollingUpdate:\n          maxUnavailable: 1\n      # type: RollingUpdate\n      # rollingUpdate:\n      #   maxSurge: 0\n      #   maxUnavailable: 1\n      resources:\n        requests:\n          cpu: 10m\n          memory: 40Mi\n        limits:\n          memory: 256Mi\n          cpu: 100m\n      serviceAccount:\n        # A service account will be created for you if set to true. Set to false if you want to use your own.\n        create: true\n        name: ebs-csi-controller-sa\n        annotations: {}\n        ## Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn: arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken: true\n      tolerations:\n        - key: CriticalAddonsOnly\n          operator: Exists\n        - effect: NoExecute\n          operator: Exists\n          tolerationSeconds: 300\n      # TSCs without the label selector stanza\n      #\n      # Example:\n      #\n      # topologySpreadConstraints:\n      #  - maxSkew: 1\n      #    topologyKey: topology.kubernetes.io/zone\n      #    whenUnsatisfiable: ScheduleAnyway\n      #  - maxSkew: 1\n      #    topologyKey: kubernetes.io/hostname\n      #    whenUnsatisfiable: ScheduleAnyway\n      topologySpreadConstraints: []\n      # securityContext on the controller pod\n      securityContext:\n        runAsNonRoot: true\n        runAsUser: 1000\n        runAsGroup: 1000\n        fsGroup: 1000\n      # Add additional volume mounts on the controller with controller.volumes and controller.volumeMounts\n      volumes: []\n      # Add additional volumes to be mounted onto the controller:\n      # - name: custom-dir\n      #   hostPath:\n      #     path: /path/to/dir\n      #     type: Directory\n      volumeMounts: []\n      # And add mount paths for those additional volumes:\n      # - name: custom-dir\n      #   mountPath: /mount/path\n      # ---\n      # securityContext on the controller container (see sidecars for securityContext on sidecar containers)\n      containerSecurityContext:\n        seccompProfile:\n          type: RuntimeDefault\n        readOnlyRootFilesystem: true\n        allowPrivilegeEscalation: false\n      initContainers: []\n      # containers to be run before the controller's container starts.\n      #\n      # Example:\n      #\n      # - name: wait\n      #   image: public.ecr.aws/amazonlinux/amazonlinux\n      #   command: [ 'sh', '-c', \"sleep 20\" ]\n      # Enable opentelemetry tracing for the plugin running on the daemonset\n      otelTracing: {}\n      #  otelServiceName: ebs-csi-controller\n      #  otelExporterEndpoint: \"http://localhost:4317\"\n\n      # dnsConfig for the controller pods\n      dnsConfig: {}\n    node:\n      # Enable SELinux-only optimizations on the EBS CSI Driver node pods\n      # Must only be set true if all linux nodes in the DaemonSet have SELinux enabled\n      selinux: false\n      env: []\n      envFrom: []\n      kubeletPath: /var/lib/kubelet\n      loggingFormat: text\n      logLevel: 2\n      enableMetrics: false\n      # If metrics are enabled, add prometheus.io/scrape and prometheus.io/port\n      # annotations to the metrics services.\n      enablePrometheusAnnotations: true\n      serviceMonitor:\n        # Enables the ServiceMonitor resource even if the prometheus-operator CRDs are not installed\n        forceEnable: false\n        # Additional labels for ServiceMonitor object\n        labels: {}\n        interval: \"15s\"\n      priorityClassName:\n      additionalArgs: []\n      affinity:\n        nodeAffinity:\n          requiredDuringSchedulingIgnoredDuringExecution:\n            nodeSelectorTerms:\n              - matchExpressions:\n                  - key: eks.amazonaws.com/compute-type\n                    operator: NotIn\n                    values:\n                      - fargate\n                      - auto\n                      - hybrid\n      nodeSelector: {}\n      daemonSetAnnotations: {}\n      podAnnotations: {}\n      podLabels: {}\n      terminationGracePeriodSeconds: 30\n      tolerateAllTaints: true\n      tolerations:\n        - operator: Exists\n          effect: NoExecute\n          tolerationSeconds: 300\n      resources:\n        requests:\n          cpu: 10m\n          memory: 40Mi\n        limits:\n          memory: 256Mi\n          cpu: 100m\n      revisionHistoryLimit: 10\n      probeDirVolume:\n        emptyDir: {}\n      serviceAccount:\n        create: true\n        name: ebs-csi-node-sa\n        annotations: {}\n        ## Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn: arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken: true\n        # Disable mutating permissions for the node service account.\n        # When enabled, some features of the EBS CSI Driver node pods will not function, such as taint removal.\n        # Primarily useful in particularly security-sensitive environments, or on multi-tenant clusters that isolate tenants by node.\n        disableMutation: false\n      # Enable the linux daemonset creation\n      enableLinux: true\n      enableWindows: true\n      # Comma separated list of metadata sources that override the default used by the EBS CSI Driver. Valid sources include 'imds', 'kubernetes', and (ALPHA) 'metadata-labeler'\n      metadataSources:\n      # Warning: This option will be removed in a future release. It is a temporary workaround for users unable to immediately migrate off of older kernel versions.\n      # Formats XFS volumes with bigtime=0,inobtcount=0,reflink=0, for mounting onto nodes with linux kernel version <= 5.4.\n      # Note that XFS volumes formatted with this option will only have timestamp records until 2038.\n      legacyXFS: false\n      # The number of attachment slots to reserve for system use (and not to be used for CSI volumes)\n      # When this parameter is not specified (or set to -1), the EBS CSI Driver will attempt to determine the number of reserved slots via heuristic\n      # Cannot be specified at the same time as `node.volumeAttachLimit`\n      reservedVolumeAttachments:\n      # The \"maximum number of attachable volumes\" per node\n      # Cannot be specified at the same time as `node.reservedVolumeAttachments`\n      volumeAttachLimit:\n      updateStrategy:\n        type: RollingUpdate\n        rollingUpdate:\n          maxUnavailable: \"10%\"\n      hostNetwork: false\n      # securityContext on the node pod\n      securityContext:\n        # The node pod must be run as root to bind to the registration/driver sockets\n        runAsNonRoot: false\n        runAsUser: 0\n        runAsGroup: 0\n        fsGroup: 0\n      # allows you to deploy aws-ebs-csi-node daemonset to separate namespace (make sure namespace exists before deploy)\n      namespaceOverride: \"\"\n      # Add additional volume mounts on the node pods with node.volumes and node.volumeMounts\n      volumes: []\n      # Add additional volumes to be mounted onto the node pods:\n      # - name: custom-dir\n      #   hostPath:\n      #     path: /path/to/dir\n      #     type: Directory\n      volumeMounts: []\n      # And add mount paths for those additional volumes:\n      # - name: custom-dir\n      #   mountPath: /mount/path\n      # ---\n      # securityContext on the node container (see sidecars for securityContext on sidecar containers)\n      # Privileged containers always run as `Unconfined`, which means that they are not restricted by a seccomp profile.\n      containerSecurityContext:\n        readOnlyRootFilesystem: true\n        privileged: true\n      initContainers: []\n      # containers to be run before the csi-node's container starts.\n      #\n      # Example:\n      #\n      # - name: wait\n      #   image: public.ecr.aws/amazonlinux/amazonlinux\n      #   command: [ 'sh', '-c', \"sleep 20\" ]\n      # Enable opentelemetry tracing for the plugin running on the daemonset\n      otelTracing: {}\n      #  otelServiceName: ebs-csi-node\n      #  otelExporterEndpoint: \"http://localhost:4317\"\n\n      # dnsConfig for the node pods\n      dnsConfig: {}\n    additionalDaemonSets:\n    # Additional node DaemonSets, using the node config structure\n    # See docs/additional-daemonsets.md for more information\n    #\n    # example:\n    #   nodeSelector:\n    #     node.kubernetes.io/instance-type: c5.large\n    #   volumeAttachLimit: 15\n\n    # Enable compatibility for the A1 instance family via use of an AL2-based image in a separate DaemonSet\n    # a1CompatibilityDaemonSet: true\n    # storageClasses: []\n    # Add StorageClass resources like:\n    # - name: ebs-sc\n    #   # annotation metadata\n    #   annotations:\n    #     storageclass.kubernetes.io/is-default-class: \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   # defaults to WaitForFirstConsumer\n    #   volumeBindingMode: WaitForFirstConsumer\n    #   # defaults to Delete\n    #   reclaimPolicy: Retain\n    #   parameters:\n    #     encrypted: \"true\"\n\n    defaultStorageClass:\n      enabled: false\n    volumeSnapshotClasses: []\n    # Add VolumeSnapshotClass resources like:\n    # - name: ebs-vsc\n    #   # annotation metadata\n    #   annotations:\n    #     snapshot.storage.kubernetes.io/is-default-class: \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   # deletionPolicy must be specified\n    #   deletionPolicy: Delete\n    #   parameters:\n\n    # Use old CSIDriver without an fsGroupPolicy set\n    # Intended for use with older clusters that cannot easily replace the CSIDriver object\n    # This parameter should always be false for new installations\n    useOldCSIDriver: false\n    # Deploy EBS CSI Driver without controller and associated resources\n    nodeComponentOnly: false\n    # nodeAllocatableUpdatePeriodSeconds updates the node's max attachable volume count by directing Kubelet to periodically call NodeGetInfo at the configured interval.\n    # Kubernetes enforces a minimum update interval of 10 seconds. A value of -1 uses a automatically determined value dependent on metadata sources.\n    # This parameter is supported in Kubernetes 1.33+ and requires the MutableCSINodeAllocatableCount feature gate to be enabled in kubelet and kube-apiserver.\n    nodeAllocatableUpdatePeriodSeconds: 10\n    # Set maximum verbosity for logs of each container and other recommended debugging parameters such as enabling AWS SDK debug logging\n    debugLogs: false",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.1",
          "tag": "1.3.1",
          "values": "# spectrocloud.com/enabled-presets: Backend:disable-api\npack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.2\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.2-proxy\n      - image: ghcr.io/spectrocloud/hello-universe-api:1.1.1\n      - image: ghcr.io/spectrocloud/hello-universe-db:1.1.0\n  spectrocloud.com/install-priority: \"0\"\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:invalid\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: 1",
          "registry": {
            "metadata": {
              "uid": "64eaff5630402973c4e1856a",
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "cost-analyzer",
          "type": "oci",
          "layer": "addon",
          "version": "1.103.3",
          "tag": "1.103.3",
          "values": "pack:\n  # The namespace (on the target cluster) in which the pack will be deployed.\n  # When the namespace is not found, a new namespace will be created with the name specified.\n  namespace: \"kubecost\"\n  content:\n    charts:\n      - repo: https://kubecost.github.io/cost-analyzer/\n        name: cost-analyzer\n        version: 1.103.3   \n    images:\n      - image: gcr.io/kubecost1/frontend:prod-1.103.3\n      - image: gcr.io/kubecost1/cost-model:prod-1.103.3\n      - image: quay.io/prometheus/prometheus:v2.35.0\n\ncharts:\n  cost-analyzer:  \n    global:\n      grafana:\n        enabled: false\n        proxy: false\n\n    nodeSelector: {}\n\n    tolerations: []\n    #  - key: \"key\"\n    #    operator: \"Equal|Exists\"\n    #    value: \"value\"\n    #    effect: \"NoSchedule|PreferNoSchedule|NoExecute(1.6 only)\"\n\n    affinity: {}\n\n    # If true, creates a PriorityClass to be used by the cost-analyzer pod\n    priority:\n      enabled: false\n      # value: 1000000\n\n    # If true, enable creation of NetworkPolicy resources.\n    networkPolicy:\n      enabled: false\n\n    podSecurityPolicy:\n      enabled: false\n\n    kubecostFrontend:\n      image: gcr.io/kubecost1/frontend\n      imagePullPolicy: Always\n      resources:\n        requests:\n          cpu: \"10m\"\n          memory: \"55Mi\"\n        #limits:\n        #  cpu: \"100m\"\n        #  memory: \"256Mi\"\n      \n    kubecostModel:\n      image: gcr.io/kubecost1/cost-model\n      imagePullPolicy: Always\n      warmCache: true\n      warmSavingsCache: true\n      etl: true\n      # The total number of days the ETL storage will build\n      etlStoreDurationDays: 120\n      maxQueryConcurrency: 5\n      # utcOffset represents a timezone in hours and minutes east (+) or west (-)\n      # of UTC, itself, which is defined as +00:00.\n      # See the tz database of timezones to look up your local UTC offset:\n      # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\n      utcOffset: \"+00:00\"\n      resources:\n        requests:\n          cpu: \"200m\"\n          memory: \"55Mi\"\n        #limits:\n        #  cpu: \"800m\"\n        #  memory: \"256Mi\"\n\n    serviceAccount:\n      create: true # Set this to false if you're bringing your own service account.\n      annotations: {}\n      # name: kc-test\n\n    # Define persistence volume for cost-analyzer\n    persistentVolume:\n      size: 32Gi\n      dbSize: 32.0Gi\n      enabled: true # Note that setting this to false means configurations will be wiped out on pod restart.\n      # storageClass: \"-\" #\n      # existingClaim: kubecost-cost-analyzer # a claim in the same namespace as kubecost\n\n    ingress:\n      enabled: false\n      # className: nginx\n      annotations:\n        kubernetes.io/ingress.class: nginx\n        # kubernetes.io/tls-acme: \"true\"\n      paths: [\"/\"] # There's no need to route specifically to the pods-- we have an nginx deployed that handles routing\n      hosts:\n        - cost-analyzer.local\n      tls: []\n      #  - secretName: cost-analyzer-tls\n      #    hosts:\n      #      - cost-analyzer.local\n\n    service:\n      type: ClusterIP\n      port: 8080\n      targetPort: 8080\n      # nodePort:\n      labels: {}\n      annotations: {}\n\n    prometheus:\n      server:\n        # If clusterIDConfigmap is defined, instead use user-generated configmap with key CLUSTER_ID\n        # to use as unique cluster ID in kubecost cost-analyzer deployment.\n        # This overrides the cluster_id set in prometheus.server.global.external_labels.\n        # NOTE: This does not affect the external_labels set in prometheus config.\n        # clusterIDConfigmap: cluster-id-configmap\n        resources: {}\n        # limits:\n        #   cpu: 500m\n        #   memory: 512Mi\n        # requests:\n        #   cpu: 500m\n        #   memory: 512Mi\n        global:\n          scrape_interval: 1m\n          scrape_timeout: 10s\n          evaluation_interval: 1m\n          external_labels:\n            cluster_id: cluster-one # Each cluster should have a unique ID\n        persistentVolume:\n          size: 32Gi\n          enabled: true\n        extraArgs:\n          query.max-concurrency: 1\n          query.max-samples: 100000000\n        tolerations: []\n        #  - key: \"key\"\n        #    operator: \"Equal|Exists\"\n        #    value: \"value\"\n        #    effect: \"NoSchedule|PreferNoSchedule|NoExecute(1.6 only)\"\n\n      configmapReload:\n        prometheus:\n          ## If false, the configmap-reload container will not be deployed\n          ##\n          enabled: false\n\n          ## configmap-reload container name\n          ##\n          name: configmap-reload\n          ## configmap-reload container image\n          ##\n          ## Additional configmap-reload container arguments\n          ##\n          extraArgs: {}\n          ## Additional configmap-reload volume directories\n          ##\n          extraVolumeDirs: []\n          ## Additional configmap-reload mounts\n          ##\n          extraConfigmapMounts: []\n            # - name: prometheus-alerts\n            #   mountPath: /etc/alerts.d\n            #   subPath: \"\"\n            #   configMap: prometheus-alerts\n            #   readOnly: true\n          ## configmap-reload resource requests and limits\n          ## Ref: http://kubernetes.io/docs/user-guide/compute-resources/\n          ##\n          resources: {}\n        \n      kube-state-metrics:\n        disabled: false\n      nodeExporter:\n        enabled: false",
          "registry": {
            "metadata": {
              "uid": "64eaff5630402973c4e1856a",
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        }
      ]
    },
    "variables": []
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```json
{
  "metadata": {
    "name": "get-started-palette-mcp-azure",
    "description": "Cluster profile for Get Started with Palette MCP tutorial.",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "azure",
      "packs": [
        {
          "name": "ubuntu-azure",
          "type": "oci",
          "layer": "os",
          "version": "24.04",
          "tag": "24.04",
          "values": "# Spectro Golden images includes most of the hardening as per CIS Ubuntu Linux 24.04 LTS Server L1 v1.0.0 standards\n# Uncomment below section to\n# 1. Include custom files to be copied over to the nodes and/or\n# 2. Execute list of commands before or after kubeadm init/join is executed\n#\n#kubeadmconfig:\n#  preKubeadmCommands:\n#  - echo \"Executing pre kube admin config commands\"\n#  - update-ca-certificates\n#  - 'systemctl restart containerd; sleep 3'\n#  - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo \"Waiting for containerd...\"; sleep 1; done'\n#  postKubeadmCommands:\n#  - echo \"Executing post kube admin config commands\"\n#  files:\n#  - targetPath: /usr/local/share/ca-certificates/mycom.crt\n#    targetOwner: \"root:root\"\n#    targetPermissions: \"0644\"\n#    content: |\n#      -----BEGIN CERTIFICATE-----\n#      MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n#      cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE\n#      AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA\n#      nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz\n#      qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN\n#      fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2\n#      7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL\n#      9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK\n#      jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB\n#      /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki\n#      HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y\n#      g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ\n#      ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6\n#      b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56\n#      IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=\n#      -----END CERTIFICATE-----",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "kubernetes",
          "type": "oci",
          "layer": "k8s",
          "version": "1.33.9",
          "tag": "1.33.x",
          "values": "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube Scheduler:loopback-scheduler,Azure Disk Encryption Set:disable-azure-disk-encryption\npack:\n  content:\n    images:\n      - image: registry.k8s.io/coredns/coredns:v1.12.0\n      - image: registry.k8s.io/etcd:3.5.24-0\n      - image: registry.k8s.io/kube-apiserver:v1.33.9\n      - image: registry.k8s.io/kube-controller-manager:v1.33.9\n      - image: registry.k8s.io/kube-proxy:v1.33.9\n      - image: registry.k8s.io/kube-scheduler:v1.33.9\n      - image: registry.k8s.io/pause:3.9\n      - image: registry.k8s.io/pause:3.8\n      - image: registry.k8s.io/pause:3.10\n  #CIDR Range for Pods in cluster\n  # Note : This must not overlap with any of the host or service network\n  podCIDR: \"192.168.0.0/16\"\n  #CIDR notation IP range from which to assign service cluster IPs\n  # Note : This must not overlap with any IP ranges assigned to nodes for pods.\n  serviceClusterIpRange: \"10.96.0.0/12\"\n  # serviceDomain: \"cluster.local\"\n\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note : secure-port flag is used during kubeadm init. Do not change this flag on a running cluster\n      secure-port: \"6443\"\n      anonymous-auth: \"true\"\n      profiling: \"false\"\n      disable-admission-plugins: \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds: \"60\"\n      default-unreachable-toleration-seconds: \"60\"\n      enable-admission-plugins: \"AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity\"\n      admission-control-config-file: \"/etc/kubernetes/pod-security-standard.yaml\"\n      audit-log-path: /var/log/apiserver/audit.log\n      audit-policy-file: /etc/kubernetes/audit-policy.yaml\n      audit-log-maxage: \"30\"\n      audit-log-maxbackup: \"10\"\n      audit-log-maxsize: \"100\"\n      authorization-mode: RBAC,Node\n      kubelet-certificate-authority: \"/etc/kubernetes/pki/ca.crt\"\n      tls-cipher-suites: \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384\"\n    extraVolumes:\n      - name: audit-log\n        hostPath: /var/log/apiserver\n        mountPath: /var/log/apiserver\n        pathType: DirectoryOrCreate\n      - name: audit-policy\n        hostPath: /etc/kubernetes/audit-policy.yaml\n        mountPath: /etc/kubernetes/audit-policy.yaml\n        readOnly: true\n        pathType: File\n      - name: pod-security-standard\n        hostPath: /etc/kubernetes/pod-security-standard.yaml\n        mountPath: /etc/kubernetes/pod-security-standard.yaml\n        readOnly: true\n        pathType: File\n  controllerManager:\n    extraArgs:\n      profiling: \"false\"\n      terminated-pod-gc-threshold: \"25\"\n      use-service-account-credentials: \"true\"\n      feature-gates: \"RotateKubeletServerCertificate=true\"\n  scheduler:\n    extraArgs:\n      profiling: \"false\"\n  kubeletExtraArgs:\n    read-only-port: \"0\"\n    event-qps: \"0\"\n    feature-gates: \"RotateKubeletServerCertificate=true\"\n    protect-kernel-defaults: \"true\"\n    rotate-server-certificates: \"true\"\n    tls-cipher-suites: \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384\"\n  files:\n    - path: hardening/audit-policy.yaml\n      targetPath: /etc/kubernetes/audit-policy.yaml\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n    - path: hardening/90-kubelet.conf\n      targetPath: /etc/sysctl.d/90-kubelet.conf\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n    - targetPath: /etc/kubernetes/pod-security-standard.yaml\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n      content: |\n        apiVersion: apiserver.config.k8s.io/v1\n        kind: AdmissionConfiguration\n        plugins:\n        - name: PodSecurity\n          configuration:\n            apiVersion: pod-security.admission.config.k8s.io/v1\n            kind: PodSecurityConfiguration\n            defaults:\n              enforce: \"baseline\"\n              enforce-version: \"v1.33\"\n              audit: \"baseline\"\n              audit-version: \"v1.33\"\n              warn: \"restricted\"\n              warn-version: \"v1.33\"\n            exemptions:\n              # Array of authenticated usernames to exempt.\n              usernames: []\n              # Array of runtime class names to exempt.\n              runtimeClasses: []\n              # Array of namespaces to exempt.\n              namespaces: [kube-system]\n\n  preKubeadmCommands:\n    # For enabling 'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required\n    - 'echo \"====> Applying kernel parameters for Kubelet\"'\n    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'\n    - 'test -f /etc/containerd/ca.crt && cp /etc/containerd/ca.crt /usr/local/share/ca-certificates/container.crt && update-ca-certificates && systemctl restart containerd'\n  \n  postKubeadmCommands:\n    - 'chmod 600 /var/lib/kubelet/config.yaml'\n    # - 'echo \"List of post kubeadm commands to be executed\"'\n\n# Client configuration to add OIDC based authentication flags in kubeconfig\n#clientConfig:\n  #oidc-issuer-url: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}\"\n  #oidc-client-id: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}\"\n  #oidc-client-secret: \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-secret }}\"\n  #oidc-extra-scope: profile,email",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "cni-calico-azure",
          "type": "oci",
          "layer": "cni",
          "version": "3.31.4",
          "tag": "3.31.4",
          "values": "pack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/cni:v3.31.4\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/node:v3.31.4\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.31.4/kube-controllers:v3.31.4\n\nmanifests:\n  calico:\n    images:\n      cni: \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type to use. Supported types are calico-ipam, host-local\n    ipamType: \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4: true\n      assign_ipv6: false\n\n    # Should be one of CALICO_IPV4POOL_IPIP or CALICO_IPV4POOL_VXLAN  \n    encapsulationType: \"CALICO_IPV4POOL_VXLAN\"\n\n    # Should be one of Always, CrossSubnet, Never\n    encapsulationMode: \"Always\"\n\n    env:\n      # Additional env variables for calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT: \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR: \"192.168.0.0/16\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env variables for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL: \"info\"\n        #SYNC_NODE_LABELS: \"true\"",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "csi-azure",
          "type": "oci",
          "layer": "csi",
          "version": "1.34.2",
          "tag": "1.34.2",
          "values": "pack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/azuredisk-csi:v1.34.2\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/csi-provisioner:v6.1.1\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/csi-attacher:v4.11.0\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/csi-resizer:v2.1.0\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/livenessprobe:v2.18.0\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/csi-node-driver-registrar:v2.16.0\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/csi-snapshotter:v8.5.0\n      - image: us-docker.pkg.dev/palette-images/packs/csi-azure/1.34.2/snapshot-controller:v8.5.0\n    charts:\n      - repo: https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts\n        name: azuredisk-csi-driver\n        version: 1.34.2\n  namespace: \"kube-system\"\ncharts:\n  azuredisk-csi-driver:\n    image:\n      baseRepo: us-docker.pkg.dev\n      azuredisk:\n        repository: /palette-images/packs/csi-azure/1.34.2/azuredisk-csi\n        tag: v1.34.2\n        pullPolicy: IfNotPresent\n      csiProvisioner:\n        repository: /palette-images/packs/csi-azure/1.34.2/csi-provisioner\n        tag: v6.1.1\n        pullPolicy: IfNotPresent\n      csiAttacher:\n        repository: /palette-images/packs/csi-azure/1.34.2/csi-attacher\n        tag: v4.11.0\n        pullPolicy: IfNotPresent\n      csiResizer:\n        repository: /palette-images/packs/csi-azure/1.34.2/csi-resizer\n        tag: v2.1.0\n        pullPolicy: IfNotPresent\n      livenessProbe:\n        repository: /palette-images/packs/csi-azure/1.34.2/livenessprobe\n        tag: v2.18.0\n        pullPolicy: IfNotPresent\n      nodeDriverRegistrar:\n        repository: /palette-images/packs/csi-azure/1.34.2/csi-node-driver-registrar\n        tag: v2.16.0\n        pullPolicy: IfNotPresent\n    serviceAccount:\n      create: true # When true, service accounts will be created for you. Set to false if you want to use your own.\n      controller: csi-azuredisk-controller-sa # Name of Service Account to be created or used\n      node: csi-azuredisk-node-sa # Name of Service Account to be created or used\n      snapshotController: csi-snapshot-controller-sa # Name of Service Account to be created or used\n    rbac:\n      create: true\n      name: azuredisk\n    controller:\n      name: csi-azuredisk-controller\n      cloudConfigSecretName: azure-cloud-provider\n      cloudConfigSecretNamespace: kube-system\n      # featureGates allows you to enable or disable specific kubernetes features for different CSI components.\n      # Enabling or disabling certain features may affect the behavior or capabilities of the driver.\n      # # Example valid values:\n      # featureGates:\n      #   csiProvisioner: \n      #     - Topology=true                # Enables topology-aware volume provisioning\n      #     - HonorPVReclaimPolicy=true    # Honors the reclaim policy set on PersistentVolumes\n      #     - VolumeAttributesClass=true   # Enables support for VolumeAttributesClass\n      #   csiResizer:\n      #     - RecoverVolumeExpansionFailure=true  # Enables recovery from volume expansion failures\n      #     - VolumeAttributesClass=true          # Enables support for VolumeAttributesClass\n      featureGates:\n        csiProvisioner:\n          - Topology=true\n          - HonorPVReclaimPolicy=true\n          - VolumeAttributesClass=true\n        csiResizer:\n          - RecoverVolumeExpansionFailure=true\n          - VolumeAttributesClass=true\n      VMSSDetachTimeoutInSeconds: 20\n      allowEmptyCloudConfig: false\n      enableTrafficManager: false\n      trafficManagerPort: 7788\n      replicas: 2\n      metricsPort: 29604\n      livenessProbe:\n        healthPort: 29602\n      runOnMaster: false\n      runOnControlPlane: false\n      disableAvailabilitySetNodes: false\n      vmType: \"\"\n      provisionerWorkerThreads: 100\n      attacherWorkerThreads: 1000\n      vmssCacheTTLInSeconds: -1\n      logLevel: 5\n      extraArgs: []\n      otelTracing:\n        enabled: false\n        otelServiceName: csi-azuredisk-controller\n        otelExporterEndpoint: \"http://localhost:4317\"\n      tolerations:\n        - key: \"node-role.kubernetes.io/master\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n        - key: \"node-role.kubernetes.io/controlplane\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n        - key: \"node-role.kubernetes.io/control-plane\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n        - key: \"CriticalAddonsOnly\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n      hostNetwork: true # this setting could be disabled if controller does not depend on MSI setting\n      labels: {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations: {}\n      nodeSelector: {}\n      affinity: {}\n      resources:\n        csiProvisioner:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        csiAttacher:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        csiResizer:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        csiSnapshotter:\n          limits:\n            memory: 400Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        livenessProbe:\n          limits:\n            memory: 100Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        azuredisk:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n    node:\n      cloudConfigSecretName: azure-cloud-provider\n      cloudConfigSecretNamespace: kube-system\n      # reserved data disk slot number per node, driver.volumeAttachLimit must be < 0\n      reservedDataDiskSlotNum: 0\n      supportZone: true\n      allowEmptyCloudConfig: true\n      getNodeIDFromIMDS: false\n      removeNotReadyTaint: true\n      maxUnavailable: 1\n      logLevel: 5\n      metricsPort: 29605\n      livenessProbe:\n        healthPort: 29603\n    snapshot:\n      enabled: false\n      name: csi-snapshot-controller\n      image:\n        csiSnapshotter:\n          repository: /palette-images/packs/csi-azure/1.34.2/csi-snapshotter\n          tag: v8.5.0\n          pullPolicy: IfNotPresent\n        csiSnapshotController:\n          repository: /palette-images/packs/csi-azure/1.34.2/snapshot-controller\n          tag: v8.5.0\n          pullPolicy: IfNotPresent\n      snapshotController:\n        name: csi-snapshot-controller\n        replicas: 2\n        labels: {}\n        annotations: {}\n        podLabels: {}\n        podAnnotations: {}\n        resources:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n      VolumeSnapshotClass:\n        enabled: false\n        name: csi-azuredisk-vsc\n        deletionPolicy: Delete\n        parameters:\n          incremental: '\"true\"' # available values: \"true\", \"false\" (\"true\" by default for Azure Public Cloud, and \"false\" by default for Azure Stack Cloud)\n          resourceGroup: \"\" # available values: EXISTING RESOURCE GROUP (If not specified, snapshot will be stored in the same resource group as source Azure disk)\n          tags: \"\" # tag format: 'key1=val1,key2=val2'\n        additionalLabels: {}\n    feature:\n      enableFSGroupPolicy: true\n    driver:\n      name: disk.csi.azure.com\n      # maximum number of attachable volumes per node,\n      # maximum number is defined according to node instance type by default(-1)\n      volumeAttachLimit: -1\n      customUserAgent: \"\"\n      userAgentSuffix: \"OSS-helm\"\n      azureGoSDKLogLevel: \"\" # available values: \"\"(no logs), DEBUG, INFO, WARNING, ERROR\n      httpsProxy: \"\"\n      httpProxy: \"\"\n      noProxy: \"\"\n    linux:\n      enabled: true\n      dsName: csi-azuredisk-node # daemonset name\n      kubelet: /var/lib/kubelet\n      distro: debian # available values: debian, fedora\n      enablePerfOptimization: true\n      otelTracing:\n        enabled: false\n        otelServiceName: csi-azuredisk-node\n        otelExporterEndpoint: \"http://localhost:4317\"\n      tolerations:\n        - operator: \"Exists\"\n      hostNetwork: true # this setting could be disabled if perfProfile is `none`\n      getNodeInfoFromLabels: false # get node info from node labels instead of IMDS\n      labels: {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations: {}\n      nodeSelector: {}\n      affinity: {}\n      nodeAffinity:\n        requiredDuringSchedulingIgnoredDuringExecution:\n          nodeSelectorTerms:\n            - matchExpressions:\n                - key: type\n                  operator: NotIn\n                  values:\n                    - virtual-kubelet\n      resources:\n        livenessProbe:\n          limits:\n            memory: 100Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        nodeDriverRegistrar:\n          limits:\n            memory: 100Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n        azuredisk:\n          limits:\n            memory: 1000Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n    windows:\n      enabled: true\n      useHostProcessContainers: true\n      dsName: csi-azuredisk-node-win # daemonset name\n      kubelet: 'C:\\var\\lib\\kubelet'\n      getNodeInfoFromLabels: false # get node info from node labels instead of IMDS\n      enableRegistrationProbe: true\n      otelTracing:\n        enabled: false\n        otelServiceName: csi-azuredisk-node-win\n        otelExporterEndpoint: \"http://localhost:4317\"\n      tolerations:\n        - key: \"node.kubernetes.io/os\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n      labels: {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations: {}\n      nodeSelector: {}\n      affinity: {}\n      nodeAffinity:\n        requiredDuringSchedulingIgnoredDuringExecution:\n          nodeSelectorTerms:\n            - matchExpressions:\n                - key: type\n                  operator: NotIn\n                  values:\n                    - virtual-kubelet\n      resources:\n        livenessProbe:\n          limits:\n            memory: 150Mi\n          requests:\n            cpu: 10m\n            memory: 40Mi\n        nodeDriverRegistrar:\n          limits:\n            memory: 150Mi\n          requests:\n            cpu: 30m\n            memory: 40Mi\n        azuredisk:\n          limits:\n            memory: 1000Mi\n          requests:\n            cpu: 10m\n            memory: 40Mi\n    cloud: AzurePublicCloud\n    ## Reference to one or more secrets to be used when pulling images\n    ## ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/\n    ##\n    imagePullSecrets: []\n    # - name: \"image-pull-secret\"\n\n    workloadIdentity:\n      clientID: \"\"\n      # [optional] If the AAD application or user-assigned managed identity is not in the same tenant as the cluster\n      # then set tenantID with the application or user-assigned managed identity tenant ID\n      tenantID: \"\"\n    azureCredentialFileConfigMap: azure-cred-file\n    storageclass:\n      # Azure storage account Sku tier. Default is empty\n      storageaccounttype: \"StandardSSD_LRS\"\n      # Possible values are shared (default), dedicated, and managed\n      kind: \"managed\"\n      #Allowed reclaim policies are Delete, Retain\n      reclaimPolicy: \"Delete\"\n      #Toggle for Volume expansion\n      allowVolumeExpansion: \"true\"\n      #Toggle for Default class\n      isDefaultClass: \"true\"\n      #Supported binding modes are Immediate, WaitForFirstConsumer\n\n      #Setting binding mode to WaitForFirstConsumer, so that the volumes gets created in the same AZ as that of the pods\n      volumeBindingMode: \"WaitForFirstConsumer\"",
          "registry": {
            "metadata": {
              "uid": "64eaff453040297344bcad5d",
              "name": "Palette Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.1",
          "tag": "1.3.1",
          "values": "# spectrocloud.com/enabled-presets: Backend:disable-api\npack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.2\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.2-proxy\n      - image: ghcr.io/spectrocloud/hello-universe-api:1.1.1\n      - image: ghcr.io/spectrocloud/hello-universe-db:1.1.0\n  spectrocloud.com/install-priority: \"0\"\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:invalid\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: 1",
          "registry": {
            "metadata": {
              "uid": "64eaff5630402973c4e1856a",
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        },
        {
          "name": "cost-analyzer",
          "type": "oci",
          "layer": "addon",
          "version": "1.103.3",
          "tag": "1.103.3",
          "values": "pack:\n  # The namespace (on the target cluster) in which the pack will be deployed.\n  # When the namespace is not found, a new namespace will be created with the name specified.\n  namespace: \"kubecost\"\n  content:\n    charts:\n      - repo: https://kubecost.github.io/cost-analyzer/\n        name: cost-analyzer\n        version: 1.103.3   \n    images:\n      - image: gcr.io/kubecost1/frontend:prod-1.103.3\n      - image: gcr.io/kubecost1/cost-model:prod-1.103.3\n      - image: quay.io/prometheus/prometheus:v2.35.0\n\ncharts:\n  cost-analyzer:  \n    global:\n      grafana:\n        enabled: false\n        proxy: false\n\n    nodeSelector: {}\n\n    tolerations: []\n    #  - key: \"key\"\n    #    operator: \"Equal|Exists\"\n    #    value: \"value\"\n    #    effect: \"NoSchedule|PreferNoSchedule|NoExecute(1.6 only)\"\n\n    affinity: {}\n\n    # If true, creates a PriorityClass to be used by the cost-analyzer pod\n    priority:\n      enabled: false\n      # value: 1000000\n\n    # If true, enable creation of NetworkPolicy resources.\n    networkPolicy:\n      enabled: false\n\n    podSecurityPolicy:\n      enabled: false\n\n    kubecostFrontend:\n      image: gcr.io/kubecost1/frontend\n      imagePullPolicy: Always\n      resources:\n        requests:\n          cpu: \"10m\"\n          memory: \"55Mi\"\n        #limits:\n        #  cpu: \"100m\"\n        #  memory: \"256Mi\"\n      \n    kubecostModel:\n      image: gcr.io/kubecost1/cost-model\n      imagePullPolicy: Always\n      warmCache: true\n      warmSavingsCache: true\n      etl: true\n      # The total number of days the ETL storage will build\n      etlStoreDurationDays: 120\n      maxQueryConcurrency: 5\n      # utcOffset represents a timezone in hours and minutes east (+) or west (-)\n      # of UTC, itself, which is defined as +00:00.\n      # See the tz database of timezones to look up your local UTC offset:\n      # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\n      utcOffset: \"+00:00\"\n      resources:\n        requests:\n          cpu: \"200m\"\n          memory: \"55Mi\"\n        #limits:\n        #  cpu: \"800m\"\n        #  memory: \"256Mi\"\n\n    serviceAccount:\n      create: true # Set this to false if you're bringing your own service account.\n      annotations: {}\n      # name: kc-test\n\n    # Define persistence volume for cost-analyzer\n    persistentVolume:\n      size: 32Gi\n      dbSize: 32.0Gi\n      enabled: true # Note that setting this to false means configurations will be wiped out on pod restart.\n      # storageClass: \"-\" #\n      # existingClaim: kubecost-cost-analyzer # a claim in the same namespace as kubecost\n\n    ingress:\n      enabled: false\n      # className: nginx\n      annotations:\n        kubernetes.io/ingress.class: nginx\n        # kubernetes.io/tls-acme: \"true\"\n      paths: [\"/\"] # There's no need to route specifically to the pods-- we have an nginx deployed that handles routing\n      hosts:\n        - cost-analyzer.local\n      tls: []\n      #  - secretName: cost-analyzer-tls\n      #    hosts:\n      #      - cost-analyzer.local\n\n    service:\n      type: ClusterIP\n      port: 8080\n      targetPort: 8080\n      # nodePort:\n      labels: {}\n      annotations: {}\n\n    prometheus:\n      server:\n        # If clusterIDConfigmap is defined, instead use user-generated configmap with key CLUSTER_ID\n        # to use as unique cluster ID in kubecost cost-analyzer deployment.\n        # This overrides the cluster_id set in prometheus.server.global.external_labels.\n        # NOTE: This does not affect the external_labels set in prometheus config.\n        # clusterIDConfigmap: cluster-id-configmap\n        resources: {}\n        # limits:\n        #   cpu: 500m\n        #   memory: 512Mi\n        # requests:\n        #   cpu: 500m\n        #   memory: 512Mi\n        global:\n          scrape_interval: 1m\n          scrape_timeout: 10s\n          evaluation_interval: 1m\n          external_labels:\n            cluster_id: cluster-one # Each cluster should have a unique ID\n        persistentVolume:\n          size: 32Gi\n          enabled: true\n        extraArgs:\n          query.max-concurrency: 1\n          query.max-samples: 100000000\n        tolerations: []\n        #  - key: \"key\"\n        #    operator: \"Equal|Exists\"\n        #    value: \"value\"\n        #    effect: \"NoSchedule|PreferNoSchedule|NoExecute(1.6 only)\"\n\n      configmapReload:\n        prometheus:\n          ## If false, the configmap-reload container will not be deployed\n          ##\n          enabled: false\n\n          ## configmap-reload container name\n          ##\n          name: configmap-reload\n          ## configmap-reload container image\n          ##\n          ## Additional configmap-reload container arguments\n          ##\n          extraArgs: {}\n          ## Additional configmap-reload volume directories\n          ##\n          extraVolumeDirs: []\n          ## Additional configmap-reload mounts\n          ##\n          extraConfigmapMounts: []\n            # - name: prometheus-alerts\n            #   mountPath: /etc/alerts.d\n            #   subPath: \"\"\n            #   configMap: prometheus-alerts\n            #   readOnly: true\n          ## configmap-reload resource requests and limits\n          ## Ref: http://kubernetes.io/docs/user-guide/compute-resources/\n          ##\n          resources: {}\n        \n      kube-state-metrics:\n        disabled: false\n      nodeExporter:\n        enabled: false",
          "registry": {
            "metadata": {
              "uid": "64eaff5630402973c4e1856a",
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack",
              "isSyncSupported": true
            }
          }
        }
      ]
    },
    "variables": []
  }
}
```

</TabItem>

</Tabs>

Click **Validate**. Palette displays a _Validated successfully_ message. Click **Confirm**. The cluster profile is
created.

## Deploy a Cluster

Next, you will deploy a cluster using the imported cluster profile. From the left main menu, select **Profiles**. Then,
select the row for the tutorial profile. The details page appears. Then, select **Deploy**. Select **OK** in the
**Create a new cluster?** dialog.

Fill in the required cluster information and configuration deploy cluster wizard. Refer to the
[Deploy a Cluster to Amazon Web Services (AWS)](../../getting-started/palette/aws/aws.md) or
[Deploy a Cluster to Microsoft Azure](../../getting-started/palette/azure/azure.md) sections for more information on
cluster creation.

Navigate to the left **Main Menu** and select **Clusters**. The cluster deployment process can take 15 to 30 minutes.
Deployment time varies depending on the cloud provider, cluster profile, cluster size, and node pool configurations
provided.

![Deployed cluster](/tutorials/ai/get-started-palette-mcp_deployed-cluster.webp)

Palette indicates that the cluster is deployed successfully, but the Hello Universe add-on is unable to deploy
succesfully.

## Debug the Cluster

The cluster you have deployed does not succesfully deploy the Hello Universe add-on application. In this section, uou
will use the Palette MCP server investigate and debug these errors.

Open your MCP client.

Send a query asking to download the [kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file for one of
your running clusters. For example, you can ask "Download the kubeconfig file for the `<cluster-name>` Palette cluster."
Replace the placeholder with your cluster name.

```shell title="Example Output"
❯ Download the kubeconfig file for the `get-started-palette-mcp-cluster` Palette cluster.

⏺ I'll first find the cluster UID by listing clusters, then download the kubeconfig.

  Called palette (ctrl+o to expand)

⏺ Found the cluster. Now let me load and call the getKubeconfig tool.

  Called palette (ctrl+o to expand)

⏺ The kubeconfig for get-started-palette-mcp-cluster has been downloaded successfully.

  As noted in the CLAUDE.md instructions, the file was written inside the MCP container at /tmp/kubeconfig/69df9741978d9f786aacf13a.kubeconfig, which is synced to
  your host machine at $HOME/.palette/kubeconfig.

  To use it with kubectl:

  export KUBECONFIG="$HOME/.palette/kubeconfig"
  kubectl get nodes

  Or per-command:

  kubectl --kubeconfig="$HOME/.palette/kubeconfig" get pods -A
```

Investigate if there any failing pods or deployments on your cluster. For example, you can ask "Run kubectl to connect
to the `<cluster-name>` Palette cluster and list any failing pods or deployments." Replace the placeholder with your
cluster name.

```shell title="Example Output"
❯ Run kubectl to connect to the `get-started-palette-mcp-cluster` Palette  cluster and list any failing pods or deployments.

⏺ The kubeconfig path is a directory. Let me find the actual file.
  Listed 1 directory (ctrl+o to expand)

⏺ Bash(KUBECONFIG="$HOME/.palette/kubeconfig/69df9741978d9f786aacf13a.kubeconfig" kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded 2>…)

  ⎿  NAMESPACE        NAME                                         READY   STATUS             RESTARTS   AGE
     hello-universe   hello-universe-deployment-84ff79b6cc-42ggl   0/1     ImagePullBackOff   0          19m

⏺ Bash(KUBECONFIG="$HOME/.palette/kubeconfig/69df9741978d9f786aacf13a.kubeconfig" kubectl describe pod -n hello-universe hello-universe-deployment-84ff79b6cc-42ggl 2>&…)
  ⎿      Environment:  <none>
         Mounts: /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-84hpm (ro)
     … +29 lines (ctrl+o to expand)

⏺ Here's a summary of what's failing:

  Failing Pod
  - Namespace: hello-universe
  - Pod: hello-universe-deployment-84ff79b6cc-42ggl
  - Status: ImagePullBackOff

  Root Cause
  The pod is trying to pull a container image with an invalid tag:
  ghcr.io/spectrocloud/hello-universe:invalid
  The tag invalid does not exist in the registry, so Kubernetes can't pull it and the pod never starts.

  Affected Deployment

  - hello-universe/hello-universe-deployment — 0/1 ready (0 available replicas)

  All other deployments across the cluster are healthy (READY matches desired count). The only issue is the bad image tag in the hello-universe deployment.
```

The Palette MCP server idenfities that the cluster profile provides an invalid image tag for the Hello Universe
deployment.

Navigate back to your [Palette](https://console.spectrocloud.com) tab in the browser. From the left main menu, select
**Profiles**. Then, select the row for the tutorial profile.

Select the **Hello Universe** pack layer. View the configuration of the pack values.

The `hello-universe` pack sets the image tag used for deploying the
[`hello-universe` application](https://github.com/spectrocloud/hello-universe) in the
`manifests.hello-universe.images.hellouniverse` field of the `hello-universe` add-on pack. The configured image tag does
not exist.

```yaml {4}
manifests:
  hello-universe:
    images:
      hellouniverse: ghcr.io/spectrocloud/hello-universe:invalid
    apiEnabled: false
    namespace: hello-universe
    port: 8080
    replicas: 1
```

Change the `manifests.hello-universe.images.hellouniverse` field to the valid
`ghcr.io/spectrocloud/hello-universe:1.3.1` tag.

```yaml {4}
manifests:
  hello-universe:
    images:
      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.1
    apiEnabled: false
    namespace: hello-universe
    port: 8080
    replicas: 1
```

Select **Confirm Updates** and then **Save Changes**.

From the left main menu, select **Clusters**. Then, select the row for the tutorial cluster.

The cluster has a pending update for for the fixed cluster profile. Select **Updates** to apply the cluster profile
update. Review the changes and select **Apply Changes**.

Wait for Palette to reconcile and apply the changes. All layers of the cluster are now successfully deployed.

![Healthy cluster](/tutorials/ai/get-started-palette-mcp_deployed-cluster-healthy.webp)

## Cleanup

## Wrap-up
