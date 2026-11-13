// Finds credentials in text before it reaches the docs, a public PR, or the
// public artifacts. An agent that a fetched page tricks into reading the Claude
// key could otherwise paste it into any of them.

const SECRET_PATTERNS = [
  { name: "Anthropic API key", pattern: /sk-ant-[A-Za-z0-9_-]{20,}/g },
  { name: "GitHub token", pattern: /gh[pousr]_[A-Za-z0-9]{30,}/g },
  { name: "GitHub fine-grained token", pattern: /github_pat_[A-Za-z0-9_]{30,}/g },
  // The whole block, with a base64 body, so each key is its own value. The docs show
  // placeholder keys whose body is dots, and those do not count.
  {
    name: "private key",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[A-Za-z0-9+/=\s\\]{64,}-----END [A-Z ]*PRIVATE KEY-----/g,
  },
];

/** Returns the name of each kind of credential that `after` holds and `before` did not, or an empty list. */
export function newSecrets(before, after) {
  return SECRET_PATTERNS.filter(({ pattern }) => {
    const existing = new Set(before.match(pattern) ?? []);
    return (after.match(pattern) ?? []).some((value) => !existing.has(value));
  }).map(({ name }) => name);
}

/** Returns the name of each kind of credential found in `text`, or an empty list. */
export function findSecrets(text) {
  return SECRET_PATTERNS.filter(({ pattern }) => text.match(pattern)).map(({ name }) => name);
}
