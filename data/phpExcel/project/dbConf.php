<?php

$phpExcel = [      //本地调试
  "host" => "127.0.0.1",
  "userName" => "root",
  "password" => "",
  "database" => "dataquery",
  "port" => "3306",
  "charset" => "utf8"
];

/*
$phpExcel = [   //远程服务器
  "host" => "127.0.0.1",
  "userName" => "dataquery",
  "password" => "apy-ad-2016-11",
  "database" => "dataquery",
  "port" => "33061",
  "charset" => "utf8"
];
*/
$pager = [    //分页
  'record_count' => 0,
  'page_size' => 30,
  'cur_page' => 1,
  'data' => null
];