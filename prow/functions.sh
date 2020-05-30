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
	make start
}
