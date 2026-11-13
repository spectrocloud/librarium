---
sidebar_label: "Import Users in Bulk"
title: "Import Users in Bulk"
description:
  "Add many users to a PaletteAI Inference Launchpad appliance at once with the bulk import API. Sign in, preview the
  rows, import them, and read the result."
hide_table_of_contents: false
sidebar_position: 2.835
tags: ["paletteai-inference-launchpad", "access", "users", "how-to"]
keywords: ["launchpad", "ai", "users", "bulk import", "csv", "json", "api", "curl"]
---

Add many users at once with the bulk import API. You sign in, preview the rows, import them, and then read the result.
You run each step with `curl` from a terminal. For sign-in, row fields, limits, and responses, refer to
[Bulk User Import Reference](../reference/user-import-reference.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable at `https://<appliance-address>`.

- An identity provider configured for the appliance.

- An account with the **Platform administrator** role. The account must sign in with a username and password on the
  appliance sign-in page.

- A machine with `bash` and `curl`.

- The platform CA certificate, saved as `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt`. You need it if your
  machine does not trust the console certificate. To download it, refer to
  [Download the Platform CA Certificate](./use-claude-code.md#download-the-platform-ca-certificate).

- The workspaces you plan to add users to. To create one, refer to [Create a Workspace](./create-a-workspace.md).

- The groups that your rows name. To add one, refer to [Add a Group](./manage-groups.md#add-a-group).

## Sign In

1. Save the following script as `sign-in.sh`.

   ```bash title="sign-in.sh"
   #!/usr/bin/env bash
   set -euo pipefail

   BASE="https://<appliance-address>"
   CA="$HOME/Downloads/palette-ai-inference-launchpad-ca.crt"
   JAR=cookies.txt

   read -r -p "Username: " USER_NAME
   read -r -s -p "Password: " PASSWORD
   echo

   # Start with an empty cookie file.
   rm -f "$JAR"

   curl_jar() { curl --silent --show-error --cacert "$CA" --cookie-jar "$JAR" --cookie "$JAR" "$@"; }

   # 1. Start the sign-in. The appliance redirects to its sign-in page.
   AUTH_URL="$(curl_jar --output /dev/null --write-out '%{redirect_url}' "$BASE/api/auth/login?returnTo=/")"

   # 2. Find the address that the sign-in form posts to.
   ACTION="$(curl_jar --location "$AUTH_URL" \
     | grep --only-matching 'action="[^"]*"' \
     | head --lines=1 \
     | sed 's/^action="//; s/"$//; s/&amp;/\&/g' || true)"
   if [ -z "$ACTION" ]; then
     echo "No sign-in form found. Check the appliance address and run the script again." >&2
     exit 1
   fi

   # 3. Post the username and password.
   CALLBACK="$(curl_jar --output /dev/null --write-out '%{redirect_url}' \
     --data-urlencode "username=$USER_NAME" \
     --data-urlencode "password=$PASSWORD" "$ACTION")"
   if [ -z "$CALLBACK" ]; then
     echo "Sign-in failed. Check the username and password." >&2
     exit 1
   fi

   # 4. Finish the sign-in. The appliance saves the session cookie in the cookie file.
   curl_jar --output /dev/null "$CALLBACK"
   if ! grep --quiet lp_session "$JAR"; then
     echo "Sign-in did not finish. Check that this account can sign in to the console." >&2
     exit 1
   fi

   echo "Signed in. The session cookie is in $JAR."
   ```

   Replace `<appliance-address>` with the address of your appliance. If your machine trusts the console certificate,
   remove `--cacert "$CA"` from the `curl_jar` line.

2. Run the script. When it asks, enter the username and password of your account.

   ```bash
   bash sign-in.sh
   ```

   ```bash hideClipboard title="Expected output"
   Username: admin@example.com
   Password:
   Signed in. The session cookie is in cookies.txt.
   ```

3. In the terminal and directory where you ran `sign-in.sh`, set the variables that the next steps use. Run all later
   steps in the same terminal session and directory.

   ```bash
   BASE="https://<appliance-address>/api"
   CURL=(curl --silent --show-error --cacert "$HOME/Downloads/palette-ai-inference-launchpad-ca.crt" --cookie cookies.txt)
   ```

   Replace `<appliance-address>` with the address of your appliance. If your machine trusts the console certificate,
   remove the `--cacert` option. The commands print nothing.

## Prepare the Rows

1. Create a file named `rows.json` that holds a JSON array. Add one object for each user. Each object must have an
   `email`. For all fields and their rules, refer to [Row Fields](../reference/user-import-reference.md#row-fields).

   ```json title="rows.json"
   [
     {
       "email": "amara@example.com",
       "firstName": "Amara",
       "lastName": "Okafor",
       "groups": ["ml-team"],
       "role": "operator",
       "status": "active",
       "workspaces": ["default-workspace"],
       "password": "ChangeMe-2026!"
     },
     {
       "email": "kenji@example.com",
       "firstName": "Kenji",
       "lastName": "Sato",
       "role": "operator",
       "status": "active",
       "workspaces": ["default-workspace"]
     }
   ]
   ```

2. _(Optional)_ If your users are in a CSV file, convert each row to a JSON object in `rows.json`. For the conversion
   rules, refer to [CSV Conversion](../reference/user-import-reference.md#csv-conversion).

## Preview the Import

1. Send the rows to `POST /api/users/import?dryRun=true` to check them without adding anyone. If the rows name groups
   that do not exist, add `&createMissingGroups=true` to the URL.

   ```bash
   "${CURL[@]}" "$BASE/users/import?dryRun=true" \
     --header 'Content-Type: application/json' \
     --data-binary @rows.json
   ```

   ```bash hideClipboard title="Expected output"
   {"counts":{"created":2,"failed":0,"invalid":0,"noWorkspace":0,"skipped":0,"total":2}}
   ```

2. If `invalid` is more than `0`, fix the rows that the `results` list names. Then run the preview again. For the fields
   in each entry, refer to [Results](../reference/user-import-reference.md#results).

## Import the Users

1. Send the same rows to `POST /api/users/import`. If you added `createMissingGroups=true` to the preview, add
   `?createMissingGroups=true` to this URL too.

   ```bash
   "${CURL[@]}" "$BASE/users/import" \
     --header 'Content-Type: application/json' \
     --data-binary @rows.json
   ```

   ```bash hideClipboard title="Expected output"
   {"id":"import-n2v74","status":"Pending","submittedAt":"2026-11-13T03:25:08Z"}
   ```

2. Save the job ID in a variable.

   ```bash
   ID="<import-id>"
   ```

   Replace `<import-id>` with the `id` value from the output. The command prints nothing.

## Check the Import

1. Send `GET /api/users/import/<import-id>` to read the import job. Repeat this step until `status` is `Completed` or
   `Failed`.

   ```bash
   "${CURL[@]}" "$BASE/users/import/$ID"
   ```

   ```bash hideClipboard title="Expected output"
   {"counts":{"created":2,"failed":0,"invalid":0,"noWorkspace":0,"skipped":0,"total":2},"finishedAt":"2026-11-13T03:25:08Z","id":"import-n2v74","requestedBy":"admin@example.com","startedAt":"2026-11-13T03:25:08Z","status":"Completed","statusMessage":"2 people were added.","submittedAt":"2026-11-13T03:25:08Z"}
   ```

2. If `invalid` or `failed` is more than `0`, read the `results` list within 1 hour after the job finishes. For how long
   the appliance keeps a job, refer to [Limits](../reference/user-import-reference.md#limits). Fix the listed rows in
   `rows.json`. Then repeat [Import the Users](#import-the-users) with the whole file. In the new job, the users from
   the first import count as `skipped`.

3. If `status` is `Failed`, read `statusMessage`. Then repeat [Import the Users](#import-the-users) with the whole file.

## Validate

1. From the left main menu, select **Users**.

2. Select the **Users** tab.

3. Confirm that each user from `rows.json` appears in the list. Check that the **Groups** and **State** columns match
   the rows.

4. To confirm a user's workspace access, open the workspace's members. For the steps, refer to
   [Manage Workspace Members](./manage-workspace-members.md).

## Next Steps

- To change, deactivate, or delete a user, refer to [Manage Users](./manage-users.md).

- To change the groups that users are in, refer to [Manage Groups](./manage-groups.md).
