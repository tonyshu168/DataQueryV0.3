<?php
//header("Content-Type:application/text;charset=urf-8");

@$productName = $_REQUEST['productName'];

@$adID = $_REQUEST['adID'];
if(empty($adID)){$adID=0;}

@$channelNum = $_REQUEST['channelNum'];

@$cooperateType = $_REQUEST['cooperateType'];

@$company = $_REQUEST['company'];

@$price = $_REQUEST['price'];

@$did = $_REQUEST['did'];

//$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);
$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);

mysqli_query($conn, "SET NAMES UTF8");

$sql = "UPDATE products set productName='$productName', adID= $adID, channelNum='$channelNum',cooperateType='$cooperateType',
    company='$company',price=$price WHERE did=$did";

$result = mysqli_query($conn,$sql);

if($result){echo "Update Succ!";}
else{ echo "Update Err!".$sql;}
