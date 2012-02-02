var template = require("../templating").template;
var emitutils = require("../emitterSelector");
var utils = require("../utils");




var classTemplate = template(["",
"if (#{inverted}#{varName}[source.charCodeAt(pos)]){",
"  parsed.value = source.charAt(pos);",
"  pos = pos + 1;",
"  #{returnValue} = true;",
"} else {",
"  #{returnValue} = false",
"}",
""]);

var globalTemplate = template(["",
"var #{varName}= {#{values} };"
]);

var Objectvalues = template(["",
"\"#{value}\" : true"
]);

var generateClass = function(source,description,options){
  var code = [];
  var varName = "Global_" + (options.globalVariables++);
  var characters = getAllCharacters(description.characters);
  
  for(var i = 0,end = characters.length;i<end;i++){
    var charcode = characters[i].charCodeAt(0);
    code.push(Objectvalues.generate({
      "value": charcode
    }));
  }
  
  options.globals.push(globalTemplate.generate({
    "varName":varName,
    "values":code.join(",")
  }));
  
  return classTemplate.generate({
      "varName":varName,
    "inverted":description.inverted? "!" : "",
    "returnValue":options.returnValue
  });
  
};

var getAllCharacters = function(description){
  var chars = [];
  for(var i = 0,end = description.length;i<end;i++){
    if (Array.isArray(description[i])){
      var CharCode1 = description[i][0].charCodeAt(0);
      var CharCode2 = description[i][1].charCodeAt(0);
      
      for(;CharCode1 <= CharCode2;CharCode1++){
        chars.push(String.fromCharCode(CharCode1));
      }
    } else {
      chars.push(description[i]);
    };
  }
  return chars;
  
}

exports.generate = generateClass;