<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class UserRole extends Table
{
    protected $name = 'list_user_role';
	protected $foot='@Foot';
	protected $el = [
		'@Id',
		[
			'@Name',
			'name'=>'rolename',
			'text'=>'角色名',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@Desc',
		'@Switch',
		'@CreateTime',
		'@UpdateTime',
		'@EditDelete',
		
	];
}
