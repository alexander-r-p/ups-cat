/**
 * Created by Alexander on 20.06.2016.
 */
// load the todo model
var Todo = require('./models/todo');
var nodemailer = require('nodemailer');

// expose the routes to our app with module.exports
module.exports = function(app) {
    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {
        // use mongoose to get all todos in the database
        /*
         Todo.find(function(err, todos) {

         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
         if (err)
         res.send(err)

         res.json(todos); // return all todos in JSON format
         });
         */
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
        /*
         // create a todo, information comes from AJAX request from Angular
         Todo.create({
         text : req.body.text,
         done : false
         }, function(err, todo) {
         if (err)
         res.send(err);

         // get and return all the todos after you create another
         Todo.find(function(err, todos) {
         if (err)
         res.send(err)
         res.json(todos);
         });
         });
         */
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        /*
         Todo.remove({
         _id : req.params.todo_id
         }, function(err, todo) {
         if (err)
         res.send(err);

         // get and return all the todos after you create another
         Todo.find(function(err, todos) {
         if (err)
         res.send(err)
         res.json(todos);
         });
         });
         */
    });

    app.post('/sendMail', function(req, res) {
        console.log('Message sending: ' + req.body.email);

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'kvgroupups@gmail.com', // Your email id
                pass: 'kvgroupups01;' // Your password
            }
        });

        var message = 'Заказ от ' + req.body.name + '<p>' +
            'Телефон - ' + req.body.phone  + '<p>' +
            'E-Mail - ' + req.body.email  + '<p>';


        for (var i = 0; i < req.body.products.length; i++) {
            var product = req.body.products[i];
            message += product.name + ': количество - ' + product.quantity + ': цена - ' + product.price + '<p>';
        }

        var mailOptions = {
            from: '"KVgroup - Источники бесперебойного питания" <kvgroupups@gmail.com>', // sender address
            to: req.body.email,
            subject: 'Заказ',
            text: 'Заказ от ' + req.body.name + ": " + req.body.phone,
            html: message // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });


        res.sendStatus(202);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        var path = require('path');
        res.sendFile(path.resolve('public/index.html'));
    });
};