var express = require('express');
var logger = require('morgan');
var path = require('path');
var mysql = require('mysql');
var async = require('async');
var pwd = require('./config');

app = express();

app.use(logger('dev'));

// include 'public' directory (w/o '/path/*' root) in path envir
app.use(express.static(path.join(__dirname, 'public')));
// view directory
app.set('views', path.join(__dirname, 'views'));
// html as default view engine extension
app.set('view engine', 'ejs');

const pool =  mysql.createPool({
	host: 'localhost',
	user: 'pi',
    password: pwd,
    database: 'cc'
});
const queryObj = {
    queryDailies : 'select R.SAMPLE_NUMBER, SAMPLE.SAMPLE_NAME, R.ENTRY \
                   from RESULT R inner join SAMPLE \
                   on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
                   where SAMPLE.SAMPLE_TYPE = "DAILY" \
                   order by ENTRY',
    queryBottling : 'select R.SAMPLE_NUMBER, R.ENTRY, SAMPLE.SAMPLE_NAME \
                    from RESULT R inner join SAMPLE \
                    on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
                    where SAMPLE.SAMPLE_TYPE = "BOTTLING" and R.IN_SPEC = "N" \
                    order by ENTRY',
    queryOutsides : 'select R.SAMPLE_NUMBER, R.ENTRY, SAMPLE.SAMPLE_NAME \
                    from RESULT R inner join SAMPLE \
                    on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
                    where SAMPLE.SAMPLE_TYPE = "OUTSIDE" \
                    order by ENTRY'
};

function makeSampleObj(data, cb) {
    //console.log(data);
    var sampleData = []
    for (var i = 0; i < data.length; i++) {
	var sample = {
	    'SAMPLE_NUMBER' : data[i].SAMPLE_NUMBER,
	    'SAMPLE_NAME' : data[i].SAMPLE_NAME,
	    'ENTRY' : data[i].ENTRY
	}
	sampleData.push(sample);
    };
    if (cb) {
	//console.log(sampleData);
	cb(sampleData);
    } else {
	return sampleData;
    }
};
function groupDataByEntry(data) {
    var data = data.reduce( function (acc, init) {
	if(acc[init['ENTRY']]) {
	    acc[init['ENTRY']].push( {'SAMPLE_NUMBER': init['SAMPLE_NUMBER'],
				      'SAMPLE_NAME': init['SAMPLE_NAME']} );
	} else {
	    acc[init['ENTRY']] = [ {'SAMPLE_NUMBER': init['SAMPLE_NUMBER'],
				    'SAMPLE_NAME': init['SAMPLE_NAME']} ];
	}
	return acc;
    }, {});
    //console.log(data);
    return data;
};

async.parallel({
    dailies: function(renderer) {
	pool.query(queryObj.queryDailies, function(err, res, fields) {
	    if (err) {
		console.log(err);
	    } else {
		renderer(err, groupDataByEntry(makeSampleObj(res)));
	    };
	});
    },
    bottling: function(renderer) {
	pool.query(queryObj.queryBottling, function(err, res, fields) {
	    if (err) {
		console.log(err);
	    } else {
	    	renderer(err, makeSampleObj(res));
	    };
	});
    },
    outsides: function(renderer) {
	pool.query(queryObj.queryOutsides, function(err, res, fields) {
	    if (err) {
		console.log(err);
	    } else {
	    	renderer(err, makeSampleObj(res));
	    };
	});
    },
}, function(err, data) {
    app.get('/', function(req, res){
	res.render('index', {
	    title : 'TEST',
	    dailyData : JSON.stringify(data.dailies),
	    bottlingLength : data.bottling.length,
	    outsideLength : data.outsides.length
	});
    });
    //console.log(JSON.stringify(data.dailies));
});

var server = app.listen(8081);

// trying to fix eaddrinuse error when nodemo restarts due to file changes
//process.on('uncaughtException', (err) => { console.log(err.stack); process.exit(); });
//process.on('SIGINT', () => {console.log("BYE!"); process.exit(); });
//require('node-clean-exit') ();

module.exports = app;

