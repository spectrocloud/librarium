
# Spectro Cloud Style Guide 

The Spectro Cloud style guide provides standards and guidelines for developing Spectro Cloud-related documentation. The style guide will act as a tool to ensure that the content produced across Spectro Cloud reflects our sense of style and voice.


This document is by the Spectro Cloud Documentation Team of writers chartered to set and maintain readability, usage, correctness, and consistency for all Spectro Cloud documentation content. 

# Table of Contents

 [About this guide](#about-this-guide)

 - [SpectroCloud Style and Voice](#spectrocloud-style-and-voice)
 - [Simplified English](#simplified-english)
 - [SpectroCloud Voice](#spectrocloud-voice)

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

[Content Layout](#content-layout)

[Language](#language)

- [Nouns and Pronouns](#nouns-and-pronouns)
- [Capitalization](#capitalization)
- [Prepositions](#prepositions)
- [Present tense](#present-tense)
- [Person](#person)

[Links](#links)

- [Cross-references](#cross-references)
- [External URLs](#external-urls)
- [Image URLs](#image-urls)

[Punctuation and Grammar](#punctuation-and-grammar)

- [Voice](#voice)
- [Active voice](#active-voice)
- [Passive voice](#passive-voice)
- [Period, Exclamation Mark, and Question Mark](#period-exclamation-mark-and-question-mark)
- [Colon and Semicolon](#colon-and-semicolon)
- [Slash](#slash)
- [Parentheses and Brackets](#parentheses-and-brackets)
- [Apostrophe](#apostrophe)
- [Hyphen (-) ](#hyphen)

[UI Elements (naming)](#ui-elements-naming)

- [Commands and Parameters](#commands-and-parameters)
- [Command Output](#command-output)
- [Parameters](#parameters)







## About this guide

The Spectro Cloud style guide is designed to guide you when creating written content for Palette users.  We want to ensure all our written communication feels and reads as one voice. To create the reading experience as a single voice, all written content must follow the following guidelines.

### SpectroCloud Style and Voice

Our voices reflect what we say and how we say it. We believe in clear, concise, and easy-to-understand communication in our documentation.

### Simplified English

Always use simple English in written material unless this guide explicitly states otherwise.


More importantly, simple language helps the reader retain information and more readily understand concepts. Feel free to review the [simplified English](https://www.simplifiedenglish.net/simplified-english/) resource to understand better how simplified language improves technical documentation.

|   Good  ✅                                                          | Bad ❌                                                                   |
|--------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| The core Kubernetes API is flexible and can also be extended to support custom resources. | The interior Kubernetes API is malleable and provides the capability for consumers to extended custom logic and inject custom logical resources. |
| Choose a node to be the cluster master node.                              | Designate a node to be the cluster master node.                                   |
| Drain the node before a version upgrade.                                  | It is essential to drain the node prior to a version upgrade.                     |


## Accessibility and Inclusion

This section overviews the accessibility and inclusion guidelines.

### Diverse and Inclusive 

Try to use diverse names, ages, and locations in examples. As a U.S.-based company, avoid only using Western locations and names. The Google Style guide has a great list of [common international names](https://developers.google.com/style/examples#names).

| Good  ✅                                                               | Bad ❌                                                               |
|------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| The NOC-UI displays three active clusters. The following example displays active two clusters available in eastern Asia and another cluster in central Europe. | The NOC-UI displays three active clusters. The following image displays three active clusters in North America’s west and eastern regions. |
| Lee and Raha are both experienced engineers that fit the decision-maker persona.  | John and Dave are both experienced engineers that fit the decision-maker persona. |

### Simplicity Assumption


Avoid injecting assumptions into the text. Readers find it frustrating to read the documentation that states an action or set of actions is easy. Show compassion to the reader and make it “easy” by providing clear and concise guidance. Omit the subjective terms.

| Good  ✅                                                               | Bad ❌                                                               |
|------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| Deploy the container in a few steps. | Deploy the container in a few simple steps. |
| Palette reduces the overhead and common challenges encountered when using Kubernetes.  | Palette makes Kubernetes easy to use. |

### Gender

Use gender-neutral pronouns. Avoid the following nouns he, him, his, she, or her as gender-neutral pronouns. The same applies to he/she or (s)he or other such punctuational approaches. Use the singular they.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| In previous outages, one of the operators followed best practices.       | In previous outages, one of the operators did not follow best practices.     |

### Ableist language

Don't use ableist language. This avoids biases and harm when discussing disability and accessibility. Ableist language includes words or phrases such as crazy, insane, blind to or blind eye to, cripple, dumb, and others. This also includes action verbs with physical traits like jump and run. Choose alternative words depending on the context.

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| Review all the active containers.                                 | See if all the containers are running.                           |
| Navigate to the tab titled, Settings.                             | Jump to the next tab.                                            |
| Issue the command kubectl get pods.                               | Run the command kubectl get pods.                                |


## Content Format

This section outlines the guidelines for how to structure content and how to format the content properly. 

### Headings


The heading styles referenced are as follows:

Avoid using an acronym for the first time in a title or heading unless it is a keyword you need to place in the title or heading for SEO. If the first use of the acronym is in a title or heading, introduce the acronym (in parentheses, following the spelled-out term) in the following body text. Aim for descriptive headings and titles to help users navigate the page. From a user perspective, navigating between pages and sections of a page is simpler if the headings and titles are unique.

- If the heading is more in line with a task, start with the plain form of the task’s base form.


- If the heading is conceptual or non-task based, start with a noun. Avoid using a noun that starts with an -ing.

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| Deploy the Infrastructure.                                 | Deploying IaC.                           |
| Migration to Palette.                             | Migrating to Palette tab.                                            |
| Introduction to Cluster Monitoring.                               | Cluster Monitoring.                                |

### Headline Style

Use title case for headings. Below are some helpful tips.


 - Capitalize the first and last words, nouns, pronouns, verbs, adjectives, adverbs, and subordinating conjunctions (if, because, as, that, and so on).


 - Don't capitalize articles (a, an, the), coordinating conjunctions (and, but, or, nor), the "to" in an infinitive, and prepositions (with, to, for, in, from).


- For hyphenated words, capitalize the first and subsequent elements unless they are articles, prepositions, and coordinating conjunctions. The following are examples:

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| Deploy a Pack Registry Server.                                 | Deploying A Pack Registry Server.                           |
| Access Audit Logs.                             | Accessing audit logs                                           |
| Quick Start with Palette App Mode.                              | Quick start with Palette app mode                               |

### Numbers

In the text, spell out single-digit numbers (zero through nine) and use numerals for 10 or greater.

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| The Kubernetes control plane should have at least three nodes if configured to be highly available.                                | The Kubernetes control plane should have at least 3 nodes if configured to be highly-available.                          |
| First, drain the worker nodes.                            | 1st drain the worker nodes.logs                                           |
| Two-fifths of the log report contains decipherable content.                             | 3/5 of the log report contains decipherable content.mode                               |


### Tables

Tables make complex information easier to understand by presenting it more clearly and in a structured manner.

All table headings should be in bold.

| Tables are useful for | Examples                                                        |
|---------------------------------|-----------------------------------------------------------------|
| Data or values                  | Text formats and their associated HTML codes.                             |
| Simple instructions| User interface actions and their associated keyboard shortcuts.          |
| Categories of things with examples             | SKUs and the products they include.                             |
| Collections of things with two or more attributes| Event dates with times and locations.|
|  Differentiation                               | A table can often display differantion easier than it would be to use words. |

### Documentation UI Components


For a list of available Markdown UI components, refer to the [Librarium README](https://github.com/spectrocloud/librarium#readme).
Avoid the following behaviors when writing documentation content.

| Component                 | Behavior                                                                                                                         |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Tooltip                   | Avoid using tooltips inline with the text. The recommendation is to use an info box if it makes sense or explain the concept. Alternatively, if the definition is available in the glossary page then link to the definition. |
| InfoBox/WarningBox  | Avoid overusing info boxes and warning boxes. They have the potential to distract the reader and generate a sense of information overload. Use them sparingly. |

### Resources list


List links to other documents and guides in a bullet list in the last section of your document. The title is a Level one heading or `#` in markdown. Include two lines between each item.

Example.

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


All documentation pages have a frontmatter section. The frontmatter controls the behavior of the page, but it's also used to initialize Search Engine Optimization (SEO) properties such as the title, description, and more. 

> Keep each description shorter than 180 characters. 



The following front matter attributes are available.

| attribute       | type    | description                                                                                                 |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| title           | string  | used as the label for navigation                                                                            |
| metaTitle       | string  | will appear on the browser window / tab as the title                                                        |
| metaDescription | string  | the text to display when a page is shared in social media platforms                                         |
| icon            | string  | one of icons from https://fontawesome.com/icons?d=gallery                                                   |
| hideToC         | boolean | setting this to `false` will hide the page from the navigation                                              |
| fullWidth       | boolean | setting this to `false` this can se set to use the full width of the page and there is no table of contents |

```
title: "Migrate Cluster to Enterprise Mode"

metaTitle: "Migrate Cluster to Enterprise Mode"

metaDescription: "Migrate Cluster to Enterprise Mode."
```

### Directional Language 


Avoid directing the user to a previous part of the document. Ideally, the user should be directed to content following the text. By avoiding backtracking, or forcing the reader to scroll back, you improve the user experience.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| The following diagram displays the application architecture for this tutorial.       | As seen in the diagram above, the application architecture is hosted on AWS.    |

### Infobox 

Use the info box to help users save an extra step of finding related information. Include relevant details directly alongside your content to add clarity. Remember, the goal is to conveniently present users with all necessary information within the infobox, minimizing the need to navigate back and forth between different sections. Useful content that is good to know is a great candidate for an infobox. 

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| This pack can be combined with the Kubernetes dashboard pack to expose the Kubernetes dashboard. Check out the Enable Kubernetes Dashboard guide to learn more about exposing the Kubernetes dashboard.      | To learn more about exposing the Kubernetes dashboard, check out the Enable Kubernetes Dashboard guide.  |

### Emoticon 


Do not use emoticons in headlines or text. Emoticons are great for conveying emotions and making the text more welcoming, but at the cost of reducing the sense of the formality of the text. Our technical documentation is a place that all customers should trust. As a result, we want to convey as much professionalism as possible so that the text and its content are highly trusted.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| In this tutorial, you will understand how to migrate Kubernetes clusters to Palette’s management plane.     | 👋🏻  In this tutorial, you will gain a basic understanding of how to migrate Kubernetes clusters to Palette’s management plane  |

### Future Features 


Avoid documenting features, products, or behaviors that are currently unavailable.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| MagicProduct supports JSON input files.    | MagicProduct supports JSON input files. In future releases, YAML file support will be added. |

## Content Layout

To create great content, begin with a plan to present the data cohesively. The more we reflexively add information to the documentation, the more the documentation helps users to accomplish their tasks. Ask the Technical Writing team if you have questions when planning, authoring, documentation, or editing. We’re available on Slack in #docs.  

Build content strategy early. Collaborate with the relevant stakeholders like the PM, design, and marketing partners to develop an outline and preliminary drafts. Identify the content layouts your design needs and solve roadblocks during content strategy planning. 

Research proven layout choices to make your layout decision before developing your content. Try to check which content item fits your design the best. Create opportunities for reader interaction within your content. Adapt content layout elements based on the type of content. 

We welcome all contributions towards docs and education. The following content layout formats will guide you when contributing to the Spectro Cloud documentation: 

1. [Packs Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Packs-Layout)

Before you begin creating your own Packs page, we highly recommend reviewing the [Packs Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Packs-Layout) page. Documenting Packs can be challenging due to their complex nature, involving multiple components and dependencies. However, this documentation is immensely valuable to users. It provides practical guidance, pre-configured solutions, and supported versions, saving time and streamlining deployments. Well-documented Packs enable users to simplify their workflows and maximize efficiency to deploy and manage infrastructure, applications, or services easily.

The [Packs Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Packs-Layout) page guides you in maintaining a consistent and user-friendly experience. Align your packs page seamlessly with the rest of the Spectro Cloud documentation to provide users with a familiar and intuitive experience.


2. [How to Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/How-to-Layout) 

How-to documentation helps the user perform a particular task correctly. A correctly executed how-to guide,

- Addresses knowledge-sharing issues, 

- Eliminates delays caused by knowledge gaps, 

- Prevents chances of human errors, like failure to follow proper instructions, and

- Reduces time spent searching for task assistance.

The [How-to Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/How-to-Layout) page guides you to build how-to documentation that impacts. A how-to guide suggests a simple actionable strategy to build standardized internal processes to operate seamlessly and meet your project goals. How-tos create impact by making them easily discovered, producing applicable results, and allowing accessible user communication.

As your organization grows and evolves, so do your how-tos. How-tos should be discoverable, i.e., create a centralized knowledge system that answers all questions. Set direct communication channels for users to provide comments and feedback to foster better user collaboration. 

3. [Troubleshooting Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Troubleshooting-Layout)

Troubleshooting is followed to tackle common work-related interruptions during uncertain problems. Problems can persist and hinder productivity, so users should have a comprehensive solution guide to refer to. 

A troubleshooting guide is a well-organized collection of guidelines that offer strategies to identify, diagnose, and resolve a wide range of commonly occurring and unpredictable problems. It is a valuable reference tool to help individuals troubleshoot technical, operational, or functional difficulties effectively. Generally, the guide includes helpful tips, flowcharts or decision trees, and specific actions or solutions for each potential problem. Its purpose is to empower users to independently resolve issues, minimize downtime, and ensure seamless operations.

Create sustainable troubleshooting documentation to solve problems. It eliminates reliance on memory, instils confidence, and builds trust with users. Structured documentation helps resolve problems effortlessly, even without prior knowledge. 

Analyze device performance to diagnose problems effectively. Keep the process simple by opting for easy steps and basic shortcuts. Practice troubleshooting to enhance skills and make the guide more engaging. Utilize automation for quick and effortless guide creation. Learn how to create one for seamless operations on the[ Troubleshooting Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Troubleshooting-Layout) page.

4. [Tutorial Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Tutorial-Layout) 

A tutorial guide is a crucial tool for creating practical tutorials. It acts as a roadmap, preventing errors and optimizing the user's learning experience. It provides clear, concise instructions or demonstrations to help users learn new skills or complete specific tasks. 

By following a standardized tutorial template, you can ensure consistency, efficiency, and a professional image in your tutorial documents. Creating a tutorial plan and obtaining stakeholder approval is essential for alignment. Adhering to the tutorial plan process empowers you to deliver accurate, user-friendly, and impactful tutorials consistently. Learn how to create one for seamless operations on the [Tutorial Layout](https://github.com/rahulhazra97/Documentation-Guide/wiki/Tutorial-Layout) page.


## Language 

Use the following language guidelines when writing content. 

### Nouns and Pronouns

To use nouns, see [Capitalization](#capitalization). Use pronouns to clearly refer to the noun it’s replacing (its antecedent) to avoid ambiguity and confusion. Use gender-neutral pronouns to accommodate all users. See [Gender](#gender), to learn how more about gender-neutral pronouns. Use personal pronouns to offer a friendly tone. To learn more about using pronouns, see [Person](#person). Use relative pronouns: that, which, or who. 

### Capitalization

Capitalize the first word and all proper nouns, such as product names. To learn more about proper nouns, see [Nouns and Pronouns](#nouns-and-pronouns). 

| Good  ✅                                                                          |  Bad ❌                                                                         |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| A common container orchestration platform used in the industry is Kubernetes. | a common container orchestration platform used in the industry is kubernetes. |
| Navigate to the Pallete console.                                              | Navigate to the pallete console.                                             |

Don’t capitalize common nouns unless required.

- Kubernetes is an open-source container orchestration platform.


- Kubectl allows you to connect to, configure and work with your clusters through the command line.

### Prepositions

Use the preposition to convey the notion of an enclosed space surrounded or closed off on all sides.

- Do something in a dialog box.

- Do something in a pane.

- Enter something in a window.

- Do something in command mode.
In these examples, a dialog box, a pane, a window, and a command mode represent enclosed spaces within which users interact.

Use the preposition on to convey the notion of being on a surface of an entity.

- Do something on a page.

- Enter something on a worksheet.

### Present Tense

Users read documentation to perform tasks or gather information. For users, these activities occur in their present, so the present tense is proper in most cases. The present tense is also less difficult to read than the past or future tense.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| A common container orchestration platform used in the industry is Kubernetes.       | A common container orchestration platform that will be used in the industry is kubernetes.     |

Use future tense only when you emphasize that something will occur later (from the users' perspective). To quickly find and remove instances of future tense, search for will.

| Good  ✅                                                         |  Bad ❌                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| The following steps will guide you on how to create a cluster profile for Edge.       | The following steps guide you on how to create a cluster profile for Edge.     |

### Person

Use second-person pronouns you, your, to convey friendliness and human touch to the users. Addressing the user helps you keep the focus on them.

 Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| The following steps will guide you on how to create a cluster profile for Edge.                                 | The following steps will guide us on how to create a cluster profile for Edge.                          |
| You can tailor your OS to your specific needs, ensuring your clusters perform optimally and meet your organization's unique requirements.                            | We can tailor our OS to our specific needs, ensuring our clusters perform optimally and meet our organization's unique requirements.                                           |
| Alternatively, use the filter buttons to display available options.                               | Alternatively, you can use the filter buttons to display available options.                                |

Be careful when using the following first-person pronouns: we, us, or our.  If your content focuses on Spectro Cloud as the speaker, you can address the user in the first-person plural. Only use "we" when providing a recommendation from Spectro Cloud.

| Good  ✅                                                                          |  Bad ❌                                                                         |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Our style guide believes in simple and crisp writing. | The following steps will guide us on how to create a cluster profile for Edge. |
| To avoid this issue, we recommend that you authenticate with the Docker registry before pulling images, especially if you are pulling from a private registry.                                              | To avoid this issue, we should  authenticate with the Docker registry before pulling images, especially if pulling from a private registry.

### Acronyms

Use title case when defining an acronym. Use the same rules that apply to headline styles. Some acronyms are in nature written in a camel case. Example: IaaS, kCh, SaaS.

Although some acronyms are widely understood and preferred to the spelled-out term, others are not well known or are familiar only to a specific group of users. Define the acronym first.

The exception is when an acronym will appear only once in your content. Spell out the term, and don't introduce it in parentheses after the spelled-out version. If the spelled-out term and acronym are needed for metadata, then it is acceptable to use both.

| Good ✅               | Bad ❌                 |
|--------------------|----------------------|
| Boot the Virtual Machine (VM).   | Boot the virtual machine (VM).     |
| Boot all the Virtual Machines (VMs).   | Boot all the virtual machine (VMs).    |
| This is called Infrastructure as a Service (IaaS).   | This is called infrastructure as a service (IaaS).     |
| Dynamic-Link Library (DLL).   | dynamic-link library (DLL).     |

## Links

Use links to guide the user to additional information to learn more about a topic.

### Cross-references
In general, cross-references are links that lead to extra information. Try to offer assistance within the current context whenever feasible rather than redirect to external sources. 

- Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

- To learn how to install Palette using the Helm Chart, refer to [Helm Chart Mode](https://docs.spectrocloud.com/enterprise-version/helm-chart-install-reference).


### External URLs

When readers are assumed to have some prior knowledge about third-party standards or software, provide an external link. Ensure any external sites you link to are updated, reliable, and relevant within the context.

Link to the most relevant heading so users can have easier access. Test all the links and remove any locale-specific information before publishing your document. Ensure that the links remain functional and universally accessible to readers. Avoid unnecessary redirects to maintain a smooth reading experience. 

Examples: 

- For more information on **Add-on** types go to step four.

- Enable **HTTP Event Collector (HEC)** in Splunk.

- Refer to the **Prometheus Operational aspects** documentation for additional guidance. 

### Image URLs 

Start the URL with a forward slash ("/") and specify the path relative to the site's root directory. It can help to maintain a standardized format and stability of image references within your web content.  
Use the following practice to link URLs for images in Markdown. Replace the URL in the parentheses after the image's alt text. 

```

![App Mode and Cluster Mode.](/shared/palette/mode.png)

```

## Punctuation and Grammar


Use punctuation and grammar style conventions to localize your content into consistent information. Generally, use punctuation judiciously to preserve the content’s meaning, using it only when necessary.  Tailor your grammar style to reflect the mood and personality to build engaging content for the user. 

### Voice

Write in a simple voice. We explain our process and actions with simple messages and to the point.

### Active voice

Use the active voice whenever possible. The active voice is usually more direct and vigorous than the passive. When you write a sentence in the active voice, it is also usually shorter than in the passive voice.
Address the user when creating text content. Use the noun, you. Use, we, when providing the user with recommendations. We want to take ownership of our guidance, so avoid hiding using “it is recommended.”

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| Use the kubectl cli to create a namespace titled “mgmt”.                                | The Kubectl CLI can be used to create namespaces titled “mgmt”                         |
| Prior to upgrading, ensure you have carefully reviewed the release notes for deprecation notices.                          | Release notes should be carefully verified for deprecation notices prior to an upgrade.                                         |
|We recommended deploying Palette Enterprise in a highly-available configuration of at least three nodes.                           | It is recommended to deploy Palette Enterprise in a highly-available configuration of at least three nodes.                          |

### Passive voice


Passive voice is a good fit when the agent or user performs an obvious, unimportant, or unknown action. Passive voice can also be used when you wish to postpone mentioning the agent until the last part of the sentence or avoid mentioning the agent. The passive voice is effective in these situations because it highlights the action and what is acted upon rather than the agent acting.

| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| The dispatcher is notifying police that three prisoners have escaped.                               | Police are being notified that three prisoners have escaped.                        |
| Surgeons successfully performed a new experimental liver-transplant operation yesterday.                         | A new experimental liver-transplant operation was performed successfully yesterday.                                         |
|In this tutorial, you learned how Palette allows operators to manage Kubernetes environments easily.                           | The tutorial explained how Pallete can be used easily to manage Kubernetes environments.                        |

### Period, Exclamation Mark, and Question Mark


Use a period (.) at the end of every sentence. Do not use periods at the end of headings, headlines, UI titles, or UI texts. Put one space after a period. If a sentence includes a title, do not use a period at the title end, but if the title has a question mark ( ? ) or an exclamation mark ( ! ), you should include it. Avoid exclamation marks unless required. 

Examples: 

- Review the Network Address Translation (NATS) parameters guide to learn more.

- What is Palette? 

- Refer to the What is Palette? section. 

### Colon and Semicolon

Use a colon when you want to introduce a list.  For instance, listing your favourite fruits, you might write, "Make sure you bring the items Rita requested to the party: soda, board games, and a side dish. When in doubt, default to a period and start a new sentence.

Remember, the sentence before a colon should always be a complete thought.

| Good  ✅                                                              | Bad ❌                                                                           |
|-------------------------------------------------------------------|------------------------------------------------------------------------------|
| Common use cases for enabling authentication:                      | Common use cases for enabling authentication:                                |
| - Prevent others from accessing other users' resources.            | Prevent others from accessing other users resources.                         |
| - Prevent abuse or spam from those not part of the community.      | Prevent abuse or spam from those not part of the community.                   |
|                                                                     |                                                                              |
| This means that you may never need to manipulate ReplicaSet objects.| This actually means that you may never need to manipulate ReplicaSet objects: |
| Use a Deployment instead, and define your application in the spec section. | use a Deployment instead, and define your application in the spec section.   |    
| Issue the following command:                                        | Issue the following command:                                                 |
| kubectl get pods                                                   | kubectl get pods                                                            |

### Slash


Use forward slashes ( / ) in the following context:

| Context                           | Good  ✅                                                                                                                            | Bad ❌                                                                                                                                 |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Used to imply a combination       | Public Clouds: AWS, Azure, and Google Cloud (both IaaS and managed Kubernetes services EKS/AKS/GKE).                          | Public Clouds: AWS, Azure, and Google Cloud (both IaaS/managed Kubernetes services like EKS, either AKS, or, GKE)                 |
|                                   | The client/server.                                                                                                             | The client or the server.                                                                                                           |
| To indicate file path             | N/A                                                                                                                            | Not applicable.                                                                                                                     |
|                                   | Workspace location for staging runtime configurations and logs (default $HOME/.palette).                                       | Workspace location for staging runtime configurations and logs (default $HOME.palette).                                               |

Use backslashes ( \ ) to list servers and folders. To list URLs. Omit `http://` unless the URL does not benign with `www` and any trailing slashes at the end of the URL unless the URL requires it. Use  `http://` in reference links as required.

Example:
https://console.spectrocloud.com 

### Parentheses and Brackets

Opt for brackets to structure complex phrases instead of relying on dashes or commas. Maintain consistency in the font style, and use parentheses and brackets that match your main text. Whenever you're inclined to use parentheses, consider whether their need and potential impact on the reader's interest as they may detract from user engagement. 
Use round brackets ( ) around non-defining phrases to add extra information, explain, clarify, or translate.


| Good  ✅                                                              | Bad ❌                                                             |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| The reverse proxy Spectro Cloud manages is the forward reverse proxy (FRP).                              | The reverse proxy managed by Spectro Cloud is also known as FRP-  forward reverse proxy.                        |
| Use an API client (e.gTerraform provider) to configure.                         |Use an API client, like Terraform provider, to configure.                                         |
|Palette supports the FIPS-compliant Kubernetes (PXK and PXK-E) for enhanced security.                          | Palette supports the FIPS-compliant versions of Kubernetes for enhanced security.

Use square brackets [ ] to enclose subsequent references, comments, updates, and translations or to denote placeholders or variable values.


Examples: 
- K8s version has been upgraded from 1.21 to 1.22.12 [the latest version in 1.22.]

- Quoted by Luksa [2017, Simon and Schuster.]

Use angle bracket ( > ) to indicate technical prompts, tabs, instructions, placeholders, keywords, and separate sequential steps. 

Examples: 

- Select App registrations > API permissions. 
- C:>
- Refer to the <placeholder> icon to navigate next.
- ```<input type=text>```


### Apostrophe


Apostrophe (‘s) indicates possession. If a name already ends in s or z, and pronouncing it is difficult if you add an apostrophe, then consider rearranging the sentence to avoid the difficulty. Use it in the following context:

| Context                                              | Good  ✅                                         | Bad ❌                                         |
|------------------------------------------------------|---------------------------------------------|---------------------------------------------|
| To form a possessive case for singular and plural nouns | Admins should update the assigned users’ passwords. | Admins should update the assigned user’s passwords. |
| To denote period with noun phrases, but not adjectival phrases | The Kubernetes deployment was successful. | The Kubernetes’s deployment was successful. |
| To indicate contractions with omitted letters | It takes a week to update. | It takes a week’s time to update. |
| Do not use an apostrophe to clarify something if it pronounces odd. Instead, consider italicizing it. | It doesn’t support the OS pack. | It don’t support the OS pack. |
|                                                     | Subtract all the x from y. | Subtract all the x’s from the y’s. |

### Hyphen (-)

Use a hyphen ( - ) in the following context:

| Context                                                            | Good  ✅                                                     | Bad ❌                                                           |
|--------------------------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------------------|
| Before a noun in an adjectival phrase                                | It supports on-prem storage.                             | It supports storage that is on premise.                       |
| Use a hyphen in an adjectival phrase before the noun with an adverb ending with -ly | The pack list is publicly available on GitHub.        | The pack list is publicly-available on GitHub.                 |
| Use a hyphen with prefixes only if required to avoid confusion/mispronunciations | jq - A command-line JSON processor.                      | jq is the command-line JSON processor.                         |
| To indicate a range of numbers                                       | From 2021-2023.                                          | From 2021 to 2023.                                            |
| To translate text                                                   | As a result, the entire stack - not just the infrastructure - of Kubernetes is deployed. | As a result, the entire stack, and not just the infrastructure, Kubernetes is deployed. |



## UI Elements


When referring to specific product user interface components, use the following approved terms.

| Component       | Spectro Cloud Term | Example                                                                |
|-----------------|--------------------|------------------------------------------------------------------------|
| Navbar          | Main Menu          | Navigate to the left Main Menu and click on Tenant Settings.            |
| User Dropdown   | User Menu          | You can logout by navigating to the top right User Menu.                |
| Nested Navbar   | <Feature> Menu     | Navigate to the Main Menu and click on Tenant Settings. Next, on the Tenant Settings Menu, click on API Keys. |
| Three Dots      | Three Dots         | Click on the three-dot Menu                                            |
| Drop Down Menu  | Drop Down Menu     | Click on the drop-down Menu                                            |


For UI elements that contain a symbol or emoji, only include the text.  If the button only has a symbol, then use the symbol in the documentation.

Example:  +Add Cluster Profile, write it as Add Cluster Profile.

Example: + button. Write it as + and refer to the UI element context. “Click on the Addon Layers row + button.


## Commands and Parameters 

Always use the long form of a command, as it helps the reader better understand the command's actions.

| Good  ✅                                           | Bad ❌                                         |
|-------------------------------------------------|---------------------------------------------|
| kubectl get pods --namespace service_banking    | kubectl get pods -n service_banking         |

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

You can break up the command and output using two code blocks. Breaking up the command from the output improves the reader experience because now the reader can copy the command without including the output.

```
$ kubectl get pods --namespace nginx
NAME                  READY   STATUS    RESTARTS   AGE
nginx-deployment-5f76d98944-6gwpj   1/1     Running   0          10m
nginx-deployment-5f76d98944-gw8ns   1/1     Running   0          10m
nginx-deployment-5f76d98944-t5km5   1/1     Running   0          10m.

```

### Parameters


Document parameters to provide users with comprehensive and accessible information to effectively configure and utilize the system or software. Ensure clarity, consistency, and ease of understanding in your parameter documentation.

- Provide a descriptive name and brief description. 

- Specify the data type and default value (if applicable). 

- Outline allowed values or rangesfor the parameter. 

- Indicate if the parameter is required or optional. 

- Explain any dependencies or interactions with other parameters. 

- Offer usage examples for practical understanding. 

- Use a table format for multiple parameters. Include columns for the parameter name, description, type, default values, and requirement status.

- Maintain formatting consistency and clarity throughout the documentation.

Using the correct path, specify the main object, sub-object, properties, and any standalone parameter.

| Context                                | Example                    |
|----------------------------------------|----------------------------|
| Specify the main object                | `pack:content:`            |
| Specify the sub-object within the main object   | `pack.content.images:`     |
| Specify a property within the main object   | `pack.content.images.image:`  |
| Specify a standalone parameter         | `system.uri`               |