<?php
header("content-type:application/json");

$user = $_REQUEST['name'];

//@$conn = mysqli_connect("127.0.0.1","root", "apy1432016!", "dataquery", 3306);
@$conn = mysqli_connect("127.0.0.1","root", "", "dataquery", 3306);
//@$conn = mysqli_connect("127.0.0.1","dataquery","apy-ad-2016-11","dataquery",33061);

mysqli_query($conn, "set names utf8");

$pager =
[
	'record_count' => 0,
	'page_size'=>30,
	'page_count'=>0,
	'cur_page'=>intval($_REQUEST['pno']),
	'data'=>null
];

//var_dump($userCompany);

//echo $userCompany[0]['compay'];

$sql = "SELECT compay FROM users WHERE name= '$user'";

$userResult = mysqli_query($conn,$sql);

$userCompany = [];

if(!$userResult){ echo "查询失败".$sql;}

else{ $userCompany[] = mysqli_fetch_assoc($userResult);}

//var_dump($userCompany);

//echo $userCompany[0]['compay'];

$company = $userCompany[0]['compay'];

$record_count = "SELECT COUNT(did) FROM products WHERE products.company='$company'";

$result = mysqli_query($conn, $record_count);

$row = mysqli_fetch_assoc($result);

$pager['record_count']=intval($row['COUNT(did)']);

//计算总页数
$pager['page_count'] = ceil($pager['record_count']/$pager['page_size']);

//获取当前页号对应的记录
//$start = ($pager['cur_page']-1)*$pager['page_size'];    //从第一条开始读取数据
$start = $pager['record_count'] - $pager['cur_page']*$pager['page_size'];  //从最近插入的数据开始读取

$count = $pager['page_size'];

if($start < 0){$count = $pager['page_size'] + $start;$start = 0;}//如$start小于0,查询数+$start,再让$start=0

$select = "select * from products where company='$company' limit $start,$count";

$result = mysqli_query($conn,$select);

$output = [];

$output['products'] = [];
if($result){
    while($row = mysqli_fetch_assoc($result))
    {$output['products'][] = $row;}

    $pager['data']=$output;

    echo json_encode($pager);
}
else{
    echo "select fail!".$select;
}


