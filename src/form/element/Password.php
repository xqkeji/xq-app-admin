<?php
namespace xqkeji\app\admin\element;
use xqkeji\form\element\Password as BasePassword;
class Password extends BasePassword
{
	protected $name='password';
	protected $text='密码';
	protected $attrs=[
		'class'=>'form-control',
		'required'=>1,
		'placeholder'=>'请输入密码',
		'autocomplete'=>'new-password',
	];
	protected $filters=['string'];
	protected $vt=[
		[
			'required',
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
			$attributes['placeholder']='请输入密码(不用修改密码时，不要填写)';
			$element->setAttrs($attributes);
			$element->setValidators([]);
		}
	}
}
