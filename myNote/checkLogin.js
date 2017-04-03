//未登陆
function noLogin(req,res,next){
	if(!req.session.user){
		console.log('sorry,you not login!');
		return res.redirect('login');//返回登陆页面
	}
	next();
}

exports.noLogin = noLogin;