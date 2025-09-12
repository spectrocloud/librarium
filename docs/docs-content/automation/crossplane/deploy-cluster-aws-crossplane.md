---
sidebar_label: "Deploy an AWS IaaS Cluster with Crossplane"
title: "Deploy an AWS IaaS Cluster with Crossplane"
description: "Learn how to deploy an AWS IaaS cluster using the Spectro Cloud Crossplane provider."
hide_table_of_contents: false
sidebar_position: 20
toc_max_heading_level: 4
tags: ["crossplane", "aws", "iac", "infrastructure as code"]
---

Palette supports using [Crossplane](https://www.crossplane.io) to create and manage Kubernetes
[host clusters](../../glossary-all.md#host-cluster) across major infrastructure providers. This section guides you on
how to use Crossplane to deploy a Palette-managed Kubernetes cluster in AWS.

## Prerequisites

- A [Palette](https://www.spectrocloud.com/get-started) account and API key. Refer to the
  [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page for instructions on creating an
  API key.
- A public [AWS](https://repost.aws/knowledge-center/create-and-activate-aws-account) cloud account with the required
  [IAM Policies](../../clusters/public-cloud/aws/required-iam-policies.md).
- An SSH key pair available in the region where you want to deploy the cluster. Check out the AWS
  [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) page for
  guidance.
- The AWS account must be registered in Palette. Follow the
  [Add an AWS Account to Palette](../../clusters/public-cloud/aws/add-aws-accounts.md) guide to register your account in
  Palette.
- A Kubernetes cluster with at least 2 GB of RAM. This guide uses a [kind](https://kind.sigs.k8s.io) cluster as an
  example. Refer to the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) guide to learn how to
  install kind and create a cluster.
- The following software must be installed on your host:
  - [curl](https://curl.se/docs/install.html)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Helm](https://helm.sh/docs/intro/install/) version v3.2.0 or later
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - A text editor such as Vi or [Nano](https://www.nano-editor.org). This guide uses Vi as an example.

## Deploy an AWS IaaS Cluster with Crossplane

<PartialsComponent category="crossplane" name="install-crossplane" />

4.  Once Crossplane is installed, create a folder to store the Kubernetes configuration files.

    ```bash
    mkdir crossplane-aws
    ```

5.  <PartialsComponent category="crossplane" name="palette-crossplane-provider-version" />

6.  Create the following Kubernetes configuration for the Palette Crossplane provider.

    ```bash
    cat << EOF > crossplane-aws/provider-palette.yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: xpkg.upbound.io/crossplane-contrib/provider-palette:$PALETTE_CROSSPLANE_PROVIDER_VERSION
    EOF
    ```

    Verify that the file was created and populated with the expected Palette Crossplane provider version.

    ```bash
    cat crossplane-aws/provider-palette.yaml
    ```

    <PartialsComponent category="crossplane" name="provider-palette-yaml" />

7.  Issue the command below to install the Palette Crossplane provider. Crossplane installs the Custom Resource
    Definitions (CRDs) that allow you to create Palette resources directly inside Kubernetes.

    ```bash
    kubectl apply --filename crossplane-aws/provider-palette.yaml
    ```

    <PartialsComponent category="crossplane" name="provider-palette-created" />

8.  <PartialsComponent category="crossplane" name="palette-environment-variables" />

9.  Create a file to store the Kubernetes Secret containing your Palette API key and environment details. The Palette
    provider requires credentials to create and manage resources.

    ```bash
    cat << EOF > crossplane-aws/secret-aws.yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: palette-creds
      namespace: crossplane-system
    type: Opaque
    stringData:
      credentials: |
        {
        "api_key": "$PALETTE_API_KEY",
        "project_name": "$PALETTE_PROJECT_NAME",
        "host": "$PALETTE_HOST",
        "ignore_insecure_tls_error": "true",
        "retry_attempts": "1",
        "trace": "true"
        }
    EOF
    ```

    Verify that the file was created and populated with the expected API key and environment values.

    ```bash
    cat crossplane-aws/secret-aws.yaml
    ```

    <PartialsComponent category="crossplane" name="secret-cloud-yaml" />

10. Create the Kubernetes Secret.

    ```bash
    kubectl apply --filename crossplane-aws/secret-aws.yaml
    ```

    ```bash hideClipboard title="Example output"
    secret/palette-creds created
    ```

11. Create a file to store the `ProviderConfig` object. This object configures the Palette Crossplane provider with the
    Secret containing the Palette API key.

    ```bash
    cat << EOF > crossplane-aws/providerconfig-aws.yaml
    apiVersion: palette.crossplane.io/v1beta1
    kind: ProviderConfig
    metadata:
      name: provider-palette
      namespace: crossplane-system
    spec:
      credentials:
        source: Secret
        secretRef:
          name: palette-creds
          namespace: crossplane-system
          key: credentials
    EOF
    ```

12. Create the Kubernetes `ProviderConfig` object.

    ```bash
    kubectl apply --filename crossplane-aws/providerconfig-aws.yaml
    ```

    ```bash hideClipboard title="Example output"
    providerconfig.palette.crossplane.io/provider-palette created
    ```

13. Create a cluster `Profile` object with Crossplane or use an existing cluster profile. If you are using an existing
    cluster profile, your cluster profile packs must be compatible with the infrastructure your cluster will be deployed
    on.

    <Tabs>

    <TabItem value="crossplane" label="New Cluster Profile with Crossplane">

    1.  <PartialsComponent category="crossplane" name="cluster-profile-warning" />

        ```bash
        vi crossplane-aws/cluster-profile-aws.yaml
        ```

    2.  Paste the Kubernetes configuration below into the text editor window that opens. Save the file and exit.

        :::tip

        By default, Palette deploys the cluster in the project scope using the `project_name` defined in the Kubernetes
        Secret file. To deploy the cluster in the tenant admin scope instead of the project scope, set the value of
        `spec.forProvider.context` to `tenant`.

        :::

        ```yaml {13}
        apiVersion: cluster.palette.crossplane.io/v1alpha1
        kind: Profile
        metadata:
          name: aws-crossplane-cluster-profile
          namespace: crossplane-system
        spec:
          forProvider:
            name: "aws-crossplane-cluster-profile"
            description: "AWS Crossplane cluster profile"
            cloud: "aws"
            type: "cluster"
            version: "1.0.0"
            context: project
            pack:
              - name: "ubuntu-aws"
                tag: "22.04"
                uid: "63bd0373764141c6622c3062"
                registryUid: "5eecc89d0b150045ae661cef"
                type: oci
                values:
                  "# Spectro Golden images includes most of the hardening as per CIS Ubuntu Linux 22.04 LTS Server L1
                  v1.0.0 standards\n\n# Uncomment below section to\n# 1. Include custom files to be copied over to the
                  nodes and/or\n# 2. Execute list of commands before or after kubeadm init/join is
                  executed\n#\n#kubeadmconfig:\n#  preKubeadmCommands:\n#  - echo \"Executing pre kube admin config
                  commands\"\n#  - update-ca-certificates\n#  - 'systemctl restart containerd; sleep 3'\n#  - 'while [ !
                  -S /var/run/containerd/containerd.sock ]; do echo \"Waiting for containerd...\"; sleep 1;
                  done'\n#  postKubeadmCommands:\n#  - echo \"Executing post kube admin config
                  commands\"\n#  files:\n#  - targetPath: /usr/local/share/ca-certificates/mycom.crt\n#    targetOwner:
                  \"root:root\"\n#    targetPermissions: \"0644\"\n#    content: |\n#      -----BEGIN
                  CERTIFICATE-----\n#      MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n#      cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE\n#      AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA\n#      nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz\n#      qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN\n#      fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2\n#      7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL\n#      9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK\n#      jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB\n#      /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki\n#      HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y\n#      g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ\n#      ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6\n#      b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56\n#      IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=\n#      -----END
                  CERTIFICATE-----"

              - name: "kubernetes"
                tag: "1.32.4"
                uid: "687bbdf5511462f044b2c727"
                registryUid: "5eecc89d0b150045ae661cef"
                type: oci
                values:
                  "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube
                  Scheduler:loopback-scheduler,Azure Disk Encryption
                  Set:disable-azure-disk-encryption\npack:\n  content:\n    images:\n      - image:
                  registry.k8s.io/coredns/coredns:v1.11.3\n      - image: registry.k8s.io/etcd:3.5.16-0\n      - image:
                  registry.k8s.io/kube-apiserver:v1.32.4\n      - image:
                  registry.k8s.io/kube-controller-manager:v1.32.4\n      - image:
                  registry.k8s.io/kube-proxy:v1.32.4\n      - image: registry.k8s.io/kube-scheduler:v1.32.4\n      -
                  image: registry.k8s.io/pause:3.9\n      - image: registry.k8s.io/pause:3.8\n  #CIDR Range for Pods in
                  cluster\n  # Note : This must not overlap with any of the host or service network\n  podCIDR:
                  \"192.168.0.0/16\"\n  #CIDR notation IP range from which to assign service cluster IPs\n  # Note :
                  This must not overlap with any IP ranges assigned to nodes for pods.\n  serviceClusterIpRange:
                  \"10.96.0.0/12\"\n  # serviceDomain:
                  \"cluster.local\"\n\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note : secure-port flag is
                  used during kubeadm init. Do not change this flag on a running cluster\n      secure-port:
                  \"6443\"\n      anonymous-auth: \"true\"\n      profiling: \"false\"\n      disable-admission-plugins:
                  \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds:
                  \"60\"\n      default-unreachable-toleration-seconds: \"60\"\n      enable-admission-plugins:
                  \"AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity\"\n      admission-control-config-file:
                  \"/etc/kubernetes/pod-security-standard.yaml\"\n      audit-log-path:
                  /var/log/apiserver/audit.log\n      audit-policy-file:
                  /etc/kubernetes/audit-policy.yaml\n      audit-log-maxage: \"30\"\n      audit-log-maxbackup:
                  \"10\"\n      audit-log-maxsize: \"100\"\n      authorization-mode:
                  RBAC,Node\n      kubelet-certificate-authority:
                  \"/etc/kubernetes/pki/ca.crt\"\n      tls-cipher-suites:
                  \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256\"\n    extraVolumes:\n      -
                  name: audit-log\n        hostPath: /var/log/apiserver\n        mountPath:
                  /var/log/apiserver\n        pathType: DirectoryOrCreate\n      - name: audit-policy\n        hostPath:
                  /etc/kubernetes/audit-policy.yaml\n        mountPath:
                  /etc/kubernetes/audit-policy.yaml\n        readOnly: true\n        pathType: File\n      - name:
                  pod-security-standard\n        hostPath:
                  /etc/kubernetes/pod-security-standard.yaml\n        mountPath:
                  /etc/kubernetes/pod-security-standard.yaml\n        readOnly: true\n        pathType:
                  File\n  controllerManager:\n    extraArgs:\n      profiling:
                  \"false\"\n      terminated-pod-gc-threshold: \"25\"\n      use-service-account-credentials:
                  \"true\"\n      feature-gates:
                  \"RotateKubeletServerCertificate=true\"\n  scheduler:\n    extraArgs:\n      profiling:
                  \"false\"\n  kubeletExtraArgs:\n    read-only-port: \"0\"\n    event-qps: \"0\"\n    feature-gates:
                  \"RotateKubeletServerCertificate=true\"\n    protect-kernel-defaults:
                  \"true\"\n    rotate-server-certificates: \"true\"\n    tls-cipher-suites:
                  \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256\"\n  files:\n    -
                  path: hardening/audit-policy.yaml\n      targetPath:
                  /etc/kubernetes/audit-policy.yaml\n      targetOwner: \"root:root\"\n      targetPermissions:
                  \"0600\"\n    - path: hardening/90-kubelet.conf\n      targetPath:
                  /etc/sysctl.d/90-kubelet.conf\n      targetOwner: \"root:root\"\n      targetPermissions:
                  \"0600\"\n    - targetPath: /etc/kubernetes/pod-security-standard.yaml\n      targetOwner:
                  \"root:root\"\n      targetPermissions: \"0600\"\n      content: |\n        apiVersion:
                  apiserver.config.k8s.io/v1\n        kind: AdmissionConfiguration\n        plugins:\n        - name:
                  PodSecurity\n          configuration:\n            apiVersion:
                  pod-security.admission.config.k8s.io/v1\n            kind:
                  PodSecurityConfiguration\n            defaults:\n              enforce:
                  \"baseline\"\n              enforce-version: \"v1.32\"\n              audit:
                  \"baseline\"\n              audit-version: \"v1.32\"\n              warn:
                  \"restricted\"\n              warn-version: \"v1.32\"\n            exemptions:\n              # Array
                  of authenticated usernames to exempt.\n              usernames: []\n              # Array of runtime
                  class names to exempt.\n              runtimeClasses: []\n              # Array of namespaces to
                  exempt.\n              namespaces: [kube-system]\n\n  preKubeadmCommands:\n    # For enabling
                  'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required\n    - 'echo \"====>
                  Applying kernel parameters for Kubelet\"'\n    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'\n    -
                  'test -f /etc/containerd/ca.crt && cp /etc/containerd/ca.crt
                  /usr/local/share/ca-certificates/container.crt && update-ca-certificates && systemctl restart
                  containerd'\n  #postKubeadmCommands:\n\n  postKubeadmCommands:\n    - 'chmod 600
                  /var/lib/kubelet/config.yaml'\n    # - 'echo \"List of post kubeadm commands to be executed\"'\n\n#
                  Client configuration to add OIDC based authentication flags in
                  kubeconfig\n#clientConfig:\n  #oidc-issuer-url: \"{{
                  .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}\"\n  #oidc-client-id:
                  \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id
                  }}\"\n  #oidc-client-secret:
                  1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv\n  #oidc-extra-scope: profile,email"

              - name: "cni-calico"
                tag: "3.30.1"
                uid: "687bbdcf511462ef363aa0b4"
                registryUid: "5eecc89d0b150045ae661cef"
                type: oci
                values:
                  "# spectrocloud.com/enabled-presets: Microk8s:microk8s-false\npack:\n  content:\n    images:\n      -
                  image: us-docker.pkg.dev/palette-images/packs/calico/3.30.1/cni:v3.30.1\n      - image:
                  us-docker.pkg.dev/palette-images/packs/calico/3.30.1/node:v3.30.1\n      - image:
                  us-docker.pkg.dev/palette-images/packs/calico/3.30.1/kube-controllers:v3.30.1\n\nmanifests:\n  calico:\n    microk8s:
                  \"false\"\n    images:\n      cni: \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type
                  to use. Supported types are calico-ipam, host-local\n    ipamType:
                  \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4: true\n      assign_ipv6: false\n\n    # Should
                  be one of CALICO_IPV4POOL_IPIP or CALICO_IPV4POOL_VXLAN  \n    encapsulationType:
                  \"CALICO_IPV4POOL_IPIP\"\n\n    # Should be one of Always, CrossSubnet, Never\n    encapsulationMode:
                  \"Always\"\n\n    env:\n      # Additional env variables for
                  calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT:
                  \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR:
                  \"192.168.0.0/16\"\n        # For EKS cluster with static provisioning, set IP_AUTODETECTION_METHOD to
                  \"interface=eth0\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env
                  variables for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL:
                  \"info\"\n        #SYNC_NODE_LABELS: \"true\""

              - name: "csi-aws-ebs"
                tag: "1.43.0"
                uid: "687bbdd7511462ef75ba7ee1"
                registryUid: "5eecc89d0b150045ae661cef"
                type: oci
                values:
                  "pack:\n  content:\n    images:\n      - image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/aws-ebs-csi-driver:v1.43.0\n      - image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-provisioner:v5.2.0-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-attacher:v4.8.1-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-resizer:v1.13.2-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/livenessprobe:v2.15.0-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/node-driver-registrar:v2.13.0-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-snapshotter/csi-snapshotter:v8.2.1-eks-1-33-1\n      -
                  image:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/volume-modifier-for-k8s:v0.5.1\n    charts:\n      -
                  repo: https://kubernetes-sigs.github.io/aws-ebs-csi-driver\n        name:
                  aws-ebs-csi-driver\n        version: 2.43.0\n  namespace:
                  \"kube-system\"\ncharts:\n  aws-ebs-csi-driver:\n    storageClasses:\n      # Default Storage
                  Class\n      - name: spectro-storage-class\n        # annotation
                  metadata\n        annotations:\n          storageclass.kubernetes.io/is-default-class:
                  \"true\"\n          # label metadata\n          # labels:\n          #   my-label-is:
                  supercool\n          # defaults to WaitForFirstConsumer\n        volumeBindingMode:
                  WaitForFirstConsumer\n        # defaults to Delete\n        reclaimPolicy:
                  Delete\n        parameters:\n          # File system type: xfs, ext2, ext3,
                  ext4\n          csi.storage.k8s.io/fstype: \"ext4\"\n          # EBS volume type: io1, io2, gp2, gp3,
                  sc1, st1, standard\n          type: \"gp2\"\n          # I/O operations per second per GiB. Required
                  when io1 or io2 volume type is specified.\n          # iopsPerGB: \"\"\n          # Applicable only
                  when io1 or io2 volume type is specified\n          # allowAutoIOPSPerGBIncrease: false\n          #
                  I/O operations per second. Applicable only for gp3 volumes.\n          # iops: \"\"\n          #
                  Throughput in MiB/s. Applicable only for gp3 volumes.\n          # throughput: \"\"\n          #
                  Whether the volume should be encrypted or not\n          # encrypted: \"\"\n          # The full ARN
                  of the key to use when encrypting the volume. When not specified, the default KMS key is
                  used.\n          # kmsKeyId: \"\"\n    # Additional Storage Class \n    # - name:
                  addon-storage-class\n    # annotations:\n    #   storageclass.kubernetes.io/is-default-class:
                  \"false\"\n    # labels:\n    #   my-label-is: supercool\n    # volumeBindingMode:
                  WaitForFirstConsumer\n    # reclaimPolicy: Delete\n    # parameters:\n    # csi.storage.k8s.io/fstype:
                  \"ext4\"\n    # type: \"gp2\"\n    # iopsPerGB: \"\"\n    # allowAutoIOPSPerGBIncrease: false\n    #
                  iops: \"\"\n    # throughput: \"\"\n    # encrypted: \"\"\n    # kmsKeyId:
                  \"\"\n\n    image:\n      repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/aws-ebs-csi-driver\n      # Overrides the
                  image tag whose default is v{{ .Chart.AppVersion }}\n      tag: \"v1.43.0\"\n      pullPolicy:
                  IfNotPresent\n    # -- Custom labels to add into metadata\n    customLabels: {}\n    # k8s-app:
                  aws-ebs-csi-driver\n\n    sidecars:\n      provisioner:\n        env:
                  []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-provisioner\n          tag:
                  \"v5.2.0-eks-1-33-1\"\n        logLevel: 2\n        # Additional parameters provided by
                  external-provisioner.\n        additionalArgs: []\n        # Grant additional permissions to
                  external-provisioner\n        additionalClusterRoleRules:\n        resources: {}\n        # Tune
                  leader lease election for csi-provisioner.\n        # Leader election is on by
                  default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease
                  behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
                  format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
                  \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod:
                  \"5s\"\n        securityContext:\n          seccompProfile:\n            type:
                  RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
                  false\n      attacher:\n        env: []\n        image:\n          pullPolicy:
                  IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-attacher\n          tag:
                  \"v4.8.1-eks-1-33-1\"\n        # Tune leader lease election for csi-attacher.\n        # Leader
                  election is on by default.\n        leaderElection:\n          enabled: true\n          # Optional
                  values to tune lease behavior.\n          # The arguments provided must be in an acceptable
                  time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          #
                  leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod:
                  \"5s\"\n        logLevel: 2\n        # Additional parameters provided by
                  external-attacher.\n        additionalArgs: []\n        # Grant additional permissions to
                  external-attacher\n        additionalClusterRoleRules: []\n        resources:
                  {}\n        securityContext:\n          seccompProfile:\n            type:
                  RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
                  false\n      snapshotter:\n        # Enables the snapshotter sidecar even if the snapshot CRDs are not
                  installed\n        forceEnable: false\n        env: []\n        image:\n          pullPolicy:
                  IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-snapshotter/csi-snapshotter\n          tag:
                  \"v8.2.1-eks-1-33-1\"\n        logLevel: 2\n        # Additional parameters provided by
                  csi-snapshotter.\n        additionalArgs: []\n        # Grant additional permissions to
                  csi-snapshotter\n        additionalClusterRoleRules: []\n        resources:
                  {}\n        securityContext:\n          seccompProfile:\n            type:
                  RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
                  false\n      livenessProbe:\n        image:\n          pullPolicy: IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/livenessprobe\n          tag:
                  \"v2.15.0-eks-1-33-1\"\n        # Additional parameters provided by
                  livenessprobe.\n        additionalArgs: []\n        resources:
                  {}\n        securityContext:\n          readOnlyRootFilesystem:
                  true\n          allowPrivilegeEscalation: false\n      resizer:\n        env:
                  []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/external-resizer\n          tag:
                  \"v1.13.2-eks-1-33-1\"\n        # Tune leader lease election for csi-resizer.\n        # Leader
                  election is on by default.\n        leaderElection:\n          enabled: true\n          # Optional
                  values to tune lease behavior.\n          # The arguments provided must be in an acceptable
                  time.ParseDuration format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          #
                  leaseDuration: \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod:
                  \"5s\"\n        logLevel: 2\n        # Additional parameters provided by
                  external-resizer.\n        additionalArgs: []\n        # Grant additional permissions to
                  external-resizer\n        additionalClusterRoleRules: []\n        resources:
                  {}\n        securityContext:\n          seccompProfile:\n            type:
                  RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
                  false\n      nodeDriverRegistrar:\n        env: []\n        image:\n          pullPolicy:
                  IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/node-driver-registrar\n          tag:
                  \"v2.13.0-eks-1-33-1\"\n        logLevel: 2\n        # Additional parameters provided by
                  node-driver-registrar.\n        additionalArgs: []\n        resources:
                  {}\n        securityContext:\n          readOnlyRootFilesystem:
                  true\n          allowPrivilegeEscalation:
                  false\n        livenessProbe:\n          exec:\n            command:\n              -
                  /csi-node-driver-registrar\n              -
                  --kubelet-registration-path=$(DRIVER_REG_SOCK_PATH)\n              -
                  --mode=kubelet-registration-probe\n          initialDelaySeconds: 30\n          periodSeconds:
                  90\n          timeoutSeconds: 15\n      volumemodifier:\n        env:
                  []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
                  us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.43.0/volume-modifier-for-k8s\n          tag:
                  \"v0.5.1\"\n        leaderElection:\n          enabled: true\n          # Optional values to tune
                  lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
                  format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
                  \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel:
                  2\n        # Additional parameters provided by volume-modifier-for-k8s.\n        additionalArgs:
                  []\n        resources: {}\n        securityContext:\n          seccompProfile:\n            type:
                  RuntimeDefault\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
                  false\n    proxy:\n      http_proxy:\n      no_proxy:\n    imagePullSecrets:
                  []\n    nameOverride:\n    fullnameOverride:\n    awsAccessSecret:\n      name:
                  aws-secret\n      keyId: key_id\n      accessKey: access_key\n    controller:\n      batching:
                  true\n      volumeModificationFeature:\n        enabled: false\n      # Additional parameters provided
                  by aws-ebs-csi-driver controller.\n      additionalArgs: []\n      sdkDebugLog:
                  false\n      loggingFormat:
                  text\n      affinity:\n        nodeAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n            -
                  weight: 1\n              preference:\n                matchExpressions:\n                  - key:
                  eks.amazonaws.com/compute-type\n                    operator:
                  NotIn\n                    values:\n                      - fargate\n                      -
                  auto\n                      -
                  hybrid\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n            -
                  podAffinityTerm:\n                labelSelector:\n                  matchExpressions:\n                    -
                  key: app\n                      operator: In\n                      values:\n                        -
                  ebs-csi-controller\n                topologyKey: kubernetes.io/hostname\n              weight:
                  100\n      # The default filesystem type of the volume to provision when fstype is unspecified in the
                  StorageClass.\n      # If the default is not set and fstype is unset in the StorageClass, then no
                  fstype will be set\n      defaultFsType: ext4\n      env: []\n      # Use envFrom to reference
                  ConfigMaps and Secrets across all containers in the deployment\n      envFrom: []\n      # If set, add
                  pv/pvc metadata to plugin create and modify requests as parameters.\n      extraCreateMetadata:
                  true\n      # Extra volume tags to attach to each dynamically provisioned volume.\n      #
                  ---\n      # extraVolumeTags:\n      #   key1: value1\n      #   key2: value2\n      extraVolumeTags:
                  {}\n      httpEndpoint:\n      # (deprecated) The TCP network address where the prometheus metrics
                  endpoint\n      # will run (example: `:8080` which corresponds to port 8080 on local host).\n      #
                  The default is empty string, which means metrics endpoint is disabled.\n      #
                  ---\n      enableMetrics: false\n      serviceMonitor:\n        # Enables the ServiceMonitor resource
                  even if the prometheus-operator CRDs are not installed\n        forceEnable: false\n        #
                  Additional labels for ServiceMonitor object\n        labels:\n          release:
                  prometheus\n        interval: \"15s\"\n      # If set to true, AWS API call metrics will be exported
                  to the following\n      # TCP endpoint: \"0.0.0.0:3301\"\n      # ---\n      # ID of the Kubernetes
                  cluster used for tagging provisioned EBS volumes (optional).\n      k8sTagClusterId:\n      logLevel:
                  2\n      userAgentExtra: \"helm\"\n      nodeSelector: {}\n      deploymentAnnotations:
                  {}\n      podAnnotations: {}\n      podLabels: {}\n      podDisruptionBudget:\n        # Warning:
                  Disabling PodDisruptionBudget may lead to delays in stateful workloads starting due to
                  controller\n        # pod restarts or evictions.\n        enabled: true\n        #
                  unhealthyPodEvictionPolicy:\n      priorityClassName: system-cluster-critical\n      # AWS region to
                  use. If not specified then the region will be looked up via the AWS EC2 metadata\n      #
                  service.\n      # ---\n      # region: us-east-1\n      region:\n      replicaCount:
                  2\n      revisionHistoryLimit: 10\n      socketDirVolume:\n        emptyDir:
                  {}\n      updateStrategy:\n        type:
                  RollingUpdate\n        rollingUpdate:\n          maxUnavailable: 1\n      # type:
                  RollingUpdate\n      # rollingUpdate:\n      #   maxSurge: 0\n      #   maxUnavailable:
                  1\n      resources:\n        requests:\n          cpu: 10m\n          memory:
                  40Mi\n        limits:\n          memory: 256Mi\n          cpu: 100m\n      serviceAccount:\n        #
                  A service account will be created for you if set to true. Set to false if you want to use your
                  own.\n        create: true\n        name: ebs-csi-controller-sa\n        annotations: {}\n        ##
                  Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn:
                  arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken:
                  true\n      tolerations:\n        - key: CriticalAddonsOnly\n          operator: Exists\n        -
                  effect: NoExecute\n          operator: Exists\n          tolerationSeconds: 300\n      # TSCs without
                  the label selector stanza\n      #\n      # Example:\n      #\n      #
                  topologySpreadConstraints:\n      #  - maxSkew: 1\n      #    topologyKey:
                  topology.kubernetes.io/zone\n      #    whenUnsatisfiable: ScheduleAnyway\n      #  - maxSkew:
                  1\n      #    topologyKey: kubernetes.io/hostname\n      #    whenUnsatisfiable:
                  ScheduleAnyway\n      topologySpreadConstraints: []\n      # securityContext on the controller
                  pod\n      securityContext:\n        runAsNonRoot: true\n        runAsUser: 1000\n        runAsGroup:
                  1000\n        fsGroup: 1000\n      # Add additional volume mounts on the controller with
                  controller.volumes and controller.volumeMounts\n      volumes: []\n      # Add additional volumes to
                  be mounted onto the controller:\n      # - name: custom-dir\n      #   hostPath:\n      #     path:
                  /path/to/dir\n      #     type: Directory\n      volumeMounts: []\n      # And add mount paths for
                  those additional volumes:\n      # - name: custom-dir\n      #   mountPath: /mount/path\n      #
                  ---\n      # securityContext on the controller container (see sidecars for securityContext on sidecar
                  containers)\n      containerSecurityContext:\n        seccompProfile:\n          type:
                  RuntimeDefault\n        readOnlyRootFilesystem: true\n        allowPrivilegeEscalation:
                  false\n      initContainers: []\n      # containers to be run before the controller's container
                  starts.\n      #\n      # Example:\n      #\n      # - name: wait\n      #   image:
                  public.ecr.aws/amazonlinux/amazonlinux\n      #   command: [ 'sh', '-c', \"sleep 20\" ]\n      #
                  Enable opentelemetry tracing for the plugin running on the daemonset\n      otelTracing:
                  {}\n      #  otelServiceName: ebs-csi-controller\n      #  otelExporterEndpoint:
                  \"http://localhost:4317\"\n\n      # Enable dnsConfig for the controller and node
                  pods\n      dnsConfig: {}\n    node:\n      # Enable SELinux-only optimizations on the EBS CSI Driver
                  node pods\n      # Must only be set true if all linux nodes in the DaemonSet have SELinux
                  enabled\n      selinux: false\n      env: []\n      envFrom: []\n      kubeletPath:
                  /var/lib/kubelet\n      loggingFormat: text\n      logLevel: 2\n      enableMetrics:
                  false\n      priorityClassName:\n      additionalArgs:
                  []\n      affinity:\n        nodeAffinity:\n          requiredDuringSchedulingIgnoredDuringExecution:\n            nodeSelectorTerms:\n              -
                  matchExpressions:\n                  - key:
                  eks.amazonaws.com/compute-type\n                    operator:
                  NotIn\n                    values:\n                      - fargate\n                      -
                  auto\n                      - hybrid\n                  - key:
                  node.kubernetes.io/instance-type\n                    operator:
                  NotIn\n                    values:\n                      - a1.medium\n                      -
                  a1.large\n                      - a1.xlarge\n                      -
                  a1.2xlarge\n                      - a1.4xlarge\n      nodeSelector: {}\n      daemonSetAnnotations:
                  {}\n      podAnnotations: {}\n      podLabels: {}\n      terminationGracePeriodSeconds:
                  30\n      tolerateAllTaints: true\n      tolerations:\n        - operator: Exists\n          effect:
                  NoExecute\n          tolerationSeconds: 300\n      resources:\n        requests:\n          cpu:
                  10m\n          memory: 40Mi\n        limits:\n          memory: 256Mi\n          cpu:
                  100m\n      revisionHistoryLimit: 10\n      probeDirVolume:\n        emptyDir:
                  {}\n      serviceAccount:\n        create: true\n        name: ebs-csi-node-sa\n        annotations:
                  {}\n        ## Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn:
                  arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken: true\n      #
                  Enable the linux daemonset creation\n      enableLinux: true\n      enableWindows: true\n      #
                  Warning: This option will be removed in a future release. It is a temporary workaround for users
                  unable to immediately migrate off of older kernel versions.\n      # Formats XFS volumes with
                  bigtime=0,inobtcount=0,reflink=0, for mounting onto nodes with linux kernel version <= 5.4.\n      #
                  Note that XFS volumes formatted with this option will only have timestamp records until
                  2038.\n      legacyXFS: false\n      # The number of attachment slots to reserve for system use (and
                  not to be used for CSI volumes)\n      # When this parameter is not specified (or set to -1), the EBS
                  CSI Driver will attempt to determine the number of reserved slots via heuristic\n      # Cannot be
                  specified at the same time as `node.volumeAttachLimit`\n      reservedVolumeAttachments:\n      # The
                  \"maximum number of attachable volumes\" per node\n      # Cannot be specified at the same time as
                  `node.reservedVolumeAttachments`\n      volumeAttachLimit:\n      updateStrategy:\n        type:
                  RollingUpdate\n        rollingUpdate:\n          maxUnavailable: \"10%\"\n      hostNetwork:
                  false\n      # securityContext on the node pod\n      securityContext:\n        # The node pod must be
                  run as root to bind to the registration/driver sockets\n        runAsNonRoot:
                  false\n        runAsUser: 0\n        runAsGroup: 0\n        fsGroup: 0\n      # allows you to deploy
                  aws-ebs-csi-node daemonset to separate namespace (make sure namespace exists before
                  deploy)\n      namespaceOverride: \"\"\n      # Add additional volume mounts on the node pods with
                  node.volumes and node.volumeMounts\n      volumes: []\n      # Add additional volumes to be mounted
                  onto the node pods:\n      # - name: custom-dir\n      #   hostPath:\n      #     path:
                  /path/to/dir\n      #     type: Directory\n      volumeMounts: []\n      # And add mount paths for
                  those additional volumes:\n      # - name: custom-dir\n      #   mountPath: /mount/path\n      #
                  ---\n      # securityContext on the node container (see sidecars for securityContext on sidecar
                  containers)\n      # Privileged containers always run as `Unconfined`, which means that they are not
                  restricted by a seccomp profile.\n      containerSecurityContext:\n        readOnlyRootFilesystem:
                  true\n        privileged: true\n      initContainers: []\n      # containers to be run before the
                  csi-node's container starts.\n      #\n      # Example:\n      #\n      # - name:
                  wait\n      #   image: public.ecr.aws/amazonlinux/amazonlinux\n      #   command: [ 'sh', '-c',
                  \"sleep 20\" ]\n      # Enable opentelemetry tracing for the plugin running on the
                  daemonset\n      otelTracing: {}\n      #  otelServiceName:
                  ebs-csi-node\n      #  otelExporterEndpoint:
                  \"http://localhost:4317\"\n    additionalDaemonSets:\n    # Additional node DaemonSets, using the node
                  config structure\n    # See docs/additional-daemonsets.md for more information\n    #\n    #
                  example:\n    #   nodeSelector:\n    #     node.kubernetes.io/instance-type:
                  c5.large\n    #   volumeAttachLimit: 15\n\n    # Enable compatibility for the A1 instance family via
                  use of an AL2-based image in a separate DaemonSet\n    # a1CompatibilityDaemonSet: true\n    #
                  storageClasses: []\n    # Add StorageClass resources like:\n    # - name: ebs-sc\n    #   # annotation
                  metadata\n    #   annotations:\n    #     storageclass.kubernetes.io/is-default-class:
                  \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   #
                  defaults to WaitForFirstConsumer\n    #   volumeBindingMode: WaitForFirstConsumer\n    #   # defaults
                  to Delete\n    #   reclaimPolicy: Retain\n    #   parameters:\n    #     encrypted:
                  \"true\"\n    defaultStorageClass:\n      enabled: false\n    volumeSnapshotClasses: []\n    # Add
                  VolumeSnapshotClass resources like:\n    # - name: ebs-vsc\n    #   # annotation
                  metadata\n    #   annotations:\n    #     snapshot.storage.kubernetes.io/is-default-class:
                  \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   #
                  deletionPolicy must be specified\n    #   deletionPolicy: Delete\n    #   parameters:\n\n    # Use old
                  CSIDriver without an fsGroupPolicy set\n    # Intended for use with older clusters that cannot easily
                  replace the CSIDriver object\n    # This parameter should always be false for new
                  installations\n    useOldCSIDriver: false\n    # Deploy EBS CSI Driver without controller and
                  associated resources\n    nodeComponentOnly: false\n    # Instruct the AWS SDK to use AWS FIPS
                  endpoints, and deploy container built with BoringCrypto (a FIPS-validated cryptographic library)
                  instead of the Go default\n    #\n    # The EBS CSI Driver FIPS images have not undergone FIPS
                  certification, and no official guarnatee is made about the compliance of these images under the FIPS
                  standard\n    # Users relying on these images for FIPS compliance should perform their own independent
                  evaluation\n    fips: false"

          providerConfigRef:
            name: provider-palette
        ```

        The cluster profile contains the following core infrastructure layers.

        | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
        | ------------- | ------------ | ------------- | ---------------- |
        | OS            | Public Repo  | `ubuntu-aws`  | `22.04`          |
        | Kubernetes    | Public Repo  | `kubernetes`  | `1.32.4`         |
        | Network       | Public Repo  | `cni-calico`  | `3.30.1`         |
        | Storage       | Public Repo  | `csi-aws-ebs` | `1.43.0`         |

        <PartialsComponent category="crossplane" name="cluster-profile-tip" />

    3.  Create the cluster profile in Palette.

        ```bash
        kubectl apply --filename crossplane-aws/cluster-profile-aws.yaml
        ```

        ```bash hideClipboard title="Example output"
        profile.cluster.palette.crossplane.io/aws-crossplane-cluster-profile created
        ```

    4.  Issue the commands below to get the ID of the cluster profile once it is created and save it as a variable.

        ```bash
        kubectl wait --for=condition=Ready profile.cluster.palette.crossplane.io/aws-crossplane-cluster-profile --timeout=60s
        CLUSTER_PROFILE_ID=$(kubectl get profile.cluster.palette.crossplane.io aws-crossplane-cluster-profile --output jsonpath='{.status.atProvider.id}')
        echo Cluster Profile ID: $CLUSTER_PROFILE_ID
        ```

        ```text hideClipboard title="Example output"
        profile.cluster.palette.crossplane.io/aws-crossplane-cluster-profile condition met
        Cluster Profile ID: 68960ddf222fa7f0046e80ed
        ```

    </TabItem>

    <TabItem value="existing-cluster-profile" label="Existing Cluster Profile">

    <PartialsComponent category="crossplane" name="cluster-profile-existing" />

    </TabItem>

    </Tabs>

14. Next, set your Palette AWS account name as a variable. Replace `<aws-account-name>` with the name under which you
    registered your AWS account in Palette. This is the display name that appears under **Cloud Accounts** in **Tenant
    Settings** or **Project Settings**, _not_ the actual name of your AWS account.

    ```bash
    PALETTE_AWS_CLOUD_ACCOUNT_NAME=<aws-account-name>
    ```

    In the example below, the Palette AWS account name is `spectro-cloud`.

    ![AWS account name in Palette](/automation_crossplane_deploy-cluster-aws-crossplane_aws-account-name-4-7.webp)

15. Fetch the ID of your AWS cloud account registered in Palette by invoking the `cloudaccounts` Palette API.

    ```bash
    AWS_CLOUD_ACCOUNT_ID=$(curl --location --request GET "https://api.${PALETTE_HOST}/v1/cloudaccounts/aws" \
    -H 'Accept: application/json' \
    -H "ApiKey: $PALETTE_API_KEY" \
    | jq --arg name "$PALETTE_AWS_CLOUD_ACCOUNT_NAME" '.items[] | select(.metadata.name == $name) | .metadata.uid' -r)
    echo Cloud Account ID: $AWS_CLOUD_ACCOUNT_ID
    ```

    ```bash hideClipboard title="Example output"
    Cloud Account ID: 67bdef49b2fc3ec6c1774686
    ```

16. Use the following command to create a file to store your AWS IaaS cluster configuration. Replace `<ssh-key-name>`
    with the name of your AWS EC2 SSH key that belongs to the region where you want to deploy your cluster.

    Optionally, edit the region, availability zone, instance type, and number of cluster nodes according to your
    workload.

    ```bash {11}
    cat << EOF > crossplane-aws/cluster-aws.yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Aws
    metadata:
      name: aws-crossplane-cluster
      namespace: crossplane-system
    spec:
      forProvider:
        name: aws-crossplane-cluster
        cloudConfig:
          - sshKeyName: <ssh-key-name>
            region: us-east-1
        machinePool:
          - azs:
              - us-east-1a
            count: 2
            instanceType: t3.xlarge
            name: machinepool1
          - azs:
              - us-east-1a
            count: 1
            instanceType: m4.2xlarge
            name: controlplanepool
            controlPlane: true
        clusterProfile:
          - id: $CLUSTER_PROFILE_ID
        cloudAccountId: $AWS_CLOUD_ACCOUNT_ID
      providerConfigRef:
        name: provider-palette
    EOF
    ```

17. Create the AWS IaaS cluster.

    ```bash
    kubectl apply --filename crossplane-aws/cluster-aws.yaml
    ```

    ```bash hideClipboard title="Example output"
    aws.cluster.palette.crossplane.io/aws-crossplane-cluster created
    ```

18. Wait for the cluster to be created. Cluster provisioning may take up to one hour.

    ```bash
    kubectl wait --for=condition=Ready aws.cluster.palette.crossplane.io/aws-crossplane-cluster --timeout=1h
    ```

    Once ready, you should receive output similar to the following.

    ```text hideClipboard title="Example output"
    aws.cluster.palette.crossplane.io/aws-crossplane-cluster condition met
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Verify the deployed cluster named `aws-crossplane-cluster` is displayed and has a **Cluster Status** of **Running**
   and a **Health** status of **Healthy**.
