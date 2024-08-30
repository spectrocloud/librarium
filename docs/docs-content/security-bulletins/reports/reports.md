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
and third-party component vulnerabilities, which we have become aware of. These vulnerabilities are discovered via our
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

| CVE ID                                          | Initial Pub Date | Modified Date | Impacted Product & Version | Vulnerability Type                      | CVSS Severity                                            | Status                     |
| ----------------------------------------------- | ---------------- | ------------- | -------------------------- | --------------------------------------- | -------------------------------------------------------- | -------------------------- |
| [CVE-2024-21626](./cve-2024-21626.md)           | 1/3/24           | 2/18/24       | Palette 4.4.11 & 4.4.14    | Third-party component: kube-proxy       | [8.6](https://nvd.nist.gov/vuln/detail/CVE-2024-21626)   | :mag: Ongoing              |
| [CVE-2022-41723](./cve-2022-41723.md)           | 2/28/23          | 11/25/23      | Palette 4.4.11 & 4.4.14    | Third-party component: CoreDNS          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-41723)   | :mag: Ongoing              |
| [GHSA-m425-mq94-257g](./ghsa-m425-mq94-257g.md) | 10/25/23         | 10/25/23      | Palette 4.4.11 & 4.4.14    | Third-party component: CoreDNS          | [7.5](https://github.com/advisories/GHSA-m425-mq94-257g) | :mag: Ongoing              |
| [CVE-2023-45142](./cve-2023-45142.md)           | 10/12/23         | 2/18/24       | Palette 4.4.11 & 4.4.14    | Third-party component: OpenTelemetry-Go | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-45142)   | :mag: Ongoing              |
| [CVE-2023-0464](./cve-2023-0464.md)             | 3/22/23          | 6/21/24       | Palette 4.4.11 & 4.4.14    | Third-party component: OpenSSL          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-0464)    | :mag: Ongoing              |
| [CVE-2023-39325](./cve-2023-39325.md)           | 10/11/23         | 4/28/24       | Palette 4.4.11 & 4.4.14    | Third-party component: Go project       | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-39325)   | :mag: Ongoing              |
| [CVE-2023-47108](./cve-2023-47108.md)           | 11/20/23         | 11/20/23      | Palette 4.4.11 & 4.4.14    | Third-party component: OpenTelemetry-Go | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-47108)   | :mag: Ongoing              |
| [CVE-2023-44487](./cve-2023-44487.md)           | 10/10/23         | 6/27/24       | Palette 4.4.11 & 4.4.14    | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-44487)   | :mag: Ongoing              |
| [CVE-2022-25883](./cve-2022-25883.md)           | 6/21/23          | 11/6/24       | Palette 4.4.11             | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-25883)   | :mag: Ongoing              |
| [CVE-2015-8855](./cve-2015-8855.md)             | 1/23/17          | 1/26/12       | Palette 4.4.11             | Third-party component: CAPI             | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2015-8855)    | :mag: Ongoing              |
| [CVE-2019-12900](./cve-2019-12900.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: BZ2              | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2019-12900)   | :mag: Ongoing              |
| [CVE-2023-37920](./cve-2023-37920.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Certifi          | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)   | :mag: Ongoing              |
| [CVE-2019-1010022](./cve-2019-1010022.md)       | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: GNU Libc         | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2019-1010022) | :mag: Ongoing              |
| [CVE-2016-1585](./cve-2016-1585.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Ubuntu           | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2016-1585)    | :mag: Ongoing              |
| [CVE-2018-20839](./cve-2018-20839.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2018-20839)   | :mag: Ongoing              |
| [CVE-2024-38428](./cve-2024-38428.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [9.1](https://nvd.nist.gov/vuln/detail/CVE-2024-38428)   | :mag: Ongoing              |
| [CVE-2021-42694](./cve-2021-42694.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [8.3](https://nvd.nist.gov/vuln/detail/CVE-2021-42694)   | :mag: Ongoing              |
| [CVE-2021-39537](./cve-2021-39537.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [8.8](https://nvd.nist.gov/vuln/detail/CVE-2021-39537)   | :mag: Ongoing              |
| [CVE-2019-9923](./cve-2019-9923.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-9923)    | :mag: Ongoing              |
| [CVE-2020-36325](./cve-2020-36325.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Jansson          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2020-36325)   | :mag: Ongoing              |
| [CVE-2005-2541](./cve-2005-2541.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [10.0](https://nvd.nist.gov/vuln/detail/CVE-2005-2541)   | :mag: Ongoing              |
| [CVE-2019-9937](./cve-2019-9937.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-9937)    | :mag: Ongoing              |
| [CVE-2019-9936](./cve-2019-9936.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-9936)    | :mag: Ongoing              |
| [CVE-2019-19244](./cve-2019-19244.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-19244)   | :mag: Ongoing              |
| [CVE-2016-20013](./cve-2016-20013.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Ubuntu           | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2016-20013)   | :mag: Ongoing              |
| [CVE-2022-0391](./cve-2022-0391.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-0391)    | :mag: Ongoing              |
| [CVE-2021-3737](./cve-2021-3737.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2021-3737)    | :mag: Ongoing              |
| [CVE-2019-9674](./cve-2019-9674.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-9674)    | :mag: Ongoing              |
| [CVE-2023-26604](./cve-2023-26604.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Ubuntu           | [7.8](https://nvd.nist.gov/vuln/detail/CVE-2023-26604)   | :mag: Ongoing              |
| [CVE-2015-20107](./cve-2015-20107.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.6](https://nvd.nist.gov/vuln/detail/CVE-2015-20107)   | :mag: Ongoing              |
| [CVE-2017-11164](./cve-2017-11164.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: Ubuntu           | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2017-11164)   | :mag: Ongoing              |
| [CVE-2018-20225](./cve-2018-20225.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.8](https://nvd.nist.gov/vuln/detail/CVE-2018-20225)   | :mag: Ongoing              |
| [CVE-2022-41409](./cve-2022-41409.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-41409)   | :mag: Ongoing              |
| [CVE-2019-17543](./cve-2019-17543.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [8.1](https://nvd.nist.gov/vuln/detail/CVE-2019-17543)   | :mag: Ongoing              |
| [CVE-2022-4899](./cve-2022-4899.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-4899)    | :mag: Ongoing              |
| [CVE-2018-20657](./cve-2018-20657.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2018-20657)   | :mag: Ongoing              |
| [CVE-2023-27534](./cve-2023-27534.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [8.8](https://nvd.nist.gov/vuln/detail/CVE-2023-27534)   | :mag: Ongoing              |
| [CVE-2023-32636](./cve-2023-32636.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-32636)   | :mag: Ongoing              |
| [CVE-2023-29499](./cve-2023-29499.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2023-29499)   | :mag: Ongoing              |
| [CVE-2024-24790](./cve-2024-24790.md)           | 8/6/24           | 8/6/24        | Palette 4.4.11 & 4.4.14    | Third-party component: Go Project       | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2024-24790)   | :mag: Ongoing              |
| [CVE-2023-4156](./cve-2023-4156.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.1](https://nvd.nist.gov/vuln/detail/CVE-2023-4156)    | :mag: Ongoing              |
| [CVE-2022-23990](./cve-2022-23990.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2022-23990)   | :mag: Ongoing              |
| [CVE-2020-35512](./cve-2020-35512.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: MongoDB          | [7.8](https://nvd.nist.gov/vuln/detail/CVE-2020-35512)   | :mag: Ongoing              |
| [CVE-2012-2663](./cve-2012-2663.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: iPtables         | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2012-2663)    | :mag: Ongoing              |
| [CVE-2019-9192](./cve-2019-9192.md)             | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: GNU C Library    | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2019-9192)    | :mag: Ongoing              |
| [CVE-2018-20796](./cve-2018-20796.md)           | 08/16/24         | 08/16/24      | Palette 4.4.14             | Third-party component: GNU C Library    | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2018-20796)   | :mag: Ongoing              |
| [GHSA-74fp-r6jw-h4mp](./ghsa-74fp-r6jw-h4mp.md) | 10/25/23         | 10/25/23      | Palette 4.4.11 & 4.4.14    | Third-party component: Kubernetes API   | [7.5](https://github.com/advisories/GHSA-74fp-r6jw-h4mp) | :mag: Ongoing              |
| [CVE-2024-35325](./cve-2024-35325.md)           | 08/27/24         | 08/30/24      | Palette 4.4.14             | Third-party component: Libyaml          | [9.8](https://nvd.nist.gov/vuln/detail/CVE-2024-35325)   | :white_check_mark: Ongoing |
| [CVE-2024-6197](./cve-2024-6197.md)             | 08/27/24         | 08/30/24      | Palette 4.4.14             | Third-party component: Libcurl          | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2024-6197)    | :mag: Ongoing              |
| [CVE-2024-37371](./cve-2024-37371.md)           | 08/30/24         | 08/30/24      | Palette 4.4.14             | Third-party component: MIT Kerberos     | [9.1](https://nvd.nist.gov/vuln/detail/CVE-2024-37371)   | :mag: Ongoing              |
| [CVE-2024-37370](./cve-2024-37370.md)           | 08/30/24         | 08/30/24      | Palette 4.4.14             | Third-party component: MIT Kerberos     | [7.5](https://nvd.nist.gov/vuln/detail/CVE-2024-37370)   | :mag: Ongoing              |
