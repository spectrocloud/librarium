#!/bin/sh
set -e

CURRENT_DIR=$(pwd)
IMAGE=spectrocloud/librarium:custom

## Read logo paths from environment variables.
echo "ℹ️ LIGHT_LOGO_PATH: ${LIGHT_LOGO_PATH}"
echo "ℹ️ DARK_LOGO_PATH: ${DARK_LOGO_PATH}"

## Create offline .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "ALGOLIA_ADMIN_KEY=123456789" > .env
    echo "ALGOLIA_APP_ID=123456789" >> .env
    echo "ALGOLIA_SEARCH_KEY=123456789" >> .env
    echo "ALGOLIA_INDEX_NAME=madeup-index" >> .env
    echo "DISABLE_PACKS_INTEGRATIONS=true" >> .env
    echo "DISABLE_SECURITY_INTEGRATIONS=true" >> .env
    echo "CUSTOM_LIGHT_LOGO=true" >> .env
    echo "CUSTOM_DARK_LOGO=true" >> .env
    echo "✅ .env file created for offline documentation."
else
    echo "ℹ️ .env file already exists, skipping creation."
fi

## Copy the logos to the static directory
if [ -n "${LIGHT_LOGO_PATH}" ]; then
    cp "${LIGHT_LOGO_PATH}" "${CURRENT_DIR}/static/img/custom-light-logo.svg"
    echo "✅ Copied light logo to static/img/custom-light-logo.svg"
else
    echo "ℹ️ No custom light logo provided, using default."
fi
if [ -n "${DARK_LOGO_PATH}" ]; then
    cp "${DARK_LOGO_PATH}" "${CURRENT_DIR}/static/img/custom-dark-logo.svg"
    echo "✅ Copied dark logo to static/img/custom-dark-logo.svg"
else
    echo "ℹ️ No custom dark logo provided, using default."
fi

## Build the Docker image
docker build -t $IMAGE -f Dockerfile .
echo "\n✅ Docker image built successfully: $IMAGE \n"
echo "ℹ️  Use the following command to run the Docker container:"
echo "⏭️  docker run --env-file=.env --publish 9000:9000 --rm $IMAGE"
