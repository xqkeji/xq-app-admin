<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\Form;
class SearchUser extends Form
{
	protected $name = 'search_user';
	protected $attrs=[
		'method'=>'get',
		'class'=>'d-flex flex-wrap justify-content-end gap-2',
	];
	protected $el=[
		[
			'@SearchKey',
			'name'=>'xq-s-username|fullname,like',
		],
		'@SearchSubmit',
	];
}

