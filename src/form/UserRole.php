<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\TabForm;
class UserRole extends TabForm
{
	protected $name = 'role_form';
	protected $el=[
		[
			'$Tab',
			'name'=>'role_info',
			'text'=>'基本信息',
			'el'=>[
				[
					'@Username',
					'name'=>'rolename',
					'text'=>'角色名',
				],
				[
					'@Desc',
					'name'=>'desc',
					'text'=>'角色描述',
				],
				'@Switch',
			],
		],
		[
			'$Tab',
			'name'=>'role_auth',
			'text'=>'授权信息',
			'el'=>[
				'@Auth',
				'@Csrf',
			],
		],
		'@SubmitReset'
	];
	public static function beforeBind($form)
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		$data=$form->getData();
		
		if(!isset($data['status']))
		{
			$data['status']=0;
		}
		if(!isset($data['auth']))
		{
			$data['auth']=[];
		}
		$form->setData($data);
	}
}

