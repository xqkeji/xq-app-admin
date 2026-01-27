<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\ListFoot as BaseListFoot;
class ListFootLoger extends BaseListFoot
{
    protected $name = 'list_foot_loger';
    protected $el = [
        '@ListCheckAll',
        '~ListToolbarLoger'
    ];
      
}
