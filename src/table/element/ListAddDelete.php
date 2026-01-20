<?php
namespace xqkeji\app\base\form\element;
use xqkeji\form\element\Div;
class ListAddDelete extends Div
{
	protected $name = 'list-add-delete';
	protected $attrs= [
		'class'=>'me-auto',
	];
	protected $el=[
		[
			'$Button',
			'name'=>'add',
			'attrs'=>[
				'value'=>'添加',
				'class'=>'btn btn-primary mr-1 xq-add',
			],
		],
		[
			'$Button',
			'name'=>'b_delete',
			'attrs'=>[
				'value'=>'删除',
				'class'=>'btn btn-danger me-1 xq-batch',
			],
		],
		[
			'$BatchDelete',
			'name'=>'batch_test',
			'attrs'=>[
				'value'=>'发送测试邮件',
				'class'=>'btn btn-warning me-1 xq-batch',
			],
		]
	];
}
