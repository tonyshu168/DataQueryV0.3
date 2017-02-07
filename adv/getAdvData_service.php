<?php
header("content-type:application/json");

@$partner = $_REQUEST["partner"];    //合作方：是有乐通，snt, ymb

$callbacklogList = "callbacklog";   //默认为从有乐通的表中读取数据

$appList = "applist";               //默认为从有乐通的applist表中读取appid 与 产品对应的数据

switch($partner){
  case "有乐通": break;
  case "snt": $callbacklogList = "snt_callbacklog"; $appList = "snt_applist"; break;
  case "ymb": $callbacklogList = "y_callbacklog"; $appList = "y_applist"; break; 
}

@$conn = mysqli_connect("45.32.253.162", "adholly", "web.ad.holly", "adv", 3306);

mysqli_query($conn, "set names utf8");

$endDID = getEndDID($partner);      //获取上一次最后一条记录的DID

$now = date("h:i:s");               //获取当前的时分秒
//$currentDate = date("Y-m-d");       //获取当前日期
$currentDate = "2016-12-16";       //获取当前日期
$currentDateStr = $currentDate."%";

@$select = !$endDID? "SELECT did, cdate, ctime, appid, retailid FROM $callbacklogList where cdate like '$currentDateStr'" :
  "SELECT did,cdate, ctime, appid, retailid FROM $callbacklogList where did > $endDID";

@$selectApplist = "SELECT id, title FROM $appList";

$result = mysqli_query($conn, $select);

$autoSaveDataRecode = [   //保存存储到本地数据库时的相关信息
  'recodeCounter' => 0,   //存储多少条记录
  'saveDate' => "$currentDate",     //什么日期存储的
  'costTime' => 0,              //从adv表中读取数据，再保存到products中，总共所花费的时间
  'adPlatform' => "有乐通",    //来自那个表，是 "有永通" 还是 "smt"
  'insertStartRowNum' => 0,    //从表里多行开始插入记录
  'insertStartDid' => 0,       //从那里开时插入记录
  'insertEndDid' =>0,          //插入记录在那结束
  'endDID' => 0                //从张工那最后一条记录的did
];

switch($partner){   //根据合作方，保存相应的广告平台
  case "有乐通": break;
  case "snt": $autoSaveDataRecode['adPlatform'] = "snt"; break;
  case "ymb": $autoSaveDataRecode['adPlatform'] = "ymb"; break; 
}


