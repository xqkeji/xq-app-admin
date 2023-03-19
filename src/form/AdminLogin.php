<?php
return [
	'form',
	'name'=>'login_form',
	'foot'=>'',
	[
		'template'=>'admin_login',
		'attr_class'=>'form-control',
		'attr_required'=>true,
		[
			'text',
			'name'=>'username',
			'var_icon'=>'bi bi-person-circle',
			'attr_placeholder'=>'请输入登录账号',
		],
		[
			'password',
			'name'=>'password',
			'var_icon'=>'bi bi-key-fill',
			'attr_placeholder'=>'请输入登录密码',
		],
		[
			'text',
			'template'=>'admin_captcha',
			'name'=>'captcha',
			'attr_placeholder'=>'验证码',
			'attr_style'=>'float:left;',
			'var_url'=>'/admin/user/captcha',
		],
		'csrf',
		[
			'submit',
			'template'=>'admin_login_btn',
			'name'=>'submit',
			'attr_value'=>'登录',
			'attr_class'=>'btn btn-success'
		]
	],
];
