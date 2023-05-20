---
title: "Security Principles"
metaTitle: "Security Principles"
metaDescription: "Learn about Spectro Cloud security principles for Palette."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Our security philosophy is grounded in the following.

<br />

- **Confidentiality**: Preserving authorized restrictions on information access and disclosure to protect personal privacy and proprietary data. This includes confirming identity and access rights to resources.


- **Integrity**: Protecting data against unauthorized modification - either accidental or deliberate.


- **Availability**: Protecting the services that provide data access.


- **Authorization**: Applying access rights through privileges or access levels to secure resources such as data, services, files, applications, and more.


- **Authentication**: Confirming the identity of the entity that wants to interact with a secure system.


- **Auditing**: Tracking implementation-level and domain-level events to ensure that certain actions have been performed in the product. 

We apply the core security principles described below to our decision-making and product. 

<br />

## Secure by Design

Your data security is a core business requirement, not just a technical feature. This principle is implemented during the design phase of our product feature development lifecycle to dramatically reduce the number of exploitable flaws and prevent them from being introduced in a release.

<br />

## Secure by Default

We believe that security should be the default setting for all of our systems and software. Our products are secure to use out-of-the-box with little or no configuration needed and at no additional cost – such as multi-factor authentication (MFA), audit logs, and access control for sensitive information.

<br />

## Never Rely on Obscurity

We believe that using security through obscurity is essentially the absence of a security strategy. STO is a concept that some organizations use to secure their network and applications by enforcing secrecy as the main security method. However, if developers use STO as their sole security method, everything on the network is at risk if an attacker gains access to the network. 

Determined attackers can employ various methods to discover or deduce the hidden details of a system. Discovery will eventually happen, either accidentally or on purpose. We believe that while obscurity alone is not a robust security strategy, it can be layered with security policies and controls. This is the principle of Defense in Depth.

<br />

## Defense in Depth

We believe security should be layered and redundant with multiple defenses in place to protect against different types of attack. The intent is to provide redundancy in the event a security control fails or a vulnerability is exploited.

<br />

## Least Privilege

This principle encourages system designers and implementers to allow running code with only the permissions needed to complete the required tasks and no more. 

We use the principle of least privilege to ensure that all users have only the necessary access rights to fulfill their job roles. Mechanisms that we use include defined access rights, regular reviews, restricted privileges, and system monitoring to ensure the security of our users and systems.

<br />

## Secrets Handling

We use the following methods for secrets handling, which contribute to a robust and resilient security infrastructure.

<br />

- A secure password manager. 


- Dynamic secret retrieval to reduce the risk of unauthorized access, limits the exposure of sensitive data, and automates the secret rotation process.


- Multi-Factor Authentication (MFA) & Single Sign-On (SSO).

Regular internal reviews and audits of our setup ensure our employees have access to the tools they need while maintaining strong security standards.

<br />

## Continuous Improvement

We believe security is an ongoing process and are committed to constantly improving our security posture through regular assessment and testing.

<br />

<br />

<br />

<br />
