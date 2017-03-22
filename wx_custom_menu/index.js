var https = require('https'); 
var fs = require('fs');
//var access_token='6jB7ATsfw9AmgNYQXNX7uqaGTc4RctORnsuhgXusY_PMTbugisD6rgkzO_yk3HEwXB7u3X3Cj6E9Ke8hrgBBiqEfZMoz-zd_HL8J5l-3rnpCLpkANKCehY5oG4EGRAj9LLYbADAEER'

var access_token=readAccessToken();
var menu = {
    "button": [
        {
            "name": "我的账号",
            "sub_button": [
                {
                    "type": "click",
                    "name": "我的帐户",
                    "key": "V1001_MY_ACCOUNT"
                },
                {
                    "type": "click",
                    "name": "已投项目",
                    "key": "V1002_BID_PROJECTS"
                },
                {
                    "type": "click",
                    "name": "回款计划",
                    "key": "V1003_RETURN_PLAN"
                },
                {
                    "type": "click",
                    "name": "交易明细",
                    "key": "V1004_TRANS_DETAIL"
                },
                {
                    "type": "click",
                    "name": "注册/绑定",
                    "key": "V1005_REGISTER_BIND"
                }
            ]
        },
        {
            "type": "view",
            "name": "马上投资",
            "url": "http://adviser.ss.pku.edu.cn/wx/"
        },
        {
            "name": "送钱活动",
            "sub_button": [
                {
                    "type": "view",
                    "name": "注册送红包",
                    "url": "http://adviser.ss.pku.edu.cn/wx/bszn/"
                },
                {
                    "type": "click",
                    "name": "邀请好友一起赚钱",
                    "key": "V1001_GOOD"
                },
                {
                    "type": "view",
                    "name": "加入我们",
                    "url": "http://www.ss.pku.edu.cn/"
                }
            ]
        }
    ]
};

var post_str = new Buffer(JSON.stringify(menu));
//var post_str = JSON.stringify(menu);

console.log(post_str.toString());
console.log(post_str.length);
var post_options={
	host:'api.weixin.qq.com',
	port:'443',
	path:'/cgi-bin/menu/create?access_token=' + access_token,
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


function readAccessToken()
{
	var data = fs.readFileSync('../access_token.txt', 'utf8');
    console.log(data); 
	return data;	
}








