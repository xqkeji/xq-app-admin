<?php
namespace xqkeji\app\admin\table;
class ListEmail extends BaseList
{
    protected $name = 'list_email';
	protected $el = [
		'@ListId',
		[
			'@ListName',
			'name'=>'host',
			'text'=>'服务器地址',
			'attrs'=>[
				'style'=>'min-width:150px;',
			],
		],
		[
			'@ListName',
			'name'=>'port',
			'text'=>'发件端口',
			'attrs'=>[
				'style'=>'min-width:80px;',
			],
		],
		[
			'@ListName',
			'name'=>'nickname',
			'text'=>'发件昵称',
			'attrs'=>[
				'style'=>'min-width:80px;',
			],
		],
		[
			'@ListName',
			'name'=>'username',
			'text'=>'邮箱账号',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		'@ListSwitch',
		'@ListEditDelete',
		'~ListFoot'
	];
}
