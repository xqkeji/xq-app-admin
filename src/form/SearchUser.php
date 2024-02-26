<?php
return [
	'form',
	'name'=>'search_user',
	'attr_method'=>'get',
	'attr_class'=>'form-inline d-flex justify-content-end',
	[
		[
			'text',
			'template'=>'search',
			'text'=>'关键字：',
			'name'=>'xq-s-username|fullname,like',
			'attr_class'=>'form-control me-2',
		],
		'list_search'
	],
	'foot'=>'',
];
