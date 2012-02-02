var astHelpers = require("../Helpers");
var parser = require("../../parser.js");
var fs = require("fs");

var files = ["lib/passes/MissingRules/MissingRules"];
var MissingRules = [];

var addMissingRules = function(ast){

  var rules = astHelpers.getAllRulesNames(ast);
  var rulerefs = astHelpers.getAllOfType(ast,"rule_ref");
  rulerefs.forEach(function(rule_ref){
    if (rules.indexOf(rule_ref.identifier) < 0){
      var index = MissingRules.indexOf(rule_ref.identifier);
      if (index >= 0){
        rules.add(rule_ref.identifier);
        astHelpers.addRule(ast,MissingRules[index]);
      } else {
        console.error("rule " + rule_ref.identifier + " is not found.");
      }
    }
  });
};


var reload = function(){
  files.forEach(function(file){
    fs.readFile(file,function(err,data){
      if (err){
        console.log(err);
      }else {
        var ast = parser.parse(data.toString());
        if (ast && ast.type === "grammar" && ast.rules && ast.rules[0]){
          MissingRules = MissingRules.concat(ast.rules);
        }
      }
    });
  });
  
};
reload();
exports.reload = reload;

exports.addMissingRules = addMissingRules;