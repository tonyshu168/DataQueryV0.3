<?php
header("Content-Type:application/json");

$productName = $_REQUEST["proName"];

$channelNum = $_REQUEST["chaNum"];

$company = $_REQUEST["company"];

//$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn, "SET NAMES UTF8");

$sql = "SELECT productName,channelNum,company,cooperateType,price FROM products WHERE productName='$productName' AND
    channelNum = '$channelNum' and company='$company'";

$result = mysqli_query($conn,$sql);

$output=[];

if(!$result){
    echo "查询失败";
    return;
}

while($row = mysqli_fetch_assoc($result)){
    $output[] = $row;
}

echo json_encode($output);

