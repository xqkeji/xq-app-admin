<?php
/*
 * xqkeji.cn
 * @copyright 2021 新齐科技 (http://www.xqkeji.cn/)
 * @author 张文豪  <support@xqkeji.cn>
 */
namespace xqkeji\app\admin\traits;

use xqkeji\mvc\builder\Model;

/**
 * bootstrap-fileinput ajax 上传的公共流程（校验->落盘->入库->回显），供图片/文档控制器复用
 * 使用方需定义属性：$allowedFileExtensions、$maxSize、$maxFileCount、$fileUrlField、$deleteMessage
 * $fileType 可选：入库行里已显式给出 type 时无需定义
 * $modelTable 可选：留档表名，为空时框架按当前控制器名推断
 */
trait FileUpload
{
	// 落盘前校验钩子，校验失败调用 errorJson 后返回 null
	protected function beforeSave($file)
	{
		return true;
	}

	// 落盘后保存记录并返回 bootstrap-fileinput 的回显数据，返回 null 表示已输出错误
	abstract protected function buildResult($file, $desPath, $destFile, $uploadUrl);

	// 留痕参数：bootstrap-fileinput 走 POST，富文本编辑器把参数挂在上传 URL 上（GET），两处都要取
	protected function param(string $name): string
	{
		$post = $this->request->GetPost();
		$query = $this->request->GetQuery();
		return htmlspecialchars((string) ($post[$name] ?? $query[$name] ?? ''));
	}

	protected function errorJson(array $error)
	{
		$this->returnJSON(['code' => $error['code'], 'error' => $error['error']]);
	}

	// 单个文件的完整校验流程，校验失败调用 errorJson 并返回 null
	protected function uploadFile($file)
	{
		if ($this->maxSize > 0 && ($file->getSize() / 1024 > $this->maxSize)) {
			$this->errorJson(['code' => 10002, 'error' => '超出最大文件大小']);
			return null;
		}
		if (!in_array(strtolower($file->getExtension()), $this->allowedFileExtensions)) {
			$this->errorJson(['code' => 10003, 'error' => '非法文件类型']);
			return null;
		}
		if ($this->beforeSave($file) !== true) {
			return null;
		}
		return $this->storeFile($file);
	}

	// caption 取上传文件的原始名，而非前端的 input id
	protected function fileName($file): string
	{
		return htmlspecialchars($file->getName());
	}

	// zoomable=false：文档类预览无法放大，不应返回 zoomData
	protected function previewJson($file, string $url, string $type, string $key, bool $zoomable = false)
	{
		$config = [
			'type' => $type,
			'caption' => $this->fileName($file),
			'key' => $key,
			'size' => $file->getSize(),
		];
		if ($zoomable) {
			$config['zoomData'] = $url;
		}
		$this->returnJSON([
			'initialPreview' => [$url],
			'initialPreviewAsData' => true,
			'initialPreviewConfig' => [$config],
			'append' => true,
		]);
	}

	// 附件模型：$modelTable 为空时按框架默认（当前控制器名）推断表名
	protected function model()
	{
		$table = $this->modelTable ?? '';
		return $table === '' ? Model::getModel() : Model::getModel($table);
	}

	protected function saveRow($file, array $row): string
	{
		$model = $this->model();
		$model->save(array_merge([
			'type' => $this->fileType ?? '',
			'caption' => $this->fileName($file),
			'size' => $file->getSize(),
			'auth_type' => $this->auth->getCurrentAuthType(),
			'auth_id' => $this->auth->getCurrentAuthId(),
			'module_name' => $this->param('moduleName'),
			'controller_name' => $this->param('controllerName'),
			'action_name' => $this->param('actionName'),
			'source_id' => $this->param('source_id'),
		], $row));
		return (string)$model->getKey();
	}

