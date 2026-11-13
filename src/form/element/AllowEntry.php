<?php
namespace xqkeji\app\admin\form\element;

use xqkeji\form\element\Text;

class AllowEntry extends Text
{
    protected $name = 'allow_entry';
    protected $text = 'IP地址或网段';
    protected $attrs = [
        'required' => 'true',
        'class' => 'form-control',
        'placeholder' => '如 192.168.1.1 或 192.168.1.0/24',
    ];
    protected $filters = ['string'];
    // $ip 校验器走 filter_var，带掩码的网段会被判非法，故改用正则：IPv4 四段各 0-255 + 可选前缀 0-32
    protected $vt = [
        '$required',
        '$regex' => [
            'pattern' => '/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}(\/(3[0-2]|[12]\d|\d))?$/',
            'message' => '请填写正确的 IP 地址或网段，如 192.168.1.1 或 192.168.1.0/24',
        ],
    ];
    protected $template = '@row';
}
