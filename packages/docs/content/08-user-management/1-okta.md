---
title: "Okta SSO Setup"
metaTitle: "Okta SSO Setup"
metaDescription: "Detailed instructions on creating SSO to log in to Spectro Cloud using SAML 2.0 with Okta as the Identity Provider"
icon: ""
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# SAML 2.0 based SSO with Okta

Detailed instructions can be found at the bottom.

## TL; DR version

Spectro Cloud offers IdP based SSO using SAML 2.0 for user login apart from email ID + password combination. SSO can be enabled by accessing the "Settings" on the Spectro Cloud console while logged in as a tenant admin.

Create a new application in Okta with the same name as `ENTITYID` from the Spectro Cloud console. For this application, copy the following attributes from Spectro Cloud;

* `Login URL` into "Single Sign On URL".
* `ENTITYID` into "Audience URI".
* Use `EmailAddress` as the "NameID format" and provide the following "ATTRIBUTE STATEMENTS":

| Name  | Name Format (Optional)| Value|
|---|---|---|
| FirstName   | unspecified            | user.firstName|
| LastName    | unspecified            | user.lastName                                 |
| Email       | unspecified            | user.email                                    |
| SpectroTeam | unspecified            | *Enter < default team > here. See explanation below.* |

Finish the Okta app config using the *"I'm a software vendor"* option. From the newly created Okta app, copy the IdP Metadata and paste into the corresponding box in the Spectro Cloud SAML config panel. Click `Confirm` to finalize the changes.

The tenant admin can now add the users available in the Okta dashboard. The tenant admin should provide the `LOGIN URL` found in the Spectro Cloud SAML config panel to the users for logging into their Spectro Cloud dashboards.

## Detailed Version

In the Spectro Cloud SAML Panel, after selecting Okta as the IdP service from the dropdown, copy the `Login URL` using the copy icon (![copy icon](copy_icon1.svg)) next to the URL box. This URL along with other information such as `Service Provider Metadata` will be needed to add Spectro Cloud as a new "application" in your Okta dashboard.

In a new tab, open www.okta.com and login to access its dashboard.

Under the `Applications` main tab, select the `Applications` option again.

Click `Add Application` and then click the `Create New App` option.

In the window that opens next, under "General Settings", choose "Web" as the "Platform" and select `SAML 2.0` as the sign-on method. Click `Create` to add the new app.

Your new app is added on Okta and needs to be configured. Give a name to the app that has been created.

**We strongly recommend using the** `ENTITYID` **as it is from the Spectro Cloud SAML Panel as the app name.**

Click `Next` to go to the "Configure SAML" tab.

In the "GENERAL" section, the "Single Sign On URL" should be the same as the  `LOGIN URL` in the Spectro Cloud SAML Panel. Check the box for "Use this for Recipient URL and Destination URL."

Copy-paste the `ENTITYID` from the Spectro Cloud SAML Panel into the "Audience URI (SP Entity ID)".

In the "NameID format", select `EmailAddress` from the dropdown. In the "ATTRIBUTE STATEMENTS (OPTIONAL)" section, add the following fields:

|Name| Name Format (Optional)   | Value   |
|---|---|---|
|FirstName   | unspecified            | user.firstName|
| LastName    | unspecified            | user.lastName                                 |
| Email       | unspecified            | user.email                                    |
| SpectroTeam | unspecified            | *Enter default team. See explanation below* |

Any non-admin user that is added to a tenant must be added into at least one team when being created by the admin. This team can be changed later on if needed. See the teams section for more details on teams and creating them. In case a user is not added to any team, the user can still login successfully but will not be able to see the dashboard. The `SpectroTeam` attribute carries forward the available team/s for the user being authorized. This gives the admin the flexibility to add users into teams from both Spectro Cloud as well as Okta. The values of the `SpectroTeam` parameter is case sensitive, so the tenant admin should ensure that the team names are identical on both the dashboards. A team created on Okta which is not mentioned in the Spectro Cloud will be ignored.

A sample use case is where a new member is to be added to the Spectro Cloud tenant by the tenant admin. The admin can have a default team which is common to all users. This can be applied to the Spectro Cloud SAML Panel as a one-time setting. When a new user is added, the Okta dashboard can be used to add this user to additional teams as required. Without this arrangement, the tenant admin would need to add the user and then perform the team assignment separately each time.

Finish the teams configuration and click `Next` to access the last tab on the Okta dashboard, which is the `Feedback` tab. Here, select the "***I'm a software vendor***" option and click `Finish` to complete the Okta configuration.

This will return to the Okta `Applications` page. The Spectro Cloud should now be visible. Under the `Sign On` tab, click on the `View Setup Instructions` button. This opens a new tab showing the IdP SAML details. Copy the `IDP Metadata` and paste it into the corresponding box in the Spectro Cloud SAML Dashboard. Click `Confirm` to finish the process. A success banner should be visible on the top left which ensures the completion of the configuration.

With this, the tenant admin is ready to start adding users from the Okta dashboard. In the Okta `Applications` page under the Spectro Cloud application, use the `Assignments` tab to add users. Click on the `Assign` button and select the `Assign to people` option. (If you have set up groups, you can use this option as well.) In the popup window, select the users who are to be given access to Spectro Cloud.

Now a user can log in with the `LOGIN URL`. This will automatically redirect to the Okta sign-in page. If the user is already signed in to Okta, the page will again redirect to Spectro Cloud automatically.

This completes the sign-in process for the user.
