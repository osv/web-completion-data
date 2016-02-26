/*global process */

var argv = require('minimist')(process.argv.slice(2));
var mergeYamls = require('./lib/merger.js'),
    colors = require('colors'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    _ = require('underscore');

if (! argv._.length || !argv.out) {
  console.log('Usage: build.js --out <dir> file1.yaml ...');
}

function main(argv) {
  var yamls = _.map(argv._, loadYAML);
  var mergedYamls = mergeYamls(yamls);
  console.log(colors.green('Done.'));

}

function loadYAML(file) {
  var data = fs.readFileSync(file, 'utf-8');
  
  return {
    filename: file,
    data: yaml.safeLoad(data)
  };
}

main(argv);
