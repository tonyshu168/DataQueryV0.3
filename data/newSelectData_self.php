<?php
header("Content-Type:application/json;charset=utf-8");

@$productName = $_REQUEST["productName"];
if(empty($productName)){ $productName = '%';}

@$channelNum = $_REQUEST["channelNum"];
if(empty($channelNum)){$channelNum = '%';}

@$company = $_REQUEST["company"];
if(empty($company)){$company = '%';}

@$cooperateType = $_REQUEST["cooperateType"];
if(empty($cooperateType)){$cooperateType = '%';}

@$compAbbreviation = $_REQUEST["uname"]; //用户名就是公司简称

@$effectiveDate = $_REQUEST["effectiveDate"];
if(empty($effectiveDate)){$effectiveDate = '%';}

@$endDate = $_REQUEST["endDate"];
if(empty($endDate)){$endDate = '%';}

//@$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn, "SET NAMES UTF8");
/**************************************/
if($endDate != '%' and $effectiveDate !='%'){
    $sql = "select * from products where effectiveDate >='$effectiveDate' AND effectiveDate <='$endDate' AND did in(
    select did from products where productName like '$productName' AND channelNum like '$channelNum' AND company like '$company'
    AND cooperateType like '$cooperateType' AND compAbbreviation like '$compAbbreviation')";

    $result = mysqli_query($conn, $sql);

    $products = [];

    if($result){

        while($row = mysqli_fetch_assoc($result)){
            $products[] = $row;
        }

        echo json_encode($products);

        return;

    }else{
        echo "查询失败!! ".$sql;

        return;
    }
}

if($effectiveDate !='%'){
    $sql = "select * from products where effectiveDate >='$effectiveDate' AND did in(
    select did from products where productName like '$productName' AND channelNum like '$channelNum' AND company like '$company'
    AND cooperateType like '$cooperateType'  AND compAbbreviation like '$compAbbreviation')";

    $result = mysqli_query($conn, $sql);

    $products = [];

    if($result){

        while($row = mysqli_fetch_assoc($result)){
            $products[] = $row;
        }

        echo json_encode($products);

        return;

    }else{
        echo "查询失败!! ".$sql;

        return;
    }
}

if($endDate != '%'){
    $sql = "select * from products where effectiveDate <='$endDate' AND did in(
    select did from products where productName like '$productName' AND channelNum like '$channelNum' AND company like '$company'
    AND cooperateType like '$cooperateType'  AND compAbbreviation like '$compAbbreviation')";

    $result = mysqli_query($conn, $sql);

    $products = [];

    if($result){

        while($row = mysqli_fetch_assoc($result)){
            $products[] = $row;
        }

        echo json_encode($products);

        return;

    }else{
        echo "查询失败!! ".$sql;

        return;
    }
}
/*********************************************/
$sql = "select * from products where productName like '$productName' AND channelNum like '$channelNum'
    AND company like '$company' AND cooperateType like '$cooperateType'  AND compAbbreviation like '$compAbbreviation'
    AND effectiveDate like '$effectiveDate' AND effectiveDate like '$endDate'";

$result = mysqli_query($conn, $sql);

$products = [];

if($result){

    while($row = mysqli_fetch_assoc($result)){
        $products[] = $row;
    }

    echo json_encode($products);

}else{

    echo "查询失败!! ".$sql;

}