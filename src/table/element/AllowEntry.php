<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class AllowEntry extends ListItem
{
    protected $name = 'allow_entry';
    protected $text = 'IP地址或网段';
    protected $attrs = [
        'style' => 'min-width:200px;',
    ];
}
