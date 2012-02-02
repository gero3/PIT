var template = require("../templating").template;
var emitutils = require("../emitterSelector");



var OneOrMoreTemplate = template(["",
"var #{varName} = [];",
"#{code}",
"if (#{returnValue}){",
"  while(#{returnValue}){",
"    #{varName}.push(parsed.value);",
"    #{code}",
"  }",
"  parsed.value = #{varName}",
"  #{returnValue} = true;",
"}",
""]);

var generateOneOrMore = function(source,description,options){
  var varName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  return OneOrMoreTemplate.generate({
    "varName":varName,
    "code":code,
    "returnValue":options.returnValue
  });
  
};

exports.generate = generateOneOrMore;