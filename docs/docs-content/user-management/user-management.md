---
sidebar_label: "User & Role Management"
title: "User Management"
description:
  "Learn how to manage users and roles in Palette. Palette has a rich RBAC system that allows you to manage user access
  to resources."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "roles"
tags: ["user-management"]
---

Palette is designed to help you implement a least-privilege access model. It allows you to manage users and teams
effectively and supports multiple authentication methods. Additionally, Palette features a comprehensive role-based
access control (RBAC) system and the ability to apply attribute-based access control (ABAC).

## User Authentication

You can log into Palette through the Palette user interface and interact with the platform through a web browser. You
can also interact with Palette programmatically through the API. Review the
[User Authentication](./authentication/authentication.md) section to learn more about the different supported
authentication methods.

## Users and Teams

You can create users and teams in Palette to manage access and permissions. Users are individual entities that can log
in to Palette and perform actions based on their assigned roles. Teams are groups of users to whom you can assign roles,
reducing the challenges of managing user access at the individual level. Check out the
[Users and Teams](./users-and-teams/users-and-teams.md) section to learn more about managing users and teams.

## Roles and Permissions

Roles are assigned to users and teams and determine a user's actions in Palette. Palette roles are designed to be
flexible and can be customized to meet your organization's needs. Actions in Palette are controlled by permissions, for
every component in Palette, a set of permissions is exposed for you to apply granular access control. To learn more
about roles and permissions in Palette, review the [Roles and Permissions](./palette-rbac/palette-rbac.md) section.

## SAML and OIDC SSO

Palette supports integration with Identity Providers (IDP) to manage user access. Palette supports the Security
Assertion Markup Language (SAML) and OpenID Connect (OIDC) protocols for Single Sign-On (SSO). You can use an IDP to
authenticate users and manage their access to Palette, including cluster access. To learn how to configure an IDP, refer
to the [SAML and OIDC SSO](./saml-sso/saml-sso.md) section.

## Resources

- [User Authentication](./authentication/authentication.md)

- [Users and Teams](./users-and-teams/users-and-teams.md)

- [Roles and Permissions](./palette-rbac/palette-rbac.md)

- [SAML and OIDC SSO](./saml-sso/saml-sso.md)
