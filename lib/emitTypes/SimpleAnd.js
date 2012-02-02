var template = require("../templating").template;
var emitutils = require("../emitterSelector");



var OneOrMoreTemplate = template(["",
"var #{PosvarName} = pos;",
"#{code}",
"pos = #{PosvarName};",
""]);

var generateOneOrMore = function(source,description,options){
  var varName = "Local_" + (options.localVariables++);
  var PosvarName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  return OneOrMoreTemplate.generate({
    "varName":varName,
    "code":code,
    "PosvarName": PosvarName
  });
  
};

exports.generate = generateOneOrMore;