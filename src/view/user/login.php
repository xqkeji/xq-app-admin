<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>新齐通用后台管理系统-登录</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="新齐通用后台管理系统-登录">
  <meta name="author" content="xqkeji.cn">
  <?=$this->getAssetsCss('admin_page_css')?>
</head>
<body class="bg-dark">
<div class="container-fluid">
	<div class="row justify-content-center align-items-center" style="height:100vh;">
        <div class="col-4" style="margin-top:-5rem;">
          <h2 class="text-center"><b>新齐通用后台管理系统</b></h2>
          <div class="card">
            <div class="card-body">
              <p class="text-dark text-center" style="font-size:18px;">
              后台登录
              </p>
              <?php
				 $this->outputFlash();
				 echo $form;
			  ?>			
            </div>
          </div>
        </div>
    </div>
</div>
<?=$this->getAssetsJs('admin_page_js')?>
</body>
</html>



