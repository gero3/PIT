var template = require("../templating").template;
var emitutils = require("../emitterSelector");

var actionTemplate = template(["",
"var #{OldActionVarsVarName} = parsed.Actionvars",
"parsed.Actionvars = {}",
"#{code}",
"if (#{returnValue}){",
"parsed.value = (function(#{arguments}){",
"#{actionCode}",
"})(#{inputValues});",
"}",
"parsed.Actionvars = #{OldActionVarsVarName}",
""]);

var generateSequence = function(source,description,options){
  //return emitutils.generate(source,description.expression,options);
    
  var varName = "Local_" + (options.localVariables++);
  var OldActionVarsVarName = "Local_" + (options.localVariables++);
  var code = emitutils.generate(source,description.expression,options);
  var labels = findAllLabels(description.expression);
  var args = labels.join(",");
  var inputValues = "parsed.Actionvars[\"" + labels.join("\"],parsed.Actionvars[\"") + "\"]";
  return actionTemplate.generate({
    "varName":varName,
    "code":code,
    "OldActionVarsVarName" : OldActionVarsVarName,
    "actionCode":description.code,
    "arguments":args,
    "inputValues":inputValues,
    "returnValue":options.returnValue
  });
  
  
};


var findAllLabels = function(description){
  var returnValue = [];
  if (description.type === "labeled"){
    returnValue.push(description.label);
  } else if (description.type === "Sequence"){
      for (var i = 0,l = description.expressions.length;i<l;i++){
        if (description.expressions[i].type === "labeled"){ 
          returnValue.push(description.expressions[i].label);
        }
      }
  }
  return returnValue;
};

exports.generate = generateSequence;