	public function upload()
	{
		$this->view->disable();
		if (!$this->request->hasFiles()) {
			$this->errorJson(['code' => 10000, 'error' => '没有文件上传']);
			return;
		}
		$files = $this->request->getUploadedFiles();
		if ($this->maxFileCount > 0 && count($files) > $this->maxFileCount) {
			$this->errorJson(['code' => 10001, 'error' => '超出最大文件数量']);
			return;
		}
		$file = current($files);
		$result = $this->uploadFile($file);
		if ($result === null) {
			return;
		}
		$this->buildResult($file, $result[0], $result[1], $result[2]);
	}

	// 按 模块/年月 建目录并落盘，返回 [相对目录, 相对文件, 访问URL前缀]，失败返回 null
	protected function storeFile($file)
	{
		$ds = XQ_DS;
		$upload_path = call_user_func(['xqkeji\\App', 'getUploadPath']);
		$upload_path_name = call_user_func(['xqkeji\\App', 'getUploadPathName']);
		$upload_url = '/' . $upload_path_name . '/';
		if (!file_exists($upload_path)) {
			mkdir($upload_path, 0777);
		}
		$des_path = $this->getModuleName();
		if (!file_exists($upload_path . $des_path . $ds)) {
			mkdir($upload_path . $des_path . $ds, 0777);
		}
		$des_path = $des_path . $ds . date('Ym');
		if (!file_exists($upload_path . $des_path . $ds)) {
			mkdir($upload_path . $des_path . $ds, 0777);
		}
		$file_name = date('YmdHis') . '_' . uniqid();
		$dest_file = $des_path . $ds . $file_name . '.' . $file->getExtension();
		if (!$file->moveTo($upload_path . $dest_file)) {
			$this->errorJson(['code' => 10006, 'error' => '文件上传失败']);
			return null;
		}
		return [$des_path, $dest_file, $upload_url];
	}

	public function delete()
	{
		$this->view->disable();
		$www_path = call_user_func(['xqkeji\\App', 'getWwwPath']);
		$post = $this->request->GetPost();
		$key = htmlspecialchars((string) ($post['key'] ?? ''));
		$model = $this->model();
		
		$row = $model->find($key);
		if (empty($row)) {
			$this->returnJSON(['key' => '', 'error' => '查询不到文件']);
			return;
		}
		$url = $row->getAttr($this->fileUrlField);
		$filePath = $www_path . str_replace(['/', '\\'], XQ_DS, $url);
		if (is_file($filePath)) {
			$this->deleteRelated($row, $www_path, $filePath);
			unlink($filePath);
			$row->delete();// 文件已删除，同步删除留档记录
			$this->returnJSON(['key' => $key, 'message' => $this->deleteMessage]);
		} else {
			$this->returnJSON(['key' => $key, 'error' => '文件不存在']);
		}
	}

	// 按规格生成缩略图，返回缩略图的相对路径，失败返回 null
	protected function makeThumb(string $extension, string $destFile, array $thumbConfig)
	{
		$upload_path = call_user_func(['xqkeji\\App', 'getUploadPath']);
		$thumb_file = substr($destFile, 0, -strlen('.' . $extension)) . '_thumb.' . $extension;
		$image = new \xqkeji\image\adapter\Gd($upload_path . $destFile);
		// 扩展内部调用 imagedestroy()，PHP 8.5 起会报 Deprecated 并混进上传接口的 JSON 响应；该函数自 8.0 起本就无作用
		$reporting = error_reporting(E_ALL & ~E_DEPRECATED);
		try {
			$image->resize($thumbConfig['width'], $thumbConfig['height'], $thumbConfig['master']);
			$saved = $image->save($upload_path . $thumb_file);
		} finally {
			error_reporting($reporting);
		}
		return $saved ? $thumb_file : null;
	}

	// 删除主文件时同步删除缩略图，控制器无 thumb_url 字段时自动跳过
	protected function deleteRelated($row, string $www_path, string $filePath): void
	{
		$field = $this->thumbUrlField ?? '';
		if ($field == '') {
			return;
		}
		$thumb_url = $row->getAttr($field);
		if ($thumb_url != '') {
			$thumbPath = $www_path . str_replace(['/', '\\'], XQ_DS, $thumb_url);
			if (is_file($thumbPath)) {
				unlink($thumbPath);
			}
		}
	}
}
