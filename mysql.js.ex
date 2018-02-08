var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'pi',
    password : 'password',
    database : 'cc'
});

connection.connect();

connection.query('\
    select * from SAMPLE \
    where STATUS = "INCOMPLETE" or STATUS = "IN_PROGRESS" \
    and SAMPLE_TYPE = "OUTSIDE"', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);

connection.query('select * from SAMPLE where STATUS = "INCOMPLETE" and SAMPLE_TYPE = "OUTSIDE"', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);

});

connection.end();
