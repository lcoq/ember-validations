var error, count, incrementCount, moduleOpts = {
  setup: function() {
    Ember.ValidationError.messages = {aKey: 'aMessage'};
    count = 0;
    incrementCount = function() { count +=1 ;};
  },
  teardown: function() {
    Ember.ValidationError.messages['aKey'] = undefined;
    error = null;
    count = 0;
    incrementCount = null;
  }
};
module("Ember.ValidationError", moduleOpts);

// class methods

test("should have a property 'messages'", function() {
  ok(Ember.ValidationError.messages);
});

test("#addMessage should add a message", function() {
  Ember.ValidationError.addMessage('foo', 'aMessage');
  equal(Ember.ValidationError.messages['foo'], 'aMessage');
});

test("#addMessage should override existing message", function() {
  Ember.ValidationError.addMessage('aKey', 'aNewMessage');
  equal(Ember.ValidationError.messages['aKey'], 'aNewMessage');
});

test("#getMessage should return message matching the key passed", function() {
  equal(Ember.ValidationError.getMessage('aKey'), 'aMessage');
});

test("#getMessage should return undefined when no message match", function() {
  equal(Ember.ValidationError.getMessage('foo'), undefined);
});


// instance methods

test("should return undefined for 'message' property when the key is not set", function() {
  error = Ember.ValidationError.create();
  equal(error.get('message'), undefined);
});

test("should set 'message' property when the key is set", function() {
  error = Ember.ValidationError.create({key: 'aKey'});
  equal(error.get('message'), 'aMessage');
});

test("should update 'message' property when the key changes", function() {
  error = Ember.ValidationError.create({key: 'foo'});

  Ember.addObserver(error, 'message', incrementCount);
  error.set('key', 'aKey');

  equal(count, 1);
  equal(error.get('message'), 'aMessage');
});

test("should return 'customMessage' property when set", function() {
  error = Ember.ValidationError.create({customMessage: 'foo'});
  equal(error.get('message'), 'foo');
});

test("should not return 'customMessage' property when falsy", function() {
  var messages = Ember.A([undefined, null, false]);
  messages.forEach(function(value) {
    error = Ember.ValidationError.create({customMessage: value, key: 'aKey'});
    equal(error.get('message'), 'aMessage', "should return default message for customMessage '" + value +"'");
  });
});

test("should return 'customMessage' when both customMessage and key are set", function() {
  error = Ember.ValidationError.create({customMessage: 'foo', key: 'aKey'});
  equal(error.get('message'), 'foo');
});

test("should update 'message' property when the customMessage changes", function() {
  error = Ember.ValidationError.create({customMessage: 'foo'});

  Ember.addObserver(error, 'message', incrementCount);
  error.set('customMessage', 'bar');

  equal(count, 1);
  equal(error.get('message'), 'bar');
});