<?php
namespace xqkeji\app\admin\form;

use xqkeji\form\Form;

class IpWhitelist extends Form
{
    protected $name = 'ip_whitelist';

    // 表单元素列表
    protected $el = [
        '@Name',
        '~AllowEntry',
        '@Status',
        '@SubmitReset',
    ];
}
