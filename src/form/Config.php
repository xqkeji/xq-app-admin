<?php
namespace xqkeji\app\admin\form;
use xqkeji\form\TabForm;
class Config extends TabForm
{
	protected $name = 'config';
	protected $el=[
		[
			'$tab',
			'name'=>'base_info',
			'text'=>'网站基本信息',
			'el'=>[
				[
					'@Title',
					'name'=>'site_name',
					'text'=>'网站名称',
				],
				[
					'@Title',
					'name'=>'site_domain',
					'text'=>'网站域名',
				],
				[
					'@Email',
					'name'=>'site_email',
					'text'=>'网站邮箱',
				],
				[
					'@ImageFile',
					'name'=>'site_logo',
					'text'=>'网站LOGO',
				],
			],
		],
		[
			'$tab',
			'name'=>'seo_info',
			'text'=>'SEO信息',
			'el'=>[
				[
					'@SeoTitle',
				],
				[
					'@SeoKeyword',
				],
				[
					'@SeoDesc',
				],
			]
		],
		'@Csrf',
		'@SubmitReset',
	];
}


