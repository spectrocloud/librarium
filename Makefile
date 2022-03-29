.PHONY: initialize start commit build

initialize:
	npm install

start:
	npm run start

commit:
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh

build:
	rm -rf public
	npm run build
