<?php
namespace xqkeji\app\admin\table\element;

use xqkeji\form\element\ListFoot as BaseListFoot;

class FootHugerte extends BaseListFoot
{
    protected $name = 'list_foot';
    protected $buttons = [
        '@BDeleteButton',
    ];
}
