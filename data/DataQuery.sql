SET NAMES 'utf8';
DROP DATABASE IF EXISTS dataQuery;
CREATE DATABASE dataQuery CHARSET=UTF8;
USE dataQuery;

CREATE TABLE  users(
    name VARCHAR(20) PRIMARY KEY,
    compay VARCHAR(64),
    password VARCHAR(64),
    onlyRead INT, #LONG
    writeAble INT #LONG
);

INSERT INTO users VALUES(
     "apy","爱普优","55,62,69,76,83,90",1,1
);
INSERT INTO users VALUES(
     "apyholly","爱普优","55,62,69,76,83,90",1,1
);
SELECT * FROM users;
CREATE TABLE products(
    did INT PRIMARY KEY AUTO_INCREMENT,
    productName VARCHAR(64),
    channelNum VARCHAR(12),
    company VARCHAR(64),
    compAbbreviation VARCHAR(20),
    cooperateType VARCHAR(10),
    price float(6,2),
    installCount INT,
    effectiveDate BIGINT,
    endDate BIGINT

);
INSERT INTO products(did,productName,channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate,endDate) VALUES(
    null,"enjoy","2006","优友","yu","CPA",1.0,20,2898982092,8348993048
);
INSERT INTO products(did,productName,channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate,endDate) VALUES(
    null,"enjoy","2006","优友","yu","CPA",2.0,50,289898209,834899304
);
INSERT INTO products(did,productName,channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate,endDate) VALUES(
    null,"enjoy","2006","01","yu","CPA",2.0,50,289898209,834899304
);
INSERT INTO products(did,productName,channelNum,company,compAbbreviation,cooperateType,price,installCount,effectiveDate,endDate) VALUES(
    null,"enjoy","2006","爱普优","apy","CPA",2.0,80,289898209,834899304
);

SHOW DATABASES;





