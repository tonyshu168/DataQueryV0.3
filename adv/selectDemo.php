<?php
header("content-type:application/json;charset=utf-8");

//channelNumEqualFromProducts(1481904000000, 'hnxy66675');

//查看products表中有没有当前日期,channelNum相同的数据
function channelNumEqualFromProducts($date, $channelNum){
  @$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
  //@$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  mysqli_query($conn, "set names utf8");

  $select = "SELECT did FROM products WHERE effectiveDate >= $date AND effectiveDate < ($date + 24*3600*1000) AND channelNum = '$channelNum'";

  $result = mysqli_query($conn, $select);

  if($result){
  	while($row = mysqli_fetch_assoc($result)){echo $row['did'];}
  }
  else{echo  0;}
}

echo dateChangeSecond("2016-12-16", "19:14:34");


function dateChangeSecond($date, $time){
  $hour = ((int)substr($time,0,2));
  $minute = ((int)substr($time,3,2));
  $second = ((int)substr($time,6,2));
  $year = ((int)substr($date,0,4));
  $month = ((int)substr($date,5,2));
  $day = ((int)substr($date,8,2));
  //从日期到时间戳需减7小时,再x1000转换为javascript的时间戳
  //return (mktime($hour, $minute, $second, $month, $day, $year) - 3600*7)*1000;   //时区为德国时区
  return (mktime($hour, $minute, $second, $month, $day, $year))*1000;   //上海时区
}


