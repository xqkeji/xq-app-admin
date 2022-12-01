<?php
return [
    //类名称，模块内部分自动填写完成
	'form\User'=>[
		/**
		 * User默认方法为：（1）事件名称方法beforeAdd（2）类名称加事件名称userBeforeAdd
		 * User::beforeAdd直接指定方法
		 */
		'before_add'=>'User',//处理类名，模块内部自动填写完成，不用全名
	],

];