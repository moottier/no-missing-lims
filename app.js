var express = require('express');
var logger = require('morgan');
var path = require('path');
var db = require('./mysql');

var app = express();

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

connection.connect(function(err, connection) {
    
});

app.get('/', function(req, res){
    res.send('Hello Squirrel');
});

if (!module.parent) {
    app.listen(8081);
    console.log('express started on 10.0.0.219:8081');
};



