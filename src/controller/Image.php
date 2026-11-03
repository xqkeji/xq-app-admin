<?php
/*
 * xqkeji.cn
 * @copyright 2021 新齐科技 (http://www.xqkeji.cn/)
 * @author 张文豪  <support@xqkeji.cn>
 */
namespace xqkeji\app\admin\controller;

use xqkeji\mvc\Controller;
use xqkeji\app\admin\traits\FileUpload;

class Image extends Controller
{
	use FileUpload;

	//缩略图规格配置，前端通过 ?thumb=键名 选择
	public $thumbConfig=[
		'list_thumb'=>['width'=>193,'height'=>null,'master'=>\xqkeji\image\Enum::WIDTH],
		'carousel_thumb'=>['width'=>450,'height'=>null,'master'=>\xqkeji\image\Enum::WIDTH],
		'ad_thumb'=>['width'=>null,'height'=>116,'master'=>\xqkeji\image\Enum::HEIGHT],
	];
	public $allowedFileExtensions=["jpg","jpeg","gif","png"];
	public $maxSize=1000;//以KB为单位
	public $maxWidth=0;//限制图片最大宽度
	public $maxHeight=0;//限制图片最大高度
	public $maxFileCount=1;//上传最多的文件数
	public $fileType='image';
	public $fileUrlField='image_url';
	public $thumbUrlField='thumb_url';
	public $modelTable='admin_fileinput';// 留档集合按「模块_控制器」命名，与 fileinput 列表同表
	public $deleteMessage='删除图片成功';

	// 落盘前校验图片宽高，并提前确认GD扩展可用
	protected function beforeSave($file)
	{
		if(!\xqkeji\image\adapter\Gd::check())
		{
			$this->errorJson(['code'=>10007,'error'=>'PHP扩展GD没有安装']);
			return null;
		}
		// 限制上传图片的宽或高 (注意：0 表示无限制)
		if($this->maxWidth > 0 || $this->maxHeight>0)
		{
			list ($w, $h) = @getimagesize($file->getTempName());
			if($this->maxWidth > 0 && $w > $this->maxWidth)
			{
				$this->errorJson(['code'=>10004,'error'=>'图片超出最大的宽度']);
				return null;
			}
			if($this->maxHeight > 0 && $h > $this->maxHeight)
			{
				$this->errorJson(['code'=>10005,'error'=>'图片超出最大的高度']);
				return null;
			}
		}
		return true;
	}

	protected function buildResult($file, $desPath, $destFile, $uploadUrl)
	{
		$thumbConfig=false;
		if(isset($_GET['thumb']))
		{
			$thumb=htmlspecialchars($_GET['thumb']);
			if(isset($this->thumbConfig[$thumb]))
			{
				$thumbConfig=$this->thumbConfig[$thumb];
			}
		}
		$image_url=$uploadUrl.str_replace('\\','/',$destFile);
		$thumb_url='';
		if($thumbConfig!==false)
		{
			$thumb_file=$this->makeThumb($file->getExtension(),$destFile,$thumbConfig);
			if($thumb_file===null)
			{
				$this->errorJson(['code'=>10008,'error'=>'生成缩略图失败']);
				return;
			}
			$thumb_url=$uploadUrl.str_replace('\\','/',$thumb_file);
		}
		$key=$this->saveRow($file,[
			'image_url'=>$image_url,
			'thumb_url'=>$thumb_url,
		]);
		$this->previewJson($file,$image_url,'image',$key,true);
	}
}
