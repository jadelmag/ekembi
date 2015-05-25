/**
 * BreedController
 *
 * @description :: Server-side logic for managing breeds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function (req, res) {
        res.view();
  	},
	index: function (req, res) {
		Breed.find(function foundBreed (err, breeds) {
			if(err) return res.redirect('/breed/new');
			res.view({
				breeds: breeds
			});
		});
	},
  	create: function(req, res) {
      Breed.create(req.params.all(), function breedCreated(err, breed) {
        if (err) {
        //Assign the error to the session.flash
            req.session.flash = {
            	err: err
            };
            return res.redirect('/breed/new');
        }
        res.redirect('/breed/show/' + breed.id); 
      });
    },
  	show: function(req, res) {
        Breed.findOne(req.param('id'), function foundBreed (err,breed) {
            if(err || !breed) return res.serverError(err);
            res.view({
                breed: breed
            });
        });
    },
  	edit: function (req, res) {
	    // Find the user from the id passed in via params
	    Breed.findOne(req.param('id'), function foundBreed (err, breed) {
	      if (err) return res.serverError(err);
	      if (!breed) return res.serverError(err);
	      res.view({
	        breed: breed
	      });
	    });
	},
  	update: function(req, res, next) {

      var breedObj = {
        name: req.param('name'),
        color: req.param('color'),
        country: req.param('country')
      }
      Breed.update(req.param('id'), breedObj, function breedUpdated(err) {
        if (err) {
          return res.redirect('/breed/edit/' + req.param('id'));
        }
        res.redirect('/breed/show/' + req.param('id'));
      });
    },  
  	destroy: function(req, res, next) {
    Breed.findOne(req.param('id'), function foundBreed(err, breed) {
      if (err) return next(err);
      if (!breed) return next('Breed doesn\'t exist.');

      Breed.destroy(req.param('id'), function breedDestroyed(err) {
        if (err) return next(err);
          res.redirect('/breed/');
      });
    });
  }
};

