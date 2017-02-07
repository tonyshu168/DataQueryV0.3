<?php
header("content-type: application/json;charset=utf-8");

@$conn = mysqli_connect("45.32.253.162", "adholly", "web.ad.holly", "adv", 3306);

mysqli_query($conn, "SET NAMES UTF8");

$select = "select id, title from applist";

$result = mysqli_query($conn, $select);

$output = [];

while($row = mysqli_fetch_assoc($result)){
  $output[] = $row;
}

echo json_encode($output);
echo "\n";
echo count($output);
