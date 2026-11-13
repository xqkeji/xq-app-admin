<?php
namespace xqkeji\app\admin\form\element;

use xqkeji\form\element\Number;

class LoginIpErrorCount extends Number
{
    protected $name = 'login_ip_error_count';
    protected $text = '同IP登录错误次数';
    protected $attrs = [
        'required' => 'true',
        'class' => 'form-control',
        'style' => 'width:120px;',
        'min' => '0',
    ];
    protected $filters = ['int'];
    protected $vt = ['$required','$min'=>['min'=>0,'mode'=>'number']];
    protected $defaultValue = 0;
    protected $template = '@row';
}
