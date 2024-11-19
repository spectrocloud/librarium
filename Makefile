.PHONY: initialize start commit build

-include .env

IMAGE:=spectrocloud/librarium
# Retrieve all modified files in the content folder and compare the difference between the master branch git tree blob AND this commit's git tree blob
CHANGED_FILE=$(shell git diff-tree -r --no-commit-id --name-only master HEAD | grep content)

TEMP_DIR=$(shell $TMPDIR)

CPUS := $(shell sysctl -n hw.ncpu | awk '{print int($$1 / 2)}')

ALOGLIA_CONFIG=$(shell cat docsearch.dev.config.json | jq -r tostring)

# Find all *.md files in docs, cut the prefix ./ 
# Remove all security-bulletins and cve-reports.md because they are rate limited by nvd.nist.gov
# Remove oss-licenses.md because they are rate limited by npmjs.com
VERIFY_URL_PATHS=$(shell find ./docs -name "*.md" | cut -c 3- | sed '/security-bulletins/d' | sed '/cve-reports/d' | sed '/oss-licenses/d')

RATE_LIMITED_FILES_LIST:="docs/docs-content/security-bulletins/**/*.md" \
	"docs/docs-content/security-bulletins/*.md" \
	"docs/docs-content/unlisted/cve-reports.md"

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
	rm -rfv static/img/packs

clean-logos: ## Clean logos
	rm -rf static/img/packs

clean-versions: ## Clean Docusarus content versions
	@echo "cleaning versions"
	rm -rf api_versions.json versions.json versioned_docs versioned_sidebars api_versioned_sidebars api_versioned_docs versioned_partials
	git checkout -- docusaurus.config.js static/robots.txt


clean-packs: ## Clean supplemental packs and pack images
	rm -rf static/img/packs
	rm -rf .docusaurus/packs-integrations/api_pack_response.json
	rm -rf .docusaurus/packs-integrations/api_repositories_response.json

clean-api: ## Clean API docs
	@echo "cleaning api docs"
	npm run clean-api-docs
	# Remove the sidebar file as it's not removed by the clean-api command
	rm -f docs/api-content/api-docs/v1/sidebar.ts

clean-visuals:
	@echo "Cleaning visual regression tests"

	rm -rf test-results/  playwright-report/  screenshots/

##@ npm Targets

init: ## Initialize npm dependencies
	@echo "initializing npm dependencies"
	npm ci
	touch .env
	grep -q "^ALGOLIA_APP_ID=" .env || echo "\nALGOLIA_APP_ID=1234567890" >> .env
	grep -q "^ALGOLIA_SEARCH_KEY=" .env || echo "\nALGOLIA_SEARCH_KEY=1234567890" >> .env
	grep -q "^ALGOLIA_INDEX_NAME=" .env || echo "\nALGOLIA_INDEX_NAME=spectrocloud" >> .env
	npx husky install

start: ## Start a local development server
	make generate-partials
	npm run start

start-cached-packs: ## Start a local development server with cached packs retry.
	make generate-partials
	@{ \
		npm run start; \
		exit_code=$$?; \
		if [ "$$exit_code" = "5" ]; then \
			echo "❌ Start has failed due to missing packs data..."; \
			echo "ℹ️ Initializing fetch cached packs data..."; \
			make get-cached-packs; \
			echo "ℹ️ Retrying start... "; \
			npm run start;\
		fi; \
	}

build: ## Run npm build
	@echo "building site"
	npm run clear
	rm -rf build
	npm run build

build-cached-packs: ## Run npm build with cached packs retry
	@echo "building site"
	npm run clear
	rm -rf build
	@{ \
		npm run build; \
		exit_code=$$?; \
		if [ "$$exit_code" = "5" ]; then \
			echo "❌ Build has failed due to missing packs data..."; \
			echo "ℹ️ Initializing fetch cached packs data..."; \
			make get-cached-packs; \
			echo "ℹ️ Retrying build... "; \
			npm run build;\
		fi; \
	}

build-ci: ## Run npm build in CI environment
	@echo "building site"
	npm run clear
	rm -rf build
	@{ \
		npm run build; \
		exit_code=$$?; \
		echo "Build exited with code $$exit_code..."; \
		echo "BUILD_EXIT_CODE=$$exit_code" >> $(GITHUB_ENV); \
	}

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

test: ## Run Jest tests
	npm test -- --no-cache

test-visuals: ## Run visual regression tests
	npx playwright test visuals/

test-visuals-ci: ## Run visual regression tests
	npx playwright test --shard=1/4
	npx playwright test --shard=2/4
	npx playwright test --shard=3/4
	npx playwright test --shard=4/4


view-visual-report: ## View visual regression test report
	npx playwright show-report

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
	docker run --env-file=.env --rm -it -v $(CURDIR)/docs:/librarium/docs/ -p 9000:9000 $(IMAGE)


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
# This requires Google Chrome to be installed on the system
# Additionaly, this breaks on pages with a details and summary element inside a tab so ensure you remove those from the pages.
	@echo "generating pdf"
	npx docs-to-pdf docusaurus --initialDocURLs="https://docs.spectrocloud.com/?docusaurus-theme=light" --contentSelector="article" --paginationSelector="a.pagination-nav__link.pagination-nav__link--next" \
	--excludeSelectors=".margin-vert--xl a,[class^='tocCollapsible'],.breadcrumbs,.theme-edit-this-page" \
	--protocolTimeout=1500000 --outputPDFFilename=palette-docs.pdf  --coverTitle="Palette Documentation" \
	--coverImage=https://docs.spectrocloud.com/assets/images/docs_introduction_product-overview-80d5488097f9e227a325e252dda42f85.png


