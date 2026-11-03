<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class FileUrl extends ListItem
{
    protected $name = 'file_url|image_url';
    protected $text = '文档地址或图片地址';
    protected $attrs = [
        'style' => 'min-width:200px;',
    ];
}
