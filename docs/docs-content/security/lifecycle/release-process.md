---
sidebar_label: "Release Process"
title: "Release Process"
description: "Learn about Spectro Cloud's release process for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---





# Release Process

We use semantic versioning for releases, where release versions follow the *Major.Minor.Patch* numbering pattern across all components, and we utilize and maintain *Integration*, *Stage*, and *Production* environments.

<br />

## Checklist

Our release process includes a checklist of the features planned for release to ensure their completion or to ensure a completion plan is in place. 

When all pre-deployment checklist items are complete, stakeholders review the checklist to make an informed decision about the state of the release and do the following: 

<br />

- Identify any steps that have not been completed.


- Request additional information.


- Follow up as needed. 


## Signoff

A new version deployment will not proceed until all stakeholders have signed off.

<br />

## Backup

We back up the current release before starting a new one. Should a rollback be required and patching is not an option, a rollback request is submitted to the Spectro Cloud DevOps team. The DevOps team will restore from the backup and revert the production SaaS instance to the prior version.
