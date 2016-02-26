/*global process */

var argv = require('minimist')(process.argv.slice(2));
var mergeYamls = require('./lib/merger.js'),
    colors = require('colors'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    _ = require('underscore');

if (! argv._.length || !argv.out) {
  console.log('Usage: build.js --out <dir> file1.yaml ...');
}

var FILE_TAG_LIST = 'html-tag-list',
    DIR_TAGS_DOC = 'html-tag-short-docs',
    DIR_ATTRIBUTES_VALUES = 'html-attributes-complete',
    DIR_ATTRIBUTES = 'html-attributes-list',
    DIR_ATTRIBUTES_LARGE_DOC = 'html-attributes-short-docs';
    
function main(argv) {
  var yamls = _.map(argv._, loadYAML);
  var data = mergeYamls(yamls);

  createStuffFiles(data, argv.out);
  
  //console.log(data);

  console.log(colors.green('Done.'));

}

function loadYAML(file) {
  var data = fs.readFileSync(file, 'utf-8');
  
  return {
    filename: file,
    data: yaml.safeLoad(data)
  };
}

// create html stuff. They are sorted ABC
function createStuffFiles(data, dir) {
  var tags = data.tags,
      attributes = data.attributes;

  var tagFile = path.join(dir, FILE_TAG_LIST);
  var tagDocDir = path.join(dir, DIR_TAGS_DOC);
  
  mkdirp.sync(dir);
 
  if (! _.isEmpty(tags)) {
    mkdirp.sync(tagDocDir);
    var tagsData = _
          .keys(tags)
          .sort()
          .join('\n');
    
    fs.writeFileSync(tagFile, tagsData);
    created(tagFile);

    var sortedTagNames = _.keys(tags).sort();

    sortedTagNames.forEach(function createTagsDoc(tagName) {
      var file = path.join(tagDocDir, tagName);
      var doc = tags[tagName];
      
      if (!_.isEmpty(doc)) {
        fs.writeFileSync(file, doc);
        created(file);
      }
    });

    console.log('');
  }

  if (!_.isEmpty(attributes)) {
    var attributesDir = path.join(dir, DIR_ATTRIBUTES),
        attributesDirDoc = path.join(dir, DIR_ATTRIBUTES_LARGE_DOC),
        attributeValuesDir = path.join(dir, DIR_ATTRIBUTES_VALUES);
    console.log(attributes);

    mkdirp.sync(attributesDir);
    mkdirp.sync(attributesDirDoc);
    mkdirp.sync(attributeValuesDir);

    // _.each(attributes, '');
    console.log('');

  }
}

function created(msg) {
  console.log(colors.green('Created') + ' ' + msg);  
}

main(argv);
