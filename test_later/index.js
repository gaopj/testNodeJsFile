//测试延时模块

var later = require('later');
later.date.localTime();
console.log("Now:"+new Date());
var sched = later.parse.recur().every(1).hour();

next = later.schedule(sched).next(10);
console.log(next);

var timer = later.setInterval(test,sched);
//设置2秒后立刻先执行一次
setTimeout(test,2000);
function test(){
	console.log(new Date());
}