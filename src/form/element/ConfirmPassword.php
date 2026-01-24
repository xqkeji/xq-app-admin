<?php
namespace xqkeji\app\admin\form\element;
use xqkeji\form\element\Password;
class ConfirmPassword extends Password
{
	protected $name='confirm_password';
	protected $text='确认密码';
	protected $attrs=[
		'class'=>'form-control',
		'required'=>1,
		'placeholder'=>'请输入确认密码',
		'autocomplete'=>'new-password',
	];
	protected $template = '@row';
	protected $filters=['string'];
	protected $vt=[
		[
			'$confirm',
			'allowEmpty'=>false,
			'with'=>'password',
		]
	];
	public  function beforeAdd()
	{
		$controller=\xqkeji\App::getController();
		$actionName=$controller->getActionName();
		if($actionName=='edit')
		{
			$attributes=$this->getAttrs();
			unset($attributes['required']);
			$attributes['placeholder']='请输入确认密码(不用修改密码时，不要填写)';
			$this->setAttrs($attributes);
			$validators=$this->getValidators();
			$validator=$validators['$confirm'];
			$validator->setOption('allowEmpty',true);
		}
	}
}

