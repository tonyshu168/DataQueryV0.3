<?php
header("Content-Type:application/json;charset=utf-8");

@$did = $_REQUEST['did'];
if(empty($did)){ echo []; return;}

//$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn,"SET NAMES UTF8");

$sql = "select * from products where did = $did";

$result = mysqli_query($conn, $sql);

$output = [];

if($result){
    while($row = mysqli_fetch_assoc($result)){
        $output = $row;
    }

    echo json_encode($output);
}
else{
    echo "select fail ! ".$sql;
}