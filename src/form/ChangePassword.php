<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\Form;
class ChangePassword extends Form
{
	protected $name = 'change_password';
	protected $el=[
		[
			'@Password',
			'text'=>'原登录密码',
		],
		[
			'@Password',
			'name'=>'new_password',
			'text'=>'新登录密码',
		],
		[
			'@ConfirmPassword',
			'text'=>'确认密码',
			'vt'=>[
				['$required'],
				[
					'$confirm',
					'allowEmpty'=>false,
					'with'=>'new_password',
				],
			],
		],
		'@Csrf',
		'@SubmitReset',
	];
}

