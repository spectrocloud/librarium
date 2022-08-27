.PHONY: initialize start commit build

IMAGE:=spectrocloud/librarium

clean:
	rm -rf node_modules build public .cache
	docker image rm $(IMAGE)

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

docker-image:
	docker build -t $(IMAGE) .

docker-initialize: docker-image
	docker run --rm -it -v $(CURDIR):/librarium $(IMAGE) npm install

docker-start: docker-image
	docker run --rm -it -v $(CURDIR):/librarium -p 9000:9000 $(IMAGE)

docker-build: docker-image
	rm -rf public
	docker run --rm -it -v $(CURDIR):/librarium $(IMAGE) npm run build