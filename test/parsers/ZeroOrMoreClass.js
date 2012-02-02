exports.parse = function(source){
var pos = 0; 
var length = source.length; 
 

 

var parse_start = function(parsed,errors){

var Local_0 = function(parsed,errors){

var Local_1= {
"65" : true,
"66" : true,
"67" : true }
if (Local_1[source.charCodeAt(pos)]){
  parsed.value = source.charAt(pos);
  pos = pos + 1;
  return true;
} else {
  return false
}

};
var test = [];
while(Local_0(parsed,errors)){
  test.push(parsed.value);
}
parsed.value = test
return true;

};
 
 
var parsed = parse_start({},{});
if (pos !== length){
console.log(pos);
return false;
}
return parsed;
};