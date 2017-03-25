var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

// 创建http get请求
//http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news", function(res) {
http.get("http://www.pku.edu.cn/", function(res) {
    var html = ''; // 保存抓取到的HTML源码
    var news = [];  // 保存解析HTML后的数据
    res.setEncoding('utf-8');

    // 抓取页面内容
    res.on('data', function(chunk) {
        html += chunk;
	
    });

    //网页内容抓取完毕
    res.on('end', function() {
      //  console.log(html);
		var $ = cheerio.load(html);
//如果你拿不准选择器的话，可以多用console.log来输出，看看取到的地址是否正确
// $('#info-list-ul li').each(function(index,item) {
    // var news_item = {
        // title: $('.info-title',this).text(), // 获取新闻标题
      // //  time: $('.time',this).text(), // 获取新闻时间
        // link: 'http://www.ss.pku.edu.cn' + $('a',this).attr('href'), // 获取新闻详情页链接
    // };
    // // 把所有新闻放在一个数组里面
    // news.push(news_item);
// });

$('.inner').each(function(index,item) {
    var news_item = {
        title: $('.text1',this).text(), // 获取新闻标题
      //  time: $('.time',this).text(), // 获取新闻时间
        link: 	$('a',this).attr('href'), // 获取新闻详情页链接
    };
    // 把所有新闻放在一个数组里面
    news.push(news_item);
});

 console.log(news);
    });

}).on('error', function(err) {
    console.log(err);
});

