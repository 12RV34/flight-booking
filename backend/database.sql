CREATE DATABASE IF NOT EXISTS flight_db;
USE flight_db;

CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20),
    airline VARCHAR(50),
    departure VARCHAR(10),
    destination VARCHAR(10),
    available_seats INT,
    departure_time VARCHAR(10),
    arrival_time VARCHAR(10),
    price FLOAT,
    duration VARCHAR(10)
);

INSERT INTO flights (flight_number, airline, departure, destination, available_seats, departure_time, arrival_time, price, duration)
VALUES
('AI-101', 'Air India', 'DEL', 'BOM', 45, '08:00 AM', '10:30 AM', 4500, '2h 30m'),
('IG-202', 'IndiGo', 'DEL', 'BLR', 0, '02:15 PM', '05:00 PM', 6200, '2h 45m'),
('SG-303', 'SpiceJet', 'DEL', 'MAA', 12, '06:30 PM', '09:15 PM', 5800, '2h 45m');


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    passenger_name  VARCHAR(100),
    passport_number VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

select * from bookings;