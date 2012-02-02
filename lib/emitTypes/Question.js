var template = require("../templating").template;
var emitutils = require("../emitterSelector");



var QuestionTemplate = template(["",
"#{code}",
"if (!#{returnValue}){;",
"  parsed.value = \"\"",
"}",
"#{returnValue} = true;",
""]);

var generateQuestion = function(source,description,options){
  var varName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  return QuestionTemplate.generate({
    "varName":varName,
    "code":code,
    "returnValue":options.returnValue
  });
  
};

exports.generate = generateQuestion;