<?php
namespace xqkeji\app\admin\model;
use xqkeji\mvc\model\Model;
use xqkeji\mvc\model\Config;
use xqkeji\Event;
use xqkeji\App;
class Email extends Model
{
    public function afterWrite($data=null)
	{
		$result=[];
		$rows=$this->db()->where(['status'=>1])->findAll();
		foreach($rows as $row)
		{
			$result[]=$row->toArray();
		}
		Config::set('admin_email',$result);
	}
}