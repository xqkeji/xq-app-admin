<?php
namespace xqkeji\app\admin\form\element;

use xqkeji\form\element\Text;

class AllowEntry extends Text
{
    protected $name = 'allow_entry';
    protected $text = 'IP地址';
    protected $attrs = [
        'required' => 'true',
        'class' => 'form-control',
    ];
    protected $filters = ['string'];
    protected $vt = ['$required','$ip'=>['allowReserved'=>true]];
    protected $template = '@row';
}
