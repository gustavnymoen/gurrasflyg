-- GENERERAD av scripts/generate-routes.mjs, ändra inte för hand.
-- 51 flygplatser, 200 rutter.

-- Flygplatser (de som redan finns hoppas över)
INSERT OR IGNORE INTO airports (iata, name, country, timezone) VALUES
  ('ARN', 'Stockholm Arlanda', 'Sverige', 'Europe/Stockholm'),
  ('BMA', 'Stockholm Bromma', 'Sverige', 'Europe/Stockholm'),
  ('GOT', 'Göteborg Landvetter', 'Sverige', 'Europe/Stockholm'),
  ('MMX', 'Malmö Airport', 'Sverige', 'Europe/Stockholm'),
  ('LLA', 'Luleå Airport', 'Sverige', 'Europe/Stockholm'),
  ('VBY', 'Visby Airport', 'Sverige', 'Europe/Stockholm'),
  ('UME', 'Umeå Airport', 'Sverige', 'Europe/Stockholm'),
  ('OSD', 'Åre Östersund Airport', 'Sverige', 'Europe/Stockholm'),
  ('KRN', 'Kiruna Airport', 'Sverige', 'Europe/Stockholm'),
  ('OSL', 'Oslo Gardermoen', 'Norge', 'Europe/Oslo'),
  ('BGO', 'Bergen Flesland', 'Norge', 'Europe/Oslo'),
  ('TRD', 'Trondheim Værnes', 'Norge', 'Europe/Oslo'),
  ('CPH', 'Köpenhamn Kastrup', 'Danmark', 'Europe/Copenhagen'),
  ('AAL', 'Aalborg Airport', 'Danmark', 'Europe/Copenhagen'),
  ('HEL', 'Helsingfors-Vanda', 'Finland', 'Europe/Helsinki'),
  ('KEF', 'Reykjavik Keflavík', 'Island', 'Atlantic/Reykjavik'),
  ('TLL', 'Tallinn Airport', 'Estland', 'Europe/Tallinn'),
  ('RIX', 'Riga International', 'Lettland', 'Europe/Riga'),
  ('LHR', 'London Heathrow', 'Storbritannien', 'Europe/London'),
  ('MAN', 'Manchester Airport', 'Storbritannien', 'Europe/London'),
  ('EDI', 'Edinburgh Airport', 'Storbritannien', 'Europe/London'),
  ('DUB', 'Dublin Airport', 'Irland', 'Europe/Dublin'),
  ('CDG', 'Paris Charles de Gaulle', 'Frankrike', 'Europe/Paris'),
  ('NCE', 'Nice Côte d''Azur', 'Frankrike', 'Europe/Paris'),
  ('AMS', 'Amsterdam Schiphol', 'Nederländerna', 'Europe/Amsterdam'),
  ('BRU', 'Bryssel Zaventem', 'Belgien', 'Europe/Brussels'),
  ('FRA', 'Frankfurt am Main', 'Tyskland', 'Europe/Berlin'),
  ('MUC', 'München Franz Josef Strauss', 'Tyskland', 'Europe/Berlin'),
  ('BER', 'Berlin Brandenburg', 'Tyskland', 'Europe/Berlin'),
  ('ZRH', 'Zürich Airport', 'Schweiz', 'Europe/Zurich'),
  ('VIE', 'Wien Schwechat', 'Österrike', 'Europe/Vienna'),
  ('PRG', 'Prag Václav Havel', 'Tjeckien', 'Europe/Prague'),
  ('WAW', 'Warszawa Chopin', 'Polen', 'Europe/Warsaw'),
  ('BCN', 'Barcelona El Prat', 'Spanien', 'Europe/Madrid'),
  ('MAD', 'Madrid Barajas', 'Spanien', 'Europe/Madrid'),
  ('AGP', 'Málaga Airport', 'Spanien', 'Europe/Madrid'),
  ('PMI', 'Palma de Mallorca', 'Spanien', 'Europe/Madrid'),
  ('LPA', 'Gran Canaria Airport', 'Spanien', 'Atlantic/Canary'),
  ('LIS', 'Lissabon Humberto Delgado', 'Portugal', 'Europe/Lisbon'),
  ('FCO', 'Rom Fiumicino', 'Italien', 'Europe/Rome'),
  ('MXP', 'Milano Malpensa', 'Italien', 'Europe/Rome'),
  ('ATH', 'Aten Eleftherios Venizelos', 'Grekland', 'Europe/Athens'),
  ('IST', 'Istanbul Airport', 'Turkiet', 'Europe/Istanbul'),
  ('DXB', 'Dubai International', 'Förenade Arabemiraten', 'Asia/Dubai'),
  ('BKK', 'Bangkok Suvarnabhumi', 'Thailand', 'Asia/Bangkok'),
  ('JFK', 'New York John F. Kennedy', 'USA', 'America/New_York'),
  ('EWR', 'Newark Liberty', 'USA', 'America/New_York'),
  ('ORD', 'Chicago O''Hare', 'USA', 'America/Chicago'),
  ('MIA', 'Miami International', 'USA', 'America/New_York'),
  ('LAX', 'Los Angeles International', 'USA', 'America/Los_Angeles'),
  ('YYZ', 'Toronto Pearson', 'Kanada', 'America/Toronto');

