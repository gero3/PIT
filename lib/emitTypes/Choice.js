var template = require("../templating").template;
var emitutils = require("../emitterSelector");


var SequenceTemplate = template(["",
"var #{beginPosVar} = pos,#{innerReturnValue};",
"#{completeReturnValue} = false;",
"#{testCode}",
"",
"if(!#{completeReturnValue}){",
"  pos = #{beginPosVar};",
"};",
""]);

var pieceTemplate = template(["",
"if (!#{completeReturnValue}){",
"  #{code}",
"  #{completeReturnValue} = #{innerReturnValue};",
"};"
]);

var generateChoice = function(source,description,options){
  var code = [];
  var beginPosVar = "Local_" + (options.localVariables++);
  var completeReturnValue = options.returnValue;
  var innerReturnValue = "Local_" + (options.localVariables++);
  options.returnValue =innerReturnValue;
  for (var i = 0,l = description.expressions.length;i<l;i++){
    var codepiece = emitutils.generate(source,description.expressions[i],options);
    code.push(pieceTemplate.generate({
      "code" : codepiece,
      "completeReturnValue":completeReturnValue,
      "innerReturnValue": options.returnValue
      
    }));
  }
  options.returnValue =completeReturnValue;
  return SequenceTemplate.generate({
    "beginPosVar":beginPosVar,
    "testCode":code.join("\n"),
    "innerReturnValue": innerReturnValue,
    "completeReturnValue":completeReturnValue
  });
    
  
  
  
  
};

exports.generate = generateChoice