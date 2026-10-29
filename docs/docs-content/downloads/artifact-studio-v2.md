---
sidebar_label: "Artifact Studio v2"
title: "Artifact Studio v2"
description:
  "Use Artifact Studio v2 to download appliances, packs, and profiles, and to manage your organization and access keys."
hide_table_of_contents: false
sidebar_position: 11
tags: ["downloads", "artifact-studio"]
---

Artifact Studio v2 is the new version of [Artifact Studio](https://artifact-studio.spectrocloud.com/). It adds
self-service accounts, organizations that control which artifacts you can download, and access keys for automated
downloads. It also replaces the multi-step pack bundle wizard with a single bundle builder.

The previous version of Artifact Studio (v1) is the default. To try Artifact Studio v2, open
[Artifact Studio](https://artifact-studio.spectrocloud.com/) and select **Switch to the new Artifact Studio** in the
banner at the top of the page. To return to the previous version, select **Switch to previous version** in the header.
Artifact Studio stores your choice in a browser cookie, so allow cookies for the site. For the previous version, refer
to [Artifact Studio](./artifact-studio.md).

:::preview

Artifact Studio v2 is a Tech Preview feature and is subject to change.

:::

## Differences from the Previous Version

| **Area**      | **What changed in Artifact Studio v2**                                                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Access        | You create your own account or sign in with Google. Your organization's entitlements determine which artifacts you can download. Organization entitlements replace the **Unlock with access key** option of the previous version. |
| Downloads     | You can browse the catalog without an account, but you must sign in to download an artifact, add it to a bundle, or copy its URL. The reCAPTCHA check is removed.                                                                 |
| Pack bundles  | A single bundle builder replaces the multi-step wizard. The builder supports agent mode and controller mode.                                                                                                                      |
| Profiles      | A single profiles catalog replaces **Profiles Hub** and **PaletteAI Studio**. It lists PaletteAI profile bundles alongside Palette and Palette VerteX cluster profiles. To open it, select **Profile bundles** in the header.     |
| Organizations | Organization admins invite members, create access tokens for the Artifact Studio API, and review the organization's download history.                                                                                             |
| Automation    | Personal access keys authenticate requests to the Artifact Studio API.                                                                                                                                                            |

## Sign In

Browsing the catalog does not require an account. To download an artifact, add it to a bundle, or copy its URL, you must
sign in.

1. In Artifact Studio v2, select **Sign in** in the header.

2. Select **Continue with Google**, or sign in with your **Work email** and **Password**.

   If you do not have an account, select **Create an account**, and enter your **Email**, **First name**, **Last name**,
   and **Password**. The password must be at least 12 characters long and contain a number and a symbol. Select **Create
   account**. You can also sign up with Google.

   If you forget your password, select **Forgot Password?** to reset it.

### Access to Artifacts

Spectro Cloud creates your organization and invites its first organization admin. The organization admin then invites
other members. Your organization's entitlements determine which appliances, packs, and profiles you can download. Only
Spectro Cloud can change your organization's entitlements.

You must also belong to an organization to download artifacts. To join an organization, ask its organization admin for
an invitation. If your company does not have an organization in Artifact Studio yet, contact
[support@spectrocloud.com](mailto:support@spectrocloud.com).

The catalog also lists artifacts that your organization is not entitled to. If you try to download one, Artifact Studio
displays **Entitlement required**. Contact your organization admin or
[open a support ticket](https://support.spectrocloud.io/) to request access.

### Accept an Invitation

When an organization admin adds you to an organization, Artifact Studio sends you an invitation email.

1. Open the invitation email, and then select the invitation link. The **Invitation** page displays the organization,
   your role, and the date the invitation expires.

2. Select **Accept & sign in**. If you are already signed in with the email address that received the invitation, select
   **Accept invitation**.

   To decline, select **Decline invitation**.

If the invitation link has expired or was already used, ask your organization admin to send a new invitation.

## Download an Appliance

1. In the header, select **Appliances**.

2. On the card of the appliance that you want to download, select **Download**. The **Download Options** drawer opens.

3. From **Select version**, choose the version to download. Artifact Studio labels FIPS builds **FIPS**.

4. Next to each artifact that you need, select **Download**. The artifacts available depend on the appliance and
   version.

   | **Artifact**          | **Description**                                                                                                                                                              |
   | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Appliance ISO**     | A bootable host image without bundled content. Download it together with the content bundle for airgapped installations.                                                     |
   | **Content Bundle**    | Packs, profiles, and dependencies that the appliance installs beyond the OS image.                                                                                           |
   | **Helm Chart**        | Chart that deploys the product onto an existing Kubernetes cluster.                                                                                                          |
   | **Machine Owner Key** | Secure Boot enrollment key. Download it only if your hosts boot with Secure Boot enabled. On the Launchpad appliances, this artifact is labeled **MOK Key for Secure Boot**. |

   For PaletteAI Inference Launchpad, Artifact Studio groups the artifacts by GPU build. Select **Show artifacts** for
   the build that you need.

To verify an appliance ISO or content bundle, refer to [Verify Signatures](./artifact-studio.md#verify-signatures) on
the previous version's page.

## Download Packs and Profiles

You can download individual packs and profiles, collect them into a single bundle from the catalogs, or build a pack
bundle for a cluster profile in the bundle builder.

:::tip

If you download more than one item, allow pop-ups for Artifact Studio so that your browser does not block the downloads.

:::

### Download a Pack

1. In the header, select **Packs**. The **Packs catalog** page opens.

2. Use the search bar and the **Palette Version**, **Layer / Category**, **Provider**, and **Compliance & Build**
   filters to find the pack.

3. On the pack card, select **Details**. The **Pack details** drawer opens.

4. From **Select version**, choose the pack version, and then select **Download**.

   To download the pack later with another tool, select **Full page**, and then select the **URLs** tab. The tab lists
   the direct URLs and the SHA-256 checksum of the pack archive and its signature. Select **Copy all URLs** to copy
   them.

### Download a Profile

1. In the header, select **Profile bundles**. The profiles catalog opens.

2. Under **Artifact type**, select **Cluster profiles** for Palette and Palette VerteX cluster profiles or **Profile
   bundles** for PaletteAI profile bundles. Use the remaining filters and the search bar to narrow the results.

3. Select a profile, and then select **Full details**.

4. Choose the profile version and build, and download the profile.

   - For a cluster profile, select **Download profile**.

   - For a PaletteAI profile bundle, select the build variant, and then select **Download Profile Bundle**.

### Download Items as a Bundle

1. In the **Packs catalog** or the profiles catalog, select **Add** on each pack or profile that you want to include.

2. After you add all the items, select **Review bundle**. Artifact Studio displays the bundle contents and the **Bundle
   summary**.

3. Select **Download Bundle**, or select **Copy all URLs** to download the items later with another tool, such as
   `curl`.

### Build a Pack Bundle

The bundle builder assembles the packs for a cluster profile into a single bundle.

1. On the Artifact Studio home page, select **Open the packs bundle builder**.

2. In **Bundle configuration**, select the **Product**, the **Profile type**, and the Palette **Version**.

   | **Option**   | **Values**                                   |
   | ------------ | -------------------------------------------- |
   | Product      | **Palette Enterprise** or **Palette VerteX** |
   | Profile type | **Infrastructure**, **Add-on**, or **Full**  |

3. Under **Mode**, select **Agent** or **Controller**. For **Controller**, select a **Cloud type**. For **Agent**, the
   cloud type is set to **Edge native** automatically.

   Changing the product, version, mode, profile type, or cloud type clears the packs that you have selected.

4. For each layer, select **Add OS pack**, **Add Kubernetes pack**, **Add CNI pack**, or **Add CSI pack**, and choose a
   pack and version in the **Add packs** drawer. Select **Done** to close the drawer.

5. _(Optional)_ To finish the bundle later, select **Save profile draft**, enter a **Draft name**, and then select
   **Save draft**. To resume a draft, select **Drafts**, and then select **Resume**.

6. Review the **Selected packs** list, and then select **Download selected artifacts** or **Copy all URLs**.

## Verify Downloads

Artifact Studio v2 shows verification instructions for packs, cluster profiles, and profile bundles, but not for
appliance downloads. To verify an appliance ISO or content bundle, refer to
[Verify Signatures](./artifact-studio.md#verify-signatures) on the previous version's page.

After a bundle download starts, Artifact Studio displays **Post-download verification instructions**.

1. Select **Download the public key file**.

2. Select **Copy verification command**, and then run the command in the directory that contains the downloaded
   artifact, its signature file, and the public key file. If the command contains a placeholder, such as `pack-name`,
   replace it with the name of the file that you downloaded.

3. Confirm that the command output is `Verified OK`.

You can also open the **Bundle verification instructions** from the bundle builder. For more information about how
Spectro Cloud signs artifacts, refer to [Artifact Signatures](../security/artifact-signatures/artifact-signatures.md).

## Manage Your Organization

Organization admins manage members, access tokens, and download history on the **Organization settings** page. Other
members have a read-only view of the page. To open the page, select **Org settings** in the **User Menu**.

| **Tab**          | **Purpose**                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview**     | Organization details and shortcuts to common admin tasks.                                                                                                                                                                 |
| **Members**      | Members of the organization, their roles, and pending invitations.                                                                                                                                                        |
| **Tokens**       | Organization access tokens for use in CI/CD pipelines and other automation.                                                                                                                                               |
| **Downloads**    | Downloads by members of the organization, including the download method.                                                                                                                                                  |
| **Entitlements** | The artifact classes that your organization can access. Artifact classes group artifacts by type and product, such as **Packs**, **Palette VerteX packs**, or **Palette installers**. Only Spectro Cloud can change them. |

### Add a Member

1. On the **Members** tab, select **Add member**.

2. In the **Add a teammate** dialog, enter the **Work email** of the new member, and then select a **Role**. A
   **Member** can download artifacts. An **Org admin** can also add members, manage tokens, and review downloads.

3. Select **Add member**. Artifact Studio emails the invitation, and the member is listed as **Invited** until they
   accept it.

To manage a member or an invitation, open the three-dot menu for the member on the **Members** tab.

| **Action**           | **Result**                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| **Resend invite**    | Sends the invitation again.                                              |
| **Revoke invite**    | Cancels the invitation so that its link no longer works.                 |
| **Promote to admin** | Gives organization admin permissions to the member.                      |
| **Demote to member** | Removes organization admin permissions.                                  |
| **Remove from org**  | Removes the member, who loses access to the organization's entitlements. |

An organization must always have at least one organization admin. You cannot change your own role or membership on the
**Members** tab. To leave the organization, refer to [Manage Your Account](#manage-your-account).

### Create an Organization Access Token

Organization access tokens belong to the organization rather than to a member, so use them for automation, such as a
service account in a CI pipeline. A token can access only the artifact classes that you select when you create it. Use
an organization access token in API requests the same way as a personal access key. For more information, refer to
[Create a Personal Access Key](#create-a-personal-access-key). Share each token through a secure channel.

1. On the **Tokens** tab, select **Create token**.

2. In the **Create access token** dialog, enter a **Token name**.

3. Under **Scope (artifact classes)**, select the artifact classes that the token can access. The list includes only the
   classes that your organization is entitled to.

4. Select an **Expiry**, and then select **Create token**.

5. Select **Copy token**, and then store the token securely. Artifact Studio displays the token only once. Select
   **Done**.

To revoke a token, select **Delete** next to the token on the **Tokens** tab. Anyone using the token loses access
immediately.

## Create a Personal Access Key

Personal access keys authenticate your own requests to the Artifact Studio API, for example, from a download script. For
automation that must keep working when a member leaves, use an
[organization access token](#create-an-organization-access-token). A key can access only the artifacts that your
organization is entitled to. The key stays tied to the organization that is active when you create it.

1. In the **User Menu**, select **API access keys**.

2. Select **New access key**.

3. Enter a **Name** for the key.

4. Under **Scope (artifact classes)**, select the artifact classes that the key can access, or select **Select all**.

5. Select an **Expiry**, and then select **Create access key**.

6. Select **Copy key**, and then store the key in your secrets manager. Artifact Studio displays the key only once.
   Select **Done**.

<!-- TODO(DOC-3256): Link the Artifact Studio API reference and name the API host once the spec is final. -->

Pass the key as a bearer token in the `Authorization` header of your API requests.

```shell
curl --header "Authorization: Bearer <access-key>" <artifact-studio-api-url>
```

Replace `<access-key>` with your access key and `<artifact-studio-api-url>` with the URL of the API endpoint you want to
call.

To revoke a key, select **Revoke** next to the key on the **API access keys** tab. Any pipeline that uses the key stops
working immediately.

## Manage Your Account

To open the **Account** page, select **My account** in the **User Menu**.

| **Tab**                | **Purpose**                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| **Profile**            | Your display name, email address, and the **Danger zone** actions. |
| **Saved Pack Bundles** | Drafts that you saved in the bundle builder.                       |
| **My downloads**       | Your download history.                                             |
| **Sessions**           | Devices signed in to your account.                                 |
| **API access keys**    | Your personal access keys.                                         |

The **Danger zone** section of the **Profile** tab contains the following actions.

| **Action**              | **Result**                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sign out everywhere** | Ends all active sessions, including the current one.                                                                                                 |
| **Leave org**           | Removes you from the organization and revokes your personal access keys for it. You keep your account, but you lose the organization's entitlements. |
| **Delete account**      | Deletes your login, clears your profile, and revokes your personal access keys. Artifact Studio keeps historical records.                            |

If you belong to more than one organization, select **Switch organization** in the **User Menu** to change the active
organization.

## Frequently Asked Questions

### When Does Artifact Studio v2 Become the Default?

Artifact Studio v2 becomes the default before the previous version is retired on December 4, 2026. Until then, you can
select **Switch to previous version** in the header to return to the previous version.

### Do You Need to Migrate Anything?

No data migration is required. Artifact Studio v2 offers the same packs and versions as the previous version, and the
previous version does not store any of your data. To download artifacts in Artifact Studio v2, you must sign in and
belong to your organization, because organization entitlements replace the **Unlock with access key** option. Refer to
[Access to Artifacts](#access-to-artifacts).

### How Do You Automate Downloads?

Use a personal access key or an organization access token to authenticate requests to the Artifact Studio API. Refer to
[Create a Personal Access Key](#create-a-personal-access-key) and
[Create an Organization Access Token](#create-an-organization-access-token).

### Can You Switch Versions Without an Account?

Yes. You can switch between versions without an account.

### Do Bookmarks Still Work?

After Artifact Studio v2 becomes the default, links to `https://artifact-studio.spectrocloud.com` open Artifact Studio
v2. Links to a specific pack, cluster profile, PaletteAI profile bundle, or appliance open the same item in Artifact
Studio v2. Other links open the Artifact Studio v2 home page.

### What If Your Team Needs More Time Before the Previous Version Is Retired?

Contact your Spectro Cloud representative as early as possible.

### Why Do You Need to Sign In to Download?

Signing in ties each download to your organization. Your organization admin can then review who downloaded what, and
Artifact Studio can enforce your organization's entitlements. You can still browse the catalog without an account.

### How Do You Get an Account?

Your organization admin can invite you, or you can create an account yourself and then ask your organization admin to
add you to your company's organization. Refer to [Sign In](#sign-in) and [Accept an Invitation](#accept-an-invitation).

### How Does Your Team Get Access?

After your organization admin accepts the invitation from Spectro Cloud, they invite the other members of your team from
the **Organization settings** page. Refer to [Add a Member](#add-a-member).

### What If You Cannot Download an Artifact That Your Organization Is Entitled To?

Check the following:

- If you belong to more than one organization, select **Switch organization** in the **User Menu**, and then select your
  company's organization.

- If you created your account without an invitation, you might not belong to your company's organization yet. Ask your
  organization admin to invite you. Refer to [Accept an Invitation](#accept-an-invitation).

If Artifact Studio still displays **Entitlement required**, contact your organization admin or
[open a support ticket](https://support.spectrocloud.io/).

### What Is an Entitlement?

An entitlement determines which artifacts your organization can download. Palette, Palette VerteX, PaletteAI, and the
appliances each have their own entitlements. The **Entitlements** tab of the **Organization settings** page lists your
organization's entitlements as artifact classes. Refer to [Access to Artifacts](#access-to-artifacts).

### How Do You Verify What You Downloaded?

Artifact Studio v2 shows verification instructions for packs, cluster profiles, and profile bundles, but not for
appliances. Refer to [Verify Downloads](#verify-downloads).
