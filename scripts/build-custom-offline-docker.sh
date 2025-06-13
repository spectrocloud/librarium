#!/bin/sh
set -e

CURRENT_DIR=$(pwd)
IMAGE=spectrocloud/librarium:custom

## Read logo paths from environment variables.
echo "ℹ️ LIGHT_LOGO_PATH: ${LIGHT_LOGO_PATH}"
echo "ℹ️ DARK_LOGO_PATH: ${DARK_LOGO_PATH}"

# Utility function to add variables to .env file if they do not exist
# Params: 
# $1 - variable name
# $2 - variable value
add_to_env() {
    local var_name="$1"
    local var_value="$2"

    ## if variable does not exist, add it to .env file 
    if ! grep -q "^${var_name}=" .env; then
        echo "${var_name}=${var_value}" >> .env
    fi
}

# Utility function to replace variables in .env file if they exist
# Params: 
# $1 - variable name
# $2 - variable value
replace_in_env() {
    local var_name="$1"
    local var_value="$2"

    ## if variable does not exist, add it to .env file 
    if ! grep -q "^${var_name}=" .env; then
        echo "${var_name}=${var_value}" >> .env
    else
        # If the variable exists, replace its value. Syntax is different for macOS and Linux.
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/^${var_name}=.*/${var_name}=${var_value}/" .env
         else
            sed -i "s/^${var_name}=.*/${var_name}=${var_valuee}/" .env
        fi
    fi
}


## Create offline .env file if it doesn't exist
if [ ! -f .env ]; then
    touch .env
    echo "✅ .env file created for offline documentation."
else
    echo "ℹ️ .env file already exists, skipping creation."
fi

add_to_env "ALGOLIA_ADMIN_KEY" "123456789"
add_to_env "ALGOLIA_APP_ID" "123456789"
add_to_env "ALGOLIA_SEARCH_KEY" "123456789"
add_to_env "ALGOLIA_INDEX_NAME" "madeup-index"
add_to_env "DISABLE_PACKS_INTEGRATIONS" "true"
add_to_env "DISABLE_SECURITY_INTEGRATIONS" "true"

## Copy the logos to the static directory
if [ -n "${LIGHT_LOGO_PATH}" ]; then
    cp "${LIGHT_LOGO_PATH}" "${CURRENT_DIR}/static/img/custom-light-logo.svg"
    echo "✅ Copied light logo to static/img/custom-light-logo.svg"
    replace_in_env "CUSTOM_LIGHT_LOGO" "true"
else
    echo "ℹ️ No custom light logo provided, using default."
fi
if [ -n "${DARK_LOGO_PATH}" ]; then
    cp "${DARK_LOGO_PATH}" "${CURRENT_DIR}/static/img/custom-dark-logo.svg"
    echo "✅ Copied dark logo to static/img/custom-dark-logo.svg"
    replace_in_env "CUSTOM_DARK_LOGO" "true"
else
    echo "ℹ️ No custom dark logo provided, using default."
fi

## Build the Docker image
docker build -t $IMAGE -f Dockerfile .
echo "\n✅ Docker image built successfully: $IMAGE \n"
echo "ℹ️  Use the following command to run the Docker container:"
echo "⏭️  docker run --env-file=.env --publish 9000:9000 --rm $IMAGE"
