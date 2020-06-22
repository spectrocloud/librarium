# Common set of functions
# Error check is done with set -e command . Build will fail if any of the commands fail

# Variables expected from CI - PULL_NUMBER , JOB_TYPE , ARTIFACTS , SONAR_SCAN_TOKEN, SONARQUBE_URL, DOCKER_REGISTRY
set -x

commenter() {
	export GITHUB_TOKEN=$ACCESS_TOKEN_PWD
	export GITHUB_OWNER=$REPO_OWNER
	export GITHUB_REPO=$REPO_NAME
	export GITHUB_COMMENT_TYPE=pr
	export GITHUB_PR_ISSUE_NUMBER=$PULL_NUMBER
	export GITHUB_COMMENT_FORMAT="Build logs for Job ${JOB_NAME} can be found here: {{.}}"
	export GITHUB_COMMENT="http://mayflower.spectrocloud.com/log?job=${JOB_NAME}&id=${BUILD_NUMBER}"
	github-commenter
}

build_docs() {
	make initialize
	make build
}

# Sync docs to s3
sync_s3() {

	set +x
	mkdir ${HOME}/.aws
	echo '[default]' > ${HOME}/.aws/credentials 
	echo 'aws_access_key_id = AKIAYUH46N6WLT7SAB5Z' >> ${HOME}/.aws/credentials
	echo 'aws_secret_access_key = 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' >> ${HOME}/.aws/credentials

	aws --profile default s3 sync --cache-control 'max-age=604800' --exclude '*.html' --exclude '*page-data/*' --exclude '*.txt' --exclude '*.xml' --exclude '*/sw.js' public/ s3://docs-latest.spectrocloud.com --delete
	aws --profile default s3 sync --cache-control 'max-age=0, s-maxage=604800' public/ s3://docs-latest.spectrocloud.com --delete
	aws --profile default cloudfront create-invalidation --distribution-id EV0DH5A7CFZBY --paths "/*"
	set -x
	return 0
}

