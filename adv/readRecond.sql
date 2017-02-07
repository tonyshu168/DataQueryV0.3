SET NAMES 'utf8';
USE dataquery;

#用于保存从adv中三个 callbacklog 表读取数据的状态
CREATE TABLE readRecond(
  did INT PRIMARY KEY AUTO_INCREMENT,   
  adPlatform VARCHAR(64),         #记录从那个表中读取数据
  endDID INT                      #记录从那个表中最后一条记录的DID
);
