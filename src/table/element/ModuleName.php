<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class ModuleName extends ListItem
{
    protected $name = 'module_name';
    protected $text = '来源模块';
    protected $attrs = [
        'style' => 'min-width:90px;',
    ];
}
