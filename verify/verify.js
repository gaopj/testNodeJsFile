var PORT = 9529;
var http = require('http');
var https = require('https');
var qs=require('qs');
var fs = require('fs');

var TOKEN = 'gpj';
var m_from_user_name;
var m_content;
var m_type;
var m_result;//0平局 1玩家赢 2服务器赢


var reJSON;
function checkSignature(params,token)
{
	var key =[token,params.timestamp,params.nonce].sort().join('');
	var sha1 = require('crypto').createHash('sha1');
	sha1.update(key);
	
	return sha1.digest('hex')==params.signature;
}

var server = http.createServer(function(request,response)
{
	var query = require('url').parse(request.url).query;
	var params = qs.parse(query);
	
	//console.log(params);
	//console.log("token-->",TOKEN);
	
	// if(checkSignature(params,TOKEN)){
		// response.end(params.echostr);
	// }else{
		// response.end('signature fial');
	// }
	
	 if(!checkSignature(params,TOKEN)){
		 response.end('signature fial');
		 //return;
	 }
	 if(request.method=='GET') {
		 response.end(params.echostr);
	 }else{
		 var postdata="";
		 request.addListener("data",function(postchunk){
			 postdata+=postchunk;
		 });
		 
		 // request.addListener("end",function()
		 // {
			 // console.log(postdata);
			 // response.end('success');
		 // });
		 
		     //获取到了POST数据
		request.addListener("end",function(){
		var parseString = require('xml2js').parseString;

		parseString(postdata,{ explicitArray : false, ignoreAttrs : true }, function (err, result) {
        if(!err){
          //我们将XML数据通过xml2js模块(npm install xml2js)解析成json格式
          console.log(result)
		  m_from_user_name=result.xml.FromUserName;
		  //console.log(result.xml.FromUserName);
		   m_content=result.xml.Content;
		   m_type=result.xml.MsgType;
		   
		   console.log('from_user_name:'+m_from_user_name+'\n');
		   console.log('content:'+m_content+'\n');
		   console.log('type:'+m_type+'\n');
		   if(m_type=='text')
		   {
			   //0.剪刀 1.石头 2.布
			   if(m_content=='scssors'||m_content=='scs')
			   {
				  var v=parseInt(Math.random()*3);
				  if(v==0)
                  m_result=0;
				else if(v==1)
				  m_result=2;
			  	else if(v==2)
				  m_result=1;
			  to_user(m_result,v);
			   }
			   else if(m_content=='stone'||m_content=='sto')
			   {
				 	  var v=parseInt(Math.random()*3);
				  if(v==0)
                  m_result=1;
				 else if(v==1)
				  m_result=0;
			  	 else if(v==2)
				  m_result=2;
			  	  to_user(m_result,v);
			   }
			    else if(m_content=='paper'||m_content=='pap')
			   {
				  	  var v=parseInt(Math.random()*3);
				  if(v==0)
                  m_result=2;
				else if(v==1)
				  m_result=1;
			  	else if(v==2)
				  m_result=0;
			  	  to_user(m_result,v);
			   }
		   }
          response.end('success');
        }
      });
    });
	 } 
});

server.listen(PORT);
console.log("Server runing at port:"+PORT+".");


function to_user(result,choice)
{
	console.log('result:'+result+',choice:'+choice);
var result_content;
var choice_content;
switch(result)
{
	case 0:result_content='we draw!';
	break;
	case 1:result_content='you win!';
	break;
	case 2:result_content='you lost!';
	break;
}
switch(choice)
{
	case 0:choice_content='scssors';
	break;
	case 1:choice_content='stone';
	break;
	case 2:choice_content='paper';
	break;
}
console.log('My choice is '+choice_content+',so '+result_content);
reJSON = {
    "touser":m_from_user_name,
    "msgtype":"text",
    "text":
    {
         "content":'My choice is '+choice_content+',so '+result_content
    }
}

var post_str = new Buffer(JSON.stringify(reJSON));
access_token=readAccessToken();
var post_options={
	host:'api.weixin.qq.com',
	port:'443',
	path:'/cgi-bin/message/custom/send?access_token=' + access_token,
	method:'POST',
	headers:{
		'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_str.length
	}
};
var post_req = https.request(post_options,function(response){
	var responseText=[];
	var size=0;
	response.setEncoding('utf8');
	response.on('data',function(data){
		responseText.push(data);
		size+=data.length;
		});
	response.on('end',function(){
		console.log(responseText);
	});
});

post_req.write(post_str);
post_req.end();
}

function readAccessToken()
{
	var data = fs.readFileSync('../access_token.txt', 'utf8');
    console.log(data); 
	return data;	
}
