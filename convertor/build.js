/*global process */

var argv = require('minimist')(process.argv.slice(2));
var colors = require('colors'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    _ = require('underscore');

var T_ERROR = colors.red( '[ERROR]  '),
    T_WARNING = colors.yellow('[WARNING]'),
    T_INFO = colors.green('[Note]   ');

if (! argv._.length || !argv.out) {
  console.log('Usage: build.js --out <dir> file1.yaml ...');
}

function main(argv) {
  var yamls = _.map(argv._, loadYAML);
  var mergedYamls = mergeYamls(yamls);
  console.log('ok');

}

function loadYAML(file) {
  var data = fs.readFileSync(file, 'utf-8');
  
  return {
    filename: file,
    data: yaml.safeLoad(data)
  };
}

function mergeYamls(yamls) {
  var resAttributes = {},
      resTags = {},
      resValues = {};

  _.each(yamls, function processOneYaml(yaml) {
    var data = yaml.data;
    var attributes = data.attributes;

    if (attributes) {
      if (!_.isArray(attributes)) {
        error('"attributes" should be array');
        process.exit(1);
      }
    }
    
    _.each(attributes, function processAttributesProps(attribute, i) {

      attrShoutBeObject(attribute);
      attrShouldHaveOneKey(attribute);

      var attributeName = _.keys(attribute)[0],
          properties = attribute[attributeName];
      
      addAttributeIfHaveDoc(attributeName, properties);

      // checks
      function attrShoutBeObject(attribute) {
        if (!_.isObject(attribute) || _.isArray(attribute)) {
          errorAttr('should be Hash but got:');
          console.log(colors.red(JSON.stringify(attribute, null, 2)));        
          process.exit(1);
        }
      }
      function attrShouldHaveOneKey(attribute) {
        var keys = _.keys(attribute);
         if (keys.length > 1) {
          errorAttr('keys should be only 1, but got:');
          console.log(keys);
          process.exit(1);
        }
      }

      function errorAttr(msg) {
        error('attribute[' + i +'] ' + msg);
      }
    }); // each processAttributesProps

    // check for 'd' property and add into resAttributes
    function addAttributeIfHaveDoc(attributeName, properties) {
      var tagNames = getTagNames(properties),
          doc = properties.d;

      if (doc) {
        _.each(tagNames, function addTagAttrDocMaybe(tagName) {
          var key = tagName + '-' + attributeName;
          if (resAttributes[key]) {
            warning('Duplicate documentation for "' + colors.magenta(key) + '", overriding doc! Maybe you should place doc in one place?');
          }
          resAttributes[key] = doc;            
        });
      }
    }

    // return arraified 't' property or default ['global']
    function getTagNames(properties) {
      var tags = properties.t || ['global'];
      if (! _.isArray(tags)) {
        tags = [tags];
      }
      return tags;
    }
    
    function warning(msg) {
      console.log('%s "%s": ' + msg, T_WARNING, colors.magenta(yaml.filename));
    }

    function error(msg) {
      console.log('%s "%s": ' + msg, T_ERROR, colors.magenta(yaml.filename));
    }

  });
}

main(argv);
