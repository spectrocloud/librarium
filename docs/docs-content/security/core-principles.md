---
sidebar_label: "Core Principles"
title: "Core Principles"
description: "Learn about Spectro Cloud security principles for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["security"]
---

Security is about controlling who can interact with your information, what they can do with it, and when they can
interact with it.

We use the Confidentiality, Integrity, and Availability (CIA) Triad as the framework that guides the security and
controls we provide in our products and services. This framework is often extended with Authentication, Authorization,
and Auditing. Components of the CIA Triad are described below.

<br />

- **Confidentiality**: Preserve authorized restrictions on information access and disclosure to protect personal privacy
  and proprietary data. This includes confirming identity and access rights to resources.

- **Integrity**: Protect data against unauthorized modification - either accidental or deliberate.

- **Availability**: Protect the services that provide data access.

- **Authorization**: Apply access rights through privileges or access levels to secure resources such as data, services,
  files, applications, and more.

- **Authentication**: Confirm the identity of the entity that wants access to a secure system.

- **Auditing**: Track implementation-level and domain-level events to ensure certain actions have been performed in the
  product.

# Core Principles

Our security philosophy is grounded in the following core principles that we apply to our decision-making and product.

<br />

## Secure by Design

Your data security is a core business requirement, not just a technical feature. We apply this principle during the
design phase of our product feature development lifecycle to dramatically reduce the number of exploitable flaws and
prevent them from being introduced in a release.

<br />

## Secure by Default

We believe that security should be the default setting for all of our systems and software. Our products are secure to
use out-of-the-box with little or no configuration needed and at no additional cost – such as audit logs and access
control for sensitive information. Palette also supports Multi-Factor authentication (MFA) using external Identify
Providers (IDP), such as Okta.

<br />

## Never Rely Just on Obscurity

We believe that using security through obscurity by itself is the absence of a security strategy. While some
organizations use this method as their main security method, it puts their network at risk if an attacker gains access
to obscure resources.

Determined attackers use various methods to discover the hidden details of a system, and discovery eventually happens -
either accidentally or deliberately. We believe that while obscurity alone is not a robust security strategy, it can be
layered with security policies and controls. This is the principle of Defense in Depth.

<br />

## Defense in Depth

We believe security should be layered and redundant with multiple defenses in place to protect against different types
of attack. The intent is to provide redundancy in the event a security control fails or a vulnerability is exploited.

<br />

## Least Privilege

This principle encourages system designers and implementers to allow runtime code with only the permissions needed to
complete the required tasks and no more.

We use the principle of least privilege to ensure that all users have only the necessary access rights to fulfill their
job roles. To ensure the security of our users and systems, we use mechanisms such as defined access rights, regular
reviews, restricted privileges, and system monitoring.

<br />

## Secrets Handling

We use the following methods for secrets handling, which contribute to a robust and resilient security infrastructure.

<br />

- Secure password manager.

- Dynamic secret retrieval, which automates the secret rotation process to reduce the risk of unauthorized access and
  limit sensitive data exposure.

- MFA and Single Sign-On (SSO).

## Continuous Improvement

We believe security is an ongoing process, and we are committed to constantly improving our security posture through
regular assessment and testing.

We review and audit our internal setup regularly to ensure our employees have access to the tools they need while
maintaining strong security standards.
