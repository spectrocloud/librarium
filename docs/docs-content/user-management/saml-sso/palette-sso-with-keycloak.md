---
sidebar_label: "Palette SSO with Keycloak"
title: "Enable SSO with Keycloak"
description: "Set up Palette SSO with Keycloak"
icon: ""
hide_table_of_contents: false
sidebar_position: 100
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "Keycloak"]
---

Keycloak is an open-source Identity and Access Management (IAM) tool, primarily used for simplifying the authentication and authorization processes in modern applications and services. It provides a wide range of features including Single Sign-On (SSO), two-factor authentication, and social login capabilities. Keycloak is designed to manage users, credentials, roles, and groups efficiently, enabling developers to secure their applications and services with minimal additional coding. Keycloak supports various industry-standard protocols like OpenID Connect, OAuth 2.0, and SAML 2.0, facilitating integration with a multitude of platforms and services.

You can integrate Keycloak with Palette to enable SSO for your users. This guide will walk you through the steps to set up Keycloak as an OIDC provider for Palette.

## Prerequisites

1. Access to Palette as a Tenant Admin.

2. The Keycloak service must be exposed on an external IP address, preferably with a domain name. Refer to the [Configuring Keycloak for production](https://www.keycloak.org/server/configuration-production) guide for more information.

3. Deploy a Kubernetes cluster with load balancer resources available. You will also need a set of open IP addresses for the Keycloak service.

:::tip

You can deploy a Kubernetes cluster in a public cloud with load balancer resources using Palette. You can also deploy to an on-prem or edge environment and use the MetalLB pack to expose a load balancer service. Check out the [Deploy a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md) guide for more information.

:::

4. Kubectl installed and configured to access your Kubernetes cluster.

## Setup

1. Ensure you can access your Kubernetes cluster using the kubectl CLI. Refer to the [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) for guidance on how to access your cluster with the `kubectl` CLI.

2. Install Keycloak on your Kubernetes cluster using the default configurations. This will create a Keycloak deployment and a service of the LoadBalancer type. The service will be exposed on an external IP address.

   ```bash
   kubectl create --filename https://raw.githubusercontent.com/keycloak/keycloak-quickstarts/latest/kubernetes/keycloak.yaml
   ```

   :::info

   You can also download the YAML file and edit it to suit your requirements before deploying it to your cluster. If you choose to do so, replace the GitHub file link in the original command with a file path to your YAML file.

   :::

3. The installation process takes a couple of minutes. After installation completes, use the following command to retrieve the external IP address of the Keycloak service.

```bash
kubectl describe service keycloak  | grep "LoadBalancer Ingress" | awk '{print $3}' && \
IP=$(kubectl describe service keycloak | grep "LoadBalancer Ingress" | awk '{print $3}')
```

```shell hideClipboard
aacf4014d5cd34825803567201217410-1398304919.us-east-1.elb.amazonaws.com
```

4. Next, download the Ingress YAML definition provided by Keycloak to create an Ingress resource in your cluster. The command below also automatically replaces the `KEYCLOAK_HOST` placeholder with the external IP address of the Keycloak service.

```bash
wget --quiet --output-document - https://raw.githubusercontent.com/keycloak/keycloak-quickstarts/latest/kubernetes/keycloak-ingress.yaml | sed "s/KEYCLOAK_HOST/$IP/" | kubectl create -f -
```

```shell hideClipboard
ingress.networking.k8s.io/keycloak created
```

:::info

If `wget` and `sed` are not available, download the file and manually edit the file to replace `KEYCLOAK_HOST` with the external IP address of the Keycloak service.

:::

After the ingress resource is created, the following services will be available in your cluster. You can review the exposed services in the cluster details page.

![View of the cluster details page](/keycloak/user-management_saml-sso_keycloak-01-keycloak-service.png "Keycloak Service")

5. Create a DNS CNAME record for the URL exposed by load balancer. For example, the CNAME `keycloak.dmitry.sa.spectrodemos.com` points to the following URL exposed by the load balancer `aacf4014d5cd34825803567201217410-1398304919.us-east-1.elb.amazonaws.com`.

6. Log in to Keycloak with by using the domain name you created in the previous step, or you can use the exposed load balancer URL. The Keycloak admin console is available on port `8080/admin`. For example, `http://keycloak.dmitry.sa.spectrodemos.com:8080/admin`. Use the default credentials `admin:admin` to log into the admin console.

:::caution

We recommend that you change the default credentials after logging in to the admin console.

:::

![Keycloak Admin console](/keycloak//user-management_palette-rback_keycloak_login.png)

7.  Next, log in to [Palette](https://console.spectrocloud.com), and navigate to the left **Main Menu** and select **Tenant Settings**. Next, select **SSO** from the **Tenant Menu** to access the SSO configuration page. Click on the **OIDC** tab to configure OIDC for Palette. Copy the values in the **Callback URL** and **Logout URL** fields. You will need these values to configure Keycloak.

![The callback URL](/keycloak/user-management_saml-sso_keycloak-02-callback-url.png "Callback URL")

8. Switch back to the Keycloak admin console and create a client for Palette. Navigate to the left **Main Menu** and select **Clients**. Click on the **Create** button to create a new client.

![The Client create screen](/keycloak/user-management_saml-sso_keycloak-03-create-client.png "Create Client")

9. Select **Client Type** value "OpenID Connect" and fill in the fields **Client ID** and **Name** with the value `palette`. Click on **Next**.

![Fill out the user name](/keycloak/user-management_saml-sso_keycloak-04-palette-username.png "Palette username")

10. Select **Client authentication** for increased security and check the **Standard Flow** box and the **Direct Access Grants** box. Click on **Next**.

![Client Authentication creation screen number two](/keycloak/user-management_saml-sso_keycloak-05-client-authentication.png "Client Authentication")

11. Fill out the following fields with the instructions provided in the table.

| **Field**                           | **Description**                                                                                                                                                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Root URL**                        | Your Palette URL. For Palette SaaS, this value is prefixed with your tenant name. For example, `https://docs-test.console.spectrocloud.com`. For self-hosted Palette, or VerteX, this value is the URL of your Palette deployment. |
| **Valid Redirect URIs**             | The callback URL you copied from the Palette SSO configuration page.                                                                                                                                                               |
| **Valid post logout redirect URIs** | The logout URL you copied from the Palette SSO configuration page.                                                                                                                                                                 |

12. Click on **Save** to save the client configuration.

![alt_text](/keycloak/user-management_saml-sso_keycloak-06-keycloak-callback.png "Keycloak callback")

13. In the following screen, select the **Credentials** tab to retrieve client secret.

![alt_text](/keycloak/user-management_saml-sso_keycloak-07-keycloak-credentials.png "Keycloak Credentials")

14. Switch back to Palette and paste client secret in the **Client Secret** field. Fill out the following fields with the instructions provided in the table below.

| **Field**         | **Description**                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Issuer URL**    | Your Keycloak URL with `/realms/master` appended to the end. For example, `http://keycloak.dmitry.sa.spectrodemos.com:8080/realms/master`. |
| **Client ID**     | The client ID you created in the previous steps. In this guide, the name `palette` was used.                                               |
| **Client Secret** | The client secret you retrieved in the previous step.                                                                                      |

![alt_text](/keycloak/user-management_saml-sso_keycloak-08-palette-callback.png "Palette Callback")

16. Scroll down to the bottom of the page, and click on **Enable**. If all values are correct, you will receive green message stating "OIDC configured successfully" at the top right corner.

![alt_text](/keycloak/user-management_saml-sso_keycloak-09-palette-oidc-enabled.png "Palette OIDC Enabled")

17. Navigate back to the Keycloak admin console. In the left **Main Menu**, select **Users**. Fill in first name, second name, and the email address of the admin user.

![alt_text](/keycloak/user-management_saml-sso_keycloak-10-keycloak-admin.png "Keycloak Admin")

You have now configured SSO for Palette with Keycloak. You can now log in to Palette using the admin user you created in Keycloak. Use the validation steps below to validate the SSO configuration. Check out the [Create a Team](#create-a-team) section to learn how to create a team and assign roles to users.

## Validate

Use the following steps to validate the SSO configuration.

1. Log out of Palette. Click on the top right **User Menu** and select **Log out**.

2. Sign in to Palette using the admin user you created in Keycloak. You will be redirected to the Keycloak login page. Enter the credentials for the admin user you created in Keycloak.

![alt_text](/keycloak/user-management_saml-sso_keycloak-11-palette-sso.png "Palette SSO")

![Keycloak Admin console](/keycloak//user-management_palette-rback_keycloak_login.png)

3. Upon successful authentication, you will be redirected to Palette. You will be logged in to Palette as the admin user you created in Keycloak.

## Create a Team

1. Log in to Palette as a Tenant Admin. Navigate to the left **Main Menu** and select **Users & Teams**. Click on the **Teams** tab to access the Teams page. Click on the **Create Team** button to create a new team.

![alt_text](/keycloak/user-management_saml-sso_keycloak-14-palette-groups.png "Palette groups")

2. Provide a team name, such as `admins` but leave the **Members** field empty. Click on **Confirm** to create the team.

3. Next, select the **admins** row to access the team settings page. Click on **New Project Role** and add the **Project Admin** role to the **Default** project. Click on **Confirm** to save the changes.

![alt_text](/keycloak/user-management_saml-sso_keycloak-15-palette-project.png "Palette Project")

4. From the left **Main Menu**, select **Tenant Settings**. Next, click on **SSO** to access the SSO configuration page. Click on the **OIDC** tab to access the OIDC configuration page. Scroll down to the **SSO Admins** section and select the **admins** team from the **Default Team** drop-down Menu. Click on **Save**.

![alt_text](/keycloak/user-management_saml-sso_keycloak-16-palette-sso-admins.png "Palette SSO Admins")

5. Navigate back to the Keycloak admin console. From the left **Main Menu** click on **Users**. Create a user and ensure the field **Username**, **Email**, and **First Name** are filled out. Click on **Save** to save the user.

![alt_text](/keycloak/user-management_saml-sso_keycloak-17-keycloak-user.png "Keycloak user")

6. Next, click on the **Credentials** tab and assign the user password.

![alt_text](/keycloak/user-management_saml-sso_keycloak-18-keycloak-password.png "Keycloak password")

Repeat the steps above for all users you want to add to the **admins** team. You can now log in to Palette with the users you created in Keycloak. The users will be assigned the **Project Admin** role for the **Default** project. Check out the [Creating users](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-user_server_administration_guide) guide to learn how to create users in Keycloak.

## Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)

- [Keycloak Quickstart](https://www.keycloak.org/getting-started/getting-started-kube)

- [Create Keycloak Users](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-user_server_administration_guide)
