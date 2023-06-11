<?php
return [
	'title'=>'系统管理',
	'children'=>[
		[
			'url'=>'config/update_config',
			'title'=>'系统配置',
			'icon'=>'fas fa-cog',
		],
		[
			'url'=>'config/update_statics',
			'title'=>'更新静态文件',
			'icon'=>'fas fa-sync-alt',
		],
		[
			'url'=>'user/admin',
			'title'=>'管理员管理',
			'icon'=>'fa fa-user',
		],
		[
			'url'=>'user_role/admin',
			'title'=>'角色管理',
			'icon'=>'fas fa-object-group',
		],
		[
			'url'=>'user/change_password',
			'title'=>'修改密码',
			'icon'=>'fa fa-key',
		],
		[
			'url'=>'user/logout',
			'title'=>'退出登录',
			'class'=>'xq-logout',
			'icon'=>'fas fa-sign-out-alt',
		],
	],
	
];