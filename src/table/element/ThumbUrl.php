<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;

class ThumbUrl extends ListItem
{
    protected $name = 'thumb_url';
    protected $text = '预览图';
    protected $attrs = [
        'style' => 'min-width:120px;',
    ];
}
