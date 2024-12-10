---
sidebar_label: "Migrate SCAR to OCI Registry"
title: "Migrate Customer-Managed SCAR to OCI Registry"
description:
  "Learn how to migrate the Spectro Cloud Artifact Regisry (SCAR) content to the OCI registry used to host packs and
  images."
icon: ""
hide_table_of_contents: false
sidebar_position: 125
tags: ["enterprise", "management", "scar"]
keywords: ["self-hosted", "enterprise"]
---

The Palette installation process requires users to configure and maintain an HTTP server to host Palette manifests. This
server is known as the Spectro Cloud Artifact Regisry (SCAR). Alternatively, users now have the option to migrate these
manifests to the same OCI registry that hosts the Palette images and packs. This migration is handled by a service
called Specman, which fetches the manifests from the OCI registry and serves them via an internal HTTP server.

The migration process involves two main steps:

- Pushing the Palette manifests to the OCI registry.
- Updating the SCAR endpoint to point to the new internal HTTP server.

Once the migration is complete, there is no longer a need to maintain a separate file server exclusively for hosting the
Palette manifests.

This guide will walk you through the steps required to push the Palette manifests to the OCI registry and update the
SCAR endpoint.

## Prerequisites

- A deployed [Palette cluster](../install-palette/install-palette.md) that uses a customer-managed SCAR to host Palette
  manifests.
