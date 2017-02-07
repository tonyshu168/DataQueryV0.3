<?php
//echo phpinfo();
//var_dump(date("Y-m-d h:m:s"));

getAdvData();

function getAdvData(){
  header("content-type:application/json;charset=utf-8");

  @$conn = mysqli_connect("45.32.253.162" ,"adholly", "web.ad.holly", "adv", 3306);

  $select = "SELECT cdate,ctime,retailid from callbacklog where cdate like '2016-12-15%'";

  mysqli_query($conn,"set names utf8");

  $result = mysqli_query($conn, $select);

  $output = [];

  if($result){
    while($row = mysqli_fetch_assoc($result)){$output = $row;}
    echo json_encode($output);
  }
  else{ echo "select fail!!".$select;}
}

//insertIntoSave();

//getPrices("price");
function insertIntoSave(){
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  @$insert = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum, insertStartDid, insertEndDid) value(null, '0', '2016-12-15', '0','ymb','0', '0','0')";

  mysqli_query($conn, "set names utf8");

  $result = mysqli_query($conn, $insert);

  if($result){
    echo josn_encode(mysqli_fetch_assoc($result));
  }
  else{
    echo "insert fail!!".$insert;
  }
}



//从价格表中获取所有价格
function getPrices($priceList){
  //$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
  @$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

  $select = "SELECT company, price FROM $priceList";

  mysqli_query($conn, "SET NAMES utf8");

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

//$channelList = getChannelNumList();

//$row = channelNumMapCompanyAndPrice("xl66671", $channelList);

//echo $row["company"];

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


//echo  !getEndDID("有乐通");

//从readRecond表中获取从上一次最后一条did
function getEndDID($adPlatform){
  //$conn = mysqli_connect("127.0.0.1", "root", "", "dataquery", 3306);
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