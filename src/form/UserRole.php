<?php
return [
	'tab_form',
	[
		[
			'tab',
			'name'=>'role_info',
			'text'=>'基本信息',
			[
				'template'=>'row',
				'attr_class'=>'form-control',
				[	
					'text',
					'text'=>'角色名',
					'name'=>'rolename',
					'attr_required'=>'1',
					'validators'=>[
						['required'],
					],
				],
				[	
					'text_area',
					'text'=>'角色描述',
					'name'=>'desc',
					'attr_rows'=>3,
					'attr_cols'=>20,
				],
				'switch',
			],
		],
		[
			'tab',
			'name'=>'role_auth',
			'text'=>'授权信息',
			[
				'template'=>'row',
				'attr_class'=>'form-control',
				'auth',
				'csrf',
			],
		],
	
	],
	'event'=>[
		'beforeBind'=>function($form){
			$controller=\xqkeji\App::getController();
			$actionName=$controller->getActionName();
			$data=$form->getData();
			
			if(!isset($data['status']))
			{
				$data['status']=0;
			}
			if(!isset($data['auth']))
			{
				$data['auth']=[];
			}
			$form->setData($data);
		}
	],
];
