---
title: "Security Bulletins"
metaTitle: "Security Bulletins"
metaDescription: "Security bulletins for Common Vulnerabilities and Exposures (CVEs)"
icon: ""
hideToC: false
fullWidth: false
---

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

A security vulnerability in `sudo -e` option (aka *sudoedit*) allows a malicious user with sudoedit privileges to edit arbitrary files. Palette on-prem container `palette-controller-manager:mold-manager` incorporates a sudo version affected by sudoers policy bypass in sudo when using sudoedit.

All versions of Palette anterior to 2.6.70 are affected.

<br />

#### Impact

A local user permitted to edit certain files can take advantage of this flaw to edit a file not permitted by the security policy, resulting in privilege escalation.

<br />

#### Resolution

* For SaaS platforms (multi-tenant or dedicated), the concerned container image was not used in newer versions of Palette starting in 3.0.
* For ​​self-hosted deployments, the 2.6.70 version contains the fix for the reported vulnerability.
  
<br />

#### Workarounds

None.

<br />

#### References

* [CVE-2023-22809](https://nvd.nist.gov/vuln/detail/cve-2023-22809)


## August 4, 2022 - CVE-2022-1292 c_rehash script vulnerability in vSphere CSI pack - 9.8 CVSS

On May 3 2022, OpenSSL published a security advisory disclosing a command injection vulnerability in the `c_rehash` script included with the library. Some operating systems automatically execute this script as a part of normal operations which could allow an attacker to execute arbitrary commands with elevated privileges.

Palette is not directly affected by this vulnerability, but the vSphere CSI 2.3 provides a vulnerable version of the `c_rehash` script.

If the vSphere CSI 2.3 (and below) pack is used, all versions of Palette are affected.

<br />

#### Impact

The c_rehash script does not properly sanitize shell metacharacters to prevent command injection. This script is distributed by some operating systems (and by extension in container images) in a manner where it is automatically executed. On such operating systems, an attacker could execute arbitrary commands with the privileges of the script.

<br />

#### Resolution

This vulnerability has been fixed in the vSphere CSI pack 2.6.

<br />

#### Workarounds

None.

<br />

#### References

- [CVE-2022-1292](https://nvd.nist.gov/vuln/detail/CVE-2022-1292)


<br />
<br />