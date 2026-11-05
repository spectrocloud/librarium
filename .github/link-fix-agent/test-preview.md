Your PR is open, CI has finished, and the deploy preview is at `$PREVIEW_BASE`. check-preview.mjs fetched every page
that renders a file you changed. Its output is in `$PREVIEW_FILE`, and the CI results are in `$CHECKS_FILE`.

Test the deploy preview. You can no longer edit files, so report problems instead of fixing them.

1. For each `FAIL` line in the preview check, fetch the page and find out why.
2. For each page where you changed text beyond a URL swap, fetch it and confirm that the new text renders as you
   intended, with no broken Markdown, admonitions, lists, or links.
3. Fetch at least one passing page and confirm that the fixed link appears on it.

Then decide again whether you are confident that the PR can merge. Be confident only when every CI check passed, the
preview check passed, and your own tests found nothing wrong. Otherwise, the reason names what a human should check.

Answer with the structured output. Leave `findings` empty.
