<?php
//header("Content-Type:application/json;charset=utf8");

@$uname = $_REQUEST['uname'];

if(empty($uname)){echo "没输入用户"; return;}

//@$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn, "SET NAMES UTF8");

$sql = "SELECT * FROM users WHERE name='$uname'";

$result = mysqli_query($conn, $sql);

$output = [];

if($result){
    while($row = mysqli_fetch_assoc($result)){
        $output[] = $row;
    }
    if(!empty($output)){echo "user is being";}
    else {echo "user is not being";}
}
else {echo "select fail ".$sql;}