if(mysqli_fetch_assoc($result) != null){   //$callbacklogList表有数据时

  $applistResult = mysqli_query($conn, $selectApplist);

  $appidLibrary = [];   //保存所有appid 与 对应的 产品名称

  if($applistResult){
    while($row = mysqli_fetch_assoc($applistResult)){
      $appidLibrary[] = $row;
    }
  }
  else{
    echo "selectApplist语句错误:".$selectApplist;
  }

  $output = [];

  $data = [
    'adPlatform' => "有乐通",
    'adID' => 0,
    'productName' => null,
    'channelNum' => null,
    'company' => null,
    'compAbbreviation' => null,
    'cooperateType' => 'CPA',
    'price' => null,
    'installCount' => 0,
    'effectiveDate' => 0,
    'endDate' => 0
  ];

  switch($partner){   //根据合作方，保存相应的广告平台
    case "有乐通": break;
    case "snt": $data['adPlatform'] = "snt"; break;
    case "ymb": $data['adPlatform'] = "ymb"; break; 
  }

  while($row = mysqli_fetch_assoc($result)){
    $output[] = $row;
  }

  $autoSaveDataRecode['endDID'] = $output[count($output)-1]["did"];         //获取当前最后一条记录的did

  $output = unRepeateArr($output);

  $companyAndPriceArr = getChannelNumList();     //从本地dataQuery库channelNumMapCompany表中读取所有公司<=>价格

  $newArr = [];         //保存整理后的数据
  for($i = 0; $i < count($output); $i++){
    $row = channelNumMapCompanyAndPrice($output[$i]["retailid"], $companyAndPriceArr);

    $data["adID"] = $output[$i]["appid"];
    $data["productName"] = getProductName($output[$i]["appid"], $appidLibrary);
    $data["channelNum"] = $output[$i]["retailid"];
    $data["company"] = $row["company"];
    $data["installCount"] = $output[$i]["installCount"];
    $data["effectiveDate"] = dateChangeSecond($output[$i]["cdate"], $output[$i]["ctime"]);
    $data["endDate"] = $data["effectiveDate"] + 1000*3600*24*365;
    $data['price'] = $row["price"];
    $newArr[$i] = $data;
  }

  $row = null;

  $output = null;   //清$output

  $autoSaveDataRecode['recodeCounter'] = count($newArr);


  //保存到dataquery中products表中
  //@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  mysqli_query($conn, "set names utf8");

  @$getRowCounter = "SELECT count(*) FROM products";     //获取dataquery库中的products表的总行数

  $result = mysqli_query($conn, $getRowCounter);

  if($result){
    while($row = mysqli_fetch_assoc($result)) {$autoSaveDataRecode['insertStartRowNum'] = (int)$row['count(*)'];}
  }
  else{echo "getRowCounter语句错误".$getRowCounter;}

  $second = dateChangeSecond("$currentDate","");      //当前日期

  $endSecond = $second + 1000*3600*24;                //当前日期 + 1天

  /*
  @$select = "SELECT did FROM products WHERE effectiveDate >= '$second' AND effectiveDate < $endSecond AND adPlatform = '$partner'";  //查看表中是否 从对应的库中已插入当前日期的数据

  $result = mysqli_query($conn, $select);
  */

  $insertFail = [];   //用于保存插入失败的语句;

  $isAllInsertSuccess = 0;    //判断所有数据是否插入成功

  //if(mysqli_fetch_assoc($result) == null){

    $i = 0;   //记录首条插入

    foreach($newArr as $value){

      $insertSQL = "INSERT INTO products(did, adPlatform, productName, channelNum, company, compAbbreviation, cooperateType,
        price, installCount, effectiveDate, endDate,adID) value(null,'$value[adPlatform]', '$value[productName]', 
        '$value[channelNum]', '$value[company]', '$value[compAbbreviation]', '$value[cooperateType]', '$value[price]',
        '$value[installCount]', '$value[effectiveDate]', '$value[endDate]', '$value[adID]')";

      $insertResult = mysqli_query($conn, $insertSQL);

      if($insertResult){
        if($i == 0){$autoSaveDataRecode['insertStartDid'] = mysqli_insert_id($conn);}  //保存首条记录的did
      }
      else{ $insertFail[] = $insertFail; echo "insertSQL语句错误".$insertSQL;}
    
      $i++;
    }

    if(count($insertFail) > 0){
      foreach($insertFail as $value){
        $insertResult = mysqli_query($conn, $value);
      }

      $isAllInsertSuccess = 1;         //所有数据保存在produts中成功

      $autoSaveDataRecode['insertEndDid'] = mysqli_insert_id($conn);  //保存插入最后一条记录的did

      $autoSaveDataRecode['costTime'] = date("h:m:s") - $now;         //总共所花费的时间


      //保存本次记录的相关信息
      $insertSQL = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum,
      insertStartDid, insertEndDid) value(null, '$autoSaveDataRecode[recodeCounter]', '$autoSaveDataRecode[saveDate]',
      '$autoSaveDataRecode[costTime]','$autoSaveDataRecode[adPlatform]','$autoSaveDataRecode[insertStartRowNum]', 
      '$autoSaveDataRecode[insertStartDid]','$autoSaveDataRecode[insertEndDid]')";

      //保存最后一条的did
      $updataToReadReconde = $endDID ? "UPDATE readRecond SET endDID = $autoSaveDataRecode[endDID] WHERE adPlatform = '$partner'" : 
        "INSERT INTO readRecond(did, adPlatform, endDID) VALUE(NULL, '$partner', $autoSaveDataRecode[endDID])"; 

      $result = mysqli_query($conn, $insertSQL);

      $updataResult = mysqli_query($conn, $updataToReadReconde);
    
      if($result){ echo "存储数据到autoSaveDataRecodeForm表中success";}
      else{echo "存储数据到autoSaveDataRecodeForm表中fail".$insertSQL;}

      if($updataResult){echo "存储最后一条的记录保存success!!!";}
      else{echo "存储到readRecond fail!!!".$updataResult;} 

      $newArr = null;
      $insertFail = null; 

      echo json_encode($isAllInsertSuccess);

    }
    else{
      $isAllInsertSuccess = 1;         //所有数据保存在produts中成功

      $autoSaveDataRecode['insertEndDid'] = mysqli_insert_id($conn);  //保存插入最后一条记录的did

      $autoSaveDataRecode['costTime'] = date("h:m:s") - $now;         //总共所花费的时间

      //echo json_encode($autoSaveDataRecode);

      //保存本次记录的相关信息
      $insertSQL = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum,
      insertStartDid, insertEndDid) value(null, '$autoSaveDataRecode[recodeCounter]', '$autoSaveDataRecode[saveDate]',
      '$autoSaveDataRecode[costTime]','$autoSaveDataRecode[adPlatform]','$autoSaveDataRecode[insertStartRowNum]', 
      '$autoSaveDataRecode[insertStartDid]','$autoSaveDataRecode[insertEndDid]')";

      //保存最后一条的did
      $updataToReadReconde = $endDID ? "UPDATE readRecond SET endDID = $autoSaveDataRecode[endDID] WHERE adPlatform = '$partner'" : 
        "INSERT INTO readRecond(did, adPlatform, endDID) VALUE(NULL, '$partner', $autoSaveDataRecode[endDID])";

      $result = mysqli_query($conn, $insertSQL);

      $updataResult = mysqli_query($conn, $updataToReadReconde);
    
      if($result){ echo "存储数据到autoSaveDataRecodeForm表中success";}
      else{echo "存储数据到autoSaveDataRecodeForm表中fail".$insertSQL;}

      if($updataResult){echo "存储最后一条的记录保存success!!!";}
      else{echo "存储到readRecond fail!!!".$updataResult;} 

      $newArr = null;
      $insertFail = null; 

      echo json_encode($isAllInsertSuccess);
    }

  //}
  //else{echo "'$partner':'$currentDate'的数据已存储到products中";}

}
else{
  $insertSQL = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum,
    insertStartDid, insertEndDid) value(null, '$autoSaveDataRecode[recodeCounter]', '$autoSaveDataRecode[saveDate]',
    '$autoSaveDataRecode[costTime]','$autoSaveDataRecode[adPlatform]','$autoSaveDataRecode[insertStartRowNum]', 
    '$autoSaveDataRecode[insertStartDid]','$autoSaveDataRecode[insertEndDid]')";

  //@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  $result = mysqli_query($conn, $insertSQL);

  if($result){
    echo "insert autoSaveDataRecodeform success!";
  }
  else{
    echo "insert autoSaveDataRecodeform fail!".$insertSQL;
  }

  echo "'$partner'：'$currentDate'无数据";

}


