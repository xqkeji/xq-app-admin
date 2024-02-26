<?php
return [
	'form',
	[
		'template'=>'row',
		'attr_class'=>'form-control',
		'attr_required'=>'1',
		[
			'import'=>'title',
			'name'=>'host',
			'text'=>'服务器地址',
		],
		[
			'import'=>'ordernum',
			'name'=>'port',
			'text'=>'发件端口',
			'defaultValue'=>'465',
		],
		[
			'import'=>'title',
			'name'=>'nickname',
			'text'=>'发件昵称',
		],
		[
			'import'=>'username',
			'text'=>'邮箱账号',
		],
		[
			'import'=>'password',
			'text'=>'邮箱密码',
		],
		'switch',
		'csrf',
	],
	
];
