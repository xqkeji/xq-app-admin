<?php
return [
	'form',
	'attr_class'=>'form-inline d-flex justify-content-end',
	[
		[
			'text',
			'template'=>'search',
			'text'=>'关键字：',
			'name'=>'username|fullname#like',
			'attr_class'=>'form-control me-2',
		],
		'csrf',
		'list_search'
	],
	'foot'=>'',
];
