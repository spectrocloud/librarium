---
sidebar_label: "Bulk User Import Reference"
title: "Bulk User Import Reference"
description:
  "Endpoints, sign-in, permissions, row fields, CSV conversion, counts, limits, and refusals for the PaletteAI Inference
  Launchpad bulk user import API."
hide_table_of_contents: false
sidebar_position: 4.95
tags: ["paletteai-inference-launchpad", "reference", "access", "users"]
keywords: ["launchpad", "ai", "users", "bulk import", "csv", "json", "api", "row", "limit"]
---

This reference describes the bulk user import API. The console has no bulk import control, so you use the API. For the
steps, refer to [Import Users in Bulk](../how-to-guides/import-users-in-bulk.md).

## Endpoints

All paths are relative to `https://<appliance-address>`.

| **Request**                          | **What it does**                                                 | **Success response**                                                          |
| ------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `POST /api/users/import?dryRun=true` | Checks every row. Adds no one.                                   | `200`, with `counts` and a `results` entry for each invalid row.              |
| `POST /api/users/import`             | Creates an import job. The job adds the users in the background. | `202`, with the job `id` and a `Location` header of `/api/users/import/<id>`. |
| `GET /api/users/import/<id>`         | Reads the job's status, timestamps, `counts`, and `results`.     | `200`.                                                                        |

Add `createMissingGroups=true` to a `POST` request to create missing groups. A missing group is a group that a row names
and the appliance does not have. The default is `false`.

## Sign-In

Requests to this API use the console session cookie, `lp_session`. API tokens do not work for these requests.

The sign-in script in [Import Users in Bulk](../how-to-guides/import-users-in-bulk.md) gets the cookie from a terminal.
It takes the same three steps as the console sign-in.

1. It starts at `/api/auth/login`.

2. It posts your username and password to the sign-in form.

3. It finishes at `/api/auth/callback`, which sets the cookie.

The cookie lasts as long as the session. When the session ends, run the script again.

## Permissions

A request without a permission it needs is refused with `403`. The message names the missing permission.

| **Request**                                       | **Permissions needed**             |
| ------------------------------------------------- | ---------------------------------- |
| Preview or import                                 | `users:create` and `grants:update` |
| Preview or import with `createMissingGroups=true` | Also `groups:create`               |
| Read a job                                        | `users:read`                       |

## Row Fields

