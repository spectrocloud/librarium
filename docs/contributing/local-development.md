<!-- vale off -->

# Local Development

## Prerequisites

To contribute, we recommend having the following software installed locally on your workstation.

- VScode or a text editor

- [Docker](https://docs.docker.com/desktop/)

- Git configured and access to the GitHub repository

- Node.js v22 and npm.

- [Vale](https://vale.sh/docs/vale-cli/installation/), version 3.6.0 or higher.

## Local Development (Docker)

To get started with the Docker-based local development approach, ensure you are in the root context of this repository.

Initialize the repository by issuing the following command:

```shell
make init
```

By default, the [Packs Component](generated-content.md#packs-component) is disabled. If you would like to enable it,
then add your Palette API key and set `DISABLE_PACKS_INTEGRATIONS` to `false` in the `.env` file. Replace
`<your-palette-api-key>` with your Palette API key.

```shell
PALETTE_API_KEY="<your-palette-api-key>"
DISABLE_PACKS_INTEGRATIONS=false
```

> [!IMPORTANT] You need a Palette API key to start the local development server. Refer to the
> [Create API Key](https://docs.spectrocloud.com/user-management/authentication/api-key/create-api-key/) guide to learn
> how to create a Palette API key.

Issue the following command to build the Docker image and start the Dockererized local development server. The command
may take several minutes to complete.

```shell
make docker-start
```

The local development server is ready when the following output is displayed in your terminal.

```shell
> spectro-cloud-docs@4.0.0 start
> docusaurus start --host 0.0.0.0 --port 9000

[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:9000/

✔ Client
  Compiled successfully in 8.39s

client (webpack 5.88.2) compiled successfully
```

Open up a browser and navigate to [http://localhost:9000](http://localhost:9000) to view the documentation website.

To exit from the local development Docker container. Press `Ctrl + Z`.

## Local Development Setup (Non-Docker)

Clone the repository and run the initialization script.

```sh
git clone https://github.com/spectrocloud/librarium.git
cd librarium
make init
```

The `make init` command will install all the required dependencies and create your `.env` file. It will also add the
`ignore-scripts=true` setting to your local npm configuration. This setting is required to prevent post-install scripts
from running during the installation of dependencies.

Next, add your Palette API key to the `.env` file. Replace `<your-palette-api-key>` with your Palette API key.

```shell
PALETTE_API_KEY="<your-palette-api-key>"
```

> [!IMPORTANT] You need a Palette API key to start the local development server. Refer to the
> [Create API Key](https://docs.spectrocloud.com/user-management/authentication/api-key/create-api-key/) guide to learn
> how to create a Palette API key.

By default, last update times are hidden on local development. You can enable them by setting the
`SHOW_LAST_UPDATE_TIME` variable in you `.env` file.

```shell
SHOW_LAST_UPDATE_TIME=true
```
