<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class AuthType extends ListItem
{
    protected $name = 'auth_type';
    protected $text = '上传者类型';
    protected $attrs = [
        'style' => 'min-width:120px;',
    ];
}
