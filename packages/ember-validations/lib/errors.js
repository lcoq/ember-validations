Ember.ValidationErrors = Ember.Object.extend({
  init: function() {
    this._super();
    if (this.get('messages') === undefined) {
      this.clear();
    }
  },

  add: function(path, message) {
    var messages = this.get('messages');
    if (messages.get(path) === undefined) {
      messages.set(path, Ember.A());
    }
    messages.get(path).pushObject(message);
    this.set('messages', messages);
  },

  clear: function() {
    this.set('messages', Ember.Object.create());
  }
});