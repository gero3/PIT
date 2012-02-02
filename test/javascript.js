var fs = require("fs");
var parser = require("./parsers/javascript");
var info = parser.info;

var parseFile = function(name){
  fs.readFile("test/samples/" + name,function(err,data){
    var dataValue = data.toString();
    var start= new Date();
    if (parser.parse(dataValue)){
      console.log(info.callHistory);
      console.log(((new Date()) -start) + "ms");
      console.log(name + " is OK.");
      
      fs.writeFile("test/output/javascript.json",JSON.stringify(info.parsed,null,2),function(err){console.log(err);});
    } else {
      console.log(parser.info.value);
      console.log(name + " errored.");
    }
  });
};



parseFile("javascript");