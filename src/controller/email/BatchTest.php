<?php
namespace xqkeji\app\admin\controller\email;
use xqkeji\mvc\Action;
use xqkeji\mvc\Controller;
use xqkeji\App;
use xqkeji\Event;
use xqkeji\mvc\model\Config;
use xqkeji\mvc\builder\Model;
use xqkeji\app\admin\model\Mailer;
class BatchTest extends Action
{
	protected $requestErrorMessage;
	protected $noDataMessage;
	public function __construct(Controller $controller,array $propertys=[])
    {
		$this->requestErrorMessage=App::t("request method error");
		$this->noDataMessage=App::t("no request data");
		parent::__construct($controller,$propertys);
	}
	public function run()
	{
        $view=$this->view;
		$request=$this->request;
		$modelName = $this->modelName;
		$view->disable();
		$controller=$this->getController();
		$result=[];
		if($request->isPost())
        {
			if(false === Event::trigger($this,"beforePost") )
			{
				throw new \Exception(App::t("deny post"),500);
			}
			$model=Model::getModel($modelName);
			$data=$request->getPut();
			$config=(array)Config::get('config');
			$message='';
			$mailer=[];
			if(!empty($data))
			{
                foreach($data as $row)
                {
					if(isset($row["id"]))
					{
						$record = call_user_func_array([$model, "find"], [$row["id"]]);
						
						if(empty($record))
						{
							continue;
						}
						$mail=$record->toArray();
						$sendResult=Mailer::send($mail['host'],$mail['port'],$mail['nickname'],$mail['username'],$mail['password'],$config['site_email'],'测试邮件','测试配置的邮箱能否正常发送邮件');
						$mailer[$mail['username']]=$sendResult;
					}
					
				}
				$message='';
				if(!empty($mailer))
				{
					foreach($mailer as $key=>$val)
					{
						$message.=$key.'('.($val?'成功':'失败').')<br/>';
					}
					$result["message"]='发送的邮件列表状态：<br/>'.$message;
					$result["code"]=100;
				}
				else
				{
					$result["message"]='未发送任何邮件';
					$result["code"]=404;
				}
			}
			else
			{
				$result["message"]=$this->noDataMessage;
				$result["code"]=204;
			}
			$controller->returnJSON($result);
		}
		else
		{
			$result["message"]=$this->requestErrorMessage;
			$result["code"]=203;
			$controller->returnJSON($result);
		}
	}
	
}