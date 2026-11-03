<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class ControllerName extends ListItem
{
    protected $name = 'controller_name';
    protected $text = '来源控制器';
    protected $attrs = [
        'style' => 'min-width:100px;',
    ];
}
