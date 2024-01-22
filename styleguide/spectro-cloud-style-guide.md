# Spectro Cloud Style Guide

The Spectro Cloud style guide provides standards and guidelines for developing Spectro Cloud-related documentation. The
style guide will act as a tool to ensure that the content produced reflects our sense of style and voice.

# Table of Contents

[About this guide](#about-this-guide)

[SpectroCloud Style and Voice](#spectrocloud-style-and-voice)

- [Simplified English](#simplified-english)
- [SpectroCloud Voice](#spectrocloud-voice)
- [Active voice](#active-voice)
- [Passive voice](#passive-voice)

[Accessibility and Inclusion](#accessibility-and-inclusion)

- [Diverse and Inclusive](#diverse-and-inclusive)
- [Simplicity Assumption](#simplicity-assumption)
- [Gender](#gender)
- [Albeist Language](#ableist-language)

[Content Format](#content-format)

- [Headings](#headings)
- [Headline Style](#headline-style)
- [Numbers](#numbers)
- [Tables](#tables)
- [UI Components](#ui-components)
- [Resources List](#resources-list)
- [Metadata](#metadata)
- [Directional Language](#directional-language)
- [InfoBox](#infobox)
- [Future features](#future-features)

[Language](#language)

- [Nouns and Pronouns](#nouns-and-pronouns)
- [Prepositions](#prepositions)
- [Present tense](#present-tense)
- [Person](#person)

[Links](#links)

- [Cross-references](#cross-references)
- [External URLs](#external-urls)
- [Slash](#slash)

[Punctuation and Grammar](#punctuation-and-grammar)

- [Capitalization](#capitalization)
- [Period, Exclamation Mark, and Question Mark](#period-exclamation-mark-and-question-mark)
- [Colon and Semicolon](#colon-and-semicolon)

[UI Elements (naming)](#ui-elements-naming)

- [Commands and Parameters](#commands-and-parameters)
- [Command Output](#command-output)
- [Parameters](#parameters)

## About this guide

The Spectro Cloud style guide is designed to guide you to create focused, clean and impactful Spectro Cloud content the
best way you can. Everyone across Spectro Cloud can use this guide to help reflect our values in their content’s
approach and tone.

### SpectroCloud Style and Voice

Our brand style and voice reflect what we say and how we say it. We believe in simple, to-the-point, and friendly
communication in our documentation.

### Simplified English

Use simple English in Spectro Cloud material unless explicitly stated otherwise in this guide.

More importantly, simple language helps the reader retain information and more readily understand concepts. Feel free to
review the [simplified English](https://www.simplifiedenglish.net/simplified-english/) resource to understand better how
simplified language improves technical documentation.

| Good ✅                                                                                   | Bad ❌                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| The core Kubernetes API is flexible and can also be extended to support custom resources. | The interior Kubernetes API is malleable and provides the capability for consumers to extended custom logic and inject custom logical resources. |
| Choose a node to be the cluster control plane node.                                       | Designate a node to be the cluster primary node.                                                                                                 |
| Drain the node before a version upgrade.                                                  | It is essential to drain the node prior to a version upgrade.                                                                                    |

### SpectroCloud Voice

Write in a simple voice. We explain our process and actions with simple messages and to the point. We want our Spectro
Cloud content to be:

- Simple: For all users to understand it.

- Focused and concise: For all users to be encouraged to interact with it.

- Friendly and accessible: For all users to engage with it.

Here are some tips to implement in your content:

- Break down complex concepts into concise, bite-size content.

- Use a conversational tone to create more engaging content.

- Address the user as “you” to personalize the content.

- Include practical tips and actionable information to build trust.

- Create content that is needed at the time.

### Active voice

Use the active voice whenever possible. The active voice is usually more direct and vigorous than the passive. When you
write a sentence in the active voice, it is also usually shorter than in the passive voice. Address the user when
creating text content. Use the noun, you. Use, we, when providing the user with recommendations. We want to take
ownership of our guidance, so avoid hiding using “it is recommended.”

| Good ✅                                                                                                  | Bad ❌                                                                                                      |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Use the kubectl cli to create a namespace titled “mgmt”.                                                 | The Kubectl CLI can be used to create namespaces titled “mgmt”                                              |
| Prior to upgrading, ensure you have carefully reviewed the release notes for deprecation notices.        | Release notes should be carefully verified for deprecation notices prior to an upgrade.                     |
| We recommended deploying Palette Enterprise in a highly-available configuration of at least three nodes. | It is recommended to deploy Palette Enterprise in a highly-available configuration of at least three nodes. |

### Passive voice

Passive voice is a good fit when the agent or user performs an obvious, unimportant, or unknown action. Passive voice
can also be used when you wish to postpone mentioning the agent until the last part of the sentence or avoid mentioning
the agent. The passive voice is effective in these situations because it highlights the action and what is acted upon
rather than the agent acting.

| Good ✅                                                                                              | Bad ❌                                                                                   |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| The dispatcher is notifying police that three prisoners have escaped.                                | Police are being notified that three prisoners have escaped.                             |
| Surgeons successfully performed a new experimental liver-transplant operation yesterday.             | A new experimental liver-transplant operation was performed successfully yesterday.      |
| In this tutorial, you learned how Palette allows operators to manage Kubernetes environments easily. | The tutorial explained how Palette can be used easily to manage Kubernetes environments. |

## Accessibility and Inclusion

SpectroCloud content is built for people. This section overviews the accessibility and inclusion guidelines that matter
when creating content.

### Diverse and Inclusive

Try to use diverse names, ages, and locations in examples. As a U.S.-based company, avoid only using Western locations
and names. The Google Style guide has a great list of
[common international names](https://developers.google.com/style/examples#names).

| Good ✅                                                                                                                                                        | Bad ❌                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| The NOC-UI displays three active clusters. The following example displays active two clusters available in eastern Asia and another cluster in central Europe. | The NOC-UI displays three active clusters. The following image displays three active clusters in North America’s west and eastern regions. |
| Lee and Raha are both experienced engineers that fit the decision-maker persona.                                                                               | John and Dave are both experienced engineers that fit the decision-maker persona.                                                          |

### Simplicity Assumption

Our technology and workflows are complicated. Yes, our product improves the experience and greatly reduces the
challenges encountered with Kubernetes. However, at the end of the day, these are complicated workflows. Avoid injecting
assumptions into the text. Readers find it frustrating to read the documentation that states an action or set of actions
is easy. Show compassion to the reader and make it “easy” by providing clear and concise guidance. Omit the subjective
terms.

| Good ✅                                                                               | Bad ❌                                      |
| ------------------------------------------------------------------------------------- | ------------------------------------------- |
| Deploy the container in a few steps.                                                  | Deploy the container in a few simple steps. |
| Palette reduces the overhead and common challenges encountered when using Kubernetes. | Palette makes Kubernetes easy to use.       |

### Gender

Use gender-neutral pronouns. Avoid the following nouns he, him, his, she, or her as gender-neutral pronouns. The same
applies to he/she or (s)he or other such punctuational approaches. Use the singular they.

| Good ✅                                                            | Bad ❌                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| In previous outages, one of the operators followed best practices. | In previous outages, one of the operators did not follow best practices. |

### Ableist language

Don't use ableist language. This avoids biases and harm when discussing disability and accessibility. Ableist language
includes words or phrases such as crazy, insane, blind to or blind eye to, cripple, dumb, and others. This also includes
action verbs with physical traits like jump and run. Choose alternative words depending on the context.

| Good ✅                               | Bad ❌                                 |
| ------------------------------------- | -------------------------------------- |
| Review all the active containers.     | See if all the containers are running. |
| Navigate to the tab titled, Settings. | Jump to the next tab.                  |
| Issue the command kubectl get pods.   | Run the command kubectl get pods.      |

## Content Format

Your content format defines how you translate the brand style and voice in your content. Create responsive content
assuming your content can be refigured based on the user's device. This section outlines the guidelines to help you
structure your content and follow a clean formatting style theme.

### Headings

The heading styles referenced are as follows:

Avoid using an acronym for the first time in a title or heading unless it is a keyword you need to place in the title or
heading for SEO. If the first use of the acronym is in a title or heading, introduce the acronym (in parentheses,
following the spelt-out term) in the following body text. Aim for descriptive headings and titles to help users navigate
the page. From a user perspective, Jumping between pages and sections of a page is easier if the headings and titles are
unique.

- If the heading is more in line with a task, start with the plain form of the task’s base form.

- If the heading is conceptual or non-task based, start with a noun. Avoid using a noun that starts with an -ing.

| Good ✅                             | Bad ❌                    |
| ----------------------------------- | ------------------------- |
| Deploy the Infrastructure.          | Deploying IaC.            |
| Migration to Palette.               | Migrating to Palette tab. |
| Introduction to Cluster Monitoring. | Cluster Monitoring.       |

### Headline Style

Use title case for headings. Below are some helpful tips.

- Capitalize the first and last words, nouns, pronouns, verbs, adjectives, adverbs, and subordinating conjunctions (if,
  because, as, that, and so on).

- Don't capitalize articles (a, an, the), coordinating conjunctions (and, but, or, nor), the "to" in an infinitive, and
  prepositions (with, to, for, in, from).

- For hyphenated words, capitalize the first and subsequent elements unless they are articles, prepositions, and
  coordinating conjunctions. The following are examples:

| Good ✅                            | Bad ❌                            |
| ---------------------------------- | --------------------------------- |
| Deploy a Pack Registry Server.     | Deploying A Pack Registry Server. |
| Access Audit Logs.                 | Accessing audit logs              |
| Quick Start with Palette App Mode. | Quick start with Palette app mode |

### Numbers

In the text, spell out single-digit numbers (zero through nine) and use numerals for 10 or greater. The exception is
when an action is unimportant, unknown, or hard to identify.

| Good ✅                                                                                             | Bad ❌                                                                                          |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| The Kubernetes control plane should have at least three nodes if configured to be highly available. | The Kubernetes control plane should have at least 3 nodes if configured to be highly-available. |
| First, drain the worker nodes.                                                                      | 1st drain the worker nodes.logs                                                                 |
| Two-fifths of the log report contains decipherable content.                                         | 3/5 of the log report contains decipherable content.mode                                        |

### Tables

Tables make complex information easier to understand by presenting it clearly.

All table headings should be in bold.

| Tables are useful for                             | Examples                                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| Data or values                                    | Text formats and their associated HTML codes.                                |
| Simple instructions                               | User interface actions and their associated keyboard shortcuts.              |
| Categories of things with examples                | SKUs and the products they include.                                          |
| Collections of things with two or more attributes | Event dates with times and locations.                                        |
| Differentiation                                   | A table can often display differantion easier than it would be to use words. |

### UI Components

For a list of available UI components refer to the documentation’s repository README. Avoid the following behaviors when
writing documentation content.

| Component                | Behavior                                                                                                                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tooltip                  | Avoid using tooltips inline with the text. The recommendation is to use an info box if it makes sense or explain the concept. Alternatively, if the definition is available in the glossary page then link to the definition. |
| Info box and warning box | Avoid overusing info boxes and warning boxes. They have the potential to distract the reader and generate a sense of information overload. Use them sparingly.                                                                |

### Resources list

List links to other documents and guides in a bullet list in the last section of your document. The title is a Level 1
heading. Include two lines between each item.

**# Resources**

- [VM Management Packs and Profiles](/vm-management/vm-packs-profiles)

- [Spectro VM Dashboard](/vm-management/vm-packs-profiles/vm-dashboard)

- [Create Spectro VM Dashboard Profile](/vm-management/vm-packs-profiles/create-vm-dashboard-profile)

- [Enable Spectro VM Dashboard](/vm-management/vm-packs-profiles/enable-vm-dashboard)

- [Create and Manage VMs](/vm-management/create-manage-vm)

- [Deploy VM from a Template](/vm-management/create-manage-vm/standard-vm-operations/deploy-vm-from-template)

- [Create a VM Template](/vm-management/create-manage-vm/create-vm-template)

- [Standard VM Operations](/vm-management/create-manage-vm/standard-vm-operations)

- [VM Roles and Permissions](/vm-management/vm-roles-permissions)

### Metadata

End the metaDescription with a period.

```
sidebar_label: "Migrate Cluster to Enterprise Mode"

title: "Migrate Cluster to Enterprise Mode"

description: "Migrate Cluster to Enterprise Mode."
```

### Directional Language

Avoid directing the user to previous parts of the document, if possible. Ideally, the user should be directed to content
following the text. By avoiding forcing the reader to scroll back, you improve the user experience.

| Good ✅                                                                        | Bad ❌                                                                       |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| The following diagram displays the application architecture for this tutorial. | As seen in the diagram above, the application architecture is hosted on AWS. |

### Infobox

Use the info box to help users save an extra step of finding related information. Include relevant details directly
alongside your content to add clarity. Remember, the goal is to conveniently present users with all necessary
information within the infobox, minimizing the need to navigate back and forth between different sections.

| Good ✅                                                                                                                                                                                                 | Bad ❌                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| This pack can be combined with the Kubernetes dashboard pack to expose the Kubernetes dashboard. Check out the Enable Kubernetes Dashboard guide to learn more about exposing the Kubernetes dashboard. | To learn more about exposing the Kubernetes dashboard, check out the Enable Kubernetes Dashboard guide. |

### Emoticon

Do not use emoticons in headlines or text. Emoticons are great for conveying emotions and making the text more
welcoming, but at the cost of reducing the sense of the formality of the text. Our technical documentation is a place
that all customers should trust. As a result, we want to convey as much professionalism as possible so that the text and
its content are highly trusted.

| Good ✅                                                                                                 | Bad ❌                                                                                                                   |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| In this tutorial, you will understand how to migrate Kubernetes clusters to Palette’s management plane. | In this tutorial you will gain a basic understanding of how to migrate Kubernetes clusters to Palette’s management plane |

### Future Features

Avoid documenting features, products, or behaviours that are currently unavailable.

| Good ✅                                 | Bad ❌                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| MagicProduct supports JSON input files. | MagicProduct supports JSON input files. In future releases, YAML file support will be added. |

## Language

This section guides you to your content using easy and simple-to-understand language.

### Nouns and Pronouns

To use nouns, see [Capitalization](#capitalization). Use pronouns to clearly refer to the noun it’s replacing (its
antecedent) to avoid ambiguity and confusion. Use gender-neutral pronouns to accommodate all users. See
[Gender](#gender), to learn how more about gender-neutral pronouns. Use personal pronouns to offer a friendly tone. To
learn more about using pronouns, see [Person](#person). Use relative pronouns: that, which, or who.

### Prepositions

Use the preposition to convey the notion of an enclosed space surrounded or closed off on all sides.

- Do something in a dialog box.

- Do something in a pane.

- Enter something in a window.

- Do something in command mode. In these examples, a dialog box, a pane, a window, and a command mode represent enclosed
  spaces within which users interact.

Use the preposition on to convey the notion of being on a surface of an entity.

- Do something on a page.

- Enter something on a worksheet.

### Present tense

Users read documentation to perform tasks or gather information. For users, these activities take place in their
present, so the present tense is proper in most cases. Additionally, the present tense is easier to read than the past
or future tense.

| Good ✅                                                                       | Bad ❌                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A common container orchestration platform used in the industry is Kubernetes. | A common container orchestration platform that will be used in the industry is kubernetes. |

Use future tense only when you emphasize that something will occur later (from the users' perspective). To quickly find
and remove instances of future tense, search for will.

| Good ✅                                                                         | Bad ❌                                                                     |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| The following steps will guide you on how to create a cluster profile for Edge. | The following steps guide you on how to create a cluster profile for Edge. |

### Person

Use second-person pronouns you, your to convey friendliness and human touch to the users. Addressing the user as you
keeps the focus on them. It implies a supportive tone. If the discussion is about product UI, use second person pronouns
as You can to help the user feel they have a choice to make.

| Good ✅                                                                                                                                   | Bad ❌                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| The following steps will guide you on how to create a cluster profile for Edge.                                                           | The following steps will guide us on how to create a cluster profile for Edge.                                                       |
| You can tailor your OS to your specific needs, ensuring your clusters perform optimally and meet your organization's unique requirements. | We can tailor our OS to our specific needs, ensuring our clusters perform optimally and meet our organization's unique requirements. |
| Alternatively, use the filter buttons to display available options.                                                                       | Alternatively, you can use the filter buttons to display available options.                                                          |

Be careful when using the following first-person pronouns: we, us, or our. If your content focuses on Spectro Cloud as
the speaker, you can address the user in the first-person plural.

| Good ✅                                                                                                                                                        | Bad ❌                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Our style guide believes in simple and crisp writing.                                                                                                          | The following steps will guide us on how to create a cluster profile for Edge.                                                                      |
| To avoid this issue, we recommend that you authenticate with the Docker registry before pulling images, especially if you are pulling from a private registry. | To avoid this issue, you should authenticate with the Docker registry before pulling images, especially if you are pulling from a private registry. |

### Acronyms

Use title case when defining an acronym. Use the same rules that apply to headline styles. Some acronyms are in nature
written in a camel case. Example: IaaS, kCh, SaaS.

Although some acronyms are widely understood and preferred to the spelt-out term, others are not well known or are
familiar only to a specific group of customers. Define the acronym first.

The exception is when an acronym will appear only once in your content. Spell out the term. Don't introduce it in
parentheses after the spelt-out version. If the spelt-out term and acronym are needed for metadata, then it is okay to
use both.

| Good ✅                                            | Bad ❌                                             |
| -------------------------------------------------- | -------------------------------------------------- |
| Boot the Virtual Machine (VM).                     | Boot the virtual machine (VM).                     |
| Boot all the Virtual Machines (VMs).               | Boot all the virtual machine (VMs).                |
| This is called Infrastructure as a Service (IaaS). | This is called infrastructure as a service (IaaS). |
| Dynamic-Link Library (DLL).                        | dynamic-link library (DLL).                        |

## Links

Use links to point to a single source of truth to explain why your information links to it. Generally, practice ensuring
that the links remain functional and universally accessible to the users.

### Cross-references

In general, cross-references are links that lead to extra information. Try to offer assistance within the current
context whenever feasible rather than redirect to external sources. For example, if the information is short and easily
explained, it's better to include it directly instead of using a link.

- Log in to **Palette** as a tenant admin.

- To learn how to install Palette using the Helm Chart, refer to **Helm Chart Mode**.

### External URLs

When readers are assumed to have some prior knowledge about third-party standards or software, provide an external link.
Ensure any external sites you link to are updated, reliable, and relevant within the context.

Link to the most relevant heading so users can have easier access. Test all the links and remove any locale-specific
information before publishing your document. Ensure that the links remain functional and universally accessible to
readers. Avoid unnecessary redirects to maintain a smooth reading experience.

Examples:

- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) which can be generated in the MAAS web
  console.

- Enable
  [HTTP Event Collector (HEC)](https://www.outcoldsolutions.com/docs/monitoring-kubernetes/v5/installation/#enable-http-event-collector-in-splunk)
  in Splunk.

- Refer to the
  [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects)
  documentation for additional guidance.

### Slash

We try to avoid using slashes. If required, use forward slashes ( / ) to to imply a combination or to indicate a file
path.

Use backslashes ( \ ) to list URLs. Omit `http://` unless the URL does not begin with `www` and any trailing slashes at
the end of the URL unless the URL requires it. Use `http://` in reference links as required.

Example: https://console.spectrocloud.com

## Punctuation and Grammar

Use punctuation and grammar style conventions to localize your content into consistent information. Generally, use
punctuation judiciously to preserve the content’s meaning, using it only when necessary. Tailor your grammar style to
reflect the mood and personality to build engaging content for the user.

### Capitalization

Capitalize the first word and all proper nouns, such as product names. To learn more about proper nouns, see
[Nouns and Pronouns](#nouns-and-pronouns).

| Good ✅                                                                       | Bad ❌                                                                        |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| A common container orchestration platform used in the industry is Kubernetes. | a common container orchestration platform used in the industry is kubernetes. |
| Navigate to the Palette console.                                              | Navigate to the Palette console.                                              |

Don’t capitalize common nouns unless required.

- Kubernetes is an open-source container orchestration platform.

- Kubectl allows you to connect to, configure and work with your clusters through the command line.

### Period, Exclamation Mark, and Question Mark

Use a period (.) at the end of every sentence. Do not use periods at the end of headings, headlines, UI titles, or UI
texts. Put one space after a period. If a sentence includes a title, do not use a period at the title end, but if the
title has a question mark ( ? ) or an exclamation mark ( ! ), you should include it. Avoid exclamation marks unless
required.

Examples:

- Review the Network Address Translation (NATS) parameters guide to learn more.

- What is Palette?

- Refer to the What is Palette? section.

### Colon and Semicolon

Use a colon when you want to introduce a list. For instance, listing your favourite fruits, you might write, "Make sure
you bring the items Rita requested to the party: soda, board games, and a side dish. When in doubt, default to a period
and start a new sentence.

Remember, the sentence before a colon should always be a complete thought.

| Good ✅                                                                    | Bad ❌                                                                        |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Common use cases for enabling authentication:                              | Common use cases for enabling authentication:                                 |
| - Prevent others from accessing other users' resources.                    | Prevent others from accessing other users resources.                          |
| - Prevent abuse or spam from those not part of the community.              | Prevent abuse or spam from those not part of the community.                   |
|                                                                            |                                                                               |
| This means that you may never need to manipulate ReplicaSet objects.       | This actually means that you may never need to manipulate ReplicaSet objects: |
| Use a Deployment instead, and define your application in the spec section. | use a Deployment instead, and define your application in the spec section.    |
| Issue the following command:                                               | Issue the following command:                                                  |
| kubectl get pods                                                           | kubectl get pods                                                              |

## UI Elements

When referring to specific product user interface components, use the following approved terms.

| Component      | Spectro Cloud Term | Example                                                                                                       |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Navbar         | Main Menu          | Navigate to the left Main Menu and click on Tenant Settings.                                                  |
| User Dropdown  | User Menu          | You can logout by navigating to the top right User Menu.                                                      |
| Nested Navbar  | <Feature> Menu     | Navigate to the Main Menu and click on Tenant Settings. Next, on the Tenant Settings Menu, click on API Keys. |
| Three Dots     | Three Dots         | Click on the three-dot Menu                                                                                   |
| Drop Down Menu | Drop Down Menu     | Click on the drop-down Menu                                                                                   |

For UI elements that contain a symbol or emoji, only include the text. If the button only has a symbol, then use the
symbol in the documentation.

Example: +Add Cluster Profile, write it as Add Cluster Profile.

Example: + button. Write it as + and refer to the UI element context. “Click on the Addon Layers row + button.

## Commands and Parameters

Always use the long form of a command, as it helps the reader better understand the command's actions.

| Good ✅                                      | Bad ❌                              |
| -------------------------------------------- | ----------------------------------- |
| kubectl get pods --namespace service_banking | kubectl get pods -n service_banking |

### Command Output

Show the command output to help the reader follow along and validate they are receiving the expected output.

```
$ kind create cluster
Creating cluster "kind" ...
✓ Ensuring node image (kindest/node:v1.25.3) 🖼
✓ Preparing nodes 📦
✓ Writing configuration 📜
✓ Starting control-plane 🕹️

✓ Installing CNI 🔌
✓ Installing StorageClass 💾
Set kubectl context to "kind-kind"
You can now use your cluster with:
kubectl cluster-info --context kind-kind
Have a nice day! 👋

```

You can break up the command and output using two code blocks. Breaking up the command from the output improves the
reader experience because now the reader can copy the command without including the output.

```
$ kubectl get pods --namespace nginx
NAME                  READY   STATUS    RESTARTS   AGE
nginx-deployment-5f76d98944-6gwpj   1/1     Running   0          10m
nginx-deployment-5f76d98944-gw8ns   1/1     Running   0          10m
nginx-deployment-5f76d98944-t5km5   1/1     Running   0          10m.

```

### Parameters

Document parameters to provide users with comprehensive and accessible information to effectively configure and utilize
the system or software. Ensure clarity, consistency, and ease of understanding in your parameter documentation.

- Provide a descriptive name and brief description.

- Specify the data type and default value (if applicable).

- Outline allowed values or rangesfor the parameter.

- Indicate if the parameter is required or optional.

- Explain any dependencies or interactions with other parameters.

- Offer usage examples for practical understanding.

- Use a table format for multiple parameters. Include columns for the parameter name, description, type, default values,
  and requirement status.

- Maintain formatting consistency and clarity throughout the documentation.

Using the correct path, specify the main object, sub-object, properties, and any standalone parameter.

Here is an example.

| Parameter Name   | Description                           | Data Type | Default Value | Allowed Values | Required/Optional | Dependencies/Interactions | Usage Example                            |
| ---------------- | ------------------------------------- | --------- | ------------- | -------------- | ----------------- | ------------------------- | ---------------------------------------- |
| internal         | Specifies the MongoDB deployment type | Boolean   | n/a           | n/a            | Required          | n/a                       | `internal: true`                         |
| databaseUrl      | URL for MongoDB                       | String    | n/a           | n/a            | Required          | n/a                       | `databaseUrl: mongodb://localhost:27017` |
| databasePassword | The password for MongoDB              | String    | ""            | n/a            | Optional          | Depends on `internal`     | `databasePassword: mysecretpassword`     |
| replicas         | Number of MongoDB replicas to start   | Integer   | 3             | 1 to 10        | Required          | n/a                       | `replicas: 5`                            |

The above table includes the following details for each parameter:

**Parameter Name**: Descriptive name for the parameter.

**Description**: Brief explanation of the parameter's purpose.

**Data Type**: The type of data expected for the parameter.

**Default Value**: The default value assigned to the parameter, if applicable.

**Allowed Values**: The valid options or ranges for the parameter.

**Required/Optional**: Indicates whether the parameter is required or optional.

**Dependencies/Interactions**: Any dependencies or interactions with other parameters.

**Usage Example**: Practical example showcasing how the parameter is used.
