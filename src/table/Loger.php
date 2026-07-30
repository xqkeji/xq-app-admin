<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class Loger extends Table
{
    protected $name = 'list_loger';
	protected $foot = '~FootLoger';
	protected $el = [
		'@Id',
		[
			'@Name',
			'name'=>'module',
			'text'=>'模块名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@Name',
			'name'=>'controller',
			'text'=>'控制器名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@Name',
			'name'=>'action',
			'text'=>'动作名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@Name',
			'name'=>'params',
			'text'=>'参数数组',
			'attrs'=>[
				'style'=>'min-width:150px;',
			],
		],
		'~AuthId',
		[
			'@Name',
			'name'=>'message',
			'text'=>'日志消息',
			'attrs'=>[
				'style'=>'min-width:200px;',
			],
		],
		'@CreateTime',
		
	];
}