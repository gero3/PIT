var fs = require("fs");

fs.stat("test/output/javascript.json",function(err,stats){
  console.log(err,stats);
})