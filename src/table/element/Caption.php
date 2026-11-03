<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class Caption extends ListItem
{
    protected $name = 'caption';
    protected $text = '文件名';
    protected $attrs = [
        'style' => 'min-width:200px;',
    ];
}
