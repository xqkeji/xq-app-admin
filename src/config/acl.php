<?php
return [
	'admin'=>[
		'auth'=>[
			'user'=>['admin','add','edit','delete','change','b_delete'],
			'user_role'=>['admin','add','edit','delete','change','b_delete'],
			'config'=>['update_config','update_statics'],
			'email'=>['admin','add','edit','delete','change','b_delete','batch_test'],
			'loger'=>['admin'],
			'attach' => [
                'admin',
                'delete',
                'b_delete',
            ],
			'editor' => [
                'admin',
                'delete',
                'b_delete',
            ],
		],
		'login'=>[
			'user'=>['change_password','index','logout'],
			'admin'=>['welcome'],
			'doc' => [
                'upload',
                'delete',
            ],
            'image' => [
                'upload',
                'delete',
            ],
            'editor' => [
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