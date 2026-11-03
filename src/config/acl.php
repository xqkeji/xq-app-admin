<?php
return [
	'admin'=>[
		'auth'=>[
			'user'=>['admin','add','edit','delete','change','b_delete'],
			'user_role'=>['admin','add','edit','delete','change','b_delete'],
			'config'=>['update_config','update_statics'],
			'email'=>['admin','add','edit','delete','change','b_delete','batch_test'],
			'loger'=>['admin'],
			'fileinput' => [
                'admin',
                'delete',
                'b_delete',
            ],
			'hugerte' => [
                'admin',
                'delete',
                'b_delete',
            ],
		],
		'login'=>[
			'user'=>['change_password','index','logout'],
			'admin'=>['welcome','test'],
			'doc' => [
                'upload',
                'delete',
            ],
            'image' => [
                'upload',
                'delete',
            ],
            'hugerte' => [
                'upload',
                'browse',
            ],
		],
	],
	'guest'=>[
		'user'=>['login','captcha'],
		'install'=>['index']
	],
];