var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit:10,
	host:'localhost',
	user:'mynode',
	password:'123456',
	database:'mynode'
});

// var connection = mysql.createConnection({
// 	host:'localhost',
// 	user:'mynode',
// 	password:'123456',
// 	database:'mynode'
// });

// connection.connect(function(err){
// 	if(err) throw err;
// 	var value ='gao';
// 	var query= connection.query('SELECT * FROM user where name =?',value,function(err,ret){
// 		if(err) throw err;
// 		console.log(ret);
// 		connection.end();
// 	});
// 	 console.log(query.sql);
// });

pool.getConnection(function(err,connection){
	if(err) throw err;

	var value = 'gao';
	var query = connection.query('SELECT * FROM user WHERE name = ?',value,function(err,ret){
		if(err) throw err;
		console.log(ret);
		connection.release();
	});

	console.log(query.sql);
});