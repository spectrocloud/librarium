<!-- vale off -->

# Overview

This document is maintained by the Spectro Cloud Documentation Team of writers chartered to set and maintain readability, usage, correctness, and consistency for Spectro Cloud’s documentation content.

For reference materials not covered in this guide, defer to the [Google Developer Documentation Style Guide](https://developers.google.com/style).

# Inclusive English for a Global Audience

At Spectro Cloud, we want to write with inclusivity in mind. Our products are not only complex but our users come from a wide range of diverse backgrounds. This includes their technology skills, the languages they speak, the cultures they are a part of, and any disabilities they may have. As a result, we want to make our content clear, relatable, and avoid the assumption that all users interact with our software in the same way (such as in the case of disabilities). 

The following sections explain many of the tactics we use to achieve our goal of inclusive documentation.

## Simplified English

Use simple English unless explicitly stated otherwise in this guide. Simple language helps the reader retain information and more readily understand concepts while also making our material more accessible to those for whom English is not a first language.
 
| Good ✅| Bad ❌|
| -------| -----|
| The core Kubernetes API is flexible and can also be extended to support custom resources.| 	
The interior Kubernetes API is malleable and provides the capability for consumers to extended custom logic and inject custom logical resources.|
| Choose a node to be the cluster master node.| Designate a node to be the cluster master node.|
| Drain the node before a version upgrade.| It is essential to drain the node prior to a version upgrade.|

## Voice

Write in a simple voice. We explain our processes and actions with simple messages and to the point.

As a general rule, use active voice by default. Use passive only when the actor is unknown, irrelevant, or when emphasizing the result.

### Active Voice

Use the active voice whenever possible. It’s more direct, clear, and concise.

When documenting a procedure or instructing the user to do something, especially in a numbered list, we should always use the active voice.

Use “you” to address the user directly. Use “we” when providing recommendations.

| Active Voice ✅| Passive Voice ❌|
| ----------------| ---------------|
| _Use_ the `kubectl` CLI to create a namespace titled `mgmt`.| The `kubectl` CLI _can be used_ to create namespaces titled `mgmt`.|
| Before upgrading, _review_ the release notes for breaking changes.| Release notes _should be_ carefully _reviewed_ for breaking changes before an upgrade.|
| We _recommended_ deploying Palette in a highly-available configuration of at least three nodes.| It _is recommended_ to deploy Palette in a highly-available configuration of at least three nodes.|

### Passive Voice

Use the passive voice when:

- The actor is unknown, irrelevant, or implied.

- You want to emphasize the result over the person or system doing the action.

- You are listing known limitations or system constraints.

- You are following a neutral, objective, or formal tone.

| Acceptable ✅ | Why?|
| --------------| ----|
| Autoscaling is not supported for GKE clusters.| Limitation (actor is assumed or not important; focus is on what is not supported)|
| The node must be drained before the upgrade can proceed.| Emphasis on receiver of actor (what needs to be done, not who does it)|
| A new token is generated automatically.| Focus is on outcome, not actor|

:::tip

Below are some great resources to help you differentiate between active and passive voice:

- [Active and Passive Voice Rules - Josh Jagran](https://www.jagranjosh.com/articles/active-and-passive-voice-rules-with-examples-1748263067-1)

- [How to Move from Passive to Active Voice in Your Business Writing - For Dummies](https://www.dummies.com/article/business-careers-money/careers/general-careers/move-passive-active-voice-business-writing-242741/)

:::

## Present Tense

Users read documentation to perform tasks or gather information. For users, these activities occur in the present, so the present tense is proper in most cases. The present tense is also easier to read than the past or future tense.

Use future tense only when you emphasize that something will occur later (from the users' perspective). To quickly find and remove instances of future tense, search for will.

## Simplicity Assumption

Our products improve the Kubernetes experience and greatly reduce the challenges encountered with Kubernetes, but at the end of the day, our workflows are still complicated. Avoid injecting assumptions into the text. Readers find it frustrating to read documentation that states an action or set of actions is easy. Show compassion to the reader and make it “easy” by providing clear and concise guidance. Omit the subjective terms.

| Good ✅| Bad ❌|
| -------| ------|
| Deploy the container in a few steps.| Deploy the container in a few _simple_ steps.|
| Palette reduces the overhead and common challenges encountered when using Kubernetes.| Palette makes Kubernetes _easy to use_.|

## Ableist Language

Do not use ableist language. Ableist language takes words that have historically, or are currently, used to describe people with disabilities, and uses them in a discriminatory or dismissive manner. Ableist language includes words or phrases such as _crazy_, _insane_, _blind to_ or _blind eye to_, _cripple_, _dumb_, _master_, _slave_, and _others_. 

Identify hierarchical structures using the terms _control plane_, _worker_, _primary_, and _secondary_.

| Good ✅| Bad ❌|
| -------| ------|
| Before launch, give everything a _final check for completeness and clarity_.| Before launch, give everything a final _sanity-check_.|
| It _slows down_ the service, causing a poor user experience until the queue clears.| It _cripples_ the service, causing a poor user experience until the queue clears.|
| Replace the _placeholder_ in this example with the appropriate value.| Replace the dummy variable in this example with the appropriate value.|
| You can customize the repave time interval for all node pools except the _control plane_ node pool.| You can customize the repave time interval for all node pools except the _master_ node pool.|

## Inclusive Software Interactions

Phones, tablets, screen readers, and other tools have changed the way users interact with technology. While we do not forbid using verbs such as “click,” it is important to understand the accessibility and media implications of certain verbs and use alternatives when possible. 

Our top priority is clarity. If rephrasing a sentence to be inclusive results in a lengthy, convoluted, or awkward sentence, use the verb that makes the content the most clear.

| Inclusive ✅| Non-Inclusive ❌|
| ------------| ---------------|
| "The text _appears_" or "The text _is displayed_.”| “You will _see_ the text appear.”|
| "_Go_ to section 5" or "_Navigate_ to section 5."| "_Jump_ to section 5."|
| "_Select_ the green button" or "_Choose_ the green button."| "_Click_ the green button."|

:::info

“Run” in the context of “run a program” or “run a command” is widely understood and is generally considered inclusive.

:::

## Real-World Names and Locations

Try to use diverse names, ages, and locations in examples. As a U.S.-based company, avoid only using Western locations and names. The Google Style Guide has a great list of [common international names](https://developers.google.com/style/examples#names). 

| Good ✅| Bad ❌|
| -------| ------|
| The NOC-UI displays three active clusters. The following example displays two active clusters available in _eastern Asia_ and another cluster in _central Europe_.| The NOC-UI displays three active clusters. The following image displays three active clusters in _North America’s west and eastern regions_.|
| Lee and Raha are both experienced engineers that fit the decision maker persona.| John and Dave are both experienced engineers that fit the decision maker persona.|

## Gender
## Contractions
## Wordiness
### Angle Brackets (>)
### UI Elements as Verbs 
## Latin Phrases
# Grammar Guidance
## American Spelling
## Capitalization
### Headings
### Headline Style
### Acronyms and Initialisms
## Parentheses
### Clarifying Values or Examples
### List Items
### Optional Steps
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