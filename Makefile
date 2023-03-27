.PHONY: initialize start commit build

IMAGE:=spectrocloud/librarium
# Retrieve all modified files in the content folder and compare the difference between the master branch git tree blob AND this commit's git tree blob
CHANGED_FILE=$(shell git diff-tree -r --no-commit-id --name-only master HEAD | grep content)

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[0m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

clean: ## Clean build artifacts
	rm -rf node_modules build public .cache
	docker image rm $(IMAGE)

##@ npm Targets

initialize: ## Initialize npm dependencies
	npm ci

start: ## Start a local development server
	npm run start

build: ## Run npm build
	rm -rf public
	npm run build

##@ Git Targets

commit: ## Add a Git commit. Usage: make commit MESSAGE="<your message here>"
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh

##@ Docker Targets

docker-image: ## Build the docker image
	docker build -t $(IMAGE) .

docker-start: docker-image ## Start a local development container
	docker run --rm -it -v $(CURDIR)/content:/librarium/content/ -p 9000:9000 $(IMAGE)

##@ Lint Targets

verify-url-links: ## Check for broken URLs in production
	rm link_report.csv || echo "No report exists. Proceeding to scan step"
	npx linkinator https://docs.spectrocloud.com/ --recurse --timeout 60000 --retry --retry-errors-count 3 --skip "^http(?!.*spectrocloud\\.com).*$"" --format csv > temp_report.csv && sleep 2
	grep -E '^[^,]*,[[:space:]]*([4-9][0-9]{2}|[0-9]{4,}),' temp_report.csv > link_report.csv && rm temp_report.csv


verify-url-links-ci: ## Check for broken URLs in production
	rm link_report.json || echo "No report exists. Proceeding to scan step"
	npx linkinator https://docs.spectrocloud.com/ --recurse --timeout 60000 --retry --retry-errors-count 3 --skip "^http(?!.*spectrocloud\\.com).*$"" --format json > temp_report.json
	jq '.links[] | select(.status > 200)' temp_report.json | tee link_report.json
	rm temp_report.json
	mv link_report.json scripts/


verify-url-links-local: build ## Check for broken URLs locally
	rm link_report.csv || echo "No report exists. Proceeding to scan step"
	npm run test-links

sync-vale: ## Install Vale plugins
	vale sync

check-writing: ## Run Vale lint checks
	vale $(CHANGED_FILE) 

fix-server:
	@echo "fixing server"
	rm -rfv node_modules && rm -rfv .cache/ && npm ci
