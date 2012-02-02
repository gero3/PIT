function quote(s) {
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
}

var parse = function(source) {
  var pos = 0;
  var length = source.length;
  var parse_start = function(parsed, errors) {
    var Local_0;
    var Local_1 = pos, Local_2;
    Local_0 = true;
    if (Local_0) {
      Local_2 = true;
      Local_2 = Local_2 && source.charCodeAt(pos) === 65;
      pos++;
      Local_2 = Local_2 && source.charCodeAt(pos) === 66;
      pos++;
      Local_2 = Local_2 && source.charCodeAt(pos) === 67;
      pos++;
      if (Local_2) {
        parsed.value = "ABC";
      } else {
        pos = pos - 3;
      }
      Local_0 = Local_2;
    }
    if (Local_0) {
      Local_2 = true;
      Local_2 = Local_2 && source.charCodeAt(pos) === 116;
      pos++;
      Local_2 = Local_2 && source.charCodeAt(pos) === 101;
      pos++;
      Local_2 = Local_2 && source.charCodeAt(pos) === 115;
      pos++;
      Local_2 = Local_2 && source.charCodeAt(pos) === 116;
      pos++;
      if (Local_2) {
        parsed.value = "test";
      } else {
        pos = pos - 4;
      }
      Local_0 = Local_2;
    }
    if (!Local_0) {
      pos = Local_1;
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