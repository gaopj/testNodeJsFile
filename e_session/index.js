var express = require('express');
var parseurl = require('parseurl');
var session =require('express-session');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var clone = require('clone');


var app = express();

app.use(session({
	secret:'keyboard cat',
	resave:false,
	saveUninitialized:true
}));

// function my_session(){
// 	var data = {};
// 	return function(req,res,next){
// 		var id = req.signedCookies.session_id|| uuid.v4();
// 		res.cookie('session_id',id,{
// 			maxAge:60*1000,
// 			path:'/',
// 			httpOnly:true,
// 			signed:true
// 		});
// 		req.session = clone(data[id]||{});
// 		res.on('finish',function(){
// 			console.log('save session: ',req.session);
// 			data[id] = clone(req.session);
// 		});
// 		next();
// 	};
// }

// app.use(cookieParser('qwerqwer'));
// app.use(my_session);

app.use(function(req,res,next){
	var views = req.session.views;
	if(!views){
		views = req.session.views={};
	}
	//get the url pathname
	var pathname = parseurl(req).pathname

	//count the views
	views[pathname] = (views[pathname]||0)+1;
	next();
});

app.use('/',function(req,res,next){
	var num = req.session.num;
	if(!num){
		num = req.session.num=0;
	}
	req.session.num=num+1;
	console.log('-----这是第 '+req.session.num+' 次调用---');
		//res.send('you viewed this page '+req.session.views['/']+' times');
	next();
});

app.use(function(req,res,next){
	console.log('酱油1号');
	next();
});
app.use(function(req,res,next){
	console.log('酱油2号');
	next();
});


app.get('/foo',function(req,res,next){
	res.send('you viewed this page '+req.session.views['/foo']+' times');
});

app.get('/bar',function(req,res,next){
	res.send('you viewed this page '+req.session.views['/bar']+' times')
});

app.listen(3000);
console.log('Web server has started on 3000');