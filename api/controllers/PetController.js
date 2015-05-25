/**
 * PetController
 *
 * @description :: Server-side logic for managing pets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function (req, res) {
        res.view();
  	},
	index: function (req, res) {
		Pet.find(function foundPet (err, pets) {
			if(err) return res.redirect('/pet/new');
			res.view({
				pets: pets
			});
		});
	},
  create: function(req, res) {
      Pet.create(req.params.all(), function petCreated(err, pet) {
        if (err) {
        //Assign the error to the session.flash
            req.session.flash = {
            	err: err
            };
            return res.redirect('/pet/new');
        }
        res.redirect('/pet/show/' + pet.id); 
      });
    },
  show: function(req, res) {
    Pet.findOne(req.param('id'))
    .populate('pet_breed')
    .populate('pet_image')
    .exec(function(err,pet) {
      res.view({
        breeds: pet.pet_breed,
        files: [pet.pet_image],
        pet: pet
      });
    });
  },
  edit: function (req, res) {
	    // Find the user from the id passed in via params
	    Pet.findOne(req.param('id'), function foundPet (err, pet) {
	      if (err) return res.serverError(err);
	      if (!pet) return res.serverError(err);
	      res.view({
	        pet: pet
	      });
	    });
	},
  update: function(req, res, next) {

      var petObj = {
        name: req.param('name'),
        id_chip: req.param('id_chip')
      }
      Pet.update(req.param('id'), petObj, function petUpdated(err) {
        if (err) {
          return res.redirect('/pet/edit/' + req.param('id'));
        }
        res.redirect('/pet/show/' + req.param('id'));
      });
    },  
  destroy: function(req, res, next) {
    Pet.findOne(req.param('id'), function foundPet(err, pet) {
      if (err) return next(err);
      if (!pet) return next('Pet doesn\'t exist.');

      Pet.destroy(req.param('id'), function petDestroyed(err) {
        if (err) return next(err);
          res.redirect('/pet/');
      });
    });
  },

  // ASSOCIATE BREED - PET (N-N)

  associateBreed: function(req, res, next) {
    Breed.find(function foundBreeds(err, breeds) {
      if (err) return next(err);
      res.view({
        breeds: breeds,
        pet_id: req.param('id')
      });
    });
  },

  deassociateBreed: function(req,res,next){
    var breed_id = req.param('breed_id');
    var pet_id = req.param('pet_id');
    
    Breed.findOne(breed_id, function foundBreed(err, breed) {
      if (err) return next(err);
      if (!breed) return next();

      breed.breed.remove(pet_id);
      breed.save(function createDeassociation(err, saved) {
        
        if (err) res.redirect('/pet/show/' + pet_id);
        res.redirect('/pet/show/' + pet_id);
      });
    });
  },
      
  associateBreedToPet: function(req,res,next){
    var breed_id = req.param('breed_id');
    var pet_id = req.param('pet_id');

    Breed.findOne({id:breed_id})
    .then(function(breed) {
      breed.breed.add(pet_id);
      return breed.save().fail(function() {
        sails.log.info('Pet already has that breed!');
      });
    })
    .then(function(){
      res.redirect('/pet/show/' + pet_id);
    })
    .fail(function(err) {
      sails.log.error('Unexpected error: ' +err);
      res.redirect('/breed/associatePet/');
    });
  },

  // ASSOCIATE PET - FILE (1-1)

  associateFile: function(req, res, next) {
    File.find(function foundFiles(err, files) {
      if (err) return next(err);
      res.view({
        files: files,
        pet_id: req.param('id')
      });
    });
  },

  deassociateFile: function(req,res,next){
    var file_id = req.param('file_id');
    var pet_id = req.param('pet_id');
    
    File.findOne(breed_id, function foundFile(err, file) {
      if (err) return next(err);
      if (!file) return next();

      file.image.remove(pet_id);
      file.save(function createDeassociation(err, saved) {
        
        if (err) res.redirect('/pet/show/' + pet_id);
        res.redirect('/pet/show/' + pet_id);
      });
    });
  },
      
  associateFileToPet: function(req,res,next){
    var file_id = req.param('file_id');
    var pet_id = req.param('pet_id');

    File.findOne(file_id, function foundFile(err, file) {
      if (err) return next(err);
      if (!file) return next();

      Pet.update(pet_id, {pet_image:file}, function petUpdated(err) {
          if (err) {
            return res.redirect('/pet/associateFile/');
          }
          res.redirect('/pet/show/' + pet_id);
      });
    });
  }

};

