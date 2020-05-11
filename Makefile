.PHONY: initialize start commit



initialize:
	npx lerna bootstrap --hoist

start:
	(cd packages/docs && npm run start -- --open)

commit:
	git add .
	git commit -am "$(MESSAGE)"
	git push origin HEAD
	./scripts/open-pr.sh
