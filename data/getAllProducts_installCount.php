<?php
header("content-type:application/json");

//@$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn, "set names utf8");

//var_dump($userCompany);-

//echo $userCompany[0]['compay'];

$selec = "SELECT installCount FROM products";

$result = mysqli_query($conn, $selec);

$output = [];
while($row = mysqli_fetch_assoc($result))
{$output[] = $row;}

echo json_encode($output);

