Ember.Validations = Ember.Mixin.create({
    init: function() {
        this._super();
        if (this.get('errors') === undefined) {
            this.set('errors', Ember.ValidationErrors.create());
        }
    },

    validate: function() {
        var validations = this.get('validations');
        var isValid = true;
        for (var attribute in validations) {
            if (!validations.hasOwnProperty(attribute)) continue;

            var attributeValidations = validations[attribute];
            for (var validationName in attributeValidations) {
                if (!attributeValidations.hasOwnProperty(validationName)) continue;

                var options = attributeValidations[validationName];
                var validator = Ember.Validators.getValidator(validationName, options);
                validator.validate(this, attribute, this.get(attribute));
            }
            var attributeMessages = this.getPath('errors.messages.' + attribute);
            if (attributeMessages && attributeMessages.length > 0) {
                isValid = false;
            }
        }
        this.set('isValid', isValid);
    }
});