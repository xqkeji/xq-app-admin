<?php
namespace xqkeji\app\admin\form\element;

use xqkeji\form\element\Number;

class LoginErrorCount extends Number
{
    protected $name = 'login_error_count';
    protected $text = '同IP同账号登录错误次数';
    protected $attrs = [
        'required' => 'true',
        'class' => 'form-control',
        'style' => 'width:120px;',
        'min' => '0',
    ];
    protected $filters = ['int'];
    protected $vt = ['$required','$min'=>['min'=>0,'mode'=>'number']];
    protected $defaultValue = 5;
    protected $template = '@row';
}
