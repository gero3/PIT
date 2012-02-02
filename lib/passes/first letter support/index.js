var astHelpers = require("../Helpers");
var fs = require("fs");


var rules = {};

var ruleIndexer = {};

var gotoInitiative = [];
var ast;


var search = function(grammar,options){
  
  ast = grammar;
  
  grammar.rules.forEach(function(rule){
      rule.firstLetterSupport = getFirstLetter(rule);
  });
  
};


var getFirstLetter = function(node){
  if (rules[node.type]){
    return rules[node.type](node);
  } else {
    console.log("first letter support has no suppport for" + node.type);
    return {"support":false};
  };
};


rules["rule"] = function(node){
  
  return getFirstLetter(node.description);
  
};
rules["action"] = function(node){
  return getFirstLetter(node.expression);
};

rules["Any"] = function(node){
  return {"support":false};
};

rules["action"] = function(node){
  return getFirstLetter(node.expression);
};

rules["Choice"] = function(node){
  var choices = [],total = {"support":true, "shouldBe":[],"shouldNotBe":[]};
  
  for(var i = 0,l = node.expressions.length;i<l;i++){
    choices.push(getFirstLetter(node.expressions[i]));
  }
  
  for(var i = 0,l = choices.length;i<l;i++){
    if (!choices[i].support){
      return {"support":false};
    }
  }
  for(var i = 0,l = choices.length;i<l;i++){
    if (Array.isArray(choices[i].shouldBe)){
      total.shouldBe = total.shouldBe.concat(choices[i].shouldBe);
    }
    if (Array.isArray(choices[i].shouldNotBe)){
      total.shouldNotBe = total.shouldNotBe.concat(choices[i].shouldNotBe);
    }
  };
  
  return total;
  
};

rules["Class"] = function(node){
  if (!node.inverted){
    return {"support":true, "shouldBe":getAllCharacters(node.characters)};
  }else {
    return {"support":true, "shouldNotBe":getAllCharacters(node.characters)};
  }
};

rules["labeled"] = function(node){
  return getFirstLetter(node.expression);
};

rules["Literal"] = function(node){
  return node.literal[0];
};

rules["OneOrMore"] = function(node){
  return getFirstLetter(node.expression);
};

rules["Question"] = function(node){
  var firstLetter = getFirstLetter(node.expression);
  firstLetter.maybe = true;
  return firstLetter ;
};

rules["rule_ref"] = function(node){
  return getFirstLetter(astHelpers.getRule(ast,node.identifier));
}

rules["Sequence"] = function(node){
  var maybe = true,sequences = [],i =0,l = node.expressions.length;
  while (maybe && i<l){
    sequences.push(getFirstLetter(node.expressions[i]));
    maybe
  };
  
  return getFirstLetter(astHelpers.getRule(ast,node.identifier));
}


var getAllCharacters = function(description){
  var chars = [];
  for(var i = 0,end = description.length;i<end;i++){
    if (Array.isArray(description[i])){
      var CharCode1 = description[i][0].charCodeAt(0);
      var CharCode2 = description[i][1].charCodeAt(0);
      
      for(;CharCode1 <= CharCode2;CharCode1++){
        chars.push(String.fromCharCode(CharCode1));
      }
    } else {
      chars.push(description[i]);
    };
  }
  return chars;
  
}

exports.search = search;
