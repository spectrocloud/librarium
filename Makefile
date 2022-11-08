.PHONY: initialize start commit build

IMAGE:=spectrocloud/librarium

clean:
	rm -rf node_modules build public .cache
	docker image rm $(IMAGE)

initialize:
	npm ci

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

docker-image:
	docker build -t $(IMAGE) .

docker-start:
	docker run --rm -it -v $(CURDIR)/content:/librarium/content/ -p 9000:9000 $(IMAGE)

verify-url-links:
	rm link_report.csv || echo "No report exists. Proceeding to scan step"
	linkinator https://docs.spectrocloud.com/ --recurse --timeout 60000 --format csv >> link_report.csv

verify-url-links-staging:
	rm link_report.csv  || echo "No report exists. Proceeding to scan step"
	linkinator https://docs-latest.spectrocloud.com/ --recurse --timeout 60000 --format csv >> link_report.csv