-- Rutter: från, till, flygtid (min) och avstånd (km, bara som kommentar)
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'AMS'; -- 624 km
INSERT INTO route_departures (route_id, departure_time) VALUES (1, '07:20'), (1, '16:35'), (1, '20:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BMA'; -- 536 km
INSERT INTO route_departures (route_id, departure_time) VALUES (2, '08:05'), (2, '12:40'), (2, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 3, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'CPH'; -- 238 km
INSERT INTO route_departures (route_id, departure_time) VALUES (3, '06:10'), (3, '11:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 4, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'KRN'; -- 1305 km
INSERT INTO route_departures (route_id, departure_time) VALUES (4, '15:30'), (4, '20:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 5, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'ARN'; -- 3016 km
INSERT INTO route_departures (route_id, departure_time) VALUES (5, '17:10'), (5, '20:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 6, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BGO'; -- 2716 km
INSERT INTO route_departures (route_id, departure_time) VALUES (6, '08:45'), (6, '17:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 7, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MAD'; -- 432 km
INSERT INTO route_departures (route_id, departure_time) VALUES (7, '07:50'), (7, '14:45'), (7, '18:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 8, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'AAL'; -- 624 km
INSERT INTO route_departures (route_id, departure_time) VALUES (8, '12:45'), (8, '17:20'), (8, '21:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 9, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'ARN'; -- 1152 km
INSERT INTO route_departures (route_id, departure_time) VALUES (9, '07:30'), (9, '12:40'), (9, '16:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 10, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BRU'; -- 158 km
INSERT INTO route_departures (route_id, departure_time) VALUES (10, '07:25'), (10, '18:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 11, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'GOT'; -- 765 km
INSERT INTO route_departures (route_id, departure_time) VALUES (11, '08:00'), (11, '18:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 12, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'LLA'; -- 1764 km
INSERT INTO route_departures (route_id, departure_time) VALUES (12, '08:45'), (12, '12:25'), (12, '17:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 13, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'LPA'; -- 3183 km
INSERT INTO route_departures (route_id, departure_time) VALUES (13, '11:10'), (13, '16:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 14, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'PRG'; -- 705 km
INSERT INTO route_departures (route_id, departure_time) VALUES (14, '15:45'), (14, '19:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 15, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'AGP'; -- 3016 km
INSERT INTO route_departures (route_id, departure_time) VALUES (15, '12:05'), (15, '18:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 16, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'AMS'; -- 1152 km
INSERT INTO route_departures (route_id, departure_time) VALUES (16, '11:45'), (16, '19:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 17, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'ATH'; -- 2452 km
INSERT INTO route_departures (route_id, departure_time) VALUES (17, '09:15'), (17, '17:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 18, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BCN'; -- 2314 km
INSERT INTO route_departures (route_id, departure_time) VALUES (18, '08:50'), (18, '13:35'), (18, '16:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 19, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BKK'; -- 8295 km
INSERT INTO route_departures (route_id, departure_time) VALUES (19, '06:25'), (19, '10:30'), (19, '21:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 20, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'CDG'; -- 1539 km
INSERT INTO route_departures (route_id, departure_time) VALUES (20, '08:30'), (20, '14:40'), (20, '21:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 21, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'CPH'; -- 547 km
INSERT INTO route_departures (route_id, departure_time) VALUES (21, '12:05'), (21, '16:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 22, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'EWR'; -- 6308 km
INSERT INTO route_departures (route_id, departure_time) VALUES (22, '11:10'), (22, '19:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 23, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'FCO'; -- 2023 km
INSERT INTO route_departures (route_id, departure_time) VALUES (23, '09:40'), (23, '13:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 24, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'FRA'; -- 1223 km
INSERT INTO route_departures (route_id, departure_time) VALUES (24, '10:35'), (24, '16:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 25, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'GOT'; -- 393 km
INSERT INTO route_departures (route_id, departure_time) VALUES (25, '08:35'), (25, '16:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 26, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'HEL'; -- 398 km
INSERT INTO route_departures (route_id, departure_time) VALUES (26, '07:55'), (26, '14:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 27, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'JFK'; -- 6292 km
INSERT INTO route_departures (route_id, departure_time) VALUES (27, '13:30'), (27, '17:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 28, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'LHR'; -- 1462 km
INSERT INTO route_departures (route_id, departure_time) VALUES (28, '08:20'), (28, '12:50'), (28, '18:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 29, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'LLA'; -- 689 km
INSERT INTO route_departures (route_id, departure_time) VALUES (29, '08:15'), (29, '14:10'), (29, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 30, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MMX'; -- 531 km
INSERT INTO route_departures (route_id, departure_time) VALUES (30, '09:10'), (30, '14:30'), (30, '18:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 31, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MUC'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time) VALUES (31, '06:50'), (31, '13:40'), (31, '19:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 32, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'OSD'; -- 433 km
INSERT INTO route_departures (route_id, departure_time) VALUES (32, '08:35'), (32, '13:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 33, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'OSL'; -- 385 km
INSERT INTO route_departures (route_id, departure_time) VALUES (33, '11:25'), (33, '17:50'), (33, '21:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 34, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'TLL'; -- 390 km
INSERT INTO route_departures (route_id, departure_time) VALUES (34, '16:35'), (34, '19:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 35, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'UME'; -- 477 km
INSERT INTO route_departures (route_id, departure_time) VALUES (35, '15:45'), (35, '20:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 36, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'YYZ'; -- 6313 km
INSERT INTO route_departures (route_id, departure_time) VALUES (36, '08:20'), (36, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 37, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'ZRH'; -- 1487 km
INSERT INTO route_departures (route_id, departure_time) VALUES (37, '06:15'), (37, '16:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 38, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'ARN'; -- 2452 km
INSERT INTO route_departures (route_id, departure_time) VALUES (38, '13:15'), (38, '17:00'), (38, '20:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 39, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'IST'; -- 552 km
INSERT INTO route_departures (route_id, departure_time) VALUES (39, '06:40'), (39, '10:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 40, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'ARN'; -- 2314 km
INSERT INTO route_departures (route_id, departure_time) VALUES (40, '12:50'), (40, '17:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 41, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'CDG'; -- 856 km
INSERT INTO route_departures (route_id, departure_time) VALUES (41, '09:00'), (41, '14:00'), (41, '18:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 42, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'CPH'; -- 366 km
INSERT INTO route_departures (route_id, departure_time) VALUES (42, '08:15'), (42, '13:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 43, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'GOT'; -- 594 km
INSERT INTO route_departures (route_id, departure_time) VALUES (43, '06:00'), (43, '10:10'), (43, '14:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 44, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'HEL'; -- 1128 km
INSERT INTO route_departures (route_id, departure_time) VALUES (44, '07:00'), (44, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 45, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'AGP'; -- 2716 km
INSERT INTO route_departures (route_id, departure_time) VALUES (45, '07:30'), (45, '12:40'), (45, '18:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 46, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MUC'; -- 1393 km
INSERT INTO route_departures (route_id, departure_time) VALUES (46, '11:45'), (46, '16:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 47, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'OSD'; -- 585 km
INSERT INTO route_departures (route_id, departure_time) VALUES (47, '07:25'), (47, '17:40'), (47, '21:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 48, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'OSL'; -- 325 km
INSERT INTO route_departures (route_id, departure_time) VALUES (48, '08:45'), (48, '14:30'), (48, '18:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 49, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'ARN'; -- 8295 km
INSERT INTO route_departures (route_id, departure_time) VALUES (49, '07:25'), (49, '16:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 50, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'AAL'; -- 536 km
INSERT INTO route_departures (route_id, departure_time) VALUES (50, '06:20'), (50, '14:40'), (50, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 51, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'VBY'; -- 189 km
INSERT INTO route_departures (route_id, departure_time) VALUES (51, '11:15'), (51, '18:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 52, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'AMS'; -- 158 km
INSERT INTO route_departures (route_id, departure_time) VALUES (52, '09:10'), (52, '14:00'), (52, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 53, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MUC'; -- 598 km
INSERT INTO route_departures (route_id, departure_time) VALUES (53, '10:50'), (53, '16:40'), (53, '20:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 54, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'ZRH'; -- 483 km
INSERT INTO route_departures (route_id, departure_time) VALUES (54, '14:30'), (54, '17:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 55, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'ARN'; -- 1539 km
INSERT INTO route_departures (route_id, departure_time) VALUES (55, '14:35'), (55, '17:55'), (55, '21:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 56, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BER'; -- 856 km
INSERT INTO route_departures (route_id, departure_time) VALUES (56, '15:50'), (56, '19:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 57, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'LHR'; -- 347 km
INSERT INTO route_departures (route_id, departure_time) VALUES (57, '10:55'), (57, '19:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 58, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MAD'; -- 1063 km
INSERT INTO route_departures (route_id, departure_time) VALUES (58, '12:25'), (58, '15:35'), (58, '19:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 59, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'AAL'; -- 238 km
INSERT INTO route_departures (route_id, departure_time) VALUES (59, '08:20'), (59, '16:45'), (59, '20:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 60, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'ARN'; -- 547 km
INSERT INTO route_departures (route_id, departure_time) VALUES (60, '10:15'), (60, '15:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 61, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BER'; -- 366 km
INSERT INTO route_departures (route_id, departure_time) VALUES (61, '08:50'), (61, '14:25'), (61, '17:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 62, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'DXB'; -- 4819 km
INSERT INTO route_departures (route_id, departure_time) VALUES (62, '07:05'), (62, '13:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 63, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'WAW'; -- 666 km
INSERT INTO route_departures (route_id, departure_time) VALUES (63, '06:40'), (63, '12:30'), (63, '16:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 64, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'LHR'; -- 449 km
INSERT INTO route_departures (route_id, departure_time) VALUES (64, '07:30'), (64, '11:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 65, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'OSD'; -- 1614 km
INSERT INTO route_departures (route_id, departure_time) VALUES (65, '07:15'), (65, '15:45'), (65, '19:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 66, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'CPH'; -- 4819 km
INSERT INTO route_departures (route_id, departure_time) VALUES (66, '07:30'), (66, '11:20'), (66, '19:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 67, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'IST'; -- 3028 km
INSERT INTO route_departures (route_id, departure_time) VALUES (67, '09:40'), (67, '13:25'), (67, '17:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 68, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'FRA'; -- 1033 km
INSERT INTO route_departures (route_id, departure_time) VALUES (68, '07:40'), (68, '13:35'), (68, '18:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 69, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'LHR'; -- 534 km
INSERT INTO route_departures (route_id, departure_time) VALUES (69, '07:45'), (69, '11:15'), (69, '20:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 70, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'OSD'; -- 1281 km
INSERT INTO route_departures (route_id, departure_time) VALUES (70, '09:30'), (70, '21:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 71, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'ARN'; -- 6308 km
INSERT INTO route_departures (route_id, departure_time) VALUES (71, '11:15'), (71, '16:05'), (71, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 72, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'LHR'; -- 5563 km
INSERT INTO route_departures (route_id, departure_time) VALUES (72, '11:50'), (72, '17:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 73, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'ARN'; -- 2023 km
INSERT INTO route_departures (route_id, departure_time) VALUES (73, '13:50'), (73, '18:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 74, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'ARN'; -- 1223 km
INSERT INTO route_departures (route_id, departure_time) VALUES (74, '07:15'), (74, '18:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 75, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'EDI'; -- 1033 km
INSERT INTO route_departures (route_id, departure_time) VALUES (75, '13:40'), (75, '19:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 76, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'KRN'; -- 2082 km
INSERT INTO route_departures (route_id, departure_time) VALUES (76, '08:40'), (76, '14:35'), (76, '18:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 77, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'LIS'; -- 1874 km
INSERT INTO route_departures (route_id, departure_time) VALUES (77, '08:05'), (77, '16:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 78, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'AMS'; -- 765 km
INSERT INTO route_departures (route_id, departure_time) VALUES (78, '09:10'), (78, '14:35'), (78, '20:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 79, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'ARN'; -- 393 km
INSERT INTO route_departures (route_id, departure_time) VALUES (79, '06:45'), (79, '17:35'), (79, '20:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 80, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BER'; -- 594 km
INSERT INTO route_departures (route_id, departure_time) VALUES (80, '06:40'), (80, '10:25'), (80, '17:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 81, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'IST'; -- 2165 km
INSERT INTO route_departures (route_id, departure_time) VALUES (81, '09:50'), (81, '13:05'), (81, '19:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 82, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'LHR'; -- 1069 km
INSERT INTO route_departures (route_id, departure_time) VALUES (82, '08:55'), (82, '16:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 83, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'LIS'; -- 2609 km
INSERT INTO route_departures (route_id, departure_time) VALUES (83, '07:20'), (83, '13:20'), (83, '21:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 84, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'PRG'; -- 851 km
INSERT INTO route_departures (route_id, departure_time) VALUES (84, '08:25'), (84, '15:35'), (84, '21:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 85, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'ARN'; -- 398 km
INSERT INTO route_departures (route_id, departure_time) VALUES (85, '06:30'), (85, '11:20'), (85, '17:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 86, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BER'; -- 1128 km
INSERT INTO route_departures (route_id, departure_time) VALUES (86, '06:35'), (86, '11:35'), (86, '16:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 87, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'KRN'; -- 863 km
INSERT INTO route_departures (route_id, departure_time) VALUES (87, '16:15'), (87, '20:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 88, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'OSL'; -- 763 km
INSERT INTO route_departures (route_id, departure_time) VALUES (88, '06:50'), (88, '11:45'), (88, '15:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 89, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'RIX'; -- 382 km
INSERT INTO route_departures (route_id, departure_time) VALUES (89, '10:20'), (89, '15:35'), (89, '20:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 90, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'ATH'; -- 552 km
INSERT INTO route_departures (route_id, departure_time) VALUES (90, '06:40'), (90, '13:10'), (90, '17:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 91, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'DXB'; -- 3028 km
INSERT INTO route_departures (route_id, departure_time) VALUES (91, '17:05'), (91, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 92, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'GOT'; -- 2165 km
INSERT INTO route_departures (route_id, departure_time) VALUES (92, '06:05'), (92, '13:25'), (92, '20:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 93, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'RIX'; -- 1775 km
INSERT INTO route_departures (route_id, departure_time) VALUES (93, '14:00'), (93, '19:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 94, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'UME'; -- 2565 km
INSERT INTO route_departures (route_id, departure_time) VALUES (94, '08:25'), (94, '13:35'), (94, '21:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 95, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'ARN'; -- 6292 km
INSERT INTO route_departures (route_id, departure_time) VALUES (95, '11:05'), (95, '16:35'), (95, '20:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 96, f.id, t.id, 330 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'LAX'; -- 3974 km
INSERT INTO route_departures (route_id, departure_time) VALUES (96, '06:45'), (96, '09:50'), (96, '17:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 97, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'LLA'; -- 6216 km
INSERT INTO route_departures (route_id, departure_time) VALUES (97, '09:40'), (97, '15:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 98, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MIA'; -- 1757 km
INSERT INTO route_departures (route_id, departure_time) VALUES (98, '15:50'), (98, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 99, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'ORD'; -- 1187 km
INSERT INTO route_departures (route_id, departure_time) VALUES (99, '06:10'), (99, '18:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 100, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'OSL'; -- 5917 km
INSERT INTO route_departures (route_id, departure_time) VALUES (100, '09:55'), (100, '15:10'), (100, '19:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 101, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'YYZ'; -- 589 km
INSERT INTO route_departures (route_id, departure_time) VALUES (101, '08:40'), (101, '13:15'), (101, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 102, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'OSL'; -- 1782 km
INSERT INTO route_departures (route_id, departure_time) VALUES (102, '07:05'), (102, '12:45'), (102, '16:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 103, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'AAL'; -- 1305 km
INSERT INTO route_departures (route_id, departure_time) VALUES (103, '12:05'), (103, '15:10'), (103, '19:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 104, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'FRA'; -- 2082 km
INSERT INTO route_departures (route_id, departure_time) VALUES (104, '08:45'), (104, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 105, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'HEL'; -- 863 km
INSERT INTO route_departures (route_id, departure_time) VALUES (105, '06:00'), (105, '17:00'), (105, '20:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 106, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'LHR'; -- 2137 km
INSERT INTO route_departures (route_id, departure_time) VALUES (106, '06:30'), (106, '14:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 107, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'LLA'; -- 265 km
INSERT INTO route_departures (route_id, departure_time) VALUES (107, '06:00'), (107, '17:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 108, f.id, t.id, 330 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'JFK'; -- 3974 km
INSERT INTO route_departures (route_id, departure_time) VALUES (108, '11:20'), (108, '18:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 109, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'ARN'; -- 1462 km
INSERT INTO route_departures (route_id, departure_time) VALUES (109, '06:45'), (109, '17:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 110, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'CDG'; -- 347 km
INSERT INTO route_departures (route_id, departure_time) VALUES (110, '09:00'), (110, '15:10'), (110, '19:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 111, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'DUB'; -- 449 km
INSERT INTO route_departures (route_id, departure_time) VALUES (111, '10:20'), (111, '17:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 112, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'EDI'; -- 534 km
INSERT INTO route_departures (route_id, departure_time) VALUES (112, '12:40'), (112, '16:20'), (112, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 113, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'EWR'; -- 5563 km
INSERT INTO route_departures (route_id, departure_time) VALUES (113, '11:20'), (113, '16:45'), (113, '19:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 114, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'GOT'; -- 1069 km
INSERT INTO route_departures (route_id, departure_time) VALUES (114, '09:35'), (114, '13:55'), (114, '20:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 115, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'KRN'; -- 2137 km
INSERT INTO route_departures (route_id, departure_time) VALUES (115, '10:55'), (115, '21:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 116, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MAN'; -- 243 km
INSERT INTO route_departures (route_id, departure_time) VALUES (116, '06:15'), (116, '16:05'), (116, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 117, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'FRA'; -- 1874 km
INSERT INTO route_departures (route_id, departure_time) VALUES (117, '09:50'), (117, '13:55'), (117, '21:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 118, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'GOT'; -- 2609 km
INSERT INTO route_departures (route_id, departure_time) VALUES (118, '09:20'), (118, '20:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 119, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MAD'; -- 513 km
INSERT INTO route_departures (route_id, departure_time) VALUES (119, '10:55'), (119, '13:55'), (119, '20:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 120, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MMX'; -- 2502 km
INSERT INTO route_departures (route_id, departure_time) VALUES (120, '08:40'), (120, '14:25'), (120, '19:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 121, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'AMS'; -- 1764 km
INSERT INTO route_departures (route_id, departure_time) VALUES (121, '11:55'), (121, '17:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 122, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'ARN'; -- 689 km
INSERT INTO route_departures (route_id, departure_time) VALUES (122, '06:15'), (122, '16:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 123, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'JFK'; -- 6216 km
INSERT INTO route_departures (route_id, departure_time) VALUES (123, '06:40'), (123, '13:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 124, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'KRN'; -- 265 km
INSERT INTO route_departures (route_id, departure_time) VALUES (124, '08:05'), (124, '11:15'), (124, '17:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 125, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'OSL'; -- 814 km
INSERT INTO route_departures (route_id, departure_time) VALUES (125, '15:35'), (125, '18:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 126, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'PMI'; -- 3143 km
INSERT INTO route_departures (route_id, departure_time) VALUES (126, '09:05'), (126, '19:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 127, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'VIE'; -- 1966 km
INSERT INTO route_departures (route_id, departure_time) VALUES (127, '08:40'), (127, '13:15'), (127, '20:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 128, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'ZRH'; -- 2165 km
INSERT INTO route_departures (route_id, departure_time) VALUES (128, '12:15'), (128, '15:30'), (128, '20:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 129, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'AMS'; -- 3183 km
INSERT INTO route_departures (route_id, departure_time) VALUES (129, '08:30'), (129, '20:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 130, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MAD'; -- 1766 km
INSERT INTO route_departures (route_id, departure_time) VALUES (130, '08:40'), (130, '14:15'), (130, '19:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 131, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'AGP'; -- 432 km
INSERT INTO route_departures (route_id, departure_time) VALUES (131, '07:20'), (131, '15:15'), (131, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 132, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'CDG'; -- 1063 km
INSERT INTO route_departures (route_id, departure_time) VALUES (132, '12:00'), (132, '20:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 133, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'LIS'; -- 513 km
INSERT INTO route_departures (route_id, departure_time) VALUES (133, '11:00'), (133, '14:20'), (133, '19:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 134, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'LPA'; -- 1766 km
INSERT INTO route_departures (route_id, departure_time) VALUES (134, '09:40'), (134, '15:10'), (134, '21:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 135, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'MMX'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time) VALUES (135, '06:35'), (135, '12:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 136, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'OSD'; -- 2790 km
INSERT INTO route_departures (route_id, departure_time) VALUES (136, '06:45'), (136, '11:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 137, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'PMI'; -- 547 km
INSERT INTO route_departures (route_id, departure_time) VALUES (137, '14:10'), (137, '17:15'), (137, '21:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 138, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'LHR'; -- 243 km
INSERT INTO route_departures (route_id, departure_time) VALUES (138, '11:25'), (138, '17:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 139, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'JFK'; -- 1757 km
INSERT INTO route_departures (route_id, departure_time) VALUES (139, '10:05'), (139, '15:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 140, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'ARN'; -- 531 km
INSERT INTO route_departures (route_id, departure_time) VALUES (140, '11:50'), (140, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 141, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'LIS'; -- 2502 km
INSERT INTO route_departures (route_id, departure_time) VALUES (141, '06:40'), (141, '20:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 142, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'MAD'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time) VALUES (142, '07:00'), (142, '14:55'), (142, '19:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 143, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'TLL'; -- 807 km
INSERT INTO route_departures (route_id, departure_time) VALUES (143, '09:25'), (143, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 144, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'TRD'; -- 891 km
INSERT INTO route_departures (route_id, departure_time) VALUES (144, '06:15'), (144, '13:00'), (144, '20:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 145, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'ARN'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time) VALUES (145, '09:30'), (145, '16:40'), (145, '21:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 146, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BGO'; -- 1393 km
INSERT INTO route_departures (route_id, departure_time) VALUES (146, '09:45'), (146, '13:55'), (146, '19:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 147, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BRU'; -- 598 km
INSERT INTO route_departures (route_id, departure_time) VALUES (147, '06:00'), (147, '09:15'), (147, '19:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 148, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'MXP'; -- 382 km
INSERT INTO route_departures (route_id, departure_time) VALUES (148, '06:10'), (148, '09:30'), (148, '20:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 149, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'NCE'; -- 629 km
INSERT INTO route_departures (route_id, departure_time) VALUES (149, '07:20'), (149, '11:45'), (149, '16:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 150, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'PRG'; -- 265 km
INSERT INTO route_departures (route_id, departure_time) VALUES (150, '10:15'), (150, '20:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 151, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'TRD'; -- 1681 km
INSERT INTO route_departures (route_id, departure_time) VALUES (151, '09:10'), (151, '14:40'), (151, '18:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 152, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'VIE'; -- 355 km
INSERT INTO route_departures (route_id, departure_time) VALUES (152, '11:15'), (152, '20:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 153, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'ZRH'; -- 261 km
INSERT INTO route_departures (route_id, departure_time) VALUES (153, '08:15'), (153, '11:35'), (153, '20:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 154, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'MUC'; -- 382 km
INSERT INTO route_departures (route_id, departure_time) VALUES (154, '07:00'), (154, '15:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 155, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'NCE'; -- 249 km
INSERT INTO route_departures (route_id, departure_time) VALUES (155, '06:55'), (155, '15:20'), (155, '19:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 156, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'OSD'; -- 1986 km
INSERT INTO route_departures (route_id, departure_time) VALUES (156, '09:25'), (156, '12:30'), (156, '15:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 157, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MUC'; -- 629 km
INSERT INTO route_departures (route_id, departure_time) VALUES (157, '07:35'), (157, '20:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 158, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MXP'; -- 249 km
INSERT INTO route_departures (route_id, departure_time) VALUES (158, '09:35'), (158, '15:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 159, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'JFK'; -- 1187 km
INSERT INTO route_departures (route_id, departure_time) VALUES (159, '07:15'), (159, '11:25'), (159, '14:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 160, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'ARN'; -- 433 km
INSERT INTO route_departures (route_id, departure_time) VALUES (160, '08:15'), (160, '16:05'), (160, '19:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 161, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BGO'; -- 585 km
INSERT INTO route_departures (route_id, departure_time) VALUES (161, '12:10'), (161, '16:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 162, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'DUB'; -- 1614 km
INSERT INTO route_departures (route_id, departure_time) VALUES (162, '12:40'), (162, '21:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 163, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'EDI'; -- 1281 km
INSERT INTO route_departures (route_id, departure_time) VALUES (163, '07:30'), (163, '13:40'), (163, '20:05');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 164, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MAD'; -- 2790 km
INSERT INTO route_departures (route_id, departure_time) VALUES (164, '10:10'), (164, '13:40'), (164, '18:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 165, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MXP'; -- 1986 km
INSERT INTO route_departures (route_id, departure_time) VALUES (165, '11:30'), (165, '17:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 166, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'OSL'; -- 379 km
INSERT INTO route_departures (route_id, departure_time) VALUES (166, '06:55'), (166, '17:30'), (166, '20:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 167, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'ARN'; -- 385 km
INSERT INTO route_departures (route_id, departure_time) VALUES (167, '06:25'), (167, '10:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 168, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BGO'; -- 325 km
INSERT INTO route_departures (route_id, departure_time) VALUES (168, '08:25'), (168, '14:30'), (168, '18:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 169, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'HEL'; -- 763 km
INSERT INTO route_departures (route_id, departure_time) VALUES (169, '11:10'), (169, '16:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 170, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'JFK'; -- 5917 km
INSERT INTO route_departures (route_id, departure_time) VALUES (170, '10:40'), (170, '18:10'), (170, '21:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 171, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'KEF'; -- 1782 km
INSERT INTO route_departures (route_id, departure_time) VALUES (171, '12:20'), (171, '16:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 172, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'LLA'; -- 814 km
INSERT INTO route_departures (route_id, departure_time) VALUES (172, '08:55'), (172, '16:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 173, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'OSD'; -- 379 km
INSERT INTO route_departures (route_id, departure_time) VALUES (173, '09:55'), (173, '14:40'), (173, '21:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 174, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'TRD'; -- 364 km
INSERT INTO route_departures (route_id, departure_time) VALUES (174, '06:15'), (174, '15:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 175, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'YYZ'; -- 5950 km
INSERT INTO route_departures (route_id, departure_time) VALUES (175, '08:35'), (175, '17:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 176, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'LLA'; -- 3143 km
INSERT INTO route_departures (route_id, departure_time) VALUES (176, '08:40'), (176, '11:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 177, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MAD'; -- 547 km
INSERT INTO route_departures (route_id, departure_time) VALUES (177, '10:05'), (177, '13:30'), (177, '17:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 178, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'AMS'; -- 705 km
INSERT INTO route_departures (route_id, departure_time) VALUES (178, '06:50'), (178, '11:40'), (178, '17:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 179, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'GOT'; -- 851 km
INSERT INTO route_departures (route_id, departure_time) VALUES (179, '09:55'), (179, '13:35'), (179, '19:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 180, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MUC'; -- 265 km
INSERT INTO route_departures (route_id, departure_time) VALUES (180, '10:15'), (180, '15:50'), (180, '19:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 181, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'HEL'; -- 382 km
INSERT INTO route_departures (route_id, departure_time) VALUES (181, '12:20'), (181, '15:45'), (181, '20:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 182, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'IST'; -- 1775 km
INSERT INTO route_departures (route_id, departure_time) VALUES (182, '07:20'), (182, '12:05'), (182, '18:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 183, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'ARN'; -- 390 km
INSERT INTO route_departures (route_id, departure_time) VALUES (183, '06:40'), (183, '12:20'), (183, '19:25');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 184, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MMX'; -- 807 km
INSERT INTO route_departures (route_id, departure_time) VALUES (184, '14:50'), (184, '21:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 185, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MMX'; -- 891 km
INSERT INTO route_departures (route_id, departure_time) VALUES (185, '09:00'), (185, '16:15'), (185, '19:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 186, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MUC'; -- 1681 km
INSERT INTO route_departures (route_id, departure_time) VALUES (186, '10:40'), (186, '19:55');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 187, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'OSL'; -- 364 km
INSERT INTO route_departures (route_id, departure_time) VALUES (187, '08:40'), (187, '12:00'), (187, '16:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 188, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'ARN'; -- 477 km
INSERT INTO route_departures (route_id, departure_time) VALUES (188, '09:20'), (188, '13:10'), (188, '16:15');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 189, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'IST'; -- 2565 km
INSERT INTO route_departures (route_id, departure_time) VALUES (189, '08:05'), (189, '15:35'), (189, '18:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 190, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BMA'; -- 189 km
INSERT INTO route_departures (route_id, departure_time) VALUES (190, '08:40'), (190, '19:35');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 191, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'LLA'; -- 1966 km
INSERT INTO route_departures (route_id, departure_time) VALUES (191, '14:15'), (191, '17:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 192, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MUC'; -- 355 km
INSERT INTO route_departures (route_id, departure_time) VALUES (192, '06:25'), (192, '13:45');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 193, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'CPH'; -- 666 km
INSERT INTO route_departures (route_id, departure_time) VALUES (193, '13:25'), (193, '18:20');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 194, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'ARN'; -- 6313 km
INSERT INTO route_departures (route_id, departure_time) VALUES (194, '15:35'), (194, '19:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 195, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'JFK'; -- 589 km
INSERT INTO route_departures (route_id, departure_time) VALUES (195, '08:35'), (195, '14:05'), (195, '18:50');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 196, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'OSL'; -- 5950 km
INSERT INTO route_departures (route_id, departure_time) VALUES (196, '10:10'), (196, '18:30');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 197, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'ARN'; -- 1487 km
INSERT INTO route_departures (route_id, departure_time) VALUES (197, '08:00'), (197, '15:40');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 198, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BRU'; -- 483 km
INSERT INTO route_departures (route_id, departure_time) VALUES (198, '13:40'), (198, '17:25'), (198, '21:00');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 199, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'LLA'; -- 2165 km
INSERT INTO route_departures (route_id, departure_time) VALUES (199, '11:35'), (199, '16:55'), (199, '20:10');
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 200, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MUC'; -- 261 km
INSERT INTO route_departures (route_id, departure_time) VALUES (200, '06:55'), (200, '13:50');
