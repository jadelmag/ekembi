/**
* Pet.js
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
    
  	id_chip: {
  		type: 'string',
  		required: true,
  		unique: true
  	},

    // ASSOCIATIONS

    owner: {
      model: 'User'
    },

    pet_breed: {
      collection: 'Breed',
      via: 'breed'
    },

    pet_image: {
      model: 'File'
    },

    // JSON

  	toJSON: function() {
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }
  }
};

