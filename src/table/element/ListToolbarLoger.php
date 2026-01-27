<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\Td;
class ListToolbarLoger extends Td
{
    protected $name = "list-toolbar-loger";
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
                [
                    '$TableDiv',
                    'name' => 'list-toolbar-div',
                    'attrs' => [
                        'class'=>'me-auto',
                    ],
                ],
                '@ListPager',
                '@listPageSize'
            ],
        ]
    ];
}
