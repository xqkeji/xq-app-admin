<?php
return [
	'default'=>[
		'rule'=>'/admin/:controller/:action',//路由规则
		'handler'=>'[1]@[2]',
		'host'=>'',
		'method'=>'',
	],
	'admin'=>[
		'rule'=>'/admin',		
		'handler'=>'user@index',
	],
	'admin_login'=>[
		'rule'=>'/admin/admin/login',
		'handler'=>'admin@login',
	],
];