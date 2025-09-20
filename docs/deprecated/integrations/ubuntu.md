---
sidebar_label: "Ubuntu"
title: "Ubuntu"
description: "Choose Ubuntu Operating System pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ["operating system", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/ubuntu-vsphere/blobs/sha256:09a727f9005b79c69d8e60e12ce130880c63131315b49e7fb4cc44e53d34dc7a?type=image.webp"
tags: ["packs", "ubuntu", "operating system"]
---

[Ubuntu](https://ubuntu.com) is an open source operating system based on the Linux kernel. Developed by Canonical Ltd.,
Ubuntu is a popular choice for desktops, servers, and cloud environments due to its ease of use, robustness, and
versatility.

Boasting a comprehensive package system, Ubuntu provides a wealth of pre-compiled software directly accessible for
installation. With its regular release cycle, Ubuntu ensures updated software and security patches, making it a secure
and reliable choice for various use cases.

In addition to its stability, Ubuntu's community support, extensive documentation, and commitment to free software
principles make it a widely favored choice among Linux distributions.

You can use Ubuntu as the base Operating System (OS) when deploying a host cluster by using the Ubuntu pack when you
create a cluster profile. For guidance, review
[Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md).

<br />

:::info

Review [Maintenance Policy](maintenance-policy.md#os-packs) to learn about pack update and deprecation schedules.

:::

## Version Supported

<br />

<Tabs>
<TabItem label="22.04.x LTS" value="22.04.x" queryString="22.04.x">

### Prerequisites

- A minimum of 4 CPU and 4GB Memory

- You can use Ubuntu with a supported Kubernetes version. The table lists Kubernetes dependencies.

| Kubernetes Version | Supports Kubernetes |
| ------------------ | ------------------- |
| 1.29               | ✅                  |
| 1.28               | ✅                  |
| 1.27               | ✅                  |
| 1.26               | ✅                  |
| 1.25               | ✅                  |
| 1.24               | ❌                  |

### Parameters

The Ubuntu OS pack has no required parameters.

You can customize the Ubuntu OS pack. The following configuration blocks are available for use within the
`kubeadmconfig` configuration block in the YAML file.

<br />

:::info

Palette applies a default set of configuration options when deploying Ubuntu. You can override the defaults
configurations by using the following parameters but it's not required.

:::

| Field                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                    | YAML Type | Required |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | -------- |
| `apiServer`           | Extra settings for the Kube API server control plane component. Refer to [Kube API server](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) documentation for available options.                                                                                                                                                                                                             | object    | No       |
| `controllerManager`   | Extra settings for the Kubernetes controller manager control plane component. Review the [Kubernetes controller manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) documentation for more information.                                                                                                                                                                       | object    | No       |
| `scheduler`           | Extra settings for the Kubernetes scheduler control plane component. Refer to the [Kube scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler) documenation for more details.                                                                                                                                                                                                            | object    | No       |
| `kubeletExtraArgs`    | Extra arguments for kubelet. Refer to the [Kubeadm init](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init) documentation for more details.                                                                                                                                                                                                                                                                | map       | No       |
| `files`               | Create or specify additional files for the `kubeadmconfig`. Refer to the [Customize Pack](#customize-pack) section to learn more.                                                                                                                                                                                                                                                                                              | list      | No       |
| `preKubeadmCommands`  | Extra commands to issue before kubeadm starts.                                                                                                                                                                                                                                                                                                                                                                                 | list      | No       |
| `postKubeadmCommands` | Extra commands to issue after kubeadm starts.                                                                                                                                                                                                                                                                                                                                                                                  | list      | No       |
| `imageRepository`     | The container registry to pull images from. If empty, `k8s.gcr.io` will be used by default.                                                                                                                                                                                                                                                                                                                                    | string    | No       |
| `etcd`                | Configuration for etcd. This value defaults to a Local (stacked) etcd. You can specify configurations using [local etcd configuration files](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/), or you can reference [external etcd configurations](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability) or Certificate Authorities (CA). | object    | No       |
| `dns`                 | Options for the DNS add-on installed in the cluster. Refer to the [Customizing DNS Service](https://kubernetes.io/docs/tasks/administer-cluster/dns-custom-nameservers/) to learn more.                                                                                                                                                                                                                                        | object    | No       |

The following code snippet is an example YAML using all the `kubeadmconfig` parameters listed in the table. The example
YAML is only for learning purposes.

<br />

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      insecure-port: "0"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurityPolicy"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  dns:
    type: CoreDNS
    imageRepository: public.ecr.aws/eks-distro/coredns
    imageTag: v1.7.0-eks-1-18-1
  etcd:
    local:
      dataDir: /var/lib/etcd
      imageRepository: public.ecr.aws/eks-distro/etcd-io
      imageTag: v3.4.14-eks-1-18-1
    external:
      endpoints:
        - example.org
      caFile: myCa.file
      certFile: myCert.file
      keyFile: myKey.file
  imageRepository: public.ecr.aws/eks-distro/kubernetes
  kubeletExtraArgs:
    read-only-port: "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/privileged-psp.yaml
      targetPath: /etc/kubernetes/hardening/privileged-psp.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"

  preKubeadmCommands:
    # For enabling 'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - "sysctl -p /etc/sysctl.d/90-kubelet.conf"
  postKubeadmCommands:
    # Apply the privileged PodSecurityPolicy on the first control plane node ; Otherwise, CNI (and other) pods won't come up
    - "export KUBECONFIG=/etc/kubernetes/admin.conf"
    # Sometimes api server takes a little longer to respond. Retry if applying the pod-security-policy manifest fails
    - '[ -f "$KUBECONFIG" ] && { echo " ====> Applying PodSecurityPolicy" ; until $(kubectl apply -f
      /etc/kubernetes/hardening/privileged-psp.yaml > /dev/null ); do echo "Failed to apply PodSecurityPolicies, will
      retry in 5s" ; sleep 5 ; done ; } || echo "Skipping PodSecurityPolicy for worker nodes"'
```

<br />

:::warning

Review the parameter documentation before you make changes to the kubeadm configuration. Improper configurations can
cause deployment failures.

:::

Palette also supports Ubuntu Pro. Refer to the [Ubuntu Pro](#ubuntu-pro) section below for more details.

<br />

### Usage

To use the Ubuntu OS pack, add the pack to your cluster profile when you select the OS layer. Refer to the
[Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
guide to learn more.

<br />

#### Customize Pack

You can customize the Ubuntu OS pack using the available configuration parameters in the YAML file. Use the parameters
to customize the Kubernetes install process.

<br />

##### Add Custom Files

You can create custom files that you define in the `files` section that precedes the `preKubeadmCommands` and
`postKubeadmCommands` sections. The files are invoked during runtime.

<br />

```yaml
kubeadmconfig:
  files:
    - targetPath: /usr/local/share/ca-certificates/mycom.crt
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        -----BEGIN CERTIFICATE-----
        MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
        cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE
        AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA
        nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz
        qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN
        fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2
        7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL
        9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK
        jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB
        /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki
        HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y
        g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ
        ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6
        b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56
        IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=
        -----END CERTIFICATE-----
  preKubeadmCommands:
    - echo "Executing pre kube admin config commands"
    - update-ca-certificates
    - "systemctl restart containerd; sleep 3"
    - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
  postKubeadmCommands:
    - echo "Executing post kube admin config commands"
```

In the next example, a configuration file is added to a folder.

<br />

```yaml
kubeadmconfig:
  files:
    - targetPath: /etc/containerd/config.toml
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
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
  preKubeadmCommands:
    - 'echo "====> Applying pre Kubeadm commands"'
  postKubeadmCommands:
    - 'echo "====> Applying post Kubeadm commands"'
```

#### Ubuntu Pro

Ubuntu Pro is a security and maintenance subscription offering from Canonical that offers long-term security support and
many other security hardening features. Ubuntu Pro offers several more benefits than the free Ubuntu offering:

<br />

- Extended Security Maintenance

- Kernel Livepatch service to avoid reboots

- FIPS 140-3 Level 1 certified crypto modules

- Common Criteria EAL2

For more information, refer to the [Ubuntu Pro](https://ubuntu.com/pro) documentation from Canonical.

You can enable Ubuntu Pro when deploying clusters with Palette. To enable Ubuntu Pro, select Ubuntu as the OS layer for
a cluster profile and expand the **Preset Menu** to reveal the Ubuntu Pro parameters.

| Parameter        | Description                                                                                                                                                                                                                                                         | Default Value |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **token**        | The Canonical subscription token for Ubuntu Pro. Refer to the Ubuntu Pro [subscribe page](https://ubuntu.com/pro/subscribe) to aquire a subscription token.                                                                                                         | `""`          |
| **esm-apps**     | Expanded Security Maintenance (ESM) for Applications. Refer to the Ubuntu [ESM documentation](https://ubuntu.com/security/esm) to learn more.                                                                                                                       | Disabled      |
| **livepatch**    | Canonical Livepatch service. Refer to the Ubuntu [Livepatch](https://ubuntu.com/security/livepatch) documenation for more details.                                                                                                                                  | Disabled      |
| **fips**         | Federal Information Processing Standards (FIPS) 140 validated cryptography for Linux workloads on Ubuntu. This installs NIST-certified core packages. Refer to the Ubuntu [FIPS](https://ubuntu.com/security/certifications/docs/2204) documentation to learn more. | Disabled      |
| **fips-updates** | Install NIST-certified core packages with priority security updates. Refer to the Ubuntu [FIPS Updates](https://ubuntu.com/security/certifications/docs/fips-updates) documentation to learn more.                                                                  | Disabled      |
| **cis**          | Gain access to OpenSCAP-based tooling that automates both hardening and auditing with certified content based on published CIS benchmarks. Refer to the Ubuntu [CIS](https://ubuntu.com/security/certifications/docs/2204/usg/cis) documentation to learn more.     | Disabled      |

Use the following steps to enable Ubuntu Pro.

<br />

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Click on **Add Cluster Profile**.

4. Fill out the input fields for **Name**, **Version**, **Description**, **Type** and **Tags**. Click on **Next** to
   continue.

5. Select the infrastructure provider and click on **Next**.

6. Select the OS layer and use the following information to find the Ubuntu pack:

- **Pack Type** - OS

- **Registry** - Public Repo

- **Pack Name** -Ubuntu

- **Pack Version** - 20.04 or 22.04

7. Modify the Ubuntu **Pack values** to activate the **Presets** options for the Ubuntu YAML file. Click on the
   **\</\>** button to reveal the YAML editor and expand the **Preset Drawer**.

<br />

![A view of the cluster profile creation wizard for Ubuntu Pro](/integrations_ubuntu_ubuntu-pro-preset-drawer.webp)

8. Click the **Ubuntu Advantage/Pro** checkbox to include the Ubuntu Pro parameters in the pack configuration file.

9. Toggle options on or off to enable or disable the various Ubuntu Pro services.

10. Click the **Next layer** button to continue to the next layer.

11. Complete the remainder of the cluster profile creation wizard by selecting the next cluster profile layers.

<br />

</TabItem>
<TabItem label="20.04.x LTS" value="20.04.x" queryString="20.04.x">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory

- You can use Ubuntu with a supported Kubernetes version. The table lists Kubernetes dependencies.

| Kubernetes Version | Supports Kubernetes |
| ------------------ | ------------------- |
| 1.26               | ❌                  |
| 1.25               | ❌                  |
| 1.24               | ✅                  |
| 1.23               | ✅                  |

<br />

## Parameters

The Ubuntu OS pack has no required parameters.

You can customize the Ubuntu OS pack. The following configuration blocks are available for use within the
`kubeadmconfig` configuration block in the YAML file.

<br />

:::info

Palette applies a default set of configuration options when deploying Ubuntu. You can override the defaults
configurations by using the following parameters but it's not required.

:::

| Field                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                    | YAML Type | Required             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | -------------------- |
| `apiServer`           | Extra settings for the Kube API server control plane component. Refer to [Kube API server](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) documentation for available options.                                                                                                                                                                                                             | object    | No                   |
| `controllerManager`   | Extra settings for the Kubernetes controller manager control plane component. Review the [Kubernetes controller manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) documentation for more information.                                                                                                                                                                       | object    | No                   |
| `scheduler`           | Extra settings for the Kubernetes scheduler control plane component. Refer to the [Kube scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler) documenation for more details.                                                                                                                                                                                                            | object    | No                   |
| `kubeletExtraArgs`    | Extra arguments for kubelet. Refer to the [Kubeadm init](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init) documentation for more details.                                                                                                                                                                                                                                                                | map       | No                   |
| `files`               | Additional files to pass to kubeadmconfig. Refer to the [Customize Pack](#add-custom-files-1) section to learn more.                                                                                                                                                                                                                                                                                                           | list      | No                   |
| `preKubeadmCommands`  | Extra commands to issue before kubeadm starts.                                                                                                                                                                                                                                                                                                                                                                                 | list      | Yes - Auto generated |
| `postKubeadmCommands` | Extra commands to issue after kubeadm starts.                                                                                                                                                                                                                                                                                                                                                                                  | list      | Yes - Auto generated |
| `imageRepository`     | The container registry to pull images from. If empty, `k8s.gcr.io` will be used by default.                                                                                                                                                                                                                                                                                                                                    | string    | No                   |
| `etcd`                | Configuration for etcd. This value defaults to a Local (stacked) etcd. You can specify configurations using [local etcd configuration files](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/), or you can reference [external etcd configurations](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability) or Certificate Authorities (CA). | object    | No                   |
| `dns`                 | Options for the DNS add-on installed in the cluster. Refer to the [Customizing DNS Service](https://kubernetes.io/docs/tasks/administer-cluster/dns-custom-nameservers/) to learn more.                                                                                                                                                                                                                                        | object    | No                   |

The following code snippet is an example YAML using all the `kubeadmconfig` parameters listed in the table. The example
YAML is only for learning purposes.

<br />

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      insecure-port: "0"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurityPolicy"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  dns:
    type: CoreDNS
    imageRepository: public.ecr.aws/eks-distro/coredns
    imageTag: v1.7.0-eks-1-18-1
  etcd:
    local:
      dataDir: /var/lib/etcd
      imageRepository: public.ecr.aws/eks-distro/etcd-io
      imageTag: v3.4.14-eks-1-18-1
    external:
      endpoints:
        - example.org
      caFile: myCa.file
      certFile: myCert.file
      keyFile: myKey.file
  imageRepository: public.ecr.aws/eks-distro/kubernetes
  kubeletExtraArgs:
    read-only-port: "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/privileged-psp.yaml
      targetPath: /etc/kubernetes/hardening/privileged-psp.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"

  preKubeadmCommands:
    # For enabling 'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - "sysctl -p /etc/sysctl.d/90-kubelet.conf"
  postKubeadmCommands:
    # Apply the privileged PodSecurityPolicy on the first control plane node ; Otherwise, CNI (and other) pods won't come up
    - "export KUBECONFIG=/etc/kubernetes/admin.conf"
    # Sometimes api server takes a little longer to respond. Retry if applying the pod-security-policy manifest fails
    - '[ -f "$KUBECONFIG" ] && { echo " ====> Applying PodSecurityPolicy" ; until $(kubectl apply -f
      /etc/kubernetes/hardening/privileged-psp.yaml > /dev/null ); do echo "Failed to apply PodSecurityPolicies, will
      retry in 5s" ; sleep 5 ; done ; } || echo "Skipping PodSecurityPolicy for worker nodes"'
```

<br />

:::warning

Review the parameter documentation before you make changes to the kubeadm configuration. Improper configurations can
cause deployment failures.

:::

Palette also supports Ubuntu Pro. Refer to the [Ubuntu Pro](#ubuntu-pro-1) section below for more details.

<br />

## Usage

To use the Ubuntu OS pack, add the pack to your cluster profile when you select the OS layer. Refer to the
[Create Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide to learn
more about creating cluster profiles.

<br />

### Customize Pack

You can customize the Ubuntu OS pack using the available configuration parameters in the YAML file. Use the parameters
to customize the Kubernetes install process.

<br />

#### Add Custom Files

You can create custom files that you define in the `files` section that precedes the `preKubeadmCommands` and
`postKubeadmCommands` sections. The files are invoked during runtime.

<br />

```yaml
kubeadmconfig:
  files:
    - targetPath: /usr/local/share/ca-certificates/mycom.crt
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        -----BEGIN CERTIFICATE-----
        MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
        cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE
        AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA
        nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz
        qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN
        fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2
        7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL
        9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK
        jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB
        /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki
        HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y
        g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ
        ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6
        b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56
        IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=
        -----END CERTIFICATE-----
  preKubeadmCommands:
    - echo "Executing pre kube admin config commands"
    - update-ca-certificates
    - "systemctl restart containerd; sleep 3"
    - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
  postKubeadmCommands:
    - echo "Executing post kube admin config commands"
```

In the next example, a configuration file is added to a folder.

<br />

```yaml
kubeadmconfig:
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
  preKubeadmCommands:
    - 'echo "====> Applying pre Kubeadm commands"'
  postKubeadmCommands:
    - 'echo "====> Applying post Kubeadm commands"'
```

### Ubuntu Pro

Ubuntu Pro is a security and maintenance subscription offering from Canonical that offers long-term security support and
many other security hardening features. Ubuntu Pro offers several more benefits than the free Ubuntu offering:

<br />

- Extended Security Maintenance

- Kernel Livepatch service to avoid reboots

- FIPS 140-3 Level 1 certified crypto modules

- Common Criteria EAL2

For more information, refer to the [Ubuntu Pro](https://ubuntu.com/pro) documentation from Canonical.

You can enable Ubuntu Pro when deploying clusters with Palette. To enable Ubuntu Pro, select Ubuntu as the OS for a
cluster profile and expand the **Preset Menu** to reveal the Ubuntu Pro parameters.

| Parameter        | Description                                                                                                                                                                                                                                                         | Default Value |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **token**        | The Canonical subscription token for Ubuntu Pro. Refer to the Ubuntu Pro [subscribe page](https://ubuntu.com/pro/subscribe) to aquire a subscription token.                                                                                                         | `""`          |
| **esm-apps**     | Expanded Security Maintenance (ESM) for Applications. Refer to the Ubuntu [ESM documentation](https://ubuntu.com/security/esm) to learn more.                                                                                                                       | Disabled      |
| **livepatch**    | Canonical Livepatch service. Refer to the Ubuntu [Livepatch](https://ubuntu.com/security/livepatch) documenation for more details.                                                                                                                                  | Disabled      |
| **fips**         | Federal Information Processing Standards (FIPS) 140 validated cryptography for Linux workloads on Ubuntu. This installs NIST-certified core packages. Refer to the Ubuntu [FIPS](https://ubuntu.com/security/certifications/docs/2204) documentation to learn more. | Disabled      |
| **fips-updates** | Install NIST-certified core packages with priority security updates. Refer to the Ubuntu [FIPS Updates](https://ubuntu.com/security/certifications/docs/fips-updates) documentation to learn more.                                                                  | Disabled      |
| **cis**          | Gain access to OpenSCAP-based tooling that automates both hardening and auditing with certified content based on published CIS benchmarks. Refer to the Ubuntu [CIS](https://ubuntu.com/security/certifications/docs/2204/usg/cis) documentation to learn more.     | Disabled      |

Use the following steps to enable Ubuntu Pro.

<br />

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Click on **Add Cluster Profile**.

4. Fill out the input fields for **Name**, **Version**, **Description**, **Type** and **Tags**. Click on **Next** to
   continue.

5. Select the infrastructure provider and click on **Next**.

6. Select the OS layer and use the following information to find the Ubuntu pack:

- **Pack Type** - OS

- **Registry** - Public Repo

- **Pack Name** -Ubuntu

- **Pack Version** - 20.04 or 22.04

7. Modify the Ubuntu **Pack values** to activate the **Presets** options for the Ubuntu YAML file. Click on the
   **\</\>** button to reveal the YAML editor and expand the **Preset Drawer**.

<br />

![A view of the cluster profile creation wizard for Ubuntu Pro](/integrations_ubuntu_ubuntu-pro-preset-drawer.webp)

8. Click the **Ubuntu Advantage/Pro** checkbox to include the Ubuntu Pro parameters in the pack configuration file.

9. Toggle options on or off to enable or disable the various Ubuntu Pro services.

10. Click the **Next layer** button to continue to the next layer.

11. Complete the remainder of the cluster profile creation wizard by selecting the next cluster profile layers.

<br />

</TabItem>
<TabItem label="Deprecated" value="deprecated">

All Ubuntu versions less than v20.04.x are considered deprecated. Upgrade to a newer version to take advantage of new
features.

</TabItem>
</Tabs>

## Terraform

You can reference Ubuntu in Terraform with the following code snippet.

<br />

<Tabs queryString="platform">
<TabItem label="Edge" value="edge">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "edge-native-ubuntu"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="MaaS" value="mass">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-maas"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="vSphere" value="vSphere">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-vsphere"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="OpenStack" value="open-stack">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-openstack"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="AWS" value="aws">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-aws"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="Azure" value="azure">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-azure"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
<TabItem label="GCP" value="gcp">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-gcp"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
</Tabs>

## References

- [Create a Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)

- [Ubuntu Documentation](https://docs.ubuntu.com)

- [Ubuntu Pro Documentation](https://ubuntu.com/server/docs)

- [Kubernetes API Server Configuration](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver)
