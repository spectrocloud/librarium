# Tutorial Layout

To create an impactful tutorial guide, you must create a tutorial plan and obtain stakeholder approval for alignment. Adhere to the [Tutorial Plan](#tutorial-plan) section, and the [Tutorial Layout](#tutorial-layout) section to deliver accurate, user-friendly, and impactful tutorials consistently. 

# Table of Contents

 [Tutorial Plan](#tutorial-plan)

 [Tutorial Layout](#tutorial-layout)

 [Markdown Layout](#markdown_layout)

 [Section Breakdown](#section-breakdown)


## Tutorial Plan

All tutorials require a tutorial plan document with stakeholder signoff before authoring. Writing the plan out prevents incorrect deliverables and reduces the chance of time spent inefficiently. The tutorial plan process will help you create a much higher-quality tutorial.
 
* To get started, make a copy of the tutorial plan from the [Reference Template](https://github.com/rahulhazra97/Documentation-Guide/wiki/Reference-Template) page.
* Connect your Google account.  
* Click on **File >> Make a copy**. 
> :information_source: We use Google Docs to collaborate asynchronously. Using a Google document lets us review and quickly provide feedback through comments and suggestions. <br />

 ![image](https://github.com/rahulhazra97/Documentation-Guide/assets/126905240/72e6eca4-992a-45ea-9c80-ab5f3708deaf)

* Next, copy the template to a Google Drive location of your choosing. <br /> <br />
![image](https://github.com/rahulhazra97/Documentation-Guide/assets/126905240/1d2ce48e-ca26-47e5-be2c-4e4774531783)

When you are ready for a review, tag the education team or notify the team by dropping a message in the Slack `education` channel.

### Tutorial Plan Reference
To get started with your tutorial plan, create a copy of the following template: 


## Tutorial Layout 

All Spectro Cloud tutorials are expected to have the same look and feel. The tutorial text and voice must adhere to the Spectro Cloud[ style guide](https://github.com/rahulhazra97/Documentation-Guide/wiki/Spectro-Cloud-Style-Guide) for a universal look and feel. The tutorial layout must also feel familiar to the reader; therefore, all tutorials must follow the layout standard described on this page.

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

| Section                   | Description |
|---------------------------|-------------|
| Title                     |  The name assigned to the tutorial. Aim for a title that is no longer than five words. |
| Intro Body                |  The introduction sets the context for the tutorial and explains the challenge. The introduction must also provide the user with an explanation of what they will learn in this tutorial.  |
| Prerequisites             |  List the required software or hardware the practitioner must have installed and available to complete the tutorial. |
| Clone GitHub Repository   |  Most tutorials are expected to have a public GitHub repository containing a versioned copy of the tutorial code, if applicable. In this section, the user should be walked through the following commands:   |
| [Concept]                 | The title of one of the main concepts of the tutorial. This could be one of several main concepts.  Example - “Configure the Environment” |
| [Sub-Concept]             |  The title of a child concept stems from the parent concept.  Example - “Create Secondary Cluster” OR “App Model  Overview” |
| Cleanup                   |  All tutorials should ideally be deployed through infrastructure as code (IaC) if applicable.  All resources deployed by the tutorial should be removed. It is our responsibility to help and provide guidance to the user on how to remove all resources. Sometimes this section is brief with a simple command `terraform destroy -auto-approve`.  |
| Wrap-Up                   |  This section summarizes the key learning concepts and the actions the practitioner conducted. Additionally, this section should link to or suggest the next set of topics that the practitioner can dive into. |

For questions or concerns, please ask in the  Slack channel `education`.
