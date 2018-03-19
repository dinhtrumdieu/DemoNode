var express = require('express');
var app = express();
const mongoose = require('mongoose');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
/*
app.post('/hello', urlencoded, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    res.send('Username: ' + username + '\nPassword : ' + password)
});
*/

mongoose.connect('mongodb://localhost:27017/testing').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

const MyModel = mongoose.model('test', new mongoose.Schema({name: String, age: Number}));
// Works

/*MyModel.create({
    name: 'hello',
    age: 20
});*/


app.listen(3000);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    MyModel.find().exec().then(data => {
        res.send(data);
    }).catch(error => console.log(error));
});