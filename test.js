"use strict"

function Student(n,e,a)
{
	
	console.log("a=",a);
	var	 s_name,s_email ,s_age;
    a=0;
	s_name=n;
	s_email=e;
	
	s_age=a;
	function get_n()
	{
		a++;
		console.log("a=",a);
		return s_name;
		
	}
	return get_n;
}

var get_name = Student("gao","gpj!qq",30);
var name=get_name();
get_name();
console.log(name);