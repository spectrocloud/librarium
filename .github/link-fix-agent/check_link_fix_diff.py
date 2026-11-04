#!/usr/bin/env python3
"""Deterministic guard for an agent-made broken-link fix.

Runs after the agent and before anything is pushed. The agent never holds a
GitHub token; this script decides whether its working-tree changes may become a
PR. Stdlib only.

Usage: check_link_fix_diff.py <repo-dir> <link_report.json> [--no-network]
       Set LINKINATOR to the linkinator command (default: "npx linkinator").

Exit 0: safe to open a PR. Prints PROSE_CHANGED=1 when any change goes beyond a
        URL swap, and UNVERIFIED_LINKS=1 when a new URL could not be checked, so
        the PR can be labeled for closer review.
Exit 1: a hard rule failed. Do not open a PR.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import time

URL_RE = re.compile(r"https?://[^\s)\]\"'<>`]+")
BOT_BLOCK_CODES = {401, 403, 429}
RETRIES = 3
RETRY_PAUSE_SECONDS = 10
DOC_PREFIXES = ("docs/", "_partials/")
DOC_SUFFIXES = (".md", ".mdx")
FROZEN_PREFIXES = ("docs/deprecated/",)
LINKINATOR_CONFIGS = ("linkinator/linkinator.config.json", "linkinator/linkinator-ci.config.json")


def git(repo, *args):
    return subprocess.run(["git", "-C", repo, *args], check=True, capture_output=True, text=True).stdout


def urls(text):
    return set(URL_RE.findall(text))


def defrag(url):
    # linkinator reports and checks URLs without their #fragment.
    return url.split("#", 1)[0]


def normalize(text):
    # Swap every URL for a placeholder and collapse whitespace, so a pure URL
    # swap, including a Prettier reflow, compares equal.
    return " ".join(URL_RE.sub("<URL>", text).split())


def check_with_linkinator(repo, linkinator, new_urls):
    # Judge new URLs with the same tool and config as the weekly report, so a
    # fix passes or fails by the rule that flagged the old link.
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, "new-links.md")
        with open(page, "w") as f:
            f.writelines(f"- [link]({u})\n" for u in new_urls)
        # The CI config sets verbosity "error", which lists only failures. Ask
        # for every link so a crashed run can't pass as "nothing broken".
        proc = subprocess.run(
            [*linkinator.split(), "new-links.md", "--config", os.path.join(repo, "linkinator/linkinator-ci.config.json"),
             "--verbosity", "info"],
            cwd=tmp, capture_output=True, text=True,
        )
    try:
        links = json.loads(proc.stdout)["links"]
    except (json.JSONDecodeError, KeyError):
        sys.exit(f"linkinator produced no usable report (exit {proc.returncode}):\n{proc.stderr[-2000:]}")
    return {defrag(link["url"]): (link["state"], link.get("status")) for link in links}


def verdict(state, status):
    # OK: loads. UNVERIFIED: the site blocks bots or is on the skip list, so a
    # human checks it. BROKEN: gone, so the PR must not open.
    if state == "OK":
        return "OK"
    if state == "SKIPPED" or status in BOT_BLOCK_CODES:
        return "UNVERIFIED"
    return "BROKEN"


def main():
    # Absolute, because linkinator runs from a temp directory.
    repo, report_path = os.path.abspath(sys.argv[1]), sys.argv[2]
    network = "--no-network" not in sys.argv
    linkinator = os.environ.get("LINKINATOR", "npx linkinator")
    reported = {e["url"] for e in json.load(open(report_path))}
    failures, notes = [], []
    prose_changed = False

    changed = [l for l in git(repo, "status", "--porcelain").splitlines() if l.strip()]
    paths = [l[3:] for l in changed]
    if not paths:
        print("No changes. Nothing to open.")
        return 0

    old_urls, new_urls = set(), set()
    for path in paths:
        status = next(l[:2] for l in changed if l[3:] == path)
        if status.strip() != "M":
            failures.append(f"{path}: only modifications are allowed (status {status.strip()})")
            continue

        old = git(repo, "show", f"HEAD:{path}")
        new = open(f"{repo}/{path}", encoding="utf-8").read()

        # Rule 1: only docs pages and the linkinator skip lists may change.
        if path in LINKINATOR_CONFIGS:
            o, n = json.loads(old), json.loads(new)
            if {k: v for k, v in o.items() if k != "skip"} != {k: v for k, v in n.items() if k != "skip"}:
                failures.append(f"{path}: changed something other than the skip array")
            notes.append(f"{path}: skip patterns added: {sorted(set(n.get('skip', [])) - set(o.get('skip', [])))}")
            continue
        if not (path.startswith(DOC_PREFIXES) and path.endswith(DOC_SUFFIXES)):
            failures.append(f"{path}: outside docs/ and _partials/ Markdown")
            continue
        if path.startswith(FROZEN_PREFIXES):
            failures.append(f"{path}: the weekly scan excludes this folder, so the fix must too")
            continue

        old_urls |= urls(old)
        new_urls |= urls(new)

        # Rule 2: flag anything beyond a URL swap. Allowed, but labeled.
        if normalize(old) != normalize(new):
            prose_changed = True
            notes.append(f"{path}: text changed beyond the URL swap")

    # Rule 3: the agent may only remove URLs that the report flagged.
    removed = old_urls - new_urls
    reported_bare = {defrag(u) for u in reported}
    unreported = sorted(u for u in removed if defrag(u) not in reported_bare)
    if unreported:
        failures.append(f"removed URLs that were not in the report: {unreported}")

    # Rule 4: every URL the agent introduced must not be broken. Bot-blocked or
    # skip-listed URLs pass but are flagged for the reviewer.
    added = sorted(new_urls - old_urls)
    unverified = False
    results = check_with_linkinator(repo, linkinator, added) if (network and added) else {}
    # Bot blocks are often transient: retry them before reporting an error.
    for attempt in range(RETRIES):
        blocked = [u for u in added if results.get(defrag(u), ("MISSING", None))[1] in BOT_BLOCK_CODES]
        if not blocked:
            break
        time.sleep(RETRY_PAUSE_SECONDS)
        results.update(check_with_linkinator(repo, linkinator, blocked))
    for url in added:
        if not network:
            notes.append(f"not checked (offline): {url}")
            continue
        state, status = results.get(defrag(url), ("MISSING", None))
        v = verdict(state, status)
        unverified |= v == "UNVERIFIED"
        if v == "UNVERIFIED" and status in BOT_BLOCK_CODES:
            v = f"ERROR after {RETRIES + 1} attempts:"
        (failures if v == "BROKEN" else notes).append(f"{v} {status} {url}")

    # Rule 5: both linkinator configs keep identical skip lists.
    skips = [json.loads(open(f"{repo}/{p}").read()).get("skip", []) for p in LINKINATOR_CONFIGS]
    if sorted(skips[0]) != sorted(skips[1]):
        failures.append("linkinator configs have different skip lists")

    print(f"Changed files: {len(paths)}  URLs removed: {len(removed)}  URLs added: {len(added)}")
    for n in notes:
        print(f"  note: {n}")
    for f in failures:
        print(f"  FAIL: {f}")
    print(f"PROSE_CHANGED={int(prose_changed)}")
    print(f"UNVERIFIED_LINKS={int(unverified)}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
