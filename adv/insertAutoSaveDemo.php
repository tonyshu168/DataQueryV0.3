<?php
header("content-type:application/json;charset=utf-8");

$partner = "snt";

$currentDate = date("Y-m-d");
/*
$insertSQL = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum,
      insertStartDid, insertEndDid,updateDataDid) VALUE(NULL, '0', '2016-12-20', '0','snt','0', '0','','0')";
*/      

$insertSQL = "INSERT INTO autoSaveDataRecodeform(did, recodeCounter, saveDate, costTime, adPlatform, insertStartRowNum,
      insertStartDid, insertEndDid,updateDataDid) value(NULL, '0', '2016-12-20', '0','snt','0', '0','0','0')";

//$select = "SELECT * FROM autoSaveDataRecodefrom WHERE did >= 1";
$select = "SELECT * FROM autosavedatarecodeform WHERE did >= 1";

//$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
$conn = mysqli_connect("127.0.0.1","dataquery", "apy-ad-2016-11", "dataquery", 33061);

mysqli_query($conn, "set names utf8");

$result = mysqli_query($conn, $insertSQL);
//$result = mysqli_query($conn, $select);

if($result){
	echo "insert autoSaveDataRecodeform success!";
}
else{
	echo "insert autoSaveDataRecodeform fail!".$insertSQL;
}

echo "'$partner'：'$currentDate'无数据";
