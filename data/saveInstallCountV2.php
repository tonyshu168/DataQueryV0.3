<?php
//header("Content-Type:application/text;charset=urf-8");

$installCount = $_REQUEST["installCount"];

$productName = $_REQUEST["productName"];

$channelNum = $_REQUEST["channelNum"];

$company = $_REQUEST["company"];

$price = $_REQUEST["price"];

$effectiveDate = $_REQUEST["effectiveDate"];

$did = $_REQUEST["did"];

@$adPlatform = $_REQUEST["adPlatform"];

@$adID = $_REQUEST["adID"];
if(empty($adID)){$adID = 0;}

$endDate = $effectiveDate+1000*3600*24*365;

//$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn,"SET NAMES UTF8");

$sql = "UPDATE products set installCount=$installCount, productName='$productName', channelNum='$channelNum',
  company='$company', price=$price, effectiveDate =$effectiveDate, endDate = $endDate, adPlatform = '$adPlatform',
  adID = $adID WHERE did=$did";

$result = mysqli_query($conn,$sql);

if($result){echo "Update Succ!";}
else{ echo "Update Err!".$sql;}
