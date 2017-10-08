var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;

var server1 = new Server('localhost', 27017, {auto_reconnect: true});
companiesDB = new Db('companiesdb', server1);    

companiesDB.open(function(err, companiesDB) {
    if(!err) {
        console.log("Connected to 'companiesdb' database");
        companiesDB.collection('companies', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'companies' collection doesn't exist. Creating it with sample data...");
                populateCompaniesDB();
            }
        });
    }
});


exports.findAll = function(req, res) {
	console.log('get all companies');
    companiesDB.collection('companies', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving company: ' + id);
    companiesDB.collection('companies', function(err, collection) {
        collection.findOne({'_id': new mongo.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.addCompany = function(req, res) {
    var company = req.body;
    console.log('Adding company: ' + JSON.stringify(company));
    companiesDB.collection('companies', function(err, collection) {
        collection.insert(company, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                var jsonResult = {"success": true, 'result': result }
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });
}

exports.deleteCompany = function(req, res) {
    var id = req.params.id;
    console.log('Deleting company: ' + id);
    companiesDB.collection('companies', function(err, collection) {
        collection.remove({'_id': new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
              	var jsonResult = {"success": true, 'result': result }
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });
}

exports.updateCompany = function(req, res) {
    var id = req.params.id;
    var company = req.body;
    console.log('Updating company: ' + id);
    console.log(JSON.stringify(company));
    companiesDB.collection('companies', function(err, collection) {
        collection.update({'_id': new mongo.ObjectID(id)}, company, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating company: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                var jsonResult = {"success": true, 'result': result }
                console.log(JSON.stringify(jsonResult));
                res.send(jsonResult);
            }
        });
    });
}

// Populate database with sample data -- Only used once: the first time the application is started.
var populateCompaniesDB = function() {

    var companies = [
				{
				    'name': 'Great Sofware Laboratory',
				    'employees': 600,
				    'headoffice': 'Pune'
				},{
				    'name': 'Infosys Technologies',
				    'employees': 125000,
				    'headoffice': 'Bangalore'
				}, {
				    'name': 'Cognizant Technologies',
				    'employees': 100000,
				    'headoffice': 'Bangalore'
				}, {
				    'name': 'Wipro',
				    'employees': 115000,
				    'headoffice': 'Bangalore'
				}, {
				    'name': 'Tata Consultancy Services (TCS)',
				    'employees': 150000,
				    'headoffice': 'Bangalore'
				}, {
				    'name': 'HCL Technologies',
				    'employees': 90000,
				    'headoffice': 'Noida'
				}
		];

    companiesDB.collection('companies', function(err, collection) {
        collection.insert(companies, {safe:true}, function(err, result) {});
    });

};