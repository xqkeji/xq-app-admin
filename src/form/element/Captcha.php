<?php
namespace xqkeji\app\admin\form\element;
use xqkeji\app\base\form\element\Captcha as BaseCaptcha;
use xqkeji\App;
class Captcha extends BaseCaptcha
{
	public function beforeAdd()
	{
		$auth=App::getAuth();
		$auth_type=$auth->getCurrentAuthType();
		$image_code_range=App::p("imageCodeRange",[]);
		$image_code_open=(int)App::c("admin_config","image_code_open",1);
		if(!$image_code_open && !isset($image_code_range[$auth_type]))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}