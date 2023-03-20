<?php
$this->setMainView("admin");
?>
<div id="xqkeji-page-body" class="card">
  <div class="card-header bg-success align-items-center">
      <div class="row">
          <div class="col-4">
              <h5 class="align-items-center">
              <?=$pageTitle?>
              </h5>
          </div>
      </div>
  </div>
  <div class="card-body">
    <?php
	  $this->outputFlash();
	  echo $form;
	?>
  </div>
</div>




