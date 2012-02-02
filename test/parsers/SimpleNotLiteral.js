exports.parse = function(source){
var pos = 0; 
var length = source.length; 
 

 

var parse_start = function(parsed,errors){

var Local_0 = function(parsed,errors){

var Local_1 = (source.charCodeAt(pos) === 65);
if( !Local_1) {
pos = pos - 0;
return false;
}

pos = pos + 1;
var Local_2 = (source.charCodeAt(pos) === 66);
if( !Local_2) {
pos = pos - 1;
return false;
}

pos = pos + 1;
var Local_3 = (source.charCodeAt(pos) === 67);
if( !Local_3) {
pos = pos - 2;
return false;
}

pos = pos + 1;

parsed.value = "ABC";
return true;

};
return !Local_0(parsed,errors)

};
 
 
var parsed = parse_start({},{});
if (pos !== length){
console.log(pos);
return false;
}
return parsed;
};