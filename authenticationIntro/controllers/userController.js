var User = require('../models/user');
module.exports = {
    login: function(req, res, next) {
        console.log(req.body)
        if (req.body.logemail && req.body.logpassword) {
            User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                console.log("----",user)
                if (error || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/profile');
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    },
    signUp: function(req, res, next) {
        console.log("trace1")
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.send("passwords dont match");
            return next(err);
        }
        if (req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.passwordConf) {
        
            var userData = {
              email: req.body.email,
              username: req.body.username,
              password: req.body.password,
              passwordConf: req.body.passwordConf,
              accessRole: req.body.accessRole
            }
            var query = {email: req.body.email};
            User.find(query)
            .exec(function (error, user_return) {
                if (error) {
                    return next(error);
                } else {
                    console.log(user_return)
                    if (user_return && user_return.length>0) {
                        return res.send("user aready exist")
                    } else {
                        console.log(userData)
                        User.create(userData, function (error, user) {
                            if (error) {
                                return next(error);
                            } else {
                                console.log(">>>",user)
                                req.session.userId = user._id;
                                return res.redirect('/profile');
                            }
                        });    
                    }
                }
            });        
        }else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    },
    profile: function(req, res, next){
        try{
            User.findById(req.session.userId)
            .exec(function (error, user) {
              if (error) {
                return next(error);
              } else {
                if (user === null) {
                  var err = new Error('Not authorized! Go back!');
                  err.status = 400;
                  return next(err);
                } else {
                  return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
              }
            });
        }catch(e){
            console.log(e);
            return res.status(400).send({ status: false, message: e })
        }
    },
    logout: function(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
              if (err) {
                return next(err);
              } else {
                return res.redirect('/');
              }
            });
        }
    },
    getUser: function(req,res,next){
        try{
            var query = {};
            if(req.body.id){
                query = {_id : req.body.id}
            }
            console.log("----",req.session.userId);
            User.find(query)
            .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send(user)
                }
            }
            });
        }catch(e){
            return res.status(400).send({ status: false, message: e })
        }
    },
    updateUser: function(req,res,next){
        try{
            if(req.body.id){
                query = {_id : req.body.id}
            }
            delete req.body.id;
            User.findOneAndUpdate(query,
            {$set : req.body})
            .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('User Data Updated succesfully')
                }
            }
            });
        }catch(e){
            return res.status(400).send({ status: false, message: e })
        }
    },
    deleteUser: function(req,res,next){
        try{
            var query;
            if(req.body.id){
                query = {_id : req.body.id}
            }
            User.remove(query)
            .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send(user)
                }
            }
            });
        }catch(e){
            return res.status(400).send({ status: false, message: e })
        }
    }
}