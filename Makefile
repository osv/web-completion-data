SOURCES = \
	./src/tags.yaml \
	./src/events.yaml \
	./src/attributes.yaml \
	./src/attribute-values.yaml

all:
	node ./tools/convertor/convert-yaml-to-ac-html.js --out ./html-stuff/ ${SOURCES}

setup:
	(cd ./tools/convertor/ && npm install)
