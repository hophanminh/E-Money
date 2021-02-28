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
    ActivatedDate DATE NOT NULL,
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
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Events`;
CREATE TABLE Events(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(1000) NOT NULL,
    StartDate DATE,
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
    ExpectingRage FLOAT,
    CurrentIncomeCount FLOAT,
    CurrentSpentCount FLOAT,
    WalletID VARCHAR(100),
    EventTypeID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `EventTypes`;
CREATE TABLE EventTypes(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(100) NOT NULL,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `ExchangeTypes`;
CREATE TABLE ExchangeTypes(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(1000) NOT NULL,
    IsDefault BOOLEAN NOT NULL,
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Exchanges`;
CREATE TABLE Exchanges(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Money FLOAT NOT NULL,
    Description VARCHAR(1000),
    DateAdded DATETIME,
    DateModified DATETIME,
    EventID VARCHAR(100),
    ExchangeTypeID VARCHAR(100),
    WalletID VARCHAR(100),
    UserID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `ExchangesHistory`;
CREATE TABLE ExchangesHistory(
    ID VARCHAR(100) NOT NULL, -- UUID()
    Money FLOAT NOT NULL,
    Description VARCHAR(1000),
    DateAdded DATETIME,
    DateModified DATETIME,
    EventID VARCHAR(100),
    ExchangeTypeID VARCHAR(100),
    WalletID VARCHAR(100),
    UserID VARCHAR(100),
    ExchangeID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Wallet`;
CREATE TABLE Wallet(
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

ALTER TABLE Events ADD CONSTRAINT FK_Events_EventTypes FOREIGN KEY(EventTypeID) REFERENCES EventTypes(ID);
ALTER TABLE Events ADD CONSTRAINT FK_Events_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchanges_ExchangeTypes FOREIGN KEY(ExchangeTypeID) REFERENCES ExchangeTypes(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchanges_Events FOREIGN KEY(EventID) REFERENCES Events(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchanges_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchanges_Users FOREIGN KEY(UserID) REFERENCES Users(ID);
ALTER TABLE ExchangesHistory ADD CONSTRAINT FK_ExchangesHistory_Exchanges FOREIGN KEY(ExchangeID) REFERENCES Exchanges(ID);
ALTER TABLE ExchangeTypes ADD CONSTRAINT FK_ExchangeTypes_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Teams ADD CONSTRAINT FK_Teams_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Users ADD CONSTRAINT FK_Users_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Teams_Has_Users ADD CONSTRAINT FK_Teams_Has_Users_Team FOREIGN KEY(TeamID) REFERENCES Teams(ID);
ALTER TABLE Teams_Has_Users ADD CONSTRAINT FK_Teams_Has_Users_Users FOREIGN KEY(UserID) REFERENCES Users(ID);