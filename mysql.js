var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'pi',
    password : 'password',
    database : 'cc'
});

connection.connect();

<<<<<<< HEAD
connection.query('\
    select * from SAMPLE \
    where STATUS = "INCOMPLETE" or STATUS = "IN_PROGRESS" \
    and SAMPLE_TYPE = "OUTSIDE"', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
=======
connection.query('select * from SAMPLE where STATUS = "INCOMPLETE" and SAMPLE_TYPE = "OUTSIDE"', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
>>>>>>> fa5f280a21f08ecfa33b277b10cb1c30e9ea1193
});

connection.end();