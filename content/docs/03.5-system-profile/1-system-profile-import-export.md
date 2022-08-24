---
title: "Import Export System Profiles"
metaTitle: "Import and Export Palette System Profiles"
metaDescription: "The method for importing and exporting System Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

Palette enables system profiles to be exported and then imported across multiple environments, projects and tenants. This smoothens the reuse and sharing of huge profiles with large number of add-ons and integrations. 

# Prerequisites

* [Export](/system-profile/system-profile-import-export#exportsystemprofile) the system profile file in JSON format from the Palette console.


* The packs getting imported as part of the profile need to be present at the destination repositories.


* By default, the profile packs will be fetched from the default registry like Palette `Public Repo` at the destination. 


* The packs can be extracted from other repositories if the imported packs are present in them during the import process. 


* The `macros` needs to be present within the destination for importing a system profile. If not [create the macros](/clusters/cluster-management/macros#createyourmacro) at the destination.

# Use Cases


The Import system profile use cases include the following:

<br />

* Import system profiles across tenants.


* Import system profiles across projects.


* Import system profiles across environments.

# Export System Profile

To Import Palette system profiles the existing profile needs to be first exported as json file from the Palette console. To export follow the steps as below:

<br />

* As a `Tenant` or `Project` administrator login to the Palette console. 


* Select the `Profiles` option from the left ribbon menu.


* Select `system profiles` option from the top menu.


* From the listed system profiles, select the profile to be exported.


* From the profile details page, click `Export profile`.


* The profile will be downloaded as json file to the system.


* Save the downloaded file for import.


# Import System Profile


To import a system profile:

<br />

1. As a `Tenant` or `Project`  administrator login to the Palette console. 


2. Select the `Profiles` option from the left ribbon menu.


3. Select `System Profiles` option from the top menu.


4. To import an existing system profile, click on `Import System Profile`.


5. In the import system profile wizard, 
   * Click the `Upload file` button to upload the already exported profile JSON file.
   * Validate the file contents to avoid duplicate profile names and versions. In the case of a profile already existing with the same name and version combination, an error message is displayed. Customize the name or version number to avoid conflicts and ambiguities. 
   * Once the file contents are validated, a wizard to `Select Repositories` is open, If there are multiple repositories  with the imported profile packs at the destination. Select the repository from which the packs need to be fetched from the UI drop down and confirm. 
   * Once all the information is provided, confirm the profile creation process to have the profile created and listed. This profile can be used in the same way as any system profile for every cluster  operations such as deployments, updating, etc.

**Note:** If there is only single repository where the imported packs are present within the destination, the `Select Repositories` option will not appear. 

<br />
<br />
