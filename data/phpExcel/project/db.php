<?php
  require dirname(__FILE__)."/dbConf.php";        //引入配置文件

  class db{
    public $conn = null;

    public function __construct($config){         //构造方法实例化
      $this -> conn = mysqli_connect($config['host'], $config['userName'], $config['password'],$config['database'],$config['port'])
        or die(mysql_error());
      mysqli_query($this -> conn, "SET NAMES ".$config['charset']) or die(mysql_error());
    }

    //根据sql语句，获取查询结果集
    public function getResult($sql){
      $result = mysqli_query($this -> conn,$sql) or die(mysql_error());
      $output = [];
      while($row = mysqli_fetch_assoc($result)){
        $output[] = $row;
      }
      return $output;
    }


    //根据 日期 获取查询结果
    public function getDataByDate($effectiveDate, $endDate){
      $sql = "select adPlatform, adID,productName, channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate from
        products where effectiveDate >= $effectiveDate and effectiveDate <= $endDate";
      return self::getResult($sql);          //根据 sql 语句获取结果集
    }

    //获取当前页面
    public function getDataByCurrentPage($currentPage,$pager){
      $sql = "select count(did) from products";
      $record_count = self::getResult($sql);
      $pager['record_count'] = intval($record_count[0]['count(did)']);

      //获取当前页号对应的记录
      $start = $pager['record_count'] - $currentPage*$pager['page_size'];

      $count = $pager['page_size'];

      if($start < 0){$count = $pager['page_size'] + $start;$start = 0;}//如$start小于0,查询数+$start,再让$start=0

      $select = "select adPlatform, adID,productName, channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate from
        products limit $start,$count";
      return self::getResult($select);
    }


    //根据页数范围获取查询结果
    public function getDataByPage($startPage, $finishPage, $pager){
      $sql = "select count(did) from products";
      $record_count = self::getResult($sql);
      $pager['record_count'] = intval($record_count[0]['count(did)']);

      //获取当前页号对应的记录
      $start = $pager['record_count'] - ($startPage-1)*$pager['page_size'];
      $finish = $pager['record_count'] - ($finishPage)*$pager['page_size'];

      $select = "select adPlatform, adID,productName, channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate from
        products limit $finish, $start";
      return self::getResult($select);
    }


    //对数据进行排序:$drection == asc 进行正序排序
    public function objSort($data, $drection){
      if($drection == "asc"){
        for($r = 1, $length=count($data); $r < $length; $r++){
          for($i=0; $i < $length - $r; $i++){
            if($data[$i]['effectiveDate'] > $data[$i+1]['effectiveDate']){
              $temp = $data[$i];
              $data[$i] = $data[$i+1];
              $data[$i+1] = $temp;
            }
          }
        }
      }
      else{
        for($r = 1, $length=count($data); $r < $length; $r++){
          for($i=0; $i < $length - $r; $i++){
            if($data[$i]['effectiveDate'] < $data[$i+1]['effectiveDate']){
               $temp = $data[$i];
               $data[$i] = $data[$i+1];
               $data[$i+1] = $temp;
            }
          }
        }
      }
      $temp = null;
      return self::secondChangeDate($data);
    }

    //将时间戳转化为日期
    public function secondChangeDate($data){
      for($i = 0, $length = count($data); $i < $length; $i++){
        $data[$i]['effectiveDate'] = date("Y-m-d", ceil($data[$i]['effectiveDate']/1000));
      }
      return $data;
    }
  }