The request body is a JSON array of row objects, with one object for each user. The CSV column is the column name to use
when you convert a CSV file. For the conversion rules, refer to [CSV Conversion](#csv-conversion).

| **JSON key** | **CSV column** | **Required** | **Value and rules**                                                                                                                                                                                                                                                                                         |
| ------------ | -------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`      | `email`        | Yes          | Trimmed and lowercased. Must be a valid address of at most 254 characters. A row without an email is invalid. The rest of the file still runs.                                                                                                                                                              |
| `firstName`  | `first_name`   | No           | Trimmed. At most 255 characters.                                                                                                                                                                                                                                                                            |
| `lastName`   | `last_name`    | No           | Trimmed. At most 255 characters.                                                                                                                                                                                                                                                                            |
| `groups`     | `groups`       | No           | An array of group names. If the key is missing or the array is empty, the user joins no groups. A reserved group name is invalid. An unknown group is invalid, unless the request has `createMissingGroups=true`.                                                                                           |
| `role`       | `role`         | No           | `operator`, `workspace-admin`, or `platform-admin`. The display names, such as `workspace administrator`, also work. An unknown role is invalid. A row with no role gets `operator` when it names a workspace.                                                                                              |
| `status`     | `status`       | No           | `active` (default) or `inactive`. Any other value is invalid.                                                                                                                                                                                                                                               |
| `workspaces` | `workspaces`   | No           | An array of workspace names, such as `default-workspace`. Each workspace must exist. A row with no role and no workspace adds the user with no workspace access. A row that names the `operator` or `workspace-admin` role but no workspace is invalid. A `platform-admin` row with a workspace is invalid. |
| `password`   | `password`     | No           | Used exactly as written. At most 128 characters, with no control characters. Set as a temporary password.                                                                                                                                                                                                   |

The body has these rules:

- It must be an array of objects, with 1 to 5,000 rows.

- If a row has a key that is not in the table, the appliance refuses the whole request with `400`.

- `groups` and `workspaces` must be arrays of strings.

- A row with a wrong value counts as `invalid`, with its position. The other rows still run.

### Row Checks

The appliance checks each row in this order. The first check that fails is the reason it reports.

1. The email is present.

2. The email is a valid address.

3. The email is at most 254 characters.

4. The email does not appear in an earlier row of the same file.

5. The email does not belong to an existing user. If it does, the row is skipped, and no later check runs.

6. The first name and the last name are each at most 255 characters.

7. The role exists on the appliance.

8. The status is `active` or `inactive`.

9. Each group exists, or the request has `createMissingGroups=true`. No group is reserved.

10. Each workspace exists.

11. The role and the workspaces follow the rules in [Row Fields](#row-fields).

12. The password is valid.

## CSV Conversion

The API accepts JSON only. It does not accept a CSV file. A CSV file must be converted to a JSON array first, with these
rules:

- Each CSV column maps to the JSON key listed in [Row Fields](#row-fields).

- In the `groups` and `workspaces` cells, `;` separates the names. Each name becomes one item of the JSON array.

- An empty cell means that the key is left out.

- The `password` cell is copied exactly. It is not trimmed or split.

- Blank lines are skipped. Row positions in a response count JSON array items, not CSV lines.

In the following example, the CSV file and the JSON array hold the same two users.

```csv title="users.csv"
email,first_name,last_name,groups,role,status,workspaces,password
amara@example.com,Amara,Okafor,ml-team,operator,active,default-workspace,ChangeMe-2026!
kenji@example.com,Kenji,Sato,,operator,active,default-workspace,ChangeMe-2026!
```

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
    "workspaces": ["default-workspace"],
    "password": "ChangeMe-2026!"
  }
]
```

The `ml-team` group must exist, or the request must have `createMissingGroups=true`.

## Job Status

| **Status**  | **Meaning**                                        |
| ----------- | -------------------------------------------------- |
| `Pending`   | The job waits to start.                            |
| `Running`   | The job is adding users.                           |
| `Completed` | The job finished.                                  |
| `Failed`    | The job stopped. `statusMessage` gives the reason. |

## Counts

The preview response and the job both include `counts`.

| **Count**     | **Rows it counts**                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `total`       | Every row in the file.                                                                                                                        |
| `created`     | Rows that add a new user.                                                                                                                     |
| `skipped`     | Rows whose email belongs to an existing user. The existing user is not changed, and the rest of the row is not checked.                       |
| `invalid`     | Rows that fail a [row check](#row-checks).                                                                                                    |
| `failed`      | Rows that passed the checks but that the appliance could not fully add. The `results` entry gives the reason.                                 |
| `noWorkspace` | Rows that name no workspace and do not give the `platform-admin` role. These users get no workspace access. `created` also counts these rows. |

A skipped row is not a problem. When you import a file again, the users that an earlier import added are skipped.

## Results

The `results` list has one entry for each `invalid` or `failed` row.

| **Field** | **Value**                                              |
| --------- | ------------------------------------------------------ |
| `index`   | The row's position in the JSON array, starting at `1`. |
| `email`   | The row's email.                                       |
| `outcome` | `invalid` or `failed`.                                 |
| `detail`  | The reason, as one sentence.                           |

## Access for Imported Users

- Each new user gets access to each workspace that the row names, with the row's role.

- The import creates no API tokens.

## Limits

| **Limit**                     | **Value**                                                                |
| ----------------------------- | ------------------------------------------------------------------------ |
| Rows in one request           | 5,000. A larger file is refused with `422`. Split it and send each part. |
| Request body size             | 32 MiB. A larger body is refused with `413`.                             |
| Jobs waiting to start         | 10. Another import is refused with `429` until a job finishes.           |
| How long a finished job stays | 1 hour. After that, reading the job returns `404`.                       |
| Finished jobs kept            | 100.                                                                     |

## Refusals

A refused request adds no one. Except for `413`, the response body is an error object with a `code` and a `message`.

| **Status** | **When**                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `400`      | The body is not an array, is empty, holds an item that is not an object, or uses a key that is not defined. |
| `403`      | A permission is missing. The message names it.                                                              |
| `404`      | Reading a job that does not exist, or that finished more than 1 hour ago.                                   |
| `409`      | Another directory owns the user accounts, so the appliance cannot add users.                                |
| `413`      | The request body is larger than 32 MiB.                                                                     |
| `422`      | The body holds more than 5,000 rows.                                                                        |
| `429`      | 10 import jobs already wait to start.                                                                       |
| `503`      | The appliance has no identity provider configured.                                                          |
