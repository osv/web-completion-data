SOURCES_SVG = \
	./src/svg.yaml

SOURCES_HTML = \
	./src/tags.yaml \
	./src/events.yaml \
	./src/attributes.yaml \
	./src/attribute-values.yaml
IGNORE_TAG_ATTRS = ./src/ignore-warn-list

all: html svg

svg:
	node ./tools/convertor/convert-yaml-to-ac-html.js --ignore ${IGNORE_TAG_ATTRS} --out ./html-stuff-svg/ ${SOURCES_SVG}

html:
	node ./tools/convertor/convert-yaml-to-ac-html.js --ignore ${IGNORE_TAG_ATTRS} --out ./html-stuff/ ${SOURCES_HTML}

setup:
	(cd ./tools/convertor/ && npm install)

# some dev tool
svg-from-wiki:
	./tools/svg/wiki2yaml.pl ./tools/svg/Proposals-AttributeWhitespace.wiki > ./src/svg.yaml
