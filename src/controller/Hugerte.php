<?php
/*
 * xqkeji.cn
 * @copyright 2021 新齐科技 (http://www.xqkeji.cn/)
 * @author 张文豪  <support@xqkeji.cn>
 */
namespace xqkeji\app\admin\controller;

use xqkeji\mvc\Controller;
use xqkeji\app\admin\traits\FileUpload;

/**
 * hugerte(tinymce) 富文本编辑器的文件上传控制器
 * 接口约定：上传成功的响应为 {"location":"文件URL"}，失败为 {"location":"0","error":"..."}
 * 上传的文件写入 admin_hugerte 留档表（module_name 取前端 moduleName，未传时为 editor），便于统一统计/清理
 */
class Hugerte extends Controller
{
	use FileUpload;

	public $imageExtensions=["jpg","jpeg","gif","png"];
	public $docExtensions=["doc","docx","pdf","wps","txt","zip","rar","tar","gz"];
	public $allowedFileExtensions=[];//upload() 中按图片+文档合并
	public $maxSize=0;//upload() 中按文件类型取对应限制
	public $maxFileCount=1;
	public $imageMaxSize=1000;//图片大小限制，以KB为单位
	public $docMaxSize=2000;//文档大小限制，以KB为单位
	public $maxWidth=0;//限制图片最大宽度
	public $maxHeight=0;//限制图片最大高度
	public $browseThumb=['width'=>200,'height'=>null,'master'=>\xqkeji\image\Enum::WIDTH];//浏览列表预览图规格
	public $browsePageSize=20;//浏览列表每页条数
	public $browseSortField='_id';//Mongo 主键随时间递增，倒序即最新在前；框架若映射为 id 则改此处
	public $moduleName='editor';//前端未传 moduleName 时的默认模块名
	public $fileUrlField='file_url';
	public $thumbUrlField='thumb_url';
	public $modelTable='admin_hugerte';// 编辑器上传单独成表，须与 table/Hugerte.php 的 $name 一致
	public $deleteMessage='删除文件成功';

	// 编辑器上传单个文件，通过扩展名区分图片/文档并应用各自的大小限制
	public function upload()
	{
		if (!$this->request->hasFiles()) {
			$this->errorJson(['code' => 10000, 'error' => '没有文件上传']);
			return;
		}
		$this->allowedFileExtensions=array_merge($this->imageExtensions,$this->docExtensions);
		$file=current($this->request->getUploadedFiles());
		$isImage=in_array(strtolower($file->getExtension()),$this->imageExtensions,true);
		$this->maxSize=$isImage?$this->imageMaxSize:$this->docMaxSize;
		$result=$this->uploadFile($file);
		if($result===null)
		{
			return;
		}
		$this->buildResult($file,$result[0],$result[1],$result[2]);
	}

	// 编辑器接口约定：失败的响应同样带 location='0'
	protected function errorJson(array $error)
	{
		$this->returnJSON(['location'=>'0','error'=>$error['error']]);
	}

	protected function beforeSave($file)
	{
		if(in_array(strtolower($file->getExtension()),$this->imageExtensions,true))
		{
			if(!\xqkeji\image\adapter\Gd::check())
			{
				$this->errorJson(['code'=>10007,'error'=>'PHP扩展GD没有安装']);
				return null;
			}
			// 限制上传图片的宽或高 (注意：0 表示无限制)
			if($this->maxWidth>0 || $this->maxHeight>0)
			{
				list ($w,$h)=@getimagesize($file->getTempName());
				if($this->maxWidth>0 && $w>$this->maxWidth)
				{
					$this->errorJson(['code'=>10004,'error'=>'图片超出最大的宽度']);
					return null;
				}
				if($this->maxHeight>0 && $h>$this->maxHeight)
				{
					$this->errorJson(['code'=>10005,'error'=>'图片超出最大的高度']);
					return null;
				}
			}
		}
		return true;
	}

	protected function buildResult($file, $desPath, $destFile, $uploadUrl)
	{
		$extension=strtolower($file->getExtension());
		$file_url=$uploadUrl.str_replace('\\','/',$destFile);
		$thumb_url='';
		// 图片生成预览缩略图，供 browse 的图库使用
		if(in_array($extension,$this->imageExtensions,true))
		{
			$thumb_file=$this->makeThumb($extension,$destFile,$this->browseThumb);
			if($thumb_file===null)
			{
				$this->errorJson(['code'=>10008,'error'=>'生成缩略图失败']);
				return;
			}
			$thumb_url=$uploadUrl.str_replace('\\','/',$thumb_file);
		}
		// 编辑器页面一般不传 moduleName，留痕时归入 editor，便于按来源统计/清理
		$moduleName=$this->post('moduleName');
		$this->saveRow($file,[
			'file_url'=>$file_url,
			'thumb_url'=>$thumb_url,
			'type'=>$extension,
			'module_name'=>$moduleName!==''?$moduleName:$this->moduleName,
		]);
		$this->returnJSON(['location'=>$file_url]);
	}

	// 供 file_picker_callback 的浏览弹窗取数据：?types=jpg,png&page=1&page_size=20
	// types 为扩展名列表（逗号分隔），不传则返回全部；只查本表（admin_hugerte），不限上传人
	public function browse()
	{
		$this->view->disable();
		$allowed=array_merge($this->imageExtensions,$this->docExtensions);
		$types=[];
		if(isset($_GET['types']) && $_GET['types']!='')
		{
			foreach(explode(',',htmlspecialchars($_GET['types'])) as $type)
			{
				$type=trim($type);
				if(in_array($type,$allowed,true))
				{
					$types[]=$type;
				}
			}
			if(empty($types))
			{
				$this->returnJSON(['error'=>'非法文件类型']);
				return;
			}
		}
		$page=max((int)($_GET['page'] ?? 1),1);
		$pageSize=(int)($_GET['page_size'] ?? 0)>0?(int)$_GET['page_size']:$this->browsePageSize;

		$rows=$this->filterTypes($this->model(),$types)->order([$this->browseSortField=>'desc'])->limit(($page-1)*$pageSize,$pageSize)->findAll();
		$rows=is_array($rows)?$rows:[];
		$list=[];
		foreach($rows as $row)
		{
			$url=$this->value($row,'file_url');
			if($url==='')
			{
				continue;
			}
			// Mongo 文档主键为 _id，兼容框架映射出的 id
			$key=$this->value($row,'_id');
			if($key==='')
			{
				$key=$this->value($row,'id');
			}
			$list[]=[
				'key'=>$key,
				'url'=>$url,
				'thumb'=>$this->value($row,'thumb_url')!==''?$this->value($row,'thumb_url'):$url,
				'name'=>$this->value($row,'caption')!==''?$this->value($row,'caption'):basename(str_replace('\\','/',$url)),
				'size'=>(int)$this->value($row,'size'),
				'type'=>$this->value($row,'type'),
			];
		}
		$this->returnJSON([
			'list'=>$list,
			'page'=>$page,
			'page_size'=>$pageSize,
			'more'=>count($rows)>=$pageSize,//无计数接口，用满页推断是否还有下一页
		]);
	}

	// 按类型过滤（框架 where 的多值签名如与此处不同，只需改这一个方法）
	protected function filterTypes($model, array $types)
	{
		return empty($types) ? $model : $model->where('type', $types);
	}

	// 兼容关联数组与行对象两种取值形态
	protected function value($row,string $field): string
	{
		if(is_array($row))
		{
			return (string)($row[$field] ?? '');
		}
		return (string)$row->getAttr($field);
	}
}
