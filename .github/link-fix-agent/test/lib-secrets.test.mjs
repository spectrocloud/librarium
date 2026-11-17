import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findSecrets, newSecrets } from "../lib/secrets.mjs";
import { FAKE, privateKeyWith } from "./helpers.mjs";

// Built from parts, like the fake credentials, so that no key header sits in the repo.
const keyHeader = (type) => ["-----BEGIN", type, "KEY-----"].join(" ");

describe("findSecrets", () => {
  it("finds an Anthropic API key", () => {
    assert.deepEqual(findSecrets(`ANTHROPIC_API_KEY=${FAKE.anthropic}`), ["Anthropic API key"]);
  });

  it("finds each type of classic GitHub token", () => {
    for (const prefix of ["ghp_", "gho_", "ghu_", "ghs_", "ghr_"]) {
      assert.deepEqual(findSecrets(`token ${prefix}${"b".repeat(36)}`), ["GitHub token"], prefix);
    }
  });

  it("finds a fine-grained GitHub token", () => {
    assert.deepEqual(findSecrets(`GH_TOKEN=${FAKE.githubFineGrained}`), ["GitHub fine-grained token"]);
  });

  it("finds a private key block of any type", () => {
    for (const type of ["RSA PRIVATE", "OPENSSH PRIVATE", "EC PRIVATE", "PRIVATE"]) {
      const block = `${keyHeader(type)}\n${"M".repeat(64)}\n-----END ${type} KEY-----`;
      assert.deepEqual(findSecrets(block), ["private key"], type);
    }
  });

  it("ignores a private key header without a key body", () => {
    assert.deepEqual(findSecrets(`${keyHeader("RSA PRIVATE")}\nMIIE...\n`), []);
  });

  it("finds a credential inside a URL or a JSON string", () => {
    assert.deepEqual(findSecrets(`https://example.com/?key=${FAKE.anthropic}&x=1`), ["Anthropic API key"]);
    assert.deepEqual(findSecrets(JSON.stringify({ text: `token: ${FAKE.github}` })), ["GitHub token"]);
  });

  it("names each kind once, in a fixed order, when the text holds several", () => {
    const text = [FAKE.privateKey, FAKE.github, FAKE.anthropic, `${FAKE.anthropic}x`].join("\n");
    assert.deepEqual(findSecrets(text), ["Anthropic API key", "GitHub token", "private key"]);
  });

  it("finds nothing in ordinary docs text and URLs", () => {
    const text = [
      "See [the PR](https://github.com/spectrocloud/librarium/pull/42).",
      "Read https://docs.anthropic.com/en/api/getting-started for the API.",
      "Keys start with sk-ant- and classic tokens with ghp_ or github_pat_.",
      "",
    ].join("\n");
    assert.deepEqual(findSecrets(text), []);
    assert.deepEqual(findSecrets(""), []);
  });

  it("needs at least 20 characters after sk-ant-", () => {
    assert.deepEqual(findSecrets("sk-ant-" + "a".repeat(19)), []);
    assert.deepEqual(findSecrets("sk-ant-" + "a".repeat(20)), ["Anthropic API key"]);
  });

  it("needs at least 30 characters after a GitHub token prefix, and a known token type", () => {
    assert.deepEqual(findSecrets("ghp_" + "b".repeat(29)), []);
    assert.deepEqual(findSecrets("ghx_" + "b".repeat(36)), []);
    assert.deepEqual(findSecrets("github_pat_" + "c".repeat(29)), []);
  });

  it("ignores a public key or a certificate", () => {
    assert.deepEqual(findSecrets(keyHeader("PUBLIC")), []);
    assert.deepEqual(findSecrets(["-----BEGIN", "CERTIFICATE-----"].join(" ")), []);
  });

  it("gives the same answer when it checks the same text twice", () => {
    const text = `a ${FAKE.anthropic} b ${FAKE.github}`;
    assert.deepEqual(findSecrets(text), findSecrets(text));
    assert.deepEqual(findSecrets(text), ["Anthropic API key", "GitHub token"]);
  });
});

describe("newSecrets", () => {
  it("names a credential that the new text adds", () => {
    assert.deepEqual(newSecrets("See the guide.", `See the guide. ${FAKE.anthropic}`), ["Anthropic API key"]);
  });

  it("does not count a credential that the old text already held", () => {
    const before = `Example: ${FAKE.github}\n`;
    assert.deepEqual(newSecrets(before, before), []);
    assert.deepEqual(newSecrets(before, `${before}See [the guide](https://new.example.com/).\n`), []);
  });

  it("counts a new value even when the old text held another credential of the same kind", () => {
    const other = "sk-ant-" + "z".repeat(30);
    assert.deepEqual(newSecrets(`old ${FAKE.anthropic}`, `old ${FAKE.anthropic} new ${other}`), ["Anthropic API key"]);
  });

  it("names only the kinds that gained a new value", () => {
    const before = `${FAKE.github}\n`;
    const after = `${FAKE.github}\n${FAKE.githubFineGrained}\n${FAKE.anthropic}\n`;
    assert.deepEqual(newSecrets(before, after), ["Anthropic API key", "GitHub fine-grained token"]);
  });

  it("returns nothing when a credential was removed", () => {
    assert.deepEqual(newSecrets(`key ${FAKE.anthropic}`, "key removed"), []);
  });

  it("returns nothing for two texts without credentials", () => {
    assert.deepEqual(newSecrets("", ""), []);
    assert.deepEqual(newSecrets("a", "b"), []);
  });

  it("counts a second private key added to a text that already holds one of the same type", () => {
    const before = `${privateKeyWith("A")}\n`;
    const after = `${before}${privateKeyWith("B")}\n`;
    assert.deepEqual(newSecrets(before, after), ["private key"]);
  });

  it("ignores a placeholder key whose body is dots, as the docs show", () => {
    const label = ["RSA", "PRIVATE", "KEY"].join(" ");
    const placeholder = `"clientKey": "-----BEGIN ${label}-----\\n........\\n-----END ${label}-----"`;
    assert.deepEqual(findSecrets(placeholder), []);
    assert.deepEqual(newSecrets("", placeholder), []);
  });
});
