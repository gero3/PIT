function quote(s) {
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
}

var parse = function(source) {
  var pos = 0;
  var length = source.length;
  var parse_start = function(parsed, errors) {
    var Local_0;
    Local_0 = parse_grammar(parsed, errors);
    return Local_0;
  };
  var parse_grammar = function(parsed, errors) {
    var Local_1;
    var Local_3 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_4 = pos, Local_5;
    Local_1 = true;
    if (Local_1) {
      Local_5 = parse___(parsed, errors);
      Local_1 = Local_5;
    }
    if (Local_1) {
      var Local_7 = [];
      Local_5 = parse_rule(parsed, errors);
      if (Local_5) {
        while (Local_5) {
          Local_7.push(parsed.value);
          Local_5 = parse_rule(parsed, errors);
        }
        parsed.value = Local_7;
        Local_5 = true;
      }
      parsed.Actionvars["rules"] = parsed.value;
      Local_1 = Local_5;
    }
    if (!Local_1) {
      pos = Local_4;
    }
    if (Local_1) {
      parsed.value = function(rules) {
        return {
          type: "grammar",
          rules: rules
        };
      }(parsed.Actionvars["rules"]);
    }
    parsed.Actionvars = Local_3;
    return Local_1;
  };
  var parse_rule = function(parsed, errors) {
    var Local_8;
    var Local_10 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_11 = pos, Local_12;
    Local_8 = true;
    if (Local_8) {
      Local_12 = parse_identifier(parsed, errors);
      parsed.Actionvars["name"] = parsed.value;
      Local_8 = Local_12;
    }
    if (Local_8) {
      Local_12 = parse_equals(parsed, errors);
      Local_8 = Local_12;
    }
    if (Local_8) {
      Local_12 = parse_choice(parsed, errors);
      parsed.Actionvars["expression"] = parsed.value;
      Local_8 = Local_12;
    }
    if (Local_8) {
      Local_12 = parse_semicolon(parsed, errors);
      if (!Local_12) {
        parsed.value = "";
      }
      Local_12 = true;
      Local_8 = Local_12;
    }
    if (!Local_8) {
      pos = Local_11;
    }
    if (Local_8) {
      parsed.value = function(name, expression) {
        return {
          type: "rule",
          identifier: name,
          description: expression
        };
      }(parsed.Actionvars["name"], parsed.Actionvars["expression"]);
    }
    parsed.Actionvars = Local_10;
    return Local_8;
  };
  var parse_expression = function(parsed, errors) {
    var Local_16;
    Local_16 = parse_choice(parsed, errors);
    return Local_16;
  };
  var parse_choice = function(parsed, errors) {
    var Local_17;
    var Local_19 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_20 = pos, Local_21;
    Local_17 = true;
    if (Local_17) {
      Local_21 = parse_sequence(parsed, errors);
      parsed.Actionvars["head"] = parsed.value;
      Local_17 = Local_21;
    }
    if (Local_17) {
      var Local_24 = [];
      Local_21 = true;
      var Local_25 = pos, Local_26;
      Local_21 = true;
      if (Local_21) {
        Local_26 = parse_slash(parsed, errors);
        Local_21 = Local_26;
      }
      if (Local_21) {
        Local_26 = parse_sequence(parsed, errors);
        Local_21 = Local_26;
      }
      if (!Local_21) {
        pos = Local_25;
      }
      while (Local_21) {
        Local_24.push(parsed.value);
        var Local_25 = pos, Local_26;
        Local_21 = true;
        if (Local_21) {
          Local_26 = parse_slash(parsed, errors);
          Local_21 = Local_26;
        }
        if (Local_21) {
          Local_26 = parse_sequence(parsed, errors);
          Local_21 = Local_26;
        }
        if (!Local_21) {
          pos = Local_25;
        }
      }
      parsed.value = Local_24;
      Local_21 = true;
      parsed.Actionvars["tail"] = parsed.value;
      Local_17 = Local_21;
    }
    if (!Local_17) {
      pos = Local_20;
    }
    if (Local_17) {
      parsed.value = function(head, tail) {
        if (tail.length > 0) {
          var alternatives = [ head ].concat(tail.map(function(element) {
            return element[1];
          }));
          return {
            type: "Choice",
            expressions: alternatives
          };
        } else {
          return head;
        }
      }(parsed.Actionvars["head"], parsed.Actionvars["tail"]);
    }
    parsed.Actionvars = Local_19;
    return Local_17;
  };
  var parse_sequence = function(parsed, errors) {
    var Local_27;
    var Local_28 = pos, Local_29;
    Local_27 = false;
    if (!Local_27) {
      var Local_31 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_32 = pos, Local_33;
      Local_29 = true;
      if (Local_29) {
        var Local_35 = [];
        Local_33 = true;
        Local_33 = parse_labeled(parsed, errors);
        while (Local_33) {
          Local_35.push(parsed.value);
          Local_33 = parse_labeled(parsed, errors);
        }
        parsed.value = Local_35;
        Local_33 = true;
        parsed.Actionvars["elements"] = parsed.value;
        Local_29 = Local_33;
      }
      if (Local_29) {
        Local_33 = parse_action(parsed, errors);
        parsed.Actionvars["code"] = parsed.value;
        Local_29 = Local_33;
      }
      if (!Local_29) {
        pos = Local_32;
      }
      if (Local_29) {
        parsed.value = function(elements, code) {
          var expression = elements.length !== 1 ? {
            type: "Sequence",
            expressions: elements
          } : elements[0];
          return {
            type: "action",
            expression: expression,
            code: code
          };
        }(parsed.Actionvars["elements"], parsed.Actionvars["code"]);
      }
      parsed.Actionvars = Local_31;
      Local_27 = Local_29;
    }
    if (!Local_27) {
      var Local_38 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_40 = [];
      Local_29 = true;
      Local_29 = parse_labeled(parsed, errors);
      while (Local_29) {
        Local_40.push(parsed.value);
        Local_29 = parse_labeled(parsed, errors);
      }
      parsed.value = Local_40;
      Local_29 = true;
      parsed.Actionvars["elements"] = parsed.value;
      if (Local_29) {
        parsed.value = function(elements) {
          return elements.length !== 1 ? {
            type: "Sequence",
            expressions: elements
          } : elements[0];
        }(parsed.Actionvars["elements"]);
      }
      parsed.Actionvars = Local_38;
      Local_27 = Local_29;
    }
    if (!Local_27) {
      pos = Local_28;
    }
    return Local_27;
  };
  var parse_labeled = function(parsed, errors) {
    var Local_41;
    var Local_42 = pos, Local_43;
    Local_41 = false;
    if (!Local_41) {
      var Local_45 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_46 = pos, Local_47;
      Local_43 = true;
      if (Local_43) {
        Local_47 = parse_identifier(parsed, errors);
        parsed.Actionvars["label"] = parsed.value;
        Local_43 = Local_47;
      }
      if (Local_43) {
        Local_47 = parse_colon(parsed, errors);
        Local_43 = Local_47;
      }
      if (Local_43) {
        Local_47 = parse_prefixed(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_43 = Local_47;
      }
      if (!Local_43) {
        pos = Local_46;
      }
      if (Local_43) {
        parsed.value = function(label, expression) {
          return {
            type: "labeled",
            label: label,
            expression: expression
          };
        }(parsed.Actionvars["label"], parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_45;
      Local_41 = Local_43;
    }
    if (!Local_41) {
      Local_43 = parse_prefixed(parsed, errors);
      Local_41 = Local_43;
    }
    if (!Local_41) {
      pos = Local_42;
    }
    return Local_41;
  };
  var parse_prefixed = function(parsed, errors) {
    var Local_50;
    var Local_51 = pos, Local_52;
    Local_50 = false;
    if (!Local_50) {
      var Local_54 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_55 = pos, Local_56;
      Local_52 = true;
      if (Local_52) {
        Local_56 = parse_and(parsed, errors);
        Local_52 = Local_56;
      }
      if (Local_52) {
        Local_56 = parse_suffixed(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_52 = Local_56;
      }
      if (!Local_52) {
        pos = Local_55;
      }
      if (Local_52) {
        parsed.value = function(expression) {
          return {
            type: "SimpleAnd",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_54;
      Local_50 = Local_52;
    }
    if (!Local_50) {
      var Local_59 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_60 = pos, Local_61;
      Local_52 = true;
      if (Local_52) {
        Local_61 = parse_not(parsed, errors);
        Local_52 = Local_61;
      }
      if (Local_52) {
        Local_61 = parse_suffixed(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_52 = Local_61;
      }
      if (!Local_52) {
        pos = Local_60;
      }
      if (Local_52) {
        parsed.value = function(expression) {
          return {
            type: "SimpleNot",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_59;
      Local_50 = Local_52;
    }
    if (!Local_50) {
      Local_52 = parse_suffixed(parsed, errors);
      Local_50 = Local_52;
    }
    if (!Local_50) {
      pos = Local_51;
    }
    return Local_50;
  };
  var parse_suffixed = function(parsed, errors) {
    var Local_63;
    var Local_64 = pos, Local_65;
    Local_63 = false;
    if (!Local_63) {
      var Local_67 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_68 = pos, Local_69;
      Local_65 = true;
      if (Local_65) {
        Local_69 = parse_primary(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_65 = Local_69;
      }
      if (Local_65) {
        Local_69 = parse_question(parsed, errors);
        Local_65 = Local_69;
      }
      if (!Local_65) {
        pos = Local_68;
      }
      if (Local_65) {
        parsed.value = function(expression) {
          return {
            type: "Question",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_67;
      Local_63 = Local_65;
    }
    if (!Local_63) {
      var Local_72 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_73 = pos, Local_74;
      Local_65 = true;
      if (Local_65) {
        Local_74 = parse_primary(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_65 = Local_74;
      }
      if (Local_65) {
        Local_74 = parse_star(parsed, errors);
        Local_65 = Local_74;
      }
      if (!Local_65) {
        pos = Local_73;
      }
      if (Local_65) {
        parsed.value = function(expression) {
          return {
            type: "ZeroOrMore",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_72;
      Local_63 = Local_65;
    }
    if (!Local_63) {
      var Local_77 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_78 = pos, Local_79;
      Local_65 = true;
      if (Local_65) {
        Local_79 = parse_primary(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_65 = Local_79;
      }
      if (Local_65) {
        Local_79 = parse_plus(parsed, errors);
        Local_65 = Local_79;
      }
      if (!Local_65) {
        pos = Local_78;
      }
      if (Local_65) {
        parsed.value = function(expression) {
          return {
            type: "OneOrMore",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_77;
      Local_63 = Local_65;
    }
    if (!Local_63) {
      Local_65 = parse_primary(parsed, errors);
      Local_63 = Local_65;
    }
    if (!Local_63) {
      pos = Local_64;
    }
    return Local_63;
  };
  var parse_primary = function(parsed, errors) {
    var Local_81;
    var Local_82 = pos, Local_83;
    Local_81 = false;
    if (!Local_81) {
      var Local_85 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_86 = pos, Local_87;
      Local_83 = true;
      if (Local_83) {
        Local_87 = parse_identifier(parsed, errors);
        parsed.Actionvars["identifier"] = parsed.value;
        Local_83 = Local_87;
      }
      if (Local_83) {
        var Local_90 = pos;
        var Local_91 = pos, Local_92;
        Local_87 = true;
        if (Local_87) {
          Local_92 = parse_string(parsed, errors);
          if (!Local_92) {
            parsed.value = "";
          }
          Local_92 = true;
          Local_87 = Local_92;
        }
        if (Local_87) {
          Local_92 = parse_equals(parsed, errors);
          Local_87 = Local_92;
        }
        if (!Local_87) {
          pos = Local_91;
        }
        pos = Local_90;
        Local_87 = !Local_87;
        Local_83 = Local_87;
      }
      if (!Local_83) {
        pos = Local_86;
      }
      if (Local_83) {
        parsed.value = function(identifier) {
          return {
            type: "rule_ref",
            identifier: identifier
          };
        }(parsed.Actionvars["identifier"]);
      }
      parsed.Actionvars = Local_85;
      Local_81 = Local_83;
    }
    if (!Local_81) {
      Local_83 = parse_literal(parsed, errors);
      Local_81 = Local_83;
    }
    if (!Local_81) {
      var Local_95 = parsed.Actionvars;
      parsed.Actionvars = {};
      Local_83 = parse_dot(parsed, errors);
      if (Local_83) {
        parsed.value = function() {
          return {
            type: "Any"
          };
        }(parsed.Actionvars[""]);
      }
      parsed.Actionvars = Local_95;
      Local_81 = Local_83;
    }
    if (!Local_81) {
      Local_83 = parse_class(parsed, errors);
      Local_81 = Local_83;
    }
    if (!Local_81) {
      var Local_97 = parsed.Actionvars;
      parsed.Actionvars = {};
      var Local_98 = pos, Local_99;
      Local_83 = true;
      if (Local_83) {
        Local_99 = parse_lparen(parsed, errors);
        Local_83 = Local_99;
      }
      if (Local_83) {
        Local_99 = parse_choice(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        Local_83 = Local_99;
      }
      if (Local_83) {
        Local_99 = parse_rparen(parsed, errors);
        Local_83 = Local_99;
      }
      if (!Local_83) {
        pos = Local_98;
      }
      if (Local_83) {
        parsed.value = function(expression) {
          return expression;
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_97;
      Local_81 = Local_83;
    }
    if (!Local_81) {
      pos = Local_82;
    }
    return Local_81;
  };
  var parse_action = function(parsed, errors) {
    var Local_101;
    var Local_103 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_104 = pos, Local_105;
    Local_101 = true;
    if (Local_101) {
      Local_105 = parse_braced(parsed, errors);
      parsed.Actionvars["braced"] = parsed.value;
      Local_101 = Local_105;
    }
    if (Local_101) {
      Local_105 = parse___(parsed, errors);
      Local_101 = Local_105;
    }
    if (!Local_101) {
      pos = Local_104;
    }
    if (Local_101) {
      parsed.value = function(braced) {
        return braced.substr(1, braced.length - 2);
      }(parsed.Actionvars["braced"]);
    }
    parsed.Actionvars = Local_103;
    return Local_101;
  };
  var parse_braced = function(parsed, errors) {
    var Local_107;
    var Local_109 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_110 = pos, Local_111;
    Local_107 = true;
    if (Local_107) {
      Local_111 = true;
      Local_111 = Local_111 && source.charCodeAt(pos) === 123;
      pos++;
      if (Local_111) {
        parsed.value = "{";
      } else {
        pos = pos - 1;
      }
      Local_107 = Local_111;
    }
    if (Local_107) {
      var Local_113 = [];
      Local_111 = true;
      var Local_114 = pos, Local_115;
      Local_111 = false;
      if (!Local_111) {
        Local_115 = parse_braced(parsed, errors);
        Local_111 = Local_115;
      }
      if (!Local_111) {
        Local_115 = parse_nonBraceCharacter(parsed, errors);
        Local_111 = Local_115;
      }
      if (!Local_111) {
        pos = Local_114;
      }
      while (Local_111) {
        Local_113.push(parsed.value);
        var Local_114 = pos, Local_115;
        Local_111 = false;
        if (!Local_111) {
          Local_115 = parse_braced(parsed, errors);
          Local_111 = Local_115;
        }
        if (!Local_111) {
          Local_115 = parse_nonBraceCharacter(parsed, errors);
          Local_111 = Local_115;
        }
        if (!Local_111) {
          pos = Local_114;
        }
      }
      parsed.value = Local_113;
      Local_111 = true;
      parsed.Actionvars["parts"] = parsed.value;
      Local_107 = Local_111;
    }
    if (Local_107) {
      Local_111 = true;
      Local_111 = Local_111 && source.charCodeAt(pos) === 125;
      pos++;
      if (Local_111) {
        parsed.value = "}";
      } else {
        pos = pos - 1;
      }
      Local_107 = Local_111;
    }
    if (!Local_107) {
      pos = Local_110;
    }
    if (Local_107) {
      parsed.value = function(parts) {
        return "{" + parts.join("") + "}";
      }(parsed.Actionvars["parts"]);
    }
    parsed.Actionvars = Local_109;
    return Local_107;
  };
  var parse_nonBraceCharacters = function(parsed, errors) {
    var Local_116;
    var Local_118 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_120 = [];
    Local_116 = parse_nonBraceCharacter(parsed, errors);
    if (Local_116) {
      while (Local_116) {
        Local_120.push(parsed.value);
        Local_116 = parse_nonBraceCharacter(parsed, errors);
      }
      parsed.value = Local_120;
      Local_116 = true;
    }
    parsed.Actionvars["chars"] = parsed.value;
    if (Local_116) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_118;
    return Local_116;
  };
  var parse_nonBraceCharacter = function(parsed, errors) {
    var Local_121;
    var Local_122 = {
      "123": true,
      "125": true
    };
    if (!Local_122[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_121 = true;
    } else {
      Local_121 = false;
    }
    return Local_121;
  };
  var parse_equals = function(parsed, errors) {
    var Local_123;
    var Local_125 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_126 = pos, Local_127;
    Local_123 = true;
    if (Local_123) {
      Local_127 = true;
      Local_127 = Local_127 && source.charCodeAt(pos) === 61;
      pos++;
      if (Local_127) {
        parsed.value = "=";
      } else {
        pos = pos - 1;
      }
      Local_123 = Local_127;
    }
    if (Local_123) {
      Local_127 = parse___(parsed, errors);
      Local_123 = Local_127;
    }
    if (!Local_123) {
      pos = Local_126;
    }
    if (Local_123) {
      parsed.value = function() {
        return "=";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_125;
    return Local_123;
  };
  var parse_colon = function(parsed, errors) {
    var Local_128;
    var Local_130 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_131 = pos, Local_132;
    Local_128 = true;
    if (Local_128) {
      Local_132 = true;
      Local_132 = Local_132 && source.charCodeAt(pos) === 58;
      pos++;
      if (Local_132) {
        parsed.value = ":";
      } else {
        pos = pos - 1;
      }
      Local_128 = Local_132;
    }
    if (Local_128) {
      Local_132 = parse___(parsed, errors);
      Local_128 = Local_132;
    }
    if (!Local_128) {
      pos = Local_131;
    }
    if (Local_128) {
      parsed.value = function() {
        return ":";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_130;
    return Local_128;
  };
  var parse_semicolon = function(parsed, errors) {
    var Local_133;
    var Local_135 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_136 = pos, Local_137;
    Local_133 = true;
    if (Local_133) {
      Local_137 = true;
      Local_137 = Local_137 && source.charCodeAt(pos) === 59;
      pos++;
      if (Local_137) {
        parsed.value = ";";
      } else {
        pos = pos - 1;
      }
      Local_133 = Local_137;
    }
    if (Local_133) {
      Local_137 = parse___(parsed, errors);
      Local_133 = Local_137;
    }
    if (!Local_133) {
      pos = Local_136;
    }
    if (Local_133) {
      parsed.value = function() {
        return ";";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_135;
    return Local_133;
  };
  var parse_slash = function(parsed, errors) {
    var Local_138;
    var Local_140 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_141 = pos, Local_142;
    Local_138 = true;
    if (Local_138) {
      Local_142 = true;
      Local_142 = Local_142 && source.charCodeAt(pos) === 47;
      pos++;
      if (Local_142) {
        parsed.value = "/";
      } else {
        pos = pos - 1;
      }
      Local_138 = Local_142;
    }
    if (Local_138) {
      Local_142 = parse___(parsed, errors);
      Local_138 = Local_142;
    }
    if (!Local_138) {
      pos = Local_141;
    }
    if (Local_138) {
      parsed.value = function() {
        return "/";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_140;
    return Local_138;
  };
  var parse_and = function(parsed, errors) {
    var Local_143;
    var Local_145 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_146 = pos, Local_147;
    Local_143 = true;
    if (Local_143) {
      Local_147 = true;
      Local_147 = Local_147 && source.charCodeAt(pos) === 38;
      pos++;
      if (Local_147) {
        parsed.value = "&";
      } else {
        pos = pos - 1;
      }
      Local_143 = Local_147;
    }
    if (Local_143) {
      Local_147 = parse___(parsed, errors);
      Local_143 = Local_147;
    }
    if (!Local_143) {
      pos = Local_146;
    }
    if (Local_143) {
      parsed.value = function() {
        return "&";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_145;
    return Local_143;
  };
  var parse_not = function(parsed, errors) {
    var Local_148;
    var Local_150 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_151 = pos, Local_152;
    Local_148 = true;
    if (Local_148) {
      Local_152 = true;
      Local_152 = Local_152 && source.charCodeAt(pos) === 33;
      pos++;
      if (Local_152) {
        parsed.value = "!";
      } else {
        pos = pos - 1;
      }
      Local_148 = Local_152;
    }
    if (Local_148) {
      Local_152 = parse___(parsed, errors);
      Local_148 = Local_152;
    }
    if (!Local_148) {
      pos = Local_151;
    }
    if (Local_148) {
      parsed.value = function() {
        return "!";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_150;
    return Local_148;
  };
  var parse_question = function(parsed, errors) {
    var Local_153;
    var Local_155 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_156 = pos, Local_157;
    Local_153 = true;
    if (Local_153) {
      Local_157 = true;
      Local_157 = Local_157 && source.charCodeAt(pos) === 63;
      pos++;
      if (Local_157) {
        parsed.value = "?";
      } else {
        pos = pos - 1;
      }
      Local_153 = Local_157;
    }
    if (Local_153) {
      Local_157 = parse___(parsed, errors);
      Local_153 = Local_157;
    }
    if (!Local_153) {
      pos = Local_156;
    }
    if (Local_153) {
      parsed.value = function() {
        return "?";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_155;
    return Local_153;
  };
  var parse_star = function(parsed, errors) {
    var Local_158;
    var Local_160 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_161 = pos, Local_162;
    Local_158 = true;
    if (Local_158) {
      Local_162 = true;
      Local_162 = Local_162 && source.charCodeAt(pos) === 42;
      pos++;
      if (Local_162) {
        parsed.value = "*";
      } else {
        pos = pos - 1;
      }
      Local_158 = Local_162;
    }
    if (Local_158) {
      Local_162 = parse___(parsed, errors);
      Local_158 = Local_162;
    }
    if (!Local_158) {
      pos = Local_161;
    }
    if (Local_158) {
      parsed.value = function() {
        return "*";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_160;
    return Local_158;
  };
  var parse_plus = function(parsed, errors) {
    var Local_163;
    var Local_165 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_166 = pos, Local_167;
    Local_163 = true;
    if (Local_163) {
      Local_167 = true;
      Local_167 = Local_167 && source.charCodeAt(pos) === 43;
      pos++;
      if (Local_167) {
        parsed.value = "+";
      } else {
        pos = pos - 1;
      }
      Local_163 = Local_167;
    }
    if (Local_163) {
      Local_167 = parse___(parsed, errors);
      Local_163 = Local_167;
    }
    if (!Local_163) {
      pos = Local_166;
    }
    if (Local_163) {
      parsed.value = function() {
        return "+";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_165;
    return Local_163;
  };
  var parse_lparen = function(parsed, errors) {
    var Local_168;
    var Local_170 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_171 = pos, Local_172;
    Local_168 = true;
    if (Local_168) {
      Local_172 = true;
      Local_172 = Local_172 && source.charCodeAt(pos) === 40;
      pos++;
      if (Local_172) {
        parsed.value = "(";
      } else {
        pos = pos - 1;
      }
      Local_168 = Local_172;
    }
    if (Local_168) {
      Local_172 = parse___(parsed, errors);
      Local_168 = Local_172;
    }
    if (!Local_168) {
      pos = Local_171;
    }
    if (Local_168) {
      parsed.value = function() {
        return "(";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_170;
    return Local_168;
  };
  var parse_rparen = function(parsed, errors) {
    var Local_173;
    var Local_175 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_176 = pos, Local_177;
    Local_173 = true;
    if (Local_173) {
      Local_177 = true;
      Local_177 = Local_177 && source.charCodeAt(pos) === 41;
      pos++;
      if (Local_177) {
        parsed.value = ")";
      } else {
        pos = pos - 1;
      }
      Local_173 = Local_177;
    }
    if (Local_173) {
      Local_177 = parse___(parsed, errors);
      Local_173 = Local_177;
    }
    if (!Local_173) {
      pos = Local_176;
    }
    if (Local_173) {
      parsed.value = function() {
        return ")";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_175;
    return Local_173;
  };
  var parse_dot = function(parsed, errors) {
    var Local_178;
    var Local_180 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_181 = pos, Local_182;
    Local_178 = true;
    if (Local_178) {
      Local_182 = true;
      Local_182 = Local_182 && source.charCodeAt(pos) === 46;
      pos++;
      if (Local_182) {
        parsed.value = ".";
      } else {
        pos = pos - 1;
      }
      Local_178 = Local_182;
    }
    if (Local_178) {
      Local_182 = parse___(parsed, errors);
      Local_178 = Local_182;
    }
    if (!Local_178) {
      pos = Local_181;
    }
    if (Local_178) {
      parsed.value = function() {
        return ".";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_180;
    return Local_178;
  };
  var parse_identifier = function(parsed, errors) {
    var Local_183;
    var Local_185 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_186 = pos, Local_187;
    Local_183 = true;
    if (Local_183) {
      var Local_189 = pos, Local_190;
      Local_187 = false;
      if (!Local_187) {
        Local_190 = parse_letter(parsed, errors);
        Local_187 = Local_190;
      }
      if (!Local_187) {
        Local_190 = true;
        Local_190 = Local_190 && source.charCodeAt(pos) === 95;
        pos++;
        if (Local_190) {
          parsed.value = "_";
        } else {
          pos = pos - 1;
        }
        Local_187 = Local_190;
      }
      if (!Local_187) {
        Local_190 = true;
        Local_190 = Local_190 && source.charCodeAt(pos) === 36;
        pos++;
        if (Local_190) {
          parsed.value = "$";
        } else {
          pos = pos - 1;
        }
        Local_187 = Local_190;
      }
      if (!Local_187) {
        pos = Local_189;
      }
      parsed.Actionvars["head"] = parsed.value;
      Local_183 = Local_187;
    }
    if (Local_183) {
      var Local_192 = [];
      Local_187 = true;
      var Local_193 = pos, Local_194;
      Local_187 = false;
      if (!Local_187) {
        Local_194 = parse_letter(parsed, errors);
        Local_187 = Local_194;
      }
      if (!Local_187) {
        Local_194 = parse_digit(parsed, errors);
        Local_187 = Local_194;
      }
      if (!Local_187) {
        Local_194 = true;
        Local_194 = Local_194 && source.charCodeAt(pos) === 95;
        pos++;
        if (Local_194) {
          parsed.value = "_";
        } else {
          pos = pos - 1;
        }
        Local_187 = Local_194;
      }
      if (!Local_187) {
        Local_194 = true;
        Local_194 = Local_194 && source.charCodeAt(pos) === 36;
        pos++;
        if (Local_194) {
          parsed.value = "$";
        } else {
          pos = pos - 1;
        }
        Local_187 = Local_194;
      }
      if (!Local_187) {
        pos = Local_193;
      }
      while (Local_187) {
        Local_192.push(parsed.value);
        var Local_193 = pos, Local_194;
        Local_187 = false;
        if (!Local_187) {
          Local_194 = parse_letter(parsed, errors);
          Local_187 = Local_194;
        }
        if (!Local_187) {
          Local_194 = parse_digit(parsed, errors);
          Local_187 = Local_194;
        }
        if (!Local_187) {
          Local_194 = true;
          Local_194 = Local_194 && source.charCodeAt(pos) === 95;
          pos++;
          if (Local_194) {
            parsed.value = "_";
          } else {
            pos = pos - 1;
          }
          Local_187 = Local_194;
        }
        if (!Local_187) {
          Local_194 = true;
          Local_194 = Local_194 && source.charCodeAt(pos) === 36;
          pos++;
          if (Local_194) {
            parsed.value = "$";
          } else {
            pos = pos - 1;
          }
          Local_187 = Local_194;
        }
        if (!Local_187) {
          pos = Local_193;
        }
      }
      parsed.value = Local_192;
      Local_187 = true;
      parsed.Actionvars["tail"] = parsed.value;
      Local_183 = Local_187;
    }
    if (Local_183) {
      Local_187 = parse___(parsed, errors);
      Local_183 = Local_187;
    }
    if (!Local_183) {
      pos = Local_186;
    }
    if (Local_183) {
      parsed.value = function(head, tail) {
        return head + tail.join("");
      }(parsed.Actionvars["head"], parsed.Actionvars["tail"]);
    }
    parsed.Actionvars = Local_185;
    return Local_183;
  };
  var parse_literal = function(parsed, errors) {
    var Local_195;
    var Local_197 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_198 = pos, Local_199;
    Local_195 = true;
    if (Local_195) {
      var Local_201 = pos, Local_202;
      Local_199 = false;
      if (!Local_199) {
        Local_202 = parse_doubleQuotedString(parsed, errors);
        Local_199 = Local_202;
      }
      if (!Local_199) {
        Local_202 = parse_singleQuotedString(parsed, errors);
        Local_199 = Local_202;
      }
      if (!Local_199) {
        pos = Local_201;
      }
      parsed.Actionvars["value"] = parsed.value;
      Local_195 = Local_199;
    }
    if (Local_195) {
      Local_199 = true;
      Local_199 = Local_199 && source.charCodeAt(pos) === 105;
      pos++;
      if (Local_199) {
        parsed.value = "i";
      } else {
        pos = pos - 1;
      }
      if (!Local_199) {
        parsed.value = "";
      }
      Local_199 = true;
      parsed.Actionvars["flags"] = parsed.value;
      Local_195 = Local_199;
    }
    if (Local_195) {
      Local_199 = parse___(parsed, errors);
      Local_195 = Local_199;
    }
    if (!Local_195) {
      pos = Local_198;
    }
    if (Local_195) {
      parsed.value = function(value, flags) {
        return {
          type: "Literal",
          Literal: value,
          ignoreCase: flags === "i"
        };
      }(parsed.Actionvars["value"], parsed.Actionvars["flags"]);
    }
    parsed.Actionvars = Local_197;
    return Local_195;
  };
  var parse_string = function(parsed, errors) {
    var Local_205;
    var Local_207 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_208 = pos, Local_209;
    Local_205 = true;
    if (Local_205) {
      var Local_211 = pos, Local_212;
      Local_209 = false;
      if (!Local_209) {
        Local_212 = parse_doubleQuotedString(parsed, errors);
        Local_209 = Local_212;
      }
      if (!Local_209) {
        Local_212 = parse_singleQuotedString(parsed, errors);
        Local_209 = Local_212;
      }
      if (!Local_209) {
        pos = Local_211;
      }
      parsed.Actionvars["string"] = parsed.value;
      Local_205 = Local_209;
    }
    if (Local_205) {
      Local_209 = parse___(parsed, errors);
      Local_205 = Local_209;
    }
    if (!Local_205) {
      pos = Local_208;
    }
    if (Local_205) {
      parsed.value = function(string) {
        return string;
      }(parsed.Actionvars["string"]);
    }
    parsed.Actionvars = Local_207;
    return Local_205;
  };
  var parse_doubleQuotedString = function(parsed, errors) {
    var Local_213;
    var Local_215 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_216 = pos, Local_217;
    Local_213 = true;
    if (Local_213) {
      Local_217 = true;
      Local_217 = Local_217 && source.charCodeAt(pos) === 34;
      pos++;
      if (Local_217) {
        parsed.value = '"';
      } else {
        pos = pos - 1;
      }
      Local_213 = Local_217;
    }
    if (Local_213) {
      var Local_219 = [];
      Local_217 = true;
      Local_217 = parse_doubleQuotedCharacter(parsed, errors);
      while (Local_217) {
        Local_219.push(parsed.value);
        Local_217 = parse_doubleQuotedCharacter(parsed, errors);
      }
      parsed.value = Local_219;
      Local_217 = true;
      parsed.Actionvars["chars"] = parsed.value;
      Local_213 = Local_217;
    }
    if (Local_213) {
      Local_217 = true;
      Local_217 = Local_217 && source.charCodeAt(pos) === 34;
      pos++;
      if (Local_217) {
        parsed.value = '"';
      } else {
        pos = pos - 1;
      }
      Local_213 = Local_217;
    }
    if (!Local_213) {
      pos = Local_216;
    }
    if (Local_213) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_215;
    return Local_213;
  };
  var parse_doubleQuotedCharacter = function(parsed, errors) {
    var Local_220;
    var Local_221 = pos, Local_222;
    Local_220 = false;
    if (!Local_220) {
      Local_222 = parse_simpleDoubleQuotedCharacter(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      Local_222 = parse_simpleEscapeSequence(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      Local_222 = parse_zeroEscapeSequence(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      Local_222 = parse_hexEscapeSequence(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      Local_222 = parse_unicodeEscapeSequence(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      Local_222 = parse_eolEscapeSequence(parsed, errors);
      Local_220 = Local_222;
    }
    if (!Local_220) {
      pos = Local_221;
    }
    return Local_220;
  };
  var parse_simpleDoubleQuotedCharacter = function(parsed, errors) {
    var Local_223;
    var Local_225 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_226 = pos, Local_227;
    Local_223 = true;
    if (Local_223) {
      var Local_229 = pos;
      var Local_230 = pos, Local_231;
      Local_227 = false;
      if (!Local_227) {
        Local_231 = true;
        Local_231 = Local_231 && source.charCodeAt(pos) === 34;
        pos++;
        if (Local_231) {
          parsed.value = '"';
        } else {
          pos = pos - 1;
        }
        Local_227 = Local_231;
      }
      if (!Local_227) {
        Local_231 = true;
        Local_231 = Local_231 && source.charCodeAt(pos) === 92;
        pos++;
        if (Local_231) {
          parsed.value = "\\";
        } else {
          pos = pos - 1;
        }
        Local_227 = Local_231;
      }
      if (!Local_227) {
        Local_231 = parse_eolChar(parsed, errors);
        Local_227 = Local_231;
      }
      if (!Local_227) {
        pos = Local_230;
      }
      pos = Local_229;
      Local_227 = !Local_227;
      Local_223 = Local_227;
    }
    if (Local_223) {
      if (pos < source.length) {
        parsed.value = source.charAt(pos);
        pos = pos + 1;
        Local_227 = true;
      } else {
        Local_227 = false;
      }
      parsed.Actionvars["char_"] = parsed.value;
      Local_223 = Local_227;
    }
    if (!Local_223) {
      pos = Local_226;
    }
    if (Local_223) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_225;
    return Local_223;
  };
  var parse_singleQuotedString = function(parsed, errors) {
    var Local_233;
    var Local_235 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_236 = pos, Local_237;
    Local_233 = true;
    if (Local_233) {
      Local_237 = true;
      Local_237 = Local_237 && source.charCodeAt(pos) === 39;
      pos++;
      if (Local_237) {
        parsed.value = "'";
      } else {
        pos = pos - 1;
      }
      Local_233 = Local_237;
    }
    if (Local_233) {
      var Local_239 = [];
      Local_237 = true;
      Local_237 = parse_singleQuotedCharacter(parsed, errors);
      while (Local_237) {
        Local_239.push(parsed.value);
        Local_237 = parse_singleQuotedCharacter(parsed, errors);
      }
      parsed.value = Local_239;
      Local_237 = true;
      parsed.Actionvars["chars"] = parsed.value;
      Local_233 = Local_237;
    }
    if (Local_233) {
      Local_237 = true;
      Local_237 = Local_237 && source.charCodeAt(pos) === 39;
      pos++;
      if (Local_237) {
        parsed.value = "'";
      } else {
        pos = pos - 1;
      }
      Local_233 = Local_237;
    }
    if (!Local_233) {
      pos = Local_236;
    }
    if (Local_233) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_235;
    return Local_233;
  };
  var parse_singleQuotedCharacter = function(parsed, errors) {
    var Local_240;
    var Local_241 = pos, Local_242;
    Local_240 = false;
    if (!Local_240) {
      Local_242 = parse_simpleSingleQuotedCharacter(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      Local_242 = parse_simpleEscapeSequence(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      Local_242 = parse_zeroEscapeSequence(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      Local_242 = parse_hexEscapeSequence(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      Local_242 = parse_unicodeEscapeSequence(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      Local_242 = parse_eolEscapeSequence(parsed, errors);
      Local_240 = Local_242;
    }
    if (!Local_240) {
      pos = Local_241;
    }
    return Local_240;
  };
  var parse_simpleSingleQuotedCharacter = function(parsed, errors) {
    var Local_243;
    var Local_245 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_246 = pos, Local_247;
    Local_243 = true;
    if (Local_243) {
      var Local_249 = pos;
      var Local_250 = pos, Local_251;
      Local_247 = false;
      if (!Local_247) {
        Local_251 = true;
        Local_251 = Local_251 && source.charCodeAt(pos) === 39;
        pos++;
        if (Local_251) {
          parsed.value = "'";
        } else {
          pos = pos - 1;
        }
        Local_247 = Local_251;
      }
      if (!Local_247) {
        Local_251 = true;
        Local_251 = Local_251 && source.charCodeAt(pos) === 92;
        pos++;
        if (Local_251) {
          parsed.value = "\\";
        } else {
          pos = pos - 1;
        }
        Local_247 = Local_251;
      }
      if (!Local_247) {
        Local_251 = parse_eolChar(parsed, errors);
        Local_247 = Local_251;
      }
      if (!Local_247) {
        pos = Local_250;
      }
      pos = Local_249;
      Local_247 = !Local_247;
      Local_243 = Local_247;
    }
    if (Local_243) {
      if (pos < source.length) {
        parsed.value = source.charAt(pos);
        pos = pos + 1;
        Local_247 = true;
      } else {
        Local_247 = false;
      }
      parsed.Actionvars["char_"] = parsed.value;
      Local_243 = Local_247;
    }
    if (!Local_243) {
      pos = Local_246;
    }
    if (Local_243) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_245;
    return Local_243;
  };
  var parse_class = function(parsed, errors) {
    var Local_253;
    var Local_255 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_256 = pos, Local_257;
    Local_253 = true;
    if (Local_253) {
      Local_257 = true;
      Local_257 = Local_257 && source.charCodeAt(pos) === 91;
      pos++;
      if (Local_257) {
        parsed.value = "[";
      } else {
        pos = pos - 1;
      }
      Local_253 = Local_257;
    }
    if (Local_253) {
      Local_257 = true;
      Local_257 = Local_257 && source.charCodeAt(pos) === 94;
      pos++;
      if (Local_257) {
        parsed.value = "^";
      } else {
        pos = pos - 1;
      }
      if (!Local_257) {
        parsed.value = "";
      }
      Local_257 = true;
      parsed.Actionvars["inverted"] = parsed.value;
      Local_253 = Local_257;
    }
    if (Local_253) {
      var Local_261 = [];
      Local_257 = true;
      var Local_262 = pos, Local_263;
      Local_257 = false;
      if (!Local_257) {
        Local_263 = parse_classCharacterRange(parsed, errors);
        Local_257 = Local_263;
      }
      if (!Local_257) {
        Local_263 = parse_classCharacter(parsed, errors);
        Local_257 = Local_263;
      }
      if (!Local_257) {
        pos = Local_262;
      }
      while (Local_257) {
        Local_261.push(parsed.value);
        var Local_262 = pos, Local_263;
        Local_257 = false;
        if (!Local_257) {
          Local_263 = parse_classCharacterRange(parsed, errors);
          Local_257 = Local_263;
        }
        if (!Local_257) {
          Local_263 = parse_classCharacter(parsed, errors);
          Local_257 = Local_263;
        }
        if (!Local_257) {
          pos = Local_262;
        }
      }
      parsed.value = Local_261;
      Local_257 = true;
      parsed.Actionvars["parts"] = parsed.value;
      Local_253 = Local_257;
    }
    if (Local_253) {
      Local_257 = true;
      Local_257 = Local_257 && source.charCodeAt(pos) === 93;
      pos++;
      if (Local_257) {
        parsed.value = "]";
      } else {
        pos = pos - 1;
      }
      Local_253 = Local_257;
    }
    if (Local_253) {
      Local_257 = true;
      Local_257 = Local_257 && source.charCodeAt(pos) === 105;
      pos++;
      if (Local_257) {
        parsed.value = "i";
      } else {
        pos = pos - 1;
      }
      if (!Local_257) {
        parsed.value = "";
      }
      Local_257 = true;
      parsed.Actionvars["flags"] = parsed.value;
      Local_253 = Local_257;
    }
    if (Local_253) {
      Local_257 = parse___(parsed, errors);
      Local_253 = Local_257;
    }
    if (!Local_253) {
      pos = Local_256;
    }
    if (Local_253) {
      parsed.value = function(inverted, parts, flags) {
        var partsConverted = parts.map(function(part) {
          return part.data;
        });
        var rawText = "[" + inverted + parts.map(function(part) {
          return part.rawText;
        }).join("") + "]" + flags;
        return {
          type: "Class",
          inverted: inverted === "^",
          ignoreCase: flags === "i",
          characters: partsConverted,
          rawText: rawText
        };
      }(parsed.Actionvars["inverted"], parsed.Actionvars["parts"], parsed.Actionvars["flags"]);
    }
    parsed.Actionvars = Local_255;
    return Local_253;
  };
  var parse_classCharacterRange = function(parsed, errors) {
    var Local_266;
    var Local_268 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_269 = pos, Local_270;
    Local_266 = true;
    if (Local_266) {
      Local_270 = parse_classCharacter(parsed, errors);
      parsed.Actionvars["begin"] = parsed.value;
      Local_266 = Local_270;
    }
    if (Local_266) {
      Local_270 = true;
      Local_270 = Local_270 && source.charCodeAt(pos) === 45;
      pos++;
      if (Local_270) {
        parsed.value = "-";
      } else {
        pos = pos - 1;
      }
      Local_266 = Local_270;
    }
    if (Local_266) {
      Local_270 = parse_classCharacter(parsed, errors);
      parsed.Actionvars["end"] = parsed.value;
      Local_266 = Local_270;
    }
    if (!Local_266) {
      pos = Local_269;
    }
    if (Local_266) {
      parsed.value = function(begin, end) {
        if (begin.data.charCodeAt(0) > end.data.charCodeAt(0)) {
          throw new this.SyntaxError("Invalid character range: " + begin.rawText + "-" + end.rawText + ".");
        }
        return {
          data: [ begin.data, end.data ],
          rawText: begin.rawText + "-" + end.rawText
        };
      }(parsed.Actionvars["begin"], parsed.Actionvars["end"]);
    }
    parsed.Actionvars = Local_268;
    return Local_266;
  };
  var parse_classCharacter = function(parsed, errors) {
    var Local_273;
    var Local_275 = parsed.Actionvars;
    parsed.Actionvars = {};
    Local_273 = parse_bracketDelimitedCharacter(parsed, errors);
    parsed.Actionvars["char_"] = parsed.value;
    if (Local_273) {
      parsed.value = function(char_) {
        return {
          data: char_,
          rawText: quote(char_)
        };
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_275;
    return Local_273;
  };
  var parse_bracketDelimitedCharacter = function(parsed, errors) {
    var Local_277;
    var Local_278 = pos, Local_279;
    Local_277 = false;
    if (!Local_277) {
      Local_279 = parse_simpleBracketDelimitedCharacter(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      Local_279 = parse_simpleEscapeSequence(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      Local_279 = parse_zeroEscapeSequence(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      Local_279 = parse_hexEscapeSequence(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      Local_279 = parse_unicodeEscapeSequence(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      Local_279 = parse_eolEscapeSequence(parsed, errors);
      Local_277 = Local_279;
    }
    if (!Local_277) {
      pos = Local_278;
    }
    return Local_277;
  };
  var parse_simpleBracketDelimitedCharacter = function(parsed, errors) {
    var Local_280;
    var Local_282 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_283 = pos, Local_284;
    Local_280 = true;
    if (Local_280) {
      var Local_286 = pos;
      var Local_287 = pos, Local_288;
      Local_284 = false;
      if (!Local_284) {
        Local_288 = true;
        Local_288 = Local_288 && source.charCodeAt(pos) === 93;
        pos++;
        if (Local_288) {
          parsed.value = "]";
        } else {
          pos = pos - 1;
        }
        Local_284 = Local_288;
      }
      if (!Local_284) {
        Local_288 = true;
        Local_288 = Local_288 && source.charCodeAt(pos) === 92;
        pos++;
        if (Local_288) {
          parsed.value = "\\";
        } else {
          pos = pos - 1;
        }
        Local_284 = Local_288;
      }
      if (!Local_284) {
        Local_288 = parse_eolChar(parsed, errors);
        Local_284 = Local_288;
      }
      if (!Local_284) {
        pos = Local_287;
      }
      pos = Local_286;
      Local_284 = !Local_284;
      Local_280 = Local_284;
    }
    if (Local_280) {
      if (pos < source.length) {
        parsed.value = source.charAt(pos);
        pos = pos + 1;
        Local_284 = true;
      } else {
        Local_284 = false;
      }
      parsed.Actionvars["char_"] = parsed.value;
      Local_280 = Local_284;
    }
    if (!Local_280) {
      pos = Local_283;
    }
    if (Local_280) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_282;
    return Local_280;
  };
  var parse_simpleEscapeSequence = function(parsed, errors) {
    var Local_290;
    var Local_292 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_293 = pos, Local_294;
    Local_290 = true;
    if (Local_290) {
      Local_294 = true;
      Local_294 = Local_294 && source.charCodeAt(pos) === 92;
      pos++;
      if (Local_294) {
        parsed.value = "\\";
      } else {
        pos = pos - 1;
      }
      Local_290 = Local_294;
    }
    if (Local_290) {
      var Local_296 = pos;
      var Local_297 = pos, Local_298;
      Local_294 = false;
      if (!Local_294) {
        Local_298 = parse_digit(parsed, errors);
        Local_294 = Local_298;
      }
      if (!Local_294) {
        Local_298 = true;
        Local_298 = Local_298 && source.charCodeAt(pos) === 120;
        pos++;
        if (Local_298) {
          parsed.value = "x";
        } else {
          pos = pos - 1;
        }
        Local_294 = Local_298;
      }
      if (!Local_294) {
        Local_298 = true;
        Local_298 = Local_298 && source.charCodeAt(pos) === 117;
        pos++;
        if (Local_298) {
          parsed.value = "u";
        } else {
          pos = pos - 1;
        }
        Local_294 = Local_298;
      }
      if (!Local_294) {
        Local_298 = parse_eolChar(parsed, errors);
        Local_294 = Local_298;
      }
      if (!Local_294) {
        pos = Local_297;
      }
      pos = Local_296;
      Local_294 = !Local_294;
      Local_290 = Local_294;
    }
    if (Local_290) {
      if (pos < source.length) {
        parsed.value = source.charAt(pos);
        pos = pos + 1;
        Local_294 = true;
      } else {
        Local_294 = false;
      }
      parsed.Actionvars["char_"] = parsed.value;
      Local_290 = Local_294;
    }
    if (!Local_290) {
      pos = Local_293;
    }
    if (Local_290) {
      parsed.value = function(char_) {
        return char_.replace("b", "\b").replace("f", "\f").replace("n", "\n").replace("r", "\r").replace("t", "\t").replace("v", "");
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_292;
    return Local_290;
  };
  var parse_zeroEscapeSequence = function(parsed, errors) {
    var Local_300;
    var Local_302 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_303 = pos, Local_304;
    Local_300 = true;
    if (Local_300) {
      Local_304 = true;
      Local_304 = Local_304 && source.charCodeAt(pos) === 92;
      pos++;
      Local_304 = Local_304 && source.charCodeAt(pos) === 48;
      pos++;
      if (Local_304) {
        parsed.value = "\\0";
      } else {
        pos = pos - 2;
      }
      Local_300 = Local_304;
    }
    if (Local_300) {
      var Local_306 = pos;
      Local_304 = parse_digit(parsed, errors);
      pos = Local_306;
      Local_304 = !Local_304;
      Local_300 = Local_304;
    }
    if (!Local_300) {
      pos = Local_303;
    }
    if (Local_300) {
      parsed.value = function() {
        return "\0";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_302;
    return Local_300;
  };
  var parse_hexEscapeSequence = function(parsed, errors) {
    var Local_307;
    var Local_309 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_310 = pos, Local_311;
    Local_307 = true;
    if (Local_307) {
      Local_311 = true;
      Local_311 = Local_311 && source.charCodeAt(pos) === 92;
      pos++;
      Local_311 = Local_311 && source.charCodeAt(pos) === 120;
      pos++;
      if (Local_311) {
        parsed.value = "\\x";
      } else {
        pos = pos - 2;
      }
      Local_307 = Local_311;
    }
    if (Local_307) {
      Local_311 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h1"] = parsed.value;
      Local_307 = Local_311;
    }
    if (Local_307) {
      Local_311 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h2"] = parsed.value;
      Local_307 = Local_311;
    }
    if (!Local_307) {
      pos = Local_310;
    }
    if (Local_307) {
      parsed.value = function(h1, h2) {
        return String.fromCharCode(parseInt(h1 + h2, 16));
      }(parsed.Actionvars["h1"], parsed.Actionvars["h2"]);
    }
    parsed.Actionvars = Local_309;
    return Local_307;
  };
  var parse_unicodeEscapeSequence = function(parsed, errors) {
    var Local_314;
    var Local_316 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_317 = pos, Local_318;
    Local_314 = true;
    if (Local_314) {
      Local_318 = true;
      Local_318 = Local_318 && source.charCodeAt(pos) === 92;
      pos++;
      Local_318 = Local_318 && source.charCodeAt(pos) === 117;
      pos++;
      if (Local_318) {
        parsed.value = "\\u";
      } else {
        pos = pos - 2;
      }
      Local_314 = Local_318;
    }
    if (Local_314) {
      Local_318 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h1"] = parsed.value;
      Local_314 = Local_318;
    }
    if (Local_314) {
      Local_318 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h2"] = parsed.value;
      Local_314 = Local_318;
    }
    if (Local_314) {
      Local_318 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h3"] = parsed.value;
      Local_314 = Local_318;
    }
    if (Local_314) {
      Local_318 = parse_hexDigit(parsed, errors);
      parsed.Actionvars["h4"] = parsed.value;
      Local_314 = Local_318;
    }
    if (!Local_314) {
      pos = Local_317;
    }
    if (Local_314) {
      parsed.value = function(h1, h2, h3, h4) {
        return String.fromCharCode(parseInt(h1 + h2 + h3 + h4, 16));
      }(parsed.Actionvars["h1"], parsed.Actionvars["h2"], parsed.Actionvars["h3"], parsed.Actionvars["h4"]);
    }
    parsed.Actionvars = Local_316;
    return Local_314;
  };
  var parse_eolEscapeSequence = function(parsed, errors) {
    var Local_323;
    var Local_325 = parsed.Actionvars;
    parsed.Actionvars = {};
    var Local_326 = pos, Local_327;
    Local_323 = true;
    if (Local_323) {
      Local_327 = true;
      Local_327 = Local_327 && source.charCodeAt(pos) === 92;
      pos++;
      if (Local_327) {
        parsed.value = "\\";
      } else {
        pos = pos - 1;
      }
      Local_323 = Local_327;
    }
    if (Local_323) {
      Local_327 = parse_eol(parsed, errors);
      parsed.Actionvars["eol"] = parsed.value;
      Local_323 = Local_327;
    }
    if (!Local_323) {
      pos = Local_326;
    }
    if (Local_323) {
      parsed.value = function(eol) {
        return eol;
      }(parsed.Actionvars["eol"]);
    }
    parsed.Actionvars = Local_325;
    return Local_323;
  };
  var parse_digit = function(parsed, errors) {
    var Local_329;
    var Local_330 = {
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
    if (Local_330[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_329 = true;
    } else {
      Local_329 = false;
    }
    return Local_329;
  };
  var parse_hexDigit = function(parsed, errors) {
    var Local_331;
    var Local_332 = {
      "48": true,
      "49": true,
      "50": true,
      "51": true,
      "52": true,
      "53": true,
      "54": true,
      "55": true,
      "56": true,
      "57": true,
      "97": true,
      "98": true,
      "99": true,
      "100": true,
      "101": true,
      "102": true,
      "65": true,
      "66": true,
      "67": true,
      "68": true,
      "69": true,
      "70": true
    };
    if (Local_332[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_331 = true;
    } else {
      Local_331 = false;
    }
    return Local_331;
  };
  var parse_letter = function(parsed, errors) {
    var Local_333;
    var Local_334 = pos, Local_335;
    Local_333 = false;
    if (!Local_333) {
      Local_335 = parse_lowerCaseLetter(parsed, errors);
      Local_333 = Local_335;
    }
    if (!Local_333) {
      Local_335 = parse_upperCaseLetter(parsed, errors);
      Local_333 = Local_335;
    }
    if (!Local_333) {
      pos = Local_334;
    }
    return Local_333;
  };
  var parse_lowerCaseLetter = function(parsed, errors) {
    var Local_336;
    var Local_337 = {
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
      "122": true
    };
    if (Local_337[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_336 = true;
    } else {
      Local_336 = false;
    }
    return Local_336;
  };
  var parse_upperCaseLetter = function(parsed, errors) {
    var Local_338;
    var Local_339 = {
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
      "90": true
    };
    if (Local_339[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_338 = true;
    } else {
      Local_338 = false;
    }
    return Local_338;
  };
  var parse___ = function(parsed, errors) {
    var Local_340;
    var Local_341 = [];
    Local_340 = true;
    var Local_342 = pos, Local_343;
    Local_340 = false;
    if (!Local_340) {
      Local_343 = parse_whitespace(parsed, errors);
      Local_340 = Local_343;
    }
    if (!Local_340) {
      Local_343 = parse_eol(parsed, errors);
      Local_340 = Local_343;
    }
    if (!Local_340) {
      Local_343 = parse_comment(parsed, errors);
      Local_340 = Local_343;
    }
    if (!Local_340) {
      pos = Local_342;
    }
    while (Local_340) {
      Local_341.push(parsed.value);
      var Local_342 = pos, Local_343;
      Local_340 = false;
      if (!Local_340) {
        Local_343 = parse_whitespace(parsed, errors);
        Local_340 = Local_343;
      }
      if (!Local_340) {
        Local_343 = parse_eol(parsed, errors);
        Local_340 = Local_343;
      }
      if (!Local_340) {
        Local_343 = parse_comment(parsed, errors);
        Local_340 = Local_343;
      }
      if (!Local_340) {
        pos = Local_342;
      }
    }
    parsed.value = Local_341;
    Local_340 = true;
    return Local_340;
  };
  var parse_comment = function(parsed, errors) {
    var Local_344;
    var Local_345 = pos, Local_346;
    Local_344 = false;
    if (!Local_344) {
      Local_346 = parse_singleLineComment(parsed, errors);
      Local_344 = Local_346;
    }
    if (!Local_344) {
      Local_346 = parse_multiLineComment(parsed, errors);
      Local_344 = Local_346;
    }
    if (!Local_344) {
      pos = Local_345;
    }
    return Local_344;
  };
  var parse_singleLineComment = function(parsed, errors) {
    var Local_347;
    var Local_348 = pos, Local_349;
    Local_347 = true;
    if (Local_347) {
      Local_349 = true;
      Local_349 = Local_349 && source.charCodeAt(pos) === 47;
      pos++;
      Local_349 = Local_349 && source.charCodeAt(pos) === 47;
      pos++;
      if (Local_349) {
        parsed.value = "//";
      } else {
        pos = pos - 2;
      }
      Local_347 = Local_349;
    }
    if (Local_347) {
      var Local_350 = [];
      Local_349 = true;
      var Local_351 = pos, Local_352;
      Local_349 = true;
      if (Local_349) {
        var Local_354 = pos;
        Local_352 = parse_eolChar(parsed, errors);
        pos = Local_354;
        Local_352 = !Local_352;
        Local_349 = Local_352;
      }
      if (Local_349) {
        if (pos < source.length) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_352 = true;
        } else {
          Local_352 = false;
        }
        Local_349 = Local_352;
      }
      if (!Local_349) {
        pos = Local_351;
      }
      while (Local_349) {
        Local_350.push(parsed.value);
        var Local_351 = pos, Local_352;
        Local_349 = true;
        if (Local_349) {
          var Local_354 = pos;
          Local_352 = parse_eolChar(parsed, errors);
          pos = Local_354;
          Local_352 = !Local_352;
          Local_349 = Local_352;
        }
        if (Local_349) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            Local_352 = true;
          } else {
            Local_352 = false;
          }
          Local_349 = Local_352;
        }
        if (!Local_349) {
          pos = Local_351;
        }
      }
      parsed.value = Local_350;
      Local_349 = true;
      Local_347 = Local_349;
    }
    if (!Local_347) {
      pos = Local_348;
    }
    return Local_347;
  };
  var parse_multiLineComment = function(parsed, errors) {
    var Local_355;
    var Local_356 = pos, Local_357;
    Local_355 = true;
    if (Local_355) {
      Local_357 = true;
      Local_357 = Local_357 && source.charCodeAt(pos) === 47;
      pos++;
      Local_357 = Local_357 && source.charCodeAt(pos) === 42;
      pos++;
      if (Local_357) {
        parsed.value = "/*";
      } else {
        pos = pos - 2;
      }
      Local_355 = Local_357;
    }
    if (Local_355) {
      var Local_358 = [];
      Local_357 = true;
      var Local_359 = pos, Local_360;
      Local_357 = true;
      if (Local_357) {
        var Local_362 = pos;
        Local_360 = true;
        Local_360 = Local_360 && source.charCodeAt(pos) === 42;
        pos++;
        Local_360 = Local_360 && source.charCodeAt(pos) === 47;
        pos++;
        if (Local_360) {
          parsed.value = "*/";
        } else {
          pos = pos - 2;
        }
        pos = Local_362;
        Local_360 = !Local_360;
        Local_357 = Local_360;
      }
      if (Local_357) {
        if (pos < source.length) {
          parsed.value = source.charAt(pos);
          pos = pos + 1;
          Local_360 = true;
        } else {
          Local_360 = false;
        }
        Local_357 = Local_360;
      }
      if (!Local_357) {
        pos = Local_359;
      }
      while (Local_357) {
        Local_358.push(parsed.value);
        var Local_359 = pos, Local_360;
        Local_357 = true;
        if (Local_357) {
          var Local_362 = pos;
          Local_360 = true;
          Local_360 = Local_360 && source.charCodeAt(pos) === 42;
          pos++;
          Local_360 = Local_360 && source.charCodeAt(pos) === 47;
          pos++;
          if (Local_360) {
            parsed.value = "*/";
          } else {
            pos = pos - 2;
          }
          pos = Local_362;
          Local_360 = !Local_360;
          Local_357 = Local_360;
        }
        if (Local_357) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            Local_360 = true;
          } else {
            Local_360 = false;
          }
          Local_357 = Local_360;
        }
        if (!Local_357) {
          pos = Local_359;
        }
      }
      parsed.value = Local_358;
      Local_357 = true;
      Local_355 = Local_357;
    }
    if (Local_355) {
      Local_357 = true;
      Local_357 = Local_357 && source.charCodeAt(pos) === 42;
      pos++;
      Local_357 = Local_357 && source.charCodeAt(pos) === 47;
      pos++;
      if (Local_357) {
        parsed.value = "*/";
      } else {
        pos = pos - 2;
      }
      Local_355 = Local_357;
    }
    if (!Local_355) {
      pos = Local_356;
    }
    return Local_355;
  };
  var parse_eol = function(parsed, errors) {
    var Local_363;
    var Local_364 = pos, Local_365;
    Local_363 = false;
    if (!Local_363) {
      Local_365 = true;
      Local_365 = Local_365 && source.charCodeAt(pos) === 10;
      pos++;
      if (Local_365) {
        parsed.value = "\n";
      } else {
        pos = pos - 1;
      }
      Local_363 = Local_365;
    }
    if (!Local_363) {
      Local_365 = true;
      Local_365 = Local_365 && source.charCodeAt(pos) === 13;
      pos++;
      Local_365 = Local_365 && source.charCodeAt(pos) === 10;
      pos++;
      if (Local_365) {
        parsed.value = "\r\n";
      } else {
        pos = pos - 2;
      }
      Local_363 = Local_365;
    }
    if (!Local_363) {
      Local_365 = true;
      Local_365 = Local_365 && source.charCodeAt(pos) === 13;
      pos++;
      if (Local_365) {
        parsed.value = "\r";
      } else {
        pos = pos - 1;
      }
      Local_363 = Local_365;
    }
    if (!Local_363) {
      Local_365 = true;
      Local_365 = Local_365 && source.charCodeAt(pos) === 8232;
      pos++;
      if (Local_365) {
        parsed.value = "\u2028";
      } else {
        pos = pos - 1;
      }
      Local_363 = Local_365;
    }
    if (!Local_363) {
      Local_365 = true;
      Local_365 = Local_365 && source.charCodeAt(pos) === 8233;
      pos++;
      if (Local_365) {
        parsed.value = "\u2029";
      } else {
        pos = pos - 1;
      }
      Local_363 = Local_365;
    }
    if (!Local_363) {
      pos = Local_364;
    }
    return Local_363;
  };
  var parse_eolChar = function(parsed, errors) {
    var Local_366;
    var Local_367 = {
      "10": true,
      "13": true,
      "8232": true,
      "8233": true
    };
    if (Local_367[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_366 = true;
    } else {
      Local_366 = false;
    }
    return Local_366;
  };
  var parse_whitespace = function(parsed, errors) {
    var Local_368;
    var Local_369 = {
      "32": true,
      "9": true,
      "11": true,
      "12": true,
      "160": true,
      "65279": true,
      "5760": true,
      "6158": true,
      "8192": true,
      "8193": true,
      "8194": true,
      "8195": true,
      "8196": true,
      "8197": true,
      "8198": true,
      "8199": true,
      "8200": true,
      "8201": true,
      "8202": true,
      "8239": true,
      "8287": true,
      "12288": true
    };
    if (Local_369[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      Local_368 = true;
    } else {
      Local_368 = false;
    }
    return Local_368;
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