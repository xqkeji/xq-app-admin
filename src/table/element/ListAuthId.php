<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;
class ListAuthId extends ListItem
{
	protected $name = 'auth_id';
	protected $attrs= [
		'style'=>'min-width:100px;',
	];
	public function format($value)
	{
		if($value){
			$model=Model::getModel('user');
			$user = $model->find($value);
			if($user){
				return $user->getAttr('username');
			}
		}
		return '未找到用户';
	}
}
