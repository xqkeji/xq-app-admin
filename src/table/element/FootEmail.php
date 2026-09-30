<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\ListFoot as BaseListFoot;
class Foot extends BaseListFoot
{
    protected $name = 'list_foot';
    protected $buttons = [
        '@AddButton',
        '@BDeleteButton',
		[
			'$Button',
			'name'=>'batch_test',
			'attrs'=>[
				'value'=>'发送测试邮件',
				'class'=>'btn btn-warning me-1 xq-batch',
			],
		]
    ];
      
}
