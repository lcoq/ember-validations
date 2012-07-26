var get = Ember.get, set = Ember.set, VError = Ember.ValidationError;

var error, count, incrementCount, originalErrorMessages, moduleOpts = {
  setup: function() {
    originalErrorMessages = Ember.ValidationError.messages;
    Ember.ValidationError.messages = {
      aKey: 'aMessage',
      anotherKey: 'a@{foo}Message'
    };
    count = 0;
    incrementCount = function() { count +=1 ;};
  },
  teardown: function() {
    Ember.ValidationError.messages = originalErrorMessages;
    error = null;
    count = 0;
    incrementCount = null;
  }
};
module("Ember.ValidationError", moduleOpts);

// class methods

test("should have a property 'messages'", function() {
  ok(VError.messages);
});

test("#addMessage should add a message", function() {
  VError.addMessage('foo', 'aMessage');
  equal(VError.messages['foo'], 'aMessage');
});

test("#addMessage should override existing message", function() {
  VError.addMessage('aKey', 'aNewMessage');
  equal(VError.messages['aKey'], 'aNewMessage');
});

test("#getMessage should return message matching the key passed", function() {
  equal(VError.getMessage('aKey'), 'aMessage');
});

test("#getMessage should return undefined when no message match", function() {
  equal(VError.getMessage('foo'), undefined);
});

// instance methods

test("should return undefined for 'message' property when both customMessage and key are not set", function() {
  error = VError.create();
  equal(get(error, 'message'), undefined);
});

test("should set 'message' property when the key is set", function() {
  error = VError.create({key: 'aKey'});
  equal(get(error, 'message'), 'aMessage');
});

test("should update 'message' property when the key changes", function() {
  error = VError.create({key: 'foo'});

  Ember.addObserver(error, 'message', incrementCount);
  set(error, 'key', 'aKey');

  equal(count, 1);
  equal(get(error, 'message'), 'aMessage');
});

test("should return 'customMessage' property when set", function() {
  error = VError.create({customMessage: 'foo'});
  equal(get(error, 'message'), 'foo');
});

test("should not return 'customMessage' property when falsy", function() {
  var messages = Ember.A([undefined, null, false]);
  messages.forEach(function(value) {
    error = VError.create({customMessage: value, key: 'aKey'});
    equal(get(error, 'message'), 'aMessage', "should return default message for customMessage '" + value +"'");
  });
});

test("should return 'customMessage' when both customMessage and key are set", function() {
  error = VError.create({customMessage: 'foo', key: 'aKey'});
  equal(get(error, 'message'), 'foo');
});

test("should update 'message' property when the customMessage changes", function() {
  error = VError.create({customMessage: 'foo'});

  Ember.addObserver(error, 'message', incrementCount);
  set(error, 'customMessage', 'bar');

  equal(count, 1);
  equal(get(error, 'message'), 'bar');
});

test("should return original message when no format are present in the message", function() {
  error = VError.create({
    customMessage:'foo bar.',
    messageFormat: {'length': '12'}
  });
  equal(get(error, 'message'), 'foo bar.');
});

test("should format message with 'messageFormat' properties when present", function() {
  error = VError.create({
    customMessage: "should have at least @{length} characters",
    messageFormat: {'length': '5'}
  });
  equal(get(error, 'message'), "should have at least 5 characters");
});

test("should return formatted default message when 'messageFormat' is present", function() {
  error = VError.create({
    key: 'anotherKey',
    messageFormat: {'foo': 'Formatted'}
  });
  equal(get(error, 'message'), "aFormattedMessage");
});

test("should not format message when 'messageFormat' is not present", function() {
  error = VError.create({
    customMessage: "at least @{length} chars"
  });
  equal(get(error, 'message'), "at least @{length} chars");
});