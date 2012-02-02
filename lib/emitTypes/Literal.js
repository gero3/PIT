var template = require("../templating").template;
var emitutils = require("../emitterSelector");
var utils = require("../utils");


var keywordTemplate = template(["",
"#{returnValue} = true;",
"#{testCode}",
"if (#{returnValue}){",
"  parsed.value = \"#{literal}\";",
"} else {",
"  pos = pos - #{number};", 
"};",
""]);

//var charTest = template(["var #{varName} = (source.charCodeAt(pos) === #{charCode});"]);

var VariableTestEarlyReturn = template(["",
"  #{returnValue} = #{returnValue} && (source.charCodeAt(pos) === #{charCode});",
"  pos++;",
  ""]); 
  
//var increasePos = template(["pos = pos + #{number};"]);

var generateKeyword = function(source,description,options){
  var code = [];
  for(var i = 0,end = description.Literal.length;i<end;i++){
    var charcode = description.Literal.charCodeAt(i);
    
    code.push(VariableTestEarlyReturn.generate({
      "returnValue":options.returnValue,
      "charCode":charcode
    }));
  }
  
  return keywordTemplate.generate({
    "testCode":code.join("\n"),
    "literal":utils.stringEscape(description.Literal),
    "returnValue":options.returnValue,
    "number": description.Literal.length
  });
};

exports.generate = generateKeyword;