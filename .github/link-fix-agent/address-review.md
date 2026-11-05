A separate reviewer ran the pr-review-buddy skill on your changes in a fresh context. Its report is in `$REVIEW_FILE`.
The deterministic diff check ran on your changes too, and its output is in `$CHECK_FILE`.

1. Fix every `FAIL` line in the diff check output. The check runs again after you finish, and the PR opens only if it
   passes.

2. Address each review finding.

   - Fix it when it is about text you added or changed and the fix stays within the fix-broken-links scope.
   - Decline it when it is about text you did not change, needs a source you do not have, or conflicts with the skill.
     Say why.

3. Update the fix report at `$FIX_REPORT` if your edits changed anything it says.

4. Decide whether you are confident that the PR can merge as soon as a docs code owner approves it. Be confident only
   when all of the following are true:

   - You fetched every new URL, and it covers the same topic as the URL it replaces.
   - Every guidance change cites a source that you fetched.
   - Every review finding is fixed or declined with a reason, and none is an urgent SME check.
   - The diff check output has no `FAIL` line that you could not fix.

   Otherwise you are not confident, and the reason names what a human should check.

Answer with the structured output: your decision, the reason, and one entry per review finding.
