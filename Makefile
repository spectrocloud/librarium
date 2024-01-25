.PHONY: initialize start commit build

IMAGE:=spectrocloud/librarium
# Retrieve all modified files in the content folder and compare the difference between the master branch git tree blob AND this commit's git tree blob
CHANGED_FILE=$(shell git diff-tree -r --no-commit-id --name-only master HEAD | grep content)

TEMP_DIR=$(shell $TMPDIR)

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[0m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


initialize: ## Initialize the repository dependencies
	@echo "initializing npm dependencies"
	npm ci
	touch .env
	npx husky-init
	vale sync

clean: ## Clean common artifacts
	npm run clear && npm run clean-api-docs
	rm -rfv build

deep-clean: ## Clean all artifacts
	rm -rf node_modules build public .cache .docusaurus
	npm run clear && npm run clean-api-docs
	docker image rm $(IMAGE) || echo "No image exists."

clean-versions: ## Clean Docusarus content versions
	@echo "cleaning versions"
	rm -rf api_versions.json versions.json versioned_docs versioned_sidebars api_versioned_sidebars api_versioned_docs
	git checkout -- docusaurus.config.js

##@ npm Targets

init: ## Initialize npm dependencies
	@echo "initializing npm dependencies"
	npm ci
	npx husky install

start: ## Start a local development server
	npm run start

build: ## Run npm build
	@echo "building site"
	npm run clear
	rm -rf build
	npm run build

versions: ## Create Docusarus content versions
	@echo "creating versions"
	./scripts/versions.sh $(TMPDIR)


versions-ci: ## Create Docusarus content versions in a GitHub Actions CI environment
	@echo "creating versions"
	./scripts/versions.sh $$RUNNER_TEMP


api: ## Generate API docs
	@echo "generating api docs"
	npm run clean-api-docs
	npm run generate-api-docs

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
	docker run --rm -it -v $(CURDIR)/docs:/librarium/docs/ -p 9000:9000 $(IMAGE)


##@ Writing Checks

sync-vale: ## Install Vale plugins
	vale sync

check-writing: ## Run Vale lint checks
	vale $(CHANGED_FILE) 

##@ Formatting Checks

format: ## Apply Prettier formating to all files.
	npm run format

format-check: ## Check if all files are formatted with Prettier.
	npm run format-check

##@ Clean Server Artifacts

fix-server: ## Fix server issues by removing the cache folder and reinstalling node modules
	@echo "fixing server"
	rm -rfv node_modules && npm ci && npm run clear

###@ PDF Generation

pdf: ## Generate PDF from docs
	@echo "generating pdf"
	npx docs-to-pdf docusaurus --initialDocURLs="https://docs.spectrocloud.com" --contentSelector="article" --paginationSelector="a.pagination-nav__link.pagination-nav__link--next" --excludeSelectors=".margin-vert--xl a,[class^='tocCollapsible'],.breadcrumbs,.theme-edit-this-page" --protocolTimeout=e00 --outputPDFFilename=palette-docs.pdf  --coverTitle="Palette Documentation" --coverImage=https://docs.spectrocloud.com/assets/images/docs_introduction_product-overview-80d5488097f9e227a325e252dda42f85.png

###@ URL Checks

verify-url-links: ## Check for broken URLs in production
	rm link_report.csv || echo "No report exists. Proceeding to scan step"
	npx linkinator https://docs.spectrocloud.com/ --recurse --timeout 60000 --retry --retry-errors-count 3 --skip "^http(?!.*spectrocloud\\.com).*$"" --skip "^https:\/\/docs\.spectrocloud\.com\/.*\/supplemental\-packs$"" --format csv > temp_report.csv && sleep 2
	grep -E '^[^,]*,[[:space:]]*([4-9][0-9]{2}|[0-9]{4,}),' temp_report.csv > link_report.csv && rm temp_report.csv


verify-url-links-ci: ## Check for broken URLs in production in a GitHub Actions CI environment
	rm link_report.json || echo "No report exists. Proceeding to scan step"
	npx linkinator https://docs.spectrocloud.com/ --recurse --timeout 60000 --retry --retry-errors-count 3 --skip '^http(?!.*software-private.spectrocloud\\.com).*$'' --skip '^http(?!.*spectrocloud\\.com).*$'' --format json > temp_report.json
	jq 'del(.links[] | select(.status <= 200))' temp_report.json > link_report.json
	rm temp_report.json
	mv link_report.json scripts/