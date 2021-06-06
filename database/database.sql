-- DROP DATABASE QLCHITIEU;
CREATE DATABASE QLCHITIEU;
USE QLCHITIEU;

-- Them, xoa, sua Users
DROP TABLE IF EXISTS `Admins`;
CREATE TABLE Admins(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(50) NOT NULL,
    Username VARCHAR(30),
    Password VARCHAR(1000),
    Email VARCHAR(100),
    DateOfBirth DATE,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Users`;
CREATE TABLE Users(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(50) NOT NULL,
    Username VARCHAR(30),
    Password VARCHAR(1000),
    Email VARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    AvatarURL VARCHAR(1000),
    ActivatedDate DATE,
    IsBanned BOOLEAN,
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Events`;
CREATE TABLE Events(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(1000) NOT NULL,
    StartDate datetime,
	NextDate datetime,
    EndDate DATE,
    Status INT, -- 0 or 1
	Value INT,
    -- Cột Value có giá trị tương ứng như sau:
		-- Loại event một lần: NULL
        -- Loại event hằng ngày: 0
		-- Loại event hằng tuần: [1, 7], trong đó:
			-- 1: Chủ Nhật
            -- [2, 7]: Thứ [2, 7]
		-- Loại event hằng tháng: [1, 28/29/30/31], mỗi số tương ứng là ngày trong tháng
        -- Loại event hằng năm: [1, 12], mỗi số tương ứng là tháng trong năm
    ExpectingAmount FLOAT,
	Description varchar(1000) DEFAULT NULL,
    WalletID VARCHAR(100),
    CategoryID VARCHAR(100),
    EventTypeID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `EventTypes`;
CREATE TABLE EventTypes(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(100) NOT NULL,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Categories`;
CREATE TABLE Categories(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(1000) NOT NULL,
    IsDefault BOOLEAN NOT NULL,
    WalletID VARCHAR(100),
    IconID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Transactions`;
CREATE TABLE Transactions(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Money FLOAT NOT NULL,
    Description VARCHAR(1000),
    DateAdded DATETIME,
    DateModified DATETIME,
    EventID VARCHAR(100),
    CategoryID VARCHAR(100),
    WalletID VARCHAR(100),
    UserID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `TransactionHistories`;
CREATE TABLE TransactionHistories(
    ID VARCHAR(100) NOT NULL, -- UUID()
    Money FLOAT NOT NULL,
    Description VARCHAR(1000),
    DateAdded DATETIME,
    DateModified DATETIME,
    EventID VARCHAR(100),
    CategoryID VARCHAR(100),
    WalletID VARCHAR(100),
    UserID VARCHAR(100),
    TransactionID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Wallets`;
CREATE TABLE Wallets(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    TotalCount FLOAT,
    CurrentIncomeCount FLOAT,
    CurrentSpentCount FLOAT,
    DateModified DATETIME,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Teams`;
CREATE TABLE Teams(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(100) NOT NULL,
    MaxUsers FLOAT NOT NULL,
    Description VARCHAR(1000),
    CreatedDate DATE,
    AvatarURL VARCHAR(1000),
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Teams_Has_Users`;
CREATE TABLE Teams_Has_Users(
    UserID VARCHAR(100) NOT NULL,
    TeamID VARCHAR(100) NOT NULL,
    Role INT,
    Status INT,
    PRIMARY KEY(UserID, TeamID)
);

DROP TABLE IF EXISTS `ResetRequests`;
CREATE TABLE ResetRequests(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
	Code VARCHAR(10) NOT NULL,
    UserID VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    IsSuccessful BOOLEAN NOT NULL,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Icons`;
CREATE TABLE Icons(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(100) NOT NULL,
    Color VARCHAR(7),
    BackgroundColor VARCHAR(7),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `TransactionImages`;
CREATE TABLE TransactionImages(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    URL VARCHAR(1000),
    TransactionID VARCHAR(100),
	DateAdded DATETIME,
	PublicID VARCHAR(100),
    UserID VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Notifications`;
CREATE TABLE Notifications(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Content VARCHAR(1000),
    DateNotified DATETIME,
    IsRead BOOLEAN,
    UserID VARCHAR(100),
    PRIMARY KEY(ID)
);

ALTER TABLE Events ADD CONSTRAINT FK_Events_EventTypes FOREIGN KEY(EventTypeID) REFERENCES EventTypes(ID);
ALTER TABLE Events ADD CONSTRAINT FK_Events_Wallets FOREIGN KEY(WalletID) REFERENCES Wallets(ID);
ALTER TABLE Events ADD CONSTRAINT FK_Events_Categories FOREIGN KEY(CategoryID) REFERENCES Categories(ID);
ALTER TABLE Transactions ADD CONSTRAINT FK_Transactions_Categories FOREIGN KEY(CategoryID) REFERENCES Categories(ID);
ALTER TABLE Transactions ADD CONSTRAINT FK_Transactions_Events FOREIGN KEY(EventID) REFERENCES Events(ID);
ALTER TABLE Transactions ADD CONSTRAINT FK_Transactions_Wallets FOREIGN KEY(WalletID) REFERENCES Wallets(ID);
ALTER TABLE Transactions ADD CONSTRAINT FK_Transactions_Users FOREIGN KEY(UserID) REFERENCES Users(ID);
ALTER TABLE TransactionHistories ADD CONSTRAINT FK_TransactionHistories_Transactions FOREIGN KEY(TransactionID) REFERENCES Transactions(ID);
ALTER TABLE Categories ADD CONSTRAINT FK_Categories_Wallets FOREIGN KEY(WalletID) REFERENCES Wallets(ID);
ALTER TABLE Categories ADD CONSTRAINT FK_Categories_Icons FOREIGN KEY(IconID) REFERENCES Icons(ID);
ALTER TABLE Teams ADD CONSTRAINT FK_Teams_Wallets FOREIGN KEY(WalletID) REFERENCES Wallets(ID);
ALTER TABLE Users ADD CONSTRAINT FK_Users_Wallets FOREIGN KEY(WalletID) REFERENCES Wallets(ID);
ALTER TABLE Teams_Has_Users ADD CONSTRAINT FK_Teams_Has_Users_Team FOREIGN KEY(TeamID) REFERENCES Teams(ID);
ALTER TABLE Teams_Has_Users ADD CONSTRAINT FK_Teams_Has_Users_Users FOREIGN KEY(UserID) REFERENCES Users(ID);
ALTER TABLE ResetRequests ADD CONSTRAINT FK_ResetRequests_Users FOREIGN KEY(UserID) REFERENCES Users(ID);
ALTER TABLE TransactionImages ADD CONSTRAINT FK_TransactionImages_Transactions FOREIGN KEY(TransactionID) REFERENCES Transactions(ID);
ALTER TABLE TransactionImages ADD CONSTRAINT FK_TransactionImages_Users FOREIGN KEY(UserID) REFERENCES Users(ID);
ALTER TABLE Notifications ADD CONSTRAINT FK_Notifications_Users FOREIGN KEY(UserID) REFERENCES Users(ID);

INSERT INTO icons VALUES 
('1','school','#FFFFFF','#1DAF1A'),
('2','fastfood','#FFFFFF','#FF2626'),
('3','attach_money','#FFFFFF','#808080'),
('4','business','#FFFFFF','#003366'),
('5','local_hospital','#FFFFFF','#f40505'),
('6','store_mall_direction','#FFFFFF','#5AC18E'),
('7','local_gas_station','#FFFFFF','#1D2021');
INSERT INTO eventtypes VALUES ('1','Hằng ngày'),('2','Hằng tuần'),('3','Hằng tháng'),('4','Hằng năm');
INSERT INTO categories VALUES ('1','Học tập',1,NULL,'1'),('2','Ăn uống',1,NULL,'2'),('3','Khác',1,NULL,'3');
INSERT INTO wallets VALUES 
	('1', 0, 0, 0, '2021-01-01'),
	('2', 0, 0, 0, '2021-01-01'),
	('3', 0, 0, 0, '2021-01-01'),
	('4', 0, 0, 0, '2021-01-01'),
    ('30764480-aa43-11eb-9012-370ed11ba268', 0, 0, 0, '2021-05-01')
;

INSERT INTO teams VALUES
    ('30847550-aa43-11eb-9012-370ed11ba268', 'KHTN', 4, 'This is the description for team', '2021-05-01', NULL, '30764480-aa43-11eb-9012-370ed11ba268')
;

-- Password: 123456
INSERT INTO users VALUES 
	('1', 'Hồ Phan Minh', 'hpminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'hophanminh@gmail.com', '1999-05-19', NULL, '2021-01-01', FALSE, '1'),
	('2', 'Lạc Tuấn Minh', 'ltminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'lactuanminh@gmail.com', '1999-01-01', NULL, '2021-01-01', FALSE, '2'),
	('3', 'Nguyễn Quang Minh', 'nqminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'nguyenquangminh@gmail.com', '1999-01-01', NULL, '2021-01-01', FALSE, '3'),
	('4', 'Hồ Khánh Nguyên', 'hknguyen', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'hokhanhnguyen@gmail.com', '1999-04-30', NULL, '2021-01-01', FALSE, '4');

INSERT INTO teams_has_users VALUES
    ('1', '30847550-aa43-11eb-9012-370ed11ba268', 0, 1),
    ('2', '30847550-aa43-11eb-9012-370ed11ba268', 0, 1),
    ('3', '30847550-aa43-11eb-9012-370ed11ba268', 0, 1),
    ('4', '30847550-aa43-11eb-9012-370ed11ba268', 1, 1)
;

INSERT INTO notifications VALUES
	('1', 'Notification 1', '2021-05-18 10:10:59', FALSE, '4'),
    ('2', 'Notification 2', '2021-05-18 10:10:58', FALSE, '4'),
    ('3', 'Notification 3', '2021-05-18 10:10:57', FALSE, '4'),
    ('4', 'Notification 4', '2021-05-18 10:10:56', FALSE, '4'),
    ('5', 'Notification 5', '2021-05-18 10:10:55', FALSE, '4'),
    ('6', 'Notification 6', '2021-05-18 10:10:54', FALSE, '4'),
    ('7', 'Notification 7', '2021-05-18 10:10:53', FALSE, '4'),
    ('8', 'Notification 8', '2021-05-18 10:10:52', FALSE, '4'),
    ('9', 'Notification 9', '2021-05-18 10:10:51', TRUE, '4'),
    ('10', 'Notification 10', '2021-05-18 10:10:50', TRUE, '4'),
    ('11', 'Notification 11', '2021-05-18 10:10:49', TRUE, '4'),
    ('12', 'Notification 12', '2021-05-18 10:10:48', TRUE, '4'),
    ('13', 'Notification 13', '2021-05-18 10:10:47', TRUE, '4'),
    ('14', 'Notification 14', '2021-05-18 10:10:46', TRUE, '4'),
    ('15', 'Notification 15', '2021-05-18 10:10:45', TRUE, '4'),
    ('16', 'Notification 16', '2021-05-18 10:10:44', TRUE, '4')
;

INSERT INTO admins VALUES 
	('1', 'Hồ Phan Minh', 'hpminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'hophanminh@gmail.com', '1999-05-19'),
	('2', 'Lạc Tuấn Minh', 'ltminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'lactuanminh@gmail.com', '1999-01-01'),
	('3', 'Nguyễn Quang Minh', 'nqminh', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'nguyenquangminh@gmail.com', '1999-01-01'),
	('4', 'Hồ Khánh Nguyên', 'hknguyen', '$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da', 'hokhanhnguyen@gmail.com', '1999-04-30');
