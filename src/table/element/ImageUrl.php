<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class ImageUrl extends ListItem
{
    protected $name = 'image_url';
    protected $text = '图片地址';
    protected $attrs = [
        'style' => 'min-width:200px;',
    ];
}
