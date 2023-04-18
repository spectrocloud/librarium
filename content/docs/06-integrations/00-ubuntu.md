---
title: 'Ubuntu'
metaTitle: 'Ubuntu Operating System'
metaDescription: 'Choosing Ubuntu as an Operating System within the Palette console'
hiddenFromNav: true
type: "integration"
category: ['operating system']
logoUrl: 'https://registry.spectrocloud.com/v1/ubuntu-vsphere/blobs/sha256:09a727f9005b79c69d8e60e12ce130880c63131315b49e7fb4cc44e53d34dc7a?type=image/png'
---

import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';


# Ubuntu Operating System

Ubuntu is a Linux distribution, based on Debian and composed mostly of free and open-source software. It is one of the most popular operating systems across multiple public cloud platforms.

Palette supports the following Ubuntu versions to run clusters at scale.
<br />
<br />

## Version Supported

<br />
<br />

<Tabs>
<Tabs.TabPane tab="LTS__20.4.x" key="LTS__20.4.x">

**Ubuntu LTS__20.04**

<br />
<br />

## Ubuntu 20.4.x to Kubernetes Dependency Matrix

| **Ubuntu Version** | **Kubernetes** |
| ------------------ | -------------- |
| **LTS__20.04**     | 1.23.4         |
|                    | 1.22.7         |
|                    | 1.21.10        |


</Tabs.TabPane>
<Tabs.TabPane tab="LTS__18.4.x" key="LTS__18.4.x">

**Ubuntu LTS__18.04**

<br />
<br />

## Ubuntu 18.4.x to Kubernetes Dependency Matrix

| **Ubuntu Version** | **Kubernetes** |
| ------------------ | -------------- |
| **LTS__18.04**     | 1.21.10        |
|                    | 1.21.9         |
|                    | 1.20.14        |
|                    | 1.20.12        |
|                    | 1.19.16        |
|                    | 1.19.15        |

</Tabs.TabPane>
<Tabs.TabPane tab="LTS-HWE__18.4.x" key="LTS-HWE__18.4.x">

**Ubuntu LTS-HWE__18.04**

<br />
<br />

## Ubuntu 18.4.x to Kubernetes Dependency Matrix

| **Ubuntu Version** | **Kubernetes** |
| ------------------ | -------------- |
| **LTS-HWE__18.04** | 1.21.10        |
|                    | 1.21.9         |
|                    | 1.20.14        |
|                    | 1.20.12        |
|                    | 1.19.16        |
|                    | 1.19.15        |
</Tabs.TabPane>
</Tabs>


## Customize Your Image File

Spectro Golden images include most of the hardening standards recommended by CIS benchmarking v1.5. You can include custom files to be copied over to the nodes and/or execute the list of commands before or after `kubeadm init`/`join` is executed.

<br />
<br />

```yaml

kubeadmconfig:
  preKubeadmCommands:
  - echo "Executing pre kube admin config commands"
  - update-ca-certificates
  - 'systemctl restart containerd; sleep 3'
  - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
  postKubeadmCommands:
  - echo "Executing post kube admin config commands"
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
```

# Ubuntu Advantage

Ubuntu Advantage services extend your infrastructure's security, compliance, and productivity requirements. Enable the UA services when modifying the Pack Values in Palette. See below for steps on how to modify the Preset options.

**Benefits with UA**:

- Extended Security Maintenance
- Kernel Livepatch service to avoid reboots
- FIPS 140-2 Level 1 certified crypto modules
- Common Criteria EAL2

For more information see the [Ubuntu Advantage for Infrastructure](https://ubuntu.com/advantage) site.

<br/>
<br/>

## Modifying the Presets


1. Palette allows you to include the Ubuntu Advantage service in the **Profile Layers** section, when you create a new cluster profile.


2. Give the new Pack a **Name**, **Version number**, **Description**, **Type**, and **Tags** and click the **Next** button.


3. Choose the cloud provider as the **Infrastructure provider** and click **Next**.


4. Edit the Packs with the following parameters:
    -  **Pack Type** - *OS*

    -  **Registry** - *Public Repo*

    -  **Pack Name** - *Ubuntu*

    -  **Pack Version** - *LTS_ _18.4.x or LTS-HWE__18.04 or LTS_ _20.4.x*


5. Modify the Ubuntu **Pack values** to activate the **Presets** options for the Ubuntu YAML configuration file.  You can also make additional modifications to the original `kubeadmconfig` file.


6. Click the **Ubuntu Advantage** checkbox to include the UA parameters listed below in the configuration file.


7. Toggle on or off to enable or disable the UA services of your choice. See below for an explanation of the notable parameters that are available to use with Palette.


8. Once the file is updated, click the **Next layer** button to continue to the next layer.


## Notable Parameters


| **Service**  | **Options**    |  **Description**                                                                                                                                                                                                                                                                                                                                                                                |
| --------------- | -------------- | ------------------------------------------------------------------ | ------------------------------ |
|  **Token**      |                                    | Enter the token key in the text box. <br /> e.g.: C13RaHQDqgvvG3Ys|
| **ESM-infra** | enable <br /> <br /> <br /> <br /> <br /> disable | Continue to receive security updates for the Ubuntu base OS, critical software <br /> packages and infrastructure components with Extended Security Maintenance (ESM). <br /> ESM provides five additional years of security maintenance, enabling an organization's <br />continuous vulnerability management. <br /> <br /> Disable the ESM repository. Do not receive security updates for Ubuntu Base OS etc. |
|||||
|**Livepatch**| enable <br /> <br /> <br /> <br /> disable| Livepatch eliminates the need for unplanned maintenance windows <br /> for high and critical severity kernel vulnerabilities by patching the Linux <br /> kernel while the system runs. <br /> <br /> Do not enable/manage live kernel patching. The Livepatch service will be disabled. |
|||||
| **FIPS** | enable <br /> <br /> <br /> <br /> disable | Federal Information Processing Standards (FIPS) 140 validated cryptography for <br /> Linux workloads on Ubuntu. Install, configure, and enable <br /> FIPS 140 certified modules. <br /><br /> Do not have FIPS 140 validated cryptography for Linux workloads on Ubuntu.|
|||||
| **FIPS-updates** | enable <br /> <br /> <br /> disable | The option enables the FIPS-UPDATES. It installs the updated FIPS modules sets <br />it in FIPS mode. <br /><br /> Do not have FIPS 140 validated cryptography for Linux workloads on Ubuntu.|
|||||
| **CC-EAL** | enable <br /> <br /> <br /> <br /> <br /> disable | After the completion of a Common Criteria (CC) security evaluation, a grade is given <br /> indicating the level the system was tested. Common Criteria evaluated <br /> configuration is currently available for Ubuntu 16.04.4 LTS (Server) and <br /> Ubuntu 18.04.4 LTS (Server). The option shows as disabled for Ubuntu 20 & 20+. <br /> <br /> Do not install the CC artifacts. |
|||||
| **CIS**       | enable <br /> <br /> <br /> disable | Gain access to OpenSCAP-based tooling that automates both hardening and auditing with <br /> certified content based off of the published CIS benchmarks. <br /> <br /> Do not access OpenSCAP-based tooling.|


# References

[Ubuntu 18.04.6 LTS (Bionic Beaver)](https://releases.ubuntu.com/18.04/)


[Ubuntu 20.04.4 LTS (Focal Fossa)](https://releases.ubuntu.com/focal/)


[Ubuntu Advantage for Infrastructure](https://ubuntu.com/advantage)


[Common Criteria for Ubuntu](https://ubuntu.com/security/certifications/docs/16-18/cc)
