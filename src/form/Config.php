<?php
return [
	'tab_form',
	[
		[
			'tab',
			'name'=>'base_info',
			'text'=>'网站基本信息',
			[
				'template'=>'row',
				'attr_class'=>'form-control',
				'attr_required'=>'1',
				[
					'text',
					'name'=>'site_name',
					'text'=>'网站名称',
				],
				[
					'text',
					'name'=>'site_domain',
					'text'=>'网站域名',
				],
			],
		],
		[
			'tab',
			'name'=>'seo_info',
			'text'=>'SEO信息',
			[
				'template'=>'row',
				'attr_class'=>'form-control',
				'attr_required'=>'1',
				[
					'text',
					'name'=>'seo_title',
					'text'=>'网站标题',
				],
				[
					'text',
					'name'=>'seo_keyword',
					'text'=>'网站关键字',
				],
				[
					'text_area',
					'name'=>'seo_desc',
					'text'=>'网站描述',
					'attr_rows'=>'8',
					'attr_cols'=>'30',
				],
			],
		],
		/*[
			'text'=>'邮件设置',
			'elements'=>[
				
			],
		],
		[
			'text'=>'站点参数',
			
			'elements'=>[
				
			],
		],*/
		
			
	],
	
];
