<?php
namespace xqkeji\app\admin\form\element;
use xqkeji\form\element\Vary;
use xqkeji\App;
class Captcha extends Vary
{
	protected $name='captcha';
	protected function pick() : array
	{
		// captcha_type 对应 Config.php 里 $Radio 的 item 顺序：0=无验证码 1=图像 2=滑块 3=点击
		$type = (int) App::c("admin_config", "captcha_type", 1);

		return match ($type) {
			0 => [],
			2 => ['@SlideCaptcha', 'vt' => ['$required', '$SlideCaptcha']],
			3 => ['@ClickCaptcha', 'vt' => ['$required', '$ClickCaptcha']],
			default => ['@Captcha', 'vt' => ['$required', '$captcha']],
		};
	}
}
