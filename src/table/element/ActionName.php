<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class ActionName extends ListItem
{
    protected $name = 'action_name';
    protected $text = '来源动作';
    protected $attrs = [
        'style' => 'min-width:120px;',
    ];
}
