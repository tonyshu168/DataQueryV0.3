SET NAMES 'utf8';
USE dataQuery;

CREATE TABLE price(
  did INT PRIMARY KEY AUTO_INCREMENT,
  adPlatform VARCHAR(20),
  channelNum VARCHAR(12),
  productName VARCHAR(64),
  company VARCHAR(64),
  cooperateType VARCHAR(10),
  price float(6,2)
);

INSERT INTO price(did,company,price) values(null, "点开", 2.80);
INSERT INTO price(did,company,price) values(null, "优友", 2.60);
INSERT INTO price(did,company,price) values(null, "鑫磊", 2.80);
INSERT INTO price(did,company,price) values(null, "珠海中亿", 2.00);
INSERT INTO price(did,company,price) values(null, "三联", 3.00);
INSERT INTO price(did,company,price) values(null, "环球", 2.80);
INSERT INTO price(did,company,price) values(null, "途牛", 2.80);
INSERT INTO price(did,company,price) values(null, "暴雪", 3.80);
INSERT INTO price(did,company,price) values(null, "盘古", 3.00);
INSERT INTO price(did,company,price) values(null, "民生", 3.80);


