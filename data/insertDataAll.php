<?php
header("Content-Type:application/json;charset=utf-8");

$adPlatform = $_REQUEST["adPlatform"];

@$adID = $_REQUEST["adID"];
if(empty($adID)){$adID = 0;}

$productName = $_REQUEST["proName"];

$channelName = $_REQUEST["channelName"];

$company = $_REQUEST["company"];

$compAbbreviation = $_REQUEST["compabbr"];

$cooperateType = $_REQUEST["coopType"];

$price = $_REQUEST["price"];

$installCount = $_REQUEST["installCount"];

$effectiveDate = $_REQUEST["effeDate"];

$endDate = $_REQUEST["endDate"];

//@$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

$writeAble = 0;

if($company == "爱普优"){ $writeAble = 1;}

mysqli_query($conn, "SET NAMES UTF8");

$sql = "insert into products value(null,'$adPlatform', '$adID','$productName','$channelName','$company','$compAbbreviation','$cooperateType',$price,$installCount,$effectiveDate,$endDate)";

$userSql = "INSERT INTO users VALUE('$compAbbreviation','$company','55,62,69,76,83,90',1,$writeAble)";

//$sql = "insert into products(productName,channelNum,company,compAbbreviation,cooperateType,price,effectiveDate,endDate)values
//('enjoy', '2006', '优友','yu', 'CPA', 1,2147483647,2147483647);

$arr = [];

$result = mysqli_query($conn, $sql); //增加产品列表

$users_result = mysqli_query($conn,$userSql);  //增加用户列表

if($result OR $user_result){ $arr['msg']="Insert Succ!"; $arr['did'] = mysqli_insert_id($conn);}
else { $arr['msg']="Insert fail".$sql."Insert users fail ".$userSql;}

echo json_encode($arr);

