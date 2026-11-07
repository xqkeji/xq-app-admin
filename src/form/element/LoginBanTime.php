<?php
namespace xqkeji\app\admin\form\element;

use xqkeji\form\element\Number;

class LoginBanTime extends Number
{
    protected $name = 'login_ban_time';
    protected $text = '封禁时长(分钟)';
    protected $attrs = [
        'required' => 'true',
        'class' => 'form-control',
        'style' => 'width:120px;',
        'min' => '10',
    ];
    protected $filters = ['int'];
    protected $vt = ['$required','$min'=>['min'=>5,'mode'=>'number']];
    protected $defaultValue = 30;
    protected $template = '@row';
}
