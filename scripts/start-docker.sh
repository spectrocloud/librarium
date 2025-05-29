#!/bin/sh
set -e

CURRENT_DIR=$(pwd)
## Read logo paths from .env file.
LIGHT_LOGO_PATH=$(grep '^LIGHT_LOGO_PATH=' .env | cut -d '=' -f2-)
DARK_LOGO_PATH=$(grep '^DARK_LOGO_PATH=' .env | cut -d '=' -f2-)
echo "ℹ️ LIGHT_LOGO_PATH: ${LIGHT_LOGO_PATH}"
echo "ℹ️ DARK_LOGO_PATH: ${DARK_LOGO_PATH}"  

start_default_docker() {
    docker run \ 
        --env-file=.env \ 
        --rm \
        -it \
        -v "$(realpath "$CURRENT_DIR/docs")":/librarium/docs/ \
        -v "$(realpath "$CURRENT_DIR/_partials")":/librarium/_partials/ \
        -p 9000:9000 \
        $IMAGE
}

start_custom_logos_docker() {
    docker run \
        --env-file=.env \
        --rm \
        -it \
        -v "$(realpath "$CURRENT_DIR/docs")":/librarium/docs/ \
        -v "$(realpath "$CURRENT_DIR/_partials")":/librarium/_partials/ \
        -v "$(realpath "$LIGHT_LOGO_PATH")":/librarium/static/img/custom-light-logo.png \
        -v "$(realpath "$DARK_LOGO_PATH")":/librarium/static/img/custom-dark-logo.png \
        -p 9000:9000 \
        $IMAGE
}

## If no custom directories are set don't export anything.
if [ -z "${LIGHT_LOGO_PATH}" ] && [ -z "${LIGHT_LOGO_PATH}" ]; then
    echo "✅ Starting Docker container with default Spectro Cloud logos."
    start_default_docker

elif [ -n "${LIGHT_LOGO_PATH}" ] && [ -n "${DARK_LOGO_PATH}" ]; then
    echo "✅ Starting Docker container with custom logos."
    start_custom_logos_docker
else 
    echo "❌ Error: Only one custom logo is set. Both LIGHT_LOGO_PATH and DARK_LOGO_PATH logo must be set. "
    echo "✅ Starting Docker container with default Spectro Cloud logos."
    start_default_docker
fi
