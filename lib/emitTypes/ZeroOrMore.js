var template = require("../templating").template;
var emitutils = require("../emitterSelector");



var ZeroOrMoreTemplate = template(["",
"var #{varName} = [];",
"#{returnValue} = true;",
"#{code}",
"while(#{returnValue}){",
" #{varName}.push(parsed.value);",
" #{code}",
"}",
"parsed.value = #{varName};",
"#{returnValue} = true;",
""]);

var generateZeroOrMore = function(source,description,options){
  var varName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  return ZeroOrMoreTemplate.generate({
    "varName":varName,
    "code":code,
    "returnValue":options.returnValue
  });
  
};

exports.generate = generateZeroOrMore;