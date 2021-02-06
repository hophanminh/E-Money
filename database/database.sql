-- DROP DATABASE QLCHITIEU;
CREATE DATABASE QLCHITIEU;
USE QLCHITIEU;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE Users(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(50) NOT NULL,
    Username VARCHAR(30),
    Password VARCHAR(1000),
    Email VARCHAR(100),
    DateOfBirth DATE,
    AvatarURL VARCHAR(1000),
    ActivatedDate DATE NOT NULL,
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Events`;
CREATE TABLE Events(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Title VARCHAR(1000) NOT NULL,
    StartDate DATE,
    EndDate DATE,
    Status INT,
    CurrentIncomeCount FLOAT,
    CurrentSpendCount FLOAT,
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
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Exchanges`;
CREATE TABLE Exchanges(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Money FLOAT NOT NULL,
    Description VARCHAR(1000),
    DateAdded DATE,
    DateModified DATE,
    EventID VARCHAR(100),
    ExchangeTypeID VARCHAR(100),
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Wallet`;
CREATE TABLE Wallet(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    TotalCount FLOAT,
    CurrentIncomeCount FLOAT,
    CurrentSpentCount FLOAT,
    DateModified DATE,
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Team`;
CREATE TABLE Team(
    ID VARCHAR(100) NOT NULL, -- will store as UUID()
    Name VARCHAR(100) NOT NULL,
    MaxUsers FLOAT NOT NULL,
    Description VARCHAR(1000),
    CreatedDate DATE,
    WalletID VARCHAR(100),
    PRIMARY KEY(ID)
);

DROP TABLE IF EXISTS `Team_Has_Users`;
CREATE TABLE Team_Has_Users(
    UserID VARCHAR(100) NOT NULL,
    TeamID VARCHAR(100) NOT NULL,
    Role INT,
    Status INT,
    PRIMARY KEY(UserID, TeamID)
);

ALTER TABLE Events ADD CONSTRAINT FK_Events_EventTypes FOREIGN KEY(EventTypeID) REFERENCES EventTypes(ID);
ALTER TABLE Events ADD CONSTRAINT FK_Events_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchangs_ExchangeTypes FOREIGN KEY(ExchangeTypeID) REFERENCES ExchangeTypes(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchangs_Events FOREIGN KEY(EventID) REFERENCES Events(ID);
ALTER TABLE Exchanges ADD CONSTRAINT FK_Exchangs_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE ExchangeTypes ADD CONSTRAINT FK_ExchangeTypes_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Team ADD CONSTRAINT FK_Team_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Users ADD CONSTRAINT FK_Users_Wallet FOREIGN KEY(WalletID) REFERENCES Wallet(ID);
ALTER TABLE Team_Has_Users ADD CONSTRAINT FK_Team_Has_Users_Team FOREIGN KEY(TeamID) REFERENCES Team(ID);
ALTER TABLE Team_Has_Users ADD CONSTRAINT FK_Team_Has_Users_Users FOREIGN KEY(UserID) REFERENCES Users(ID);