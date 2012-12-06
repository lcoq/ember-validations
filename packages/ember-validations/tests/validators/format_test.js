require('ember-validations/~tests/validators_helper');

var vClass = Ember.Validators.FormatValidator;

module("Ember.Validators.FormatValidator");

testBothValidities(
  "with option with RegExp", vClass, {'with': /^abc/},
  "abcdef",
  "bcdef", {invalid: "is invalid"}
);

testBothValidities(
  "with option with RegExp returned by a function", vClass, {'with': function() { return new RegExp(/^abc/); }},
  "abcdef",
  "bcdef", {invalid: "is invalid"}
);

testBothValidities(
  "with option with string", vClass, {'with': "bcd"},
  "abcdef",
  "bdef", {invalid: "is invalid"}
);

testBothValidities(
  "without option with RegExp", vClass, {'without': /^abc/},
  "bcdef",
  "abcdef", {invalid: "is invalid"}
);

testBothValidities(
  "without option with string", vClass, {'without': "bcd"},
  "bdef",
  "abcdef", {invalid: "is invalid"}
);

testNoError(
  "allowBlank option", vClass, {allowBlank:true, 'with': "abc"}, ""
);
