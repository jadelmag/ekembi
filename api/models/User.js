/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require("bcrypt");

module.exports = {

  attributes: {

  	name: {
  		type: 'string',
  		required: true
  	},
  	lastname: {
  		type: 'string',
  		required: true
  	},
  	email: {
  		type: 'email',
  		required: true,
  		unique: true
  	},
  	encryptedPassword: {
  		type: 'string'
  	},

    pets: {
      collection: 'Pet',
      via: 'owner'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }

  },

  beforeCreate: function (values, next) {
      // This checks to make sure the password and password confirmation match before creating record
      if (!values.password || values.password != values.confirmation) {
        return next({err: ["Password doesn't match password confirmation."]});
      }
          bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err);
          bcrypt.hash(values.password, salt, function passwordEncrypted(err, encryptedPass) {
          if (err) return next(err);
          values.encryptedPassword = encryptedPass;
          next();
      });
    });
  }

};

