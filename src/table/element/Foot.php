<?php
namespace xqkeji\app\admin\table\element;
use xqkeji\form\element\ListFoot as BaseListFoot;
class Foot extends BaseListFoot
{
    protected $name = 'list_foot';
    protected $el = [
        '@CheckAll',
        '~Toolbar'
    ];
      
}
