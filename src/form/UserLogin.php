<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\Form;
class UserLogin extends Form
{
	protected $name = 'login_form';

	protected $el = [
		[
			'@Username',
			'vars'=>[
				'icon'=>'bi bi-person-circle',
			],
			'attrs'=>[
				'placeholder'=>'请输入登录账号',
			],
			'template'=>'@AdminLogin',
		],
		[
			'@Password',
			'vars'=>[
				'icon'=>'bi bi-key-fill',
			],
			'attrs'=>[
				'placeholder'=>'请输入登录密码',
			],
			'template'=>'@AdminLogin',
		],
		[
			'@Captcha',
			'vars'=>[
				'icon'=>'bi bi-file-code-fill',
			],
			'attrs'=>[
				'placeholder'=>'请输入验证码',
			],
			'template'=>'@AdminLogin',
		],
		'@Csrf',
		[
			'$Submit',
			'attrs'=>[
				'value'=>'登录',
				'class'=>'btn btn-success',
				'style'=>'',
			],
			'template'=>'@AdminLoginBtn',
		]
	];
}

