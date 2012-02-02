var fs = require("fs");
var emitter = require("../lib/emit");
var parser = require("../lib/parser");
var passes = require("../lib/passes");
var uglifyjs = require("uglify-js");


fs.readFile("test/rules/javascript", function(err,data){

  var dataValue = data.toString();
  
  var parsed =parser.parse(dataValue);
  fs.writeFile("test/ast/javascript.json",JSON.stringify(parsed, null, 2),function(){});
  var passed = passes.executeAll(parsed);
  fs.writeFile("test/checkedAst/javascript.json",JSON.stringify(parsed, null, 2),function( ){});
  var emitted = emitter.emit(passed);
  fs.writeFile("test/parsers/javascript.js",emitted,function(){});
  var minified = uglifyjs(emitted);
  fs.writeFile("test/minParser/javascript.js",minified,function(err){console.log(err)});

});
