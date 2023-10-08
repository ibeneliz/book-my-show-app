create table movie(movie_id int not null, movie_name varchar(50), show_id int not null, theatre_id int not null, primary key(movie_id), 
									FOREIGN KEY (show_id) REFERENCES shows (show_id), FOREIGN KEY (theatre_id) REFERENCES theatre (theatre_id));

create table shows(show_id int not null, timing varchar(50), movie_format varchar(50),movie_date date , primary key(show_id));

create table theatre(theatre_id int not null, theatre_name varchar(50), primary key(theatre_id));

insert into theatre(theatre_id, theatre_name) values(1, 'Nexus');
insert into theatre(theatre_id, theatre_name) values(2, 'PVR');

select* from theatre;

insert into shows(show_id, timing, movie_format, movie_date) values(1, '9:00 AM', 'IMAX', '2023-09-10' );
insert into shows(show_id, timing, movie_format, movie_date) values(2, '12:00 PM', 'DOLBY 7.1', '2023-09-11' );
insert into shows(show_id, timing, movie_format, movie_date) values(3, '3:00 PM', 'DOLBY 5.1', '2023-09-12' );
insert into shows(show_id, timing, movie_format, movie_date) values(4, '6:00 PM', 'DOLBY 5.1', '2023-09-08' );
insert into shows(show_id, timing, movie_format, movie_date) values(5, '9:00 AM', 'DOLBY 7.1', '2023-09-12' );
insert into shows(show_id, timing, movie_format, movie_date) values(6, '6:00 PM', 'IMAX', '2023-09-12' );

select * from shows;

insert into movie(movie_id, movie_name,show_id, theatre_id) values(1, 'Jawan', 2, 1);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(2, 'Jawan', 1, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(3, 'Jailer', 1, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(4, 'Jailer', 3, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(5, 'Jailer', 5, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(6, 'Jailer', 6, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(7, 'Jawan', 3, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(8, 'Jawan', 5, 2);
insert into movie(movie_id, movie_name,show_id, theatre_id) values(9, 'Jawan', 6, 2);

select * from movie;

#Write a query to list down all the shows on a given date at a given theatre along with their respective show timings.
select
	shows.timing,
	theatre.theatre_name,
	shows.movie_format,
	shows.movie_date,
	movie.movie_name
from
	movie
left join shows on
	shows.show_id = movie.show_id
left join theatre on
	movie.theatre_id = theatre.theatre_id
where
	shows.movie_date = '2023-09-12'
	and theatre.theatre_name = 'PVR';



