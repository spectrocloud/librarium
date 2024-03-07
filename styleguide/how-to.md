# How-To-Guide

All Spectro Cloud How-Tos are expected to have the same look and feel. The How-To text and voice must adhere to the
Spectro Cloud [style guide](https://github.com/rahulhazra97/Documentation-Guide/wiki/Spectro-Cloud-Style-Guide) for a
universal look and feel. The how-tos layout must also feel familiar to the reader; therefore, all how-tos must follow
the layout standard described on this page.

> ℹ️ Tutorial vs How-to - What is the difference? <br />
>
> - A how-to directs the reader on how to complete the work without diving into specifics. A tutorial dives into the
>   specifics and explains concepts in great detail.
> - A how-to’s purpose is to help the user perform a particular task correctly. A tutorial will also enable the feature
>   and showcase its functionality through a demo application.
> - A how-to’s primary intent is to ensure the successful enablement of a specific action. A tutorial focuses on the
>   learning experience and provides the reader understanding of the concepts of how and why.
> - A how-to is intended to be executed in the reader’s environment. A tutorial occurs in a learning environment where
>   software and other dependencies are tightly controlled.

# Table of Contents

[Markdown Layout](#markdown-layout)

[Section Breakdown](#section-breakdown)

## Markdown Layout

The following is a high-level overview of the markdown structure that all how-tos should contain. Make a note of the
markdown heading sizes.

```
# Title

# Prerequisites

# Enablement

1. Action 1 ...

...

...

N. Action N

# Validate
```

> :warning: If you find yourself in a situation where you have multiple smaller how-to’s in a single page, then reduce
> the heading sizes by one for all other headings except the title. Example: <br /> <# Open a Jar> <br /> <## ….> <br />
> <# Remove a Jar> <br /> <## ….> <br />

## Section Breakdown

<table>
<tr>
<td> Section </td> <td> Description </td>
</tr>
<tr> <!-- Title row -->
<td> Title </td>
<td>

A minimal overview of the feature. This part of the text should link to a dedicated reference page of the feature.

</td>
</tr> <!-- End Title row -->
<tr> <!-- Prerequisites -->
<td> Prerequisites </td>
<td>

List out the required software version or hardware the practitioner must have installed and available to enable the
feature.

</td>
</tr> <!-- End Prerequisites row -->
<tr> <!-- Enablement row -->
<td> Enablement </td>
<td>

This section contains the sequential steps required to enable the feature. The steps may be console actions, commands,
or scrips the user must invoke. The reader should be able to follow the steps sequentially and successfully enable the
feature. As the author, you can change the title to something that makes sense. Just ensure you follow the style guide
for headings. You can use smaller headings in between to help break up the topic. Example: <br />

```terraform
    # Enablement
    Blah Blab Blah

   ## Find a Jar
   .1 Drive to store
   ...
   ..

   ## Select a Jar
   1. Review ingriendies labels ...
   ...
   ...

   # Validate
```

</td>
</tr> <!-- End Enablement row -->
<tr> <!-- Validate row -->
<td> Validate </td>
<td>

This section provides the user information on validating that the feature is enabled correctly. This may be a command
the user invokes, a console page they visit, an entry in a log, and so on.

</td>
</tr> <!-- End Validate row -->
</table>
