---
sidebar_label: "CVE Reports"
title: "CVE Reports"
description: "Security bulletins for Common Vulnerabilities and Exposures (CVEs) related to Palette and Palette VerteX"
icon: ""
hide_table_of_contents: true
sidebar_position: 0
toc_max_heading_level: 2
tags: ["security", "cve"]
---

# Security Bulletins

The vulnerabilities reported in this Security Bulletin include vulnerabilities within the Palette VerteX airgap solution
and third-party component vulnerabilities, which we have become aware of. Some of the listed vulnerabilities below have
been fixed in new versions of our products and released in the last month. These vulnerabilities are discovered via our
Bug Bounty program, our security monitoring program, or reported to us by our supply chain.

:::info

The CVSS Severity is provided by either the third-party service provider, or NIST CVE. We do not provide the criticality
score for third-party components. Previous security bulletins are available in the
[Security Bulletins Archive](../../unlisted/cve-reports.md).

:::

To fix all the vulnerabilities impacting your products, we recommends patching your instances to the latest version
regarding any third-party components. For vulnerabilities originating in our products, we will provide mitigations and
workarounds where applicable.

Click on the CVE ID to view the full details of the vulnerability.

| CVE ID                                          | Initial Pub Date | Modified Date | Impacted Product & Version | Vulnerability Type                      | CVSS Severity                                            | Status        |
| ----------------------------------------------- | ---------------- | ------------- | -------------------------- | --------------------------------------- | -------------------------------------------------------- | ------------- |
| [CVe-2023-52425](./cve-2023-52425.md)           | 02/04/2024       | 06/14/2024    | Palette 4.4.8              | Third-party component: vSphere-CSI      | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-52425)   | :mag: Ongoing |
| [CVE-2024-21626](./cve-2024-21626.md)           | 1/3/24           | 2/18/24       | Palette 4.4.8              | Third-party component: kube-proxy       | [8.6](https://nvd.nist.gov/vuln/detail/CVE-2024-21626)   | :mag: Ongoing |
| [CVE-2022-41723](./cve-2022-41723.md)           | 2/28/23          | 11/25/23      | Palette 4.4.8              | Third-party component: CoreDNS          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-41723)   | :mag: Ongoing |
| [GHSA-m425-mq94-257g](./ghsa-m425-mq94-257g.md) | 10/25/23         | 10/25/23      | Palette 4.4.8              | Third-party component: CoreDNS          | [7.5](https://github.com/advisories/GHSA-m425-mq94-257g) | :mag: Ongoing |
| [CVE-2022-4450](./cve-2022-4450.md)             | 2/8/23           | 2/4/24        | Palette 4.4.8              | Third-party component: OpenSSL          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-4450)    | :mag: Ongoing |
| [CVE-2023-45142](./cve-2023-45142.md)           | 10/12/23         | 2/18/24       | Palette 4.4.8              | Third-party component: OpenTelemetry-Go | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-45142)   | :mag: Ongoing |
| [CVE-2023-0464](./cve-2023-0464.md)             | 3/22/23          | 6/21/24       | Palette 4.4.8              | Third-party component: OpenSSL          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-0464)    | :mag: Ongoing |
| [CVE-2023-39325](./cve-2023-39325.md)           | 10/11/23         | 4/28/24       | Palette 4.4.8              | Third-party component: Go project       | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-39325)   | :mag: Ongoing |
| [CVE-2023-0215](./cve-2023-0215.md)             | 2/28/23          | 6/21/24       | Palette 4.4.8              | Third-party component: OpenSSL          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-0215)    | :mag: Ongoing |
| [CVE-2023-47108](./cve-2023-47108.md)           | 11/20/23         | 11/20/23      | Palette 4.4.8              | Third-party component: OpenTelemetry-Go | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-47108)   | :mag: Ongoing |
| [CVE-2023-0286](./cve-2023-0286.md)             | 2/8/23           | 2/4/24        | Palette 4.4.8              | Third-party component: OpenSSL          | [7.4](https://nvd.nist.gov/vuln/detail/CVE-2023-0286)    | :mag: Ongoing |
| [CVE-2020-1971](./cve-2020-1971.md)             | 12/8/20          | 6/21/24       | Palette 4.4.8              | Third-party component: Ubuntu           | [5.9](https://nvd.nist.gov/vuln/detail/CVE-2020-1971)    | :mag: Ongoing |
| [CVE-2021-3449](./cve-2021-3449.md)             | 3/25/21          | 6/21/24       | Palette 4.4.8              | Third-party component: Ubuntu           | [5.9](https://nvd.nist.gov/vuln/detail/CVE-2021-3449)    | :mag: Ongoing |
| [CVE-2021-3711](./cve-2021-3711.md)             | 8/24/12          | 6/21/24       | Palette 4.4.8              | Third-party component: Ubuntu           | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2021-3711)    | :mag: Ongoing |
| [CVE-2022-0778](./cve-2022-0778.md)             | 3/15/22          | 6/21/24       | Palette 4.4.8              | Third-party component: Ubuntu           | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-0778)    | :mag: Ongoing |
| [CVE-2021-45079](./cve-2021-45079.md)           | 1/31/22          | 11/6/23       | Palette 4.4.8              | Third-party component: Ubuntu           | [9.1](https://nvd.nist.gov/vuln/detail/CVE-2021-45079)   | :mag: Ongoing |
| [CVE-2023-5528](./cve-2023-5528.md)             | 11/14/23         | 1/19/24       | Palette 4.4.8              | Third-party component: vSphere-CSI      | [8.8](https://nvd.nist.gov/vuln/detail/CVE-2023-5528)    | :mag: Ongoing |
| [CVE-2023-44487](./cve-2023-44487.md)           | 10/10/23         | 6/27/24       | Palette 4.4.8              | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-44487)   | :mag: Ongoing |
| [CVE-2022-25883](./cve-2022-25883.md)           | 6/21/23          | 11/6/24       | Palette 4.4.8              | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-25883)   | :mag: Ongoing |
| [CVE-2015-8855](./cve-2015-8855.md)             | 1/23/17          | 1/26/12       | Palette 4.4.8              | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2015-8855)    | :mag: Ongoing |
| [PRISMA-2022-0227](./prisma-2022-0227.md)       | 9/12/23          | 9/12/23       | Palette 4.4.8              | Third-party component: vSphere-CSI      | N/A                                                      | :mag: Ongoing |
