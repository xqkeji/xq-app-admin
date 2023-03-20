<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="<?=xq_c('config','site_name')?>后台管理系统">
  <meta name="author" content="XqKeji">
  <title><?=xq_c('config','site_name')?>后台管理系统</title>
  <?=$this->getAssetsCss('admin-layout-css')?>
</head>
<body>
<!--页面顶部-->
<div class="container-fluid">
	<div id="xq-header" class="row no-gutters bg-success bg-gradient fixed-top align-items-center">
		<!--左边-->
		<div class="col-2 text-center">
			<a target="_blank" href="http://www.xqkeji.cn/" class="brand-link text-decoration-none" >
				<span class="border border-white rounded ml-4">新齐</span>
				<span class="brand-text font-weight-light xq-desc">通用后台管理系统</span>
			</a>
		</div>
		<!--右边-->
		<div class="col-10">
			<div class="row">
				<!--模块菜单导航-->
				<div class="col-10 p-0">
					<ul id="xq-top-nav" class="nav"  >  
						<?=\xqkeji\helper\Menu::getAdminTopMenu()?>
					</ul>
				</div>
				<!--用户操作菜单-->
				<div class="col-2 d-flex justify-content-end pe-3">
					<div id="xq-top-menu" class="btn-group">
						<div class="dropdown">
							<button class="btn dropdown-toggle" type="button" id="xqkeji-dropdowmenu" data-bs-toggle="dropdown" aria-expanded="false">
							<?php 
							$auth=$this->auth->getRealAuth('admin');
							echo trim($auth['username']);
							?> 
							</button>
							<ul class="dropdown-menu" aria-labelledby="xqkeji-dropdowmenu">
							  <li>
								  <a class="dropdown-item xq-logout" href="/admin/user/logout">退出登录</a>
							  </li>
							</ul>
						</div>
					</div>
				</div>
			</div>

		</div>
		<!--右边结束-->
	</div>
</div>
<!--管理页面内容-->
<div class="container-fluid">
    <div class="row no-gutters">
        <div class="col-2 p-0 bg-dark" id="xq-sidebar">
			<?=\xqkeji\helper\Menu::getAdminNavMenu()?>
        </div>
        <div class="col-10 p-0" id="xq-content">
            <!--管理页面Tab标签工具栏-->
            <div  class="row g-0">
                <div id="xq-tab-header" class="col-12 d-flex">
                    <!--Tab标签左移动按钮-->
                    <button id="xq-tab-left" >
                        <i class="bi bi-caret-left-square-fill"></i>
                    </button>
                    <!--Tab标签左移动按钮结束-->
                    <!--Tab标签栏-->
                    <nav id="xq-tab-nav" >
                      <ul id="xq-tab-nav-ul" class="nav nav-tabs nav-pills" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-content" type="button" role="tab" aria-controls="home-tab-content" aria-selected="true">
                            欢迎页
                            </a>
                        </li>
                      
                      </ul>
                    </nav>
                    <!--Tab标签栏结束-->
                    <!--Tab标签右移动按钮-->
                    <button id="xq-tab-right">
                    <i class="bi bi-caret-right-square-fill" style="margin-left: 3px;"></i>
                    </button>
                    <!--Tab标签右移动按钮结束-->
                    
                    <!--全屏按钮-->
                    <button id="xq-tab-fullscreen">
                    <i class="bi bi-arrows-fullscreen"></i>
                    </button>
                    <!--全屏按钮结束-->
                </div>
            </div>
            <!--管理页面Tab标签工具栏结束-->
            <!--Tab标签页面集合-->
            <div class="tab-content" id="xq-tab-content">
                <!--欢迎页面-->
                <div class="tab-pane active" id="home-tab-content" role="tabpanel" aria-labelledby="home-tab" >
                    <iframe src="/admin/admin/welcome" width="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" ></iframe>
                </div>
                <!--欢迎页面结束-->
            </div>
            <!--Tab标签页面集合结束-->


        </div>
    </div>

</div>
<div id="xq-tab-contentmenu">
  <div class="list-group">
    <a id="xq-tab-refresh" class="list-group-item">
      刷新页面
    </a>
    <a  id="xq-tab-close-all" class="list-group-item">
      全部关闭
    </a>
    <a id="xq-tab-close-other"  class="list-group-item">
      关闭其他
    </a>
  </div>
  
</div>
<!--管理页面内容结束-->
<!--页面底部-->
<footer id="xq-footer" class="row no-gutters fixed-bottom bg-light border">
	<div class="col-8 ps-4">
		<strong>Copyright &copy; 2021 &nbsp; &nbsp;<a href="https://www.xqkeji.cn/">XqAdmin</a>. &nbsp; &nbsp;</strong>
		All rights reserved.
	</div>
	
    <div class="col-4 text-end pe-4">
      <b>Version</b> 1.0
    </div>
</footer>

<?php
echo $this->getAssetsJs('admin-layout-js');
$this->outputAsset();
?>
</body>
</html>

