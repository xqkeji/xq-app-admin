<?php
/*
 * xqkeji.cn
 * @copyright 2021 新齐科技 (http://www.xqkeji.cn/)
 * @author 张文豪  <support@xqkeji.cn>
 */
namespace xqkeji\app\admin\traits;

use xqkeji\mvc\builder\Model;

/**
 * 删除附件记录时同步删除磁盘文件
 * 框架的 action\Delete 与 action\b\Delete 只删文档，动作类继承后用本 trait 在 parent::run() 前把文件清掉
 */
trait FileDelete
{
	// 同一集合里图片行存 image_url、文档行存 file_url，缩略图统一 thumb_url
	protected $deleteUrlFields = ['image_url', 'file_url', 'thumb_url'];

	/**
	 * 取本次请求要删除的记录 _id
	 * 单条删除 xq-delete 提交 {"id":"xxx"}，批量删除 xq-batch 提交 {"id":{下标:值}} 或 {"id":[值...]}
	 */
	protected function requestIds(): array
	{
		$body = $this->request->getJsonRawBody(true);
		if (is_array($body) === false || isset($body['id']) === false) {
			$body = (array)$this->request->getPut();
		}
		$id = $body['id'] ?? '';
		if (is_array($id)) {
			return array_values(array_filter($id, 'is_scalar'));
		}
		return $id === '' || $id === null ? [] : [$id];
	}

	protected function unlinkFiles(): void
	{
		$ids = $this->requestIds();
		if (empty($ids)) {
			return;
		}
		$model = Model::getModel($this->modelName);
		$www_path = call_user_func(['xqkeji\\App', 'getWwwPath']);
		foreach ($ids as $id) {
			$row = call_user_func_array([$model, 'find'], [$id]);
			if (empty($row)) {
				continue;
			}
			$data = $row->toArray();
			foreach ($this->deleteUrlFields as $field) {
				if (empty($data[$field])) {
					continue;
				}
				$file = $www_path . str_replace(['/', '\\'], XQ_DS, $data[$field]);
				if (is_file($file)) {
					unlink($file);
				}
			}
		}
	}
}
