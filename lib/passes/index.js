var astHelpers = require("./Helpers");
var missingRules = require("./MissingRules");


var proxyrules = function(ast){
  var rules = astHelpers.getAllOfType(ast,"rule");
  var rulerefs = astHelpers.getAllOfType(ast,"rule_ref");

  rules.forEach(function(rule){

    if(rule.description.type === "rule_ref"){
      rulerefs.forEach(function(ruleref){
        if (ruleref.identifier === rule.identifier){
          ruleref.identifier = rule.description.identifier;
        }
      });
    }
    
  });


};

var removeSimpleRules = function(ast){
  var rules = astHelpers.getAllOfType(ast,"rule");
  var rulerefs = astHelpers.getAllOfType(ast,"rule_ref");

  rules.forEach(function(rule){

    if(rule.description.type === "Class" || rule.description.type === "Literal" ){
      rulerefs.forEach(function(ruleref){
        if (ruleref.identifier === rule.identifier){
          astHelpers.changeTo(ruleref,rule.description);
        }
      });
    }
    
  });


};

var removeOnetimers = function(ast){
  var rules = astHelpers.getAllRulesNames(ast);
  var rulerefs = astHelpers.getAllOfType(ast,"rule_ref"); 
  var ruleUsageCounter = {};
  
  rules.forEach(function(rule){
    ruleUsageCounter[rule] = 0;
  });
  
  rulerefs.forEach(function(ruleref){
    ruleUsageCounter[ruleref.identifier] =  ruleUsageCounter[ruleref.identifier] + 1;
  });
  
  rulerefs.forEach(function(ruleref){
    if (ruleUsageCounter[ruleref.identifier] === 1){
      astHelpers.changeTo(ruleref,astHelpers.getRule(ast,ruleref.identifier).description);
    }
  });
    
  
};





var removeUnusedRules = function(ast){
  var rules = astHelpers.getAllRulesNames(ast);
  var rulerefs = astHelpers.getAllOfType(ast,"rule_ref"); 
  var ruleUsageCounter = {};
  
  rules.forEach(function(rule){
    ruleUsageCounter[rule] = 0;
  });
  
  rulerefs.forEach(function(ruleref){
    ruleUsageCounter[ruleref.identifier] =  ruleUsageCounter[ruleref.identifier] + 1;
  });
  
  rules.forEach(function(rule){
    if (ruleUsageCounter[rule] === 0 && rule !== "start"){
      astHelpers.removeRule(ast,rule);
    }
  });
  
};

var removeChoicesWithOnlyClasses = function(ast){
  var Choices = astHelpers.getAllOfType(ast,"Choice");
  var completeClass = true;
  var characters = [];

  Choices.forEach(function(Choice){
    completeClass = true;
    characters = [];
    
    Choice.expressions.forEach(function(expression){
      if(expression.type !== "Class"){
        completeClass = false;
      }
    });
    
    if (completeClass){
      Choice.expressions.forEach(function(expression){
        characters.push.apply(characters,expression.characters);
      });
      var classes = {"type":"Class","characters":characters};
      astHelpers.changeTo(Choice,classes);
    }
    
  });


};



var executeAll = function(ast){
  missingRules.addMissingRules(ast);
  proxyrules(ast);
  removeSimpleRules(ast);
//  removeOnetimers(ast);
  removeChoicesWithOnlyClasses(ast);
  removeSimpleRules(ast);
  removeChoicesWithOnlyClasses(ast);
  removeUnusedRules(ast);
  return ast;
};


exports.executeAll = executeAll;