- Access to the kubeconfig file for the Palette cluster to verify the SCAR endpoint update.

  :::tip

  If you deployed Palette using the Palette CLI, you can download the kubeconfig file from the Palette cluster details
  page in the system console. Navigate to the **Enterprise Cluster Migration** page and click on the **Admin
  Kubeconfig** link to download the kubeconfig file. If you deployed Palette to an existing Kubernetes cluster, contact
  your cluster administrator to obtain the kubeconfig file. For instructions on using the kubeconfig file to access your
  cluster, refer to the [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide.

  :::

- Access to the file server that hosts the Palette manifests.
- The Palette cluster must have been upgraded to version `4.5.13` or later. This is required for the SCAR migration to
  function properly.
- Access to the Palette system console.
- Ensure the following software is installed and available in the environment hosting the file server. For example, if
  you deployed an airgapped instance of Palette using the CLI, these tools must be available on your airgap support VM.

  - [tar](https://www.gnu.org/software/tar/)
  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - Required only for AWS
    ECR.
  - [ORAS](https://oras.land/docs/installation/) v1.0.0

  :::warning

  This specific version of ORAS is explicitly required for pushing packs to OCI registries.

  :::

- Ensure the following software is installed and available locally.
  - [curl](https://curl.se/docs/install.html)
  - [jq](https://jqlang.github.io/jq/download/)
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

## Migrate SCAR

1.  Open a terminal window in the environment hosting the file server and navigate to the folder where the Palette
    manifests are stored. For example, if you deployed Palette using the CLI, navigate to the `/var/www/html/`
    directory.

    ```shell
    cd /var/www/html/
    ```

2.  Compress the folder contents into an archive file called `manifests.tgz`. Issue the following command to create the
    archive.

    ```shell
    tar -czvf manifests.tgz .
    ```

3.  After compressing the files, authenticate with the OCI registry that hosts the Palette images and packs.

    :::tip

    If you deployed Palette using the CLI, the OCI registry address is provided by the `airgap-setup.sh` script. If you
    deployed Palette with Helm charts to an existing Kubernetes cluster, contact your cluster administrator for the OCI
    registry configuration.

    :::

    <!-- prettier-ignore -->
    <Tabs>
    <TabItem label="ECR" value="ECR_Registry">

    Authenticate to your ECR registry using the `aws ecr get-login-password` command. This command generates an ECR
    authorization token, which is then passed to the `oras login` command with `AWS` as username. Replace `<aws-region>`
    with the AWS region where your ECR registry is configured, and `<aws-account-id>` with your AWS account ID.

        ```bash
        aws ecr get-login-password --region <aws-region> | oras login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com
        ```

        If the login is successful, you will receive the following confirmation message.

        ```hideClipboard
        Login Succeeded
        ```

    <!-- prettier-ignore -->
    </TabItem>
    <TabItem label="Harbor" value="Harbor_Registry">

    Use `oras` to log in to your OCI registry. Replace the values below with your environment configuration. For
    additional information about CLI flags and examples, check out the
    [oras login](https://oras.land/docs/commands/oras_login) documentation. Replace `<harbor-address>` with the address
    of your Harbor registry, and `<harbor-username>` and `<harbor-password>` with your Harbor credentials.

        ```shell
        oras login <harbor-address> --user <harbor-username> --password <harbor-password>
        ```

        If you are using a Harbor registry with a self-signed certificate, you must add the `--insecure` flag according to the following example.

        ```shell
        oras login <harbor-address> --insecure --user <harbor-username> --password <harbor-password>
        ```

        If the login is successful, you will receive the following confirmation message.

        ```hideClipboard
        Login Succeeded
        ```

    <!-- prettier-ignore -->
    </TabItem>
    </Tabs>

4.  Push the `manifests.tgz` file to your OCI registry.
    <!-- prettier-ignore -->
    <Tabs>
    <TabItem label="ECR" value="ECR_Registry">

        Issue the following command to push the `manifests.tgz` file to your ECR registry. Replace `<aws-region>` with the AWS region where your ECR registry is configured and `<aws-account-id>` with your AWS account ID.

        ```shell
        oras push <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/spectro-packs/spectro-manifests/manifest:0.0.0 manifests.tgz
        ```

    <!-- prettier-ignore -->
    </TabItem>
    <TabItem label="Harbor" value="Harbor_Registry">

        Issue the following command to push the `manifests.tgz` file to your Harbor registry. Replace `<harbor-address>` with the address of your Harbor registry.

        ```shell
        oras push <harbor-address>/spectro-packs/spectro-manifests/manifest:0.0.0 manifests.tgz
        ```

    <!-- prettier-ignore -->
    </TabItem>
    </Tabs>

5.  Next, login to the Palette system console and select **Administration** from the left **Main Menu**.

6.  Select **Pack Registries**, click on the **three-dot Menu**, and then select **Edit**.

7.  Check the **Contains Spectro Manifests** box, click **Validate**, and then click **Confirm**.

    ![View of the 'Contains Spectro Manifests' OCI registry box.](/enterprise-version_system-management_scar-migration.png)

8.  In a terminal with connectivity to your Palette cluster, issue the following command to verify that the `Specman`
    service is fetching the content pushed to the OCI registry in step **4** of this guide, with the tag `0.0.0`.

    ```shell
    kubectl logs --namespace hubble-system specman-0
    ```

    ```text hideClipboard
    time="2024-12-06T12:43:14Z" level=info msg="Syncing with OCI repo"
    time="2024-12-06T12:43:14Z" level=info msg="tags[4.5.11 4.5.13 0.0.0]"
    time="2024-12-06T12:43:14Z" level=info msg="Downloading 0.0.0"
    time="2024-12-06T12:43:14Z" level=info msg="tags[4.5.11 4.5.13 0.0.0]"
    time="2024-12-06T12:43:14Z" level=info msg="Downloading 0.0.0"
    time="2024-12-06T12:43:14Z" level=info msg="listing dir /tmp/0.0.03808764833"
    time="2024-12-06T12:43:14Z" level=info msg="filename: manifests.tgz, isDir: false"
    time="2024-12-06T12:43:14Z" level=info msg="Persisting 0.0.0"
    ```

9.  The final step to complete the migration involves updating the SCAR endpoint to the internal HTTP server endpoint
    that now serves the Palette manifests: `https://specman-service.hubble-system.svc.cluster.local:8443`. Issue the
    following command to create the script responsible for updating the endpoint.

    ```shell
    cat << 'EOF1' > scar-registry-update.sh
    #!/bin/bash
    ###############################################################################
    # Usage:
    # ./ec-scar-registry-update.sh https://<PALETTE_URL> admin <SYS_ADMIN_PASSWORD>
    ###############################################################################
    #

    set -u
    set -x

    export ENDPOINT=$1
    export SYSTEM_ADMIN_USERNAME=$2
    export SYSTEM_ADMIN_PASSWORD=$3

    export SCAR_ENDPOINT=https://specman-service.hubble-system.svc.cluster.local:8443
    export SCAR_USERNAME=
    export SCAR_PASSWORD=

    auth_request() {
    cat <<EOF
    {
        "username": "${SYSTEM_ADMIN_USERNAME}",
        "password": "${SYSTEM_ADMIN_PASSWORD}"
    }
    EOF
    }

    scar_request(){
    cat <<EOF
    {
        "endpoint": "${SCAR_ENDPOINT}",
        "password": "${SCAR_PASSWORD}",
        "username": "${SCAR_USERNAME}"
    }
    EOF
    }

    get_auth_token() {
    authtoken=$(curl -k --location --silent --request POST "${ENDPOINT}/v1/auth/syslogin?setCookie=true" \
        --header 'Content-Type: application/json' \
        --data "$(auth_request)" | jq ."Authorization")
    if [[ "${authtoken}" == null ]]; then
        echo "Error Logging in. Please check the credentials and URL"
        exit 1
    fi
    }

    update_scar_repo() {
    response=$(curl -k --write-out '%{http_code}' --silent --output /dev/null --location --request PUT "${ENDPOINT}/v1/system/config/scar" \
        --header 'Content-Type: application/json' \
        --header 'Accept: application/json' \
        --header "Cookie: Authorization=${authtoken}" \
        --data-raw "$(scar_request)")
    if [[ "${response}" != "204" ]]; then
        echo "Error: Unable to update the Scar Repo"
    else
        echo "Success Setting the Scar Repo. Waiting for a minute to get the changes syncing"
        sleep 60
    fi
    }

    update_instance_type() {
    response=$(curl -k --write-out '%{http_code}' --location "${ENDPOINT}/v1/jobs/internal/syncCloudInstanceTypesData/run" \
        --header 'Content-Type: application/json' \
        --header 'Accept: application/json' \
        --header "Cookie: Authorization=${authtoken}")
    if [[ "${response}" != "204" ]]; then
        echo "Error: Unable to update the Instance Type"
    else
        echo "Started Syncing Storage Type from the palette Service"
    fi
    }

    update_storage_type() {
    response=$(curl -k --write-out '%{http_code}' --location "${ENDPOINT}/v1/jobs/internal/syncCloudStorageTypesData/run" \
        --header 'Content-Type: application/json' \
        --header 'Accept: application/json' \
        --header "Cookie: Authorization=${authtoken}")
    if [[ "${response}" != "204" ]]; then
        echo "Error: Unable to update the Storage Type"
    else
        echo "Started Syncing Storage Type from the palette Service"
    fi
    }

    get_auth_token
    update_scar_repo
    update_instance_type
    update_storage_type

    echo "Wait for 5 minute for the sync process to complete."
    EOF1
    ```

10. Grant execution permissions to the `scar-registry-update.sh` script.

    ```shell
    chmod +x scar-registry-update.sh
    ```

11. Invoke the script to update the SCAR endpoint. Replace `<palette-url>` with the address of your Palette instance and
    `<sys-admin-password>` with the system administrator password.

    ```shell
    ./ec-scar-registry-update.sh <palette-url> admin <sys-admin-password>
    ```

    Consider the following example for reference.

    ```shell hideClipboard
    ./ec-scar-registry-update.sh https://example.spectrocloud.com admin examplepassword
    ```

    The following message confirms that the script has completed its tasks.

    ```text hideClipboard
    Wait for 5 minutes for the sync process to complete.
    ```

## Validate

Issue the following command to verify that the endpoint was updated successfully. Replace `<palette-url>` with the
address of your Palette instance and `<sys-admin-password>` with the system administrator password.

    ```shell
    AUTH_TOKEN=$(curl --location '<palette-url>/v1/auth/syslogin' \
    --header 'Content-Type: application/json' \
    --data '{
        "username": "admin",
        "password": "<sys-admin-password>"
    }' | jq ."Authorization")

    curl --location '<palette-url>/v1/system/config/scar' \
    --header "Cookie: Authorization=$AUTH_TOKEN"
    ```

    The output should contain the updated SCAR endpoint.

    ```text hideClipboard
    {"endpoint":"https://specman-service.hubble-system.svc.cluster.local:8443"}
    ```
