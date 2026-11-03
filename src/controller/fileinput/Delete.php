<?php
namespace xqkeji\app\admin\controller\fileinput;

use xqkeji\mvc\action\Delete as BaseAction;
use xqkeji\app\admin\traits\FileDelete;

class Delete extends BaseAction
{
	use FileDelete;

	// 先按记录里的 url 删磁盘文件，再交给框架删文档
	public function run()
	{
		$this->unlinkFiles();
		parent::run();
	}
}
