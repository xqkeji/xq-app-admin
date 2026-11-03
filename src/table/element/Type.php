<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class Type extends ListItem
{
    protected $name = 'type';
    protected $text = '类型';
    protected $attrs = [
        'style' => 'min-width:80px;',
    ];
}
