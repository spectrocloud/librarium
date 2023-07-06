---
title: "Import Export Cluster Profiles"
metaTitle: "Import and Export Palette Cluster Profiles"
metaDescription: "The method for importing and exporting Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview
Palette enables cluster profiles to be exported and then imported across multiple environments, projects and tenants. This smoothens the reuse and sharing of huge profiles with large number of add-ons and integrations. 

# Prerequisites

* [Export](/cluster-profiles/cluster-profile-import-export#exportclusterprofile) the cluster profile file in JSON format from the Palette console.


* The packs in the exported profile should be available in the target environment during import.


* The `macros` used in the exported profile should be available in the target environment during import. If not [create the macros](/clusters/cluster-management/macros#createyourmacro) at the target environment.

# Use Cases


The Export/Import Cluster Profile use cases:

<br />

* Export / Import use case is most suitable for different environments like stage & dev saas setups.

# Export Cluster Profile

To Import Palette cluster profiles the existing profile needs to be first exported as json file from the Palette console. To export follow the steps as below:

<br />

* As a `Tenant` or `Project` administrator login to the Palette console. 


* Select the `Profiles` option from the left ribbon menu.


* Select `Cluster Profiles` option from the top menu.


* From the listed cluster profiles, select the profile to be exported.


* From the profile details page, click `Export profile`.


* The profile will be downloaded as json file to the system.


* Save the downloaded file for import.

<InfoBox>
While exporting the profile, the sensitive pack values will be masked and must be updated during import.
</InfoBox>

# Import Cluster Profile


To import a cluster profile:

<br />

1. As a `Tenant` or `Project`  administrator login to the Palette console. 


2. Select the `Profiles` option from the left ribbon menu.


3. Select `Cluster Profiles` option from the top menu.


4. To import an existing cluster profile, click on `Import Cluster Profile`.


5. In the import cluster profile wizard, 
   * Click the `Upload file` button to upload the already exported profile JSON file.
   * Validate the file contents to avoid duplicate profile names and versions. In the case of a profile already existing with the same name and version combination, an error message is displayed. Customize the name or version number to avoid conflicts and ambiguities. 
   * Once the file contents are validated, a wizard to `Select Repositories` is open, If there are multiple repositories  with the imported profile packs at the destination. Select the repository from which the packs need to be fetched from the UI drop down and confirm. 
   * Once all the information is provided, confirm the profile creation process to have the profile created and listed. This profile can be used in the same way as any cluster profile for every cluster  operations such as deployments, updations, etc.

**Note:** If there is only single repository where the imported packs are present within the destination, the `Select Repositories` option will not appear. 

<br />
<br />
