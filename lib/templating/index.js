
var template = function(src,options){
  
  var joinedSrc;
  
  if(Array.isArray(src)){
    joinedSrc = src.join("\n");
  }
  
  this.source = joinedSrc || src;
  this.parts = [];
  this.names = {};
  
  this.updateSource(this.source);
  
  
};

template.prototype.updateSource = function(src){
  this.parts = [];
  this.names = {};
  var nextPartBegin = 0;
  var start = 0;
  var position= src.indexOf("#",start);
  while(position >= nextPartBegin){ 
    if( src.charAt(position+1)=== "{"){
      var end = src.indexOf("}",position);
      if (end > -1){
        this.parts.push(src.substring(nextPartBegin,position));
        this.parts.push("");
        
        this.names[this.parts.length - 1] = src.substring(position + 2, end);
        nextPartBegin = end + 1;
      }
    }
    start = position +1;
    position= src.indexOf("#",start);
  }
  this.parts.push(src.substring(nextPartBegin));
};

template.prototype.generate = function(options){
  var i;
  for (i in this.names){
    this.parts[i] = options[this.names[i]] || "";
  }
  
  return this.parts.join("");
  
};





















exports.template = function(src,options){
  return new template(src,options);
};