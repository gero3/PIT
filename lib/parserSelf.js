exports.parse = function(source) {
  var pos = 0;
  var length = source.length;
  function quote(s) {
    return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
  }
  var parse_start = function(parsed, errors) {
    return parse_grammar(parsed, errors);
  };
  var parse_grammar = function(parsed, errors) {
    var Local_0 = function(parsed, errors) {
      var Local_2 = pos;
      var Local_3 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_3(parsed, errors)) {
        pos = Local_2;
        return false;
      }
      var Local_4 = function(parsed, errors) {
        var Local_5 = function(parsed, errors) {
          var Local_6 = function(parsed, errors) {
            return parse_rule(parsed, errors);
          };
          var test = [];
          if (!Local_6(parsed, errors)) {
            return false;
          }
          test.push(parsed.value);
          while (Local_6(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_5(parsed, errors);
        parsed.Actionvars["rules"] = parsed.value;
        return test;
      };
      if (!Local_4(parsed, errors)) {
        pos = Local_2;
        return false;
      }
      return true;
    };
    var Local_1 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_0(parsed, errors);
    if (test) {
      parsed.value = function(rules) {
        return {
          type: "grammar",
          rules: rules
        };
      }(parsed.Actionvars["rules"]);
    }
    parsed.Actionvars = Local_1;
    return test;
  };
  var parse_rule = function(parsed, errors) {
    var Local_7 = function(parsed, errors) {
      var Local_9 = pos;
      var Local_10 = function(parsed, errors) {
        var Local_11 = function(parsed, errors) {
          return parse_identifier(parsed, errors);
        };
        var test = Local_11(parsed, errors);
        parsed.Actionvars["name"] = parsed.value;
        return test;
      };
      if (!Local_10(parsed, errors)) {
        pos = Local_9;
        return false;
      }
      var Local_12 = function(parsed, errors) {
        return parse_equals(parsed, errors);
      };
      if (!Local_12(parsed, errors)) {
        pos = Local_9;
        return false;
      }
      var Local_13 = function(parsed, errors) {
        var Local_14 = function(parsed, errors) {
          return parse_expression(parsed, errors);
        };
        var test = Local_14(parsed, errors);
        parsed.Actionvars["expression"] = parsed.value;
        return test;
      };
      if (!Local_13(parsed, errors)) {
        pos = Local_9;
        return false;
      }
      var Local_15 = function(parsed, errors) {
        var Local_16 = function(parsed, errors) {
          return parse_semicolon(parsed, errors);
        };
        if (!Local_16(parsed, errors)) {
          parsed.value = "";
        }
        return true;
      };
      if (!Local_15(parsed, errors)) {
        pos = Local_9;
        return false;
      }
      return true;
    };
    var Local_8 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_7(parsed, errors);
    if (test) {
      parsed.value = function(name, expression) {
        return {
          type: "rule",
          identifier: name,
          description: expression
        };
      }(parsed.Actionvars["name"], parsed.Actionvars["expression"]);
    }
    parsed.Actionvars = Local_8;
    return test;
  };
  var parse_expression = function(parsed, errors) {
    return parse_choice(parsed, errors);
  };
  var parse_choice = function(parsed, errors) {
    var Local_17 = function(parsed, errors) {
      var Local_19 = pos;
      var Local_20 = function(parsed, errors) {
        var Local_21 = function(parsed, errors) {
          return parse_sequence(parsed, errors);
        };
        var test = Local_21(parsed, errors);
        parsed.Actionvars["head"] = parsed.value;
        return test;
      };
      if (!Local_20(parsed, errors)) {
        pos = Local_19;
        return false;
      }
      var Local_22 = function(parsed, errors) {
        var Local_23 = function(parsed, errors) {
          var Local_24 = function(parsed, errors) {
            var Local_25 = pos;
            var Local_26 = function(parsed, errors) {
              return parse_slash(parsed, errors);
            };
            if (!Local_26(parsed, errors)) {
              pos = Local_25;
              return false;
            }
            var Local_27 = function(parsed, errors) {
              return parse_sequence(parsed, errors);
            };
            if (!Local_27(parsed, errors)) {
              pos = Local_25;
              return false;
            }
            return true;
          };
          var test = [];
          while (Local_24(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_23(parsed, errors);
        parsed.Actionvars["tail"] = parsed.value;
        return test;
      };
      if (!Local_22(parsed, errors)) {
        pos = Local_19;
        return false;
      }
      return true;
    };
    var Local_18 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_17(parsed, errors);
    if (test) {
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
    parsed.Actionvars = Local_18;
    return test;
  };
  var parse_sequence = function(parsed, errors) {
    var Local_28 = pos;
    var Local_29 = function(parsed, errors) {
      var Local_30 = function(parsed, errors) {
        var Local_32 = pos;
        var Local_33 = function(parsed, errors) {
          var Local_34 = function(parsed, errors) {
            var Local_35 = function(parsed, errors) {
              return parse_labeled(parsed, errors);
            };
            var test = [];
            while (Local_35(parsed, errors)) {
              test.push(parsed.value);
            }
            parsed.value = test;
            return true;
          };
          var test = Local_34(parsed, errors);
          parsed.Actionvars["elements"] = parsed.value;
          return test;
        };
        if (!Local_33(parsed, errors)) {
          pos = Local_32;
          return false;
        }
        var Local_36 = function(parsed, errors) {
          var Local_37 = function(parsed, errors) {
            return parse_action(parsed, errors);
          };
          var test = Local_37(parsed, errors);
          parsed.Actionvars["code"] = parsed.value;
          return test;
        };
        if (!Local_36(parsed, errors)) {
          pos = Local_32;
          return false;
        }
        return true;
      };
      var Local_31 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_30(parsed, errors);
      if (test) {
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
      return test;
    };
    if (Local_29(parsed, errors)) {
      return true;
    }
    var Local_38 = function(parsed, errors) {
      var Local_39 = function(parsed, errors) {
        var Local_41 = function(parsed, errors) {
          var Local_42 = function(parsed, errors) {
            return parse_labeled(parsed, errors);
          };
          var test = [];
          while (Local_42(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_41(parsed, errors);
        parsed.Actionvars["elements"] = parsed.value;
        return test;
      };
      var Local_40 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_39(parsed, errors);
      if (test) {
        parsed.value = function(elements) {
          return elements.length !== 1 ? {
            type: "Sequence",
            expressions: elements
          } : elements[0];
        }(parsed.Actionvars["elements"]);
      }
      parsed.Actionvars = Local_40;
      return test;
    };
    if (Local_38(parsed, errors)) {
      return true;
    }
    pos = Local_28;
    return false;
  };
  var parse_labeled = function(parsed, errors) {
    var Local_43 = pos;
    var Local_44 = function(parsed, errors) {
      var Local_45 = function(parsed, errors) {
        var Local_47 = pos;
        var Local_48 = function(parsed, errors) {
          var Local_49 = function(parsed, errors) {
            return parse_identifier(parsed, errors);
          };
          var test = Local_49(parsed, errors);
          parsed.Actionvars["label"] = parsed.value;
          return test;
        };
        if (!Local_48(parsed, errors)) {
          pos = Local_47;
          return false;
        }
        var Local_50 = function(parsed, errors) {
          return parse_colon(parsed, errors);
        };
        if (!Local_50(parsed, errors)) {
          pos = Local_47;
          return false;
        }
        var Local_51 = function(parsed, errors) {
          var Local_52 = function(parsed, errors) {
            return parse_prefixed(parsed, errors);
          };
          var test = Local_52(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_51(parsed, errors)) {
          pos = Local_47;
          return false;
        }
        return true;
      };
      var Local_46 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_45(parsed, errors);
      if (test) {
        parsed.value = function(label, expression) {
          return {
            type: "labeled",
            label: label,
            expression: expression
          };
        }(parsed.Actionvars["label"], parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_46;
      return test;
    };
    if (Local_44(parsed, errors)) {
      return true;
    }
    var Local_53 = function(parsed, errors) {
      return parse_prefixed(parsed, errors);
    };
    if (Local_53(parsed, errors)) {
      return true;
    }
    pos = Local_43;
    return false;
  };
  var parse_prefixed = function(parsed, errors) {
    var Local_54 = pos;
    var Local_55 = function(parsed, errors) {
      var Local_56 = function(parsed, errors) {
        var Local_58 = pos;
        var Local_59 = function(parsed, errors) {
          return parse_and(parsed, errors);
        };
        if (!Local_59(parsed, errors)) {
          pos = Local_58;
          return false;
        }
        var Local_60 = function(parsed, errors) {
          var Local_61 = function(parsed, errors) {
            return parse_suffixed(parsed, errors);
          };
          var test = Local_61(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_60(parsed, errors)) {
          pos = Local_58;
          return false;
        }
        return true;
      };
      var Local_57 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_56(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return {
            type: "SimpleAnd",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_57;
      return test;
    };
    if (Local_55(parsed, errors)) {
      return true;
    }
    var Local_62 = function(parsed, errors) {
      var Local_63 = function(parsed, errors) {
        var Local_65 = pos;
        var Local_66 = function(parsed, errors) {
          return parse_not(parsed, errors);
        };
        if (!Local_66(parsed, errors)) {
          pos = Local_65;
          return false;
        }
        var Local_67 = function(parsed, errors) {
          var Local_68 = function(parsed, errors) {
            return parse_suffixed(parsed, errors);
          };
          var test = Local_68(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_67(parsed, errors)) {
          pos = Local_65;
          return false;
        }
        return true;
      };
      var Local_64 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_63(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return {
            type: "SimpleNot",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_64;
      return test;
    };
    if (Local_62(parsed, errors)) {
      return true;
    }
    var Local_69 = function(parsed, errors) {
      return parse_suffixed(parsed, errors);
    };
    if (Local_69(parsed, errors)) {
      return true;
    }
    pos = Local_54;
    return false;
  };
  var parse_suffixed = function(parsed, errors) {
    var Local_70 = pos;
    var Local_71 = function(parsed, errors) {
      var Local_72 = function(parsed, errors) {
        var Local_74 = pos;
        var Local_75 = function(parsed, errors) {
          var Local_76 = function(parsed, errors) {
            return parse_primary(parsed, errors);
          };
          var test = Local_76(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_75(parsed, errors)) {
          pos = Local_74;
          return false;
        }
        var Local_77 = function(parsed, errors) {
          return parse_question(parsed, errors);
        };
        if (!Local_77(parsed, errors)) {
          pos = Local_74;
          return false;
        }
        return true;
      };
      var Local_73 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_72(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return {
            type: "Question",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_73;
      return test;
    };
    if (Local_71(parsed, errors)) {
      return true;
    }
    var Local_78 = function(parsed, errors) {
      var Local_79 = function(parsed, errors) {
        var Local_81 = pos;
        var Local_82 = function(parsed, errors) {
          var Local_83 = function(parsed, errors) {
            return parse_primary(parsed, errors);
          };
          var test = Local_83(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_82(parsed, errors)) {
          pos = Local_81;
          return false;
        }
        var Local_84 = function(parsed, errors) {
          return parse_star(parsed, errors);
        };
        if (!Local_84(parsed, errors)) {
          pos = Local_81;
          return false;
        }
        return true;
      };
      var Local_80 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_79(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return {
            type: "ZeroOrMore",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_80;
      return test;
    };
    if (Local_78(parsed, errors)) {
      return true;
    }
    var Local_85 = function(parsed, errors) {
      var Local_86 = function(parsed, errors) {
        var Local_88 = pos;
        var Local_89 = function(parsed, errors) {
          var Local_90 = function(parsed, errors) {
            return parse_primary(parsed, errors);
          };
          var test = Local_90(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_89(parsed, errors)) {
          pos = Local_88;
          return false;
        }
        var Local_91 = function(parsed, errors) {
          return parse_plus(parsed, errors);
        };
        if (!Local_91(parsed, errors)) {
          pos = Local_88;
          return false;
        }
        return true;
      };
      var Local_87 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_86(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return {
            type: "OneOrMore",
            expression: expression
          };
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_87;
      return test;
    };
    if (Local_85(parsed, errors)) {
      return true;
    }
    var Local_92 = function(parsed, errors) {
      return parse_primary(parsed, errors);
    };
    if (Local_92(parsed, errors)) {
      return true;
    }
    pos = Local_70;
    return false;
  };
  var parse_primary = function(parsed, errors) {
    var Local_93 = pos;
    var Local_94 = function(parsed, errors) {
      var Local_95 = function(parsed, errors) {
        var Local_97 = pos;
        var Local_98 = function(parsed, errors) {
          var Local_99 = function(parsed, errors) {
            return parse_identifier(parsed, errors);
          };
          var test = Local_99(parsed, errors);
          parsed.Actionvars["identifier"] = parsed.value;
          return test;
        };
        if (!Local_98(parsed, errors)) {
          pos = Local_97;
          return false;
        }
        var Local_100 = function(parsed, errors) {
          var Local_101 = function(parsed, errors) {
            var Local_102 = pos;
            var Local_103 = function(parsed, errors) {
              var Local_104 = function(parsed, errors) {
                return parse_string(parsed, errors);
              };
              if (!Local_104(parsed, errors)) {
                parsed.value = "";
              }
              return true;
            };
            if (!Local_103(parsed, errors)) {
              pos = Local_102;
              return false;
            }
            var Local_105 = function(parsed, errors) {
              return parse_equals(parsed, errors);
            };
            if (!Local_105(parsed, errors)) {
              pos = Local_102;
              return false;
            }
            return true;
          };
          return !Local_101(parsed, errors);
        };
        if (!Local_100(parsed, errors)) {
          pos = Local_97;
          return false;
        }
        return true;
      };
      var Local_96 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_95(parsed, errors);
      if (test) {
        parsed.value = function(identifier) {
          return {
            type: "rule_ref",
            identifier: identifier
          };
        }(parsed.Actionvars["identifier"]);
      }
      parsed.Actionvars = Local_96;
      return test;
    };
    if (Local_94(parsed, errors)) {
      return true;
    }
    var Local_106 = function(parsed, errors) {
      return parse_literal(parsed, errors);
    };
    if (Local_106(parsed, errors)) {
      return true;
    }
    var Local_107 = function(parsed, errors) {
      var Local_108 = function(parsed, errors) {
        return parse_dot(parsed, errors);
      };
      var Local_109 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_108(parsed, errors);
      if (test) {
        parsed.value = function() {
          return {
            type: "Any"
          };
        }(parsed.Actionvars[""]);
      }
      parsed.Actionvars = Local_109;
      return test;
    };
    if (Local_107(parsed, errors)) {
      return true;
    }
    var Local_110 = function(parsed, errors) {
      return parse_class(parsed, errors);
    };
    if (Local_110(parsed, errors)) {
      return true;
    }
    var Local_111 = function(parsed, errors) {
      var Local_112 = function(parsed, errors) {
        var Local_114 = pos;
        var Local_115 = function(parsed, errors) {
          return parse_lparen(parsed, errors);
        };
        if (!Local_115(parsed, errors)) {
          pos = Local_114;
          return false;
        }
        var Local_116 = function(parsed, errors) {
          var Local_117 = function(parsed, errors) {
            return parse_expression(parsed, errors);
          };
          var test = Local_117(parsed, errors);
          parsed.Actionvars["expression"] = parsed.value;
          return test;
        };
        if (!Local_116(parsed, errors)) {
          pos = Local_114;
          return false;
        }
        var Local_118 = function(parsed, errors) {
          return parse_rparen(parsed, errors);
        };
        if (!Local_118(parsed, errors)) {
          pos = Local_114;
          return false;
        }
        return true;
      };
      var Local_113 = parsed.Actionvars;
      parsed.Actionvars = {};
      var test = Local_112(parsed, errors);
      if (test) {
        parsed.value = function(expression) {
          return expression;
        }(parsed.Actionvars["expression"]);
      }
      parsed.Actionvars = Local_113;
      return test;
    };
    if (Local_111(parsed, errors)) {
      return true;
    }
    pos = Local_93;
    return false;
  };
  var parse_action = function(parsed, errors) {
    var Local_119 = function(parsed, errors) {
      var Local_121 = pos;
      var Local_122 = function(parsed, errors) {
        var Local_123 = function(parsed, errors) {
          return parse_braced(parsed, errors);
        };
        var test = Local_123(parsed, errors);
        parsed.Actionvars["braced"] = parsed.value;
        return test;
      };
      if (!Local_122(parsed, errors)) {
        pos = Local_121;
        return false;
      }
      var Local_124 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_124(parsed, errors)) {
        pos = Local_121;
        return false;
      }
      return true;
    };
    var Local_120 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_119(parsed, errors);
    if (test) {
      parsed.value = function(braced) {
        return braced.substr(1, braced.length - 2);
      }(parsed.Actionvars["braced"]);
    }
    parsed.Actionvars = Local_120;
    return test;
  };
  var parse_braced = function(parsed, errors) {
    var Local_125 = function(parsed, errors) {
      var Local_127 = pos;
      var Local_128 = function(parsed, errors) {
        var Local_129 = source.charCodeAt(pos) === 123;
        if (!Local_129) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "{";
        return true;
      };
      if (!Local_128(parsed, errors)) {
        pos = Local_127;
        return false;
      }
      var Local_130 = function(parsed, errors) {
        var Local_131 = function(parsed, errors) {
          var Local_132 = function(parsed, errors) {
            var Local_133 = pos;
            var Local_134 = function(parsed, errors) {
              return parse_braced(parsed, errors);
            };
            if (Local_134(parsed, errors)) {
              return true;
            }
            var Local_135 = function(parsed, errors) {
              return parse_nonBraceCharacter(parsed, errors);
            };
            if (Local_135(parsed, errors)) {
              return true;
            }
            pos = Local_133;
            return false;
          };
          var test = [];
          while (Local_132(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_131(parsed, errors);
        parsed.Actionvars["parts"] = parsed.value;
        return test;
      };
      if (!Local_130(parsed, errors)) {
        pos = Local_127;
        return false;
      }
      var Local_136 = function(parsed, errors) {
        var Local_137 = source.charCodeAt(pos) === 125;
        if (!Local_137) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "}";
        return true;
      };
      if (!Local_136(parsed, errors)) {
        pos = Local_127;
        return false;
      }
      return true;
    };
    var Local_126 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_125(parsed, errors);
    if (test) {
      parsed.value = function(parts) {
        return "{" + parts.join("") + "}";
      }(parsed.Actionvars["parts"]);
    }
    parsed.Actionvars = Local_126;
    return test;
  };
  var parse_nonBraceCharacters = function(parsed, errors) {
    var Local_138 = function(parsed, errors) {
      var Local_140 = function(parsed, errors) {
        var Local_141 = function(parsed, errors) {
          return parse_nonBraceCharacter(parsed, errors);
        };
        var test = [];
        if (!Local_141(parsed, errors)) {
          return false;
        }
        test.push(parsed.value);
        while (Local_141(parsed, errors)) {
          test.push(parsed.value);
        }
        parsed.value = test;
        return true;
      };
      var test = Local_140(parsed, errors);
      parsed.Actionvars["chars"] = parsed.value;
      return test;
    };
    var Local_139 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_138(parsed, errors);
    if (test) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_139;
    return test;
  };
  var parse_nonBraceCharacter = function(parsed, errors) {
    var Local_142 = {
      "123": true,
      "125": true
    };
    if (!Local_142[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse_equals = function(parsed, errors) {
    var Local_143 = function(parsed, errors) {
      var Local_145 = pos;
      var Local_146 = function(parsed, errors) {
        var Local_147 = source.charCodeAt(pos) === 61;
        if (!Local_147) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "=";
        return true;
      };
      if (!Local_146(parsed, errors)) {
        pos = Local_145;
        return false;
      }
      var Local_148 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_148(parsed, errors)) {
        pos = Local_145;
        return false;
      }
      return true;
    };
    var Local_144 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_143(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "=";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_144;
    return test;
  };
  var parse_colon = function(parsed, errors) {
    var Local_149 = function(parsed, errors) {
      var Local_151 = pos;
      var Local_152 = function(parsed, errors) {
        var Local_153 = source.charCodeAt(pos) === 58;
        if (!Local_153) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = ":";
        return true;
      };
      if (!Local_152(parsed, errors)) {
        pos = Local_151;
        return false;
      }
      var Local_154 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_154(parsed, errors)) {
        pos = Local_151;
        return false;
      }
      return true;
    };
    var Local_150 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_149(parsed, errors);
    if (test) {
      parsed.value = function() {
        return ":";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_150;
    return test;
  };
  var parse_semicolon = function(parsed, errors) {
    var Local_155 = function(parsed, errors) {
      var Local_157 = pos;
      var Local_158 = function(parsed, errors) {
        var Local_159 = source.charCodeAt(pos) === 59;
        if (!Local_159) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = ";";
        return true;
      };
      if (!Local_158(parsed, errors)) {
        pos = Local_157;
        return false;
      }
      var Local_160 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_160(parsed, errors)) {
        pos = Local_157;
        return false;
      }
      return true;
    };
    var Local_156 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_155(parsed, errors);
    if (test) {
      parsed.value = function() {
        return ";";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_156;
    return test;
  };
  var parse_slash = function(parsed, errors) {
    var Local_161 = function(parsed, errors) {
      var Local_163 = pos;
      var Local_164 = function(parsed, errors) {
        var Local_165 = source.charCodeAt(pos) === 47;
        if (!Local_165) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "/";
        return true;
      };
      if (!Local_164(parsed, errors)) {
        pos = Local_163;
        return false;
      }
      var Local_166 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_166(parsed, errors)) {
        pos = Local_163;
        return false;
      }
      return true;
    };
    var Local_162 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_161(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "/";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_162;
    return test;
  };
  var parse_and = function(parsed, errors) {
    var Local_167 = function(parsed, errors) {
      var Local_169 = pos;
      var Local_170 = function(parsed, errors) {
        var Local_171 = source.charCodeAt(pos) === 38;
        if (!Local_171) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "&";
        return true;
      };
      if (!Local_170(parsed, errors)) {
        pos = Local_169;
        return false;
      }
      var Local_172 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_172(parsed, errors)) {
        pos = Local_169;
        return false;
      }
      return true;
    };
    var Local_168 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_167(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "&";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_168;
    return test;
  };
  var parse_not = function(parsed, errors) {
    var Local_173 = function(parsed, errors) {
      var Local_175 = pos;
      var Local_176 = function(parsed, errors) {
        var Local_177 = source.charCodeAt(pos) === 33;
        if (!Local_177) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "!";
        return true;
      };
      if (!Local_176(parsed, errors)) {
        pos = Local_175;
        return false;
      }
      var Local_178 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_178(parsed, errors)) {
        pos = Local_175;
        return false;
      }
      return true;
    };
    var Local_174 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_173(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "!";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_174;
    return test;
  };
  var parse_question = function(parsed, errors) {
    var Local_179 = function(parsed, errors) {
      var Local_181 = pos;
      var Local_182 = function(parsed, errors) {
        var Local_183 = source.charCodeAt(pos) === 63;
        if (!Local_183) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "?";
        return true;
      };
      if (!Local_182(parsed, errors)) {
        pos = Local_181;
        return false;
      }
      var Local_184 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_184(parsed, errors)) {
        pos = Local_181;
        return false;
      }
      return true;
    };
    var Local_180 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_179(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "?";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_180;
    return test;
  };
  var parse_star = function(parsed, errors) {
    var Local_185 = function(parsed, errors) {
      var Local_187 = pos;
      var Local_188 = function(parsed, errors) {
        var Local_189 = source.charCodeAt(pos) === 42;
        if (!Local_189) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "*";
        return true;
      };
      if (!Local_188(parsed, errors)) {
        pos = Local_187;
        return false;
      }
      var Local_190 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_190(parsed, errors)) {
        pos = Local_187;
        return false;
      }
      return true;
    };
    var Local_186 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_185(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "*";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_186;
    return test;
  };
  var parse_plus = function(parsed, errors) {
    var Local_191 = function(parsed, errors) {
      var Local_193 = pos;
      var Local_194 = function(parsed, errors) {
        var Local_195 = source.charCodeAt(pos) === 43;
        if (!Local_195) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "+";
        return true;
      };
      if (!Local_194(parsed, errors)) {
        pos = Local_193;
        return false;
      }
      var Local_196 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_196(parsed, errors)) {
        pos = Local_193;
        return false;
      }
      return true;
    };
    var Local_192 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_191(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "+";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_192;
    return test;
  };
  var parse_lparen = function(parsed, errors) {
    var Local_197 = function(parsed, errors) {
      var Local_199 = pos;
      var Local_200 = function(parsed, errors) {
        var Local_201 = source.charCodeAt(pos) === 40;
        if (!Local_201) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "(";
        return true;
      };
      if (!Local_200(parsed, errors)) {
        pos = Local_199;
        return false;
      }
      var Local_202 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_202(parsed, errors)) {
        pos = Local_199;
        return false;
      }
      return true;
    };
    var Local_198 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_197(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "(";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_198;
    return test;
  };
  var parse_rparen = function(parsed, errors) {
    var Local_203 = function(parsed, errors) {
      var Local_205 = pos;
      var Local_206 = function(parsed, errors) {
        var Local_207 = source.charCodeAt(pos) === 41;
        if (!Local_207) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = ")";
        return true;
      };
      if (!Local_206(parsed, errors)) {
        pos = Local_205;
        return false;
      }
      var Local_208 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_208(parsed, errors)) {
        pos = Local_205;
        return false;
      }
      return true;
    };
    var Local_204 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_203(parsed, errors);
    if (test) {
      parsed.value = function() {
        return ")";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_204;
    return test;
  };
  var parse_dot = function(parsed, errors) {
    var Local_209 = function(parsed, errors) {
      var Local_211 = pos;
      var Local_212 = function(parsed, errors) {
        var Local_213 = source.charCodeAt(pos) === 46;
        if (!Local_213) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = ".";
        return true;
      };
      if (!Local_212(parsed, errors)) {
        pos = Local_211;
        return false;
      }
      var Local_214 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_214(parsed, errors)) {
        pos = Local_211;
        return false;
      }
      return true;
    };
    var Local_210 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_209(parsed, errors);
    if (test) {
      parsed.value = function() {
        return ".";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_210;
    return test;
  };
  var parse_identifier = function(parsed, errors) {
    var Local_215 = function(parsed, errors) {
      var Local_217 = pos;
      var Local_218 = function(parsed, errors) {
        var Local_219 = function(parsed, errors) {
          var Local_220 = pos;
          var Local_221 = function(parsed, errors) {
            return parse_letter(parsed, errors);
          };
          if (Local_221(parsed, errors)) {
            return true;
          }
          var Local_222 = function(parsed, errors) {
            var Local_223 = source.charCodeAt(pos) === 95;
            if (!Local_223) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "_";
            return true;
          };
          if (Local_222(parsed, errors)) {
            return true;
          }
          var Local_224 = function(parsed, errors) {
            var Local_225 = source.charCodeAt(pos) === 36;
            if (!Local_225) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "$";
            return true;
          };
          if (Local_224(parsed, errors)) {
            return true;
          }
          pos = Local_220;
          return false;
        };
        var test = Local_219(parsed, errors);
        parsed.Actionvars["head"] = parsed.value;
        return test;
      };
      if (!Local_218(parsed, errors)) {
        pos = Local_217;
        return false;
      }
      var Local_226 = function(parsed, errors) {
        var Local_227 = function(parsed, errors) {
          var Local_228 = function(parsed, errors) {
            var Local_229 = pos;
            var Local_230 = function(parsed, errors) {
              return parse_letter(parsed, errors);
            };
            if (Local_230(parsed, errors)) {
              return true;
            }
            var Local_231 = function(parsed, errors) {
              return parse_digit(parsed, errors);
            };
            if (Local_231(parsed, errors)) {
              return true;
            }
            var Local_232 = function(parsed, errors) {
              var Local_233 = source.charCodeAt(pos) === 95;
              if (!Local_233) {
                pos = pos - 0;
                return false;
              }
              pos = pos + 1;
              parsed.value = "_";
              return true;
            };
            if (Local_232(parsed, errors)) {
              return true;
            }
            var Local_234 = function(parsed, errors) {
              var Local_235 = source.charCodeAt(pos) === 36;
              if (!Local_235) {
                pos = pos - 0;
                return false;
              }
              pos = pos + 1;
              parsed.value = "$";
              return true;
            };
            if (Local_234(parsed, errors)) {
              return true;
            }
            pos = Local_229;
            return false;
          };
          var test = [];
          while (Local_228(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_227(parsed, errors);
        parsed.Actionvars["tail"] = parsed.value;
        return test;
      };
      if (!Local_226(parsed, errors)) {
        pos = Local_217;
        return false;
      }
      var Local_236 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_236(parsed, errors)) {
        pos = Local_217;
        return false;
      }
      return true;
    };
    var Local_216 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_215(parsed, errors);
    if (test) {
      parsed.value = function(head, tail) {
        return head + tail.join("");
      }(parsed.Actionvars["head"], parsed.Actionvars["tail"]);
    }
    parsed.Actionvars = Local_216;
    return test;
  };
  var parse_literal = function(parsed, errors) {
    var Local_237 = function(parsed, errors) {
      var Local_239 = pos;
      var Local_240 = function(parsed, errors) {
        var Local_241 = function(parsed, errors) {
          var Local_242 = pos;
          var Local_243 = function(parsed, errors) {
            return parse_doubleQuotedString(parsed, errors);
          };
          if (Local_243(parsed, errors)) {
            return true;
          }
          var Local_244 = function(parsed, errors) {
            return parse_singleQuotedString(parsed, errors);
          };
          if (Local_244(parsed, errors)) {
            return true;
          }
          pos = Local_242;
          return false;
        };
        var test = Local_241(parsed, errors);
        parsed.Actionvars["value"] = parsed.value;
        return test;
      };
      if (!Local_240(parsed, errors)) {
        pos = Local_239;
        return false;
      }
      var Local_245 = function(parsed, errors) {
        var Local_246 = function(parsed, errors) {
          var Local_247 = function(parsed, errors) {
            var Local_248 = source.charCodeAt(pos) === 105;
            if (!Local_248) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "i";
            return true;
          };
          if (!Local_247(parsed, errors)) {
            parsed.value = "";
          }
          return true;
        };
        var test = Local_246(parsed, errors);
        parsed.Actionvars["flags"] = parsed.value;
        return test;
      };
      if (!Local_245(parsed, errors)) {
        pos = Local_239;
        return false;
      }
      var Local_249 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_249(parsed, errors)) {
        pos = Local_239;
        return false;
      }
      return true;
    };
    var Local_238 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_237(parsed, errors);
    if (test) {
      parsed.value = function(value, flags) {
        return {
          type: "Literal",
          Literal: value,
          ignoreCase: flags === "i"
        };
      }(parsed.Actionvars["value"], parsed.Actionvars["flags"]);
    }
    parsed.Actionvars = Local_238;
    return test;
  };
  var parse_string = function(parsed, errors) {
    var Local_250 = function(parsed, errors) {
      var Local_252 = pos;
      var Local_253 = function(parsed, errors) {
        var Local_254 = function(parsed, errors) {
          var Local_255 = pos;
          var Local_256 = function(parsed, errors) {
            return parse_doubleQuotedString(parsed, errors);
          };
          if (Local_256(parsed, errors)) {
            return true;
          }
          var Local_257 = function(parsed, errors) {
            return parse_singleQuotedString(parsed, errors);
          };
          if (Local_257(parsed, errors)) {
            return true;
          }
          pos = Local_255;
          return false;
        };
        var test = Local_254(parsed, errors);
        parsed.Actionvars["string"] = parsed.value;
        return test;
      };
      if (!Local_253(parsed, errors)) {
        pos = Local_252;
        return false;
      }
      var Local_258 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_258(parsed, errors)) {
        pos = Local_252;
        return false;
      }
      return true;
    };
    var Local_251 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_250(parsed, errors);
    if (test) {
      parsed.value = function(string) {
        return string;
      }(parsed.Actionvars["string"]);
    }
    parsed.Actionvars = Local_251;
    return test;
  };
  var parse_doubleQuotedString = function(parsed, errors) {
    var Local_259 = function(parsed, errors) {
      var Local_261 = pos;
      var Local_262 = function(parsed, errors) {
        var Local_263 = source.charCodeAt(pos) === 34;
        if (!Local_263) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = '"';
        return true;
      };
      if (!Local_262(parsed, errors)) {
        pos = Local_261;
        return false;
      }
      var Local_264 = function(parsed, errors) {
        var Local_265 = function(parsed, errors) {
          var Local_266 = function(parsed, errors) {
            return parse_doubleQuotedCharacter(parsed, errors);
          };
          var test = [];
          while (Local_266(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_265(parsed, errors);
        parsed.Actionvars["chars"] = parsed.value;
        return test;
      };
      if (!Local_264(parsed, errors)) {
        pos = Local_261;
        return false;
      }
      var Local_267 = function(parsed, errors) {
        var Local_268 = source.charCodeAt(pos) === 34;
        if (!Local_268) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = '"';
        return true;
      };
      if (!Local_267(parsed, errors)) {
        pos = Local_261;
        return false;
      }
      return true;
    };
    var Local_260 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_259(parsed, errors);
    if (test) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_260;
    return test;
  };
  var parse_doubleQuotedCharacter = function(parsed, errors) {
    var Local_269 = pos;
    var Local_270 = function(parsed, errors) {
      return parse_simpleDoubleQuotedCharacter(parsed, errors);
    };
    if (Local_270(parsed, errors)) {
      return true;
    }
    var Local_271 = function(parsed, errors) {
      return parse_simpleEscapeSequence(parsed, errors);
    };
    if (Local_271(parsed, errors)) {
      return true;
    }
    var Local_272 = function(parsed, errors) {
      return parse_zeroEscapeSequence(parsed, errors);
    };
    if (Local_272(parsed, errors)) {
      return true;
    }
    var Local_273 = function(parsed, errors) {
      return parse_hexEscapeSequence(parsed, errors);
    };
    if (Local_273(parsed, errors)) {
      return true;
    }
    var Local_274 = function(parsed, errors) {
      return parse_unicodeEscapeSequence(parsed, errors);
    };
    if (Local_274(parsed, errors)) {
      return true;
    }
    var Local_275 = function(parsed, errors) {
      return parse_eolEscapeSequence(parsed, errors);
    };
    if (Local_275(parsed, errors)) {
      return true;
    }
    pos = Local_269;
    return false;
  };
  var parse_simpleDoubleQuotedCharacter = function(parsed, errors) {
    var Local_276 = function(parsed, errors) {
      var Local_278 = pos;
      var Local_279 = function(parsed, errors) {
        var Local_280 = function(parsed, errors) {
          var Local_281 = pos;
          var Local_282 = function(parsed, errors) {
            var Local_283 = source.charCodeAt(pos) === 34;
            if (!Local_283) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = '"';
            return true;
          };
          if (Local_282(parsed, errors)) {
            return true;
          }
          var Local_284 = function(parsed, errors) {
            var Local_285 = source.charCodeAt(pos) === 92;
            if (!Local_285) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "\\";
            return true;
          };
          if (Local_284(parsed, errors)) {
            return true;
          }
          var Local_286 = function(parsed, errors) {
            return parse_eolChar(parsed, errors);
          };
          if (Local_286(parsed, errors)) {
            return true;
          }
          pos = Local_281;
          return false;
        };
        return !Local_280(parsed, errors);
      };
      if (!Local_279(parsed, errors)) {
        pos = Local_278;
        return false;
      }
      var Local_287 = function(parsed, errors) {
        var Local_288 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        var test = Local_288(parsed, errors);
        parsed.Actionvars["char_"] = parsed.value;
        return test;
      };
      if (!Local_287(parsed, errors)) {
        pos = Local_278;
        return false;
      }
      return true;
    };
    var Local_277 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_276(parsed, errors);
    if (test) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_277;
    return test;
  };
  var parse_singleQuotedString = function(parsed, errors) {
    var Local_289 = function(parsed, errors) {
      var Local_291 = pos;
      var Local_292 = function(parsed, errors) {
        var Local_293 = source.charCodeAt(pos) === 39;
        if (!Local_293) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "'";
        return true;
      };
      if (!Local_292(parsed, errors)) {
        pos = Local_291;
        return false;
      }
      var Local_294 = function(parsed, errors) {
        var Local_295 = function(parsed, errors) {
          var Local_296 = function(parsed, errors) {
            return parse_singleQuotedCharacter(parsed, errors);
          };
          var test = [];
          while (Local_296(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_295(parsed, errors);
        parsed.Actionvars["chars"] = parsed.value;
        return test;
      };
      if (!Local_294(parsed, errors)) {
        pos = Local_291;
        return false;
      }
      var Local_297 = function(parsed, errors) {
        var Local_298 = source.charCodeAt(pos) === 39;
        if (!Local_298) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "'";
        return true;
      };
      if (!Local_297(parsed, errors)) {
        pos = Local_291;
        return false;
      }
      return true;
    };
    var Local_290 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_289(parsed, errors);
    if (test) {
      parsed.value = function(chars) {
        return chars.join("");
      }(parsed.Actionvars["chars"]);
    }
    parsed.Actionvars = Local_290;
    return test;
  };
  var parse_singleQuotedCharacter = function(parsed, errors) {
    var Local_299 = pos;
    var Local_300 = function(parsed, errors) {
      return parse_simpleSingleQuotedCharacter(parsed, errors);
    };
    if (Local_300(parsed, errors)) {
      return true;
    }
    var Local_301 = function(parsed, errors) {
      return parse_simpleEscapeSequence(parsed, errors);
    };
    if (Local_301(parsed, errors)) {
      return true;
    }
    var Local_302 = function(parsed, errors) {
      return parse_zeroEscapeSequence(parsed, errors);
    };
    if (Local_302(parsed, errors)) {
      return true;
    }
    var Local_303 = function(parsed, errors) {
      return parse_hexEscapeSequence(parsed, errors);
    };
    if (Local_303(parsed, errors)) {
      return true;
    }
    var Local_304 = function(parsed, errors) {
      return parse_unicodeEscapeSequence(parsed, errors);
    };
    if (Local_304(parsed, errors)) {
      return true;
    }
    var Local_305 = function(parsed, errors) {
      return parse_eolEscapeSequence(parsed, errors);
    };
    if (Local_305(parsed, errors)) {
      return true;
    }
    pos = Local_299;
    return false;
  };
  var parse_simpleSingleQuotedCharacter = function(parsed, errors) {
    var Local_306 = function(parsed, errors) {
      var Local_308 = pos;
      var Local_309 = function(parsed, errors) {
        var Local_310 = function(parsed, errors) {
          var Local_311 = pos;
          var Local_312 = function(parsed, errors) {
            var Local_313 = source.charCodeAt(pos) === 39;
            if (!Local_313) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "'";
            return true;
          };
          if (Local_312(parsed, errors)) {
            return true;
          }
          var Local_314 = function(parsed, errors) {
            var Local_315 = source.charCodeAt(pos) === 92;
            if (!Local_315) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "\\";
            return true;
          };
          if (Local_314(parsed, errors)) {
            return true;
          }
          var Local_316 = function(parsed, errors) {
            return parse_eolChar(parsed, errors);
          };
          if (Local_316(parsed, errors)) {
            return true;
          }
          pos = Local_311;
          return false;
        };
        return !Local_310(parsed, errors);
      };
      if (!Local_309(parsed, errors)) {
        pos = Local_308;
        return false;
      }
      var Local_317 = function(parsed, errors) {
        var Local_318 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        var test = Local_318(parsed, errors);
        parsed.Actionvars["char_"] = parsed.value;
        return test;
      };
      if (!Local_317(parsed, errors)) {
        pos = Local_308;
        return false;
      }
      return true;
    };
    var Local_307 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_306(parsed, errors);
    if (test) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_307;
    return test;
  };
  var parse_class = function(parsed, errors) {
    var Local_319 = function(parsed, errors) {
      var Local_321 = pos;
      var Local_322 = function(parsed, errors) {
        var Local_323 = source.charCodeAt(pos) === 91;
        if (!Local_323) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "[";
        return true;
      };
      if (!Local_322(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      var Local_324 = function(parsed, errors) {
        var Local_325 = function(parsed, errors) {
          var Local_326 = function(parsed, errors) {
            var Local_327 = source.charCodeAt(pos) === 94;
            if (!Local_327) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "^";
            return true;
          };
          if (!Local_326(parsed, errors)) {
            parsed.value = "";
          }
          return true;
        };
        var test = Local_325(parsed, errors);
        parsed.Actionvars["inverted"] = parsed.value;
        return test;
      };
      if (!Local_324(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      var Local_328 = function(parsed, errors) {
        var Local_329 = function(parsed, errors) {
          var Local_330 = function(parsed, errors) {
            var Local_331 = pos;
            var Local_332 = function(parsed, errors) {
              return parse_classCharacterRange(parsed, errors);
            };
            if (Local_332(parsed, errors)) {
              return true;
            }
            var Local_333 = function(parsed, errors) {
              return parse_classCharacter(parsed, errors);
            };
            if (Local_333(parsed, errors)) {
              return true;
            }
            pos = Local_331;
            return false;
          };
          var test = [];
          while (Local_330(parsed, errors)) {
            test.push(parsed.value);
          }
          parsed.value = test;
          return true;
        };
        var test = Local_329(parsed, errors);
        parsed.Actionvars["parts"] = parsed.value;
        return test;
      };
      if (!Local_328(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      var Local_334 = function(parsed, errors) {
        var Local_335 = source.charCodeAt(pos) === 93;
        if (!Local_335) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "]";
        return true;
      };
      if (!Local_334(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      var Local_336 = function(parsed, errors) {
        var Local_337 = function(parsed, errors) {
          var Local_338 = function(parsed, errors) {
            var Local_339 = source.charCodeAt(pos) === 105;
            if (!Local_339) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "i";
            return true;
          };
          if (!Local_338(parsed, errors)) {
            parsed.value = "";
          }
          return true;
        };
        var test = Local_337(parsed, errors);
        parsed.Actionvars["flags"] = parsed.value;
        return test;
      };
      if (!Local_336(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      var Local_340 = function(parsed, errors) {
        return parse___(parsed, errors);
      };
      if (!Local_340(parsed, errors)) {
        pos = Local_321;
        return false;
      }
      return true;
    };
    var Local_320 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_319(parsed, errors);
    if (test) {
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
    parsed.Actionvars = Local_320;
    return test;
  };
  var parse_classCharacterRange = function(parsed, errors) {
    var Local_341 = function(parsed, errors) {
      var Local_343 = pos;
      var Local_344 = function(parsed, errors) {
        var Local_345 = function(parsed, errors) {
          return parse_classCharacter(parsed, errors);
        };
        var test = Local_345(parsed, errors);
        parsed.Actionvars["begin"] = parsed.value;
        return test;
      };
      if (!Local_344(parsed, errors)) {
        pos = Local_343;
        return false;
      }
      var Local_346 = function(parsed, errors) {
        var Local_347 = source.charCodeAt(pos) === 45;
        if (!Local_347) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "-";
        return true;
      };
      if (!Local_346(parsed, errors)) {
        pos = Local_343;
        return false;
      }
      var Local_348 = function(parsed, errors) {
        var Local_349 = function(parsed, errors) {
          return parse_classCharacter(parsed, errors);
        };
        var test = Local_349(parsed, errors);
        parsed.Actionvars["end"] = parsed.value;
        return test;
      };
      if (!Local_348(parsed, errors)) {
        pos = Local_343;
        return false;
      }
      return true;
    };
    var Local_342 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_341(parsed, errors);
    if (test) {
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
    parsed.Actionvars = Local_342;
    return test;
  };
  var parse_classCharacter = function(parsed, errors) {
    var Local_350 = function(parsed, errors) {
      var Local_352 = function(parsed, errors) {
        return parse_bracketDelimitedCharacter(parsed, errors);
      };
      var test = Local_352(parsed, errors);
      parsed.Actionvars["char_"] = parsed.value;
      return test;
    };
    var Local_351 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_350(parsed, errors);
    if (test) {
      parsed.value = function(char_) {
        return {
          data: char_,
          rawText: quote(char_)
        };
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_351;
    return test;
  };
  var parse_bracketDelimitedCharacter = function(parsed, errors) {
    var Local_353 = pos;
    var Local_354 = function(parsed, errors) {
      return parse_simpleBracketDelimitedCharacter(parsed, errors);
    };
    if (Local_354(parsed, errors)) {
      return true;
    }
    var Local_355 = function(parsed, errors) {
      return parse_simpleEscapeSequence(parsed, errors);
    };
    if (Local_355(parsed, errors)) {
      return true;
    }
    var Local_356 = function(parsed, errors) {
      return parse_zeroEscapeSequence(parsed, errors);
    };
    if (Local_356(parsed, errors)) {
      return true;
    }
    var Local_357 = function(parsed, errors) {
      return parse_hexEscapeSequence(parsed, errors);
    };
    if (Local_357(parsed, errors)) {
      return true;
    }
    var Local_358 = function(parsed, errors) {
      return parse_unicodeEscapeSequence(parsed, errors);
    };
    if (Local_358(parsed, errors)) {
      return true;
    }
    var Local_359 = function(parsed, errors) {
      return parse_eolEscapeSequence(parsed, errors);
    };
    if (Local_359(parsed, errors)) {
      return true;
    }
    pos = Local_353;
    return false;
  };
  var parse_simpleBracketDelimitedCharacter = function(parsed, errors) {
    var Local_360 = function(parsed, errors) {
      var Local_362 = pos;
      var Local_363 = function(parsed, errors) {
        var Local_364 = function(parsed, errors) {
          var Local_365 = pos;
          var Local_366 = function(parsed, errors) {
            var Local_367 = source.charCodeAt(pos) === 93;
            if (!Local_367) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "]";
            return true;
          };
          if (Local_366(parsed, errors)) {
            return true;
          }
          var Local_368 = function(parsed, errors) {
            var Local_369 = source.charCodeAt(pos) === 92;
            if (!Local_369) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "\\";
            return true;
          };
          if (Local_368(parsed, errors)) {
            return true;
          }
          var Local_370 = function(parsed, errors) {
            return parse_eolChar(parsed, errors);
          };
          if (Local_370(parsed, errors)) {
            return true;
          }
          pos = Local_365;
          return false;
        };
        return !Local_364(parsed, errors);
      };
      if (!Local_363(parsed, errors)) {
        pos = Local_362;
        return false;
      }
      var Local_371 = function(parsed, errors) {
        var Local_372 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        var test = Local_372(parsed, errors);
        parsed.Actionvars["char_"] = parsed.value;
        return test;
      };
      if (!Local_371(parsed, errors)) {
        pos = Local_362;
        return false;
      }
      return true;
    };
    var Local_361 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_360(parsed, errors);
    if (test) {
      parsed.value = function(char_) {
        return char_;
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_361;
    return test;
  };
  var parse_simpleEscapeSequence = function(parsed, errors) {
    var Local_373 = function(parsed, errors) {
      var Local_375 = pos;
      var Local_376 = function(parsed, errors) {
        var Local_377 = source.charCodeAt(pos) === 92;
        if (!Local_377) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "\\";
        return true;
      };
      if (!Local_376(parsed, errors)) {
        pos = Local_375;
        return false;
      }
      var Local_378 = function(parsed, errors) {
        var Local_379 = function(parsed, errors) {
          var Local_380 = pos;
          var Local_381 = function(parsed, errors) {
            return parse_digit(parsed, errors);
          };
          if (Local_381(parsed, errors)) {
            return true;
          }
          var Local_382 = function(parsed, errors) {
            var Local_383 = source.charCodeAt(pos) === 120;
            if (!Local_383) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "x";
            return true;
          };
          if (Local_382(parsed, errors)) {
            return true;
          }
          var Local_384 = function(parsed, errors) {
            var Local_385 = source.charCodeAt(pos) === 117;
            if (!Local_385) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            parsed.value = "u";
            return true;
          };
          if (Local_384(parsed, errors)) {
            return true;
          }
          var Local_386 = function(parsed, errors) {
            return parse_eolChar(parsed, errors);
          };
          if (Local_386(parsed, errors)) {
            return true;
          }
          pos = Local_380;
          return false;
        };
        return !Local_379(parsed, errors);
      };
      if (!Local_378(parsed, errors)) {
        pos = Local_375;
        return false;
      }
      var Local_387 = function(parsed, errors) {
        var Local_388 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        var test = Local_388(parsed, errors);
        parsed.Actionvars["char_"] = parsed.value;
        return test;
      };
      if (!Local_387(parsed, errors)) {
        pos = Local_375;
        return false;
      }
      return true;
    };
    var Local_374 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_373(parsed, errors);
    if (test) {
      parsed.value = function(char_) {
        return char_.replace("b", "\b").replace("f", "\f").replace("n", "\n").replace("r", "\r").replace("t", "\t").replace("v", "");
      }(parsed.Actionvars["char_"]);
    }
    parsed.Actionvars = Local_374;
    return test;
  };
  var parse_zeroEscapeSequence = function(parsed, errors) {
    var Local_389 = function(parsed, errors) {
      var Local_391 = pos;
      var Local_392 = function(parsed, errors) {
        var Local_393 = source.charCodeAt(pos) === 92;
        if (!Local_393) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        var Local_394 = source.charCodeAt(pos) === 48;
        if (!Local_394) {
          pos = pos - 1;
          return false;
        }
        pos = pos + 1;
        parsed.value = "\\0";
        return true;
      };
      if (!Local_392(parsed, errors)) {
        pos = Local_391;
        return false;
      }
      var Local_395 = function(parsed, errors) {
        var Local_396 = function(parsed, errors) {
          return parse_digit(parsed, errors);
        };
        return !Local_396(parsed, errors);
      };
      if (!Local_395(parsed, errors)) {
        pos = Local_391;
        return false;
      }
      return true;
    };
    var Local_390 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_389(parsed, errors);
    if (test) {
      parsed.value = function() {
        return "\0";
      }(parsed.Actionvars[""]);
    }
    parsed.Actionvars = Local_390;
    return test;
  };
  var parse_hexEscapeSequence = function(parsed, errors) {
    var Local_397 = function(parsed, errors) {
      var Local_399 = pos;
      var Local_400 = function(parsed, errors) {
        var Local_401 = source.charCodeAt(pos) === 92;
        if (!Local_401) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        var Local_402 = source.charCodeAt(pos) === 120;
        if (!Local_402) {
          pos = pos - 1;
          return false;
        }
        pos = pos + 1;
        parsed.value = "\\x";
        return true;
      };
      if (!Local_400(parsed, errors)) {
        pos = Local_399;
        return false;
      }
      var Local_403 = function(parsed, errors) {
        var Local_404 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_404(parsed, errors);
        parsed.Actionvars["h1"] = parsed.value;
        return test;
      };
      if (!Local_403(parsed, errors)) {
        pos = Local_399;
        return false;
      }
      var Local_405 = function(parsed, errors) {
        var Local_406 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_406(parsed, errors);
        parsed.Actionvars["h2"] = parsed.value;
        return test;
      };
      if (!Local_405(parsed, errors)) {
        pos = Local_399;
        return false;
      }
      return true;
    };
    var Local_398 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_397(parsed, errors);
    if (test) {
      parsed.value = function(h1, h2) {
        return String.fromCharCode(parseInt(h1 + h2, 16));
      }(parsed.Actionvars["h1"], parsed.Actionvars["h2"]);
    }
    parsed.Actionvars = Local_398;
    return test;
  };
  var parse_unicodeEscapeSequence = function(parsed, errors) {
    var Local_407 = function(parsed, errors) {
      var Local_409 = pos;
      var Local_410 = function(parsed, errors) {
        var Local_411 = source.charCodeAt(pos) === 92;
        if (!Local_411) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        var Local_412 = source.charCodeAt(pos) === 117;
        if (!Local_412) {
          pos = pos - 1;
          return false;
        }
        pos = pos + 1;
        parsed.value = "\\u";
        return true;
      };
      if (!Local_410(parsed, errors)) {
        pos = Local_409;
        return false;
      }
      var Local_413 = function(parsed, errors) {
        var Local_414 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_414(parsed, errors);
        parsed.Actionvars["h1"] = parsed.value;
        return test;
      };
      if (!Local_413(parsed, errors)) {
        pos = Local_409;
        return false;
      }
      var Local_415 = function(parsed, errors) {
        var Local_416 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_416(parsed, errors);
        parsed.Actionvars["h2"] = parsed.value;
        return test;
      };
      if (!Local_415(parsed, errors)) {
        pos = Local_409;
        return false;
      }
      var Local_417 = function(parsed, errors) {
        var Local_418 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_418(parsed, errors);
        parsed.Actionvars["h3"] = parsed.value;
        return test;
      };
      if (!Local_417(parsed, errors)) {
        pos = Local_409;
        return false;
      }
      var Local_419 = function(parsed, errors) {
        var Local_420 = function(parsed, errors) {
          return parse_hexDigit(parsed, errors);
        };
        var test = Local_420(parsed, errors);
        parsed.Actionvars["h4"] = parsed.value;
        return test;
      };
      if (!Local_419(parsed, errors)) {
        pos = Local_409;
        return false;
      }
      return true;
    };
    var Local_408 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_407(parsed, errors);
    if (test) {
      parsed.value = function(h1, h2, h3, h4) {
        return String.fromCharCode(parseInt(h1 + h2 + h3 + h4, 16));
      }(parsed.Actionvars["h1"], parsed.Actionvars["h2"], parsed.Actionvars["h3"], parsed.Actionvars["h4"]);
    }
    parsed.Actionvars = Local_408;
    return test;
  };
  var parse_eolEscapeSequence = function(parsed, errors) {
    var Local_421 = function(parsed, errors) {
      var Local_423 = pos;
      var Local_424 = function(parsed, errors) {
        var Local_425 = source.charCodeAt(pos) === 92;
        if (!Local_425) {
          pos = pos - 0;
          return false;
        }
        pos = pos + 1;
        parsed.value = "\\";
        return true;
      };
      if (!Local_424(parsed, errors)) {
        pos = Local_423;
        return false;
      }
      var Local_426 = function(parsed, errors) {
        var Local_427 = function(parsed, errors) {
          return parse_eol(parsed, errors);
        };
        var test = Local_427(parsed, errors);
        parsed.Actionvars["eol"] = parsed.value;
        return test;
      };
      if (!Local_426(parsed, errors)) {
        pos = Local_423;
        return false;
      }
      return true;
    };
    var Local_422 = parsed.Actionvars;
    parsed.Actionvars = {};
    var test = Local_421(parsed, errors);
    if (test) {
      parsed.value = function(eol) {
        return eol;
      }(parsed.Actionvars["eol"]);
    }
    parsed.Actionvars = Local_422;
    return test;
  };
  var parse_digit = function(parsed, errors) {
    var Local_428 = {
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
    if (Local_428[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse_hexDigit = function(parsed, errors) {
    var Local_429 = {
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
    if (Local_429[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse_letter = function(parsed, errors) {
    var Local_430 = pos;
    var Local_431 = function(parsed, errors) {
      return parse_lowerCaseLetter(parsed, errors);
    };
    if (Local_431(parsed, errors)) {
      return true;
    }
    var Local_432 = function(parsed, errors) {
      return parse_upperCaseLetter(parsed, errors);
    };
    if (Local_432(parsed, errors)) {
      return true;
    }
    pos = Local_430;
    return false;
  };
  var parse_lowerCaseLetter = function(parsed, errors) {
    var Local_433 = {
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
    if (Local_433[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse_upperCaseLetter = function(parsed, errors) {
    var Local_434 = {
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
    if (Local_434[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse___ = function(parsed, errors) {
    var Local_435 = function(parsed, errors) {
      var Local_436 = pos;
      var Local_437 = function(parsed, errors) {
        return parse_whitespace(parsed, errors);
      };
      if (Local_437(parsed, errors)) {
        return true;
      }
      var Local_438 = function(parsed, errors) {
        return parse_eol(parsed, errors);
      };
      if (Local_438(parsed, errors)) {
        return true;
      }
      var Local_439 = function(parsed, errors) {
        return parse_comment(parsed, errors);
      };
      if (Local_439(parsed, errors)) {
        return true;
      }
      pos = Local_436;
      return false;
    };
    var test = [];
    while (Local_435(parsed, errors)) {
      test.push(parsed.value);
    }
    parsed.value = test;
    return true;
  };
  var parse_comment = function(parsed, errors) {
    var Local_440 = pos;
    var Local_441 = function(parsed, errors) {
      return parse_singleLineComment(parsed, errors);
    };
    if (Local_441(parsed, errors)) {
      return true;
    }
    var Local_442 = function(parsed, errors) {
      return parse_multiLineComment(parsed, errors);
    };
    if (Local_442(parsed, errors)) {
      return true;
    }
    pos = Local_440;
    return false;
  };
  var parse_singleLineComment = function(parsed, errors) {
    var Local_443 = pos;
    var Local_444 = function(parsed, errors) {
      var Local_445 = source.charCodeAt(pos) === 47;
      if (!Local_445) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      var Local_446 = source.charCodeAt(pos) === 47;
      if (!Local_446) {
        pos = pos - 1;
        return false;
      }
      pos = pos + 1;
      parsed.value = "//";
      return true;
    };
    if (!Local_444(parsed, errors)) {
      pos = Local_443;
      return false;
    }
    var Local_447 = function(parsed, errors) {
      var Local_448 = function(parsed, errors) {
        var Local_449 = pos;
        var Local_450 = function(parsed, errors) {
          var Local_451 = function(parsed, errors) {
            return parse_eolChar(parsed, errors);
          };
          return !Local_451(parsed, errors);
        };
        if (!Local_450(parsed, errors)) {
          pos = Local_449;
          return false;
        }
        var Local_452 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        if (!Local_452(parsed, errors)) {
          pos = Local_449;
          return false;
        }
        return true;
      };
      var test = [];
      while (Local_448(parsed, errors)) {
        test.push(parsed.value);
      }
      parsed.value = test;
      return true;
    };
    if (!Local_447(parsed, errors)) {
      pos = Local_443;
      return false;
    }
    return true;
  };
  var parse_multiLineComment = function(parsed, errors) {
    var Local_453 = pos;
    var Local_454 = function(parsed, errors) {
      var Local_455 = source.charCodeAt(pos) === 47;
      if (!Local_455) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      var Local_456 = source.charCodeAt(pos) === 42;
      if (!Local_456) {
        pos = pos - 1;
        return false;
      }
      pos = pos + 1;
      parsed.value = "/*";
      return true;
    };
    if (!Local_454(parsed, errors)) {
      pos = Local_453;
      return false;
    }
    var Local_457 = function(parsed, errors) {
      var Local_458 = function(parsed, errors) {
        var Local_459 = pos;
        var Local_460 = function(parsed, errors) {
          var Local_461 = function(parsed, errors) {
            var Local_462 = source.charCodeAt(pos) === 42;
            if (!Local_462) {
              pos = pos - 0;
              return false;
            }
            pos = pos + 1;
            var Local_463 = source.charCodeAt(pos) === 47;
            if (!Local_463) {
              pos = pos - 1;
              return false;
            }
            pos = pos + 1;
            parsed.value = "*/";
            return true;
          };
          return !Local_461(parsed, errors);
        };
        if (!Local_460(parsed, errors)) {
          pos = Local_459;
          return false;
        }
        var Local_464 = function(parsed, errors) {
          if (pos < source.length) {
            parsed.value = source.charAt(pos);
            pos = pos + 1;
            return true;
          } else {
            return false;
          }
        };
        if (!Local_464(parsed, errors)) {
          pos = Local_459;
          return false;
        }
        return true;
      };
      var test = [];
      while (Local_458(parsed, errors)) {
        test.push(parsed.value);
      }
      parsed.value = test;
      return true;
    };
    if (!Local_457(parsed, errors)) {
      pos = Local_453;
      return false;
    }
    var Local_465 = function(parsed, errors) {
      var Local_466 = source.charCodeAt(pos) === 42;
      if (!Local_466) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      var Local_467 = source.charCodeAt(pos) === 47;
      if (!Local_467) {
        pos = pos - 1;
        return false;
      }
      pos = pos + 1;
      parsed.value = "*/";
      return true;
    };
    if (!Local_465(parsed, errors)) {
      pos = Local_453;
      return false;
    }
    return true;
  };
  var parse_eol = function(parsed, errors) {
    var Local_468 = pos;
    var Local_469 = function(parsed, errors) {
      var Local_470 = source.charCodeAt(pos) === 10;
      if (!Local_470) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      parsed.value = "\n";
      return true;
    };
    if (Local_469(parsed, errors)) {
      return true;
    }
    var Local_471 = function(parsed, errors) {
      var Local_472 = source.charCodeAt(pos) === 13;
      if (!Local_472) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      var Local_473 = source.charCodeAt(pos) === 10;
      if (!Local_473) {
        pos = pos - 1;
        return false;
      }
      pos = pos + 1;
      parsed.value = "\r\n";
      return true;
    };
    if (Local_471(parsed, errors)) {
      return true;
    }
    var Local_474 = function(parsed, errors) {
      var Local_475 = source.charCodeAt(pos) === 13;
      if (!Local_475) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      parsed.value = "\r";
      return true;
    };
    if (Local_474(parsed, errors)) {
      return true;
    }
    var Local_476 = function(parsed, errors) {
      var Local_477 = source.charCodeAt(pos) === 8232;
      if (!Local_477) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      parsed.value = "\u2028";
      return true;
    };
    if (Local_476(parsed, errors)) {
      return true;
    }
    var Local_478 = function(parsed, errors) {
      var Local_479 = source.charCodeAt(pos) === 8233;
      if (!Local_479) {
        pos = pos - 0;
        return false;
      }
      pos = pos + 1;
      parsed.value = "\u2029";
      return true;
    };
    if (Local_478(parsed, errors)) {
      return true;
    }
    pos = Local_468;
    return false;
  };
  var parse_eolChar = function(parsed, errors) {
    var Local_480 = {
      "10": true,
      "13": true,
      "8232": true,
      "8233": true
    };
    if (Local_480[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var parse_whitespace = function(parsed, errors) {
    var Local_481 = {
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
    if (Local_481[source.charCodeAt(pos)]) {
      parsed.value = source.charAt(pos);
      pos = pos + 1;
      return true;
    } else {
      return false;
    }
  };
  var test = {};
  var parsed = parse_start(test, {});
  if (pos !== length) {
    console.log(pos);
    return false;
  }
  return parsed;
};