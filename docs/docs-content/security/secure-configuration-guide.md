---
sidebar_label: "Secure Configuration Guide"
title: "Secure Configuration Guide"
description:
  "Learn how to securely access and configure administrative accounts, adjust security-sensitive settings, and maintain
  a secure Palette or Palette VerteX tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["security"]
---

Palette and Palette VerteX provide tenant-level security controls that you can configure across all deployment models,
including multi-tenant SaaS, dedicated SaaS, and self-hosted environments. This guide covers how to securely manage
administrative accounts, configure security-sensitive tenant settings, and maintain a secure tenant configuration,
including recommended practices for role assignments, authentication, session management, and audit monitoring.

## Administrative Role Identification

Palette and Palette VerteX use role-based access control (RBAC) for tenant resources. Within a customer tenant, the
highest-privileged built-in role is **Tenant Admin**. This role grants access to all resources in all projects and
allows administrators to access tenant settings. Refer to
[Tenant Scope Roles and Permissions](../user-management/palette-rbac/tenant-scope-roles-permissions.md) for more
information.

Because the Tenant Admin role can modify tenant-wide security configuration and access controls, it is considered the
top-level administrative account.

### Separation of Duties

You can implement separation of duties by
[creating custom tenant roles](../user-management/palette-rbac/create-custom-role.md). Custom roles allow you to assign
only the permissions required for specific responsibilities, avoiding the need to grant full Tenant Admin privileges to
users who only require limited operational access.

The following table provides examples of delegated responsibilities and the permissions they require.

| **Example Responsibility**  | **Example Permissions**                   |
| --------------------------- | ----------------------------------------- |
| **Identity Administration** | `user.create`, `user.update`, `role.list` |
| **Audit Reviewer**          | `audit.get`, `audit.list`                 |
| **Team Administration**     | `team.create`, `team.update`, `user.list` |

## Secure Administrative Account Lifecycle and Configuration Management

This section covers the full lifecycle of administrative accounts, from initial secure access through ongoing
configuration management and eventual decommissioning. It also describes security-relevant tenant settings and
configuration versioning practices.

### Secure Access and Tenant Security Configuration

Tenant admins access Palette or Palette VerteX through the web console or Palette API. We recommend the following
practices:

- Integrate tenant authentication with an enterprise Identity Provider (IdP) using Security Assertion Markup Language
  (SAML) or OpenID Connect (OIDC) Single Sign-On (SSO). Refer to
  [SAML and OIDC SSO](../user-management/saml-sso/saml-sso.md) for guidance.

- Enforce Multi-Factor Authentication (MFA) at the IdP level.

- Assign administrator access only to named individual users.

- Avoid shared administrative accounts.

#### SSO Secure Configuration

When configuring SAML-based SSO, apply the following secure authentication practices through your IdP configuration:

- [Enable encrypted SAML assertions](../user-management/saml-sso/encrypt-saml-assertions.md) to protect authentication
  tokens exchanged during the authentication process.

- Enforce MFA policies for administrative users through your IdP.

- Restrict access to authorized users or groups defined in your IdP.

#### Limit Tenant Admin Assignments

Restrict Tenant Admin privileges to users responsible for tenant-wide configuration and security management. Perform
daily operational tasks using lower-privilege roles or custom roles where possible. Refer to
[Tenant Scope Roles and Permissions](../user-management/palette-rbac/tenant-scope-roles-permissions.md) for details on
built-in roles.

#### Session Management

Tenant admins can configure a [session timeout](../tenant-settings/session-timeout.md) for tenants. The default timeout
is 240 minutes and applies to all tenant users. Shorter timeouts reduce the risk of session hijacking if a user leaves
an authenticated session unattended.

#### Login Banner

Tenant admins can configure a [login banner](../tenant-settings/login-banner.md) that users must acknowledge before
logging in through the tenant URL. Login banners are commonly used for the following purposes:

- Consent-to-monitor notices.

- Authorized use warnings.

- Regulatory compliance messaging.

#### Password Policy

Tenant admins can [configure tenant password requirements](../tenant-settings/password-policy.md). The following
parameters are configurable:

- Minimum and maximum password length.

- Uppercase, lowercase, digit, and special character requirements.

- Password expiration duration.

- Password complexity regex.

The default policy includes:

- Minimum length of six characters and maximum length of 64 characters.

- Uppercase, lowercase, digit, and special character required.

- Expiration of 365 days.

#### API Key Management

Palette supports API keys for programmatic access. API key characteristics include the following:

- The key value is displayed only once at the time of creation.

- Lost keys must be recreated.

- Keys grant permissions equivalent to the creating user.

Tenant admins can view and manage tenant API keys. We recommend the following practices:

- Create keys only when necessary.

- Assign expiration dates.

- Store keys in a secure secret management system.

- Revoke unused or stale keys.

Refer to [API Key Management](../tenant-settings/api-key-management.md) for details.

### Monitor Administrative Activity

Palette records tenant activity through [audit logs](../audit-logs/audit-logs.md). Audit logs include the following
information:

