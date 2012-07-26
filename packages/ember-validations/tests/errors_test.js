var get = Ember.get, set = Ember.set;

var errors, errorKeys, moduleOpts = {
  setup: function() {
    errors = Ember.ValidationErrors.create();
  },
  teardown: function() {
    errors = null;
    errorKeys = null;
  }
};
module("Ember.ValidationErrors", moduleOpts);

test("should be initialized without any error", function() {
  equal(errors.get('length'), 0, "should have no error");
});

test("add errors should change errors length", function() {
  errors.add('name', 'cantBeBlank');
  equal(get(errors, 'length'), 1, "has one error");

  errors.add('name', 'wrongLength');
  equal(get(errors, 'length'), 2, "has two errors");

  errors.add('bar', 'cantBeBlank');
  equal(get(errors, 'length'), 3, "has three errors");

  errors.add('address.city', 'cantBeBlank');
  equal(get(errors, 'length'), 4, "has four errors");

  errors.add(null, 'invalid');
  equal(get(errors, 'length'), 5, "has five errors");
});

test("remove errors should change errors length", function() {
  errorKeys = Ember.A(['name', 'name', 'bar', 'address', 'address.city']);
  var errorsLength = errorKeys.length;
  errorKeys.forEach(function(key) { errors.add(key, 'cantBeBlank'); });

  var errorCount = {
    'name': 2,
    'bar': 1,
    'address': 2
  };
  for (var key in errorCount) {
    errors.remove(key);
    errorsLength -= errorCount[key];
    equal(get(errors, 'length'), errorsLength, "has " + errorsLength + " errors after removing '" + key + "'");
  }
});

test("clear errors should set reset errors length", function() {
  errorKeys = Ember.A(['name', 'name', 'bar', 'address', 'address.city']);
  errorKeys.forEach(function(key) { errors.add(key, 'cantBeBlank'); });

  errors.clear();
  equal(get(errors, 'length'), 0, "did reset errors");
});

test("get keys should return all direct keys", function() {
  errorKeys = Ember.A(['cantBeBlank', 'wrongLength', 'isNaN']);
  errorKeys.forEach(function(key, index) {
    errors.add(null, key);
    var expectedLength = index + 1;
    equal(get(errors, 'length'), expectedLength, "name has " + expectedLength + " errors");
    deepEqual(get(errors, 'keys'), errorKeys.slice(0, expectedLength));
  });
});

test("get allKeys should return all keys (direct & nested)", function() {
  errorKeys = {
    '': ['cantBeBlank'],
    'name': ['wrongLength', 'isANumber'],
    'address': ['isInvalid'],
    'address.zipCode': ['isNaN', 'cantBeBlank']
  };
  var expected = [];
  var addError = function(err) {
    errors.add(key, err);
    expected.push([key, err]);
  };
  for (var key in errorKeys) {
    errorKeys[key].forEach(addError);
    deepEqual(get(errors, 'allKeys'), expected);
  }
});

test("get messages should return all direct messages", function() {
  var originalMessages = Ember.ValidationError.messages;
  Ember.ValidationError.messages = {
    'cantBeBlank': "can not be blank",
    'lengthTooShort': "at least @{length} chars",
    'lengthTooLong': "at most @{length} chars"
  };
  var expected = ["can not be blank"];
  errors.add(null, 'cantBeBlank');
  deepEqual(get(errors, 'messages'), expected, "has 'cantBeBlank' message");

  expected.push("at least @{length} chars");
  errors.add(null, 'lengthTooShort');
  deepEqual(get(errors, 'messages'), expected, "has 'lengthTooShort' message");

  expected.push("at most 12 chars");
  errors.add(null, 'lengthTooLong', {'length': '12'});
  deepEqual(get(errors, 'messages'), expected, "has 'lengthTooLong' formatted message");

  Ember.ValidationError.messages = originalMessages;
});
