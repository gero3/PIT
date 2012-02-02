exports.parse = function(source){
var pos = 0; 
var length = source.length; 
 

 

var parse_start = function(parsed,errors){

  return parse_grammar(parsed,errors);
};



var parse_grammar = function(parsed,errors){

var Local_0 = function(parsed,errors){

var Local_1= {
"97" : true,
"98" : true }
if (Local_1[source.charCodeAt(pos)]){
  pos = pos + 1;
  return true;
} else {
  return false
}

};
if (!Local_0(parsed,errors)){ return false;}
while(Local_0(parsed,errors)){}
return true;

};
 
 
var parsed = parse_start();
if (pos !== length){
console.log(pos);
return false;
}
return parsed;
};