function quote(s) {
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
}

var parse = function(source) {
  var pos = 0;
  var length = source.length;
  var parse_start = function(parsed, errors) {
    var Local_0;
    if (pos < source.length) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_0 = true;
    } else {
      Local_0 = false;
    }
    return Local_0;
  };
  var test = {};
  var parsed = parse_start(test, {});
  if (pos !== length) {
    console.log(test);
    console.log(pos);
    return false;
  }
  return parsed;
};

exports.parse = parse;