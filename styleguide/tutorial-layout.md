# Tutorial Layout

To create an impactful tutorial guide, you must create a tutorial plan and obtain stakeholder approval for alignment. Adhere to the [Tutorial Plan](#tutorial-plan) section, and the [Tutorial Layout](#tutorial-layout) section to deliver accurate, user-friendly, and impactful tutorials consistently.

## [Tutorial Plan Template](https://github.com/rahulhazra97/Documentation-Guide/wiki/Tutorial-Plan-Template)

All tutorials require a tutorial plan document with stakeholder signoff before authoring. Writing the plan out prevents incorrect deliverables and reduces the chance of time spent inefficiently. The tutorial plan process will help you create a much higher-quality tutorial.

Find the tutorial plan template from the [Tutorial Plan Template](https://github.com/rahulhazra97/Documentation-Guide/wiki/Tutorial-Plan-Template) page.

Reach out to us at spectro-docs@spectrocloud.com, to propose a tutorial plan template.

# Table of Contents

[Tutorial Layout](#tutorial-layout)

[Markdown Layout](#markdown_layout)

[Section Breakdown](#section-breakdown)

## Tutorial Layout

All Spectro Cloud tutorials are expected to have the same look and feel. The tutorial text and voice must adhere to the Spectro Cloud [style guide](https://github.com/rahulhazra97/Documentation-Guide/wiki/Spectro-Cloud-Style-Guide) for a universal look and feel. The tutorial layout must also feel familiar to the reader, therefore, all tutorials must follow the layout standard described on this page.

## Markdown Layout

The following is a high-level overview of the markdown structure that all tutorials should contain. Make a note of the markdown heading sizes.

```
# Title
<Intro body>
# Prerequisites


# Clone GitHub Repository


# [Concept 1]


## [Sub-concept 1]


## [Sub-concept 2]


# [Concept 2]


## [Sub-concept 1]


## [Sub-concept 2]


# Cleanup


# Wrap-Up
```

## Section Breakdown

| Section                 | Description                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title                   | The name assigned to the tutorial. Aim for a title that is no longer than five words.                                                                                                                                                                                                                                                             |
| Intro Body              | The introduction sets the context for the tutorial and explains the challenge. The introduction must also provide the user with an explanation of what they will learn in this tutorial.                                                                                                                                                          |
| Prerequisites           | List the required software or hardware the practitioner must have installed and available to complete the tutorial.                                                                                                                                                                                                                               |
| Clone GitHub Repository | Most tutorials are expected to have a public GitHub repository containing a versioned copy of the tutorial code, if applicable. In this section, the user should be walked through the following commands:                                                                                                                                        |
| [Concept]               | The title of one of the main concepts of the tutorial. This could be one of several main concepts. Example - “Configure the Environment”                                                                                                                                                                                                          |
| [Sub-Concept]           | The title of a child concept stems from the parent concept. Example - “Create Secondary Cluster” OR “App Model Overview”                                                                                                                                                                                                                          |
| Cleanup                 | All tutorials should ideally be deployed through infrastructure as code (IaC) if applicable. All resources deployed by the tutorial should be removed. It is our responsibility to help and provide guidance to the user on how to remove all resources. Sometimes this section is brief with a simple command `terraform destroy -auto-approve`. |
| Wrap-Up                 | This section summarizes the key learning concepts and the actions the practitioner conducted. Additionally, this section should link to or suggest the next set of topics that the practitioner can dive into.                                                                                                                                    |

For any further information contact : `spectro-docs@spectrocloud.com
