var pos = 0;
var length = 0;
var source = "";
var error;
var push = [].push;

// helper functions

var checkErrors = function(){
  return error || (pos >= length);
};

exports.parse = function(src){
    pos = 0;
    length = src.length; 
    source = src;
    error = undefined;
    return parseRules();
};



var parseRules = function(){

  var grammar = { "pos": pos,
                  "source":source,
                  "end":length-1,
                  "error":"",
                  "rules": []};
         
  while(!checkErrors() ){  
    var rule = parseRulewithComments();
    if (!error && rule){
      grammar.rules.push(rule);
    } else {
      grammar.error = error || "rule couldn't be found";
    }
  }

  return grammar;
};




var parseRulewithComments = function(){
  
  var rule = { "pos":pos,
               "end": pos,
               "comments":[],
               "identifier":"",
               "description":undefined};
  
  var comments = parseWhitespaceAndComments();
  if(checkErrors()) {
    error = error || "test0";
    return;
  }
  push.apply(rule.comments,comments);
  
  var identifier = parseIdentifier();
  if(checkErrors()) {
    error = error || "test1";
    return;
  }
  rule.identifier = identifier;
  
  comments = parseWhitespaceAndComments();
  if(checkErrors()) {
    error = error || "test2";
    return;
  }
  push.apply(rule.comments,comments);
  
  parseEqualSign();
  if(checkErrors()) {
    error = error || "test3";
    return;
  }
  
  comments = parseWhitespaceAndComments();
  if(checkErrors()) {
    error = error || "test4";
    return;
  }
  push.apply(rule.comments,comments);
  
  var description = parseDescriptions();
  if(error) {
    error = error || "test5";
    return;
  }
  rule.description = description;
  
  rule.end = pos - 1;
  return rule;
};

var parseWhitespaceAndComments = function(){
  var comments = [];
  var isWhitespace = false;
  if(checkErrors()) {
    error ="EOF";
    return;
  }
  var char = source.charAt(pos);
  do {

    
    if (char === " "|| char === "\n"){
      pos++;
      char = source.charAt(pos);
      isWhitespace = true;
    } else {
      isWhitespace = false;
    };
    
  } while(isWhitespace && !checkErrors());
  
  
  return comments
  
};

var parseIdentifier = function(){
  var isIdentifierChar = false;
  var identifier = ""
  
        
  do {
    var char = source.charAt(pos);

    
    if (/[a-zA-Z]/g.test(char)){
      pos++;
      identifier += char;
      isIdentifierChar = true
    } else {
      isIdentifierChar = false;
    }
    
    
  } while(isIdentifierChar && !checkErrors());
  
  return identifier;
};


var parseEqualSign = function(){
  var char = source.charAt(pos);

  if (char !== "="){
    error = "Expected = but found '" + char + "'";
    return ;
  } else {
    pos++;
  }
     
  return "=";
  
};

var parseDescriptions = function(){
  return parseSequence();
};

var parseSequence = function(){
  var returnValue = {
    "type":"Sequence",
    "pos":pos,
    "end":pos,
    "expressions":[]
    };
  do{  
    returnValue.expressions.push(parseprefix());
    parseWhitespaceAndComments();
  }while(!checkErrors());
  error = undefined; 
  
  if (returnValue.expressions.length === 1 ){
    return returnValue.expressions[0];
  }
  
  return returnValue;
};
var parseprefix = function(){

  switch (source.charAt(pos)){
    case "!":
      return parseSimpleNot();
    default :
      return parsesuffix();
  }
  
  
  return 
};
var parsesuffix = function(){
  var value = parseprimary();
  
  switch (source.charAt(pos)){
    case "*":
      return parseZeroOrMore(value);
    case "+":
      return parseOneOrMore(value);
    case "?": 
      return parseQuestion(value);        
    default:
      return value;
  }  
};
var parseprimary = function(){  
  switch (source.charAt(pos)){
    case "\"":
      return parseLiteral();
    case "[":
      return parseclass();
    case ".":
      return parseAny();    
    default:
      error =  "test";
  }
};


var parseLiteral = function(){
  
  var returnValue = {
    "type":"Literal",
    "pos":pos,
    "end":pos,
    "Literal":""
  };
  
  var isKeywordChar = false;
  var char = source.charAt(pos);
  if (char !== "\"" ){
     error = "Literal should start with \"";
  }
  pos++;
  
  do {
    char = source.charAt(pos);

    
    if (char !== "\"" ){
      pos++;
      returnValue.Literal = returnValue.Literal + char;
      isKeywordChar = true;
    } else {
      isKeywordChar = false;
    }
    
  } while(isKeywordChar && !checkErrors());
  
  if (char !== "\"" ){
    error = "Literal should end with \"";
  }
  returnValue.end = pos;
  pos++;

  return returnValue;
};

var parseclass = function(){

  var returnValue = {
    "type":"Class",
    "pos":pos,
    "end":pos,
    "characters":[]
  };
  
  var isClassChar = false;
  var char = source.charAt(pos);
  if (char !== "[" ){
     error = "Literal should start with [";
  }
  pos++;
  
  do {
    char = source.charAt(pos);

    
    if (char !== "]" ){
      pos++;
      returnValue.characters.push(char);
      isClassChar = true;
    } else {
      isClassChar = false;
    }
    
  } while(isClassChar && !checkErrors());
  
  if (char !== "]" ){
    error = "Literal should end with ]";
  }
  returnValue.end = pos;
  pos++;
  
  return returnValue;
};

var parseAny = function(){
  
  var returnValue = {
    "type":"Any",
    "pos":pos,
    "end":pos
  };
  
  pos++;
  return returnValue;
    
};
var parseZeroOrMore = function(value){
  var returnValue = {
    "type":"ZeroOrMore",
    "pos":pos,
    "end":pos,
    "expression":value
  };
  pos++;
  return returnValue;
};

var parseOneOrMore = function(value){
  var returnValue = {
    "type":"OneOrMore",
    "pos":pos,
    "end":pos,
    "expression":value
  };
  pos++;
  return returnValue;
};

var parseQuestion = function(value){
  var returnValue = {
    "type":"Question",
    "pos":pos,
    "end":pos,
    "expression":value
  };
  pos++;
  return returnValue;
};
  
var parseSimpleNot = function(){
  var returnValue = {
    "type":"SimpleNot",
    "pos":pos,
    "end":pos,
    "expression":undefined
  };
  pos++;
  returnValue.expression = parsesuffix();
  return returnValue;
};