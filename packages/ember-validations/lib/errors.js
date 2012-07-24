Ember.ValidationErrors = Ember.Object.extend({
  _content: null,

  init: function() {
    this._super();
    this.set('_content', Ember.A());
  },

  keys: Ember.computed(function() {
    return this._getErrorsData('key');
  }),

  messages: Ember.computed(function() {
    return this._getErrorsData('message');
  }),

  fullMessages: Ember.computed(function() {
    var messages = this.get('messages'),
        fullMessages = Ember.A();
    messages.forEach(function(message) {
      var fullMsg = (message[0] !== '') ? (message[0] + ' ') : '';
      fullMsg += message[1];
      fullMessages.push(fullMsg);
    });
    return fullMessages;
  }),

  add: function(path, key, customMessage) {
    var error;
    if (path === '') {
      error = Ember.ValidationError.create({key: key, customMessage: customMessage});
      this.get('_content').pushObject(error);
    } else {
      var splittedPath = Ember.A(path.split('.'));
      var firstPath = splittedPath[0];
      error = (this.get(firstPath)) ? this.get(firstPath) : Ember.ValidationErrors.create();
      error.add(splittedPath.removeAt(0).join('.'), key, customMessage);
      this.set(firstPath, error);
    }
  },

  clear: function() {
    this.get('_content').clear();
    var errorProperties = this.get('_errorProperties');
    errorProperties.forEach(function(prop) {
      this.set(prop, null);
    }, this);
  },

  _errorProperties: Ember.computed(function() {
    var keys = [];
    for (var prop in this) {
      if (!this.hasOwnProperty(prop) || prop.match(/^_/)) continue;
      keys.push(prop);
    }
    return keys;
  }),

  _getErrorsData: function(dataName) {
    var data = Ember.A(),
        content = this.get('_content'),
        props = this.get('_errorProperties');

    for (var i = 0, k = content.length; i < k; i++) {
      data.push(['', content[i].get(dataName)]);
    }

    props.forEach(function(prop) {
      var nestedDataPath = prop + '.' + dataName + 's';
      var nestedData = this.getPath(nestedDataPath);

      nestedData.forEach(function(nestedD, index) {
        var nestedPath = prop;
        if (nestedD[0] !== '') nestedPath += '.' + nestedD[0];

        nestedData[index][0] = nestedPath;
      });
      data = data.concat(nestedData);
    }, this);
    return Ember.A(data);
  }
});