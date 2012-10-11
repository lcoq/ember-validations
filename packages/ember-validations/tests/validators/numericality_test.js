require('ember-validations/~tests/validators_helper');

var vClass = Ember.Validators.NumericalityValidator;

module("Ember.Validators.NumericalityValidator");

testBothValidities(
  "no option", vClass, null,
  "54.321",
  "aNotNumberValue", {notNumber: "is not a number"}
);

testBothValidities(
  "onlyInteger option", vClass, {onlyInteger: true},
  "54",
  "54.321", {notInteger: "is not an integer"}
);

testBothValidities(
  "greaterThan option", vClass, {greaterThan: 12},
  "13",
  "12", {notGreaterThan: "is not greater than 12"}
);

testBothValidities(
  "greaterThan option", vClass, {greaterThan: function() { return 12; }},
  "13",
  "12", {notGreaterThan: "is not greater than 12"}
);

testBothValidities(
  "greaterThanOrEqualTo option", vClass, {greaterThanOrEqualTo: 12},
  "12",
  "11", {notGreaterThanOrEqualTo: "is not greater than or equal to 12"}
);

testBothValidities(
  "lessThan option", vClass, {lessThan: 12},
  "11",
  "12", {notLessThan: "is not less than 12"}
);

testBothValidities(
  "lessThanOrEqualTo option", vClass, {lessThanOrEqualTo: 12},
  "12",
  "13", {notLessThanOrEqualTo: "is not less than or equal to 12"}
);

testBothValidities(
  "equalTo option", vClass, {equalTo: 12},
  "12",
  "11", {notEqual: "is not equal to 12"}
);