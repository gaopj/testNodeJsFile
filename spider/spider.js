var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

// ����http get����
//http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news", function(res) {
http.get("http://www.pku.edu.cn/", function(res) {
    var html = ''; // ����ץȡ����HTMLԴ��
    var news = [];  // �������HTML�������
    res.setEncoding('utf-8');

    // ץȡҳ������
    res.on('data', function(chunk) {
        html += chunk;
	
    });

    //��ҳ����ץȡ���
    res.on('end', function() {
      //  console.log(html);
		var $ = cheerio.load(html);
//������ò�׼ѡ�����Ļ������Զ���console.log�����������ȡ���ĵ�ַ�Ƿ���ȷ
// $('#info-list-ul li').each(function(index,item) {
    // var news_item = {
        // title: $('.info-title',this).text(), // ��ȡ���ű���
      // //  time: $('.time',this).text(), // ��ȡ����ʱ��
        // link: 'http://www.ss.pku.edu.cn' + $('a',this).attr('href'), // ��ȡ��������ҳ����
    // };
    // // ���������ŷ���һ����������
    // news.push(news_item);
// });

$('.inner').each(function(index,item) {
    var news_item = {
        title: $('.text1',this).text(), // ��ȡ���ű���
      //  time: $('.time',this).text(), // ��ȡ����ʱ��
        link: 	$('a',this).attr('href'), // ��ȡ��������ҳ����
    };
    // ���������ŷ���һ����������
    news.push(news_item);
});

 console.log(news);
    });

}).on('error', function(err) {
    console.log(err);
});

