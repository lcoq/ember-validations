var get = Ember.get, set = Ember.set;

/**
   @class

   This class is responsible to handle a list of errors.
   These errors are defined with a path (for example: `user.address.city`).

 */
Ember.ValidationErrors = Ember.Object.extend(/** @scope Ember.ValidationErrors.prototype */{
  _nestedErrors: null,
  _content: null,

  /** @private */
  init: function() {
    this._super();
    this._resetErrors();
  },

  /**
     The array which contains each error paths and keys.

     A simple example :

         [['name', 'hasWrongLength'], ['address', 'cantBeBlank'], ['address.zipCode', 'isNaN'], ['address.city', 'cantBeBlank']]

     NOTE: If you get this property from a nested error (for example "errors.get('address.allKeys')",
     there could be empty path.

     With the same example, based on "address.allKeys":

         [['', 'cantBeBlank'], ['zipCode', 'isNaN'], ['city', 'cantBeBlank']]

     @property {Ember.Array}
   */
  allKeys: Ember.computed(function() {
    return this._allErrorsData('keys');
  }).property('length').cacheable(),

  /**
     The array which contains each error paths and messages. It works exactly like `allKeys` property.

     A simple example :

         [['name', 'should have between 2 and 10 characters'], ['address', 'can not be blank'], ['address.zipCode', 'should be a number'], ['address.city', 'can not be blank']]

    @property {Ember.Array}
   */
  allMessages: Ember.computed(function() {
    return this._allErrorsData('messages');
  }).property('length').cacheable(),


  /**
      The array which contains formatted messages with path.

      For eaxmple:

          ["can't be blank", "address.city should have at least 3 characters"]

      @property {Ember.Array}
  */
  fullMessages: Ember.computed(function() {
    return get(this, 'allMessages').map(function(m) {
      var msg = m[0];
      if (m[0] !== '') msg += ' ';
      msg += m[1];
      return msg;
    });
  }).property('allMessages').cacheable(),

  /**
     The array which contains each direct error keys.

     It differs from `allKeys` because no path is specified, it just returns error keys for the current path.

     A simple example :

         ['cantBeBlank', 'hasWrongLength', 'isNaN']

    @property
  */
  keys: Ember.computed(function() {
    var content = get(this, '_content'), keys = Ember.A();
    content.forEach(function(error) { keys.push(error.get('key')); });
    return keys;
  }).property('length').cacheable(),

  /**
     The array which contains each direct error messages.

     A simple example :

         ["can not be blank", "should have between 2 and 10 characters"]

    @property
   */
  messages: Ember.computed(function() {
    var content = get(this, '_content'), messages = Ember.A();
    content.forEach(function(error) { messages.push(error.get('message')); });
    return messages;
  }).property('length').cacheable(),

  /**
     The error count, including nested errors.

     @property
   */
  length: Ember.computed(function() {
    var length = 0,
        content = get(this, '_content'),
        errors = get(this, '_nestedErrors');

    length += content.length;
    errors.forEach(function(nestedErrorsPath, nestedErrors) { length += get(nestedErrors, 'length'); });
    return length;
  }).cacheable(),

  /** @private */
  unknownProperty: function(key) {
    var errors = get(this, '_nestedErrors');
    return errors.get(key);
  },

  /**
     Add an error.
     The attributePath could be:

       - A simple path (i.e. 'name')
       - A complete path (i.e. "address.country.code")
       - A falsy value, then the error is directly added to the error.

     @param {String} attributePath
     @param {String} key
     @param {Object} format contains message format values
     @param {Object} used to replace default message
   */
  add: function(attributePath, key, format, customMessage) {
    this.propertyWillChange('length');

    if (!attributePath) {
      var error = Ember.ValidationError.create({
        key: key,
        customMessage: customMessage,
        messageFormat: format
      });
      get(this, '_content').pushObject(error);

    } else {
      var attrPaths = this._pathsForAttribute(attributePath);
      var errors = this._getOrCreateNestedErrors(attrPaths['path']);
      errors.add(attrPaths['nestedPath'], key, format, customMessage);
    }

    this.propertyDidChange('length');
  },


  /**
     Remove an error depending on the `attributePath`.

     If the `attributePath` is empty, it will act as the `clear` method.
     Else, it remove all errors starting with this path.

     @param {String} attributePath
  */
  remove: function(attributePath) {
    this.propertyWillChange('length');
    if (!attributePath) {
      this._resetErrors();
    } else {
      var nestedErrors = get(this, '_nestedErrors'),
          attrPaths = this._pathsForAttribute(attributePath);
      var errors = nestedErrors.get(attrPaths['path']);
      if (errors) {
        errors.remove(attrPaths['nestedPath']);
      }
    }
    this.propertyDidChange('length');
  },

  /**
     Remove all errors (direct and nested).
   */
  clear: function() {
    this.propertyWillChange('length');
    this._resetErrors();
    this.propertyDidChange('length');
  },

  /** @private */
  _getOrCreateNestedErrors: function(path) {
    var nestedErrors = get(this, '_nestedErrors');
    var errors = nestedErrors.get(path);
    if (!errors) {
      errors = Ember.ValidationErrors.create();
      nestedErrors.set(path, errors);
    }
    return errors;
  },

  /** @private */
  _pathsForAttribute: function(attributePath) {
    var splittedPath = Ember.A(attributePath.split('.'));
    return {
      path: splittedPath[0],
      nestedPath: splittedPath.removeAt(0).join('.')
    };
  },

  /** @private */
  _resetErrors: function() {
    set(this, '_content', Ember.A());
    set(this, '_nestedErrors', Ember.Map.create());
  },


  /** @private */
  _allErrorsData: function(dataName) {
    var directData = get(this, dataName),
        data = Ember.A();
    directData.forEach(function(singleData) { data.push(['', singleData]); });

    var nestedErrors = get(this, '_nestedErrors');
    nestedErrors.forEach(function(path, errors) {
      var allErrorsDataPath = 'all' + dataName[0].toUpperCase() + dataName.slice(1);
      var allErrorsData = errors.get(allErrorsDataPath);

      allErrorsData.forEach(function(error) {
        var errorPath = path;
        if (error[0] !== '') errorPath += '.' + error[0];
        data.push([errorPath, error[1]]);
      });
    });

    return data;
  }
});
