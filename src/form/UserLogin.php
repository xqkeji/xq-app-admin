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
			'import'=>'username',
			'var_icon'=>'bi bi-person-circle',
			'attr_placeholder'=>'请输入登录账号',
		],
		[
			'import'=>'password',
			'var_icon'=>'bi bi-key-fill',
			'attr_placeholder'=>'请输入登录密码',
		],
		[
			'import'=>'captcha',
			'var_icon'=>'bi bi-file-code-fill',
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
