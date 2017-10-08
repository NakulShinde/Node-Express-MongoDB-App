var express 	= require('express');
var bodyParser 	= require("body-parser");
var company 	= require('./companies');
var user 		= require('./users');
var cors 		= require('cors')
var app 		= express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Enable CORS for app
app.use(cors());


// Added all header request and response.
/*app.all('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
    next();
});*/

app.get('/', function (req, res) {
  res.send('Hello Node APIs!');
});


app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addUser);
app.put('/users/:id', user.updateUser);
app.delete('/users/:id', user.deleteUser);
app.get('/userLogin', user.userLoginGet);
app.post('/userLogin', user.userLoginPost);


app.get('/companies', company.findAll);
app.get('/companies/:id', company.findById);
app.post('/companies', company.addCompany);
app.put('/companies/:id', company.updateCompany);
app.delete('/companies/:id', company.deleteCompany);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


//example url: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
