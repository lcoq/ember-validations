/*global testNoError:true, testHasErrors:true, testBothValidities:true */

var set = Ember.set, get = Ember.get;

testNoError = function(testName, validatorClass, validatorOptions, value) {
  test(testName + " with valid value '" + value + "'", function() {
    var model = Ember.Object.create({validationErrors: Ember.ValidationErrors.create()}),
        validator = validatorClass.create();

    if (validatorOptions) {
      set(validator, 'options', validatorOptions);
    }

    validator.validate(model, 'foo', value);
    ok(!get(model, 'validationErrors.foo'), "has no error");
  });
};

testHasErrors = function(testName, validatorClass, validatorOptions, value, expectedErrors) {
  test(testName + " with invalid value '" + value + "'", function() {
    var model = Ember.Object.create({validationErrors: Ember.ValidationErrors.create()}),
        validator = validatorClass.create();

    if (validatorOptions) {
      set(validator, 'options', validatorOptions);
    }

    validator.validate(model, 'foo', value);

    var errorKeys = get(model, 'validationErrors.foo.keys'),
        errorMsgs = get(model, 'validationErrors.foo.messages');
    ok(Ember.isArray(errorKeys), "has keys for error path 'validationErrors.foo.keys'");
    ok(Ember.isArray(errorMsgs), "has messages for error path 'validationErrors.foo.messages");

    for (var expectedErrorKey in expectedErrors) {
      if (!expectedErrors.hasOwnProperty(expectedErrorKey)) continue;
      var expectedErrorMsg = expectedErrors[expectedErrorKey];
      ok(errorKeys.contains(expectedErrorKey), "has error key '" + expectedErrorKey + "'");
      ok(errorMsgs.contains(expectedErrorMsg), "has error message '" + expectedErrorMsg + "'");
    }
  });
};

testBothValidities = function(testName, validatorClass, validatorOptions, validValue, invalidValue, expectedErrors) {
  testNoError(testName, validatorClass, validatorOptions, validValue);
  testHasErrors(testName, validatorClass, validatorOptions, invalidValue, expectedErrors);
};