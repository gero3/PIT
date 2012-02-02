var template = require("../templating").template;
var emitutils = require("../emitterSelector");
var utils = require("../utils");

var AnyTemplate = template(["",
"if (pos < source.length){",
"  parsed.value = source.charAt(pos);",
"  pos = pos + 1;",
"  #{returnValue} = true;",
"} else {",
"  #{returnValue} = false",
"}",
""]);

var generateAny = function(source,description,options){
    return AnyTemplate.generate({
      "returnValue":options.returnValue
    });
};

exports.generate = generateAny