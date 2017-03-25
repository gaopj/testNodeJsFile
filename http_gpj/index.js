var http = require('http');

//创建一个News的键值对数组。
var NEWS={
	1:'这里是第一篇新闻的内容',
	2:'这里是第二篇新闻的内容',
	3:'这里是第三篇新闻的内容'
};

//通过id查找NEWS
function getNews(id)
{
	return NEWS[id]||'文件不存在';
}
//建立一个http服务
var server = http.createServer(function(req,res){
	//对于一个请求发送一个html静态页返回，返回编码200，用utf-8编码
	function send(html)
	{ 
		res.writeHead(200,{'content-type':'text/html;charset=utf-8'});
		res.end(html);
	}
	//若请求的代码的url是/，返回首页信息 
	if(req.url==='/')
	{
		send('<ul>'+
				'<li><a href="/news?id=1">新闻一</a><li>'+
				'<li><a href="/news?id=2">新闻二</a><li>'+
				'<li><a href="/news?id=3">新闻三</a><li>'+
				'</ul>');
	}
	//根据传递的参数返回页面信息
	else if(req.url==='/news?id=1')
	{
		send(getNews(1));
	}
	else if(req.url==='/news?id=2')
	{
		send(getNews(1));
	}
	else if(req.url==='/news?id=3')
	{
		send(getNews(1));
	}else
	{
		send('<h1>文章不存在</h1>');
	}
	
});
//对3001端口进行监听
server.listen(3001);