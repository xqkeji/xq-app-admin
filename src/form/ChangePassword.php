<?php
return [
	'form',
	[
		'template'=>'row',
		'attr_class'=>'form-control',
		'attr_required'=>'1',
		[
			'password','name'=>'password','text'=>'原登录密码','validators'=>[['required']],
		],
		[
			'password','name'=>'new_password','text'=>'新登录密码','validators'=>[['required']],
		],
		[
			'password','name'=>'confirm_password','text'=>'确认密码',
			'validators'=>[
				['required'],
				[
					'confirm',
					'allowEmpty'=>false,
					'with'=>'new_password',
				]
			],
		],
		'csrf',
	],
	
];
