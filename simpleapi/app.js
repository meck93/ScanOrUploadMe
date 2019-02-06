var express = require("./node_modules/express");
var bodyParser = require("./node_modules/body-parser");
var routes = require("./node_modules/routes/dist/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

routes(app);

var server = app.listen(3000, function() {
	console.log("app running on port.", server.address().port);
});
var faker = require("./node_modules/faker");
//var appRouter = function(app) {
	app.get("/", function(req,res) {
		res.status(200).send("Welcome to our restful API");
	});

	app.get("/user", function (req, res) {
		var data = ({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			username: faker.internet.userName(),
			email: faker.internet.email()
		});
		res.status(200).send(data);
	});
	app.get("/users/:num", function (req, res) {
		var users = [];
		var num = req.params.num;

		if (isFinite(num) && num > 0){
			for (i =0; i<= num-1; i++) {
				users.push({
					firstName: faker.name.firstName(),
					lastName: faker.name.lastName(),
					username: faker.internet.userName(),
					email: faker.internet.email()
				});
			}
			res.status(200).send(users);

		} else {
			res.status(400).send({message: 'invalid number supplied'});
		}
	});
//}

//module.exports = appRouter;