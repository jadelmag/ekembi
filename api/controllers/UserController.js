/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function (req, res) {
        res.view();
  },
	index: function (req, res) {
		User.find(function foundUser (err, users) {
			if(err) return res.redirect('/user/new');
			res.view({
				users: users
			});
		});
	},
  create: function(req, res) {
      User.create(req.params.all(), function userCreated(err, user) {
        if (err) {
        //Assign the error to the session.flash
             req.session.flash = {
             err: err
             };
             return res.redirect('/user/new');
            }
          // Log user in
          if (req.session.authenticated == true) {
            res.redirect('/user/');
          }
          else {
            req.session.authenticated = true;
            req.session.User = user;

            res.redirect('/user/show/'+user.id);
          }
          
      });
  },
  show: function(req, res) {
    User.findOne(req.param('id'))
    .populate('pets')
    .exec(function(err,user) {
            //console.log(found);
            res.view({
              pets: user.pets,
              user: user
            });
        });
  },
  edit: function (req, res) {
    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.serverError(err);

      res.view({
        user: user
      });
    });
  },
  update: function(req, res, next) {

      var userObj = {
        name: req.param('name'),
        lastname: req.param('lastname'),
        email: req.param('email')
      }
      //req.params.all()
      User.update(req.param('id'), userObj, function userUpdated(err) {
        if (err) {
          return res.redirect('/user/edit/' + req.param('id'));
        }
        res.redirect('/user/show/' + req.param('id'));
      });
    },  
  // process the destroy action
  destroy: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

        if (user.id.toString() === req.session.User.id) {
          res.redirect('/session/destroy');
        }
        else {
          res.redirect('/user/');
        }
      });
    });
  },

  // ASSOCIATE USER - PET (1-N)

  associatePet: function(req, res, next) {
    Pet.find(function foundPets(err, pets) {
      if (err) return next(err);
      res.view({
        pets: pets,
        user_id: req.param('id')
      });
    });
  },

  deassociatePet: function(req,res,next){
    var pet_id = req.param('pet_id');
    var user_id = req.param('user_id');
    
    User.findOne(user_id, function foundPet(err, user) {
      if (err) return next(err);
      if (!user) return next();

      user.pets.remove(pet_id);
      user.save(function createDeassociation(err, saved) {
        
        if (err) res.redirect('/user/show/' + user_id);
        res.redirect('/user/show/' + user_id);
      });
    });
  },
      
  associatePetToUser: function(req,res,next){
    var pet_id = req.param('pet_id');
    var user_id = req.param('user_id');

    User.findOne({id:user_id}).then(function(user) {
      user.pets.add(pet_id);
      return user.save().fail(function() {
        sails.log.info('User already has that pet!');
      });
    })
    .then(function(){
      res.redirect('/user/show/' + user_id);
    })
    .fail(function(err) {
      sails.log.error('Unexpected error: ' +err);
      res.redirect('/user/associatePet/');
    });
  }
  
};

