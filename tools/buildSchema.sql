drop database if exists JeoparDB;

create database JeoparDB;
use JeoparDB;

drop table if exists Leaderboards;
drop table if exists TeamScores;
drop table if exists ShowDates;
drop table if exists Categories;
drop table if exists QuestionIds;
drop table if exists Questions;


create table Leaderboards
	(Id			 		int not null auto_increment,
	 FullName			varchar(64),
	 Score				double not null,
	 primary key (Id)
	);

create table TeamScores
	(Team 				varchar(64) not null,
	 Score 				int not null,
	 primary key (Team)
	);

create table Categories
	(Category 			varchar(64) not null,
	 Cluster			varchar(64) not null,
	 primary key (Category)
	);

create table ShowDates
	(ShowNumber 		int not null,
	 AirDay				int not null,
	 AirMonth			int not null,
	 AirYear			int not null,
	 primary key (ShowNumber)
	);

create table QuestionIds
	(QuestionId 		int not null,
	 Question 			varchar(512) not null,
	 primary key (QuestionId)
	);

create table Questions
	(QuestionId 		int not null,
	 Answer				varchar(512) not null,
	 Category 			varchar(64) not null,
	 ShowNumber			int not null,
	 Value				int not null,
	 AskedCount			int not null,
	 CorrectCount		int not null,
	 primary key (QuestionId),
	 foreign key (Category) references Categories (Category) on delete cascade,
	 foreign key (ShowNumber) references ShowDates (ShowNumber) on delete cascade
	);

