var template = require("./templating").template;
var emitterSelector = require("./emitterSelector");

var grammarTemplate = template(["",
"function quote(s) {",
"        /*",
"         * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a",
"         * string literal except for the closing quote character, backslash,",
"         * carriage return, line separator, paragraph separator, and line feed.",
"         * Any character may appear in the form of an escape sequence.",
"         *",
"         * For portability, we also escape escape all control and non-ASCII",
"         * characters. Note that \"\\0\" and \"\\v\" escape sequences are not used",
"         * because JSHint does not like the first and IE the second.",
"         */",
"        return \'\"\' + s",
"          .replace(/\\\\/g, \'\\\\\\\\\')  // backslash",
"          .replace(/\"/g, \'\\\\\"\')    // closing quote character",
"          .replace(/\\x08/g, \'\\\\b\') // backspace",
"          .replace(/\\t/g, \'\\\\t\')   // horizontal tab",
"          .replace(/\\n/g, \'\\\\n\')   // line feed",
"          .replace(/\\f/g, \'\\\\f\')   // form feed",
"          .replace(/\\r/g, \'\\\\r\')   // carriage return",
"          .replace(/[\\x00-\\x07\\x0B\\x0E-\\x1F\\x80-\\uFFFF]/g, escape)",
"          + \'\"\';",
"}",
" ",
"var pos,length,info = {},source,called = {};",
" ",
"#{globalVariables}",
" ",
"var parse = function(source2){", 
"pos = 0; ",
"source = source2;",
"length = source.length; ", 
" ",
"var test = {};",
"var parsed = parse_start(test,{});",
"if (pos !== length){",
"return false;",
"}",
"info.parsed = test.value;",
"info.callHistory = (called);",
"return parsed;",
"};",
" ",
"#{rules} ",
" ",
"exports.parse = parse;",
"exports.info = info;"]);

var ruleTemplate = template(["",
"var vault_#{name} = {};",
"var parse_#{name} = function(parsed,errors){",
"called[\"#{name}\"] = (called[\"#{name}\"] || 0) + 1;",
"var #{returnValue},#{posBegin} = pos;", 
"#{code}",
"vault_#{name}[#{posBegin}] = {\"returnValue\":#{returnValue},\"parsed\":parsed.value, \"endPos\":pos};",
"return #{returnValue};", 
"};",
""]);



var emit = function(grammar,options){
  
  options = options || {};
  
  options.localVariables = 0;
  options.globalVariables = 0;
  options.globals = [];
  var rules = generateRules(grammar.source,grammar.rules,options);
  
  return grammarTemplate.generate({
    "rules": rules,
    "globalVariables":options.globals.join("\n")
  });
  
};

var generateRules = function(source,rules,options){
  var codeRules = [];

  for(var i = 0,l = rules.length;i<l;i++){
    options.returnValue = "Local_" + (options.localVariables++);
    var posBegin = "Local_" + (options.localVariables++);
    var code = generateRuleContent(source,rules[i],options);
    codeRules.push(ruleTemplate.generate({
      "name":rules[i].identifier,
      "code": code,
      "returnValue":options.returnValue,
      "posBegin" : posBegin
    }));
  }
  
  return codeRules.join("\n\n");
};

var generateRuleContent = function(source,rule,options){
  return selectType(source,rule.description,options);
};
var selectType = function(source,description,options){
  
  return emitterSelector.generate(source,description,options);
};


exports.emit = emit;