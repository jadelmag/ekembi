/**
* Breed.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},
  	color: {
  		type: 'string',
  		required: true
  	},
  	country: {
  		type: 'string',
  		required: true,
  		unique: true
  	},

    // ASSOCIATIONS

    breed: {
      collection: 'Pet',
      via: 'pet_breed'
    },

  	toJSON: function() {
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }
  }
};

