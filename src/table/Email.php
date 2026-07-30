<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class Email extends Table
{
    protected $name = 'list_email';
	protected $foot='~Foot';
	protected $el = [
		'@Id',
		[
			'@Name',
			'name'=>'host',
			'text'=>'服务器地址',
			'attrs'=>[
				'style'=>'min-width:150px;',
			],
		],
		[
			'@Name',
			'name'=>'port',
			'text'=>'发件端口',
			'attrs'=>[
				'style'=>'min-width:80px;',
			],
		],
		[
			'@Name',
			'name'=>'nickname',
			'text'=>'发件昵称',
			'attrs'=>[
				'style'=>'min-width:80px;',
			],
		],
		[
			'@Name',
			'name'=>'username',
			'text'=>'邮箱账号',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@SwitchCheck',
		'@EditDelete',
	];
}
