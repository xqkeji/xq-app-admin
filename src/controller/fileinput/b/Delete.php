<?php
namespace xqkeji\app\admin\controller\fileinput\b;

use xqkeji\mvc\action\b\Delete as BaseAction;
use xqkeji\app\admin\traits\FileDelete;

class Delete extends BaseAction
{
	use FileDelete;

	// 批量删除同样要先清文件，此时文档还在，能按 _id 取到 url
	public function run()
	{
		$this->unlinkFiles();
		parent::run();
	}
}
