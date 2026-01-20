<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\Form;
class Email extends Form
{
	protected $name = 'email';
	protected $el=[
		[
			'@Title',
			'name'=>'host',
			'text'=>'服务器地址',
		],
		[
			'@ordernum',
			'name'=>'port',
			'text'=>'发件端口',
			'defaultValue'=>'465',
		],
		[
			'@Title',
			'name'=>'nickname',
			'text'=>'发件昵称',
		],
		[
			'@Username',
			'name'=>'username',
			'text'=>'邮箱账号',
		],
		[
			'@Password',
			'name'=>'password',
			'text'=>'邮箱密码',
		],
		'@Switch',
		'@Csrf',
		'@SubmitReset',
	];
}

