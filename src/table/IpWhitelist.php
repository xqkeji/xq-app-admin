<?php
namespace xqkeji\app\admin\table;

use xqkeji\form\Table;

class IpWhitelist extends Table
{
    protected $name = 'admin_ip_whitelist';
    protected $foot = '@Foot';

    // 表格元素列表
    protected $el = [
        '@Id',
        '@Name',
        '~AllowEntry',
        '@Status',
        '@EditDelete',
    ];
}
