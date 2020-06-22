# Common set of functions
# Error check is done with set -e command . Build will fail if any of the commands fail

# Variables expected from CI - PULL_NUMBER , JOB_TYPE , ARTIFACTS
set -x


build_docs() {
	make initialize
	make build
}

# Sync docs to s3
sync_s3() {

	set +x
	# mkdir ${HOME}/.aws

	aws --profile default s3 sync --cache-control 'max-age=604800' --exclude '*.html' --exclude '*page-data/*' --exclude '*.txt' --exclude '*.xml' --exclude '*/sw.js' public/ s3://docs-latest.spectrocloud.com --delete
	aws --profile default s3 sync --cache-control 'max-age=0, s-maxage=604800' public/ s3://docs-latest.spectrocloud.com --delete
	aws --profile default cloudfront create-invalidation --distribution-id EV0DH5A7CFZBY --paths "/*"
	set -x
	return 0
}