- User identity.

- Action performed.

- Resource affected.

- Timestamp.

Tenant-scoped audit logs show activity across projects and tenant-level actions. We recommend the following practices:

- Review audit logs regularly.

- Monitor administrative role changes.

- Monitor API key creation and revocation.

- Monitor authentication configuration changes.

### Decommission Administrative Accounts

Remove administrative access promptly when it is no longer required. Follow this offboarding procedure:

1. Remove the Tenant Admin role assignment. Refer to
   [Assign a Role](../user-management/palette-rbac/assign-a-role.md#remove-a-role-from-a-user) for instructions.

2. Disable or remove the user account in the organization's IdP.

3. [Revoke API keys](../user-management/authentication/api-key/revoke-api-key.md) created by the user.
   [Delete the key](../user-management//authentication/api-key/delete-api-key.md) if necessary.

4. Review [audit logs](../audit-logs/audit-logs.md) to confirm the changes.

### Configuration Versioning and Change Tracking

Palette and Palette VerteX allow you to define reusable configuration artifacts such as
[cluster profiles](../profiles/cluster-profiles/cluster-profiles.md),
[cluster templates](../cluster-templates/cluster-templates.md), and
[packs](../registries-and-packs/registries-and-packs.md) to deploy and manage workload clusters.

Cluster profiles represent versioned configuration definitions for Kubernetes cluster deployments and related
integrations. We recommend
[creating a new cluster profile version](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
when updating a profile that has already been used to deploy clusters. Cluster profile modifications may include updates
to:

- Profile layers.

- Referenced pack versions.

Cluster templates reference cluster profile versions and allow you to deploy clusters using predefined configuration
parameters. When configuration changes are required:

- Create a new version of the cluster profile.

- [Update cluster templates](../cluster-templates/modify-cluster-templates.md#update-cluster-profile-version) to
  reference the new cluster profile version.

This versioning model allows you to:

- Track configuration changes over time.

- Perform controlled rollouts of configuration updates.

- Maintain historical configuration definitions for audit or rollback purposes.

We recommend maintaining secure configuration baselines by:

- Defining hardened cluster profiles and templates.

- Versioning configuration updates rather than modifying existing deployed profiles.

- Documenting security-impacting configuration changes.

- Reviewing configuration versions during periodic security reviews.

## Security-Sensitive Tenant Settings

The following settings can be modified by Tenant Admins and have direct security impact.

| **Setting**                                                                                             | **Description**                                                                       | **Security Implication**                                      |                                            | -------------------------------------- |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------ | -------------------------------------- |
| -------------------------------------------------------------------------------------                   | **Additional Information**                                                            |                                                               |
| **API Key Management**                                                                                  | Enables creation and revocation of programmatic access credentials.                   | Unrevoked keys may allow                                      |
| persistent access.                                                                                      | [API Key Management](../tenant-settings/api-key-management.md)                        |                                                               | \*\*Audit Log Configuration and            |
| Export\*\*                                                                                              | Provides visibility into tenant activity.                                             | Missing or ignored logs reduce the ability to detect security |
| events.                                                                                                 | [Audit Logs](../audit-logs/audit-logs.md)                                             |                                                               | **IdP and SSO Configuration**              | Configures SAML or OIDC                |
| authentication integration.                                                                             | Misconfiguration may allow unauthorized authentication or bypass enterprise policies. |
| [SAML and OIDC SSO](../user-management/saml-sso/saml-sso.md)                                            |                                                                                       | **Login Banner**                                              | Displays security or legal notices         |
| before login.                                                                                           | Required for consent-to-monitor in many regulated environments.                       |
| [Login Banner](../tenant-settings/login-banner.md)                                                      |                                                                                       | **Password Policy**                                           | Defines password complexity and expiration |
| requirements.                                                                                           | Weak policies increase the risk of credential compromise.                             |
| [Password Policy](../tenant-settings/password-policy.md)                                                |                                                                                       | **Session Timeout**                                           | Defines the inactivity timeout for         |
| authenticated sessions.                                                                                 | Long sessions increase the risk of session hijacking.                                 |
| [Session Timeout](../tenant-settings/session-timeout.md)                                                |                                                                                       | **User and Role Assignments**                                 | Controls which users                       |
| receive administrative privileges.                                                                      | Excessive privileges increase the impact of account compromise.                       |
| [Tenant Scope Roles and Permissions](../user-management/palette-rbac/tenant-scope-roles-permissions.md) |

## Recommended Secure Configuration Baseline

If you operate regulated workloads, we recommend implementing the following baseline configuration:

- Enable SSO authentication and enforce MFA through your IdP.

- Restrict Tenant Admin privileges to only appropriate users.

- Use custom tenant roles for delegated administration.

- Configure a strong password policy.

- Configure a session timeout consistent with your organizational policy.

- Export or regularly review tenant audit logs.

- Assign expiration dates to API keys and revoke or delete unused or stale API keys.

- Configure a login banner where policy requires user acknowledgment.
