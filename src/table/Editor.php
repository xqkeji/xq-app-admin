<?php
namespace xqkeji\app\admin\table;

use xqkeji\form\Table;

class Editor extends Table
{
    // 集合名按「模块_控制器」约定；Hugerte 上传控制器的 $modelTable 必须与本值一致
    protected $name = 'editor';
    protected $foot = '~FootEditor';

    // 表格元素列表
    protected $el = [
        '@Id',
        '~Caption',
        '~Type',
        '~Size',
        '~FileUrl',
        '~ThumbUrl',
        '~ModuleName',
        '@CreateTime',
        '@Delete',
    ];
}
