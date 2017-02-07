<?php
header("content-type:application/json;charset=utf-8");

set_time_limit(0);

sleep(5);

@$conn = mysqli_connect("45.32.253.162", "adholly", "web.ad.holly", "adv", "3306");

mysqli_query($conn, "set names utf8");

@$selectApplist = "SELECT id, title FROM applist";

$result = mysqli_query($conn, $selectApplist);

$output = [];

if($result){
    while($row = mysqli_fetch_assoc($result)){$output[] = $row;}

    $output = unRepeateArr($output);

    echo json_encode($output);
}
else{
    echo "SQL语句错误:".$selectApplist;
}

//去重
function unRepeateArr($arr){
  if(empty($arr)){ return;}
  $count = 1;
  $newArr[0] = $arr[0];  //用于保存去重后的数组
  $newArr[0]["installCount"] = 1;
  for($i = 1; $i < count($arr); $i++){
    for($r = 0; $r < count($newArr); $r++){
      if($arr[$i]["id"] == $newArr[$r]["id"]){$newArr[$r]["installCount"] += 1; break;}
    }
    if($r == count($newArr)){
      $newArr[$count] = $arr[$i];
      $newArr[$count]['installCount'] = 1;
      $count ++;
    }
  }

  return $newArr;
}