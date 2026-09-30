# linkinator configuration

These configs drive the broken-link checks run from the `Makefile` targets `verify-url-links`, `verify-url-links-ci`,
`verify-rate-limited-links`, and `verify-rate-limited-links-ci`.

- `linkinator.config.json` / `linkinator-ci.config.json` — check all docs (`VERIFY_URL_PATHS`), concurrency 50, recurse.
  These use linkinator's default user agent.
- `linkinator-rate-limit.config.json` / `linkinator-rate-limit-ci.config.json` — check only the rate-limited pages
  (`RATE_LIMITED_FILES_LIST`: `security-bulletins/**`, `unlisted/cve-reports.md`), concurrency 1, no recurse.

## Skip list

Because linkinator configs are plain JSON, they cannot carry inline comments. This section records why each surviving
`skip` entry stays. Last audited 2026-09-16 (DOC-3175), tested with an honest browser user agent and re-checked with
curl-default, linkinator, and no-user-agent clients.

### Structural (not external links)

| Entry                                       | Reason                                                             |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `docs.spectrocloud.com` (http + https)      | Our own site; validated by the build, not by the external checker. |
| `.../supplemental-packs`                    | Dynamically generated pages with no static target.                 |
| `software-private.spectrocloud.com`         | Authentication-gated internal host.                                |
| `^/.*.md`, `^/.*.md#*`                      | Relative Markdown source links, resolved by the build.             |
| `![.*](.*)`, `.(jpg\|jpeg\|png\|gif\|webp)` | Markdown image syntax and image assets, not navigable URLs.        |

### External hosts that block automated clients

Each returns 403 (or 418) to an honest browser user agent, so the block is genuine bot protection, not an artifact of
the old Chrome/79 spoof removed in DOC-3126. Removing these would surface false broken-link failures.

| Host                    | Status (2026-09-16)          |
| ----------------------- | ---------------------------- |
| `developers.redhat.com` | 403                          |
| `docs.redhat.com`       | 403                          |
| `www.intel.com`         | 403                          |
| `www.gnu.org`           | 403                          |
| `platform.openai.com`   | 403                          |
| `www.raspberrypi.com`   | 403                          |
| `www.freedesktop.org`   | 418                          |
| `linux.die.net`         | 403                          |
| `mysql.com`             | 403                          |
| `dev.mysql.com`         | 403                          |
| `github.com`            | Rate-limited on bulk checks. |

### Login walls

| Host                  | Reason                                                    |
| --------------------- | --------------------------------------------------------- |
| `portal.azure.com`    | Interactive login wall; no stable public target to check. |
| `entra.microsoft.com` | Interactive login wall; no stable public target to check. |

### Retained this round, future removal candidates

`socket.dev` and `cursor.com` returned 200 to honest clients in the 2026-09-16 audit but were outside the DOC-3175
removal scope. Re-evaluate them in a future prune.

## Known gap

The two rate-limit configs still carry the spoofed `Chrome/79` `userAgent` that DOC-3126 removed from the main configs.
Removing it is tracked separately because it touches CVE-page link checking and needs its own verification.
