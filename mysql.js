var pwd = require('./config');

var mysql      = require('mysql');
module.exports = connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'pi',
    password : pwd,
    database : 'cc'
});

connection.connect(function(err){
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});
