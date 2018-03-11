let mongoose = require('mongoose');
const config = require('../config/config.json');
mongoose.Promise = Promise;

const node_acl = require( 'acl' );
global.acl;

function connectMongoDB() {
    let connectionString = '';
    if (config.mongo.username && config.mongo.password) {
        connectionString = "mongodb://" + config.mongo.username + ":" + config.mongo.password + '@' + config.mongo.mongohost+"/"+ config.mongo.database;
    }else{
        connectionString = "mongodb://" + config.mongo.mongohost +"/"+ config.mongo.database;
    }
    //CONNECT WITH MONGOOSE
    mongoose.connect(connectionString, { useMongoClient: true }, callbackFun );

    function callbackFun(error, db){
        var mongoBackend = new node_acl.mongodbBackend( db );
        acl = new node_acl( mongoBackend, logger() );
        console.log("set roles")
        // set roles
        set_roles();
    }

    function logger() {
        return {
            debug: function( msg ) {
                console.log( 'LOG : ', msg );
            }
        };
    }

    mongoose.connection.on('connected', function() {
        console.log('Mongo database connection estabilished successfully. ');
    });

    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected');
    });

    process.on('exit', function() {
        console.log('Goodbye!!! Node Server stoped');
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    function set_roles() {

    // Define roles, resources and permissions
    acl.allow([
            {
                roles: 'admin',
                allows: [
                    { resources: '*', permissions: '*' }
                ]
            }, {
                roles: 'user',
                allows: [
                    { resources: '/login', permissions: 'post' },
                    { resources: '/signup', permissions: 'post' },
                    { resources: '/profile', permissions: 'get' },
                    { resources: '/getUser', permissions: 'post' },
                    { resources: '/updateUser', permissions: 'post' },
                    { resources: '/deleteUser', permissions: 'post' }
                ]
            }, {
                roles: 'guest',
                allows: []
            }
        ]);
        // Inherit roles
        //  Every user is allowed to do what guests do
        //  Every admin is allowed to do what users do
        acl.addRoleParents( 'user', 'guest' );
        acl.addRoleParents( 'admin', 'user' );
    }
}

module.exports = {
    connectMongoDB: connectMongoDB
}