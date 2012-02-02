var template = require("../templating").template;
var emitutils = require("../emitterSelector");


var RuleRefTemplate = template(["",
"if(vault_#{identifier}[pos]){",   //vault_#{identifier}[pos]){",
"  #{returnValue} =  vault_#{identifier}[pos].returnValue;",
"  parsed.value = vault_#{identifier}[pos].parsed;",
"  pos = vault_#{identifier}[pos].endPos;",
"} else {",
"  #{returnValue} =  parse_#{identifier}(parsed,errors);",
"};"
]);

var generateAny = function(source,description,options){
    return RuleRefTemplate.generate({
      "identifier" : description.identifier,
      "returnValue":options.returnValue
    });
};

exports.generate = generateAny