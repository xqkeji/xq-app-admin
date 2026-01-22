<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\ListItem;
class ListToolbar extends ListItem
{
    protected $name = "list-toolbar";
    protected $attrs = [
        'colspan' => 99,
        'style' => 'text-align:left;',
    ];
    protected $el = [
        [
            '$Div',
            'name' => 'list-toolbar-content',
            'attrs' => [
                'class' => 'd-flex',
            ],
            'el' => [
                '~ListAddDelete',
                '@ListPager',
                '@listPageSize'
            ],
        ]
    ];
}