pdf-local: ## Generate PDF from local docs
# This requires Google Chrome to be installed on the system
# Additionaly, this breaks on pages with a details and summary element inside a tab so ensure you remove those from the pages.
	@echo "generating pdf"
	npx docs-to-pdf docusaurus --initialDocURLs="http://localhost:9000/enterprise-version/install-palette/install-on-kubernetes/install?docusaurus-theme=light" --contentSelector="article" --paginationSelector="a.pagination-nav__link.pagination-nav__link--next" \
	--excludeSelectors=".margin-vert--xl a,[class^='tocCollapsible'],.breadcrumbs,.theme-edit-this-page" \
	--protocolTimeout=1500000 --outputPDFFilename=palette-docs.pdf  --coverTitle="Palette Documentation" \
	--coverImage=https://docs.spectrocloud.com/assets/images/docs_introduction_product-overview-80d5488097f9e227a325e252dda42f85.png

###@ URL Checks

verify-url-links:
	@echo "Checking for broken external URLs in markdown files..."
	rm link_report.csv || echo "No report exists. Proceeding to scan step"
	@npx linkinator $(VERIFY_URL_PATHS) --config ./linkinator/linkinator.config.json > temp_report.csv && sleep 2
	@grep -E 'https?://' temp_report.csv > filtered_report.csv
	@grep -E ',[[:space:]]*([4-9][0-9]{2}|[0-9]{4,}),' filtered_report.csv > link_report.csv && rm temp_report.csv filtered_report.csv

verify-rate-limited-links:
	@echo "Checking for broken URLs in security-bulletins and oss-licenses markdown files..."
	@rm link_rate_limit_report.csv || echo "No rate limited report exists. Proceeding to scan step"
	@echo "Checking the following paths: $(RATE_LIMITED_FILES_LIST)"
	@npx linkinator $(RATE_LIMITED_FILES_LIST) --config ./linkinator/linkinator-rate-limit.config.json  > temp_rate_limit_report.csv && sleep 2
	@grep -E 'https?://' temp_rate_limit_report.csv > filtered_rate_limit_report.csv
	@grep -E ',[[:space:]]*([4-9][0-9]{2}|[0-9]{4,}),' filtered_rate_limit_report.csv > link_rate_limit_report.csv && rm temp_rate_limit_report.csv filtered_rate_limit_report.csv

verify-url-links-ci: ## Check for broken URLs in production in a GitHub Actions CI environment
	@echo "Checking for broken external URLs in CI environment..."
	@rm link_report.json || echo "No report exists. Proceeding to scan step"
	@npx linkinator $(VERIFY_URL_PATHS) --config ./linkinator/linkinator-ci.config.json  > temp_report.json
	@# Use jq to filter out links that do not start with http or https and keep only broken links
	@jq '[.links[] | select(.url | test("^https?://")) | select(.status >= 400)]' temp_report.json > filtered_report.json
	@rm temp_report.json
	@mv filtered_report.json scripts/link_report.json

verify-rate-limited-links-ci: ## Check for broken URLs in production in a GitHub Actions CI environment
	@echo "Checking for broken URLs in security-bulletins and oss-licenses markdown files in CI environment..."
	@rm link_rate_limit_report.json || echo "No rate limited report exists. Proceeding to scan step"
	@echo "Checking the following paths: $(RATE_LIMITED_FILES_LIST)"
	@npx linkinator $(RATE_LIMITED_FILES_LIST) --config ./linkinator/linkinator-rate-limit-ci.config.json  > temp_rate_limit_report.json
	@# Use jq to filter out links that do not start with http or https and keep only broken links
	@jq '[.links[] | select(.url | test("^https?://")) | select(.status >= 400)]' temp_rate_limit_report.json > filtered_rate_limit_report.json
	@rm temp_rate_limit_report.json
	@mv filtered_rate_limit_report.json scripts/link_rate_limit_report.json

###@ Image Formatting

format-images: ## Format images
	@echo "formatting images in /static/assets/docs/images/ folder"
	./scripts/compress-convert-images.sh

###@ Find unused images assets

find-unused-images:
	@echo "Find unused image assets"
	./scripts/find-unused-images.sh	

###@ Generate _partials/index.ts required to automatic partials usage.

generate-partials: ## Generate
	./scripts/generate-partials.sh

###@ Fetch cached packs assets.

get-cached-packs:
	./scripts/get-cached-packs.sh
	
###@ Aloglia Indexing

update-dev-index: ## Update the Algolia index for the dev environment
	@echo "updating Algolia index for dev environment"
	docker run  -e APPLICATION_ID=${ALGOLIA_APP_ID}  -e API_KEY=${ALGOLIA_ADMIN_KEY} -e CONFIG='${ALOGLIA_CONFIG}'  algolia/docsearch-scraper

remove-dev-index: ## Remove the Algolia index for the dev environment
	@echo "removing Algolia index for dev environment"
	algolia index delete dev-docusaurus-librarium --confirm