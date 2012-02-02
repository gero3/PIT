/*
       * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
       * string literal except for the closing quote character, backslash,
       * carriage return, line separator, paragraph separator, and line feed.
       * Any character may appear in the form of an escape sequence.
       *
       * For portability, we also escape escape all control and non-ASCII
       * characters. Note that "\0" and "\v" escape sequences are not used
       * because JSHint does not like the first and IE the second.
       */

exports.stringEscape = function stringEscape(s) {
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  return s.replace(/\\/g, '\\\\') // backslash
  .replace(/"/g, '\\"') // closing double quote
  .replace(/\x08/g, '\\b') // backspace
  .replace(/\t/g, '\\t') // horizontal tab
  .replace(/\n/g, '\\n') // line feed
  .replace(/\f/g, '\\f') // form feed
  .replace(/\r/g, '\\r') // carriage return
  .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) {
    return '\\x0' + hex(ch);
  }).replace(/[\x10-\x1F\x80-\xFF]/g, function(ch) {
    return '\\x' + hex(ch);
  }).replace(/[\u0180-\u0FFF]/g, function(ch) {
    return '\\u0' + hex(ch);
  }).replace(/[\u1080-\uFFFF]/g, function(ch) {
    return '\\u' + hex(ch);
  });
};