var template = require("../templating").template;
var emitutils = require("../emitterSelector");


var SequenceTemplate = template(["",
"var #{varName} = [];",
"var #{beginPosVar} = pos,#{innerReturnValue};",
"#{completeReturnValue} = true;",
"#{testCode}",
"",
"if(!#{completeReturnValue}){",
"  pos = #{beginPosVar};",
"} else {",
" parsed.value = #{varName}",
"};",
""]);

var pieceTemplate = template(["",
"if (#{completeReturnValue}){",
"  #{code}",
"  #{innerReturnValue} && #{varName}.push(parsed.value);",
"  #{completeReturnValue} = #{innerReturnValue};",
"};"
]);

var generateSequence = function(source,description,options){
  var code = [];
  var varName = "Local_" + (options.localVariables++);
  var beginPosVar = "Local_" + (options.localVariables++);
  var completeReturnValue = options.returnValue;
  var innerReturnValue = "Local_" + (options.localVariables++);
  options.returnValue =innerReturnValue;
  for (var i = 0,l = description.expressions.length;i<l;i++){
    var codepiece = emitutils.generate(source,description.expressions[i],options);
    code.push(pieceTemplate.generate({
      "varName":varName,
      "code" : codepiece,
      "completeReturnValue":completeReturnValue,
      "innerReturnValue": options.returnValue
    }));
  }
  options.returnValue = completeReturnValue;
  return SequenceTemplate.generate({
    "varName":varName,
    "beginPosVar":beginPosVar,
    "testCode":code.join("\n"),
    "innerReturnValue": innerReturnValue,
    "completeReturnValue":completeReturnValue
  });
    
  
  
  
  
};

exports.generate = generateSequence