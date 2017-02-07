<?php
header("content-type:application/json;charset=utf-8");
$dir = dirname(__FILE__);   //获取当前脚本所在目录
require $dir."/db.php";   //引入mysqli操作类文件
require "../PHPExcel.php";   //引入PHPExcel类

@$currentPage = $_REQUEST['currentPage'];  //传入当前页面的数据

@$effectiveDate = $_REQUEST['effectiveDate'];       //传入起始时间

@$endDate = $_REQUEST['endDate'];            //传入的结束时间

//如果$effectiveDate > $endDate,则交换数据
if($effectiveDate > $endDate){ $effectiveDate += $endDate; $endDate = $effectiveDate - $endDate; $effectiveDate -= $endDate; }

@$startPage = $_REQUEST['startPage'];       //传入的起启页

@$finishPage = $_REQUEST['finishPage'];     //传入的结束页

if($startPage > $finishPage) {$startPage += $finishPage; $finishPage = $startPage - $finishPage; $startPage -= $finishPage; }

$db = new db($phpExcel);

$objPHPExcel = new PHPExcel();  //实例化PHPExcel

$objSheet = $objPHPExcel -> getActiveSheet();  //获取当前活动sheet

$objSheet -> getDefaultStyle() -> getFont() -> setSize(14);       //为表设置默认字体大小

$objSheet -> getDefaultStyle() -> getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER) ->
  setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);     //设置默认对齐方试为垂直水平剧中对齐

$objSheet -> getStyle("A1:Z1") -> getFont() ->setSize(16) -> setBold(true);   //为首行设置字体大小为16并加粗

$objSheet -> getColumnDimension("D") -> setWidth(32);   //设置 "产品名称" 这一列的对齐方为左对齐,宽为32   -> setWidth(32)

$objSheet -> setCellValue("A1","日期") -> setCellValue("B1","广告平台") -> setCellValue("C1", "广告ID") -> setCellValue("D1", "产品名称")
  -> setCellValue("E1", "渠道号") -> setCellValue("F1", "公司") -> setCellValue("G1","合作类型") -> setCellValue("H1","单价") ->
  setCellValue("I1","安装量");

//如果选择的是 "当前页"
if($currentPage){
  $data = $db -> getDataByCurrentPage($currentPage,$pager);
}
else if($effectiveDate && $endDate){   //如果选择是 "时间"
  $data = $db -> getDataByDate($effectiveDate, $endDate);
}
else{             //最后就是页数
  $data = $db -> getDataByPage($startPage,$finishPage,$pager);
}

$data = $db -> objSort($data,"desc");


$i = 2;
foreach($data as $key => $val){
  $objSheet -> setCellValue("A".$i, $val['effectiveDate']) -> setCellValue("B".$i, $val['adPlatform']) -> setCellValue("C".$i, $val['adID'])
    -> setCellValue("D".$i, $val['productName']) -> setCellValue("E".$i, $val['channelNum']) -> setCellValue("F".$i, $val['company']) ->
    setCellValue("G".$i, $val['cooperateType']) -> setCellValue('H'.$i, $val['price']) -> setCellValue("I".$i, $val['installCount']);
  $i++;
}

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel5");    //生成excel文件

$objWriter -> save($dir."/export.xls");   //保存文件

echo json_encode("http://localhost:8081/project/online/dataqueryV0.3/data/phpExcel/project/export.xls");      //本地调试
//echo json_encode("http://ad.appholly.com/data/phpExcel/project/export.xls");                    //远程服务器
