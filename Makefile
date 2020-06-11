.PHONY: initialize start commit build

GATSBY_DOCS_URL ?= '/'
GATSBY_API_URL ?= '/api'
GATSBY_GLOSSARY_URL ?= '/glossary'
GATSBY_SITE_URL ?= 'https://docs.spectrocloud.com'
DEFAULT_PARAMS = GATSBY_SITE_URL=$(GATSBY_SITE_URL) GATSBY_DOCS_URL=$(GATSBY_DOCS_URL) GATSBY_API_URL=$(GATSBY_API_URL) GATSBY_GLOSSARY_URL=$(GATSBY_GLOSSARY_URL)


initialize:
	npx lerna bootstrap --hoist

start:
	$(DEFAULT_PARAMS) npm run start

commit:
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh

build:
	$(DEFAULT_PARAMS) npm run build
