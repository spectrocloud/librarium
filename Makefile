.PHONY: initialize start commit build

GATSBY_DOCS_URL ?= /
GATSBY_API_URL ?= /api
GATSBY_GLOSSARY_URL ?= /glossary

initialize:
	npx lerna bootstrap --hoist

start:
	npm run start

commit:
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh

build:
	GATSBY_DOCS_URL=$(GATSBY_DOCS_URL) GATSBY_API_URL=$(GATSBY_API_URL) GATSBY_GLOSSARY_URL=$(GATSBY_GLOSSARY_URL) npm run build
