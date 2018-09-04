import { request } from 'graphql-request'
var graphHost = "http://localhost:4000/"

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {
		const query = `query{
				getTasks{
					id
					Description
					Done
				}
		  }`
		
		request(graphHost,query)
		.then(function(response){
			res.json(response.getTasks);
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {
		var newTask = req.body;
		console.log(newTask);
		const query = `mutation {
			addTask(input: {
				id :0
				Description: "${newTask.Description}"
				Done: false
			}){
				id
				Description
				Done
			}
		}`

		request(graphHost,query)
		.then(function(response){
			res.json(response.addTask);
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		
	});

		// update a todo
		app.delete('/api/todos/:todo_id', function(req, res) {
		
		});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};