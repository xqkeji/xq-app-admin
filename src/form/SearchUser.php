<?php
return [
	'form',
	'name'=>'search_user',
	'attr_method'=>'get',
	'attr_class'=>'d-flex flex-wrap justify-content-end gap-2',
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
