.PHONY: initialize start commit



initialize:
	npx lerna bootstrap --hoist

start:
	npm run start

commit:
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh
