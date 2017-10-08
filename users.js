var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
usersDB = new Db('usersdb', server);    

usersDB.open(function(err, usersDB) {
    if(!err) {
        console.log("Connected to 'usersdb' database");
        usersDB.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateUsersInDB();
            }
        });
    }
});


exports.findAll = function(req, res) {
    console.log('get all users');
    usersDB.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    try {
        var userId = new mongo.ObjectID(id);
        console.log('new mongo.ObjectID(id): ' + new mongo.ObjectID(id));

        usersDB.collection('users', function(err, collection) {
            collection.findOne({'_id': userId}, function(err, item) {
                console.log('error: '+ JSON.stringify(err))
                res.send(item);
            });
        });
        
    } catch(e) {
        var jsonResult = {'error': true, "message":'Invalid user.'};
        console.log(JSON.stringify(jsonResult));
        res.send(jsonResult);
    }
};

exports.addUser = function(req, res) {
    var user = req.body;
    if( !user.name || !user.password || user.name == "" || user.password == ""){
        
        var jsonResult = {'error': true, "message":'Incorrect user data'};
        console.log(JSON.stringify(jsonResult));
        res.send(jsonResult);
    }else {
        console.log('Adding user: ' + JSON.stringify(user));

        usersDB.collection('users', function(err, collection) {
            collection.find({'name': user.name}).toArray(function(err, items) {
                console.log("items: "+ JSON.stringify(items));
                if(items.length){
                    var jsonResult = {"error": true, "message": "User already exist" }
                    console.log(JSON.stringify(jsonResult));
                    res.send(jsonResult);
                }else {
                    
                    usersDB.collection('users', function(err, collection) {
                        collection.insert(user, {safe:true}, function(err, result) {
                            if (err) {
                                
                                var jsonResult = {'error': true, "message":'An error has occurred'};
                                console.log(JSON.stringify(jsonResult));
                                res.send(jsonResult);
                            } else {
                                var jsonResult = {"success": true,  "message":'User add success', 'result': result.result };
                                console.log(JSON.stringify(jsonResult));
                                res.send(jsonResult);
                            }
                        });
                    });
                }

            });
        });
    }
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    usersDB.collection('users', function(err, collection) {
        collection.remove({'_id': new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error': true, "message":'An error has occurred - ' + err});
            } else {
                var jsonResult = {"success": true, "message":'User delete success', 'result': result }
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });
}

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    
    usersDB.collection('users', function(err, collection) {
        collection.update({'_id': new mongo.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error': true, "message":'An error has occurred'});
            } else {
                var jsonResult = {"success": true, "message":'User update success', 'result': result }
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });
}


exports.userLoginGet = function(req, res) {
    
    var user = { 'name': req.query.name, 'password': req.query.password};
    console.log('Login user GET: ' + JSON.stringify(user));
    
    userLogin(req, res, user)
}

exports.userLoginPost = function(req, res) {
    var user = req.body;
    console.log('Login user POST: ' + JSON.stringify(user));
    
    userLogin(req, res, user)
}

var userLogin = function (req, res, userData) {
    
    usersDB.collection('users', function(err, collection) {
        collection.findOne({'name': userData.name, 'password': userData.password}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error': true, "message":'An error has occurred'});
            } else {
                var jsonResult = {};
                if (result) {
                    jsonResult = {"success": true, "message":'Login success', 'result': result }
                } else{
                    jsonResult = {"success": false, "message":'Invalid credentials', 'result': result }
                };
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });  
}

// Populate database with sample data -- Only used once: the first time the application is started.
var populateUsersInDB = function() {

    var users = [
        {
            name: "user",
            email: "user@gslab.com",
            password: "user"
        },
        {
            name: "test",
            email: "test@gslab.com",
            password: "test"
        },
    ];

    usersDB.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
};