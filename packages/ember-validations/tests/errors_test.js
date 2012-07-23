var content, expected, error, errors, moduleOpts = {
  setup: function() {
    errors = Ember.ValidationErrors.create();
  },
  teardown: function() {
    errors = null;
    error = null;
    expected = null;
  }
};
module("Ember.ValidationErrors", moduleOpts);

test("should be initialize with '_content' property", function() {
  ok(Ember.isArray(errors.get('_content')));
});

/* #add method */

// empty path

test("#add with empty path should add a ValidationError to _content", function() {
  errors.add('', 'cantBeBlank');

  content = errors.get('_content');
  equal(content.length, 1, "should have 1 error in its content");

  error = content[0];
  ok(Ember.ValidationError.detectInstance(error), "should be a ValidationError");
  equal(error.get('key'), 'cantBeBlank', "should set the error key");
});

// unknown path

test("#add with unknown no-dotted path should create an error at this path", function() {
  errors.add('name', 'cantBeBlank');
  ok(Ember.ValidationErrors.detectInstance(errors.get('name')), "nested error should be a ValidationErrors");

  content = errors.getPath('name._content');
  equal(content.length, 1, "nested error should have one error in its content");

  error = content[0];
  equal(error.get('key'), 'cantBeBlank', "should set the nested error key");
});

test("#add with unknown dotted path should create an error at this path", function() {
  errors.add('address.zipCode', 'shouldBeNumber');
  ok(Ember.ValidationErrors.detectInstance(errors.getPath('address.zipCode')), "nested error should be a ValidationErrors");

  content = errors.getPath('address.zipCode._content');
  equal(content.length, 1, "nested error should have one error in its content");

  error = content[0];
  equal(error.get('key'), 'shouldBeNumber', "should set the nested error key");
});

// known path

test("#add with known no-dotted path should add an error at this path", function() {
  errors.add('address', 'cantBeBlank');
  errors.add('address', 'wrongLength');

  content = errors.getPath('address._content');
  equal(content.length, 2, "nested error should have two errors in its content");
});

test("#add with known dotted path should add an error at this path", function() {
  errors.add('address.zipCode', 'cantBeBlank');
  errors.add('address.zipCode', 'shouldBeNumber');

  content = errors.getPath('address.zipCode._content');
  equal(content.length, 2, "nested error should have two errors in its content");
});


/* #clear method */

test("#clear should remove all errors in content", function() {
  content = Ember.A();
  for (var i = 0; i < 5; i++) {
    content.pushObject(Ember.ValidationError.create());
  }
  errors.set('_content', content);
  errors.clear();

  equal(content.length, 0, "content should be cleaned");
});

test("#clear should remove all error properties", function() {
  var i = 0,
      content = ['address', 'name', 'id', 'phone'],
      k = content.length;

  for (i = 0; i < k; i++) {
    errors.set(content[i], Ember.ValidationErrors.create());
  }
  errors.clear();

  for (i = 0; i < k; i++) {
    equal(errors.get(content[i]), null, "property '" + content[i] + "' is not cleaned");
  }
});

/* #keys property */

test("keys should return each content errors key", function() {
  content = ['foo', 'bar', 'baz'];
  expected = Ember.A();
  for (var i = 0, k = content.length; i < k; i++) {
    errors.add('', content[i]);
    expected.push(["", content[i]]);
  }
  deepEqual(errors.get('keys'), expected);
});

test("keys should return each error property key", function() {
  content = {
    'address': 'cantBeBlank',
    'address.zipCode': 'badZipCode',
    'address.city': 'badCity',
    'address.country': 'cantBeBlank',
    'address.country.language': 'cantBeBlank',
    'phone': 'wrongLength'
  };
  expected = Ember.A();
  for (var path in content) {
    if (!content.hasOwnProperty(path)) continue;
    errors.add(path, content[path]);
    expected.push([path, content[path]]);
  }
  deepEqual(errors.get('keys'), expected);
});