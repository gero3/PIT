var fs = require("fs");
var parser = require("./parsers/selector");

var parseFile = function(name){
    fs.readFile("test/samples/" + name,function(err,data){
      var dataValue = data.toString();
      if (parser.parse(dataValue)){
        console.log(name + " is OK.");
      } else {
        console.log(parser.value);
        console.log(name + " errored.");
      }
    });
};

parseFile("selector")