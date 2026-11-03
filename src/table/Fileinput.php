<?php
namespace xqkeji\app\admin\table;

use xqkeji\form\Table;

class Fileinput extends Table
{
    // 集合名按「模块_控制器」约定；Image/Doc 上传控制器的 $modelTable 必须与本值一致
    protected $name = 'attach_fileinput';
    protected $foot = '~FootFileinput';

    // 表格元素列表
    protected $el = [
        '@Id',
        '~Caption',
        '~Type',
        '~Size',
        '~FileUrl',
        '~ModuleName',
        '~ControllerName',
        '~ActionName',
        '~AuthType',
        '@CreateTime',
        '@Delete',
    ];
}
