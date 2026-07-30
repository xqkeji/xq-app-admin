<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\Td;
class Toolbar extends Td
{
    protected $name = "list-toolbar";
    protected $attrs = [
        'colspan' => 99,
        'style' => 'text-align:left;',
    ];
    protected $el = [
        [
            '$TableDiv',
            'name' => 'list-toolbar-content',
            'attrs' => [
                'class' => 'd-flex',
            ],
            'el' => [
                '~AddDelete',
                '@Pager',
                '@PageSize'
            ],
        ]
    ];
}
