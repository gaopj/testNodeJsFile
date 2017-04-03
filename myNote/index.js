var express =require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto=require('crypto');
var session = require('express-session');
var checkLogin = require('./checkLogin.js');
var moment =require('moment');
//引入mongoose
var mongoose = require('mongoose');

//引入模型
var models = require('./models/models');

//使用mongoose连接服务
mongoose.connect('mongodb://127.0.0.1:27017/notes');
mongoose.connection.on('error',console.error.bind(console,'mongodb connect fail连接数据库失败'));
mongoose.connection.once('open', function(){
	console.log("connected@!");
});
var app=express();

//定义EJS模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//建立session模型
app.use(session({
	secret:'1234',
	name:'mynote',
	cookie:{maxAge:1000*60*20},//设置session的保存时间为20分钟
	resave:false,
	saveUninitialized:true
}));

var User = models.User;
var Note = models.Note;
//响应首页get请求
app.get('/',checkLogin.noLogin);
app.get('/',function(req,res)
{

	Note.find({author:req.session.user.username})
	.exec(function(err,allNotes){
	if(err){
		console.log(err);
		return res.redirect('/');
	}
		res.render('index',{
		title:'首页',
		user:req.session.user,
		notes:allNotes
		});
	});
		// res.render('index',{
		// user:req.session.user,
		// title:'首页',
		// });
});

app.get('/detail/:_id',function(req,res){
	console.log('show paper 查看笔记');
	Note.findOne({_id:req.params._id})
		.exec(function(err,art){
			if(err){
				console.log(err);
				return res.redirect('/');
			}
			if(art){
				res.render('detail',{
				title:'笔记详情',
				user:req.session.user,
				art:art,
				moment:moment
				});
			}
		});
});

app.get('/register',function(req,res){
	console.log('register注册！');
	res.render('register',{
		user:req.session.user,
		title:'注册',
		err:'error'
	});
});

//post请求
app.post('/register',function(req,res){
	//req.body 可以获取到表单的每项数据
	var username = req.body.username,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

	//检查输入的用户名是否为空，使用trim去掉两端空格
	if(username.trim().length==0){
		console.log('username can not null 用户名不能为空！');
		return res.redirect('/register');
	}

	//检查输入的密码是否为空，使用trim去掉两端空格
	if(password.trim().length==0){
		console.log('password can not null 密码不能为空！');
		return res.redirect('/register');
	}

	//检查两次输入的密码是否一致
	if(password!=passwordRepeat){
		console.log('password is not same 两次输入密码不一致');
		return res.redirect('/register');
	}

	//检查用户名是否已经存在，如果不存在，则保存该条记录
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		if(user){
			console.log('username has been 用户名已经存在');
			return res.redirect('/register');			
		}

		var md5  = crypto.createHash('md5'),
			md5password = md5.update(password).digest('hex');

		//新建user对象用于保存数据
		var newUser = new User({
			username:username,
			password:md5password
		});
		newUser.save(function(err,doc){

			if(err){
				console.log(err);
				return res.redirect('/register');
			}
			console.log('register success注册成功！');
			return res.redirect('/');
		});
	});
});

app.get('/login',function(req,res){
	console.log('login 登录');
	res.render('login',{
		user:req.session.user,
		title:'登录'
	});
});
app.post('/login',function(req,res){
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/login');
		}
		if(!user){
			console.log('user does not exist');
			return res.redirect('/login');
		}

		//对密码进行md5加密
		var md5 = crypto.createHash('md5'),
			md5password=md5.update(password).digest('hex');
		if(user.password!==md5password){
			console.log('password error!');
			return res.redirect('/login');
		}
		console.log('login success!');
		user.password=null;
		delete user.password;
		req.session.user=user;
		return res.redirect('/');
	})
});

app.get('/quit',function(req,res){
	req.session.user=null;
	console.log('quit 退出');
    return res.redirect('/login');
});

app.get('/post',function(req,res){
	console.log('发布');
	res.render('post',{
		user:req.session.user,
		title:'发布'
	});
});
app.post('/post',function(req,res){
	console.log(req.session.user);
	var note = new Note({
		title:req.body.title,
		author:req.session.user.username,
		tag:req.body.tag,
		content:req.body.content
	});
	note.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/post');
		}
		console.log('send paper success 文章发表成功！');
		return res.redirect('/');
	});
});


app.listen(3000,function(req,res)
{
	console.log('app is running at port 3000');
});