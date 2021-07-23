# Common set of functions
# Error check is done with set -e command . Build will fail if any of the commands fail

# Variables expected from CI - PULL_NUMBER , JOB_TYPE , ARTIFACTS
set -x

# Initialize & Build  docs
build_docs() {
	apk add --no-cache automake autoconf libtool
	make initialize
	GATSBY_ALGOLIA_APP_ID=${GATSBY_ALGOLIA_APP_ID} GATSBY_ALGOLIA_SEARCH_KEY=${GATSBY_ALGOLIA_SEARCH_KEY} ALGOLIA_ADMIN_KEY=${ALGOLIA_ADMIN_KEY} make build
}

# Sync docs to s3
sync_s3() {
	aws s3 sync --cache-control 'max-age=604800' --exclude '*.html' --exclude '*page-data/*' --exclude '*.txt' --exclude '*.xml' --exclude '*/sw.js' public/ s3://docs-latest.spectrocloud.com --delete
	aws s3 sync --cache-control 'max-age=0, s-maxage=604800' public/ s3://docs-latest.spectrocloud.com --delete
	aws cloudfront create-invalidation --distribution-id EV0DH5A7CFZBY --paths "/*"
	return 0
}

# Sync docs to docs
sync_s3_release() {
	aws s3 sync --cache-control 'max-age=604800' --exclude '*.html' --exclude '*page-data/*' --exclude '*.txt' --exclude '*.xml' --exclude '*/sw.js' public/ s3://docs.spectrocloud.com --delete
	aws s3 sync --cache-control 'max-age=0, s-maxage=604800' public/ s3://docs.spectrocloud.com --delete
	aws cloudfront create-invalidation --distribution-id E1LK6TRNPR90DX --paths "/*"
	return 0
}

