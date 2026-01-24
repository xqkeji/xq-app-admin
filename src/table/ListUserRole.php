<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class ListUserRole extends Table
{
    protected $name = 'list_user_role';
	protected $foot='@ListFoot';
	protected $el = [
		'@ListId',
		[
			'@ListName',
			'name'=>'rolename',
			'text'=>'角色名',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@ListDesc',
		'@ListSwitch',
		'@ListCreateTime',
		'@ListUpdateTime',
		'@ListEditDelete',
		
	];
}
