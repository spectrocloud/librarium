---
sidebar_position: 60
sidebar_label: "Access Review with Palette MCP"
title: "Access Review with Palette MCP: Teams, Users, and Orphans"
description:
  "Build a tenant-wide membership and activation map with the access-review skill: who is on which team, who is pending
  activation, and who has no team and no tenant role at all."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The `access-review` skill builds a tenant-wide membership and activation map: who is on which team, who is still pending
activation, and who has no team and no tenant role at all (an orphaned account). It is a good starting point for
security reviews, onboarding audits, or offboarding checks.

This review reports **tenant-level** roles, as UIDs and counts. **Project-scoped** role assignments require a separate
check, so treat the output as a membership and activation map, not a full role-based access audit. Restate this scope
whenever you share a report, so the audience knows exactly what is covered. In this tutorial, you run the team, users,
activation, and orphans sequence that the skill follows, and you learn to distinguish a fast orphan signal (no extra API
calls) from a full orphan check (one call per candidate user).

## Prerequisites

Same as [Get Started with Palette MCP](./get-started-palette-mcp.md): an MCP-capable client, and a Palette API key with
tenant-wide read access to teams and users. No special server flags.

:::info

Every user shown in this tutorial is a placeholder (for example, `user1@example.com`). Substitute your own tenant's
values when you run the sequence.

:::

:::warning

The access review returns real people's identifiers (names, emails, and activation state), even against an internal test
tenant. Redact them before you share any output beyond the person who requested it. For the Palette MCP server's full
security model, refer to [Palette MCP Architecture](../../../automation/palette-mcp/architecture.md#security).

:::

## List Teams

The `read_teams` tool lists teams (`uid`, `name`, `user_count`, `source_count`), or one team's full roster by `uid`.
Filter by `has_user_uid` or `has_user_email` to find a specific user's teams. It is read-only. Start by listing every
team in the tenant.

```shell title="Example Prompt"
List all my teams.
```

The following is an example response.

```json title="Example Output"
{
  "items": [
    { "uid": "<TEAM_UID_1>", "name": "qa-team-1", "user_count": 0, "source_count": 1 },
    { "uid": "<TEAM_UID_2>", "name": "qa-team-2", "user_count": 0, "source_count": 1 },
    { "uid": "<TEAM_UID_3>", "name": "audit-team-1", "user_count": 0, "source_count": 1 }
  ],
  "total": 3
}
```

All three teams show `user_count: 0`, so every team in this tenant is empty.

## List Users

The `read_users` tool lists users (`uid`, `email`, `name`, `is_active`, `tenant_role_count`), or returns one user's role
detail by `uid`. It is also read-only. List every user and their activation status.

```shell title="Example Prompt"
List all users and their activation status.
```

The following is an example response.

```json title="Example Output"
{
  "items": [
    { "uid": "<UID_1>", "email": "user1@example.com", "tenant_role_count": 2, "is_active": true },
    { "uid": "<UID_2>", "email": "user2@example.com", "tenant_role_count": 0, "is_active": true },
    { "uid": "<UID_3>", "email": "user3@example.com", "tenant_role_count": 0, "is_active": true },
    { "uid": "<UID_4>", "email": "user4@example.com", "tenant_role_count": 0, "is_active": true },
    { "uid": "<UID_5>", "email": "user5@example.com", "tenant_role_count": 0, "is_active": true },
    { "uid": "<UID_6>", "email": "user6@example.com", "tenant_role_count": 0, "is_active": true },
    { "uid": "<UID_7>", "email": "user7@example.com", "tenant_role_count": 1, "is_active": true }
  ],
  "total": 7
}
```

## Flag Activation Gaps

In this example, all seven users show `is_active: true`, so there are zero pending activations. This is a genuine
result: in a tenant with pending invites, those accounts show up here as `is_active: false`.

## Flag Orphans

Use the fast signal first (no extra calls): users with `tenant_role_count: 0`, which is five of the seven above (`user2`
through `user6`). This alone is often enough to report.

For a full orphan check (only for the small zero-role set, never for every user), confirm each candidate also has no
team, using `read_teams` with `filters={has_user_uid:"<uid>"}`.

```shell title="Example Prompt"
Is user2 on any team?
```

```json title="Example Output"
{ "items": [], "total": 0 }
```

The `user4` account returns the same result. Both are confirmed as true orphans, with no tenant roles and no team
membership. Here the check is a formality, because listing the teams already showed every team is empty. In a tenant
with real team membership, run the per-user check rather than inferring from the team list.

## Expand Team Rosters and Per-User Detail

With every team empty, there is no roster to expand in this example. In a tenant with real team membership, `read_teams`
with `uid=<team_uid>` returns `Spec.Users[]` and `Spec.Roles[]` for one team at a time. Ask which teams to expand rather
than fetching all of them if the tenant has many.

## Synthesize the Findings

- **Teams (3):** all empty, which is worth flagging on its own. Three teams with no members is either stale team
  creation or a gap in whatever process was supposed to populate them.
- **Users (7):** zero pending, five confirmed orphans (no roles, no team), and two with tenant roles.
- Restate the scope (tenant-only, no project-scoped roles) in the final report every time.

:::info

To act on a finding, such as clearing an orphan's roles or adjusting team membership, the write tools (`update_user` and
`update_team`) need the `--allow-write` flag. This tutorial does not use them.

:::

## Troubleshooting

| Symptom                                                                | Likely cause                                                                                         | Fix                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Every team shows `user_count: 0` in a tenant you know has active teams | Pointed at the wrong tenant or profile. `list_auth_profiles` shows configured hosts.                 | Re-run against the correct `auth_profile`.            |
| Orphan check (`has_user_uid` filter) returns unexpected results        | `has_user_uid` and `has_user_email` are mutually exclusive, so supplying both is a validation error. | Pass exactly one.                                     |
| Real names or emails end up in a saved report                          | This skill returns real PII by design, because it is an access review.                               | Redact before sharing, exactly as this tutorial does. |

## Validate

Confirm that you can produce an access review through the Palette MCP server.

1. Run the team, user, activation, and orphan sequence against your own tenant, and confirm that you can identify which
   users have no tenant role and no team.

2. Confirm that your report states the skill's scope (tenant-only roles, no project-scoped access).

3. Distinguish the fast orphan signal from the full per-user team check, and confirm that you know when each is enough.

## Cleanup

This tutorial is read-only and creates or changes nothing, so there is nothing to clean up.

## Wrap-up

In this tutorial, you built a tenant-wide membership and activation map with the `access-review` skill. You listed teams
and users, flagged activation gaps and orphaned accounts, and synthesized the results into a report. Remember that this
review covers tenant-level roles only, not project-scoped assignments, so restate that scope whenever you share the
output, and redact real identifiers first.

To continue, refer to the following tutorials:

- [Morning Fleet Check with Palette MCP](./fleet-health-palette-mcp.md), the breadth-first health counterpart to this
  membership review.
