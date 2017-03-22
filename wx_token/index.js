var later = require('later');
var https = require('https');
var  fs= require('fs');


var appid='wx4899e29cd80c7ed7';
var appsecret = '2c849a02c0aa700abdd112319fb4e29d';
var access_token;

later.date.localTime();
console.log("Now:"+new Date());

var sched=later.parse.recur().every(1).hour();
next=later.schedule(sched).next(10);
console.log(next);

var timer =later.setInterval(test,sched);
setTimeout(test,2000);

function test(){
	console.log(new Date());
	var options = {
		hostname:'api.weixin.qq.com',
		path:'/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret
	};
	var req=https.get(options,function(res){
	 //console.log("statusCode: ", res.statusCode);
     //console.log("headers: ", res.headers);
	var bodyChunks='';
	res.on('data',function(chunk){
		bodyChunks+=chunk;
	});
	res.on('end',function(){
		var body=JSON.parse(bodyChunks);
		  //console.dir(body);
		if(body.access_token){
			access_token=body.access_token;
			saveAccessToken(access_token);
			console.log(access_token);
		}else{
			console.dir(body);
		}
	});
	
	});
	
	req.on('error',function(e){
		console.log('ERROR:'+e.message);
	});
}

function saveAccessToken(access_token_to_file)
{
	fs.writeFile('../access_token.txt', access_token_to_file,function(err){
    if(err) console.log('写文件操作失败');
    else console.log('写文件操作成功');
});
}