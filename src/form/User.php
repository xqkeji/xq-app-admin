<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\TabForm;
class User extends TabForm
{
	protected $name = 'user_form';
	public static function beforeBind($form)
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		$data=$form->getData();
		
		if($actionName=='edit')
		{
			
			if(empty($data['password']))
			{
				unset($data['password']);
			}
			if(empty($data['confirm_password']))
			{
				unset($data['confirm_password']);
			}
		}
		if(!isset($data['status']))
		{
			$data['status']=0;
		}
		if(!isset($data['roles']))
		{
			$data['roles']=[];
		}
		if(!isset($data['auth']))
		{
			$data['auth']=[];
		}
		$form->setData($data);
	}
	protected $el=[
		[
			'$Tab',
			'text'=>'基本信息',
			'name'=>'user_info',
			'el'=>[
				'@Username',
				'~Password',
				'~ConfirmPassword',
				'@Fullname',
				'@Switch',
				'@Roles',
			]
		],
		[
			'$Tab',
			'text'=>'授权信息',
			'name'=>'user_auth',
			'el'=>[
				'@Auth',
				'@Csrf',
			],
		],
		'@SubmitReset',
	];
}
