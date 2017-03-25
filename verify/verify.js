//一个可以和微信交互的小demo，可以和微信公众号玩石头剪刀布

//设置端口号为9529
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
//自己的服务器核实是否通过微信公众号的验证
function checkSignature(params,token)
{
	var key =[token,params.timestamp,params.nonce].sort().join('');
	var sha1 = require('crypto').createHash('sha1');
	sha1.update(key);
	
	return sha1.digest('hex')==params.signature;
}

//创建一个http服务
var server = http.createServer(function(request,response)
{
	var query = require('url').parse(request.url).query;
	var params = qs.parse(query);
	
	//console.log(params);
	
	//console.log("token-->",TOKEN);
	//进行 token验证，只需进行一次即可
	// if(checkSignature(params,TOKEN)){
		// response.end(params.echostr);
	// }else{
		// response.end('signature fial');
	// }
	//若验证失败则返回失败信息
	 if(!checkSignature(params,TOKEN)){
		 response.end('signature fial');
		 //return;
	 }
	 //若是get请求，则直接返回数据
	 if(request.method=='GET') {
		 response.end(params.echostr);
	 }
	 //若是其他请求，这里默认是post请求
	 else{
		 var postdata="";
		 //监听返回数据，并存储在postdata中
		 request.addListener("data",function(postchunk){
			 postdata+=postchunk;
		 });
		 
		 // request.addListener("end",function()
		 // {
			 // console.log(postdata);
			 // response.end('success');
		 // });
		 
		     //获取到了POST数据，并将其转为json格式进行处理
		request.addListener("end",function(){
		var parseString = require('xml2js').parseString;

		parseString(postdata,{ explicitArray : false, ignoreAttrs : true }, function (err, result) {
        if(!err){
          //我们将XML数据通过xml2js模块(npm install xml2js)解析成json格式
          console.log(result)
		  //获取从微信处发来的用户名
		  m_from_user_name=result.xml.FromUserName;
		  
			//获取从微信处发来的内容
		   m_content=result.xml.Content;
		   
		   //获取从微信处发来的数据格式
		   m_type=result.xml.MsgType;
		   
		   console.log('from_user_name:'+m_from_user_name+'\n');
		   console.log('content:'+m_content+'\n');
		   console.log('type:'+m_type+'\n');
		   
		  //若发来的是文本格式，则进行处理
		   if(m_type=='text')
		   {
			   //v是服务器选择的出拳 0.剪刀 1.石头 2.布
			   if(m_content=='scssors'||m_content=='scs')
			   {
				  var v=parseInt(Math.random()*3);
				  if(v==0)
                  m_result=0;
				else if(v==1)
				  m_result=2;
			  	else if(v==2)
				  m_result=1;
			  
			  //将猜拳后的结果和 将服务器的选择 传入to_user 中
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
//设置监听端口，并进行监听
server.listen(PORT);
console.log("Server runing at port:"+PORT+".");

//将结果和服务器的猜拳选择通过微信平台返回给用户
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
	//根据微信平台的要求设置返回的json格式数据
	reJSON = {
    "touser":m_from_user_name,
    "msgtype":"text",
    "text":
    {
         "content":'My choice is '+choice_content+',so '+result_content
    }
}

var post_str = new Buffer(JSON.stringify(reJSON));
//获取token
access_token=readAccessToken();

//设置post请求参数
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

//对微信平台进行post请求
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

//对于前面设置请求和json数据进行发送
post_req.write(post_str);
post_req.end();
}
//从上级文件中获取token数据
function readAccessToken()
{
	var data = fs.readFileSync('../access_token.txt', 'utf8');
    console.log(data); 
	return data;	
}
