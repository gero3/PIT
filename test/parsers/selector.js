function quote(s) {
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
}

var parse = function(source) {
  var pos = 0;
  var length = source.length;
  var parse_start = function(parsed, errors) {
    var Local_0;
    Local_0 = parse_query(parsed, errors);
    return Local_0;
  };
  var parse_query = function(parsed, errors) {
    var Local_1;
    var Local_2 = pos, Local_3;
    Local_1 = false;
    if (!Local_1) {
      var Local_5 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_6 = pos, Local_7;
      Local_3 = true;
      if (Local_3) {
        Local_7 = parse__(parsed, errors);
        Local_3 = Local_7;
      }
      if (Local_3) {
        Local_7 = parse_statement(parsed, errors);
        parsed.Actionvars["statement"] = parsed.value;
        Local_3 = Local_7;
      }
      if (Local_3) {
        Local_7 = parse__(parsed, errors);
        Local_3 = Local_7;
      }
      if (Local_3) {
        Local_7 = true;
        Local_7 = Local_7 && source.charCodeAt(pos) === 62;
        pos++;
        if (Local_7) {
          parsed.value = ">";
        } else {
          pos = pos - 1;
        }
        Local_3 = Local_7;
      }
      if (Local_3) {
        Local_7 = parse__(parsed, errors);
        Local_3 = Local_7;
      }
      if (Local_3) {
        Local_7 = parse_query(parsed, errors);
        parsed.Actionvars["query"] = parsed.value;
        Local_3 = Local_7;
      }
      if (!Local_3) {
        pos = Local_6;
      }
      if (Local_3) {
        parsed.value = function(statement, query) {
          statement.children = query;
          return statement;
        }(parsed.Actionvars["statement"], parsed.Actionvars["query"]);
      }
      parsed.Actionvars = Local_5;
      Local_1 = Local_3;
    }
    if (!Local_1) {
      var Local_11 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_12 = pos, Local_13;
      Local_3 = true;
      if (Local_3) {
        Local_13 = parse__(parsed, errors);
        Local_3 = Local_13;
      }
      if (Local_3) {
        Local_13 = parse_statement(parsed, errors);
        parsed.Actionvars["statement"] = parsed.value;
        Local_3 = Local_13;
      }
      if (Local_3) {
        Local_13 = parse__(parsed, errors);
        Local_3 = Local_13;
      }
      if (!Local_3) {
        pos = Local_12;
      }
      if (Local_3) {
        parsed.value = function(statement) {
          return statement;
        }(parsed.Actionvars["statement"]);
      }
      parsed.Actionvars = Local_11;
      Local_1 = Local_3;
    }
    if (!Local_1) {
      pos = Local_2;
    }
    return Local_1;
  };
  var parse_statement = function(parsed, errors) {
    var Local_15;
    var Local_16 = pos, Local_17;
    Local_15 = false;
    if (!Local_15) {
      var Local_18 = pos, Local_19;
      Local_17 = true;
      if (Local_17) {
        Local_19 = parse_identifier(parsed, errors);
        Local_17 = Local_19;
      }
      if (Local_17) {
        Local_19 = true;
        Local_19 = Local_19 && source.charCodeAt(pos) === 91;
        pos++;
        if (Local_19) {
          parsed.value = "[";
        } else {
          pos = pos - 1;
        }
        Local_17 = Local_19;
      }
      if (Local_17) {
        Local_19 = parse_props(parsed, errors);
        Local_17 = Local_19;
      }
      if (Local_17) {
        Local_19 = true;
        Local_19 = Local_19 && source.charCodeAt(pos) === 93;
        pos++;
        if (Local_19) {
          parsed.value = "]";
        } else {
          pos = pos - 1;
        }
        Local_17 = Local_19;
      }
      if (!Local_17) {
        pos = Local_18;
      }
      Local_15 = Local_17;
    }
    if (!Local_15) {
      Local_17 = parse_identifier(parsed, errors);
      Local_15 = Local_17;
    }
    if (!Local_15) {
      pos = Local_16;
    }
    return Local_15;
  };
  var parse_props = function(parsed, errors) {
    var Local_20;
    var Local_21 = pos, Local_22;
    Local_20 = false;
    if (!Local_20) {
      var Local_23 = pos, Local_24;
      Local_22 = true;
      if (Local_22) {
        Local_24 = parse__(parsed, errors);
        Local_22 = Local_24;
      }
      if (Local_22) {
        Local_24 = parse_prop(parsed, errors);
        Local_22 = Local_24;
      }
      if (Local_22) {
        Local_24 = parse__(parsed, errors);
        Local_22 = Local_24;
      }
      if (Local_22) {
        Local_24 = true;
        Local_24 = Local_24 && source.charCodeAt(pos) === 44;
        pos++;
        if (Local_24) {
          parsed.value = ",";
        } else {
          pos = pos - 1;
        }
        Local_22 = Local_24;
      }
      if (Local_22) {
        Local_24 = parse_props(parsed, errors);
        Local_22 = Local_24;
      }
      if (!Local_22) {
        pos = Local_23;
      }
      Local_20 = Local_22;
    }
    if (!Local_20) {
      var Local_25 = pos, Local_26;
      Local_22 = true;
      if (Local_22) {
        Local_26 = parse__(parsed, errors);
        Local_22 = Local_26;
      }
      if (Local_22) {
        Local_26 = parse_prop(parsed, errors);
        Local_22 = Local_26;
      }
      if (Local_22) {
        Local_26 = parse__(parsed, errors);
        Local_22 = Local_26;
      }
      if (!Local_22) {
        pos = Local_25;
      }
      Local_20 = Local_22;
    }
    if (!Local_20) {
      pos = Local_21;
    }
    return Local_20;
  };
  var parse_prop = function(parsed, errors) {
    var Local_27;
    var Local_28 = pos, Local_29;
    Local_27 = true;
    if (Local_27) {
      Local_29 = parse_identifier(parsed, errors);
      Local_27 = Local_29;
    }
    if (Local_27) {
      Local_29 = parse__(parsed, errors);
      Local_27 = Local_29;
    }
    if (Local_27) {
      Local_29 = true;
      Local_29 = Local_29 && source.charCodeAt(pos) === 61;
      pos++;
      if (Local_29) {
        parsed.value = "=";
      } else {
        pos = pos - 1;
      }
      Local_27 = Local_29;
    }
    if (Local_27) {
      Local_29 = parse__(parsed, errors);
      Local_27 = Local_29;
    }
    if (Local_27) {
      Local_29 = parse_value(parsed, errors);
      Local_27 = Local_29;
    }
    if (!Local_27) {
      pos = Local_28;
    }
    return Local_27;
  };
  var parse_value = function(parsed, errors) {
    var Local_30;
    var Local_31 = pos, Local_32;
    Local_30 = false;
    if (!Local_30) {
      Local_32 = true;
      Local_32 = Local_32 && source.charCodeAt(pos) === 116;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 114;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 117;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 101;
      pos++;
      if (Local_32) {
        parsed.value = "true";
      } else {
        pos = pos - 4;
      }
      Local_30 = Local_32;
    }
    if (!Local_30) {
      Local_32 = true;
      Local_32 = Local_32 && source.charCodeAt(pos) === 102;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 97;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 108;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 115;
      pos++;
      Local_32 = Local_32 && source.charCodeAt(pos) === 101;
      pos++;
      if (Local_32) {
        parsed.value = "false";
      } else {
        pos = pos - 5;
      }
      Local_30 = Local_32;
    }
    if (!Local_30) {
      Local_32 = parse_number(parsed, errors);
      Local_30 = Local_32;
    }
    if (!Local_30) {
      Local_32 = parse_string(parsed, errors);
      Local_30 = Local_32;
    }
    if (!Local_30) {
      pos = Local_31;
    }
    return Local_30;
  };
  var parse_identifier = function(parsed, errors) {
    var Local_33;
    var Local_34 = [];
    var Local_35 = {
      "97": true,
      "98": true,
      "99": true,
      "100": true,
      "101": true,
      "102": true,
      "103": true,
      "104": true,
      "105": true,
      "106": true,
      "107": true,
      "108": true,
      "109": true,
      "110": true,
      "111": true,
      "112": true,
      "113": true,
      "114": true,
      "115": true,
      "116": true,
      "117": true,
      "118": true,
      "119": true,
      "120": true,
      "121": true,
      "122": true,
      "65": true,
      "66": true,
      "67": true,
      "68": true,
      "69": true,
      "70": true,
      "71": true,
      "72": true,
      "73": true,
      "74": true,
      "75": true,
      "76": true,
      "77": true,
      "78": true,
      "79": true,
      "80": true,
      "81": true,
      "82": true,
      "83": true,
      "84": true,
      "85": true,
      "86": true,
      "87": true,
      "88": true,
      "89": true,
      "90": true,
      "95": true,
      "36": true
    };
    if (Local_35[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_33 = true;
    } else {
      Local_33 = false;
    }
    if (Local_33) {
      while (Local_33) {
        Local_34.push(parsed.value);
        var Local_35 = {
          "97": true,
          "98": true,
          "99": true,
          "100": true,
          "101": true,
          "102": true,
          "103": true,
          "104": true,
          "105": true,
          "106": true,
          "107": true,
          "108": true,
          "109": true,
          "110": true,
          "111": true,
          "112": true,
          "113": true,
          "114": true,
          "115": true,
          "116": true,
          "117": true,
          "118": true,
          "119": true,
          "120": true,
          "121": true,
          "122": true,
          "65": true,
          "66": true,
          "67": true,
          "68": true,
          "69": true,
          "70": true,
          "71": true,
          "72": true,
          "73": true,
          "74": true,
          "75": true,
          "76": true,
          "77": true,
          "78": true,
          "79": true,
          "80": true,
          "81": true,
          "82": true,
          "83": true,
          "84": true,
          "85": true,
          "86": true,
          "87": true,
          "88": true,
          "89": true,
          "90": true,
          "95": true,
          "36": true
        };
        if (Local_35[source.charCodeAt(pos)]) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_33 = true;
        } else {
          Local_33 = false;
        }
      }
      parsed.value = Local_34;
      Local_33 = true;
    }
    return Local_33;
  };
  var parse_number = function(parsed, errors) {
    var Local_36;
    var Local_37 = pos, Local_38;
    Local_36 = false;
    if (!Local_36) {
      var Local_39 = pos, Local_40;
      Local_38 = true;
      if (Local_38) {
        var Local_41 = {
          "49": true,
          "50": true,
          "51": true,
          "52": true,
          "53": true,
          "54": true,
          "55": true,
          "56": true,
          "57": true
        };
        if (Local_41[source.charCodeAt(pos)]) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_40 = true;
        } else {
          Local_40 = false;
        }
        Local_38 = Local_40;
      }
      if (Local_38) {
        var Local_42 = [];
        Local_40 = true;
        var Local_43 = {
          "48": true,
          "49": true,
          "50": true,
          "51": true,
          "52": true,
          "53": true,
          "54": true,
          "55": true,
          "56": true,
          "57": true
        };
        if (Local_43[source.charCodeAt(pos)]) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_40 = true;
        } else {
          Local_40 = false;
        }
        while (Local_40) {
          Local_42.push(parsed.value);
          var Local_43 = {
            "48": true,
            "49": true,
            "50": true,
            "51": true,
            "52": true,
            "53": true,
            "54": true,
            "55": true,
            "56": true,
            "57": true
          };
          if (Local_43[source.charCodeAt(pos)]) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            Local_40 = true;
          } else {
            Local_40 = false;
          }
        }
        parsed.value = Local_42;
        Local_40 = true;
        Local_38 = Local_40;
      }
      if (!Local_38) {
        pos = Local_39;
      }
      Local_36 = Local_38;
    }
    if (!Local_36) {
      var Local_44 = {
        "48": true
      };
      if (Local_44[source.charCodeAt(pos)]) {
        parsed.value = source.charAt(pos);
        pos = pos + 1;
        Local_38 = true;
      } else {
        Local_38 = false;
      }
      Local_36 = Local_38;
    }
    if (!Local_36) {
      pos = Local_37;
    }
    return Local_36;
  };
  var parse_string = function(parsed, errors) {
    var Local_45;
    var Local_46 = pos, Local_47;
    Local_45 = true;
    if (Local_45) {
      Local_47 = true;
      Local_47 = Local_47 && source.charCodeAt(pos) === 34;
      pos++;
      if (Local_47) {
        parsed.value = '"';
      } else {
        pos = pos - 1;
      }
      Local_45 = Local_47;
    }
    if (Local_45) {
      var Local_48 = [];
      Local_47 = true;
      var Local_49 = pos, Local_50;
      Local_47 = true;
      if (Local_47) {
        var Local_52 = pos;
        Local_50 = true;
        Local_50 = Local_50 && source.charCodeAt(pos) === 34;
        pos++;
        if (Local_50) {
          parsed.value = '"';
        } else {
          pos = pos - 1;
        }
        pos = Local_52;
        Local_50 = !Local_50;
        Local_47 = Local_50;
      }
      if (Local_47) {
        if (pos < source.length) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_50 = true;
        } else {
          Local_50 = false;
        }
        parsed.Actionvars["char"] = parsed.value;
        Local_47 = Local_50;
      }
      if (!Local_47) {
        pos = Local_49;
      }
      while (Local_47) {
        Local_48.push(parsed.value);
        var Local_49 = pos, Local_50;
        Local_47 = true;
        if (Local_47) {
          var Local_52 = pos;
          Local_50 = true;
          Local_50 = Local_50 && source.charCodeAt(pos) === 34;
          pos++;
          if (Local_50) {
            parsed.value = '"';
          } else {
            pos = pos - 1;
          }
          pos = Local_52;
          Local_50 = !Local_50;
          Local_47 = Local_50;
        }
        if (Local_47) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            Local_50 = true;
          } else {
            Local_50 = false;
          }
          parsed.Actionvars["char"] = parsed.value;
          Local_47 = Local_50;
        }
        if (!Local_47) {
          pos = Local_49;
        }
      }
      parsed.value = Local_48;
      Local_47 = true;
      Local_45 = Local_47;
    }
    if (Local_45) {
      Local_47 = true;
      Local_47 = Local_47 && source.charCodeAt(pos) === 34;
      pos++;
      if (Local_47) {
        parsed.value = '"';
      } else {
        pos = pos - 1;
      }
      Local_45 = Local_47;
    }
    if (!Local_45) {
      pos = Local_46;
    }
    return Local_45;
  };
  var parse__ = function(parsed, errors) {
    var Local_54;
    var Local_55 = [];
    Local_54 = true;
    Local_54 = true;
    Local_54 = Local_54 && source.charCodeAt(pos) === 32;
    pos++;
    if (Local_54) {
      parsed.value = " ";
    } else {
      pos = pos - 1;
    }
    while (Local_54) {
      Local_55.push(parsed.value);
      Local_54 = true;
      Local_54 = Local_54 && source.charCodeAt(pos) === 32;
      pos++;
      if (Local_54) {
        parsed.value = " ";
      } else {
        pos = pos - 1;
      }
    }
    parsed.value = Local_55;
    Local_54 = true;
    return Local_54;
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