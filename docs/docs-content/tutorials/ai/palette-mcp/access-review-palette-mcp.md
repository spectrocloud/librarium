---
sidebar_position: 60
sidebar_label: "Access Review with Palette MCP"
title: "Access Review with Palette MCP: Teams, Users, and Orphans"
description:
  "Build a tenant-wide membership and activation map with the access-review skill: who's on which team, who's pending
  activation, and who has no team and no tenant role at all."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The `access-review` skill builds a tenant-wide membership and activation map: who's on which team, who's still pending
activation, and who has no team and no tenant role at all (an orphaned account). It's a good starting point for security
reviews, onboarding audits, or offboarding checks.

## What This Review Covers

This review reports **tenant-level** roles, as UIDs and counts. **Project-scoped** role assignments require a separate
check—this is a membership and activation map, not a full role-based access audit. State this scope whenever you share a
report, so the audience knows exactly what's covered.

## What You'll Learn

- The team → users → activation → orphans sequence this skill runs
- How to distinguish a fast orphan signal (no extra API calls) from a full orphan check (one call per candidate user)
- Why every example in this section uses redacted placeholder identities, and why that's the right call even for an
  internal test tenant

## Prerequisites

Same as the other tutorials in this series: an MCP-capable client, a Palette API key with tenant-wide read access to
teams and users. No special server flags.

:::info

Every user in this tutorial's live run is replaced with a placeholder (`user1@example.com`, etc.)— real names and email
addresses were captured during the run and then redacted before anything was written to this document. No real
identifier appears below.

:::

## Tools Used in This Tutorial

| Tool         | What it does                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read_teams` | Lists teams (`uid`, `name`, `user_count`, `source_count`), or one team's full roster by `uid`. Filter by `has_user_uid`/`has_user_email` to find a specific user's teams. |
| `read_users` | Lists users (`uid`, `email`, `name`, `is_active`, `tenant_role_count`), or one user's role detail by `uid`.                                                               |

Both read-only.

## Step 1—List Teams

```shell title="Example Prompt"
List all my teams.
```

Live result (redacted) against a real tenant.

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

All three teams show `user_count: 0`—every team in this tenant is currently empty. That's visible directly from this one
call, no expansion needed—Step 1's list mode already answers whether there are empty teams.

## Step 2—List Users

```shell title="Example Prompt"
List all users and their activation status.
```

Live result (redacted).

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

## Step 3—Flag Activation Gaps

All 7 users show `is_active: true` in this run—zero pending activations. That's a genuine result: in a tenant with
pending invites, this is exactly where they'd show up as `is_active: false`.

## Step 4—Flag Orphans

**Fast signal (no extra calls):** users with `tenant_role_count: 0`—five of the seven above (`user2` through `user6`).
This alone is often enough to report.

**Full orphan check** (only for the small zero-role set—never for every user): confirm each candidate also has no team,
via `read_teams` with `filters={has_user_uid:"<uid>"}`.

```shell title="Example Prompt"
Is user2 on any team?
```

```json title="Example Output"
{ "items": [], "total": 0 }
```

Same result for `user4`. Both confirmed as true orphans—no tenant roles, no team membership. In this tenant, that check
is almost a formality: Step 1 already showed every team has `user_count: 0`, so no zero-role user could have a team to
belong to. Run the per-user check in a tenant with real team membership rather than assuming the result from Step 1
alone.

## Step 5—Team Rosters and Per-User Detail

With every team empty, there's no roster to expand in this run. In a tenant with real team membership, `read_teams` with
`uid=<team_uid>` returns `Spec.Users[]`/`Spec.Roles[]` for one team at a time—ask which teams to expand rather than
fetching all of them if the tenant has many.

## Step 6—Synthesize

- **Teams (3):** all empty—worth flagging on its own; three teams with no members is either stale team creation or a gap
  in whatever process was supposed to populate them.
- **Users (7):** 0 pending, 5 confirmed orphans (no roles, no team), 2 with tenant roles.
- Restate the scope (tenant-only, no project-scoped roles) in the final report every time.

## Troubleshooting

| Symptom                                                                | Likely cause                                                                                    | Fix                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every team shows `user_count: 0` in a tenant you know has active teams | Pointed at the wrong tenant/profile—`list_auth_profiles` shows configured hosts                 | Re-run against the correct `auth_profile`.                                                                                                                                       |
| Orphan check (`has_user_uid` filter) returns unexpected results        | `has_user_uid` and `has_user_email` are mutually exclusive—supplying both is a validation error | Pass exactly one.                                                                                                                                                                |
| Real names/emails end up in a saved report                             | This skill returns real PII by design—it's an access review                                     | Redact before sharing outside the immediate reviewer, exactly as this tutorial does—real identifiers don't belong in a document meant to be read by more than the account owner. |

## Security Best Practices

- Read-only; no special server flags needed.
- This is genuinely sensitive output (real names, emails, activation state) even against an internal test tenant—treat
  every access-review report as carrying real people's identifiers, and redact before sharing beyond the person who
  requested it.
- To act on a finding (deactivate an orphan, add a role), the write tools (`update_user`, `update_team`) need
  `--allow-write`—this tutorial doesn't use them.

## Validate

You've completed this tutorial if you can:

- [ ] Run the team → user → activation → orphan sequence against your own tenant.
- [ ] State this skill's scope (tenant-only roles, no project-scoped access) in your own report.
- [ ] Distinguish the fast orphan signal from the full per-user team check, and know when each is enough.
- [ ] Explain why this tutorial's examples are redacted even though the source tenant is internal, not customer-facing.

## Cleanup

Read-only tutorial—nothing to clean up. If you captured any real names/emails while following along, don't leave them in
a saved file or shared document; redact the same way this tutorial does.

## Next Steps

- [Morning Fleet Check with Palette MCP](./fleet-health-palette-mcp.md)—the breadth-first health counterpart to this
  membership review.
