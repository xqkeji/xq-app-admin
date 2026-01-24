<?php
namespace xqkeji\app\admin\form\element;
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
	protected $template = '@row';
	protected $filters=['string'];
	protected $vt=[
		[
			'required',
		]
	];
	public function beforeAdd()
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		if($actionName=='edit')
		{
			$attributes=$this->getAttrs();
			unset($attributes['required']);
			$attributes['placeholder']='请输入密码(不用修改密码时，不要填写)';
			$this->setAttrs($attributes);
			$this->setValidators([]);
		}
	}
}
