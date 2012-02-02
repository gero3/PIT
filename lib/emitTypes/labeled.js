var template = require("../templating").template;
var emitutils = require("../emitterSelector");

var labeledTemplate = template(["",
"#{code}",
"parsed.Actionvars[\"#{Identifier}\"] = parsed.value",
""]);

var generateSequence = function(source,description,options){
  //options.Actionvars = {};
 // return emitutils.generate(source,description.expression,options);
    
  var varName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  return labeledTemplate.generate({
    "varName":varName,
    "code":code,
    "Identifier" : description.label,
    "returnValue":options.returnValue
  });
  
};

exports.generate = generateSequence