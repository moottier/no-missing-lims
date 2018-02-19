var express = require('express');
var logger = require('morgan');
var path = require('path');
var mysql = require('mysql');
var pwd = require('./config');

module.exports = app = express();

app.use(logger('dev'));

var pool =  mysql.createPool({
	host: 'localhost',
	user: 'pi',
	// REPLACE PASSWORD WITH IMPORTED AND HIDDEN PWD
	password: pwd,
	database: 'cc'
});

// use assets in public directory
app.use(express.static(path.join(__dirname, 'public')));

// set view directory
app.set('views', path.join(__dirname, 'views'));


// set html as default view engine extension
app.set('view engine', 'ejs');


function dbQuery(query){
    var dataHolder = [];
    pool.getConnection(function(err, connection) {
	pool.query(query, function (err, rows, fields) {
	    if (err) {
		res.status(500).json({'status_code': 500, 'status_message': 'server error'});
	    } else {
		for (var i = 0; i < rows.length; i++) {
		    var sample = {
			'SAMPLE_NUMBER' : rows[i].SAMPLE_NUMBER,
			'SAMPLE_NAME' : rows[i].SAMPLE_NAME,
			'ENTRY' : rows[i].ENTRY
		    }
		    dataHolder.push(sample);
		}
		connection.release();
		console.log(dataHolder);
		return dataHolder;
	    }    
	});
    });
};

app.get('/', function(req, res){
    var queryDailies =  'select R.SAMPLE_NUMBER, R.ENTRY, SAMPLE.SAMPLE_NAME \
        from RESULT R inner join SAMPLE \
        on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
        where SAMPLE.SAMPLE_TYPE = "DAILY" \
        order by ENTRY';
	    
    var queryBottling = 'select R.SAMPLE_NUMBER, R.ENTRY, SAMPLE.SAMPLE_NAME \
	from RESULT R inner join SAMPLE \
	on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
	where SAMPLE.SAMPLE_TYPE = "BOTTLING" and R.IN_SPEC = "N" \
        order by ENTRY';

    var queryOutsides = 'select R.SAMPLE_NUMBER, R.ENTRY, SAMPLE.SAMPLE_NAME \
	from RESULT R inner join SAMPLE \
	on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
	where SAMPLE.SAMPLE_TYPE = "OUTSIDE"';

    
    res.render('index', {
	title : 'TEST',
	dailies : dbQuery(queryDailies),
	bottlings : dbQuery(queryBottling),
	outsides : dbQuery(queryOutsides)
    });
});
		    
if (!module.parent) {
    app.listen(8081);
    console.log('express started on 10.0.0.219:8081');
};
