Ember.ValidationErrors = Ember.Object.extend({
  _content: null,

  init: function() {
    this._super();
    this.set('_content', Ember.A());
  },

  keys: Ember.computed(function() {
    var keys = Ember.A(),
        content = this.get('_content'),
        errorProperties = this.get('_errorProperties'),
        i = 0,
        k = 0;

    /* add direct content */
    for (i = 0, k = content.length; i < k; i++) {
      keys.push(["", content[i].get('key')]);
    }

    /* add error keys */
    var errorProperties = this.get('_errorProperties');
    errorProperties.forEach(function(errorProperty) {

      var nestedKeys = this.get(errorProperty).get('keys');
      nestedKeys.forEach(function(nestedKey, nestedKeyIndex) {

        var nestedPath = errorProperty;
        if (nestedKey[0] !== '') {
          nestedPath += '.' + nestedKey[0];
        }
        nestedKeys[nestedKeyIndex] = [nestedPath, nestedKey[1]];
      });

      keys = keys.concat(nestedKeys);
    }, this);

    return keys;
  }),

  add: function(path, key) {
    var error;
    if (path === '') {
      error = Ember.ValidationError.create({key: key});
      this.get('_content').pushObject(error);
    } else {
      var splittedPath = Ember.A(path.split('.'));
      var firstPath = splittedPath[0];
      error = (this.get(firstPath)) ? this.get(firstPath) : Ember.ValidationErrors.create();
      error.add(splittedPath.removeAt(0).join('.'), key);
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
  })
});