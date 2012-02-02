var fs = require("fs");
var parser = require("./parsers/Parser");

var parseFile = function(name,parserText){
    fs.readFile("test/samples/" + name,function(err,data){
      if (parser.parse(data.toString())){
        console.log(name + " is OK.");
      } else {
        console.log(name + " errored.");
      }
    });
};

parseFile("Parser")