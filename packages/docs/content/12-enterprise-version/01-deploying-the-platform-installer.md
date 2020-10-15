---
title: "Quick Start"
metaTitle: "Quick Start"
metaDescription: "A quick start to Spectro Cloud's Enterprise (on-premise) variant."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Deploying the Quick Start variant

[Quick Start](/enterprise-version/#quickstart) allows users to test all functions of the product without going for a full install.

## Quick Start variant - installation instructions

1. In the VMware console, add a new OVF template from this [URL](https://vmwaregoldenimage.s3.amazonaws.com/u-1804-k-1188-428c.ova).
2. Click “Yes” on the Source Verification security dialog.
3. Provide a name for the VM and choose the folder to deploy in.
4. Select `vSAN Cluster` as the Compute Resource.
5. Review the details and select storage in the next steps.
6. Select the appropriate network for the deployment.
7. In the “Customize Template” window, the SSH key is the only mandatory requirement.
    1. The Static IP addresses can be mentioned here if required.
    2. Proxy settings can be mentioned, if available.
    3. For air-gapped environments, the user needs to provide the URL and login credentials in this space.

    <WarningBox>
    Importing a new OVA from the installer will result in a fresh install discarding the existing Quick Start data.
    </WarningBox>

8. The Private Cluster Gateway is a built-in, lightweight app that provides the installation status, download logs, and run verification scripts.
9. To run this app, click on the VM with the name provided in step 3 and click the Power On button.
10. Once the IP address is generated, open port 3000 on this IP in a new browser tab to deploy the Private Cluster Gateway app.
11. The app shows the real-time installation status under the “Status” tab.
12. The “Logs” tab will contain error logs if any. This will eliminate the need to connect via SSH and run scripts in case of errors.
13. Under “Tasks” scripts can be run specifically for verification of installation parameters.
14. The “Status” tab will reflect a successful installation of the Spectro Cloud Enterprise System Console when completed and display the URL to access the console.
    1. The Spectro Cloud Enterprise System Console is similar to the super admin console on the SaaS - it is not available to tenant admins.
    2. In this console, super admins can update the Spectro Cloud version that they are using and manage their tenants. The console also provides access to manage the <Tooltip trigger={<u>Spectro Cloud Quick Start Cluster</u>}>A cluster created in the Quick Start mode.</Tooltip> and the <Tooltip trigger={<u>Spectro Cloud Enterprise Cluster</u>}>A cluster created in the Enterprise mode. These clusters handle the enterprise functions and are different from <a href="/introduction/concept-overviews/#workloadcluster">workload clusters</a>.</Tooltip>.
    3. Finally, super admins can configure backups from the Spectro Cloud Enterprise System Console.
15. Super Admins can use the `Administration` tab in the system console to manage the SMTP and Proxy settings.
16. Since a tenant will not be able to activate their SMTP before the first login, the super admin must send an activation link. This is found in the `Actions` menu of the tenant organization that was just created.
17. Using the activation link, a tenant admin logs in to the [default dashboard](/getting-started/#defaultdashboard).
18. The Admin Settings now have a “Cloud Accounts” tab for all CSPs. This allows a tenant to add cross-project cloud accounts as opposed to adding an account for each project. The admin can still add project-specific cloud accounts if they wish to.
19. For the on-prem version, using a private cloud gateway can be avoided by enabling the `Use System Private Gateway` button.