//从readRecond表中获取从上一次最后一条did
function getEndDID($adPlatform){
  //$conn = mysqli_connect("127.0.0.1", "root", "", "dataquery", 3306);          //用测试用
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

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



//根据 "channelNum" 查找对应的 "company" 与 "price"
function channelNumMapCompanyAndPrice($channelNum, $channelList){
  $arr = [
    'company' => null,
    'price' => 0
  ];

  foreach($channelList as $value){
    if($value['channelNum'] == $channelNum){
      $arr['company'] = $value['company'];
      $arr['price'] = $value['price'];
      return $arr;
    }
  }
}

//从channelNumMapCompany表中获取所有的"company" ,"channelNum", "price"
function getChannelNumList(){
  //$conn = mysqli_connect("127.0.0.1", "root", "", "dataquery", 3306);
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  $select = "SELECT channelNum, company, price FROM channelNumMapCompany";

  mysqli_query($conn, "SET NAMES utf8");

  $result = mysqli_query($conn, $select);

  $output = [];

  if($result){
    while($row = mysqli_fetch_assoc($result)){
      $output[] = $row;
    }
    return $output;
  }
  else{
    echo "查询channelNumMapCompany语句错误:".$select;
  }
}


//从价格表中获取所有价格
function getPrices($priceList){
  //$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  $select = "SELECT company, price FROM $priceList";

  mysqli_query($conn, "SET NAMES UTF8");

  $result = mysqli_query($conn, $select);

  $priceArr = [];     //保存所有公司与价格的对应表

  if($result){
    while($row = mysqli_fetch_assoc($result)){
      $priceArr[$row['company']] = $row['price'];
    }

    return $priceArr;
  }
  else{
    echo "select from price fail!".$select;
  }

}


//去重
function unRepeateArr($arr){
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

function getProductName($appid, $appidLibrary){
  for($i = 0; $i < count($appidLibrary); $i++){
    if($appid == $appidLibrary[$i]["id"]) {return $appidLibrary[$i]["title"];}
  }
}

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

