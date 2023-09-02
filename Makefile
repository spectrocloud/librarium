.PHONY: initialize start commit build

IMAGE:=spectrocloud/librarium
# Retrieve all modified files in the content folder and compare the difference between the master branch git tree blob AND this commit's git tree blob
CHANGED_FILE=$(shell git diff-tree -r --no-commit-id --name-only master HEAD | grep content)

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[0m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

clean: ## Clean build artifacts
	rm -rf node_modules build public .cache .docusaurus
	docker image rm $(IMAGE)

##@ npm Targets

initialize: ## Initialize npm dependencies
	@echo "initializing npm dependencies"
	npm ci

start: ## Start a local development server
	npm run start

build: ## Run npm build
	@echo "building site"
	npm run clear
	rm -rf build
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
	docker run --rm -it -v $(CURDIR)/docs:/librarium/docs/ -p 3000:3000 $(IMAGE)


sync-vale: ## Install Vale plugins
	vale sync

check-writing: ## Run Vale lint checks
	vale $(CHANGED_FILE) 

fix-server: ## Fix server issues by removing the cache folder and reinstalling node modules
	@echo "fixing server"
	rm -rfv node_modules && rm -rfv .cache/ && npm ci

pdf: ## Generate PDF from docs
	@echo "generating pdf"
	npx docs-to-pdf docusaurus --initialDocURLs="https://docs.spectrocloud.com" --contentSelector="article" --paginationSelector="a.pagination-nav__link.pagination-nav__link--next" --excludeSelectors=".margin-vert--xl a,[class^='tocCollapsible'],.breadcrumbs,.theme-edit-this-page" --protocolTimeout=e00 --outputPDFFilename=palette-docs.pdf  --coverTitle="Palette Documentation" --coverImage=https://docs.spectrocloud.com/assets/images/docs_introduction_product-overview-80d5488097f9e227a325e252dda42f85.png
