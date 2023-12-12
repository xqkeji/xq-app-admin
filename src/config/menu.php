<?php
return [
	'admin'=>[
		'title'=>'系统管理',
		'children'=>[
			[
				'url'=>'config/update_config',
				'title'=>'系统配置',
				'icon'=>'bi bi-gear-fill',
			],
			[
				'url'=>'config/update_statics',
				'title'=>'更新静态文件',
				'icon'=>'bi bi-arrow-repeat',
			],
			[
				'url'=>'user/admin',
				'title'=>'管理员管理',
				'icon'=>'bi bi-person-fill',
			],
			[
				'url'=>'user_role/admin',
				'title'=>'角色管理',
				'icon'=>'bi bi-people-fill',
			],
			[
				'url'=>'user/change_password',
				'title'=>'修改密码',
				'icon'=>'bi bi-key-fill',
			],
			[
				'url'=>'user/logout',
				'title'=>'退出登录',
				'class'=>'xq-logout',
				'icon'=>'bi bi-sign-turn-left-fill',
			],
		],
	],
	
	
];