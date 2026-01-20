<?php
namespace xqkeji\app\admin\table;
class ListUser extends BaseList
{
    protected $name = 'list_user';
	protected $el = [
		'@ListId',
		'@ListUsername',
		'@ListFullname',
		'@ListSwitch',
		[
			'@ListName',
			'name'=>'login_counts',
			'text'=>'登录次数',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@ListLoginTime',
		[
			'@ListName',
			'name'=>'login_ip',
			'text'=>'登录IP',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@ListEditDelete',
		'~ListFoot'
	];
}

