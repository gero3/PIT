
var walker = function(ast,fn,options){
  
  if (ast.type !== "grammar"){
    walkerHelp(ast,fn,options);
  } else {
    var rules = ast.rules;
    for(var i = 0,l = rules.length;i<l;i++){
      walkerHelp(rules[i],fn,options);
    }
  };
  
  
};

var walkerHelp = function(node,fn,options){
  fn(node,options);
  switch(node.type){
    case "rule":
      walkerHelp(node.description,fn,options);
      break;
    case "Choice":
    case "Sequence":
      node.expressions.forEach(function(expression){
        walkerHelp(expression,fn,options);
      });
      break;
    case "action":
    case "labeled":
    case "OneOrMore":
    case "ZeroOrMore":
    case "Question":
    case "SimpleNot":
    case "SimpleAnd":
      walkerHelp(node.expression,fn,options);
      break;
    case "Any":
    case "Class":
    case "Literal":
    case "rule_ref":
      break;
    default:
      throw "test: " + node.type;
  }
  
  
};



var getAllRulesNames = function(ast){
  var returnValue = [];
  if (ast.type !== "grammar"){
    throw "rules are only on grammar node";
  };
  ast.rules.forEach(function(rule){
    returnValue.push(rule.identifier);
  });
  return returnValue;  
};

var getRule = function(ast,ruleName){
  if (ast.type !== "grammar"){
    throw "rules are only on grammar node";
  }
  var index = 999999,outputRule;
  ast.rules.forEach(function(rule,idx){
    if(rule.identifier ==ruleName){
      outputRule = rule; 
    }
  });
 
  
  return outputRule;
};

var removeRule = function(ast,ruleName){
  if (ast.type !== "grammar"){
    throw "rules are only on grammar node";
  }
  var index = 999999;
  ast.rules.forEach(function(rule,idx){
    if(rule.identifier ==ruleName){
        index = idx;
    }
  });
 
  ast.rules.splice(index,1);
  
  return ast;
};

var getAllOfType = function(ast, type){
  var returnValue = [];
  walker(ast,function(node){
    if (node.type === type){
      returnValue.push(node);
    };
  
  });
  return returnValue;
};

var changeTo = function(type1, type2){
  var i;
  for (i in type1){
    delete type1[i];
  };
  for (i in type2){
    type1[i] = type2[i];
  };
    
};


var select = function(ast,query){

  

}


exports.walker = walker;
exports.getAllRulesNames = getAllRulesNames;
exports.getRule = getRule;
exports.removeRule = removeRule;
exports.getAllOfType = getAllOfType;
exports.changeTo = changeTo;