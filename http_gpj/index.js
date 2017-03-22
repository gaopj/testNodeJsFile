var http = require('http');

var NEWS={
	1:'这里是第一篇新闻的内容',
	2:'这里是第二篇新闻的内容',
	3:'这里是第三篇新闻的内容'
};

function getNews(id)
{
	return NEWS[id]||'文件不存在';
}

var server = http.createServer(function(req,res){
	function send(html)
	{
		res.writeHead(200,{'content-type':'text/html;charset=utf-8'});
		res.end(html);
	}
	if(req.url==='/')
	{
		send('<ul>'+
				'<li><a href="/news?id=1">新闻一</a><li>'+
				'<li><a href="/news?id=2">新闻二</a><li>'+
				'<li><a href="/news?id=3">新闻三</a><li>'+
				'</ul>');
	}else if(req.url==='/news?id=1')
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
server.listen(3001);