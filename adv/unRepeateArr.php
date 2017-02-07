<?php
/*
header("content-type:application/json;charset=utf-8");

$cdate = "2016-12-28%";

$conn = mysqli_connect("45.32.253.162", "adholly", "web.ad.holly", "adv", 3306);

$select = "SELECT did, cdate, ctime, appid, retailid FROM callbacklog where cdate like '$cdate'";
*/
header("content-type:application/json;charset=utf-8");

@$partner = $_REQUEST["partner"];    //合作方：是有乐通，snt, ymb

$callbacklogList = "callbacklog";   //默认为从有乐通的表中读取数据

$appList = "applist";               //默认为从有乐通的applist表中读取appid 与 产品对应的数据

switch($partner){
  case "有乐通": break;
  case "snt": $callbacklogList = "snt_callbacklog"; $appList = "snt_applist"; break;
  case "ymb": $callbacklogList = "y_callbacklog"; $appList = "y_applist"; break; 
}

@$conn = mysqli_connect("45.32.253.162", "adholly", "web.ad.holly", "adv", 3306);

mysqli_query($conn, "SET NAMES UTF8");

$endDID = getEndDID($partner);      //获取上一次最后一条记录的DID

$now = date("h:i:s");               //获取当前的时分秒
//$currentDate = date("Y-m-d");       //获取当前日期
$currentDate = "2016-12-28";       //获取当前日期
$currentDateStr = $currentDate."%";

@$select = !$endDID? "SELECT did, cdate, ctime, appid, retailid FROM $callbacklogList where cdate like '$currentDateStr'" :
"SELECT did,cdate, ctime, appid, retailid FROM $callbacklogList where did > $endDID";

$result = mysqli_query($conn, $select);

$output = [];

if($result){
while($row = mysqli_fetch_assoc($result)){
	$output[] = $row;
}
}
else{
	echo "select 语句错误:".$select;
}

echo json_encode($output);
echo '\n';

$newArr = unRepeateArr_V2($output);

$output = null;

echo json_encode($newArr);


//去重
function unRepeateArr($arr){
  if(empty($arr)){ return;}
  $count = 1;
  $newArr[0] = $arr[0];  //用于保存去重后的数组
  $newArr[0]["installCount"] = 1;
  for($i = 0; $i < count($arr); $i++){
    for($r = 0; $r < count($newArr); $r++){
      //如果appid相同并且retailid相同
      if($arr[$i]["appid"] == $newArr[$r]["appid"] && $arr[$i]["retailid"] == $newArr[$r]["retailid"]){$newArr[$r]["installCount"] += 1; break;}
    }
    if($r == count($newArr)){
      $newArr[$count] = $arr[$i];
      $newArr[$count]['installCount'] = 1;
      $count ++;
    }
  }

  return $newArr;
}


//去重
function unRepeateArr_V2($arr){
  if(empty($arr)){ return;}
  $count = 1;
  $newArr[0] = $arr[0];  //用于保存去重后的数组
  $newArr[0]["installCount"] = 1;
  for($i = 1; $i < count($arr); $i++){
    for($r = 0; $r < count($newArr); $r++){
      //如果appid相同并且retailid相同
      if($arr[$i]["appid"] == $newArr[$r]["appid"] && $arr[$i]["retailid"] == $newArr[$r]["retailid"]){$newArr[$r]["installCount"] += 1; break;}
    }
    if($r == count($newArr)){
      $newArr[$count] = $arr[$i];
      $newArr[$count]['installCount'] = 1;
      $count ++;
    }
  }

  return $newArr;
}

//从readRecond表中获取从上一次最后一条did
function getEndDID($adPlatform){
  @$conn = mysqli_connect("127.0.0.1", "root", "", "dataquery", 3306);          //用测试用
  //@$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  $select = "SELECT endDID FROM readRecond WHERE adPlatform = '$adPlatform'";

  mysqli_query($conn, "SET NAMES UTF8");

  $result = mysqli_query($conn, $select);

  if($result){
    while($row = mysqli_fetch_assoc($result)) return $row['endDID'];
  }
  else{
    echo "查询readRecond表的sql语句错误".$select;
  }

}

