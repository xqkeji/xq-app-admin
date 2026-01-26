<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\Form;
class SearchLoger extends Form
{
	protected $name = 'search_loger';
	protected $attrs=[
		'method'=>'get',
		'class'=>'d-flex flex-wrap justify-content-end gap-2',
	];
	protected $el=[
		[
			'@SearchKey',
			'name'=>'xq-s-module|controller|action|message,like',
			'text'=>'关键字',
		],
		'@SearchSubmit',
	];
}