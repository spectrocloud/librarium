<!-- vale off -->

# Spectro Cloud Internal Style Guide

This document is maintained by the Spectro Cloud Documentation Team of writers chartered to set and maintain
readability, usage, correctness, and consistency for Spectro Cloud’s documentation content.

For reference materials not covered in this guide, defer to the
[Google Developer Documentation Style Guide](https://developers.google.com/style).

- [Inclusive English for a Global Audience](#inclusive-english-for-a-global-audience)
  - [Simplified English](#simplified-english)
  - [Voice](#voice)
    - [Active Voice](#active-voice)
    - [Passive Voice](#passive-voice)
  - [Present Tense](#present-tense)
  - [Simplicity Assumption](#simplicity-assumption)
  - [Ableist Language](#ableist-language)
  - [Inclusive Software Interactions](#inclusive-software-interactions)
  - [Real-World Names and Locations](#real-world-names-and-locations)
  - [Gender](#gender)
  - [Contractions](#contractions)
  - [Wordiness](#wordiness)
    - [Angle Brackets (>)](#angle-brackets-)
    - [UI Elements as Verbs](#ui-elements-as-verbs)
  - [Latin Phrases](#latin-phrases)
- [Grammar Guidance](#grammar-guidance)
  - [American Spelling](#american-spelling)
  - [Capitalization](#capitalization)
    - [Headings](#headings)
    - [Headline Style](#headline-style)
    - [Acronyms and Initialisms](#acronyms-and-initialisms)
  - [Parentheses](#parentheses)
    - [Clarifying Values or Examples](#clarifying-values-or-examples)
    - [List Items](#list-items)
    - [Optional Steps](#optional-steps)
    - [Parenthetical Expressions and Jargon](#parenthetical-expressions-and-jargon)
    - [Single and Plural Subjects](#single-and-plural-subjects)
  - [Commas](#commas)
  - [Prepositions](#prepositions)
  - [Dialogue](#dialogue)
  - [Numbers](#numbers)
  - [Lists](#lists)
  - [Colons](#colons)
  - [Computer Resources (Units of Measurement)](#computer-resources-units-of-measurement)
- [Other Style Choices](#other-style-choices)
  - [Future Features](#future-features)
  - [Directionals](#directionals)
  - [Emoticons](#emoticons)
  - [Text Formatting](#text-formatting)
    - [Commands & Parameters](#commands--parameters)
      - [Command Output](#command-output)
        - [Lengthy Output](#lengthy-output)
    - [Product UI Naming](#product-ui-naming)
- [Documentation UI Components](#documentation-ui-components)
  - [Markdown Tables](#markdown-tables)
  - [Admonitions](#admonitions)
  - [Supplemental Information](#supplemental-information)
  - [Next Steps](#supplemental-information)
  - [Resources List](#resources-list)
- [Image File Naming Standard](#image-file-naming-standard)

# Inclusive English for a Global Audience

At Spectro Cloud, we want to write with inclusivity in mind. Our products are not only complex but our users come from a
wide range of diverse backgrounds. This includes their technology skills, the languages they speak, the cultures they
are a part of, and any disabilities they may have. As a result, we want to make our content clear, relatable, and avoid
the assumption that all users interact with our software in the same way (such as in the case of disabilities).

The following sections explain many of the tactics we use to achieve our goal of inclusive documentation.

## Simplified English

Use simple English unless explicitly stated otherwise in this guide. Simple language helps the reader retain information
and more readily understand concepts while also making our material more accessible to those for whom English is not a
first language.

| Good ✅                                                                                                                                          | Bad ❌                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| The core Kubernetes API is flexible and can also be extended to support custom resources.                                                        |
| The interior Kubernetes API is malleable and provides the capability for consumers to extended custom logic and inject custom logical resources. |
| Choose a node to be the cluster master node.                                                                                                     | Designate a node to be the cluster master node.               |
| Drain the node before a version upgrade.                                                                                                         | It is essential to drain the node prior to a version upgrade. |

## Voice

Write in a simple voice. We explain our processes and actions with simple messages and to the point.

As a general rule, use active voice by default. Use passive only when the actor is unknown, irrelevant, or when
emphasizing the result.

### Active Voice

Use the active voice whenever possible. It’s more direct, clear, and concise.

When documenting a procedure or instructing the user to do something, especially in a numbered list, we should always
use the active voice.

Use “you” to address the user directly. Use “we” when providing recommendations.

| Active Voice ✅                                                                                 | Passive Voice ❌                                                                                   |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| _Use_ the `kubectl` CLI to create a namespace titled `mgmt`.                                    | The `kubectl` CLI _can be used_ to create namespaces titled `mgmt`.                                |
| Before upgrading, _review_ the release notes for breaking changes.                              | Release notes _should be_ carefully _reviewed_ for breaking changes before an upgrade.             |
| We _recommended_ deploying Palette in a highly-available configuration of at least three nodes. | It _is recommended_ to deploy Palette in a highly-available configuration of at least three nodes. |

### Passive Voice

Use the passive voice when:

- The actor is unknown, irrelevant, or implied.

- You want to emphasize the result over the person or system doing the action.

- You are listing known limitations or system constraints.

- You are following a neutral, objective, or formal tone.

| Acceptable ✅                                            | Why?                                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Autoscaling is not supported for GKE clusters.           | Limitation (actor is assumed or not important; focus is on what is not supported) |
| The node must be drained before the upgrade can proceed. | Emphasis on receiver of actor (what needs to be done, not who does it)            |
| A new token is generated automatically.                  | Focus is on outcome, not actor                                                    |

> [!TIP]
>
> Below are some great resources to help you differentiate between active and passive voice:
>
> - [Active and Passive Voice Rules - Josh Jagran](https://www.jagranjosh.com/articles/active-and-passive-voice-rules-with-examples-1748263067-1)
> - [How to Move from Passive to Active Voice in Your Business Writing - For Dummies](https://www.dummies.com/article/business-careers-money/careers/general-careers/move-passive-active-voice-business-writing-242741/)

## Present Tense

Users read documentation to perform tasks or gather information. For users, these activities occur in the present, so
the present tense is proper in most cases. The present tense is also easier to read than the past or future tense.

Use future tense only when you emphasize that something will occur later (from the users' perspective). To quickly find
and remove instances of future tense, search for will.

## Simplicity Assumption

Our products improve the Kubernetes experience and greatly reduce the challenges encountered with Kubernetes, but at the
end of the day, our workflows are still complicated. Avoid injecting assumptions into the text. Readers find it
frustrating to read documentation that states an action or set of actions is easy. Show compassion to the reader and
make it “easy” by providing clear and concise guidance. Omit the subjective terms.

| Good ✅                                                                               | Bad ❌                                        |
| ------------------------------------------------------------------------------------- | --------------------------------------------- |
| Deploy the container in a few steps.                                                  | Deploy the container in a few _simple_ steps. |
| Palette reduces the overhead and common challenges encountered when using Kubernetes. | Palette makes Kubernetes _easy to use_.       |

## Ableist Language

Do not use ableist language. Ableist language takes words that have historically, or are currently, used to describe
people with disabilities, and uses them in a discriminatory or dismissive manner. Ableist language includes words or
phrases such as _crazy_, _insane_, _blind to_ or _blind eye to_, _cripple_, _dumb_, _master_, _slave_, and _others_.

Identify hierarchical structures using the terms _control plane_, _worker_, _primary_, and _secondary_.

| Good ✅                                                                                             | Bad ❌                                                                                       |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Before launch, give everything a _final check for completeness and clarity_.                        | Before launch, give everything a final _sanity-check_.                                       |
| It _slows down_ the service, causing a poor user experience until the queue clears.                 | It _cripples_ the service, causing a poor user experience until the queue clears.            |
| Replace the _placeholder_ in this example with the appropriate value.                               | Replace the dummy variable in this example with the appropriate value.                       |
| You can customize the repave time interval for all node pools except the _control plane_ node pool. | You can customize the repave time interval for all node pools except the _master_ node pool. |

## Inclusive Software Interactions

Phones, tablets, screen readers, and other tools have changed the way users interact with technology. While we do not
forbid using verbs such as “click,” it is important to understand the accessibility and media implications of certain
verbs and use alternatives when possible.

Our top priority is clarity. If rephrasing a sentence to be inclusive results in a lengthy, convoluted, or awkward
sentence, use the verb that makes the content the most clear.

| Inclusive ✅                                                | Non-Inclusive ❌                  |
| ----------------------------------------------------------- | --------------------------------- |
| "The text _appears_" or "The text _is displayed_.”          | “You will _see_ the text appear.” |
| "_Go_ to section 5" or "_Navigate_ to section 5."           | "_Jump_ to section 5."            |
| "_Select_ the green button" or "_Choose_ the green button." | "_Click_ the green button."       |

> [!NOTE]
>
> “Run” in the context of “run a program” or “run a command” is widely understood and is generally considered inclusive.

## Real-World Names and Locations

Try to use diverse names, ages, and locations in examples. As a U.S.-based company, avoid only using Western locations
and names. The Google Style Guide has a great list of
[common international names](https://developers.google.com/style/examples#names).

| Good ✅                                                                                                                                                            | Bad ❌                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| The NOC-UI displays three active clusters. The following example displays two active clusters available in _eastern Asia_ and another cluster in _central Europe_. | The NOC-UI displays three active clusters. The following image displays three active clusters in _North America’s west and eastern regions_. |
| Lee and Raha are both experienced engineers that fit the decision maker persona.                                                                                   | John and Dave are both experienced engineers that fit the decision maker persona.                                                            |

## Gender

Use gender-neutral pronouns. Avoid the pronouns _he_, _him_, _his_, _she_, or _her_. The same applies to _he/she_ or
_(s)he_ or other such punctuational approaches. Use the singular _they_. Better yet, engage the reader using _you_ or
_your_, as shown in the second example below.

| Good ✅                                                                                                                       | Bad ❌                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| In previous outages, one of the operators did not follow best practices. They merged source code directly to the main branch. | In previous outages, one of the operators did not follow best practices. He merged source code directly to the main branch. |
| You can create and deploy custom images to most infrastructure providers using various tools.                                 | The user can create and deploy custom images to most infrastructure providers using various tools.                          |

## Contractions

Avoid contractions (using an apostrophe is used to combine two words into one). For example, words such as _they’ve_ and
_can't_ may be difficult for non-native English speakers to comprehend. Therefore, it is recommended to not use them.

| Good ✅                                                                                                         | Bad ❌                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| You cannot scale down the number of nodes in a PCG.                                                             | You can’t scale down the number of nodes in a PCG.                                                            |
| If you are using a built-in search feature, ensure it is case-insensitive.                                      | If you're using a built-in search feature, ensure it's case-insensitive.                                      |
| Now that you have deployed a MAAS cluster, you can start developing and deploying applications to your cluster. | Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. |

## Wordiness

To reduce the length of sentences and make documentation more concise, use the following tactics when possible.

### Angle Brackets (`>`)

Angle brackets are a common documentation strategy for combining several small, related steps when there is little room
for misinterpretation or confusion, allowing the reader to focus on what they need to do rather than get bogged down by
transitional words (e.g. _then_, _next_). Use only if the elements are on the same screen or are within close proximity
of one another.

If the UI element does not have any text associated with it (e.g. _main menu_, _drop-down menu_) do not use angle
brackets.

| Good ✅                                                                  | Bad ❌                                                                           |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| On the cluster **Overview** tab, select **Settings > Cluster Settings**. | On the cluster **Overview** tab, select **Settings**, then **Cluster Settings**. |
| From the left main menu, select **Cluster Profiles**.                    | Navigate to left main menu **> Cluster Profiles**.                               |

### UI Elements as Verbs

Allow UI elements to be incorporated as verbs where appropriate. Do not substitute a UI element if it results in a
grammatically incorrect sentence or causes you to change the text of the UI element.

| Good ✅                                                                       | Bad ❌                                                                                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Save** your changes.                                                        | Click **Save** to save your changes.                                                                                                              |
| After you are finished modifying a profile layer, select **Confirm Updates**. | - After you are finished modifying a profile layer, Confirm Updates.<br>- After you are finished modifying a profile layer, Confirm your Updates. |

## Latin Phrases

Avoid using the following Latin phrases, as their meaning is not understood by all.

- _e.g_ (exempli gratia) - “For example”

- _i.e._ (id est) - “In other words”

# Grammar Guidance

Like our users, Spectro Cloud is made up of individuals from a wide range of backgrounds. As a U.S.-based company, we
use American English for our documentation, which has its own spelling and punctuation variations; however, there are
certain exceptions, such as the Oxford comma. The following sections serve as a quick reference for certain grammar
rules.

## American Spelling

Always use American Spelling. While certain spelling variations are well known (e.g. _grey_ vs. _gray_), others are
often overlooked. Some common offenders are listed below.

- _Afterward_ (not _afterwards_)

- _Forward_ and _backward_ (not _forwards_ and _backwards_)

- _Toward_ (not _towards_)

## Capitalization

Capitalize the first word of a sentence and all proper nouns, such as product names.

| Good ✅                                                                         | Bad ❌                                                                          |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A common container orchestration platform used in the industry is _Kubernetes_. | a common container orchestration platform used in the industry is _kubernetes_. |
| Navigate to the _Palette_ console.                                              | Navigate to the _palette_ console.                                              |

### Headings

Avoid using an acronym for the first time in a title or heading unless it is a keyword you need to place in the title or
heading for Search Engine Optimization (SEO). If the first use of the acronym is in a title or heading, introduce the
acronym (in parentheses, following the spelled-out term) in the following body text. Aim for descriptive headings and
titles to help users navigate the page. From a user perspective, it's easier to navigate between pages and sections of a
page if the headings and titles are unique.

- If the heading is more in line with a task, such as our how-to docs and tutorials, start with the plain form of the
  task’s base form: _**Migrate** to Palette_.

- If the heading is conceptual or non-task-based, then start with a noun: _**Migration** to Palette_.

- Do not use verbs ending with _-ing_ (gerund).

### Headline Style

Use title case for headings. Below are some helpful tips.

- Capitalize the first and last words, nouns, pronouns, verbs, adjectives, adverbs, and subordinating conjunctions
  (_if_, _because_, _as_, _that_, and so on).

- Don't capitalize articles (_a_, _an_, _the_), coordinating conjunctions (_and_, _but_, _or_, _nor_), the _to_ in an
  infinitive, and prepositions (_with_, _to_, _for_, _in_, _from_).

- For hyphenated words, capitalize the first and subsequent elements unless they are articles, prepositions, and
  coordinating conjunctions.

| Good ✅                           | Bad ❌                            |
| --------------------------------- | --------------------------------- |
| Deploy a Pack Registry Server     | Deploying A Pack Registry Server  |
| Access Audit Logs                 | Accessing audit logs              |
| Quick Start with Palette App Mode | Quick start with Palette app mode |
| The Command-Line Interface        | The command-line interface        |

### Acronyms and Initialisms

Use title case when defining an acronym (an abbreviation pronounced as its own word) or initialism (an abbreviation
pronounced as individual letters) that is a **proper noun**. If it is a common noun, use sentence case. Use the
abbreviation on all subsequent uses.

Use the same rules that apply to headline styles. Some acronyms are, by nature, written using camel case, such as,
_IaaS_, _kCh_, and _SaaS_.

> [!IMPORTANT]
>
> Certain acronyms and initialisms (such as _OS_, _CPU_, _IP_, and more) are considered industry standard and do not
> need to be spelled out. Refer to the Vale file
> [acronym-no-expand.yml](https://github.com/spectrocloud/spectro-vale-pkg/blob/main/packages/spectrocloud-docs-internal/styles/spectrocloud-docs-internal/acronym-no-expand.yml)
> for a list of exceptions.

## Parentheses

Parentheses are often considered distracting or confusing. Only use them in certain situations.

| Use Case                                                                                          | Allowed      |
| ------------------------------------------------------------------------------------------------- | ------------ |
| [Acronyms and initialisms](#acronyms-and-initialisms)                                             | ✅           |
| [Clarifying values or examples](#clarifying-values-or-examples) (parameters, values, files, etc.) | ✅           |
| [List items](#list-items)                                                                         | ❌           |
| [Optional steps](#optional-steps)                                                                 | ✅           |
| [Parenthetical expressions and jargon](#parenthetical-expressions-and-jargon)                     | ⚠️ (depends) |
| [Single and plural subjects](#single-and-plural-subjects)                                         | ❌           |

### Clarifying Values or Examples

Specify parameters, values, files, and similar data to clarify the actions a customer needs to take. Parentheses are not
required if the context or next actions are clear.

| Good ✅                                                                                                                                                                                            | Also Acceptable 👍                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configure the RHEL OS (`OS_DISTRIBUTION=rhel`) and the AMD64 architecture (`ARCH=amd64`).                                                                                                          | Configure the RHEL OS and the AMD64 architecture.<br><br><code>export OS_DISTRIBUTION=rhel</code><br><code>export ARCH=amd64</code>                                                                      |
| Specify a remote repository using the standard address format (for example, `example.com/bundle/example-bundle.tar.zst`), or use the URI format (`file:///path/to/bundle`) for local repositories. | Specify a remote repository using the standard address format, such as `example.com/bundle/example-bundle.tar.zst`, or use the URI format for local repositories. For example, `file:///path/to/bundle`. |
| This procedure requires a physical or virtual Linux machine with an AMD64 (x86_64) processor architecture.                                                                                         | This procedure requires a physical or virtual Linux machine with an AMD64 or x86_64 processor architecture.                                                                                              |

### List Items

This procedure requires a physical or virtual Linux machine with an AMD64 or x86_64 processor architecture.

| Good ✅                                                                                                                   | Bad ❌                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| PXK-E - The `K8S_DISTRIBUTION=kubeadm` value in the `.arg` file for non-FIPS or `K8S_DISTRIBUTION=kubeadm-fips` for FIPS. | PXK-E (the `K8S_DISTRIBUTION=kubeadm value` in the `.arg` file for non-FIPS or `K8S_DISTRIBUTION=kubeadm-fips` for FIPS) |

### Optional Steps

Preface optional steps with the text _(Optional)_. This allows customers to identify optional steps at a glance,
preventing them from reading through or performing actions that may not be applicable to their situation (or worse,
performing an action only to later realize they are not the intended audience, thus disrupting or compromising their
workflow).

If applicable, place the circumstance that makes the step optional **immediately** after _(Optional)_ so that customers
can quickly decide to proceed with or skip the step.

| Good ✅                                                                                                                                                                                                                                                                                                                                                                                                                | Bad ❌                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3. (Optional) To ensure reproducible builds and consistent compliance behavior, you can pin a specific STIG content version before building the base RHEL 9 STIG image <br><br><code>bash rhel-stig/scripts/update-stig-content.sh &lt;stig-content-version&gt;</code>                                                                                                                                                 | 3. To ensure reproducible builds and consistent compliance behavior, you can pin a specific STIG content version before building the base RHEL 9 STIG image <br><br><code>bash rhel-stig/scripts/update-stig-content.sh &lt;stig-content-version&gt;</code>                                                                                                                                                                               |
| 5. (Optional) _If you are using a self-hosted instance of Palette_, build the ISO using the corresponding CanvOS version. <br><code>curl --location --request GET 'https://&lt;palette-endpoint&gt;/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: &lt;api-key&gt;' \| jq --raw-output '.spec.latestVersion.content \| match("version: ([^\\n]+)").captures[0].string'</code> | 5. (Optional) Build the ISO using the corresponding CanvOS version. <br><code>curl --location --request GET 'https://&lt;palette-endpoint&gt;/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: &lt;api-key&gt;' \| jq --raw-output '.spec.latestVersion.content \| match("version: ([^\\n]+)").captures[0].string'</code><br>:::warning<br>This step only applies to self-hosted instances.<br>::: |

### Parenthetical Expressions and Jargon

### Single and Plural Subjects

## Commas

## Prepositions

## Dialogue

## Numbers

## Lists

## Colons

## Computer Resources (Units of Measurement)

# Other Style Choices

## Future Features

## Directionals

## Emoticons

## Text Formatting

### Commands & Parameters

#### Command Output

##### Lengthy Output

### Product UI Naming

# Documentation UI Components

## Markdown Tables

## Admonitions

## Supplemental Information

## Next Steps

## Resources List

# Image File Naming Standard
