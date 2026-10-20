---
sidebar_label: "Artifact Studio v2"
title: "Artifact Studio v2"
description:
  "Use Artifact Studio v2 to download appliances, packs, and profile bundles, and to manage your organization and access
  keys."
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
| Profiles      | **Profile bundles** replaces **Profiles Hub** and **PaletteAI Studio**. It lists both Palette cluster profiles and PaletteAI profile bundles.                                                                                     |
| Organizations | Organization admins invite members, create access tokens, and review the organization's download history.                                                                                                                         |
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
other members. Your organization's entitlements determine which appliances, packs, and profile bundles you can download.
Only Spectro Cloud can change your organization's entitlements.

You must also belong to an organization to download artifacts. To join an organization, ask its organization admin for
an invitation.

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
   | **vSphere Appliance** | OVA for VMware vSphere.                                                                                                                                                      |
   | **Palette CLI**       | Command-line interface for managing the appliance.                                                                                                                           |

   For PaletteAI Inference Launchpad, Artifact Studio groups the artifacts by GPU build. Select **Show artifacts** for
   the build that you need.

To verify an appliance ISO or content bundle, refer to [Verify Signatures](./artifact-studio.md#verify-signatures) on
the previous version's page.

## Download Packs and Profile Bundles

You can download individual packs and profile bundles, collect them into a single bundle from the catalogs, or build a
pack bundle for a cluster profile in the bundle builder.

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

### Download a Profile Bundle

1. In the header, select **Profile bundles**.

2. Under **Artifact type**, select **Palette profile** for Palette cluster profiles or **AI Profile bundle** for
   PaletteAI profile bundles. Use the remaining filters and the search bar to narrow the results.

3. Select a profile, and then select **Full details**.

4. Choose the profile version and build, and download the profile.

   - For a Palette cluster profile, select **Download profile**.

   - For a PaletteAI profile bundle, select the build variant, and then select **Download Profile Bundle**.

### Download Items as a Bundle

1. In the **Packs catalog** or **Profile bundles** catalog, select **Add** on each pack or profile that you want to
   include.

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

Artifact Studio v2 shows verification instructions for packs, profiles, and profile bundles, but not for appliance
downloads. To verify an appliance ISO or content bundle, refer to
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
| **Tokens**       | Organization access tokens.                                                                                                                                                                                               |
| **Downloads**    | Downloads by members of the organization in the last 30 days, including the download method.                                                                                                                              |
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

| **Tab**                   | **Purpose**                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Profile**               | Your display name, email address, and the **Danger zone** actions. |
| **Saved Profile bundles** | Drafts that you saved in the bundle builder.                       |
| **My downloads**          | Your downloads from the last 90 days.                              |
| **Sessions**              | Devices signed in to your account.                                 |
| **API access keys**       | Your personal access keys.                                         |

The **Danger zone** section of the **Profile** tab contains the following actions.

| **Action**              | **Result**                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sign out everywhere** | Ends all active sessions, including the current one.                                                                                                 |
| **Leave org**           | Removes you from the organization and revokes your personal access keys for it. You keep your account, but you lose the organization's entitlements. |
| **Delete account**      | Deletes your login, clears your profile, and revokes your personal access keys. Artifact Studio keeps historical records.                            |

If you belong to more than one organization, select **Switch organization** in the **User Menu** to change the active
organization.
