<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\TabForm;
class User extends TabForm
{
	protected $name = 'user_form';
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
				'@SwitchCheck',
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
	public function beforeBind()
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		$data=$this->getData();
		
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
		$this->setData($data);
	}
	
}
