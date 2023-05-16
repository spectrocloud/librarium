---
title: "Security Bulletins"
metaTitle: "Security Bulletins"
metaDescription: "Security bulletins for Common Vulnerabilities and Exposures (CVEs)"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The following are security advisories for Palette and other related Spectro Cloud related resources.

Our security advisories follow the [CVSS standards](https://www.first.org/cvss/v3.1/specification-document#Qualitative-Severity-Rating-Scale).

| Rating   | CVSS Score |
|----------|------------|
| None     | 0.0        |
| Low      | 0.1- 3.9   |
| Medium   | 4.0 - 6.9  |
| High     | 7.0 - 8.9  |
| Critical | 9.0 - 10.0 |


# Security Bulletins

## March 20, 2023 - CVE-2023-22809 Sudo Vulnerability in Palette - 7.8 CVSS

A security vulnerability in `sudo -e` option (aka *sudoedit*) allows a malicious user with sudoedit privileges to edit arbitrary files. The Palette container `palette-controller-manager:mold-manager` incorporates a sudo version affected by sudoers policy bypass in sudo when using sudoedit.

All versions of Palette before  v2.6.70 are affected.

<br />

#### Impact

A local user with permission to edit files can use this flaw to change a file not permitted by the security policy, resulting in privilege escalation.

<br />

#### Resolution

* For Palette SaaS, this has been addressed and requires no user action. 
* For ​​Palette self-hosted deployments, please upgrade to newer versions greater than or equal to  v2.6.70 to address the reported vulnerability.
  
<br />

#### Workarounds

None.

<br />

#### References

* [CVE-2023-22809](https://nvd.nist.gov/vuln/detail/cve-2023-22809)


## August 4, 2022 - CVE-2022-1292 c_rehash script vulnerability in vSphere CSI pack - 9.8 CVSS

On May 3 2022, OpenSSL published a security advisory disclosing a command injection vulnerability in the `c_rehash` script included with the OpenSSL library. Some operating systems automatically execute this script as a part of normal operations, which could allow an attacker to execute arbitrary commands with elevated privileges.

Palette is not directly affected by this vulnerability. However, if your cluster profile is using the vSphere CSI pack, version v2.3 or below, it contains a vulnerable version of the `c_rehash` script.


<br />

#### Impact

The `c_rehash` script does not sanitize shell metacharacters properly to prevent command injection. This script is distributed by some operating systems, and by extension, in container images, in a manner where it is automatically executed. On such operating systems, an attacker could execute arbitrary commands with the privileges of the script.

<br />

#### Resolution

This vulnerability has been addressed in the vSphere CSI pack greater than or equal to version v2.6.

<br />

#### Workarounds

Update cluster profiles using the vSphere CSI pack to version v2.6 or greater. Apply the updated cluster profile changes to all clusters consuming the cluster profile.

<br />

#### References

- [CVE-2022-1292](https://nvd.nist.gov/vuln/detail/CVE-2022-1292)


<br />
<br />