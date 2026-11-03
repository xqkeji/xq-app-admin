<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListItem;
use xqkeji\mvc\builder\Model;

class Size extends ListItem
{
    protected $name = 'size';
    protected $text = '大小';
    protected $attrs = [
        'style' => 'min-width:90px;width:90px;',
    ];

    public function format($value)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($value >= 1024 && $i < 3) {
            $value = $value / 1024;
            $i++;
        }
        return round($value, $i ? 1 : 0) . ' ' . $units[$i];
    }
}
