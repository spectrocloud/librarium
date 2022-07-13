---
title: 'Ubuntu'
metaTitle: 'Ubuntu Operating System'
metaDescription: 'Choosing Ubuntu as an Operating System within the Spectro Cloud console'
hiddenFromNav: true
isIntegration: true
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

<Tabs>
<Tabs.TabPane tab="LTS__20.4.x" key="LTS__20.4.x">

**Ubuntu LTS__20.04**

<br />
<br />

## Ubuntu 20.4.x to Kubernetes Dependency Matrix

| **Ububtu Version** | **Kubernetes** |
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
| **Ububtu Version** | **Kubernetes** |
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
| **Ububtu Version** | **Kubernetes** |
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

Spectro Golden images includes most of the hardening standards recommended by CIS benchmarking v1.5. You can include custom files to be copied over to the nodes and/or execute list of commands before or after`kubeadm init`/`join` is executed.

<br />
<br />

```yml
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
    targetPermissions: "0644""
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
Canonical Ubuntu Advantage extends your infrastructure's security, certified compliance, and 24x7 support. With Palette, enable the UA services when modifying the Pack Values. See below for steps on how to modify the Preset options.

**Benefits with UA**:

<br />

#### Enterprise 

- Extended Security Maintenance
- Kernel Livepatch service to avoid reboots
- FIPS 140-2 Level 1 certified crypto modules
- Common Criteria EAL2

<br />

#### Personal Use

- Free Personal Token for up to three machines with UAI.

For more information see [Ubuntu Advantage for Infrastructure](https://ubuntu.com/advantage) site.

## Modifying the Presets

1. Palette allows you to include the Ubuntu Advantage service in the **Profile Layers** section, when you create a new cluster profile. 


2. Give the new Pack a **Name**, **Version number**, **Description**, **Type**, and **Tags** and click the **Next** button.


3. Choose the cloud provider as the **Infrastructure provider** and click the **Next** button.


4. Edit the Packs with the following parameters:
    -  **Pack Type** - *OS*
  
    -  **Registry** - *Public Repo*
  
    -  **Pack Name** - *Ubuntu*
  
    -  **Pack Version** - *LTS_ _18.4.x or LTS-HWE__18.04 or LTS_ _20.4.x*



5.  Modify the Ubuntu **Pack values** to activate the **Presets** options for the Ubuntu YAML configuration file.  You can also make additional modifications to the original kubeadmconfig file.


6. Click the **Ubuntu Advantage** checkbox to include the UA parameters listed below in the configuration file.


7. Toggle on or off to enable or disable the UA services of your choice.


8. Once the file is updated, click the **Next layer** button to continue to the next layer.


## Notable Parameters

| **Services**  | **Option**     | **Values**                                             | **Description**                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | -------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Token**     |                |                                                        | Enter the token key in the text box. <br /> eg: C13RaHQDqgvvG3YsnXT6kQJqqLGxyz                                                                                                                                                                                                                                                                                                                   |
| **cis**       | enable/disable | true <br /> <br />  <br /> false                       | Get access to OpenSCAP-based tooling that automates both hardening and <br /> auditing with certified content based off of the published CIS benchmarks. <br />  <br /> Do not access OpenSCAP-based tooling.                                                                                                                                                                                    |       
| **esm-infra** | enable/disable | true <br /> <br />  <br /> <br />  <br /> <br /> false | Continue to receive security updates for the Ubuntu base OS, <br /> critical software packages and infrastructure components <br /> with Extended Security Maintenance (ESM). <br />  ESM provides five additional years of security maintenance, enabling an <br /> organization's continuous vulnerability management.  <br /> <br />  Do not receive security updates for Ubuntu Base OS etc. |
| **fips**      | enable/disable | true <br /> <br />  false                              | FIPS 140 validated cryptography for Linux workloads on Ubuntu. <br /><br /> Do not have FIPS 140 validated cryptography for Linux workloads on Ubuntu.                                                                                                                                                                                                                                           |
| **livepatch** | enable/disable | true <br /> <br />  <br />  <br /> false               | Livepatch eliminates the need for unplanned maintenance windows <br /> for high and critical severity kernel vulnerabilities by  <br /> patching the Linux kernel while the system runs.  <br /> <br /> Do not activate Livepatch.                                                                                                                                                               |


# References

[Ubuntu 18.04.6 LTS (Bionic Beaver)](https://releases.ubuntu.com/18.04/)


[Ubuntu 20.04.4 LTS (Focal Fossa)](https://releases.ubuntu.com/focal/)


[Ubuntu Advantage for Infrastructure](https://ubuntu.com/advantage)

