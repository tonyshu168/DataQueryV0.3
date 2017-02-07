SET NAMES 'utf8';
USE dataQuery;

CREATE TABLE AutoSaveDataRecodeForm(
	did INT PRIMARY KEY AUTO_INCREMENT,
	recodeCounter INT,
	saveDate VARCHAR(20),
	costTime INT,
	adPlatform VARCHAR(64),
	insertStartRowNum BIGINT,
	insertStartDid BIGINT,
	insertEndDid BIGINT
);