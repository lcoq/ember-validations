require('ember-validations/~tests/validators_helper');

var vClass = Ember.Validators.LengthValidator;

module("Ember.Validators.LengthValidator");

testBothValidities(
  "minimum option", vClass, {minimum: 3},
  "123",
  "12", {tooShortLength: "is too short (minimum 3 characters)"}
);

testBothValidities(
  "minimum option with function", vClass, {minimum: function() { return 3; }},
  "123",
  "12", {tooShortLength: "is too short (minimum 3 characters)"}
);

testBothValidities(
  "maximum option", vClass, {maximum: 3},
  "123",
  "1234", {tooLongLength: "is too long (maximum 3 characters)"}
);

testBothValidities(
  "is option", vClass, {is: 3},
  "123",
  "12", {wrongLength: "is the wrong length (should be 3 characters)"}
);

testBothValidities(
  "with value option", vClass, {value: 3},
  "abc",
  "ab", {wrongLength: "is the wrong length (should be 3 characters)"}
);

testNoError(
  "allowBlank option", vClass, {allowBlank: true, minimum: 3}, ""
);
