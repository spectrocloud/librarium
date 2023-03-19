---
title: "Clone a VM"
metaTitle: "Clone a VM"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview


A VM clone is a copy of a virtual machine. A VM clone is a copy of a virtual machine performed at a specific time with the same configuration settings and identifiers.  The existing virtual machine is known as the parent, while the new VM is called the clone. After the cloning operation, the clone VM runs as a separate virtual machine.

Cloning is a fast and simple way to create a new virtual machine that shares properties with an existing one and is useful a variety of scenarios:

<br />

- Software testing: developers can clone a running VM to test new changes to their code. 


- Forensics: security admins can clone an infected machine before . The cloned VM can then be connected to a air-gaped network to investigate the source of the infection while the parent VM can be destroyed or remediated.


Under the hood, the clone operations relies on the snapshot operation.

From the **Actions drop-down Menu**, select **Clone**.

You can define the name of the newly created virtual machine, a description, its namespace, and if it requires to be started when the clone operations completes.

Note: cloning requires the VM to be powered off. If the concerned VM is still running, it will be powered off while cloning.






