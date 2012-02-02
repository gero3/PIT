

exports.generate = function(source,description,options){
  try{
    return require("./emitTypes/" + description.type + ".js").generate(source,description,options); 
  } catch (e){
   console.log( description.type);
  };
};