---
sidebar_label: "Users and Teams"
title: "Users and Teams"
description: "Manage users and teams in Palette"
hide_table_of_contents: false
sidebar_position: 10
tags: ["user-management", "teams", "users"]
---

Users and teams are the core entities in Palette that help you manage access and permissions. Users are individual
entities that can log in to Palette and perform actions based on their assigned roles. Teams are groups of users to whom
you can assign roles, reducing the challenges of managing user access at the individual level.

## Users

Users can be created by tenant administrators or other users with a tenant role that has the `user.create` permission.
To learn how to create and manage users, refer to the [Create and Manage a User](./create-user.md) guide.

## Teams

Teams are made up of users. A team can have multiple users, and each user can belong to multiple teams. Teams are
assigned roles, which determine the permissions and access levels of the users in the team. To learn how to create and manage teams, refer to the [Create and Manage a Team](./create-a-team.md) guide.

## Manage User Access with Identity Providers

Palette supports integration with Identity Providers (IDP) to manage user access. You can use an IDP to authenticate
users and manage their access to Palette. If you use an IDP, user management is handled by the IDP, meaning you no
longer create and manage the user accounts in Palette. User permissions are determined by the Palette team to which users are mapped in the IDP and the Palette roles assigned to that team.

To learn how to configure an IDP, refer to the [SAML and OIDC SSO Setup](../saml-sso/saml-sso.md) section and the
various IDP-specific guides.

## Resources

- [Create and Manage a User](./create-user.md)

- [Create and Manage a Team](./create-a-team.md)

- [SAML and OIDC SSO Setup](../saml-sso/saml-sso.md)
