var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser("jizai"));

app.get('/read',function(req,res,next){
	res.json(req.cookies);
});

app.get('/gpj',function(req,res,next){
	res.json(req.cookies);
});
app.get('/write',function(req,res,next){
	//res.cookie('my_cookie','hello',{
	//domain:"www.gaopiji.cn",path:'/',
	//expires:new Date(Date.now()+1*60*1000)
	//maxAge:1*60*1000 //
	//});//一分钟后过期

	res.cookie('a','123');
	res.cookie('b','456',{httpOnly:true,signed:true});
//	res.json(req.cookies);
	res.json(req.signedCookies);
});

app.listen(3000);
console.log("Server runing at port:3000");