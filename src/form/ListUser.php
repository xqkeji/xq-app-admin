<?php
return [
	'list_form',
	'wrap'=>[],
	'table'=>[],
	[
		'ListId',
		['text'=>'用户名','name'=>'username'],
		['text'=>'姓名','name'=>'fullname'],
		'ListSwitch',
		['text'=>'登录次数','name'=>'login_counts'],
		'ListLoginTime',
		['text'=>'登录IP','name'=>'login_ip','attr_style'=>'width:120px;',],
		'ListEditDelete',
	],
	
];
