<?php
namespace xqkeji\app\admin\element;
use xqkeji\form\element\Password;
class ConfirmPassword extends Password
{
	protected $name='confirm_password';
	protected $text='确认密码';
	protected $attrs=[
		'class'=>'form-control',
		'required'=>1,
		'placeholder'=>'请输入密码',
		'autocomplete'=>'new-password',
	];
	protected $filters=['string'];
	protected $vt=[
		[
			'$confirm',
			'allowEmpty'=>false,
			'with'=>'password',
		]
	];
	public static function beforeAdd($element)
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		if($actionName=='edit')
		{
			$attributes=$element->getAttrs();
			unset($attributes['required']);
			$attributes['placeholder']='请输入确认密码(不用修改密码时，不要填写)';
			$element->setAttrs($attributes);
			$validators=$element->getValidators();
			$validator=$validators[0];
			$validator->setOption('allowEmpty',true);
		}
	}
}

