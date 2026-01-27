<?php
namespace xqkeji\app\admin\table;
use xqkeji\form\Table;
class ListLoger extends Table
{
    protected $name = 'list_loger';
	protected $foot = '~ListFootLoger';
	protected $el = [
		'@ListId',
		[
			'@ListName',
			'name'=>'module',
			'text'=>'模块名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@ListName',
			'name'=>'controller',
			'text'=>'控制器名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@ListName',
			'name'=>'action',
			'text'=>'动作名称',
			'attrs'=>[
				'style'=>'min-width:120px;',
			],
		],
		[
			'@ListName',
			'name'=>'params',
			'text'=>'参数数组',
			'attrs'=>[
				'style'=>'min-width:150px;',
			],
		],
		'~ListAuthId',
		[
			'@ListName',
			'name'=>'message',
			'text'=>'日志消息',
			'attrs'=>[
				'style'=>'min-width:200px;',
			],
		],
		'@ListCreateTime',
		
	];
}