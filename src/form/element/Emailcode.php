<?php
namespace xqkeji\app\admin\form\element;
use xqkeji\app\base\form\element\EmailCode as BaseEmailCode;
use xqkeji\App;
class Emailcode extends BaseEmailCode
{
	public function beforeAdd()
	{
		$auth=App::getAuth();
		$auth_type=$auth->getCurrentAuthType();
		$email_code_range=App::p("emailCodeRange",[]);
		$email_code_open=(int)App::c("admin_config","email_code_open",0);
		if(!$email_code_open && !isset($email_code_range[$auth_type]))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}
