<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class User extends Table
{
    protected $name = 'list_user';
	protected $foot='@Foot';
	protected $el = [
		'@Id',
		'@Username',
		'@Fullname',
		'@Switch',
		[
			'@Name',
			'name'=>'login_counts',
			'text'=>'登录次数',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@LoginTime',
		[
			'@Name',
			'name'=>'login_ip',
			'text'=>'登录IP',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@EditDelete',
		
	];
}

