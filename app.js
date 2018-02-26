var express = require('express');
var logger = require('morgan');
var path = require('path');
var mysql = require('mysql');
var async = require('async');
var pwd = require('./config');
//var lessMiddleware = require('less-middleware');

app = express();

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
// not using less right now
//app.use(lessMiddleware(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




/* not using currently
const ejsLint = require('ejs-lint');
ejsLint('views/index.ejs');
*/

const pool =  mysql.createPool({
	host: 'localhost',
	user: 'pi',
    password: pwd,
    database: 'cc'
});
const queryObj = {
    /*
      put queries here
     */
    queryDailies : 'select R.SAMPLE_NUMBER, SAMPLE.SAMPLE_NAME, R.ENTRY \
                   from RESULT R inner join SAMPLE \
                   on R.SAMPLE_NUMBER = SAMPLE.SAMPLE_NUMBER \
                   where SAMPLE.SAMPLE_TYPE = "DAILY" \
                   and SAMPLE.STATUS in ("INCOMPLETE", "IN PROGRESS") \
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
                    and SAMPLE.STATUS in ("INCOMPLETE", "IN PROGRESS") \
                    order by ENTRY'
};

function makeSampleObj(data) {
    /*
      creates array of objects from data returned by mysql server
     */
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
    return sampleData;
};
function groupDataByEntry(data) {
    /*
      takes array of objects format: 
          [{S#1: ''. SName1 : '', Entry1 : ''} ... {S#N: ''. SNameN : '', EntryN : ''}]
      and re-arranges to:
          [{Entry1: [{S#1 : '', SName1 : ''}...{S#1 : '', SName1 : ''}]...{EntryN: [{}]}]
    */
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
    /*
      use async to call queries from queryObj in parallel.
      need to manually add queries from sample obj, unfortunately
      maybe fix later if it becomes tedious/untidy
     */
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
		renderer(err, groupDataByEntry(makeSampleObj(res)));
	    };
	});
    },
}, function(err, data) {
    app.get('/', function(req, res){
	res.render('index', {
	    title : 'TEST',
	    dailyData : data.dailies,
	    bottlingData : data.bottling,
	    outsideData : data.outsides
	});
    });
    //console.log(data.outsides);
});

var server = app.listen(8081);

// trying to fix eaddrinuse error when nodemon restarts due to file changes
/*
process.on('uncaughtException', (err) => { console.log(err.stack); process.exit(); });
process.on('SIGINT', () => {console.log("BYE!"); process.exit(); });
require('node-clean-exit') ();
*/

module.exports = app;

