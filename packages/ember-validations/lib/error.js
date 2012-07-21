/**
   @class

   This class corresponds to an error due to an invalid state.
   Its basically a key and a message.

   Class methods give the ability to map the key to a message, and override
   default messages easily by using `addMessage`, or by overriding `getMessage`.

 */
Ember.ValidationError = Ember.Object.extend(/** @scope Ember.ValidationError.prototype */{
  /**
      The message key
   */
  key: null,

  /**
     A custom message which has priority over `key`
  */
  customMessage: null,

  /**
     A property that returns the custom message if set, or the message corresponding to the key else.

     @property {String}
   */
  message: Ember.computed('key', 'customMessage', function() {
    var customMessage = this.get('customMessage');
    return customMessage ? customMessage : Ember.ValidationError.getMessage(this.get('key'));
  })
});

Ember.ValidationError.reopenClass(/** @scope Ember.ValidationError */{

  /**
      The object used to map message keys and values.
   */
  messages: {},

  /**
     Add or override a message defined by the key passed as argument.

     @param {String} key
     @param {String} message
   */
  addMessage: function(key, message) {
    this.messages[key] = message;
  },

  /**
     Return the message associated to the key passed as argument.

     Override this method for a custom behaviour (i.e. for internationalization).

     @param {String} key
     @returns {String}
      The message associated to the key, or undefined
   */
  getMessage: function(key) {
    return this.messages[key];
  }
});