var userController = require('../controllers/userController');

module.exports = function(app) {
    app.all('/*', function(req, res, next){
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'my-header,X-Requested-With,content-type,Authorization,cache-control');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    })

    // HOME PAGE (with login links)
    app.get('/', function(req, res,next) {
      return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
    });
    
    /** Login, sighnup and Reset password URL generate here.  */
    app.post('/login', userController.login);
    app.post('/signup',userController.signUp);
    console.log("asdsad")
    /** If you are already loggedin than access it. */
    app.get('/profile', userController.profile);
    app.get('/logout', userController.logout);
    app.post('/getUser',isLoggedIn, acl.middleware(1),userController.getUser);
    app.post('/updateUser',isLoggedIn,acl.middleware(1), userController.updateUser);
    app.post('/deleteUser',isLoggedIn,acl.middleware(1), userController.deleteUser);
};

function isLoggedIn(req, res, next) {
    if (req.session.userId){
        console.log(req.session.userId);
        next();
    }else{
        return res.status(500).send({status:false, message: 'SESSION_EXPIRED'});
    }
}