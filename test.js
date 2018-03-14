var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
});

app.post('/hello', urlencoded, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    res.send('Username: ' + username + '\nPassword : ' + password)
});

app.listen(3000);