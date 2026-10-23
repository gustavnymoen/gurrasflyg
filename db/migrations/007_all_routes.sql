-- GENERERAD av scripts/generate-all-routes.mjs, ändra inte för hand.
-- Rutter mellan alla par av flygplatser, minst 5 avgångar om dagen och ett pris per avgång (TRIP-010).

-- Rutterna har inget plan längre; resenären väljer plan (TRIP-011)
ALTER TABLE routes DROP COLUMN aircraft_id;

-- Pris per person i hela kronor, samma varje dag
ALTER TABLE route_departures ADD COLUMN price INTEGER CHECK (price BETWEEN 150 AND 1000000);

-- Staden flygplatsen ligger i
ALTER TABLE airports ADD COLUMN city TEXT;
UPDATE airports SET city = 'Stockholm' WHERE iata = 'ARN';
UPDATE airports SET city = 'Stockholm' WHERE iata = 'BMA';
UPDATE airports SET city = 'Göteborg' WHERE iata = 'GOT';
UPDATE airports SET city = 'Malmö' WHERE iata = 'MMX';
UPDATE airports SET city = 'Luleå' WHERE iata = 'LLA';
UPDATE airports SET city = 'Visby' WHERE iata = 'VBY';
UPDATE airports SET city = 'Umeå' WHERE iata = 'UME';
UPDATE airports SET city = 'Östersund' WHERE iata = 'OSD';
UPDATE airports SET city = 'Kiruna' WHERE iata = 'KRN';
UPDATE airports SET city = 'Oslo' WHERE iata = 'OSL';
UPDATE airports SET city = 'Bergen' WHERE iata = 'BGO';
UPDATE airports SET city = 'Trondheim' WHERE iata = 'TRD';
UPDATE airports SET city = 'Köpenhamn' WHERE iata = 'CPH';
UPDATE airports SET city = 'Aalborg' WHERE iata = 'AAL';
UPDATE airports SET city = 'Helsingfors' WHERE iata = 'HEL';
UPDATE airports SET city = 'Reykjavik' WHERE iata = 'KEF';
UPDATE airports SET city = 'Tallinn' WHERE iata = 'TLL';
UPDATE airports SET city = 'Riga' WHERE iata = 'RIX';
UPDATE airports SET city = 'London' WHERE iata = 'LHR';
UPDATE airports SET city = 'Manchester' WHERE iata = 'MAN';
UPDATE airports SET city = 'Edinburgh' WHERE iata = 'EDI';
UPDATE airports SET city = 'Dublin' WHERE iata = 'DUB';
UPDATE airports SET city = 'Paris' WHERE iata = 'CDG';
UPDATE airports SET city = 'Nice' WHERE iata = 'NCE';
UPDATE airports SET city = 'Amsterdam' WHERE iata = 'AMS';
UPDATE airports SET city = 'Bryssel' WHERE iata = 'BRU';
UPDATE airports SET city = 'Frankfurt' WHERE iata = 'FRA';
UPDATE airports SET city = 'München' WHERE iata = 'MUC';
UPDATE airports SET city = 'Berlin' WHERE iata = 'BER';
UPDATE airports SET city = 'Zürich' WHERE iata = 'ZRH';
UPDATE airports SET city = 'Wien' WHERE iata = 'VIE';
UPDATE airports SET city = 'Prag' WHERE iata = 'PRG';
UPDATE airports SET city = 'Warszawa' WHERE iata = 'WAW';
UPDATE airports SET city = 'Barcelona' WHERE iata = 'BCN';
UPDATE airports SET city = 'Madrid' WHERE iata = 'MAD';
UPDATE airports SET city = 'Málaga' WHERE iata = 'AGP';
UPDATE airports SET city = 'Palma' WHERE iata = 'PMI';
UPDATE airports SET city = 'Las Palmas' WHERE iata = 'LPA';
UPDATE airports SET city = 'Lissabon' WHERE iata = 'LIS';
UPDATE airports SET city = 'Rom' WHERE iata = 'FCO';
UPDATE airports SET city = 'Milano' WHERE iata = 'MXP';
UPDATE airports SET city = 'Aten' WHERE iata = 'ATH';
UPDATE airports SET city = 'Istanbul' WHERE iata = 'IST';
UPDATE airports SET city = 'Dubai' WHERE iata = 'DXB';
UPDATE airports SET city = 'Bangkok' WHERE iata = 'BKK';
UPDATE airports SET city = 'New York' WHERE iata = 'JFK';
UPDATE airports SET city = 'Newark' WHERE iata = 'EWR';
UPDATE airports SET city = 'Chicago' WHERE iata = 'ORD';
UPDATE airports SET city = 'Miami' WHERE iata = 'MIA';
UPDATE airports SET city = 'Los Angeles' WHERE iata = 'LAX';
UPDATE airports SET city = 'Toronto' WHERE iata = 'YYZ';

-- Befintliga rutter: pris på avgångarna, och fler avgångar upp till 5
UPDATE route_departures SET price = CASE departure_time WHEN '07:20' THEN 1330 WHEN '16:35' THEN 2430 WHEN '20:25' THEN 87670 END WHERE route_id = 1;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1, '11:00', 20260), (1, '13:10', 38250);
UPDATE route_departures SET price = CASE departure_time WHEN '08:05' THEN 3470 WHEN '12:40' THEN 70170 WHEN '20:40' THEN 1260 END WHERE route_id = 2;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2, '07:05', 3370), (2, '15:50', 4250);
UPDATE route_departures SET price = CASE departure_time WHEN '06:10' THEN 4170 WHEN '11:35' THEN 2940 END WHERE route_id = 3;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (3, '08:10', 939000), (3, '13:35', 2600), (3, '18:20', 3420);
UPDATE route_departures SET price = CASE departure_time WHEN '15:30' THEN 119640 WHEN '20:00' THEN 2210 END WHERE route_id = 4;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (4, '08:05', 79000), (4, '11:20', 4670), (4, '18:30', 1760);
UPDATE route_departures SET price = CASE departure_time WHEN '17:10' THEN 4170 WHEN '20:30' THEN 1060 END WHERE route_id = 5;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (5, '12:30', 620), (5, '15:00', 2040), (5, '16:00', 2930);
UPDATE route_departures SET price = CASE departure_time WHEN '08:45' THEN 3540 WHEN '17:00' THEN 2350 END WHERE route_id = 6;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (6, '10:05', 190420), (6, '14:20', 490), (6, '16:00', 620);
UPDATE route_departures SET price = CASE departure_time WHEN '07:50' THEN 3640 WHEN '14:45' THEN 440 WHEN '18:45' THEN 790 END WHERE route_id = 7;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (7, '11:40', 3370), (7, '19:45', 3190);
UPDATE route_departures SET price = CASE departure_time WHEN '12:45' THEN 340 WHEN '17:20' THEN 900 WHEN '21:25' THEN 909280 END WHERE route_id = 8;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (8, '10:00', 2280), (8, '13:45', 4230);
UPDATE route_departures SET price = CASE departure_time WHEN '07:30' THEN 1280 WHEN '12:40' THEN 2880 WHEN '16:50' THEN 345930 END WHERE route_id = 9;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (9, '14:20', 670), (9, '20:00', 94760);
UPDATE route_departures SET price = CASE departure_time WHEN '07:25' THEN 200 WHEN '18:10' THEN 4780 END WHERE route_id = 10;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (10, '15:20', 2200), (10, '16:35', 630), (10, '20:35', 692390);
UPDATE route_departures SET price = CASE departure_time WHEN '08:00' THEN 736870 WHEN '18:45' THEN 2110 END WHERE route_id = 11;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (11, '10:10', 2260), (11, '12:20', 3500), (11, '20:40', 3590);
UPDATE route_departures SET price = CASE departure_time WHEN '08:45' THEN 3770 WHEN '12:25' THEN 16000 WHEN '17:00' THEN 3790 END WHERE route_id = 12;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (12, '10:30', 3570), (12, '19:50', 2170);
UPDATE route_departures SET price = CASE departure_time WHEN '11:10' THEN 95540 WHEN '16:10' THEN 222090 END WHERE route_id = 13;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (13, '06:25', 2250), (13, '09:05', 4920), (13, '14:10', 4160);
UPDATE route_departures SET price = CASE departure_time WHEN '15:45' THEN 250 WHEN '19:45' THEN 316830 END WHERE route_id = 14;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (14, '07:10', 3980), (14, '11:25', 4050), (14, '13:45', 1170);
UPDATE route_departures SET price = CASE departure_time WHEN '12:05' THEN 1880 WHEN '18:20' THEN 180 END WHERE route_id = 15;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (15, '07:00', 636890), (15, '08:30', 86650), (15, '10:05', 2240);
UPDATE route_departures SET price = CASE departure_time WHEN '11:45' THEN 3610 WHEN '19:25' THEN 3700 END WHERE route_id = 16;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (16, '07:35', 2620), (16, '16:35', 220), (16, '18:25', 13640);
UPDATE route_departures SET price = CASE departure_time WHEN '09:15' THEN 82940 WHEN '17:25' THEN 2250 END WHERE route_id = 17;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (17, '12:45', 4000), (17, '14:30', 3640), (17, '18:50', 3000);
UPDATE route_departures SET price = CASE departure_time WHEN '08:50' THEN 2250 WHEN '13:35' THEN 2450 WHEN '16:55' THEN 386580 END WHERE route_id = 18;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (18, '11:35', 4690), (18, '18:10', 4260);
UPDATE route_departures SET price = CASE departure_time WHEN '06:25' THEN 590 WHEN '10:30' THEN 4650 WHEN '21:25' THEN 2890 END WHERE route_id = 19;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (19, '12:05', 3360), (19, '19:45', 980);
UPDATE route_departures SET price = CASE departure_time WHEN '08:30' THEN 886090 WHEN '14:40' THEN 260 WHEN '21:20' THEN 3570 END WHERE route_id = 20;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (20, '09:45', 460), (20, '13:35', 2880);
UPDATE route_departures SET price = CASE departure_time WHEN '12:05' THEN 4520 WHEN '16:40' THEN 3550 END WHERE route_id = 21;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (21, '07:35', 2190), (21, '09:35', 72280), (21, '18:20', 1220);
UPDATE route_departures SET price = CASE departure_time WHEN '11:10' THEN 610 WHEN '19:55' THEN 2360 END WHERE route_id = 22;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (22, '08:20', 2860), (22, '09:30', 3810), (22, '14:20', 205170);
UPDATE route_departures SET price = CASE departure_time WHEN '09:40' THEN 1520 WHEN '13:40' THEN 201660 END WHERE route_id = 23;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (23, '12:00', 4220), (23, '15:05', 1780), (23, '20:30', 51490);
UPDATE route_departures SET price = CASE departure_time WHEN '10:35' THEN 50520 WHEN '16:25' THEN 4030 END WHERE route_id = 24;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (24, '06:55', 449230), (24, '14:00', 1240), (24, '18:50', 4700);
UPDATE route_departures SET price = CASE departure_time WHEN '08:35' THEN 3260 WHEN '16:45' THEN 901800 END WHERE route_id = 25;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (25, '12:05', 4570), (25, '13:35', 3410), (25, '20:50', 811280);
UPDATE route_departures SET price = CASE departure_time WHEN '07:55' THEN 3830 WHEN '14:55' THEN 4820 END WHERE route_id = 26;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (26, '13:15', 41230), (26, '16:25', 4320), (26, '19:30', 1680);
UPDATE route_departures SET price = CASE departure_time WHEN '13:30' THEN 3740 WHEN '17:05' THEN 22130 END WHERE route_id = 27;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (27, '08:15', 3820), (27, '12:00', 4000), (27, '20:50', 380);
UPDATE route_departures SET price = CASE departure_time WHEN '08:20' THEN 3890 WHEN '12:50' THEN 693190 WHEN '18:35' THEN 3320 END WHERE route_id = 28;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (28, '15:30', 4180), (28, '19:45', 4320);
UPDATE route_departures SET price = CASE departure_time WHEN '08:15' THEN 1740 WHEN '14:10' THEN 540 WHEN '19:05' THEN 1930 END WHERE route_id = 29;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (29, '11:05', 689430), (29, '12:05', 620);
UPDATE route_departures SET price = CASE departure_time WHEN '09:10' THEN 3990 WHEN '14:30' THEN 3960 WHEN '18:35' THEN 1250 END WHERE route_id = 30;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (30, '07:20', 1600), (30, '11:45', 1060);
UPDATE route_departures SET price = CASE departure_time WHEN '06:50' THEN 760 WHEN '13:40' THEN 933050 WHEN '19:20' THEN 2670 END WHERE route_id = 31;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (31, '08:15', 3360), (31, '15:30', 1920);
UPDATE route_departures SET price = CASE departure_time WHEN '08:35' THEN 580 WHEN '13:50' THEN 380 END WHERE route_id = 32;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (32, '11:30', 2270), (32, '17:00', 1030), (32, '20:00', 1290);
UPDATE route_departures SET price = CASE departure_time WHEN '11:25' THEN 4740 WHEN '17:50' THEN 2060 WHEN '21:25' THEN 2860 END WHERE route_id = 33;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (33, '15:00', 2670), (33, '18:50', 2450);
UPDATE route_departures SET price = CASE departure_time WHEN '16:35' THEN 1690 WHEN '19:40' THEN 3660 END WHERE route_id = 34;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (34, '08:05', 3780), (34, '12:40', 3710), (34, '14:55', 18050);
UPDATE route_departures SET price = CASE departure_time WHEN '15:45' THEN 2030 WHEN '20:35' THEN 1420 END WHERE route_id = 35;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (35, '12:35', 3050), (35, '13:40', 4880), (35, '19:15', 2370);
UPDATE route_departures SET price = CASE departure_time WHEN '08:20' THEN 2700 WHEN '19:05' THEN 1340 END WHERE route_id = 36;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (36, '06:35', 452920), (36, '14:00', 4240), (36, '15:30', 420);
UPDATE route_departures SET price = CASE departure_time WHEN '06:15' THEN 4800 WHEN '16:05' THEN 2870 END WHERE route_id = 37;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (37, '08:20', 2090), (37, '11:50', 4880), (37, '17:10', 750);
UPDATE route_departures SET price = CASE departure_time WHEN '13:15' THEN 1310 WHEN '17:00' THEN 3900 WHEN '20:50' THEN 460 END WHERE route_id = 38;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (38, '09:45', 34610), (38, '14:50', 3060);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 1060 WHEN '10:15' THEN 900 END WHERE route_id = 39;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (39, '09:15', 60150), (39, '14:50', 270), (39, '21:20', 400);
UPDATE route_departures SET price = CASE departure_time WHEN '12:50' THEN 4560 WHEN '17:05' THEN 1020 END WHERE route_id = 40;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (40, '07:10', 849230), (40, '10:45', 2080), (40, '19:10', 4240);
UPDATE route_departures SET price = CASE departure_time WHEN '09:00' THEN 3820 WHEN '14:00' THEN 3480 WHEN '18:10' THEN 2090 END WHERE route_id = 41;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (41, '12:40', 3300), (41, '15:25', 58010);
UPDATE route_departures SET price = CASE departure_time WHEN '08:15' THEN 2250 WHEN '13:15' THEN 1630 END WHERE route_id = 42;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (42, '06:45', 3460), (42, '12:00', 4790), (42, '17:15', 2550);
UPDATE route_departures SET price = CASE departure_time WHEN '06:00' THEN 607330 WHEN '10:10' THEN 2800 WHEN '14:15' THEN 1900 END WHERE route_id = 43;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (43, '18:45', 460), (43, '19:45', 2260);
UPDATE route_departures SET price = CASE departure_time WHEN '07:00' THEN 2930 WHEN '20:40' THEN 476350 END WHERE route_id = 44;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (44, '11:05', 1390), (44, '12:25', 580), (44, '16:55', 2070);
UPDATE route_departures SET price = CASE departure_time WHEN '07:30' THEN 2660 WHEN '12:40' THEN 340 WHEN '18:45' THEN 3710 END WHERE route_id = 45;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (45, '11:10', 4240), (45, '16:45', 3290);
UPDATE route_departures SET price = CASE departure_time WHEN '11:45' THEN 4320 WHEN '16:55' THEN 6750 END WHERE route_id = 46;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (46, '15:55', 2530), (46, '18:10', 3110), (46, '19:30', 3040);
UPDATE route_departures SET price = CASE departure_time WHEN '07:25' THEN 4530 WHEN '17:40' THEN 640 WHEN '21:00' THEN 2010 END WHERE route_id = 47;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (47, '10:15', 54460), (47, '13:15', 680);
UPDATE route_departures SET price = CASE departure_time WHEN '08:45' THEN 410 WHEN '14:30' THEN 1590 WHEN '18:20' THEN 91340 END WHERE route_id = 48;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (48, '06:05', 4890), (48, '20:05', 1620);
UPDATE route_departures SET price = CASE departure_time WHEN '07:25' THEN 4290 WHEN '16:25' THEN 395890 END WHERE route_id = 49;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (49, '09:20', 77490), (49, '11:10', 1200), (49, '19:35', 4070);
UPDATE route_departures SET price = CASE departure_time WHEN '06:20' THEN 4520 WHEN '14:40' THEN 4260 WHEN '21:10' THEN 1500 END WHERE route_id = 50;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (50, '07:20', 886560), (50, '09:05', 4840);
UPDATE route_departures SET price = CASE departure_time WHEN '11:15' THEN 3760 WHEN '18:55' THEN 3060 END WHERE route_id = 51;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (51, '09:00', 3980), (51, '16:40', 4510), (51, '20:55', 306190);
UPDATE route_departures SET price = CASE departure_time WHEN '09:10' THEN 454190 WHEN '14:00' THEN 4020 WHEN '20:40' THEN 260 END WHERE route_id = 52;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (52, '07:35', 31120), (52, '11:10', 3430);
UPDATE route_departures SET price = CASE departure_time WHEN '10:50' THEN 1360 WHEN '16:40' THEN 250 WHEN '20:30' THEN 2290 END WHERE route_id = 53;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (53, '12:35', 3400), (53, '21:30', 510);
UPDATE route_departures SET price = CASE departure_time WHEN '14:30' THEN 4000 WHEN '17:40' THEN 2770 END WHERE route_id = 54;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (54, '09:00', 3490), (54, '16:40', 2430), (54, '18:45', 1100);
UPDATE route_departures SET price = CASE departure_time WHEN '14:35' THEN 4590 WHEN '17:55' THEN 240 WHEN '21:00' THEN 27310 END WHERE route_id = 55;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (55, '11:30', 3750), (55, '19:10', 910);
UPDATE route_departures SET price = CASE departure_time WHEN '15:50' THEN 2660 WHEN '19:25' THEN 3640 END WHERE route_id = 56;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (56, '08:10', 1180), (56, '12:45', 3810), (56, '14:20', 1860);
UPDATE route_departures SET price = CASE departure_time WHEN '10:55' THEN 2780 WHEN '19:40' THEN 19120 END WHERE route_id = 57;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (57, '09:35', 1600), (57, '15:30', 4520), (57, '16:35', 2500);
UPDATE route_departures SET price = CASE departure_time WHEN '12:25' THEN 1480 WHEN '15:35' THEN 87460 WHEN '19:00' THEN 2740 END WHERE route_id = 58;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (58, '07:00', 2920), (58, '17:10', 4730);
UPDATE route_departures SET price = CASE departure_time WHEN '08:20' THEN 652100 WHEN '16:45' THEN 3910 WHEN '20:55' THEN 3120 END WHERE route_id = 59;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (59, '10:15', 200), (59, '11:45', 1610);
UPDATE route_departures SET price = CASE departure_time WHEN '10:15' THEN 1770 WHEN '15:45' THEN 2240 END WHERE route_id = 60;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (60, '08:40', 331690), (60, '14:10', 2820), (60, '17:40', 1930);
UPDATE route_departures SET price = CASE departure_time WHEN '08:50' THEN 24080 WHEN '14:25' THEN 2200 WHEN '17:30' THEN 870 END WHERE route_id = 61;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (61, '10:40', 5500), (61, '19:30', 911440);
UPDATE route_departures SET price = CASE departure_time WHEN '07:05' THEN 3500 WHEN '13:45' THEN 39510 END WHERE route_id = 62;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (62, '08:10', 4110), (62, '11:35', 2450), (62, '19:55', 3570);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 400 WHEN '12:30' THEN 2200 WHEN '16:30' THEN 520 END WHERE route_id = 63;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (63, '08:55', 3200), (63, '10:10', 2100);
UPDATE route_departures SET price = CASE departure_time WHEN '07:30' THEN 312960 WHEN '11:50' THEN 35920 END WHERE route_id = 64;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (64, '09:05', 2680), (64, '17:05', 29030), (64, '20:05', 1300);
UPDATE route_departures SET price = CASE departure_time WHEN '07:15' THEN 855200 WHEN '15:45' THEN 4360 WHEN '19:00' THEN 777360 END WHERE route_id = 65;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (65, '13:05', 3450), (65, '20:40', 143090);
UPDATE route_departures SET price = CASE departure_time WHEN '07:30' THEN 1920 WHEN '11:20' THEN 2580 WHEN '19:50' THEN 4180 END WHERE route_id = 66;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (66, '13:40', 4820), (66, '20:50', 1630);
UPDATE route_departures SET price = CASE departure_time WHEN '09:40' THEN 632760 WHEN '13:25' THEN 58520 WHEN '17:10' THEN 2200 END WHERE route_id = 67;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (67, '08:10', 4900), (67, '11:20', 1850);
UPDATE route_departures SET price = CASE departure_time WHEN '07:40' THEN 1230 WHEN '13:35' THEN 1120 WHEN '18:10' THEN 1180 END WHERE route_id = 68;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (68, '14:40', 909530), (68, '21:05', 1830);
UPDATE route_departures SET price = CASE departure_time WHEN '07:45' THEN 1230 WHEN '11:15' THEN 4650 WHEN '20:15' THEN 4910 END WHERE route_id = 69;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (69, '06:00', 870), (69, '16:00', 4080);
UPDATE route_departures SET price = CASE departure_time WHEN '09:30' THEN 2450 WHEN '21:25' THEN 1180 END WHERE route_id = 70;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (70, '06:50', 610), (70, '14:30', 2460), (70, '19:35', 1270);
UPDATE route_departures SET price = CASE departure_time WHEN '11:15' THEN 2440 WHEN '16:05' THEN 4450 WHEN '19:05' THEN 4230 END WHERE route_id = 71;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (71, '13:05', 2970), (71, '20:15', 2880);
UPDATE route_departures SET price = CASE departure_time WHEN '11:50' THEN 4590 WHEN '17:25' THEN 3540 END WHERE route_id = 72;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (72, '08:30', 3240), (72, '12:55', 80620), (72, '21:05', 740);
UPDATE route_departures SET price = CASE departure_time WHEN '13:50' THEN 2640 WHEN '18:10' THEN 970 END WHERE route_id = 73;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (73, '12:20', 2800), (73, '16:20', 470), (73, '19:15', 3000);
UPDATE route_departures SET price = CASE departure_time WHEN '07:15' THEN 2250 WHEN '18:00' THEN 456210 END WHERE route_id = 74;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (74, '10:05', 1890), (74, '14:40', 2040), (74, '20:20', 652570);
UPDATE route_departures SET price = CASE departure_time WHEN '13:40' THEN 23030 WHEN '19:30' THEN 3050 END WHERE route_id = 75;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (75, '06:35', 45240), (75, '16:00', 3320), (75, '21:30', 4080);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 4460 WHEN '14:35' THEN 3090 WHEN '18:00' THEN 4160 END WHERE route_id = 76;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (76, '06:20', 383760), (76, '21:20', 300);
UPDATE route_departures SET price = CASE departure_time WHEN '08:05' THEN 510 WHEN '16:15' THEN 3990 END WHERE route_id = 77;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (77, '10:00', 2690), (77, '11:00', 569200), (77, '15:10', 970);
UPDATE route_departures SET price = CASE departure_time WHEN '09:10' THEN 4410 WHEN '14:35' THEN 38460 WHEN '20:20' THEN 3410 END WHERE route_id = 78;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (78, '11:45', 133600), (78, '16:55', 3030);
UPDATE route_departures SET price = CASE departure_time WHEN '06:45' THEN 3120 WHEN '17:35' THEN 5170 WHEN '20:55' THEN 1320 END WHERE route_id = 79;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (79, '10:40', 4920), (79, '14:10', 985630);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 2590 WHEN '10:25' THEN 20170 WHEN '17:05' THEN 4570 END WHERE route_id = 80;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (80, '07:40', 83130), (80, '12:35', 4230);
UPDATE route_departures SET price = CASE departure_time WHEN '09:50' THEN 4500 WHEN '13:05' THEN 3650 WHEN '19:25' THEN 3450 END WHERE route_id = 81;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (81, '07:05', 1000), (81, '17:35', 4330);
UPDATE route_departures SET price = CASE departure_time WHEN '08:55' THEN 676700 WHEN '16:00' THEN 2810 END WHERE route_id = 82;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (82, '12:05', 45780), (82, '18:50', 4680), (82, '21:30', 1250);
UPDATE route_departures SET price = CASE departure_time WHEN '07:20' THEN 2410 WHEN '13:20' THEN 380 WHEN '21:30' THEN 4420 END WHERE route_id = 83;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (83, '09:50', 2700), (83, '19:35', 1060);
UPDATE route_departures SET price = CASE departure_time WHEN '08:25' THEN 3800 WHEN '15:35' THEN 940 WHEN '21:15' THEN 212010 END WHERE route_id = 84;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (84, '06:25', 530), (84, '12:55', 3980);
UPDATE route_departures SET price = CASE departure_time WHEN '06:30' THEN 4550 WHEN '11:20' THEN 1760 WHEN '17:50' THEN 3480 END WHERE route_id = 85;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (85, '07:55', 300), (85, '19:35', 4730);
UPDATE route_departures SET price = CASE departure_time WHEN '06:35' THEN 1430 WHEN '11:35' THEN 810 WHEN '16:20' THEN 3730 END WHERE route_id = 86;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (86, '08:45', 7990), (86, '17:45', 86050);
UPDATE route_departures SET price = CASE departure_time WHEN '16:15' THEN 3070 WHEN '20:00' THEN 4770 END WHERE route_id = 87;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (87, '06:05', 1960), (87, '13:15', 25730), (87, '17:20', 1910);
UPDATE route_departures SET price = CASE departure_time WHEN '06:50' THEN 1370 WHEN '11:45' THEN 4440 WHEN '15:05' THEN 2700 END WHERE route_id = 88;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (88, '13:05', 3320), (88, '20:40', 60500);
UPDATE route_departures SET price = CASE departure_time WHEN '10:20' THEN 4460 WHEN '15:35' THEN 727810 WHEN '20:30' THEN 170 END WHERE route_id = 89;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (89, '08:10', 2170), (89, '19:10', 4670);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 3780 WHEN '13:10' THEN 1430 WHEN '17:40' THEN 930 END WHERE route_id = 90;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (90, '09:30', 1000), (90, '20:10', 4690);
UPDATE route_departures SET price = CASE departure_time WHEN '17:05' THEN 1980 WHEN '20:40' THEN 1140 END WHERE route_id = 91;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (91, '14:30', 1060), (91, '15:55', 4670), (91, '19:25', 3120);
UPDATE route_departures SET price = CASE departure_time WHEN '06:05' THEN 1470 WHEN '13:25' THEN 69990 WHEN '20:10' THEN 2150 END WHERE route_id = 92;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (92, '07:30', 2800), (92, '11:25', 1170);
UPDATE route_departures SET price = CASE departure_time WHEN '14:00' THEN 1510 WHEN '19:15' THEN 870 END WHERE route_id = 93;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (93, '06:45', 4820), (93, '11:55', 1940), (93, '15:50', 906030);
UPDATE route_departures SET price = CASE departure_time WHEN '08:25' THEN 22370 WHEN '13:35' THEN 1060 WHEN '21:20' THEN 1180 END WHERE route_id = 94;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (94, '07:20', 4710), (94, '20:10', 3780);
UPDATE route_departures SET price = CASE departure_time WHEN '11:05' THEN 82050 WHEN '16:35' THEN 890 WHEN '20:20' THEN 2830 END WHERE route_id = 95;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (95, '06:40', 115760), (95, '08:30', 2390);
UPDATE route_departures SET price = CASE departure_time WHEN '06:45' THEN 530 WHEN '09:50' THEN 500 WHEN '17:15' THEN 4850 END WHERE route_id = 96;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (96, '13:40', 2310), (96, '18:55', 730);
UPDATE route_departures SET price = CASE departure_time WHEN '09:40' THEN 330 WHEN '15:40' THEN 33800 END WHERE route_id = 97;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (97, '06:25', 2950), (97, '13:35', 4160), (97, '19:40', 1690);
UPDATE route_departures SET price = CASE departure_time WHEN '15:50' THEN 3390 WHEN '21:10' THEN 2060 END WHERE route_id = 98;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (98, '07:30', 49240), (98, '10:20', 590), (98, '19:40', 180);
UPDATE route_departures SET price = CASE departure_time WHEN '06:10' THEN 3680 WHEN '18:20' THEN 1530 END WHERE route_id = 99;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (99, '08:45', 1430), (99, '13:20', 29220), (99, '20:25', 3630);
UPDATE route_departures SET price = CASE departure_time WHEN '09:55' THEN 520 WHEN '15:10' THEN 282920 WHEN '19:35' THEN 1940 END WHERE route_id = 100;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (100, '11:20', 750), (100, '20:50', 3680);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 3210 WHEN '13:15' THEN 38980 WHEN '19:05' THEN 287170 END WHERE route_id = 101;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (101, '10:50', 4710), (101, '12:00', 4500);
UPDATE route_departures SET price = CASE departure_time WHEN '07:05' THEN 290 WHEN '12:45' THEN 650 WHEN '16:00' THEN 2330 END WHERE route_id = 102;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (102, '11:45', 3020), (102, '19:50', 991760);
UPDATE route_departures SET price = CASE departure_time WHEN '12:05' THEN 329980 WHEN '15:10' THEN 3530 WHEN '19:00' THEN 632240 END WHERE route_id = 103;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (103, '06:15', 3070), (103, '14:10', 3240);
UPDATE route_departures SET price = CASE departure_time WHEN '08:45' THEN 180 WHEN '21:10' THEN 2990 END WHERE route_id = 104;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (104, '07:25', 98360), (104, '11:55', 2340), (104, '16:00', 4860);
UPDATE route_departures SET price = CASE departure_time WHEN '06:00' THEN 142360 WHEN '17:00' THEN 4850 WHEN '20:10' THEN 2950 END WHERE route_id = 105;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (105, '08:00', 4100), (105, '10:55', 4210);
UPDATE route_departures SET price = CASE departure_time WHEN '06:30' THEN 2060 WHEN '14:05' THEN 4010 END WHERE route_id = 106;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (106, '08:00', 1550), (106, '17:55', 340), (106, '20:00', 200);
UPDATE route_departures SET price = CASE departure_time WHEN '06:00' THEN 3970 WHEN '17:35' THEN 4440 END WHERE route_id = 107;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (107, '11:10', 938400), (107, '19:05', 3900), (107, '20:45', 2150);
UPDATE route_departures SET price = CASE departure_time WHEN '11:20' THEN 3610 WHEN '18:50' THEN 4100 END WHERE route_id = 108;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (108, '06:40', 969690), (108, '13:45', 62300), (108, '17:25', 1200);
UPDATE route_departures SET price = CASE departure_time WHEN '06:45' THEN 2540 WHEN '17:30' THEN 3950 END WHERE route_id = 109;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (109, '09:10', 2420), (109, '15:35', 980), (109, '19:15', 72700);
UPDATE route_departures SET price = CASE departure_time WHEN '09:00' THEN 89360 WHEN '15:10' THEN 88870 WHEN '19:15' THEN 510 END WHERE route_id = 110;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (110, '13:20', 1550), (110, '18:10', 3230);
UPDATE route_departures SET price = CASE departure_time WHEN '10:20' THEN 3300 WHEN '17:00' THEN 3930 END WHERE route_id = 111;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (111, '13:00', 2830), (111, '14:55', 2700), (111, '19:40', 1600);
UPDATE route_departures SET price = CASE departure_time WHEN '12:40' THEN 3420 WHEN '16:20' THEN 2970 WHEN '20:40' THEN 325080 END WHERE route_id = 112;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (112, '08:05', 76930), (112, '13:45', 3590);
UPDATE route_departures SET price = CASE departure_time WHEN '11:20' THEN 610 WHEN '16:45' THEN 790 WHEN '19:50' THEN 2910 END WHERE route_id = 113;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (113, '08:15', 880), (113, '13:45', 1770);
UPDATE route_departures SET price = CASE departure_time WHEN '09:35' THEN 270 WHEN '13:55' THEN 1280 WHEN '20:15' THEN 680 END WHERE route_id = 114;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (114, '12:45', 540), (114, '17:55', 3550);
UPDATE route_departures SET price = CASE departure_time WHEN '10:55' THEN 2280 WHEN '21:15' THEN 300 END WHERE route_id = 115;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (115, '07:35', 2390), (115, '15:30', 2910), (115, '19:50', 1710);
UPDATE route_departures SET price = CASE departure_time WHEN '06:15' THEN 1660 WHEN '16:05' THEN 423100 WHEN '21:10' THEN 1920 END WHERE route_id = 116;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (116, '07:30', 2390), (116, '10:25', 450);
UPDATE route_departures SET price = CASE departure_time WHEN '09:50' THEN 4120 WHEN '13:55' THEN 445740 WHEN '21:20' THEN 720 END WHERE route_id = 117;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (117, '08:05', 1090), (117, '19:10', 84950);
UPDATE route_departures SET price = CASE departure_time WHEN '09:20' THEN 4960 WHEN '20:40' THEN 3300 END WHERE route_id = 118;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (118, '06:10', 2710), (118, '07:25', 449660), (118, '17:15', 752890);
UPDATE route_departures SET price = CASE departure_time WHEN '10:55' THEN 1460 WHEN '13:55' THEN 3970 WHEN '20:00' THEN 637050 END WHERE route_id = 119;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (119, '07:50', 2050), (119, '16:05', 170);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 2280 WHEN '14:25' THEN 2840 WHEN '19:50' THEN 2830 END WHERE route_id = 120;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (120, '07:40', 480), (120, '17:15', 3610);
UPDATE route_departures SET price = CASE departure_time WHEN '11:55' THEN 2380 WHEN '17:00' THEN 4660 END WHERE route_id = 121;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (121, '06:25', 2680), (121, '10:10', 170), (121, '15:10', 370);
UPDATE route_departures SET price = CASE departure_time WHEN '06:15' THEN 4920 WHEN '16:05' THEN 4260 END WHERE route_id = 122;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (122, '12:35', 2680), (122, '18:50', 1400), (122, '19:55', 1980);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 3390 WHEN '13:05' THEN 3030 END WHERE route_id = 123;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (123, '08:00', 4410), (123, '11:10', 2430), (123, '19:30', 3460);
UPDATE route_departures SET price = CASE departure_time WHEN '08:05' THEN 1780 WHEN '11:15' THEN 2310 WHEN '17:00' THEN 410 END WHERE route_id = 124;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (124, '14:15', 2390), (124, '21:25', 871740);
UPDATE route_departures SET price = CASE departure_time WHEN '15:35' THEN 3140 WHEN '18:40' THEN 4340 END WHERE route_id = 125;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (125, '07:25', 213960), (125, '09:30', 870), (125, '11:00', 39560);
UPDATE route_departures SET price = CASE departure_time WHEN '09:05' THEN 36710 WHEN '19:45' THEN 2600 END WHERE route_id = 126;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (126, '06:55', 2010), (126, '10:05', 2450), (126, '20:45', 124520);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 1630 WHEN '13:15' THEN 4420 WHEN '20:50' THEN 2830 END WHERE route_id = 127;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (127, '07:25', 700), (127, '09:40', 662480);
UPDATE route_departures SET price = CASE departure_time WHEN '12:15' THEN 1930 WHEN '15:30' THEN 780 WHEN '20:35' THEN 4420 END WHERE route_id = 128;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (128, '13:45', 3780), (128, '19:20', 690);
UPDATE route_departures SET price = CASE departure_time WHEN '08:30' THEN 660 WHEN '20:00' THEN 59170 END WHERE route_id = 129;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (129, '07:00', 50730), (129, '13:45', 510), (129, '16:55', 1430);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 1290 WHEN '14:15' THEN 1120 WHEN '19:20' THEN 631590 END WHERE route_id = 130;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (130, '06:00', 883400), (130, '15:45', 980);
UPDATE route_departures SET price = CASE departure_time WHEN '07:20' THEN 3670 WHEN '15:15' THEN 340 WHEN '21:10' THEN 59840 END WHERE route_id = 131;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (131, '08:55', 1900), (131, '11:00', 4190);
UPDATE route_departures SET price = CASE departure_time WHEN '12:00' THEN 2910 WHEN '20:20' THEN 1880 END WHERE route_id = 132;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (132, '06:25', 590), (132, '13:10', 650), (132, '15:55', 2190);
UPDATE route_departures SET price = CASE departure_time WHEN '11:00' THEN 73610 WHEN '14:20' THEN 4320 WHEN '19:30' THEN 560 END WHERE route_id = 133;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (133, '12:25', 3410), (133, '20:45', 212510);
UPDATE route_departures SET price = CASE departure_time WHEN '09:40' THEN 1140 WHEN '15:10' THEN 410 WHEN '21:30' THEN 3090 END WHERE route_id = 134;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (134, '17:15', 2270), (134, '18:15', 47570);
UPDATE route_departures SET price = CASE departure_time WHEN '06:35' THEN 2900 WHEN '12:40' THEN 420 END WHERE route_id = 135;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (135, '09:00', 2410), (135, '15:25', 3730), (135, '17:25', 2520);
UPDATE route_departures SET price = CASE departure_time WHEN '06:45' THEN 5040 WHEN '11:15' THEN 3620 END WHERE route_id = 136;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (136, '08:25', 2100), (136, '15:30', 1370), (136, '17:15', 3640);
UPDATE route_departures SET price = CASE departure_time WHEN '14:10' THEN 2070 WHEN '17:15' THEN 260 WHEN '21:30' THEN 1940 END WHERE route_id = 137;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (137, '07:55', 430), (137, '19:15', 3860);
UPDATE route_departures SET price = CASE departure_time WHEN '11:25' THEN 1790 WHEN '17:40' THEN 2330 END WHERE route_id = 138;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (138, '06:35', 82880), (138, '16:05', 900), (138, '20:45', 4970);
UPDATE route_departures SET price = CASE departure_time WHEN '10:05' THEN 824940 WHEN '15:05' THEN 3010 END WHERE route_id = 139;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (139, '17:25', 3460), (139, '19:05', 300), (139, '21:10', 4490);
UPDATE route_departures SET price = CASE departure_time WHEN '11:50' THEN 4720 WHEN '19:05' THEN 239280 END WHERE route_id = 140;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (140, '06:35', 1110), (140, '14:20', 4310), (140, '20:40', 1810);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 3360 WHEN '20:45' THEN 4560 END WHERE route_id = 141;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (141, '10:35', 342930), (141, '11:40', 4460), (141, '15:45', 4340);
UPDATE route_departures SET price = CASE departure_time WHEN '07:00' THEN 3390 WHEN '14:55' THEN 22040 WHEN '19:35' THEN 3770 END WHERE route_id = 142;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (142, '08:25', 4890), (142, '16:10', 4680);
UPDATE route_departures SET price = CASE departure_time WHEN '09:25' THEN 4830 WHEN '19:05' THEN 970 END WHERE route_id = 143;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (143, '08:10', 82680), (143, '10:50', 788240), (143, '13:20', 2040);
UPDATE route_departures SET price = CASE departure_time WHEN '06:15' THEN 806680 WHEN '13:00' THEN 3210 WHEN '20:55' THEN 4810 END WHERE route_id = 144;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (144, '08:50', 4210), (144, '11:35', 2130);
UPDATE route_departures SET price = CASE departure_time WHEN '09:30' THEN 3690 WHEN '16:40' THEN 830 WHEN '21:10' THEN 4480 END WHERE route_id = 145;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (145, '08:15', 3030), (145, '13:25', 1480);
UPDATE route_departures SET price = CASE departure_time WHEN '09:45' THEN 1670 WHEN '13:55' THEN 3680 WHEN '19:45' THEN 4500 END WHERE route_id = 146;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (146, '16:30', 869860), (146, '17:45', 92130);
UPDATE route_departures SET price = CASE departure_time WHEN '06:00' THEN 1650 WHEN '09:15' THEN 952280 WHEN '19:05' THEN 2800 END WHERE route_id = 147;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (147, '13:25', 360), (147, '20:45', 7020);
UPDATE route_departures SET price = CASE departure_time WHEN '06:10' THEN 70250 WHEN '09:30' THEN 3590 WHEN '20:30' THEN 176140 END WHERE route_id = 148;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (148, '15:35', 3500), (148, '16:40', 2280);
UPDATE route_departures SET price = CASE departure_time WHEN '07:20' THEN 4730 WHEN '11:45' THEN 828370 WHEN '16:25' THEN 38520 END WHERE route_id = 149;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (149, '13:10', 38500), (149, '20:40', 4880);
UPDATE route_departures SET price = CASE departure_time WHEN '10:15' THEN 3470 WHEN '20:00' THEN 4990 END WHERE route_id = 150;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (150, '06:05', 1670), (150, '07:05', 4640), (150, '13:55', 2090);
UPDATE route_departures SET price = CASE departure_time WHEN '09:10' THEN 2640 WHEN '14:40' THEN 1990 WHEN '18:35' THEN 1540 END WHERE route_id = 151;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (151, '13:00', 58780), (151, '21:00', 1610);
UPDATE route_departures SET price = CASE departure_time WHEN '11:15' THEN 220 WHEN '20:25' THEN 23230 END WHERE route_id = 152;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (152, '06:15', 380), (152, '08:20', 2320), (152, '18:30', 160);
UPDATE route_departures SET price = CASE departure_time WHEN '08:15' THEN 2560 WHEN '11:35' THEN 230 WHEN '20:45' THEN 2320 END WHERE route_id = 153;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (153, '09:25', 2260), (153, '16:10', 3450);
UPDATE route_departures SET price = CASE departure_time WHEN '07:00' THEN 300 WHEN '15:55' THEN 3640 END WHERE route_id = 154;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (154, '10:35', 1700), (154, '12:15', 427720), (154, '14:45', 3990);
UPDATE route_departures SET price = CASE departure_time WHEN '06:55' THEN 150 WHEN '15:20' THEN 328100 WHEN '19:45' THEN 1440 END WHERE route_id = 155;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (155, '11:25', 1910), (155, '16:35', 5450);
UPDATE route_departures SET price = CASE departure_time WHEN '09:25' THEN 1540 WHEN '12:30' THEN 4130 WHEN '15:40' THEN 2130 END WHERE route_id = 156;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (156, '07:45', 3530), (156, '17:40', 1790);
UPDATE route_departures SET price = CASE departure_time WHEN '07:35' THEN 920 WHEN '20:35' THEN 746050 END WHERE route_id = 157;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (157, '06:35', 2910), (157, '10:15', 4800), (157, '12:50', 2070);
UPDATE route_departures SET price = CASE departure_time WHEN '09:35' THEN 2790 WHEN '15:25' THEN 229390 END WHERE route_id = 158;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (158, '13:20', 2010), (158, '16:45', 240), (158, '19:50', 2870);
UPDATE route_departures SET price = CASE departure_time WHEN '07:15' THEN 3140 WHEN '11:25' THEN 3820 WHEN '14:40' THEN 850 END WHERE route_id = 159;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (159, '09:15', 3040), (159, '17:45', 870);
UPDATE route_departures SET price = CASE departure_time WHEN '08:15' THEN 1600 WHEN '16:05' THEN 4050 WHEN '19:40' THEN 380 END WHERE route_id = 160;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (160, '17:35', 44250), (160, '21:20', 4120);
UPDATE route_departures SET price = CASE departure_time WHEN '12:10' THEN 4890 WHEN '16:10' THEN 81630 END WHERE route_id = 161;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (161, '10:55', 4530), (161, '17:35', 28360), (161, '21:30', 4660);
UPDATE route_departures SET price = CASE departure_time WHEN '12:40' THEN 4240 WHEN '21:15' THEN 3650 END WHERE route_id = 162;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (162, '10:15', 820), (162, '16:50', 1740), (162, '18:10', 560);
UPDATE route_departures SET price = CASE departure_time WHEN '07:30' THEN 950 WHEN '13:40' THEN 666060 WHEN '20:05' THEN 690 END WHERE route_id = 163;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (163, '09:35', 980), (163, '18:10', 3930);
UPDATE route_departures SET price = CASE departure_time WHEN '10:10' THEN 1030 WHEN '13:40' THEN 895100 WHEN '18:25' THEN 1920 END WHERE route_id = 164;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (164, '07:15', 2640), (164, '17:15', 4920);
UPDATE route_departures SET price = CASE departure_time WHEN '11:30' THEN 94640 WHEN '17:15' THEN 3720 END WHERE route_id = 165;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (165, '07:40', 29220), (165, '09:05', 2290), (165, '20:00', 910);
UPDATE route_departures SET price = CASE departure_time WHEN '06:55' THEN 3760 WHEN '17:30' THEN 690 WHEN '20:45' THEN 843720 END WHERE route_id = 166;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (166, '10:05', 2480), (166, '13:10', 3070);
UPDATE route_departures SET price = CASE departure_time WHEN '06:25' THEN 1420 WHEN '10:35' THEN 4830 END WHERE route_id = 167;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (167, '09:15', 1840), (167, '17:05', 1840), (167, '20:10', 2580);
UPDATE route_departures SET price = CASE departure_time WHEN '08:25' THEN 950100 WHEN '14:30' THEN 4040 WHEN '18:25' THEN 2950 END WHERE route_id = 168;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (168, '07:25', 3540), (168, '20:20', 3490);
UPDATE route_departures SET price = CASE departure_time WHEN '11:10' THEN 1480 WHEN '16:00' THEN 2470 END WHERE route_id = 169;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (169, '06:35', 1470), (169, '13:10', 682420), (169, '20:50', 1900);
UPDATE route_departures SET price = CASE departure_time WHEN '10:40' THEN 840 WHEN '18:10' THEN 524400 WHEN '21:15' THEN 2950 END WHERE route_id = 170;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (170, '07:30', 458950), (170, '09:00', 760);
UPDATE route_departures SET price = CASE departure_time WHEN '12:20' THEN 800 WHEN '16:35' THEN 800 END WHERE route_id = 171;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (171, '06:50', 2470), (171, '18:40', 820), (171, '21:10', 85460);
UPDATE route_departures SET price = CASE departure_time WHEN '08:55' THEN 4390 WHEN '16:00' THEN 3170 END WHERE route_id = 172;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (172, '07:50', 350), (172, '10:15', 28920), (172, '18:15', 1710);
UPDATE route_departures SET price = CASE departure_time WHEN '09:55' THEN 357670 WHEN '14:40' THEN 1900 WHEN '21:20' THEN 1870 END WHERE route_id = 173;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (173, '08:45', 650), (173, '13:40', 3390);
UPDATE route_departures SET price = CASE departure_time WHEN '06:15' THEN 1270 WHEN '15:25' THEN 190 END WHERE route_id = 174;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (174, '12:40', 58690), (174, '16:45', 4590), (174, '20:30', 2560);
UPDATE route_departures SET price = CASE departure_time WHEN '08:35' THEN 3200 WHEN '17:15' THEN 2350 END WHERE route_id = 175;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (175, '10:10', 1450), (175, '19:00', 4090), (175, '20:20', 2650);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 4770 WHEN '11:55' THEN 4150 END WHERE route_id = 176;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (176, '13:10', 240540), (176, '14:10', 4180), (176, '17:05', 4290);
UPDATE route_departures SET price = CASE departure_time WHEN '10:05' THEN 2280 WHEN '13:30' THEN 1920 WHEN '17:10' THEN 2990 END WHERE route_id = 177;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (177, '12:15', 340), (177, '14:30', 1700);
UPDATE route_departures SET price = CASE departure_time WHEN '06:50' THEN 4240 WHEN '11:40' THEN 540 WHEN '17:15' THEN 339000 END WHERE route_id = 178;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (178, '08:30', 3370), (178, '13:45', 3400);
UPDATE route_departures SET price = CASE departure_time WHEN '09:55' THEN 253540 WHEN '13:35' THEN 570 WHEN '19:50' THEN 2690 END WHERE route_id = 179;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (179, '11:35', 2550), (179, '15:40', 212810);
UPDATE route_departures SET price = CASE departure_time WHEN '10:15' THEN 2450 WHEN '15:50' THEN 3850 WHEN '19:50' THEN 4500 END WHERE route_id = 180;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (180, '17:15', 35690), (180, '21:20', 623480);
UPDATE route_departures SET price = CASE departure_time WHEN '12:20' THEN 3140 WHEN '15:45' THEN 221880 WHEN '20:10' THEN 620 END WHERE route_id = 181;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (181, '07:15', 4690), (181, '13:35', 4630);
UPDATE route_departures SET price = CASE departure_time WHEN '07:20' THEN 930 WHEN '12:05' THEN 4530 WHEN '18:45' THEN 1920 END WHERE route_id = 182;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (182, '09:00', 1960), (182, '13:40', 220);
UPDATE route_departures SET price = CASE departure_time WHEN '06:40' THEN 1180 WHEN '12:20' THEN 2800 WHEN '19:25' THEN 61290 END WHERE route_id = 183;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (183, '07:40', 3350), (183, '16:55', 88310);
UPDATE route_departures SET price = CASE departure_time WHEN '14:50' THEN 4500 WHEN '21:00' THEN 3840 END WHERE route_id = 184;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (184, '09:15', 1560), (184, '12:35', 4650), (184, '18:45', 745370);
UPDATE route_departures SET price = CASE departure_time WHEN '09:00' THEN 650 WHEN '16:15' THEN 4430 WHEN '19:40' THEN 3670 END WHERE route_id = 185;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (185, '06:15', 2050), (185, '07:25', 3680);
UPDATE route_departures SET price = CASE departure_time WHEN '10:40' THEN 724300 WHEN '19:55' THEN 4280 END WHERE route_id = 186;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (186, '07:10', 4700), (186, '12:30', 1880), (186, '18:05', 73500);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 4550 WHEN '12:00' THEN 740 WHEN '16:00' THEN 3700 END WHERE route_id = 187;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (187, '10:10', 3080), (187, '14:25', 1350);
UPDATE route_departures SET price = CASE departure_time WHEN '09:20' THEN 870 WHEN '13:10' THEN 792980 WHEN '16:15' THEN 2760 END WHERE route_id = 188;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (188, '17:15', 7850), (188, '20:30', 330);
UPDATE route_departures SET price = CASE departure_time WHEN '08:05' THEN 610 WHEN '15:35' THEN 4620 WHEN '18:35' THEN 3720 END WHERE route_id = 189;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (189, '06:45', 2050), (189, '11:30', 800);
UPDATE route_departures SET price = CASE departure_time WHEN '08:40' THEN 3060 WHEN '19:35' THEN 666390 END WHERE route_id = 190;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (190, '10:10', 380), (190, '17:00', 2910), (190, '18:20', 2200);
UPDATE route_departures SET price = CASE departure_time WHEN '14:15' THEN 463910 WHEN '17:45' THEN 2080 END WHERE route_id = 191;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (191, '07:00', 660), (191, '10:05', 1160), (191, '12:45', 3610);
UPDATE route_departures SET price = CASE departure_time WHEN '06:25' THEN 4880 WHEN '13:45' THEN 4800 END WHERE route_id = 192;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (192, '10:15', 860), (192, '17:35', 2940), (192, '21:30', 330780);
UPDATE route_departures SET price = CASE departure_time WHEN '13:25' THEN 4160 WHEN '18:20' THEN 2760 END WHERE route_id = 193;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (193, '08:55', 1290), (193, '10:25', 17500), (193, '20:55', 2210);
UPDATE route_departures SET price = CASE departure_time WHEN '15:35' THEN 1690 WHEN '19:00' THEN 2370 END WHERE route_id = 194;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (194, '08:10', 2530), (194, '09:50', 43170), (194, '21:15', 564910);
UPDATE route_departures SET price = CASE departure_time WHEN '08:35' THEN 4990 WHEN '14:05' THEN 1540 WHEN '18:50' THEN 2180 END WHERE route_id = 195;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (195, '06:30', 1080), (195, '10:10', 380);
UPDATE route_departures SET price = CASE departure_time WHEN '10:10' THEN 3290 WHEN '18:30' THEN 2200 END WHERE route_id = 196;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (196, '11:45', 190), (196, '14:00', 266830), (196, '20:50', 2510);
UPDATE route_departures SET price = CASE departure_time WHEN '08:00' THEN 660 WHEN '15:40' THEN 39400 END WHERE route_id = 197;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (197, '06:15', 3190), (197, '10:00', 5220), (197, '21:10', 4540);
UPDATE route_departures SET price = CASE departure_time WHEN '13:40' THEN 59890 WHEN '17:25' THEN 43420 WHEN '21:00' THEN 830 END WHERE route_id = 198;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (198, '14:50', 1770), (198, '18:30', 4540);
UPDATE route_departures SET price = CASE departure_time WHEN '11:35' THEN 54450 WHEN '16:55' THEN 2510 WHEN '20:10' THEN 3880 END WHERE route_id = 199;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (199, '06:10', 3160), (199, '07:30', 3160);
UPDATE route_departures SET price = CASE departure_time WHEN '06:55' THEN 200 WHEN '13:50' THEN 4310 END WHERE route_id = 200;
INSERT INTO route_departures (route_id, departure_time, price) VALUES (200, '16:00', 2660), (200, '17:55', 1550), (200, '21:20', 3790);

-- Nya rutter: från, till, flygtid (min) och avstånd (km, bara som kommentar)
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 201, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BMA'; -- 33 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (201, '08:00', 160), (201, '09:30', 2710), (201, '12:30', 2130), (201, '14:20', 876590), (201, '17:00', 4930), (201, '19:40', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 202, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'VBY'; -- 223 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (202, '06:45', 486420), (202, '08:50', 251740), (202, '11:45', 700), (202, '14:00', 1360), (202, '16:25', 22760), (202, '17:35', 665720), (202, '20:55', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 203, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'KRN'; -- 916 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (203, '06:40', 4780), (203, '09:15', 3270), (203, '12:05', 2980), (203, '15:10', 4340), (203, '17:25', 1530), (203, '20:30', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 204, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BGO'; -- 709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (204, '07:35', 3530), (204, '10:55', 3740), (204, '12:50', 4570), (204, '17:25', 4710), (204, '20:05', 2340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 205, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'TRD'; -- 562 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (205, '06:40', 2330), (205, '11:25', 375760), (205, '14:20', 3860), (205, '16:50', 3820), (205, '20:15', 72070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 206, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'AAL'; -- 549 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (206, '06:55', 1250), (206, '09:00', 77930), (206, '11:35', 1950), (206, '14:00', 2210), (206, '15:30', 830), (206, '17:50', 1280), (206, '20:45', 4970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 207, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'KEF'; -- 2143 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (207, '07:10', 32700), (207, '10:30', 93010), (207, '13:40', 4310), (207, '17:05', 1710), (207, '19:35', 3240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 208, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'RIX'; -- 466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (208, '07:20', 1850), (208, '09:15', 750950), (208, '12:25', 4680), (208, '15:10', 2490), (208, '17:40', 28350), (208, '19:55', 1610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 209, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MAN'; -- 1416 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (209, '07:55', 2740), (209, '10:35', 980), (209, '13:25', 2560), (209, '16:50', 1090), (209, '20:10', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 210, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'EDI'; -- 1320 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (210, '07:45', 1510), (210, '10:40', 4680), (210, '13:40', 660), (210, '16:15', 3590), (210, '20:40', 60440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 211, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'DUB'; -- 1623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (211, '07:45', 57610), (211, '09:15', 1460), (211, '12:25', 520), (211, '14:20', 3470), (211, '17:15', 3820), (211, '20:45', 1810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 212, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'NCE'; -- 1920 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (212, '06:55', 1710), (212, '09:45', 4090), (212, '12:05', 3090), (212, '13:25', 710), (212, '15:40', 76270), (212, '18:20', 1810), (212, '20:25', 700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 213, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BRU'; -- 1288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (213, '07:25', 3030), (213, '10:55', 173460), (213, '14:10', 3830), (213, '17:30', 2180), (213, '19:50', 4430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 214, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'BER'; -- 854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (214, '08:00', 63100), (214, '09:45', 3270), (214, '11:45', 4660), (214, '15:30', 1890), (214, '18:05', 250), (214, '20:55', 665710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 215, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'VIE'; -- 1286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (215, '07:30', 3470), (215, '09:10', 84440), (215, '13:10', 4110), (215, '15:30', 2550), (215, '17:05', 2290), (215, '20:40', 4680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 216, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'PRG'; -- 1087 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (216, '07:15', 3130), (216, '10:35', 1570), (216, '12:25', 820), (216, '15:05', 4060), (216, '18:10', 2340), (216, '20:25', 325100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 217, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'WAW'; -- 853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (217, '07:15', 19370), (217, '09:05', 3170), (217, '11:45', 1250), (217, '14:10', 1100), (217, '15:20', 850), (217, '18:20', 1100), (217, '19:55', 990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 218, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MAD'; -- 2600 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (218, '06:35', 3970), (218, '10:35', 2670), (218, '12:05', 253810), (218, '15:35', 4550), (218, '17:30', 2390), (218, '20:20', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 219, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'PMI'; -- 2475 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (219, '07:20', 160), (219, '09:45', 4610), (219, '13:05', 3840), (219, '14:20', 920), (219, '17:30', 410), (219, '20:30', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 220, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'LPA'; -- 4335 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (220, '07:50', 3750), (220, '09:45', 1520), (220, '11:55', 4610), (220, '15:35', 430290), (220, '17:05', 19650), (220, '19:50', 3220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 221, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'LIS'; -- 2999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (221, '07:35', 4980), (221, '10:15', 3650), (221, '13:10', 3880), (221, '16:05', 3280), (221, '19:45', 274840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 222, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MXP'; -- 1674 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (222, '06:50', 4510), (222, '09:55', 4210), (222, '12:40', 2060), (222, '15:45', 200), (222, '17:10', 210), (222, '20:40', 994780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 223, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'IST'; -- 2177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (223, '07:00', 4360), (223, '09:40', 2990), (223, '10:55', 914960), (223, '14:20', 2810), (223, '15:25', 4090), (223, '18:30', 1060), (223, '20:50', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 224, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'DXB'; -- 4785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (224, '07:40', 533160), (224, '09:45', 3880), (224, '11:30', 3630), (224, '14:05', 4710), (224, '16:15', 2270), (224, '18:35', 510), (224, '20:30', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 225, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'ORD'; -- 6856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (225, '07:45', 530930), (225, '11:20', 805000), (225, '14:05', 3290), (225, '17:10', 2120), (225, '19:35', 3640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 226, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'MIA'; -- 7996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (226, '07:55', 1140), (226, '10:45', 4520), (226, '13:05', 1670), (226, '17:00', 2310), (226, '19:50', 2750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 227, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'ARN' AND t.iata = 'LAX'; -- 8864 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (227, '07:00', 4650), (227, '10:35', 1610), (227, '13:00', 600), (227, '17:15', 1420), (227, '19:35', 30870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 228, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'ARN'; -- 33 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (228, '07:00', 460), (228, '10:25', 2490), (228, '13:10', 2980), (228, '16:00', 3930), (228, '19:10', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 229, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'GOT'; -- 377 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (229, '07:10', 500), (229, '10:15', 2510), (229, '13:10', 3990), (229, '16:35', 510), (229, '20:50', 3410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 230, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MMX'; -- 504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (230, '07:20', 450), (230, '09:10', 2990), (230, '11:50', 1570), (230, '13:45', 1540), (230, '15:45', 1940), (230, '17:45', 2700), (230, '20:40', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 231, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'LLA'; -- 721 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (231, '06:45', 1500), (231, '08:50', 3810), (231, '11:35', 3400), (231, '13:25', 96410), (231, '16:10', 4620), (231, '18:20', 21890), (231, '20:55', 4220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 232, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'UME'; -- 509 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (232, '07:00', 4730), (232, '09:35', 1510), (232, '12:45', 250), (232, '14:30', 1250), (232, '16:55', 4120), (232, '20:40', 3630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 233, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'OSD'; -- 465 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (233, '07:00', 1170), (233, '09:40', 210680), (233, '12:25', 4810), (233, '15:35', 2610), (233, '17:10', 4810), (233, '20:30', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 234, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'KRN'; -- 949 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (234, '07:55', 3770), (234, '10:50', 4420), (234, '14:05', 180), (234, '17:15', 2760), (234, '19:20', 2590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 235, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'OSL'; -- 394 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (235, '07:45', 2740), (235, '08:40', 2100), (235, '12:00', 4880), (235, '13:30', 1760), (235, '16:25', 250), (235, '17:50', 4170), (235, '20:20', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 236, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'BGO'; -- 718 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (236, '07:50', 120970), (236, '11:15', 1820), (236, '14:15', 1230), (236, '16:20', 2450), (236, '19:25', 88320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 237, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'TRD'; -- 590 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (237, '07:15', 2520), (237, '10:10', 2060), (237, '12:05', 4690), (237, '14:20', 3290), (237, '17:40', 3660), (237, '20:40', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 238, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'CPH'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (238, '06:40', 710), (238, '10:05', 4420), (238, '12:50', 94020), (238, '16:25', 4800), (238, '19:30', 17220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 239, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'HEL'; -- 407 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (239, '07:35', 3280), (239, '09:40', 1510), (239, '12:00', 61070), (239, '14:45', 2280), (239, '18:20', 3490), (239, '20:40', 3340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 240, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'KEF'; -- 2161 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (240, '06:45', 3850), (240, '09:15', 2700), (240, '12:40', 318890), (240, '14:55', 4300), (240, '17:15', 754000), (240, '20:20', 942940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 241, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'TLL'; -- 390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (241, '06:40', 3920), (241, '10:25', 482140), (241, '12:55', 166250), (241, '17:40', 4360), (241, '20:15', 74560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 242, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'RIX'; -- 445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (242, '06:50', 270), (242, '09:15', 2140), (242, '12:10', 1740), (242, '14:20', 3260), (242, '16:30', 3300), (242, '18:15', 2030), (242, '20:40', 4430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 243, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'LHR'; -- 1446 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (243, '07:25', 820), (243, '10:30', 2150), (243, '12:40', 2400), (243, '15:05', 2700), (243, '17:00', 980), (243, '20:50', 2710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 244, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MAN'; -- 1405 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (244, '06:45', 4150), (244, '08:55', 4100), (244, '11:55', 4050), (244, '13:30', 3680), (244, '16:35', 2330), (244, '18:50', 3150), (244, '20:25', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 245, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'EDI'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (245, '06:35', 389890), (245, '10:05', 2850), (245, '13:10', 4930), (245, '14:30', 1120), (245, '17:55', 423180), (245, '20:05', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 246, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'DUB'; -- 1616 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (246, '06:30', 637870), (246, '09:20', 3870), (246, '11:40', 3840), (246, '13:30', 68730), (246, '16:20', 3920), (246, '17:50', 2940), (246, '20:40', 2770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 247, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'CDG'; -- 1517 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (247, '07:10', 2300), (247, '10:10', 1040), (247, '12:55', 4630), (247, '15:45', 790), (247, '17:55', 740), (247, '19:35', 62550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 248, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'NCE'; -- 1890 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (248, '07:00', 730), (248, '09:55', 921290), (248, '11:20', 65330), (248, '14:00', 16460), (248, '15:45', 3730), (248, '18:30', 4370), (248, '19:50', 650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 249, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'AMS'; -- 1132 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (249, '07:10', 3160), (249, '08:55', 88570), (249, '12:05', 2200), (249, '14:00', 810), (249, '15:50', 3490), (249, '18:00', 3490), (249, '19:55', 1240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 250, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'BRU'; -- 1266 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (250, '08:00', 2770), (250, '09:55', 2220), (250, '12:55', 33180), (250, '15:15', 26290), (250, '18:10', 1460), (250, '19:55', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 251, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'FRA'; -- 1196 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (251, '08:00', 3510), (251, '10:15', 1220), (251, '13:20', 4000), (251, '16:20', 4340), (251, '20:10', 840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 252, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MUC'; -- 1287 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (252, '07:45', 2020), (252, '09:45', 224830), (252, '12:35', 6900), (252, '15:20', 3790), (252, '17:45', 340), (252, '20:40', 560340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 253, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'BER'; -- 824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (253, '07:10', 2730), (253, '10:25', 2050), (253, '12:55', 4490), (253, '16:05', 613080), (253, '19:30', 1200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 254, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'ZRH'; -- 1458 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (254, '08:20', 2620), (254, '10:05', 500), (254, '14:20', 2270), (254, '17:20', 3520), (254, '19:55', 4030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 255, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'VIE'; -- 1253 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (255, '07:35', 3940), (255, '09:00', 2050), (255, '11:00', 2820), (255, '13:20', 1290), (255, '16:35', 3660), (255, '18:00', 4810), (255, '20:50', 3580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 256, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'PRG'; -- 1055 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (256, '07:35', 3500), (256, '09:15', 964450), (256, '11:05', 3280), (256, '13:20', 1720), (256, '16:25', 1820), (256, '18:10', 2990), (256, '20:10', 354570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 257, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'WAW'; -- 820 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (257, '07:05', 4210), (257, '10:30', 180), (257, '14:30', 710), (257, '17:00', 10000), (257, '20:50', 1480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 258, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'BCN'; -- 2288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (258, '07:00', 1340), (258, '11:15', 2610), (258, '12:50', 4790), (258, '16:55', 4390), (258, '20:35', 4430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 259, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MAD'; -- 2577 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (259, '07:35', 2610), (259, '09:15', 6780), (259, '11:20', 27620), (259, '13:25', 79930), (259, '16:35', 810), (259, '18:10', 1620), (259, '20:55', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 260, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'AGP'; -- 2992 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (260, '08:25', 327260), (260, '10:40', 2910), (260, '14:20', 1800), (260, '17:05', 520), (260, '20:45', 2330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 261, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'PMI'; -- 2447 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (261, '07:35', 3780), (261, '09:45', 4460), (261, '11:40', 2360), (261, '13:50', 3590), (261, '16:00', 131460), (261, '18:50', 1910), (261, '20:05', 170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 262, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'LPA'; -- 4315 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (262, '07:20', 3390), (262, '09:10', 2720), (262, '11:00', 4710), (262, '14:10', 2150), (262, '16:35', 1710), (262, '17:55', 2280), (262, '20:00', 4190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 263, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'LIS'; -- 2979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (263, '07:00', 66290), (263, '09:45', 3330), (263, '10:55', 2450), (263, '14:05', 990), (263, '15:50', 275190), (263, '18:40', 4640), (263, '20:30', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 264, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'FCO'; -- 1991 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (264, '06:50', 2120), (264, '08:50', 4650), (264, '11:15', 2600), (264, '13:35', 3560), (264, '15:20', 4620), (264, '18:15', 4580), (264, '21:00', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 265, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MXP'; -- 1645 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (265, '06:45', 2200), (265, '08:50', 1990), (265, '10:55', 4910), (265, '14:05', 144440), (265, '15:40', 370), (265, '17:55', 4710), (265, '20:50', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 266, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'ATH'; -- 2419 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (266, '08:10', 682320), (266, '10:10', 960), (266, '13:15', 1240), (266, '16:45', 85940), (266, '19:25', 2080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 267, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'IST'; -- 2146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (267, '07:05', 3610), (267, '08:50', 2910), (267, '12:05', 3410), (267, '14:20', 3580), (267, '16:25', 3950), (267, '17:40', 3510), (267, '20:10', 461650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 268, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'DXB'; -- 4764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (268, '06:55', 679860), (268, '09:25', 4710), (268, '11:30', 4840), (268, '13:20', 2230), (268, '16:00', 763760), (268, '18:50', 932630), (268, '20:35', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 269, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'BKK'; -- 8295 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (269, '06:40', 522680), (269, '10:00', 2920), (269, '13:10', 2200), (269, '16:50', 1700), (269, '20:50', 423200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 270, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'JFK'; -- 6307 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (270, '07:40', 2540), (270, '10:05', 4590), (270, '13:00', 3370), (270, '17:05', 3760), (270, '20:30', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 271, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'EWR'; -- 6323 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (271, '07:30', 89390), (271, '09:25', 3270), (271, '13:05', 31740), (271, '14:30', 1550), (271, '18:20', 2260), (271, '19:45', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 272, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'ORD'; -- 6876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (272, '07:00', 949350), (272, '09:40', 4800), (272, '13:00', 4000), (272, '15:15', 4370), (272, '17:55', 2650), (272, '19:30', 238920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 273, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'MIA'; -- 8009 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (273, '06:45', 3230), (273, '11:00', 2970), (273, '13:15', 91260), (273, '16:20', 4380), (273, '19:55', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 274, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'LAX'; -- 8891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (274, '06:35', 1280), (274, '09:15', 14210), (274, '12:25', 3520), (274, '14:45', 3610), (274, '18:20', 570), (274, '20:05', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 275, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'BMA' AND t.iata = 'YYZ'; -- 6331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (275, '07:40', 970), (275, '10:30', 2030), (275, '14:40', 1870), (275, '17:40', 3070), (275, '19:35', 315990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 276, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BMA'; -- 377 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (276, '08:00', 51110), (276, '09:55', 3220), (276, '12:10', 950), (276, '14:50', 3750), (276, '17:10', 850), (276, '19:45', 930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 277, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MMX'; -- 246 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (277, '07:45', 894070), (277, '10:15', 60080), (277, '14:35', 2120), (277, '16:55', 3800), (277, '19:15', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 278, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'LLA'; -- 1015 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (278, '07:00', 4830), (278, '09:40', 847530), (278, '11:35', 1440), (278, '14:15', 1760), (278, '16:00', 2980), (278, '18:40', 1960), (278, '21:00', 4110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 279, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'VBY'; -- 360 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (279, '07:30', 4070), (279, '09:45', 4990), (279, '11:45', 2240), (279, '15:25', 640), (279, '17:50', 3690), (279, '19:30', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 280, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'UME'; -- 806 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (280, '06:40', 2900), (280, '08:40', 2000), (280, '11:45', 29480), (280, '14:10', 2690), (280, '15:50', 2810), (280, '18:10', 560), (280, '19:55', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 281, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'OSD'; -- 626 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (281, '07:20', 3330), (281, '10:05', 4800), (281, '13:40', 1180), (281, '16:50', 4730), (281, '20:15', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 282, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'KRN'; -- 1198 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (282, '07:10', 70260), (282, '08:55', 4270), (282, '11:55', 3700), (282, '14:05', 1030), (282, '16:10', 2280), (282, '18:25', 1420), (282, '20:05', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 283, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'OSL'; -- 288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (283, '07:25', 4050), (283, '08:40', 4950), (283, '12:00', 1070), (283, '14:00', 2060), (283, '16:00', 3400), (283, '18:00', 1040), (283, '20:15', 2910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 284, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BGO'; -- 499 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (284, '07:35', 2140), (284, '11:30', 1870), (284, '13:30', 61610), (284, '16:00', 27880), (284, '20:20', 23790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 285, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'TRD'; -- 648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (285, '07:45', 2000), (285, '09:55', 857440), (285, '12:00', 1560), (285, '14:45', 1960), (285, '17:30', 1600), (285, '20:10', 4210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 286, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'CPH'; -- 229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (286, '07:05', 3930), (286, '10:45', 3010), (286, '14:25', 3450), (286, '17:20', 2980), (286, '19:15', 190240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 287, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'AAL'; -- 160 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (287, '08:15', 2650), (287, '09:55', 1660), (287, '13:45', 4080), (287, '16:15', 1340), (287, '20:10', 3010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 288, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'HEL'; -- 782 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (288, '07:15', 3410), (288, '10:10', 2600), (288, '12:15', 4410), (288, '15:00', 4960), (288, '17:40', 1060), (288, '20:20', 4850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 289, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'KEF'; -- 1987 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (289, '06:40', 2680), (289, '09:15', 58220), (289, '11:05', 1310), (289, '13:30', 4280), (289, '15:45', 1990), (289, '18:20', 4830), (289, '20:20', 1140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 290, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'TLL'; -- 752 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (290, '06:45', 830), (290, '11:10', 1690), (290, '13:55', 2250), (290, '16:50', 123480), (290, '20:45', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 291, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'RIX'; -- 706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (291, '07:35', 1080), (291, '10:05', 2030), (291, '11:45', 2260), (291, '14:30', 2190), (291, '17:15', 570), (291, '20:30', 1310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 292, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MAN'; -- 1033 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (292, '07:55', 7430), (292, '10:10', 1190), (292, '13:50', 1220), (292, '17:05', 3660), (292, '19:45', 1240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 293, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'EDI'; -- 970 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (293, '07:20', 1780), (293, '10:05', 300), (293, '12:50', 4840), (293, '14:40', 720), (293, '17:10', 2820), (293, '19:30', 620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 294, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'DUB'; -- 1253 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (294, '07:05', 989370), (294, '08:40', 47030), (294, '11:25', 1120), (294, '13:30', 890), (294, '16:20', 660), (294, '18:35', 1580), (294, '20:35', 445360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 295, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'CDG'; -- 1157 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (295, '07:20', 3220), (295, '09:45', 3760), (295, '11:05', 3530), (295, '13:55', 3630), (295, '16:10', 4100), (295, '17:40', 1480), (295, '20:30', 810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 296, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'NCE'; -- 1597 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (296, '08:25', 2790), (296, '10:30', 837200), (296, '14:15', 1140), (296, '16:00', 2840), (296, '19:25', 4530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 297, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BRU'; -- 906 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (297, '07:00', 1660), (297, '09:40', 3380), (297, '11:20', 1440), (297, '14:10', 2090), (297, '15:25', 1390), (297, '18:35', 4530), (297, '20:40', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 298, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'FRA'; -- 884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (298, '07:45', 3160), (298, '10:10', 4320), (298, '13:25', 438240), (298, '16:35', 2870), (298, '19:30', 3230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 299, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MUC'; -- 1037 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (299, '07:55', 470), (299, '10:00', 79580), (299, '14:15', 1460), (299, '17:05', 4000), (299, '19:10', 470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 300, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'ZRH'; -- 1163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (300, '08:00', 3180), (300, '09:45', 3890), (300, '11:50', 2060), (300, '14:30', 340), (300, '17:35', 1870), (300, '19:45', 4080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 301, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'VIE'; -- 1101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (301, '06:30', 3050), (301, '08:45', 450), (301, '12:05', 180), (301, '14:05', 4750), (301, '16:35', 2250), (301, '17:35', 365840), (301, '20:45', 4890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 302, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'WAW'; -- 824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (302, '07:10', 1470), (302, '09:10', 1960), (302, '13:10', 4450), (302, '15:25', 2750), (302, '16:55', 2340), (302, '19:40', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 303, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BCN'; -- 1959 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (303, '08:20', 690), (303, '11:05', 10640), (303, '13:30', 1140), (303, '17:30', 68710), (303, '20:45', 3410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 304, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MAD'; -- 2220 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (304, '08:00', 4390), (304, '10:50', 1690), (304, '13:15', 4020), (304, '16:45', 872210), (304, '19:55', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 305, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'AGP'; -- 2641 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (305, '06:35', 3670), (305, '09:50', 3200), (305, '12:05', 1570), (305, '13:55', 4630), (305, '16:20', 2750), (305, '17:40', 2390), (305, '20:15', 3790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 306, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'PMI'; -- 2129 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (306, '07:10', 640), (306, '08:45', 430), (306, '11:25', 1580), (306, '13:30', 89760), (306, '16:10', 2950), (306, '18:10', 392290), (306, '19:45', 2910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 307, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'LPA'; -- 3946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (307, '07:00', 1380), (307, '10:25', 3970), (307, '13:05', 1220), (307, '15:25', 1710), (307, '17:30', 14050), (307, '19:55', 4590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 308, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'FCO'; -- 1765 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (308, '07:45', 1600), (308, '09:55', 3720), (308, '14:15', 330), (308, '17:25', 935130), (308, '19:05', 2690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 309, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MXP'; -- 1361 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (309, '07:30', 3770), (309, '10:15', 3090), (309, '12:00', 1440), (309, '14:35', 700), (309, '18:10', 11880), (309, '20:05', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 310, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'ATH'; -- 2352 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (310, '07:30', 3220), (310, '09:20', 2420), (310, '11:45', 4500), (310, '13:45', 640420), (310, '15:30', 3970), (310, '18:25', 2040), (310, '21:00', 2330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 311, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'DXB'; -- 4943 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (311, '08:05', 460), (311, '11:10', 3800), (311, '13:00', 820), (311, '17:45', 220), (311, '19:40', 1490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 312, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'BKK'; -- 8634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (312, '07:45', 3670), (312, '09:10', 2010), (312, '12:10', 3350), (312, '15:25', 3660), (312, '17:45', 438650), (312, '19:35', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 313, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'JFK'; -- 6080 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (313, '06:50', 9750), (313, '09:40', 3120), (313, '11:20', 4840), (313, '13:25', 1450), (313, '16:15', 460), (313, '18:45', 2020), (313, '20:20', 2210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 314, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'EWR'; -- 6097 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (314, '06:30', 530), (314, '09:30', 1810), (314, '11:35', 3190), (314, '13:15', 957100), (314, '15:30', 3880), (314, '18:10', 98360), (314, '20:25', 680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 315, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'ORD'; -- 6710 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (315, '07:45', 3340), (315, '10:30', 1730), (315, '12:45', 2840), (315, '14:45', 2970), (315, '17:25', 1410), (315, '20:05', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 316, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'MIA'; -- 7757 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (316, '08:00', 1720), (316, '10:00', 2960), (316, '12:00', 1740), (316, '15:20', 580), (316, '17:40', 2790), (316, '20:00', 75870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 317, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'LAX'; -- 8839 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (317, '07:00', 4450), (317, '10:30', 1890), (317, '12:30', 3390), (317, '15:00', 25000), (317, '17:55', 4710), (317, '20:40', 44220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 318, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'GOT' AND t.iata = 'YYZ'; -- 6139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (318, '07:15', 881100), (318, '09:55', 13820), (318, '13:00', 14730), (318, '14:40', 760), (318, '17:00', 870), (318, '20:40', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 319, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BMA'; -- 504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (319, '07:20', 71960), (319, '09:30', 1860), (319, '11:55', 2060), (319, '14:15', 386940), (319, '15:45', 558390), (319, '18:35', 2210), (319, '20:55', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 320, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'GOT'; -- 246 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (320, '07:55', 2540), (320, '09:40', 2120), (320, '12:40', 732520), (320, '14:30', 4920), (320, '17:35', 2600), (320, '20:05', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 321, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'LLA'; -- 1208 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (321, '06:30', 3080), (321, '09:50', 1380), (321, '11:50', 3310), (321, '13:30', 95530), (321, '15:45', 4030), (321, '17:55', 1480), (321, '19:55', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 322, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'VBY'; -- 385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (322, '07:25', 1130), (322, '09:20', 1240), (322, '11:40', 4740), (322, '13:10', 230), (322, '15:30', 45810), (322, '18:45', 4240), (322, '20:05', 29600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 323, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'UME'; -- 995 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (323, '07:25', 1420), (323, '10:30', 2550), (323, '13:50', 1380), (323, '17:05', 3180), (323, '19:35', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 324, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'OSD'; -- 853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (324, '07:45', 1570), (324, '10:00', 1760), (324, '14:40', 750), (324, '17:10', 4600), (324, '19:40', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 325, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'KRN'; -- 1412 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (325, '07:40', 3110), (325, '10:40', 2770), (325, '14:15', 540), (325, '16:20', 840), (325, '20:15', 1800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 326, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'OSL'; -- 534 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (326, '06:55', 1790), (326, '08:40', 1870), (326, '12:00', 3850), (326, '13:30', 3920), (326, '16:15', 3470), (326, '18:10', 620), (326, '20:15', 4710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 327, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BGO'; -- 714 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (327, '06:40', 540), (327, '09:40', 350), (327, '12:10', 210740), (327, '14:35', 1510), (327, '18:20', 1400), (327, '20:05', 830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 328, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'CPH'; -- 46 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (328, '07:10', 1720), (328, '10:00', 540), (328, '12:50', 4770), (328, '17:15', 4860), (328, '20:10', 3920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 329, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'AAL'; -- 277 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (329, '07:15', 4660), (329, '08:45', 3350), (329, '11:40', 3760), (329, '14:10', 2480), (329, '15:50', 900), (329, '18:15', 554080), (329, '20:25', 80340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 330, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'HEL'; -- 864 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (330, '07:10', 3790), (330, '10:20', 1880), (330, '14:05', 2070), (330, '16:10', 2580), (330, '20:45', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 331, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'KEF'; -- 2184 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (331, '07:30', 3010), (331, '10:05', 33400), (331, '14:00', 610), (331, '17:25', 710), (331, '19:05', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 332, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'RIX'; -- 672 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (332, '07:20', 1470), (332, '09:10', 1850), (332, '12:40', 2020), (332, '15:45', 520), (332, '18:00', 4880), (332, '20:20', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 333, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'LHR'; -- 1017 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (333, '06:30', 90030), (333, '09:55', 1430), (333, '11:45', 1400), (333, '14:20', 2200), (333, '16:05', 1000), (333, '18:05', 30550), (333, '19:50', 4880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 334, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'MAN'; -- 1038 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (334, '07:40', 4270), (334, '08:55', 2090), (334, '11:15', 85020), (334, '13:10', 528320), (334, '16:00', 2860), (334, '18:30', 2490), (334, '20:20', 408540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 335, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'EDI'; -- 1046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (335, '06:45', 3820), (335, '09:45', 83150), (335, '12:45', 3780), (335, '15:15', 3340), (335, '17:15', 4930), (335, '20:25', 41680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 336, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'DUB'; -- 1284 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (336, '08:15', 1980), (336, '11:25', 2520), (336, '14:25', 83810), (336, '17:10', 320), (336, '19:25', 1980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 337, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'CDG'; -- 1032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (337, '06:40', 1580), (337, '09:55', 92610), (337, '13:50', 94270), (337, '17:00', 490), (337, '20:45', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 338, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'NCE'; -- 1392 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (338, '06:50', 360), (338, '10:05', 2450), (338, '13:10', 300260), (338, '16:15', 4850), (338, '19:10', 290290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 339, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'AMS'; -- 668 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (339, '06:55', 3320), (339, '09:30', 4790), (339, '12:45', 1730), (339, '15:05', 679980), (339, '17:50', 4810), (339, '20:00', 2350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 340, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BRU'; -- 784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (340, '07:05', 119950), (340, '10:40', 770), (340, '13:20', 97010), (340, '16:05', 4690), (340, '19:25', 260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 341, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'FRA'; -- 692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (341, '06:55', 160), (341, '10:35', 29490), (341, '13:00', 360), (341, '16:55', 841800), (341, '19:10', 3540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 342, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'MUC'; -- 807 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (342, '07:05', 11780), (342, '10:55', 530750), (342, '13:55', 34050), (342, '17:20', 4520), (342, '20:50', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 343, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BER'; -- 353 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (343, '07:50', 2900), (343, '10:00', 540), (343, '13:05', 3400), (343, '16:30', 4500), (343, '19:55', 4600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 344, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'ZRH'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (344, '06:40', 492120), (344, '09:50', 857230), (344, '12:15', 2020), (344, '14:55', 4420), (344, '17:05', 3110), (344, '20:55', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 345, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'VIE'; -- 855 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (345, '07:50', 546480), (345, '10:15', 3430), (345, '12:35', 83970), (345, '15:10', 2910), (345, '18:05', 3830), (345, '19:45', 940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 346, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'PRG'; -- 608 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (346, '07:00', 4790), (346, '10:00', 1230), (346, '12:50', 2770), (346, '15:10', 5000), (346, '18:00', 1050), (346, '20:25', 740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 347, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'WAW'; -- 623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (347, '07:20', 770890), (347, '10:25', 1390), (347, '12:55', 340), (347, '15:35', 239830), (347, '17:15', 4430), (347, '20:05', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 348, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BCN'; -- 1784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (348, '07:20', 193050), (348, '09:30', 2620), (348, '12:40', 610), (348, '15:20', 2410), (348, '17:35', 3930), (348, '20:30', 2190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 349, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'AGP'; -- 2494 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (349, '07:35', 1070), (349, '09:50', 3700), (349, '12:40', 2600), (349, '15:05', 3240), (349, '17:30', 2760), (349, '19:30', 3190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 350, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'PMI'; -- 1944 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (350, '07:35', 1360), (350, '08:50', 1220), (350, '11:05', 1980), (350, '13:20', 38730), (350, '16:00', 1990), (350, '18:05', 1460), (350, '20:50', 51620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 351, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'LPA'; -- 3833 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (351, '06:50', 2120), (351, '09:30', 4060), (351, '11:55', 4930), (351, '14:05', 3750), (351, '16:15', 2160), (351, '18:35', 4950), (351, '20:15', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 352, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'FCO'; -- 1530 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (352, '07:45', 1170), (352, '10:20', 950), (352, '14:40', 1560), (352, '16:00', 4050), (352, '19:20', 11430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 353, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'MXP'; -- 1149 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (353, '07:55', 3710), (353, '10:05', 620), (353, '12:25', 864450), (353, '14:20', 780), (353, '18:05', 1560), (353, '19:40', 450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 354, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'ATH'; -- 2111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (354, '08:00', 4720), (354, '10:45', 3930), (354, '14:35', 1600), (354, '16:05', 1020), (354, '20:10', 2350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 355, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'IST'; -- 1942 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (355, '07:40', 3310), (355, '09:50', 215580), (355, '12:15', 956230), (355, '15:00', 4250), (355, '18:10', 4020), (355, '20:10', 2660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 356, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'DXB'; -- 4774 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (356, '07:55', 4830), (356, '11:25', 4840), (356, '14:35', 23360), (356, '17:10', 2400), (356, '19:40', 2760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 357, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'BKK'; -- 8593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (357, '07:20', 1040), (357, '10:30', 4000), (357, '12:00', 4000), (357, '15:15', 4610), (357, '17:45', 3440), (357, '20:35', 2770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 358, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'JFK'; -- 6233 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (358, '07:25', 340), (358, '10:05', 880), (358, '12:45', 4910), (358, '14:30', 1870), (358, '18:15', 4510), (358, '20:10', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 359, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'EWR'; -- 6252 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (359, '07:00', 1250), (359, '09:00', 1480), (359, '11:25', 460), (359, '14:20', 48640), (359, '16:00', 3540), (359, '18:05', 243270), (359, '20:45', 900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 360, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'ORD'; -- 6895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (360, '07:20', 3020), (360, '10:00', 4820), (360, '12:40', 1620), (360, '15:25', 4320), (360, '18:10', 3110), (360, '20:15', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 361, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'MIA'; -- 7891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (361, '07:15', 420), (361, '09:40', 1520), (361, '11:35', 490), (361, '13:30', 66470), (361, '16:00', 89760), (361, '18:35', 2050), (361, '20:35', 4640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 362, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'LAX'; -- 9064 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (362, '06:45', 2930), (362, '09:40', 2080), (362, '12:25', 707290), (362, '15:30', 4170), (362, '17:35', 3850), (362, '19:30', 14370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 363, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'MMX' AND t.iata = 'YYZ'; -- 6312 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (363, '06:40', 4900), (363, '08:55', 4560), (363, '11:25', 3520), (363, '13:10', 2220), (363, '16:35', 4150), (363, '18:05', 3620), (363, '20:20', 950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 364, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BMA'; -- 721 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (364, '07:35', 4950), (364, '09:15', 1090), (364, '11:45', 2530), (364, '13:15', 2130), (364, '15:20', 4300), (364, '18:15', 1540), (364, '19:45', 4930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 365, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'GOT'; -- 1015 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (365, '07:10', 2870), (365, '11:10', 3910), (365, '13:15', 4580), (365, '16:35', 3810), (365, '20:10', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 366, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MMX'; -- 1208 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (366, '07:25', 2340), (366, '09:15', 520), (366, '11:45', 85830), (366, '13:50', 529900), (366, '15:30', 1770), (366, '18:35', 1990), (366, '20:30', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 367, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'VBY'; -- 898 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (367, '06:45', 1260), (367, '10:25', 3950), (367, '13:05', 801370), (367, '17:10', 197690), (367, '19:45', 1980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 368, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'UME'; -- 213 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (368, '07:35', 1710), (368, '09:55', 510), (368, '13:55', 111300), (368, '16:10', 1070), (368, '20:15', 4700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 369, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'OSD'; -- 450 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (369, '07:55', 419490), (369, '09:45', 940290), (369, '13:25', 1430), (369, '17:45', 4410), (369, '19:55', 1710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 370, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BGO'; -- 1031 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (370, '07:55', 2920), (370, '09:30', 3610), (370, '11:55', 910740), (370, '15:45', 4040), (370, '18:05', 3100), (370, '19:40', 2090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 371, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'TRD'; -- 583 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (371, '06:35', 315290), (371, '09:50', 1270), (371, '11:20', 3960), (371, '13:40', 1440), (371, '15:45', 1660), (371, '17:50', 42990), (371, '20:55', 4170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 372, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'CPH'; -- 1215 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (372, '07:35', 4880), (372, '11:20', 2580), (372, '14:15', 980), (372, '16:15', 1990), (372, '19:45', 814110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 373, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'AAL'; -- 1141 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (373, '07:55', 30880), (373, '10:00', 2590), (373, '13:05', 3080), (373, '14:30', 3880), (373, '17:20', 1270), (373, '19:55', 2540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 374, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'HEL'; -- 598 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (374, '07:00', 776340), (374, '09:05', 262730), (374, '11:50', 4330), (374, '14:00', 410), (374, '16:25', 820), (374, '18:30', 4750), (374, '20:30', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 375, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'KEF'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (375, '08:10', 4670), (375, '11:00', 3090), (375, '14:20', 4880), (375, '17:40', 2000), (375, '19:25', 1630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 376, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'TLL'; -- 696 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (376, '07:40', 1150), (376, '09:30', 1550), (376, '11:20', 1620), (376, '13:25', 507490), (376, '15:55', 3990), (376, '18:30', 3790), (376, '20:30', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 377, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'RIX'; -- 963 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (377, '07:00', 1040), (377, '08:50', 1180), (377, '11:25', 220), (377, '13:25', 2030), (377, '16:05', 647110), (377, '18:45', 4490), (377, '19:55', 3210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 378, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'LHR'; -- 2018 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (378, '06:55', 480), (378, '10:20', 1460), (378, '14:05', 2770), (378, '17:15', 513040), (378, '19:50', 1730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 379, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MAN'; -- 1910 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (379, '07:55', 276370), (379, '09:55', 2690), (379, '11:50', 580), (379, '15:25', 4510), (379, '17:35', 3740), (379, '20:55', 2890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 380, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'EDI'; -- 1728 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (380, '07:15', 1370), (380, '09:00', 2830), (380, '11:35', 950830), (380, '14:15', 1140), (380, '15:40', 3800), (380, '18:05', 4940), (380, '21:00', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 381, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'DUB'; -- 2061 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (381, '08:20', 4850), (381, '10:10', 2210), (381, '14:40', 2390), (381, '17:40', 2710), (381, '20:35', 1490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 382, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'CDG'; -- 2162 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (382, '07:00', 2810), (382, '08:55', 340), (382, '11:10', 210), (382, '13:15', 4890), (382, '15:50', 1360), (382, '18:15', 3260), (382, '20:20', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 383, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'NCE'; -- 2600 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (383, '06:50', 2670), (383, '10:25', 3260), (383, '12:40', 750), (383, '14:40', 2930), (383, '17:35', 88980), (383, '19:50', 68160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 384, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BRU'; -- 1913 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (384, '07:30', 4050), (384, '09:50', 3140), (384, '11:05', 320), (384, '13:55', 2550), (384, '16:30', 847800), (384, '18:05', 1060), (384, '20:10', 3290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 385, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'FRA'; -- 1893 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (385, '07:20', 1600), (385, '09:50', 750), (385, '12:10', 98870), (385, '13:25', 1680), (385, '15:20', 69050), (385, '18:20', 1230), (385, '20:25', 24100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 386, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MUC'; -- 2005 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (386, '07:35', 2320), (386, '09:05', 1360), (386, '12:00', 85760), (386, '14:00', 2990), (386, '16:35', 690), (386, '18:25', 1160), (386, '19:55', 14260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 387, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BER'; -- 1542 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (387, '07:15', 2600), (387, '08:40', 180), (387, '11:15', 1320), (387, '13:35', 17470), (387, '16:10', 910), (387, '17:50', 36320), (387, '20:00', 2960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 388, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'PRG'; -- 1776 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (388, '07:05', 2960), (388, '10:10', 570), (388, '13:05', 2220), (388, '15:20', 618520), (388, '17:40', 3500), (388, '20:05', 2320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 389, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'WAW'; -- 1488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (389, '06:40', 3850), (389, '09:10', 2860), (389, '11:40', 3760), (389, '14:15', 9210), (389, '16:25', 4020), (389, '18:45', 1640), (389, '20:40', 1690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 390, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BCN'; -- 2974 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (390, '07:40', 2860), (390, '10:55', 4080), (390, '13:35', 2380), (390, '16:50', 670), (390, '20:40', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 391, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MAD'; -- 3222 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (391, '06:50', 1540), (391, '08:55', 4910), (391, '12:05', 430), (391, '14:00', 4720), (391, '16:35', 297400), (391, '18:50', 1960), (391, '20:55', 3190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 392, f.id, t.id, 305 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'AGP'; -- 3648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (392, '06:45', 280), (392, '10:15', 360), (392, '12:00', 3490), (392, '15:30', 1420), (392, '16:55', 927230), (392, '20:15', 3290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 393, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'LPA'; -- 4918 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (393, '06:35', 230820), (393, '09:15', 550), (393, '12:00', 1420), (393, '13:40', 2730), (393, '15:20', 4450), (393, '17:45', 2800), (393, '20:30', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 394, f.id, t.id, 300 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'LIS'; -- 3583 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (394, '06:40', 190), (394, '09:35', 4410), (394, '11:10', 12110), (394, '14:20', 98900), (394, '16:25', 3060), (394, '17:50', 2480), (394, '20:00', 4370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 395, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'FCO'; -- 2711 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (395, '07:25', 4290), (395, '10:15', 22150), (395, '12:10', 90410), (395, '14:50', 330), (395, '17:50', 2760), (395, '20:40', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 396, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MXP'; -- 2357 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (396, '07:05', 3950), (396, '10:05', 1830), (396, '13:00', 350), (396, '14:30', 1470), (396, '16:55', 520), (396, '20:30', 4540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 397, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'ATH'; -- 3071 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (397, '07:50', 4990), (397, '09:10', 84060), (397, '13:05', 940), (397, '15:05', 230), (397, '17:50', 4950), (397, '19:50', 61580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 398, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'IST'; -- 2732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (398, '06:50', 1910), (398, '09:50', 260), (398, '13:10', 2180), (398, '14:30', 920), (398, '17:15', 3870), (398, '20:05', 86310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 399, f.id, t.id, 410 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'DXB'; -- 5054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (399, '06:55', 953780), (399, '09:45', 2330), (399, '11:35', 94180), (399, '13:50', 10190), (399, '15:45', 4800), (399, '18:25', 3800), (399, '20:00', 440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 400, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'BKK'; -- 8101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (400, '06:45', 660), (400, '09:20', 3300), (400, '12:40', 824310), (400, '15:00', 340), (400, '17:05', 76060), (400, '19:50', 90530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 401, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'EWR'; -- 6228 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (401, '07:45', 2640), (401, '11:05', 300), (401, '13:15', 1340), (401, '17:20', 4440), (401, '20:05', 3790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 402, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'ORD'; -- 6646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (402, '08:00', 4460), (402, '09:15', 2840), (402, '11:55', 2020), (402, '14:20', 2280), (402, '17:30', 2070), (402, '20:35', 3050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 403, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'MIA'; -- 7960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (403, '06:50', 470), (403, '10:35', 87750), (403, '13:05', 1360), (403, '15:45', 4330), (403, '18:20', 580), (403, '19:45', 412460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 404, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'LAX'; -- 8443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (404, '06:45', 4250), (404, '11:15', 750), (404, '13:15', 1340), (404, '16:15', 3280), (404, '19:30', 180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 405, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'LLA' AND t.iata = 'YYZ'; -- 6162 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (405, '06:45', 3250), (405, '08:40', 10480), (405, '11:50', 350), (405, '13:20', 650), (405, '15:55', 4580), (405, '18:35', 64390), (405, '20:05', 4070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 406, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'ARN'; -- 223 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (406, '06:50', 572450), (406, '09:45', 1120), (406, '11:20', 1970), (406, '14:00', 1160), (406, '15:35', 1970), (406, '18:05', 1770), (406, '20:55', 67780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 407, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'GOT'; -- 360 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (407, '07:10', 1410), (407, '09:20', 3690), (407, '12:20', 235380), (407, '15:40', 3510), (407, '17:05', 4700), (407, '20:10', 2630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 408, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MMX'; -- 385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (408, '07:35', 1310), (408, '10:30', 4080), (408, '14:05', 1520), (408, '16:25', 342250), (408, '19:40', 1600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 409, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'LLA'; -- 898 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (409, '07:30', 3070), (409, '10:15', 3890), (409, '12:50', 2730), (409, '17:20', 1370), (409, '19:10', 1330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 410, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'UME'; -- 690 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (410, '07:40', 52880), (410, '10:00', 3070), (410, '13:45', 160), (410, '17:45', 450), (410, '20:00', 46790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 411, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'OSD'; -- 650 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (411, '07:30', 1170), (411, '09:35', 544890), (411, '12:05', 620), (411, '13:40', 834530), (411, '16:05', 4810), (411, '18:05', 2130), (411, '20:40', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 412, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'KRN'; -- 1134 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (412, '07:20', 1170), (412, '10:20', 4050), (412, '12:15', 3660), (412, '15:45', 32050), (412, '17:35', 36200), (412, '20:40', 4180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 413, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'OSL'; -- 502 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (413, '08:15', 76140), (413, '10:55', 600), (413, '13:20', 987070), (413, '17:20', 932270), (413, '20:00', 63540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 414, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BGO'; -- 806 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (414, '08:20', 1380), (414, '10:40', 1580), (414, '13:55', 230), (414, '16:45', 3350), (414, '20:15', 4270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 415, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'TRD'; -- 761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (415, '07:25', 2280), (415, '09:45', 430), (415, '11:00', 4880), (415, '14:00', 310), (415, '15:50', 2570), (415, '18:35', 3330), (415, '20:35', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 416, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'CPH'; -- 416 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (416, '06:55', 4170), (416, '10:00', 910), (416, '11:45', 2280), (416, '15:40', 3080), (416, '17:40', 2560), (416, '19:55', 541920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 417, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'AAL'; -- 513 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (417, '06:45', 4260), (417, '09:55', 62910), (417, '11:45', 1020), (417, '15:00', 3610), (417, '17:00', 560), (417, '20:55', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 418, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'HEL'; -- 480 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (418, '07:40', 4930), (418, '09:30', 1750), (418, '10:55', 4380), (418, '14:15', 440090), (418, '15:55', 4080), (418, '18:30', 19720), (418, '19:45', 52270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 419, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'KEF'; -- 2283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (419, '07:00', 1870), (419, '09:25', 2990), (419, '11:50', 769300), (419, '14:10', 2020), (419, '15:40', 3800), (419, '18:10', 236100), (419, '20:15', 2580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 420, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'TLL'; -- 423 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (420, '07:05', 3560), (420, '09:45', 330), (420, '11:10', 2280), (420, '13:20', 790020), (420, '16:00', 4350), (420, '18:45', 242340), (420, '20:05', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 421, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'RIX'; -- 347 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (421, '06:50', 4280), (421, '10:20', 4500), (421, '12:20', 1990), (421, '15:45', 2120), (421, '17:00', 2340), (421, '19:55', 3740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 422, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'LHR'; -- 1387 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (422, '06:30', 1830), (422, '08:45', 2110), (422, '11:15', 2450), (422, '13:25', 873880), (422, '16:20', 2710), (422, '18:25', 473730), (422, '20:40', 1850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 423, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MAN'; -- 1378 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (423, '08:15', 670), (423, '10:20', 2950), (423, '14:35', 1920), (423, '16:00', 240), (423, '19:40', 4370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 424, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'EDI'; -- 1330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (424, '06:30', 3080), (424, '08:40', 4280), (424, '11:55', 4800), (424, '13:50', 2120), (424, '16:15', 470780), (424, '17:45', 2640), (424, '19:50', 3610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 425, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'DUB'; -- 1607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (425, '07:45', 1260), (425, '11:15', 2430), (425, '14:40', 2010), (425, '16:55', 1510), (425, '19:20', 4540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 426, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'CDG'; -- 1417 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (426, '07:15', 4230), (426, '10:10', 3700), (426, '11:50', 4840), (426, '15:00', 4650), (426, '18:10', 3490), (426, '19:35', 3030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 427, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'NCE'; -- 1738 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (427, '08:10', 56090), (427, '10:45', 890), (427, '13:50', 3460), (427, '17:05', 4020), (427, '19:35', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 428, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'AMS'; -- 1049 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (428, '06:40', 230), (428, '09:50', 600), (428, '12:55', 2080), (428, '17:15', 330), (428, '19:05', 1160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 429, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BRU'; -- 1169 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (429, '08:00', 3200), (429, '10:15', 3950), (429, '14:05', 817040), (429, '16:25', 845210), (429, '19:55', 709700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 430, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'FRA'; -- 1061 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (430, '07:45', 1540), (430, '11:05', 2400), (430, '14:15', 4710), (430, '16:30', 1190), (430, '20:50', 3330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 431, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MUC'; -- 1123 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (431, '07:15', 4990), (431, '09:15', 4360), (431, '11:55', 95010), (431, '14:50', 16740), (431, '17:35', 2280), (431, '20:25', 82220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 432, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BER'; -- 664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (432, '07:40', 2830), (432, '09:45', 1280), (432, '13:15', 4250), (432, '16:55', 2690), (432, '19:30', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 433, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'ZRH'; -- 1311 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (433, '06:50', 1280), (433, '09:10', 4300), (433, '11:45', 1740), (433, '14:35', 62280), (433, '17:50', 587170), (433, '19:55', 2430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 434, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'VIE'; -- 1069 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (434, '06:45', 14770), (434, '08:55', 230), (434, '11:20', 68340), (434, '13:35', 840), (434, '15:55', 2010), (434, '18:30', 440), (434, '19:45', 4780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 435, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'PRG'; -- 882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (435, '07:25', 2440), (435, '09:40', 1240), (435, '12:55', 550), (435, '14:40', 923470), (435, '18:00', 4490), (435, '20:05', 4560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 436, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'WAW'; -- 633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (436, '08:00', 2900), (436, '10:50', 240), (436, '14:00', 4240), (436, '16:00', 2210), (436, '20:20', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 437, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BCN'; -- 2153 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (437, '06:45', 2360), (437, '09:45', 4120), (437, '11:20', 51220), (437, '13:20', 4000), (437, '15:55', 1300), (437, '18:10', 124650), (437, '20:10', 540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 438, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MAD'; -- 2466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (438, '06:55', 3780), (438, '09:00', 38640), (438, '11:30', 2090), (438, '14:05', 61540), (438, '16:20', 2340), (438, '17:50', 2220), (438, '20:35', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 439, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'AGP'; -- 2874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (439, '07:45', 4610), (439, '09:40', 260), (439, '12:45', 330), (439, '15:10', 35020), (439, '18:15', 3410), (439, '19:55', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 440, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'PMI'; -- 2305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (440, '06:40', 39400), (440, '08:40', 3040), (440, '12:00', 1790), (440, '13:40', 4750), (440, '15:35', 2980), (440, '18:05', 2320), (440, '19:50', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 441, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'LPA'; -- 4218 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (441, '07:00', 4130), (441, '10:15', 2730), (441, '12:55', 3210), (441, '16:00', 3380), (441, '20:50', 1140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 442, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'LIS'; -- 2887 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (442, '07:40', 1790), (442, '11:20', 339050), (442, '14:15', 4040), (442, '17:35', 550), (442, '19:30', 41650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 443, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'FCO'; -- 1815 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (443, '07:25', 99990), (443, '09:30', 883680), (443, '11:45', 3950), (443, '15:00', 800), (443, '17:25', 82630), (443, '19:45', 1800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 444, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MXP'; -- 1490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (444, '06:50', 2130), (444, '10:05', 2160), (444, '12:35', 3440), (444, '14:55', 439590), (444, '18:10', 660), (444, '20:05', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 445, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'ATH'; -- 2230 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (445, '06:45', 2720), (445, '10:20', 2670), (445, '13:30', 850180), (445, '16:45', 613730), (445, '20:30', 3290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 446, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'IST'; -- 1967 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (446, '07:20', 1960), (446, '10:30', 115660), (446, '14:30', 89310), (446, '17:30', 263960), (446, '20:45', 3530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 447, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'DXB'; -- 4636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (447, '06:35', 640), (447, '09:40', 67260), (447, '10:55', 664810), (447, '14:15', 964150), (447, '15:50', 2690), (447, '18:15', 36010), (447, '20:55', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 448, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'BKK'; -- 8274 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (448, '08:15', 29980), (448, '10:15', 3960), (448, '13:00', 4260), (448, '16:25', 2650), (448, '19:05', 3800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 449, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'JFK'; -- 6410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (449, '07:05', 3280), (449, '09:35', 1010), (449, '12:50', 2560), (449, '15:00', 55440), (449, '18:20', 3850), (449, '20:30', 4130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 450, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'EWR'; -- 6426 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (450, '08:10', 1760), (450, '11:05', 2350), (450, '13:40', 4650), (450, '16:30', 1940), (450, '19:05', 64850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 451, f.id, t.id, 555 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'ORD'; -- 7006 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (451, '07:00', 3990), (451, '11:15', 95120), (451, '13:50', 3600), (451, '16:30', 1960), (451, '19:40', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 452, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'MIA'; -- 8098 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (452, '08:00', 1330), (452, '10:10', 1060), (452, '13:10', 2950), (452, '17:45', 24530), (452, '19:25', 2080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 453, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'LAX'; -- 9058 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (453, '08:00', 81110), (453, '10:10', 3390), (453, '13:05', 1060), (453, '16:05', 1690), (453, '19:55', 4620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 454, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'VBY' AND t.iata = 'YYZ'; -- 6450 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (454, '07:05', 4670), (454, '09:25', 280), (454, '12:00', 200), (454, '14:30', 2340), (454, '17:00', 1930), (454, '19:30', 1420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 455, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BMA'; -- 509 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (455, '07:10', 4840), (455, '09:30', 3800), (455, '12:50', 4310), (455, '14:30', 81140), (455, '17:00', 2390), (455, '19:45', 2410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 456, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'GOT'; -- 806 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (456, '06:45', 4680), (456, '09:25', 50420), (456, '11:15', 2980), (456, '14:00', 1960), (456, '16:25', 710), (456, '18:05', 2360), (456, '20:00', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 457, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MMX'; -- 995 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (457, '07:35', 570), (457, '09:45', 3850), (457, '11:40', 2560), (457, '14:10', 5000), (457, '15:45', 2330), (457, '18:50', 4890), (457, '20:50', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 458, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'LLA'; -- 213 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (458, '07:30', 3590), (458, '08:45', 4370), (458, '12:05', 84630), (458, '13:50', 3020), (458, '16:30', 1440), (458, '17:45', 3320), (458, '20:00', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 459, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'VBY'; -- 690 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (459, '07:45', 2790), (459, '09:40', 1310), (459, '12:35', 2780), (459, '14:20', 3020), (459, '17:00', 3960), (459, '19:30', 220650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 460, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'OSD'; -- 294 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (460, '07:55', 3370), (460, '09:25', 2740), (460, '13:00', 3760), (460, '14:20', 460), (460, '17:30', 2290), (460, '20:55', 2250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 461, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'KRN'; -- 448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (461, '07:35', 2470), (461, '09:45', 597740), (461, '11:45', 8100), (461, '14:25', 866530), (461, '17:10', 4100), (461, '19:55', 300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 462, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'OSL'; -- 624 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (462, '06:55', 4660), (462, '10:40', 530), (462, '12:55', 2490), (462, '17:20', 260), (462, '19:25', 4920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 463, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BGO'; -- 873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (463, '06:50', 3790), (463, '08:55', 3470), (463, '11:55', 3060), (463, '13:45', 51380), (463, '15:45', 558460), (463, '18:00', 1400), (463, '19:55', 1630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 464, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'TRD'; -- 463 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (464, '07:20', 2960), (464, '10:25', 377700), (464, '12:50', 86080), (464, '17:05', 97380), (464, '19:10', 1220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 465, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'CPH'; -- 1003 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (465, '06:35', 1840), (465, '09:25', 4430), (465, '10:55', 1800), (465, '14:05', 4730), (465, '16:20', 2060), (465, '18:30', 1710), (465, '19:45', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 466, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'AAL'; -- 937 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (466, '07:20', 9000), (466, '09:15', 980), (466, '12:10', 750), (466, '13:10', 1340), (466, '16:05', 4280), (466, '18:30', 300290), (466, '20:40', 3360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 467, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'HEL'; -- 456 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (467, '07:20', 29410), (467, '09:25', 2700), (467, '10:55', 2670), (467, '13:45', 2660), (467, '16:35', 870), (467, '18:50', 4020), (467, '20:05', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 468, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'KEF'; -- 2060 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (468, '06:50', 3630), (468, '09:55', 417770), (468, '13:10', 4180), (468, '16:20', 701280), (468, '19:05', 450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 469, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'TLL'; -- 543 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (469, '07:15', 966140), (469, '10:25', 4640), (469, '12:30', 4160), (469, '15:00', 30450), (469, '17:00', 4440), (469, '20:15', 56620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 470, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'RIX'; -- 790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (470, '07:25', 143230), (470, '11:10', 4780), (470, '14:05', 2790), (470, '16:05', 820), (470, '19:55', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 471, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'LHR'; -- 1827 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (471, '06:55', 2520), (471, '09:50', 300), (471, '12:55', 1940), (471, '15:05', 750), (471, '18:00', 3070), (471, '20:40', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 472, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MAN'; -- 1732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (472, '07:35', 2520), (472, '09:00', 4870), (472, '12:00', 2420), (472, '14:15', 440), (472, '16:35', 910), (472, '18:10', 1850), (472, '20:40', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 473, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'EDI'; -- 1568 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (473, '08:05', 1900), (473, '11:05', 2540), (473, '13:30', 400), (473, '17:20', 273000), (473, '19:30', 1200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 474, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'DUB'; -- 1897 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (474, '07:10', 515340), (474, '09:55', 2710), (474, '12:00', 210), (474, '13:10', 2680), (474, '16:25', 4290), (474, '17:55', 4660), (474, '20:30', 2430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 475, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'CDG'; -- 1958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (475, '07:45', 3700), (475, '10:35', 1470), (475, '12:50', 46320), (475, '17:00', 4520), (475, '19:20', 4310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 476, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'NCE'; -- 2387 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (476, '07:45', 3670), (476, '08:45', 15830), (476, '11:50', 702180), (476, '14:05', 4740), (476, '16:35', 2700), (476, '18:30', 3900), (476, '20:15', 3710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 477, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'AMS'; -- 1561 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (477, '06:50', 2400), (477, '08:55', 3120), (477, '11:20', 3450), (477, '13:55', 617770), (477, '15:40', 735380), (477, '18:25', 3070), (477, '19:45', 1870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 478, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BRU'; -- 1708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (478, '07:10', 946280), (478, '10:25', 3690), (478, '12:05', 3130), (478, '15:15', 4290), (478, '18:20', 2870), (478, '19:30', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 479, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'FRA'; -- 1681 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (479, '07:05', 790), (479, '09:30', 1100), (479, '12:45', 1630), (479, '14:50', 700), (479, '17:20', 1260), (479, '20:20', 625890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 480, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MUC'; -- 1792 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (480, '07:35', 2920), (480, '09:30', 4670), (480, '11:05', 2850), (480, '14:15', 320), (480, '16:20', 2020), (480, '17:50', 2100), (480, '20:10', 400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 481, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BER'; -- 1329 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (481, '07:20', 863040), (481, '10:45', 4840), (481, '14:35', 1460), (481, '16:50', 4150), (481, '20:00', 10950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 482, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'ZRH'; -- 1952 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (482, '07:55', 73380), (482, '11:25', 2890), (482, '14:25', 1700), (482, '16:05', 4960), (482, '19:40', 4870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 483, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'VIE'; -- 1758 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (483, '07:50', 283160), (483, '10:25', 664430), (483, '12:00', 487140), (483, '15:10', 4370), (483, '18:00', 1250), (483, '19:55', 903790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 484, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'PRG'; -- 1564 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (484, '06:35', 290), (484, '09:50', 340), (484, '13:00', 1980), (484, '15:05', 2300), (484, '17:05', 4190), (484, '20:10', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 485, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'WAW'; -- 1293 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (485, '07:50', 52230), (485, '09:45', 1920), (485, '12:30', 840), (485, '14:50', 4930), (485, '17:30', 1250), (485, '19:30', 3560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 486, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BCN'; -- 2764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (486, '07:35', 160), (486, '10:25', 4050), (486, '12:40', 1260), (486, '15:15', 190), (486, '17:20', 1110), (486, '20:30', 2210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 487, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MAD'; -- 3020 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (487, '06:40', 4240), (487, '09:20', 1420), (487, '11:45', 98940), (487, '13:30', 4610), (487, '15:45', 98260), (487, '17:55', 760), (487, '19:45', 3450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 488, f.id, t.id, 290 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'AGP'; -- 3444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (488, '07:30', 1680), (488, '09:40', 49360), (488, '11:40', 1870), (488, '13:25', 3770), (488, '15:45', 905960), (488, '18:25', 4750), (488, '20:30', 2940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 489, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'PMI'; -- 2931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (489, '08:20', 906530), (489, '11:25', 3770), (489, '14:00', 1780), (489, '16:15', 4620), (489, '20:15', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 490, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'LPA'; -- 4726 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (490, '08:20', 550), (490, '10:05', 390890), (490, '13:35', 4920), (490, '17:45', 4810), (490, '19:50', 14880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 491, f.id, t.id, 285 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'LIS'; -- 3390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (491, '07:45', 2290), (491, '10:25', 219470), (491, '13:35', 270), (491, '17:40', 2260), (491, '19:05', 4230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 492, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'FCO'; -- 2500 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (492, '06:40', 360), (492, '10:10', 2300), (492, '11:45', 75710), (492, '15:40', 3520), (492, '17:10', 880), (492, '20:15', 3560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 493, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MXP'; -- 2144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (493, '08:00', 1320), (493, '10:35', 1100), (493, '14:15', 1510), (493, '16:05', 1060), (493, '20:40', 4340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 494, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'ATH'; -- 2885 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (494, '07:15', 2740), (494, '09:45', 2520), (494, '13:50', 600340), (494, '16:20', 3080), (494, '20:30', 4730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 495, f.id, t.id, 405 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'DXB'; -- 4981 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (495, '07:05', 4260), (495, '09:45', 88070), (495, '13:10', 3790), (495, '16:35', 4920), (495, '19:15', 3420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 496, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'BKK'; -- 8177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (496, '07:25', 27270), (496, '09:55', 1920), (496, '14:00', 4810), (496, '17:45', 1180), (496, '20:50', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 497, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'JFK'; -- 6216 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (497, '06:50', 574170), (497, '10:20', 2450), (497, '11:45', 648450), (497, '14:45', 3120), (497, '18:10', 2050), (497, '20:35', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 498, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'EWR'; -- 6229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (498, '07:15', 2620), (498, '09:10', 2990), (498, '11:55', 99440), (498, '13:40', 260), (498, '15:30', 3940), (498, '18:50', 3250), (498, '19:45', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 499, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'ORD'; -- 6689 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (499, '07:30', 810), (499, '11:30', 2620), (499, '14:15', 4490), (499, '16:15', 1760), (499, '19:45', 4750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 500, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'MIA'; -- 7950 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (500, '06:55', 2620), (500, '08:55', 2160), (500, '12:10', 2760), (500, '13:35', 8050), (500, '15:55', 1440), (500, '17:55', 410), (500, '20:40', 3020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 501, f.id, t.id, 670 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'LAX'; -- 8557 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (501, '07:45', 4230), (501, '10:25', 4790), (501, '12:55', 2440), (501, '15:45', 1030), (501, '17:55', 1960), (501, '20:45', 28730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 502, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'UME' AND t.iata = 'YYZ'; -- 6185 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (502, '07:25', 2960), (502, '09:45', 680230), (502, '11:20', 3170), (502, '13:50', 64680), (502, '15:30', 880960), (502, '17:35', 1170), (502, '20:00', 1760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 503, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BMA'; -- 465 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (503, '06:30', 350), (503, '09:35', 93690), (503, '11:00', 4650), (503, '13:50', 1180), (503, '15:45', 3430), (503, '17:50', 1580), (503, '20:10', 4850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 504, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'GOT'; -- 626 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (504, '07:50', 2450), (504, '10:00', 4550), (504, '12:35', 3510), (504, '14:45', 4480), (504, '17:45', 3870), (504, '20:10', 1620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 505, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MMX'; -- 853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (505, '07:35', 349150), (505, '10:25', 4670), (505, '12:05', 3340), (505, '14:45', 592710), (505, '18:15', 4050), (505, '20:45', 4370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 506, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'LLA'; -- 450 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (506, '08:15', 390), (506, '09:50', 4940), (506, '13:05', 1180), (506, '17:00', 43780), (506, '20:35', 1480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 507, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'VBY'; -- 650 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (507, '07:20', 2520), (507, '10:10', 567800), (507, '12:20', 4200), (507, '14:40', 2750), (507, '17:50', 4630), (507, '20:45', 18480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 508, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'UME'; -- 294 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (508, '06:35', 882390), (508, '09:25', 493430), (508, '11:55', 4400), (508, '14:20', 813500), (508, '17:50', 4760), (508, '20:10', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 509, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'KRN'; -- 580 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (509, '07:10', 1590), (509, '09:25', 4330), (509, '13:10', 680430), (509, '15:45', 1390), (509, '17:05', 1320), (509, '20:50', 1630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 510, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'TRD'; -- 181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (510, '07:30', 2540), (510, '10:30', 4490), (510, '14:25', 2350), (510, '16:45', 2950), (510, '19:55', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 511, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'CPH'; -- 848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (511, '07:50', 1370), (511, '11:05', 150), (511, '14:20', 350), (511, '17:15', 1430), (511, '20:10', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 512, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'AAL'; -- 725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (512, '07:20', 550), (512, '09:05', 4430), (512, '11:50', 2480), (512, '14:05', 1230), (512, '16:35', 733170), (512, '18:00', 1760), (512, '20:45', 301050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 513, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'HEL'; -- 635 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (513, '06:30', 3870), (513, '09:55', 80400), (513, '11:00', 3080), (513, '14:20', 1990), (513, '15:35', 2050), (513, '18:35', 328040), (513, '20:15', 2740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 514, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'KEF'; -- 1812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (514, '07:35', 880), (514, '09:15', 2580), (514, '11:45', 66600), (514, '13:35', 790), (514, '16:30', 4250), (514, '18:40', 670), (514, '20:10', 1330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 515, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'TLL'; -- 692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (515, '07:10', 1970), (515, '08:45', 1230), (515, '11:25', 830), (515, '14:10', 3860), (515, '16:35', 4110), (515, '18:35', 702380), (515, '19:55', 690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 516, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'RIX'; -- 871 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (516, '07:45', 386650), (516, '09:40', 3150), (516, '13:10', 3770), (516, '14:40', 3190), (516, '17:25', 3710), (516, '19:30', 82840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 517, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'LHR'; -- 1574 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (517, '07:25', 1190), (517, '10:35', 4480), (517, '13:25', 620), (517, '17:35', 81460), (517, '19:35', 400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 518, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MAN'; -- 1461 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (518, '06:35', 2960), (518, '10:30', 1330), (518, '13:10', 4800), (518, '14:50', 3770), (518, '18:20', 3250), (518, '20:50', 226450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 519, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'CDG'; -- 1736 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (519, '07:10', 2650), (519, '09:20', 1060), (519, '11:05', 452360), (519, '13:50', 1710), (519, '16:10', 1820), (519, '17:50', 3670), (519, '20:35', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 520, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'NCE'; -- 2221 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (520, '07:05', 3970), (520, '09:55', 3720), (520, '12:25', 4150), (520, '14:55', 3320), (520, '17:15', 4490), (520, '19:45', 3760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 521, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'AMS'; -- 1337 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (521, '07:25', 1950), (521, '09:25', 4340), (521, '12:00', 2440), (521, '15:25', 40720), (521, '17:15', 24240), (521, '20:45', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 522, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BRU'; -- 1491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (522, '08:15', 860), (522, '10:20', 3360), (522, '12:55', 1140), (522, '17:40', 2020), (522, '19:50', 119790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 523, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'FRA'; -- 1506 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (523, '07:05', 9090), (523, '10:35', 410), (523, '12:55', 2410), (523, '15:10', 53520), (523, '18:15', 1140), (523, '20:40', 3110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 524, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MUC'; -- 1658 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (524, '08:15', 36620), (524, '11:00', 2490), (524, '14:05', 2850), (524, '17:20', 520), (524, '19:20', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 525, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BER'; -- 1205 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (525, '06:45', 1410), (525, '09:25', 4120), (525, '13:00', 2880), (525, '15:20', 4170), (525, '17:50', 4090), (525, '19:45', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 526, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'ZRH'; -- 1787 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (526, '07:25', 1770), (526, '08:50', 1980), (526, '12:00', 1940), (526, '14:20', 3430), (526, '16:00', 940), (526, '17:55', 4290), (526, '19:45', 54450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 527, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'VIE'; -- 1682 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (527, '07:20', 1540), (527, '08:45', 4630), (527, '11:10', 1260), (527, '14:00', 18880), (527, '15:35', 2150), (527, '18:45', 4530), (527, '20:30', 4290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 528, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'PRG'; -- 1456 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (528, '08:20', 373540), (528, '10:50', 4230), (528, '14:20', 1500), (528, '16:00', 2040), (528, '19:25', 310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 529, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'WAW'; -- 1283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (529, '06:30', 49600), (529, '09:25', 1700), (529, '12:00', 1930), (529, '13:30', 3510), (529, '15:30', 1030), (529, '17:50', 3450), (529, '19:55', 3080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 530, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BCN'; -- 2566 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (530, '07:00', 4220), (530, '09:55', 860), (530, '12:00', 2300), (530, '14:05', 93610), (530, '15:20', 3180), (530, '18:40', 1660), (530, '20:50', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 531, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'AGP'; -- 3219 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (531, '06:50', 3990), (531, '08:45', 3810), (531, '12:05', 4300), (531, '14:10', 4840), (531, '16:20', 4480), (531, '17:40', 1810), (531, '20:25', 4700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 532, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'PMI'; -- 2742 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (532, '07:35', 1640), (532, '10:15', 2800), (532, '12:40', 3190), (532, '15:30', 2590), (532, '18:20', 3070), (532, '19:45', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 533, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'LPA'; -- 4473 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (533, '07:50', 4370), (533, '09:50', 3360), (533, '13:05', 4820), (533, '15:25', 4460), (533, '17:00', 3650), (533, '20:25', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 534, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'LIS'; -- 3139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (534, '08:05', 4110), (534, '11:10', 4090), (534, '14:35', 937790), (534, '16:40', 2290), (534, '19:35', 67380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 535, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'FCO'; -- 2383 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (535, '07:10', 1310), (535, '11:15', 2650), (535, '14:30', 85960), (535, '16:00', 1500), (535, '19:50', 330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 536, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'ATH'; -- 2879 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (536, '07:30', 4520), (536, '10:15', 2950), (536, '14:15', 29020), (536, '17:15', 470), (536, '19:40', 190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 537, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'IST'; -- 2610 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (537, '07:05', 179020), (537, '10:30', 4040), (537, '13:10', 2330), (537, '14:30', 3160), (537, '17:25', 1210), (537, '20:35', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 538, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'DXB'; -- 5163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (538, '07:40', 3800), (538, '09:35', 43880), (538, '11:20', 970080), (538, '14:10', 249310), (538, '16:05', 890), (538, '18:40', 289200), (538, '20:35', 4040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 539, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'BKK'; -- 8464 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (539, '07:40', 1610), (539, '09:35', 730), (539, '11:30', 4090), (539, '14:20', 2090), (539, '15:35', 2620), (539, '18:20', 409690), (539, '20:00', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 540, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'JFK'; -- 5975 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (540, '07:00', 1870), (540, '09:40', 1120), (540, '12:55', 2220), (540, '15:25', 1390), (540, '17:10', 1410), (540, '20:15', 310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 541, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'EWR'; -- 5988 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (541, '07:50', 1420), (541, '10:00', 3880), (541, '12:00', 800), (541, '15:20', 50830), (541, '17:30', 2230), (541, '20:45', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 542, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'ORD'; -- 6486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (542, '07:15', 94560), (542, '09:50', 2260), (542, '13:45', 4370), (542, '17:00', 4410), (542, '20:45', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 543, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'MIA'; -- 7700 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (543, '06:55', 2800), (543, '09:40', 610), (543, '11:50', 731770), (543, '13:50', 881860), (543, '16:15', 4130), (543, '17:40', 1460), (543, '20:55', 800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 544, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'LAX'; -- 8440 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (544, '08:00', 1020), (544, '10:40', 250400), (544, '13:35', 2660), (544, '17:30', 2060), (544, '19:45', 163130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 545, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'OSD' AND t.iata = 'YYZ'; -- 5964 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (545, '07:30', 79480), (545, '08:40', 3310), (545, '11:50', 3840), (545, '13:10', 1190), (545, '16:35', 1800), (545, '18:00', 1740), (545, '20:00', 1520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 546, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'ARN'; -- 916 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (546, '07:15', 4380), (546, '09:45', 4410), (546, '14:20', 210), (546, '17:15', 4070), (546, '19:50', 3770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 547, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BMA'; -- 949 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (547, '07:35', 2910), (547, '09:50', 273730), (547, '12:20', 894800), (547, '14:20', 1360), (547, '17:25', 2990), (547, '20:45', 953330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 548, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'GOT'; -- 1198 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (548, '06:40', 880), (548, '09:30', 4140), (548, '11:50', 1180), (548, '14:35', 530), (548, '17:35', 910), (548, '20:30', 1530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 549, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MMX'; -- 1412 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (549, '08:00', 4570), (549, '10:10', 4190), (549, '13:15', 8260), (549, '16:40', 329200), (549, '20:05', 2530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 550, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'VBY'; -- 1134 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (550, '06:35', 4090), (550, '09:10', 4520), (550, '11:45', 4780), (550, '13:30', 1740), (550, '16:10', 3500), (550, '18:10', 1200), (550, '20:30', 2380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 551, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'UME'; -- 448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (551, '07:05', 30420), (551, '10:10', 692160), (551, '13:05', 4900), (551, '17:40', 1570), (551, '19:40', 2330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 552, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'OSD'; -- 580 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (552, '07:45', 2860), (552, '10:20', 831300), (552, '14:00', 1020), (552, '16:15', 1080), (552, '20:05', 2620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 553, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'OSL'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (553, '07:45', 880), (553, '09:55', 77410), (553, '11:50', 1700), (553, '13:35', 650), (553, '16:00', 4950), (553, '18:45', 88580), (553, '20:40', 74670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 554, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BGO'; -- 1109 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (554, '08:15', 931340), (554, '10:35', 1310), (554, '13:05', 340), (554, '17:45', 850), (554, '20:10', 3460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 555, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'TRD'; -- 648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (555, '06:55', 4380), (555, '09:40', 3220), (555, '11:10', 1480), (555, '14:15', 637740), (555, '15:40', 300), (555, '18:05', 550470), (555, '20:50', 2810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 556, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'CPH'; -- 1413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (556, '07:25', 4170), (556, '08:40', 410), (556, '11:40', 3270), (556, '14:20', 4480), (556, '16:05', 3790), (556, '18:35', 614240), (556, '20:35', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 557, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'KEF'; -- 1953 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (557, '06:35', 3540), (557, '09:35', 2880), (557, '12:05', 1440), (557, '15:15', 2830), (557, '17:05', 3200), (557, '20:40', 4430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 558, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'TLL'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (558, '07:30', 300), (558, '09:55', 208010), (558, '11:00', 230), (558, '13:25', 892670), (558, '15:35', 4110), (558, '18:05', 4970), (558, '19:45', 143850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 559, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'RIX'; -- 1226 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (559, '07:00', 189000), (559, '09:40', 638860), (559, '13:10', 536380), (559, '15:10', 1720), (559, '17:35', 420), (559, '19:30', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 560, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MAN'; -- 2004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (560, '07:05', 4620), (560, '09:55', 2360), (560, '12:15', 3720), (560, '15:25', 290), (560, '17:50', 3920), (560, '20:25', 700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 561, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'EDI'; -- 1790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (561, '07:35', 32100), (561, '11:10', 400), (561, '14:30', 720), (561, '16:05', 370), (561, '19:40', 4420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 562, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'DUB'; -- 2126 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (562, '07:25', 4190), (562, '08:45', 2750), (562, '11:00', 420), (562, '14:10', 225670), (562, '16:35', 2910), (562, '18:10', 4760), (562, '19:55', 270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 563, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'CDG'; -- 2314 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (563, '07:45', 2490), (563, '09:35', 2680), (563, '12:15', 3100), (563, '14:55', 1620), (563, '17:35', 2440), (563, '20:25', 911520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 564, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'NCE'; -- 2795 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (564, '07:00', 2540), (564, '10:10', 1650), (564, '14:00', 3370), (564, '16:55', 4500), (564, '20:50', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 565, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'AMS'; -- 1916 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (565, '07:05', 1470), (565, '11:05', 1270), (565, '13:35', 250), (565, '17:10', 1460), (565, '20:05', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 566, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BRU'; -- 2071 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (566, '08:05', 340), (566, '10:25', 3840), (566, '14:05', 4310), (566, '17:25', 590), (566, '20:15', 251860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 567, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MUC'; -- 2218 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (567, '06:40', 1620), (567, '09:20', 730), (567, '13:00', 4400), (567, '14:35', 2180), (567, '17:00', 2150), (567, '19:40', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 568, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BER'; -- 1757 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (568, '07:35', 63740), (568, '11:20', 4390), (568, '13:30', 48050), (568, '16:05', 2460), (568, '20:10', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 569, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'ZRH'; -- 2361 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (569, '07:15', 54340), (569, '09:35', 1360), (569, '12:05', 1580), (569, '15:00', 1490), (569, '17:10', 1450), (569, '20:10', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 570, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'VIE'; -- 2202 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (570, '06:45', 2590), (570, '10:05', 1790), (570, '11:50', 5000), (570, '14:25', 4350), (570, '17:50', 4870), (570, '20:40', 985730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 571, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'PRG'; -- 1999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (571, '06:45', 26520), (571, '10:45', 610), (571, '13:30', 311380), (571, '16:15', 3430), (571, '20:15', 430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 572, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'WAW'; -- 1741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (572, '07:05', 2450), (572, '08:55', 460), (572, '12:00', 62240), (572, '13:20', 4850), (572, '15:20', 1400), (572, '17:35', 2670), (572, '19:45', 3940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 573, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BCN'; -- 3147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (573, '07:05', 1680), (573, '11:30', 1770), (573, '12:55', 530), (573, '16:15', 1640), (573, '20:15', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 574, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MAD'; -- 3365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (574, '07:20', 3900), (574, '09:10', 1550), (574, '11:50', 1550), (574, '13:45', 4420), (574, '15:20', 1780), (574, '18:10', 1420), (574, '19:50', 952230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 575, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'AGP'; -- 3795 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (575, '07:05', 4500), (575, '09:55', 1110), (575, '14:35', 3370), (575, '17:05', 4170), (575, '20:35', 20710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 576, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'PMI'; -- 3322 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (576, '08:00', 597620), (576, '10:50', 4770), (576, '13:00', 502440), (576, '16:00', 1400), (576, '20:15', 1660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 577, f.id, t.id, 405 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'LPA'; -- 5027 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (577, '07:15', 4580), (577, '10:10', 63340), (577, '12:00', 1680), (577, '14:35', 360), (577, '18:00', 2840), (577, '20:40', 4750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 578, f.id, t.id, 305 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'LIS'; -- 3699 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (578, '07:45', 970), (578, '10:55', 3530), (578, '12:55', 880), (578, '16:40', 3040), (578, '19:55', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 579, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'FCO'; -- 2934 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (579, '07:40', 1680), (579, '10:40', 4180), (579, '13:40', 4320), (579, '16:20', 4140), (579, '19:15', 88150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 580, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MXP'; -- 2557 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (580, '06:50', 3100), (580, '10:35', 3470), (580, '12:00', 1470), (580, '15:30', 2490), (580, '17:10', 632560), (580, '20:35', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 581, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'ATH'; -- 3330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (581, '07:45', 841530), (581, '10:15', 2500), (581, '13:05', 77020), (581, '16:30', 4250), (581, '19:45', 78560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 582, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'IST'; -- 2996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (582, '07:30', 3830), (582, '09:50', 3950), (582, '10:55', 64730), (582, '13:45', 1370), (582, '16:20', 3350), (582, '17:55', 1900), (582, '20:45', 3820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 583, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'DXB'; -- 5290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (583, '07:15', 3220), (583, '08:40', 3380), (583, '11:15', 260), (583, '13:55', 1850), (583, '16:35', 1310), (583, '18:50', 3920), (583, '20:40', 280760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 584, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'BKK'; -- 8198 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (584, '06:45', 1850), (584, '09:40', 40890), (584, '11:05', 1260), (584, '13:55', 3860), (584, '15:25', 3560), (584, '18:10', 4400), (584, '20:00', 3820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 585, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'JFK'; -- 6046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (585, '07:45', 920), (585, '11:20', 3110), (585, '13:35', 800), (585, '16:55', 79500), (585, '19:50', 3410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 586, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'EWR'; -- 6056 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (586, '07:15', 3510), (586, '09:20', 2560), (586, '12:35', 4530), (586, '14:20', 2470), (586, '17:00', 1460), (586, '20:35', 593930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 587, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'ORD'; -- 6437 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (587, '06:35', 855670), (587, '09:20', 19530), (587, '11:55', 1490), (587, '13:35', 66380), (587, '16:35', 4700), (587, '18:05', 35640), (587, '19:55', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 588, f.id, t.id, 615 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'MIA'; -- 7796 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (588, '07:40', 4000), (588, '10:40', 2800), (588, '14:30', 3420), (588, '16:05', 3440), (588, '20:20', 2760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 589, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'LAX'; -- 8189 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (589, '07:00', 1730), (589, '10:15', 940), (589, '12:30', 3380), (589, '14:55', 3020), (589, '17:05', 2240), (589, '19:55', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 590, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'KRN' AND t.iata = 'YYZ'; -- 5969 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (590, '07:20', 903330), (590, '09:50', 4550), (590, '14:40', 313250), (590, '17:40', 4810), (590, '19:15', 4310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 591, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BMA'; -- 394 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (591, '07:25', 4670), (591, '08:50', 4590), (591, '11:20', 4710), (591, '13:20', 2240), (591, '16:30', 700), (591, '17:45', 1230), (591, '20:00', 4990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 592, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'GOT'; -- 288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (592, '07:05', 3090), (592, '09:20', 4820), (592, '11:45', 9570), (592, '13:45', 312210), (592, '15:40', 3620), (592, '17:45', 4090), (592, '19:55', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 593, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MMX'; -- 534 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (593, '07:05', 1460), (593, '09:45', 860), (593, '12:35', 2720), (593, '14:20', 1830), (593, '17:20', 4990), (593, '19:35', 705700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 594, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'VBY'; -- 502 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (594, '06:45', 3980), (594, '09:35', 4990), (594, '11:55', 4230), (594, '14:30', 651020), (594, '17:25', 2840), (594, '19:35', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 595, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'UME'; -- 624 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (595, '07:20', 1360), (595, '09:05', 4330), (595, '12:00', 1610), (595, '13:25', 1620), (595, '15:30', 4070), (595, '18:25', 2090), (595, '20:10', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 596, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'KRN'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (596, '06:55', 3720), (596, '09:30', 3930), (596, '11:10', 4960), (596, '13:15', 1490), (596, '16:35', 791210), (596, '18:10', 2340), (596, '20:00', 54820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 597, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'CPH'; -- 516 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (597, '07:40', 42740), (597, '09:50', 750), (597, '11:05', 4700), (597, '14:10', 1130), (597, '16:00', 690), (597, '18:15', 34180), (597, '20:15', 347050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 598, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'AAL'; -- 352 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (598, '07:35', 4050), (598, '09:10', 3210), (598, '12:10', 880), (598, '14:00', 1070), (598, '16:05', 90330), (598, '18:10', 4460), (598, '21:00', 510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 599, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'TLL'; -- 771 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (599, '06:30', 2680), (599, '08:45', 1080), (599, '11:15', 4370), (599, '13:50', 4240), (599, '15:50', 3370), (599, '18:45', 3320), (599, '19:50', 3320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 600, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'RIX'; -- 829 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (600, '06:50', 80070), (600, '10:25', 4470), (600, '12:10', 134820), (600, '14:55', 640), (600, '17:35', 520), (600, '20:20', 72580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 601, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'LHR'; -- 1205 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (601, '07:10', 940), (601, '09:35', 18120), (601, '11:45', 960), (601, '13:35', 191320), (601, '15:35', 1840), (601, '17:50', 2980), (601, '20:35', 1340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 602, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MAN'; -- 1111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (602, '07:45', 1370), (602, '09:10', 161850), (602, '12:05', 330), (602, '13:30', 2670), (602, '16:25', 20850), (602, '17:45', 2340), (602, '20:10', 8240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 603, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'EDI'; -- 970 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (603, '07:15', 210), (603, '10:30', 4100), (603, '14:00', 860), (603, '17:00', 747650), (603, '19:35', 4330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 604, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'DUB'; -- 1290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (604, '07:30', 342600), (604, '11:20', 900), (604, '13:25', 2760), (604, '17:40', 850), (604, '19:50', 3160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 605, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'CDG'; -- 1357 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (605, '07:20', 1750), (605, '11:15', 4340), (605, '14:10', 2470), (605, '16:10', 3100), (605, '19:10', 460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 606, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'NCE'; -- 1856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (606, '07:05', 1730), (606, '09:25', 4740), (606, '12:25', 1770), (606, '14:20', 3710), (606, '17:05', 2770), (606, '20:05', 3860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 607, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'AMS'; -- 959 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (607, '07:20', 1450), (607, '09:10', 4020), (607, '11:50', 1050), (607, '15:25', 19220), (607, '18:05', 87610), (607, '19:40', 9760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 608, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BRU'; -- 1112 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (608, '06:50', 30090), (608, '09:05', 4720), (608, '11:30', 75690), (608, '14:00', 1250), (608, '15:35', 4950), (608, '18:20', 3530), (608, '20:00', 3190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 609, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'FRA'; -- 1141 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (609, '06:40', 1080), (609, '09:20', 2710), (609, '11:35', 60970), (609, '13:10', 170), (609, '16:30', 43480), (609, '18:50', 1510), (609, '19:55', 94580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 610, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MUC'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (610, '08:00', 1860), (610, '10:00', 4140), (610, '14:00', 440), (610, '17:40', 4680), (610, '20:20', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 611, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BER'; -- 882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (611, '07:15', 3020), (611, '09:10', 600), (611, '11:20', 4420), (611, '13:30', 67270), (611, '15:55', 32900), (611, '17:40', 2620), (611, '19:50', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 612, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'ZRH'; -- 1425 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (612, '07:05', 650), (612, '10:35', 4630), (612, '12:50', 1000), (612, '15:25', 701600), (612, '17:35', 4440), (612, '20:15', 4650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 613, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'VIE'; -- 1388 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (613, '07:50', 2620), (613, '09:45', 3050), (613, '14:40', 3720), (613, '17:00', 4120), (613, '19:20', 24760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 614, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'PRG'; -- 1139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (614, '07:40', 3720), (614, '09:50', 4640), (614, '12:15', 947890), (614, '15:10', 3790), (614, '18:10', 403210), (614, '20:10', 391410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 615, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'WAW'; -- 1078 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (615, '07:55', 130250), (615, '10:25', 4200), (615, '13:05', 4900), (615, '14:40', 1020), (615, '17:35', 3250), (615, '19:30', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 616, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BCN'; -- 2190 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (616, '07:15', 910), (616, '10:40', 190), (616, '13:25', 6080), (616, '16:05', 2050), (616, '19:40', 10540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 617, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MAD'; -- 2413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (617, '07:40', 44860), (617, '11:25', 10570), (617, '13:05', 1510), (617, '17:45', 2640), (617, '20:35', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 618, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'AGP'; -- 2841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (618, '06:45', 52850), (618, '08:45', 1840), (618, '11:05', 603220), (618, '13:35', 3810), (618, '15:25', 1840), (618, '18:45', 420900), (618, '19:45', 284720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 619, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'PMI'; -- 2368 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (619, '07:25', 3220), (619, '09:55', 350), (619, '12:40', 460), (619, '14:50', 4700), (619, '18:10', 1460), (619, '19:55', 720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 620, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'LPA'; -- 4105 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (620, '07:50', 720), (620, '11:00', 1350), (620, '12:50', 3630), (620, '17:30', 2080), (620, '19:25', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 621, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'LIS'; -- 2769 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (621, '08:10', 1590), (621, '10:45', 820), (621, '14:05', 3510), (621, '17:35', 1280), (621, '19:35', 56120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 622, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'FCO'; -- 2046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (622, '07:55', 4960), (622, '10:45', 96360), (622, '13:55', 950), (622, '17:15', 4280), (622, '19:50', 2210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 623, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MXP'; -- 1627 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (623, '07:40', 4320), (623, '09:05', 3210), (623, '11:40', 860), (623, '13:20', 580), (623, '16:30', 1600), (623, '17:55', 29550), (623, '20:00', 4670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 624, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'ATH'; -- 2634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (624, '06:55', 98640), (624, '09:55', 340), (624, '13:25', 218420), (624, '16:25', 69730), (624, '20:35', 497510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 625, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'IST'; -- 2426 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (625, '07:50', 54520), (625, '09:50', 3420), (625, '12:50', 170), (625, '16:55', 4900), (625, '19:45', 3800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 626, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'DXB'; -- 5137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (626, '06:50', 1180), (626, '11:20', 3690), (626, '14:15', 370), (626, '16:05', 2460), (626, '20:40', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 627, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'BKK'; -- 8671 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (627, '08:10', 2580), (627, '09:50', 4010), (627, '13:30', 3200), (627, '17:15', 2980), (627, '20:45', 4710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 628, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'EWR'; -- 5933 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (628, '07:10', 98590), (628, '09:20', 3820), (628, '12:50', 45010), (628, '14:40', 4490), (628, '17:05', 610), (628, '20:05', 3580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 629, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'ORD'; -- 6504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (629, '07:55', 1090), (629, '09:25', 770), (629, '12:40', 3200), (629, '14:45', 40810), (629, '17:35', 4200), (629, '20:10', 20040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 630, f.id, t.id, 600 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'MIA'; -- 7616 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (630, '07:35', 1900), (630, '09:35', 3440), (630, '12:05', 960), (630, '13:50', 3610), (630, '15:25', 980), (630, '18:50', 47930), (630, '20:05', 510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 631, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'OSL' AND t.iata = 'LAX'; -- 8581 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (631, '08:10', 3990), (631, '11:15', 4150), (631, '14:20', 1410), (631, '17:40', 1230), (631, '19:20', 480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 632, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'ARN'; -- 709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (632, '06:45', 2500), (632, '09:15', 330), (632, '11:50', 689950), (632, '13:45', 822500), (632, '16:00', 2330), (632, '18:00', 4490), (632, '20:05', 4180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 633, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'BMA'; -- 718 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (633, '07:10', 4920), (633, '11:15', 3620), (633, '14:30', 720), (633, '16:35', 117810), (633, '20:15', 2030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 634, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'GOT'; -- 499 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (634, '06:55', 470), (634, '09:00', 1690), (634, '12:00', 818000), (634, '14:15', 4440), (634, '15:40', 2240), (634, '18:30', 4740), (634, '20:05', 4990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 635, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MMX'; -- 714 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (635, '07:40', 1050), (635, '10:00', 4450), (635, '13:15', 1340), (635, '16:50', 830), (635, '19:25', 900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 636, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'LLA'; -- 1031 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (636, '07:45', 3310), (636, '09:10', 3830), (636, '11:35', 2360), (636, '14:00', 2510), (636, '16:35', 3710), (636, '18:15', 2360), (636, '20:05', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 637, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'VBY'; -- 806 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (637, '07:45', 2340), (637, '09:15', 1150), (637, '11:15', 2280), (637, '13:20', 324250), (637, '15:55', 457850), (637, '18:45', 1920), (637, '19:45', 13400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 638, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'UME'; -- 873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (638, '07:15', 2270), (638, '09:45', 2640), (638, '12:00', 834750), (638, '14:15', 810), (638, '16:20', 830), (638, '17:35', 3590), (638, '21:00', 3210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 639, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'KRN'; -- 1109 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (639, '07:35', 605530), (639, '09:55', 2260), (639, '12:25', 2980), (639, '14:45', 3270), (639, '17:05', 1610), (639, '19:30', 47300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 640, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'TRD'; -- 462 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (640, '07:25', 1290), (640, '09:45', 4930), (640, '13:00', 3570), (640, '14:50', 2640), (640, '18:00', 1110), (640, '20:05', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 641, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'CPH'; -- 679 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (641, '07:30', 2230), (641, '08:45', 3030), (641, '12:00', 1150), (641, '14:20', 540), (641, '16:35', 4950), (641, '18:45', 3340), (641, '20:15', 3420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 642, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'AAL'; -- 445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (642, '07:30', 4720), (642, '09:40', 1860), (642, '12:35', 19580), (642, '15:10', 900), (642, '18:05', 71600), (642, '20:35', 610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 643, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'HEL'; -- 1083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (643, '07:45', 4730), (643, '09:30', 4250), (643, '12:50', 1680), (643, '14:30', 3330), (643, '18:05', 640140), (643, '20:10', 967880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 644, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'KEF'; -- 1490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (644, '07:20', 1870), (644, '10:20', 526290), (644, '12:30', 89280), (644, '15:15', 4960), (644, '17:25', 1600), (644, '19:50', 942430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 645, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'TLL'; -- 1095 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (645, '06:40', 840), (645, '09:40', 704990), (645, '11:15', 36590), (645, '13:45', 4860), (645, '16:20', 760), (645, '18:00', 4350), (645, '20:10', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 646, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'RIX'; -- 1144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (646, '07:05', 890), (646, '08:50', 4750), (646, '11:15', 4270), (646, '14:20', 3070), (646, '16:05', 2060), (646, '17:45', 2610), (646, '19:55', 690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 647, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'LHR'; -- 1042 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (647, '08:15', 3330), (647, '11:15', 4180), (647, '13:40', 46490), (647, '17:45', 2810), (647, '20:10', 1380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 648, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MAN'; -- 895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (648, '07:50', 236710), (648, '11:30', 1990), (648, '12:55', 2000), (648, '17:10', 4000), (648, '20:40', 860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 649, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'EDI'; -- 697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (649, '07:45', 3450), (649, '09:45', 2320), (649, '11:00', 2650), (649, '13:45', 3500), (649, '16:25', 1520), (649, '17:55', 1930), (649, '20:40', 988940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 650, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'DUB'; -- 1031 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (650, '07:15', 2050), (650, '11:00', 1260), (650, '14:30', 3280), (650, '16:00', 3890), (650, '20:05', 4400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 651, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'CDG'; -- 1266 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (651, '07:20', 2560), (651, '09:45', 330), (651, '12:10', 25660), (651, '13:15', 2190), (651, '15:45', 1490), (651, '18:20', 9880), (651, '20:30', 477030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 652, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'NCE'; -- 1854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (652, '07:05', 864720), (652, '10:05', 3630), (652, '13:05', 4380), (652, '14:20', 4670), (652, '17:50', 62360), (652, '20:00', 92220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 653, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'AMS'; -- 888 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (653, '06:45', 1490), (653, '10:00', 1100), (653, '14:10', 3830), (653, '16:30', 2360), (653, '20:20', 630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 654, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'BRU'; -- 1045 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (654, '07:40', 89260), (654, '09:45', 2410), (654, '11:35', 4210), (654, '14:10', 750), (654, '15:35', 967390), (654, '18:45', 4520), (654, '20:40', 4920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 655, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'FRA'; -- 1160 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (655, '06:50', 1120), (655, '10:10', 1100), (655, '12:45', 1420), (655, '15:45', 65970), (655, '18:05', 3480), (655, '20:50', 6980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 656, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'BER'; -- 1016 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (656, '07:10', 1290), (656, '09:10', 540), (656, '12:30', 3460), (656, '15:35', 1650), (656, '18:10', 3900), (656, '20:35', 1780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 657, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'ZRH'; -- 1443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (657, '08:10', 1620), (657, '11:00', 998370), (657, '13:45', 4700), (657, '16:05', 4710), (657, '20:20', 1760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 658, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'VIE'; -- 1538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (658, '06:35', 672760), (658, '09:20', 1880), (658, '12:35', 3740), (658, '15:35', 1450), (658, '17:30', 3560), (658, '20:05', 2190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 659, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'PRG'; -- 1267 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (659, '06:55', 3670), (659, '09:25', 340), (659, '11:45', 650), (659, '13:55', 2410), (659, '15:55', 1170), (659, '18:50', 402000), (659, '20:35', 1140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 660, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'WAW'; -- 1322 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (660, '07:15', 4240), (660, '09:00', 150990), (660, '12:00', 1360), (660, '13:10', 2780), (660, '15:45', 53290), (660, '17:40', 1630), (660, '19:45', 2470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 661, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'BCN'; -- 2123 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (661, '07:20', 4530), (661, '09:50', 3030), (661, '11:40', 1430), (661, '13:20', 3180), (661, '16:15', 4690), (661, '18:50', 4470), (661, '20:45', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 662, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MAD'; -- 2283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (662, '07:40', 4460), (662, '10:15', 1380), (662, '12:55', 24910), (662, '14:35', 2090), (662, '16:55', 26300), (662, '20:10', 912700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 663, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'PMI'; -- 2313 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (663, '06:35', 52560), (663, '09:35', 4290), (663, '11:50', 4210), (663, '14:20', 2370), (663, '15:30', 1710), (663, '17:45', 3750), (663, '20:55', 2170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 664, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'LPA'; -- 3919 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (664, '07:05', 1280), (664, '09:30', 3860), (664, '12:15', 2970), (664, '14:45', 770), (664, '17:35', 4970), (664, '19:50', 3100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 665, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'LIS'; -- 2594 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (665, '07:05', 1640), (665, '08:55', 4460), (665, '11:45', 3790), (665, '14:20', 11670), (665, '15:30', 3320), (665, '18:00', 1910), (665, '20:40', 810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 666, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'FCO'; -- 2111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (666, '08:15', 2190), (666, '10:25', 3090), (666, '13:15', 4790), (666, '17:05', 4130), (666, '20:10', 520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 667, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MXP'; -- 1646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (667, '06:45', 2080), (667, '10:35', 920), (667, '12:15', 185490), (667, '14:25', 1020), (667, '17:00', 61200), (667, '19:30', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 668, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'ATH'; -- 2811 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (668, '06:55', 4270), (668, '09:35', 1310), (668, '12:05', 570), (668, '13:25', 4060), (668, '16:30', 3990), (668, '18:05', 150), (668, '20:00', 492810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 669, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'IST'; -- 2655 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (669, '07:05', 4010), (669, '09:50', 890), (669, '12:55', 750), (669, '15:10', 73460), (669, '17:10', 1520), (669, '19:35', 2990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 670, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'DXB'; -- 5434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (670, '06:45', 3210), (670, '10:05', 888210), (670, '12:40', 1930), (670, '15:00', 79100), (670, '17:00', 2160), (670, '19:35', 8170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 671, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'BKK'; -- 8989 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (671, '06:45', 4400), (671, '09:05', 1490), (671, '11:25', 3730), (671, '14:10', 4350), (671, '16:30', 788010), (671, '17:55', 3860), (671, '20:35', 2510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 672, f.id, t.id, 450 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'JFK'; -- 5604 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (672, '07:40', 170), (672, '08:40', 1020), (672, '11:10', 2140), (672, '13:55', 1200), (672, '16:00', 4130), (672, '17:55', 1140), (672, '20:40', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 673, f.id, t.id, 450 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'EWR'; -- 5620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (673, '07:30', 144630), (673, '09:45', 4130), (673, '14:20', 608370), (673, '17:15', 5650), (673, '19:45', 417360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 674, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'ORD'; -- 6214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (674, '06:35', 34720), (674, '08:50', 4320), (674, '11:10', 400), (674, '14:00', 2450), (674, '16:05', 3360), (674, '18:45', 4070), (674, '20:45', 79040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 675, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'MIA'; -- 7296 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (675, '06:55', 1970), (675, '09:50', 910), (675, '13:40', 3440), (675, '16:50', 1040), (675, '19:05', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 676, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'LAX'; -- 8350 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (676, '06:50', 786600), (676, '09:20', 2470), (676, '11:05', 3880), (676, '13:25', 4780), (676, '16:00', 1620), (676, '18:20', 4310), (676, '19:50', 160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 677, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'BGO' AND t.iata = 'YYZ'; -- 5649 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (677, '07:35', 1700), (677, '10:25', 4670), (677, '12:15', 450), (677, '15:05', 3130), (677, '18:00', 186480), (677, '20:30', 150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 678, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'ARN'; -- 562 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (678, '07:50', 970), (678, '10:10', 4480), (678, '12:55', 1470), (678, '15:10', 4270), (678, '18:05', 2200), (678, '19:35', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 679, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BMA'; -- 590 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (679, '06:45', 1070), (679, '10:05', 2020), (679, '14:20', 3000), (679, '17:20', 430), (679, '19:55', 3030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 680, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'GOT'; -- 648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (680, '06:45', 1370), (680, '10:20', 930), (680, '12:25', 392400), (680, '14:40', 4820), (680, '18:00', 947980), (680, '20:15', 2040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 681, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'LLA'; -- 583 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (681, '07:15', 1360), (681, '10:20', 383820), (681, '12:30', 2040), (681, '14:50', 995720), (681, '18:20', 2250), (681, '20:55', 4190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 682, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'VBY'; -- 761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (682, '06:40', 2310), (682, '09:15', 220), (682, '12:10', 4030), (682, '15:45', 3850), (682, '18:05', 518940), (682, '20:25', 41080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 683, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'UME'; -- 463 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (683, '06:55', 2740), (683, '10:30', 952220), (683, '11:45', 3750), (683, '15:05', 3250), (683, '17:35', 1980), (683, '20:50', 653130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 684, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'OSD'; -- 181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (684, '06:50', 3460), (684, '10:15', 3860), (684, '12:50', 350), (684, '16:05', 311420), (684, '20:30', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 685, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'KRN'; -- 648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (685, '06:50', 560), (685, '10:30', 4240), (685, '14:25', 59990), (685, '16:35', 2410), (685, '19:55', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 686, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BGO'; -- 462 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (686, '08:20', 980), (686, '10:40', 4450), (686, '13:50', 1040), (686, '16:55', 1630), (686, '19:40', 713440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 687, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'CPH'; -- 877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (687, '08:00', 3110), (687, '11:15', 500), (687, '14:30', 4000), (687, '16:45', 2130), (687, '20:45', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 688, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'AAL'; -- 711 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (688, '07:20', 4530), (688, '10:35', 57910), (688, '14:10', 3880), (688, '17:45', 2110), (688, '19:05', 695280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 689, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'HEL'; -- 812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (689, '07:55', 570), (689, '10:20', 4930), (689, '12:30', 322710), (689, '15:30', 2690), (689, '17:20', 340), (689, '20:25', 662830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 690, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'KEF'; -- 1633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (690, '07:00', 760130), (690, '08:50', 3150), (690, '10:55', 82750), (690, '14:20', 1120), (690, '15:35', 1900), (690, '17:40', 1910), (690, '19:45', 2250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 691, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'TLL'; -- 863 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (691, '07:35', 95820), (691, '09:20', 2400), (691, '11:55', 4690), (691, '15:35', 1710), (691, '18:15', 3400), (691, '20:15', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 692, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'RIX'; -- 1021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (692, '07:20', 160), (692, '10:55', 1910), (692, '14:40', 234200), (692, '16:15', 4970), (692, '20:50', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 693, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'LHR'; -- 1492 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (693, '07:20', 4070), (693, '09:50', 3000), (693, '14:05', 1610), (693, '17:35', 2630), (693, '20:25', 117180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 694, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MAN'; -- 1356 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (694, '07:35', 1920), (694, '09:45', 1360), (694, '11:50', 65130), (694, '14:25', 3610), (694, '18:05', 420), (694, '20:00', 538480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 695, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'EDI'; -- 1153 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (695, '06:55', 960), (695, '10:35', 2590), (695, '12:20', 4000), (695, '15:35', 4900), (695, '17:05', 1100), (695, '19:55', 1900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 696, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'DUB'; -- 1488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (696, '07:05', 4220), (696, '10:10', 2440), (696, '12:10', 3070), (696, '14:45', 380), (696, '17:30', 31770), (696, '20:55', 547230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 697, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'CDG'; -- 1685 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (697, '07:10', 508330), (697, '09:55', 54620), (697, '12:10', 4880), (697, '15:30', 1060), (697, '16:55', 3660), (697, '20:05', 470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 698, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'NCE'; -- 2214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (698, '07:10', 649680), (698, '11:20', 94720), (698, '13:05', 4920), (698, '16:40', 4850), (698, '19:50', 13570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 699, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'AMS'; -- 1291 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (699, '06:35', 3400), (699, '09:20', 2990), (699, '12:30', 52320), (699, '15:30', 1070), (699, '17:05', 2410), (699, '20:05', 71230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 700, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BRU'; -- 1448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (700, '07:00', 4710), (700, '09:55', 3710), (700, '13:25', 69170), (700, '17:25', 23440), (700, '20:20', 910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 701, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'FRA'; -- 1500 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (701, '08:00', 240), (701, '09:10', 3290), (701, '12:00', 1260), (701, '14:20', 89920), (701, '18:20', 4450), (701, '20:00', 785880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 702, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BER'; -- 1242 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (702, '06:40', 610), (702, '11:00', 1650), (702, '14:00', 1150), (702, '17:15', 3240), (702, '20:45', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 703, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'ZRH'; -- 1785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (703, '08:10', 45520), (703, '09:55', 2430), (703, '14:30', 4210), (703, '17:15', 3000), (703, '19:40', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 704, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'VIE'; -- 1741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (704, '08:00', 3280), (704, '10:00', 2560), (704, '12:35', 1260), (704, '15:00', 4170), (704, '17:45', 1350), (704, '20:20', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 705, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'PRG'; -- 1499 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (705, '07:30', 40170), (705, '10:05', 1690), (705, '11:55', 3020), (705, '15:40', 2260), (705, '18:15', 143690), (705, '20:15', 1570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 706, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'WAW'; -- 1386 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (706, '07:45', 4030), (706, '08:55', 740), (706, '11:30', 540), (706, '13:35', 1400), (706, '15:40', 868990), (706, '17:55', 1140), (706, '19:45', 1970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 707, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BCN'; -- 2531 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (707, '06:35', 91730), (707, '09:10', 360), (707, '11:40', 4560), (707, '13:20', 4610), (707, '15:20', 1350), (707, '18:45', 980), (707, '20:50', 15640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 708, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MAD'; -- 2725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (708, '07:55', 3390), (708, '09:20', 2210), (708, '13:10', 3900), (708, '14:35', 2110), (708, '17:25', 4340), (708, '19:40', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 709, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'AGP'; -- 3156 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (709, '06:50', 665350), (709, '10:15', 4850), (709, '12:50', 416600), (709, '15:20', 2910), (709, '18:00', 3560), (709, '19:45', 4340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 710, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'PMI'; -- 2713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (710, '07:35', 4340), (710, '09:45', 310), (710, '11:30', 74390), (710, '14:20', 3440), (710, '15:40', 67120), (710, '17:50', 240), (710, '20:05', 2420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 711, f.id, t.id, 360 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'LPA'; -- 4379 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (711, '06:40', 800), (711, '11:00', 2900), (711, '14:10', 78140), (711, '16:10', 2370), (711, '20:20', 12610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 712, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'LIS'; -- 3052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (712, '08:10', 4840), (712, '11:25', 282850), (712, '14:35', 971030), (712, '16:50', 4120), (712, '19:20', 4620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 713, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'FCO'; -- 2410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (713, '07:35', 83820), (713, '09:25', 798080), (713, '11:25', 3440), (713, '13:10', 964930), (713, '16:00', 2410), (713, '18:15', 3790), (713, '20:00', 451480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 714, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MXP'; -- 1987 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (714, '07:25', 3790), (714, '08:55', 270), (714, '11:10', 3060), (714, '13:20', 99480), (714, '15:35', 3470), (714, '17:50', 2400), (714, '20:50', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 715, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'ATH'; -- 2969 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (715, '07:15', 2320), (715, '09:30', 1640), (715, '12:00', 1140), (715, '15:10', 4250), (715, '18:15', 3310), (715, '20:40', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 716, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'IST'; -- 2727 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (716, '07:05', 4510), (716, '09:25', 680), (716, '11:10', 2710), (716, '13:45', 1640), (716, '16:25', 3330), (716, '18:30', 810), (716, '21:00', 810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 717, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'DXB'; -- 5329 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (717, '07:25', 3870), (717, '09:05', 3430), (717, '12:00', 4510), (717, '13:45', 830), (717, '16:30', 2570), (717, '18:15', 970), (717, '20:35', 3090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 718, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'BKK'; -- 8640 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (718, '07:20', 280), (718, '11:25', 2100), (718, '13:15', 3350), (718, '17:00', 13450), (718, '19:20', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 719, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'JFK'; -- 5796 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (719, '07:35', 470), (719, '10:40', 4720), (719, '14:35', 358930), (719, '17:30', 4450), (719, '20:45', 867880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 720, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'EWR'; -- 5810 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (720, '07:40', 940), (720, '09:45', 870), (720, '14:15', 579650), (720, '16:00', 830), (720, '19:30', 2450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 721, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'ORD'; -- 6317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (721, '07:10', 730), (721, '09:25', 696750), (721, '11:05', 921750), (721, '14:20', 91050), (721, '15:25', 3780), (721, '18:30', 590), (721, '20:20', 4600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 722, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'MIA'; -- 7519 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (722, '07:10', 3150), (722, '11:15', 2590), (722, '14:20', 3840), (722, '16:55', 1940), (722, '19:40', 23830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 723, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'LAX'; -- 8302 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (723, '07:05', 38840), (723, '11:15', 1710), (723, '13:15', 757470), (723, '17:35', 3430), (723, '20:35', 200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 724, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'TRD' AND t.iata = 'YYZ'; -- 5789 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (724, '06:55', 1280), (724, '09:35', 4280), (724, '11:15', 700), (724, '13:20', 2680), (724, '15:30', 3840), (724, '17:40', 3480), (724, '20:00', 1550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 725, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BMA'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (725, '06:55', 330), (725, '09:00', 2400), (725, '11:00', 1210), (725, '14:20', 3870), (725, '15:30', 2310), (725, '17:40', 1870), (725, '20:55', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 726, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'GOT'; -- 229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (726, '07:45', 1040), (726, '09:05', 4240), (726, '11:40', 4240), (726, '13:55', 3370), (726, '15:30', 3800), (726, '18:00', 61770), (726, '20:40', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 727, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MMX'; -- 46 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (727, '07:10', 3160), (727, '09:55', 99040), (727, '11:15', 1850), (727, '13:55', 310310), (727, '15:25', 35850), (727, '17:35', 1050), (727, '20:45', 2470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 728, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'LLA'; -- 1215 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (728, '06:55', 1880), (728, '10:00', 2980), (728, '13:05', 824540), (728, '14:50', 298360), (728, '18:10', 520340), (728, '20:45', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 729, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'VBY'; -- 416 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (729, '07:05', 2700), (729, '10:55', 420), (729, '14:35', 4370), (729, '16:25', 1680), (729, '20:05', 160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 730, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'UME'; -- 1003 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (730, '06:50', 4470), (730, '09:15', 4010), (730, '12:30', 1560), (730, '15:40', 418600), (730, '17:25', 860990), (730, '20:20', 430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 731, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'OSD'; -- 848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (731, '07:15', 4990), (731, '09:35', 4250), (731, '12:40', 4380), (731, '14:55', 4700), (731, '18:10', 3400), (731, '19:45', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 732, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'KRN'; -- 1413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (732, '08:00', 1900), (732, '10:35', 4420), (732, '12:25', 351930), (732, '14:25', 2470), (732, '17:20', 2110), (732, '20:30', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 733, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'OSL'; -- 516 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (733, '07:45', 623600), (733, '10:35', 270), (733, '13:40', 310000), (733, '16:35', 2630), (733, '19:20', 4850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 734, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BGO'; -- 679 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (734, '08:10', 1600), (734, '09:50', 2670), (734, '13:40', 230), (734, '16:25', 4950), (734, '20:40', 1180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 735, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'TRD'; -- 877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (735, '07:20', 5000), (735, '09:25', 689040), (735, '11:50', 4000), (735, '13:15', 12600), (735, '15:35', 2840), (735, '18:20', 1830), (735, '20:05', 420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 736, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'HEL'; -- 892 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (736, '07:00', 1430), (736, '09:45', 6850), (736, '12:00', 1380), (736, '13:25', 4020), (736, '16:35', 2590), (736, '17:55', 3190), (736, '20:10', 4790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 737, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'KEF'; -- 2144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (737, '07:05', 2300), (737, '10:05', 2660), (737, '13:40', 2960), (737, '17:40', 90580), (737, '20:30', 4230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 738, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'TLL'; -- 839 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (738, '06:50', 256600), (738, '10:05', 720430), (738, '13:00', 1220), (738, '15:25', 860), (738, '18:05', 2730), (738, '20:50', 853640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 739, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'RIX'; -- 713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (739, '06:50', 81080), (739, '10:10', 4700), (739, '12:35', 4490), (739, '15:30', 4710), (739, '17:50', 2390), (739, '20:15', 610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 740, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'LHR'; -- 979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (740, '07:00', 1940), (740, '09:50', 4310), (740, '12:35', 1580), (740, '14:30', 1480), (740, '17:25', 520), (740, '20:50', 313920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 741, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MAN'; -- 995 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (741, '08:00', 3820), (741, '11:00', 2810), (741, '14:05', 3240), (741, '16:10', 4340), (741, '19:05', 950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 742, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'EDI'; -- 1000 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (742, '07:40', 3580), (742, '09:55', 1830), (742, '13:05', 82010), (742, '14:20', 3590), (742, '17:30', 1320), (742, '19:30', 2630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 743, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'DUB'; -- 1240 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (743, '07:30', 920), (743, '09:50', 820), (743, '12:05', 3210), (743, '13:50', 2130), (743, '16:10', 750), (743, '17:45', 423200), (743, '20:25', 28050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 744, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'CDG'; -- 1004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (744, '07:20', 1130), (744, '08:45', 715640), (744, '11:10', 3490), (744, '13:10', 4620), (744, '16:05', 352760), (744, '18:50', 4990), (744, '20:05', 1660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 745, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'NCE'; -- 1385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (745, '07:15', 3190), (745, '09:15', 290), (745, '12:10', 575390), (745, '13:10', 1250), (745, '16:20', 910), (745, '18:10', 3740), (745, '20:40', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 746, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'AMS'; -- 633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (746, '06:30', 4460), (746, '09:30', 98350), (746, '12:00', 2220), (746, '13:15', 1210), (746, '15:55', 780), (746, '17:45', 2010), (746, '20:30', 510230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 747, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BRU'; -- 755 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (747, '08:15', 4230), (747, '10:55', 1490), (747, '13:40', 2690), (747, '17:45', 650), (747, '20:05', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 748, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'FRA'; -- 679 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (748, '07:45', 1520), (748, '09:15', 1770), (748, '13:00', 4260), (748, '15:30', 597880), (748, '17:00', 2040), (748, '20:20', 1360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 749, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MUC'; -- 811 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (749, '07:55', 4630), (749, '10:50', 65560), (749, '14:10', 2160), (749, '16:00', 2510), (749, '19:05', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 750, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'ZRH'; -- 950 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (750, '07:15', 4270), (750, '09:25', 4360), (750, '11:45', 2700), (750, '15:05', 260), (750, '18:05', 68400), (750, '20:20', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 751, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'VIE'; -- 877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (751, '06:30', 1230), (751, '08:45', 91590), (751, '10:55', 3400), (751, '13:10', 4840), (751, '15:25', 240290), (751, '18:10', 97320), (751, '20:55', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 752, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'PRG'; -- 623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (752, '06:55', 4230), (752, '09:20', 3590), (752, '11:45', 3950), (752, '14:20', 1450), (752, '18:15', 2760), (752, '20:30', 3020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 753, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BCN'; -- 1768 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (753, '07:05', 3760), (753, '08:40', 97110), (753, '12:10', 2540), (753, '13:40', 36670), (753, '16:30', 490), (753, '18:40', 38010), (753, '20:05', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 754, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MAD'; -- 2059 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (754, '07:05', 4210), (754, '08:50', 4130), (754, '12:05', 1210), (754, '13:25', 4240), (754, '16:10', 970), (754, '17:40', 4020), (754, '19:45', 1160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 755, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'AGP'; -- 2472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (755, '07:05', 3150), (755, '10:15', 3670), (755, '14:25', 3210), (755, '17:45', 960), (755, '20:05', 3330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 756, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'PMI'; -- 1931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (756, '06:40', 2570), (756, '10:50', 2690), (756, '13:00', 800), (756, '17:00', 840), (756, '20:05', 65130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 757, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'LPA'; -- 3805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (757, '06:45', 504030), (757, '09:15', 3530), (757, '11:05', 4830), (757, '14:05', 49570), (757, '15:50', 629050), (757, '18:20', 2490), (757, '20:10', 1360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 758, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'LIS'; -- 2472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (758, '07:25', 4880), (758, '10:10', 1590), (758, '12:40', 1470), (758, '14:25', 1690), (758, '17:40', 82380), (758, '20:20', 339270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 759, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'FCO'; -- 1537 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (759, '06:45', 497530), (759, '09:50', 4180), (759, '12:55', 4810), (759, '14:20', 4470), (759, '17:25', 710), (759, '19:30', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 760, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MXP'; -- 1144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (760, '06:40', 4760), (760, '09:10', 2310), (760, '13:05', 4380), (760, '15:10', 1610), (760, '17:45', 4290), (760, '20:00', 3170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 761, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'ATH'; -- 2139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (761, '07:50', 785800), (761, '10:55', 3710), (761, '12:50', 1900), (761, '17:15', 310), (761, '20:40', 2430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 762, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'IST'; -- 1979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (762, '07:50', 1670), (762, '10:25', 801420), (762, '12:10', 510), (762, '14:35', 2650), (762, '17:05', 15730), (762, '20:40', 310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 763, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'BKK'; -- 8637 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (763, '06:40', 80730), (763, '10:10', 910), (763, '12:25', 2910), (763, '15:45', 3800), (763, '18:00', 742310), (763, '20:25', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 764, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'JFK'; -- 6188 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (764, '07:55', 1390), (764, '10:00', 34890), (764, '11:50', 57710), (764, '14:20', 1730), (764, '18:20', 3920), (764, '20:30', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 765, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'EWR'; -- 6207 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (765, '06:50', 3370), (765, '09:45', 1360), (765, '11:30', 37480), (765, '13:50', 1120), (765, '15:50', 2610), (765, '18:15', 1480), (765, '20:50', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 766, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'ORD'; -- 6853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (766, '07:25', 4660), (766, '09:45', 1380), (766, '13:40', 2170), (766, '17:45', 3720), (766, '20:10', 330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 767, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'MIA'; -- 7845 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (767, '08:10', 890), (767, '10:35', 2670), (767, '14:10', 31500), (767, '17:05', 1390), (767, '19:15', 3510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 768, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'LAX'; -- 9028 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (768, '07:40', 719850), (768, '09:50', 1730), (768, '14:25', 1120), (768, '17:30', 4010), (768, '20:10', 3350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 769, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'CPH' AND t.iata = 'YYZ'; -- 6269 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (769, '07:50', 4430), (769, '10:30', 2150), (769, '11:45', 1420), (769, '15:45', 490), (769, '16:55', 4980), (769, '19:50', 930040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 770, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'ARN'; -- 549 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (770, '06:45', 2520), (770, '08:55', 37600), (770, '12:00', 3970), (770, '13:25', 90490), (770, '15:25', 1960), (770, '17:45', 3890), (770, '20:15', 2820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 771, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'GOT'; -- 160 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (771, '06:55', 4020), (771, '09:25', 2350), (771, '12:40', 1230), (771, '15:00', 4410), (771, '17:05', 2840), (771, '20:30', 67770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 772, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MMX'; -- 277 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (772, '06:40', 453050), (772, '09:15', 32300), (772, '11:20', 3940), (772, '13:50', 3530), (772, '15:35', 4390), (772, '18:30', 2510), (772, '20:10', 620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 773, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'LLA'; -- 1141 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (773, '08:10', 26600), (773, '11:05', 1720), (773, '14:30', 2340), (773, '16:45', 81410), (773, '20:00', 2720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 774, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'VBY'; -- 513 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (774, '08:00', 850), (774, '09:15', 250), (774, '12:45', 3440), (774, '15:05', 24100), (774, '17:45', 4100), (774, '19:45', 1320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 775, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'UME'; -- 937 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (775, '07:50', 3720), (775, '11:30', 3770), (775, '13:35', 1750), (775, '17:40', 894150), (775, '19:55', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 776, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'OSD'; -- 725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (776, '06:55', 75740), (776, '09:40', 1320), (776, '11:50', 840), (776, '14:45', 2990), (776, '18:20', 1970), (776, '19:30', 64510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 777, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'OSL'; -- 352 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (777, '07:20', 95080), (777, '08:45', 37110), (777, '11:50', 1340), (777, '13:15', 987440), (777, '16:20', 1060), (777, '18:30', 70150), (777, '20:55', 1680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 778, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BGO'; -- 445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (778, '06:50', 2490), (778, '08:55', 1640), (778, '12:05', 2270), (778, '14:05', 1180), (778, '15:55', 2990), (778, '18:05', 920), (778, '20:25', 2040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 779, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'TRD'; -- 711 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (779, '07:45', 4390), (779, '09:10', 2010), (779, '12:35', 3650), (779, '15:05', 150), (779, '17:05', 2210), (779, '20:55', 2770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 780, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'HEL'; -- 941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (780, '07:00', 283560), (780, '09:10', 1820), (780, '12:00', 4570), (780, '13:40', 3710), (780, '15:30', 3220), (780, '18:30', 2210), (780, '20:00', 550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 781, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'KEF'; -- 1907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (781, '07:15', 3930), (781, '10:00', 2350), (781, '14:20', 397970), (781, '17:40', 510), (781, '19:45', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 782, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'TLL'; -- 911 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (782, '06:40', 2320), (782, '09:05', 332670), (782, '11:15', 275190), (782, '13:15', 1370), (782, '15:40', 3770), (782, '18:00', 2630), (782, '20:35', 26540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 783, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'RIX'; -- 854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (783, '07:25', 3630), (783, '09:25', 2060), (783, '11:40', 660), (783, '13:20', 46810), (783, '15:45', 2930), (783, '18:35', 1900), (783, '20:15', 500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 784, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'LHR'; -- 913 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (784, '07:30', 2090), (784, '11:05', 430), (784, '13:20', 54990), (784, '17:30', 3570), (784, '19:15', 3120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 785, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MAN'; -- 873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (785, '08:00', 79420), (785, '09:45', 1220), (785, '12:55', 2730), (785, '16:40', 4620), (785, '20:00', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 786, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'EDI'; -- 819 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (786, '07:30', 360), (786, '10:20', 2670), (786, '12:45', 840), (786, '15:25', 2630), (786, '17:30', 210), (786, '19:35', 735640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 787, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'DUB'; -- 1095 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (787, '07:45', 1180), (787, '09:50', 4080), (787, '11:10', 1860), (787, '13:25', 2900), (787, '15:45', 3130), (787, '18:10', 4670), (787, '19:45', 71780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 788, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'CDG'; -- 1021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (788, '07:35', 4910), (788, '09:25', 710), (788, '11:20', 3610), (788, '14:05', 310), (788, '16:20', 211640), (788, '17:45', 4450), (788, '21:00', 800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 789, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'NCE'; -- 1505 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (789, '07:00', 700), (789, '09:45', 1080), (789, '13:00', 3040), (789, '14:45', 3430), (789, '17:20', 4720), (789, '19:50', 1830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 790, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BRU'; -- 772 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (790, '08:25', 3420), (790, '11:05', 1950), (790, '14:05', 4410), (790, '17:25', 1890), (790, '19:05', 652840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 791, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'FRA'; -- 790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (791, '07:30', 3390), (791, '09:50', 3660), (791, '12:10', 2140), (791, '14:45', 2210), (791, '17:50', 2990), (791, '19:50', 1380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 792, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MUC'; -- 980 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (792, '07:20', 520), (792, '10:35', 850), (792, '12:15', 330), (792, '14:45', 4000), (792, '16:55', 1000), (792, '20:25', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 793, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BER'; -- 575 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (793, '07:50', 3230), (793, '09:35', 4630), (793, '12:40', 1670), (793, '14:55', 3570), (793, '17:50', 3750), (793, '19:55', 2750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 794, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'ZRH'; -- 1074 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (794, '06:35', 2890), (794, '09:10', 670), (794, '11:35', 3810), (794, '13:20', 3400), (794, '16:10', 3180), (794, '17:45', 200), (794, '21:00', 2940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 795, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'VIE'; -- 1096 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (795, '07:25', 3750), (795, '11:00', 1650), (795, '14:30', 2350), (795, '16:40', 91250), (795, '20:05', 2420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 796, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'PRG'; -- 830 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (796, '07:00', 3420), (796, '09:25', 2290), (796, '11:10', 2040), (796, '13:35', 3130), (796, '16:05', 4250), (796, '17:40', 4530), (796, '20:40', 2160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 797, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'WAW'; -- 899 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (797, '06:30', 71030), (797, '09:25', 332230), (797, '11:45', 3080), (797, '13:30', 25120), (797, '15:30', 660), (797, '18:20', 2060), (797, '19:45', 39460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 798, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BCN'; -- 1841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (798, '08:05', 1610), (798, '11:00', 266360), (798, '13:45', 63980), (798, '17:35', 4340), (798, '19:20', 5620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 799, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MAD'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (799, '07:35', 4260), (799, '10:00', 2420), (799, '12:30', 3820), (799, '15:45', 2150), (799, '17:40', 2510), (799, '20:05', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 800, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'AGP'; -- 2507 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (800, '06:40', 977390), (800, '09:35', 3510), (800, '11:15', 2340), (800, '13:55', 4650), (800, '16:00', 2000), (800, '18:40', 1390), (800, '20:20', 4930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 801, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'PMI'; -- 2017 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (801, '07:20', 1200), (801, '10:20', 1930), (801, '11:50', 260060), (801, '15:40', 2210), (801, '18:10', 2060), (801, '20:10', 3440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 802, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'LPA'; -- 3799 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (802, '07:50', 1960), (802, '10:15', 3460), (802, '14:35', 38870), (802, '17:00', 2640), (802, '19:05', 3550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 803, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'LIS'; -- 2462 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (803, '06:55', 4930), (803, '10:15', 94200), (803, '13:25', 980), (803, '16:40', 220570), (803, '20:10', 423080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 804, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'FCO'; -- 1709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (804, '07:45', 2510), (804, '09:50', 330), (804, '13:55', 1010), (804, '17:20', 1860), (804, '19:05', 4560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 805, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MXP'; -- 1277 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (805, '07:10', 2790), (805, '09:15', 4000), (805, '12:00', 1630), (805, '13:20', 720), (805, '15:55', 4840), (805, '17:35', 3980), (805, '20:15', 4310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 806, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'ATH'; -- 2367 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (806, '06:50', 4490), (806, '10:15', 446160), (806, '14:30', 3620), (806, '16:10', 210), (806, '19:35', 1560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 807, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'IST'; -- 2217 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (807, '06:50', 3240), (807, '08:45', 161130), (807, '11:45', 2810), (807, '13:20', 3450), (807, '15:55', 2290), (807, '17:35', 830), (807, '19:55', 270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 808, f.id, t.id, 410 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'DXB'; -- 5045 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (808, '07:00', 84790), (808, '09:40', 3680), (808, '12:30', 2770), (808, '14:35', 4070), (808, '17:50', 4270), (808, '19:45', 4910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 809, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'BKK'; -- 8787 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (809, '07:00', 330), (809, '09:30', 55500), (809, '11:10', 49270), (809, '13:40', 2850), (809, '15:20', 19220), (809, '17:45', 3460), (809, '20:45', 805470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 810, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'JFK'; -- 5967 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (810, '07:25', 2610), (810, '10:50', 45790), (810, '13:30', 1660), (810, '17:25', 550), (810, '19:10', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 811, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'EWR'; -- 5985 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (811, '06:50', 2700), (811, '09:35', 2190), (811, '11:25', 4690), (811, '13:20', 355810), (811, '15:20', 2840), (811, '18:20', 77330), (811, '20:55', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 812, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'ORD'; -- 6620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (812, '06:40', 3880), (812, '09:20', 1660), (812, '13:05', 69470), (812, '14:30', 4010), (812, '18:05', 2290), (812, '20:40', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 813, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'MIA'; -- 7634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (813, '07:30', 4740), (813, '10:00', 3020), (813, '12:10', 2630), (813, '15:45', 2260), (813, '17:30', 1300), (813, '20:05', 4840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 814, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'LAX'; -- 8792 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (814, '07:30', 1180), (814, '10:35', 418940), (814, '13:05', 740), (814, '16:20', 89700), (814, '19:15', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 815, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'AAL' AND t.iata = 'YYZ'; -- 6039 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (815, '07:50', 4600), (815, '09:35', 650), (815, '13:05', 2320), (815, '15:15', 2530), (815, '17:15', 1640), (815, '20:50', 2200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 816, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BMA'; -- 407 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (816, '06:45', 2410), (816, '10:30', 3610), (816, '12:15', 2020), (816, '15:00', 4680), (816, '17:30', 463560), (816, '19:50', 1550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 817, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'GOT'; -- 782 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (817, '06:40', 2220), (817, '10:20', 1000), (817, '13:40', 300), (817, '16:25', 1710), (817, '20:05', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 818, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MMX'; -- 864 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (818, '07:25', 1390), (818, '10:15', 3420), (818, '12:05', 4430), (818, '15:15', 1360), (818, '17:45', 3070), (818, '20:55', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 819, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'LLA'; -- 598 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (819, '07:00', 1200), (819, '10:20', 13650), (819, '13:40', 2540), (819, '17:30', 4920), (819, '20:45', 2840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 820, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'VBY'; -- 480 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (820, '07:30', 810), (820, '09:45', 1340), (820, '12:25', 92970), (820, '15:25', 3170), (820, '18:15', 2690), (820, '20:10', 1280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 821, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'UME'; -- 456 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (821, '07:40', 3530), (821, '09:40', 1270), (821, '12:00', 500), (821, '15:30', 3640), (821, '17:20', 119310), (821, '20:15', 1900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 822, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'OSD'; -- 635 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (822, '07:25', 2430), (822, '09:10', 14660), (822, '12:05', 540), (822, '13:25', 2730), (822, '16:05', 1090), (822, '18:10', 990), (822, '20:10', 282710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 823, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BGO'; -- 1083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (823, '07:10', 180), (823, '10:40', 1610), (823, '13:20', 890), (823, '17:40', 770), (823, '20:10', 153090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 824, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'TRD'; -- 812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (824, '07:00', 3290), (824, '09:00', 1020), (824, '11:50', 2440), (824, '13:50', 884930), (824, '15:55', 86380), (824, '18:05', 3300), (824, '20:40', 86390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 825, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'CPH'; -- 892 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (825, '07:35', 810), (825, '09:25', 2430), (825, '11:50', 4980), (825, '13:45', 425850), (825, '16:10', 360), (825, '18:30', 890), (825, '20:50', 2450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 826, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'AAL'; -- 941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (826, '07:00', 2020), (826, '09:10', 390), (826, '10:55', 710), (826, '14:00', 661230), (826, '16:15', 783110), (826, '18:40', 2170), (826, '20:10', 854930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 827, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'KEF'; -- 2444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (827, '07:30', 4870), (827, '10:30', 2770), (827, '13:15', 2120), (827, '17:25', 715150), (827, '19:20', 1650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 828, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'TLL'; -- 101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (828, '07:10', 2650), (828, '09:20', 2850), (828, '11:00', 2810), (828, '13:15', 720000), (828, '15:20', 620780), (828, '17:40', 3280), (828, '20:10', 280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 829, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'LHR'; -- 1847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (829, '07:55', 450), (829, '10:40', 98100), (829, '12:55', 4750), (829, '16:40', 4420), (829, '20:30', 27240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 830, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MAN'; -- 1812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (830, '06:45', 3650), (830, '10:25', 1740), (830, '12:10', 2310), (830, '15:40', 2940), (830, '17:25', 3510), (830, '20:05', 49360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 831, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'EDI'; -- 1717 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (831, '07:10', 2790), (831, '09:25', 3150), (831, '12:00', 4540), (831, '13:25', 2300), (831, '15:20', 660), (831, '17:45', 1480), (831, '21:00', 4120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 832, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'DUB'; -- 2022 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (832, '06:55', 4600), (832, '10:10', 560), (832, '13:00', 1320), (832, '16:35', 480), (832, '19:35', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 833, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'CDG'; -- 1896 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (833, '06:35', 420), (833, '09:25', 2020), (833, '11:00', 86360), (833, '14:00', 4400), (833, '15:35', 644680), (833, '17:50', 4450), (833, '20:25', 1330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 834, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'NCE'; -- 2200 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (834, '07:10', 2590), (834, '09:35', 2800), (834, '12:00', 2390), (834, '14:30', 842990), (834, '17:40', 2830), (834, '20:40', 1300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 835, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'AMS'; -- 1521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (835, '07:20', 568430), (835, '11:25', 365340), (835, '13:20', 1070), (835, '17:30', 1100), (835, '20:25', 2040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 836, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BRU'; -- 1647 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (836, '07:25', 790), (836, '10:10', 3190), (836, '13:15', 2270), (836, '16:55', 4880), (836, '20:10', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 837, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'FRA'; -- 1538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (837, '07:25', 810), (837, '09:15', 320), (837, '12:30', 2040), (837, '14:50', 2230), (837, '18:15', 4270), (837, '19:50', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 838, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MUC'; -- 1575 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (838, '07:20', 3020), (838, '09:15', 91470), (838, '12:15', 620), (838, '15:00', 2420), (838, '17:25', 3050), (838, '19:30', 839740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 839, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'ZRH'; -- 1779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (839, '07:40', 1940), (839, '08:55', 980), (839, '11:40', 73920), (839, '13:20', 760), (839, '15:50', 3020), (839, '17:55', 2290), (839, '20:10', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 840, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'VIE'; -- 1460 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (840, '07:05', 1370), (840, '08:40', 800), (840, '11:35', 3290), (840, '13:35', 1230), (840, '16:05', 390), (840, '18:30', 2020), (840, '19:55', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 841, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'PRG'; -- 1320 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (841, '07:30', 160), (841, '11:00', 2220), (841, '14:20', 3340), (841, '16:55', 1450), (841, '20:45', 597150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 842, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'WAW'; -- 939 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (842, '06:50', 4350), (842, '11:05', 1010), (842, '14:40', 4150), (842, '17:20', 400), (842, '19:20', 3360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 843, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BCN'; -- 2628 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (843, '06:45', 2690), (843, '08:50', 490), (843, '11:10', 4550), (843, '14:10', 4440), (843, '16:05', 480), (843, '18:10', 2870), (843, '20:50', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 844, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MAD'; -- 2946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (844, '07:05', 640), (844, '09:15', 48200), (844, '12:40', 2410), (844, '14:30', 1950), (844, '17:05', 4370), (844, '20:25', 4490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 845, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'AGP'; -- 3353 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (845, '06:30', 1640), (845, '09:15', 4510), (845, '11:55', 11140), (845, '13:25', 578910), (845, '16:20', 4840), (845, '17:45', 4780), (845, '19:50', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 846, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'PMI'; -- 2775 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (846, '07:20', 3940), (846, '10:20', 1290), (846, '14:05', 1490), (846, '16:55', 2180), (846, '20:40', 3260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 847, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'LPA'; -- 4697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (847, '08:20', 4960), (847, '10:15', 3130), (847, '12:50', 3160), (847, '16:15', 800), (847, '20:30', 3550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 848, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'LIS'; -- 3365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (848, '07:45', 3520), (848, '10:15', 41640), (848, '12:05', 1040), (848, '15:35', 930), (848, '17:25', 837430), (848, '19:35', 3710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 849, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'FCO'; -- 2234 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (849, '07:45', 3070), (849, '09:55', 3140), (849, '13:05', 972990), (849, '17:05', 1270), (849, '19:20', 900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 850, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MXP'; -- 1951 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (850, '07:35', 4220), (850, '10:20', 90990), (850, '13:10', 841940), (850, '17:20', 32760), (850, '19:10', 3440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 851, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'ATH'; -- 2490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (851, '06:40', 2780), (851, '09:50', 1230), (851, '11:40', 53810), (851, '14:05', 4300), (851, '15:50', 90950), (851, '17:55', 2040), (851, '21:00', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 852, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'IST'; -- 2135 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (852, '06:40', 870), (852, '09:40', 3350), (852, '11:15', 4580), (852, '13:45', 4340), (852, '15:35', 3210), (852, '18:40', 2400), (852, '20:35', 4220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 853, f.id, t.id, 370 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'DXB'; -- 4538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (853, '08:00', 2610), (853, '10:30', 4340), (853, '13:35', 2220), (853, '17:15', 4210), (853, '19:10', 700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 854, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'BKK'; -- 7907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (854, '07:20', 1080), (854, '09:30', 620), (854, '12:00', 4580), (854, '14:45', 4630), (854, '17:50', 3350), (854, '20:25', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 855, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'JFK'; -- 6607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (855, '07:15', 85000), (855, '10:30', 816690), (855, '13:15', 4180), (855, '17:45', 4520), (855, '19:50', 4030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 856, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'EWR'; -- 6621 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (856, '06:40', 1720), (856, '09:15', 2520), (856, '12:30', 460800), (856, '15:20', 4710), (856, '17:55', 960), (856, '19:30', 3650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 857, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'ORD'; -- 7118 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (857, '06:35', 4050), (857, '09:25', 4730), (857, '11:00', 1640), (857, '14:10', 1540), (857, '16:10', 95200), (857, '17:40', 3490), (857, '20:30', 3460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 858, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'MIA'; -- 8327 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (858, '07:20', 220), (858, '08:45', 3250), (858, '11:10', 4850), (858, '13:20', 4060), (858, '16:10', 1820), (858, '18:25', 228380), (858, '20:05', 641680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 859, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'LAX'; -- 9013 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (859, '06:55', 440250), (859, '09:20', 170), (859, '12:15', 2320), (859, '15:25', 4450), (859, '17:10', 380), (859, '20:50', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 860, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'HEL' AND t.iata = 'YYZ'; -- 6599 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (860, '07:10', 3200), (860, '10:35', 4360), (860, '12:05', 2750), (860, '14:45', 410), (860, '18:00', 3020), (860, '20:45', 3690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 861, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'ARN'; -- 2143 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (861, '07:15', 3660), (861, '11:20', 2750), (861, '13:30', 3520), (861, '17:45', 4780), (861, '20:50', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 862, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BMA'; -- 2161 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (862, '07:10', 2980), (862, '09:45', 910), (862, '11:50', 225660), (862, '13:20', 2010), (862, '15:25', 496010), (862, '18:10', 3430), (862, '20:40', 490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 863, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'GOT'; -- 1987 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (863, '08:25', 4600), (863, '11:25', 450), (863, '14:35', 290), (863, '16:50', 1370), (863, '19:10', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 864, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MMX'; -- 2184 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (864, '07:45', 3000), (864, '09:10', 2960), (864, '13:05', 173490), (864, '14:30', 2160), (864, '16:55', 4650), (864, '20:35', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 865, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'LLA'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (865, '07:10', 4790), (865, '09:35', 3100), (865, '11:00', 4320), (865, '13:55', 1750), (865, '15:55', 279400), (865, '18:30', 4260), (865, '21:00', 520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 866, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'VBY'; -- 2283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (866, '06:40', 2310), (866, '10:35', 3890), (866, '13:30', 4220), (866, '16:15', 3670), (866, '20:25', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 867, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'UME'; -- 2060 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (867, '07:10', 95420), (867, '08:55', 960), (867, '11:15', 630), (867, '14:00', 755410), (867, '16:30', 1700), (867, '18:10', 1580), (867, '20:50', 3130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 868, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'OSD'; -- 1812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (868, '07:20', 4210), (868, '09:40', 1730), (868, '11:45', 450), (868, '14:20', 2110), (868, '18:10', 59030), (868, '19:30', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 869, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'KRN'; -- 1953 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (869, '06:35', 420), (869, '09:50', 3040), (869, '11:00', 116140), (869, '13:55', 737760), (869, '15:50', 528680), (869, '18:20', 89760), (869, '20:45', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 870, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BGO'; -- 1490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (870, '06:50', 3520), (870, '08:40', 2330), (870, '11:45', 4850), (870, '13:40', 3450), (870, '16:35', 344580), (870, '18:25', 3890), (870, '20:35', 3870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 871, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'TRD'; -- 1633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (871, '08:00', 2930), (871, '10:00', 950), (871, '13:45', 1000), (871, '16:40', 3160), (871, '20:25', 950850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 872, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'CPH'; -- 2144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (872, '06:45', 4810), (872, '09:50', 70200), (872, '12:05', 728960), (872, '13:15', 3290), (872, '16:05', 998950), (872, '18:30', 4040), (872, '20:25', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 873, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'AAL'; -- 1907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (873, '06:35', 1560), (873, '08:45', 2410), (873, '11:50', 1950), (873, '14:05', 2650), (873, '16:20', 610), (873, '18:05', 1950), (873, '21:00', 4890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 874, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'HEL'; -- 2444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (874, '07:20', 170), (874, '09:40', 2020), (874, '12:00', 3870), (874, '15:45', 2910), (874, '17:35', 1940), (874, '20:50', 3370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 875, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'TLL'; -- 2490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (875, '07:50', 40360), (875, '10:25', 84090), (875, '12:30', 79150), (875, '15:00', 1290), (875, '17:35', 2450), (875, '20:30', 12030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 876, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'RIX'; -- 2605 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (876, '07:10', 2810), (876, '09:25', 4670), (876, '12:55', 86680), (876, '14:35', 4310), (876, '17:50', 4590), (876, '20:15', 720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 877, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'LHR'; -- 1895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (877, '07:55', 687070), (877, '09:20', 71150), (877, '12:45', 1720), (877, '15:30', 948990), (877, '17:35', 160), (877, '20:00', 774300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 878, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MAN'; -- 1653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (878, '07:50', 343530), (878, '09:50', 3170), (878, '13:50', 780180), (878, '16:45', 2320), (878, '19:45', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 879, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'EDI'; -- 1385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (879, '06:40', 4410), (879, '09:55', 4460), (879, '14:10', 3010), (879, '16:15', 964310), (879, '20:10', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 880, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'DUB'; -- 1497 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (880, '07:35', 4660), (880, '10:25', 2740), (880, '13:20', 410), (880, '17:40', 371490), (880, '20:10', 99730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 881, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'CDG'; -- 2241 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (881, '07:05', 3650), (881, '09:55', 3780), (881, '13:55', 860), (881, '17:20', 78690), (881, '19:15', 3120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 882, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'NCE'; -- 2935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (882, '07:05', 1090), (882, '10:20', 1080), (882, '12:50', 339940), (882, '16:55', 3320), (882, '19:25', 4020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 883, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'AMS'; -- 2037 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (883, '06:45', 960), (883, '10:20', 2570), (883, '13:05', 4470), (883, '14:50', 1500), (883, '17:40', 3440), (883, '19:45', 43310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 884, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BRU'; -- 2148 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (884, '06:45', 47950), (884, '10:05', 2390), (884, '12:20', 3700), (884, '14:20', 426790), (884, '18:00', 3880), (884, '20:30', 1730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 885, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'FRA'; -- 2401 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (885, '07:20', 4450), (885, '10:00', 775230), (885, '13:30', 32950), (885, '16:40', 780), (885, '19:40', 3800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 886, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MUC'; -- 2692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (886, '06:45', 56160), (886, '09:15', 690), (886, '11:40', 996500), (886, '13:15', 290), (886, '16:00', 410), (886, '18:20', 1860), (886, '19:50', 630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 887, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BER'; -- 2431 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (887, '07:15', 1830), (887, '10:35', 83490), (887, '12:35', 2600), (887, '15:00', 2240), (887, '17:15', 900), (887, '20:05', 2730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 888, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'ZRH'; -- 2631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (888, '07:00', 2900), (888, '09:10', 320), (888, '11:05', 66290), (888, '13:10', 3780), (888, '16:30', 25520), (888, '18:00', 4930), (888, '20:10', 86110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 889, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'VIE'; -- 2931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (889, '07:50', 4290), (889, '11:25', 1550), (889, '13:55', 4570), (889, '17:40', 3370), (889, '20:00', 2560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 890, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'PRG'; -- 2653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (890, '07:05', 4940), (890, '09:10', 4530), (890, '10:55', 960), (890, '13:30', 1660), (890, '16:05', 2660), (890, '17:55', 72820), (890, '20:30', 88330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 891, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'WAW'; -- 2804 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (891, '06:35', 3680), (891, '09:30', 190), (891, '11:25', 4240), (891, '14:05', 4810), (891, '15:20', 4050), (891, '18:50', 1810), (891, '20:00', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 892, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BCN'; -- 2981 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (892, '07:40', 1730), (892, '08:45', 90050), (892, '11:05', 1570), (892, '13:15', 500680), (892, '16:00', 196890), (892, '18:25', 1270), (892, '20:55', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 893, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MAD'; -- 2890 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (893, '07:10', 4790), (893, '09:05', 4570), (893, '11:30', 77600), (893, '14:10', 1520), (893, '16:25', 4050), (893, '17:50', 2690), (893, '21:00', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 894, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'AGP'; -- 3271 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (894, '06:40', 2410), (894, '10:15', 2100), (894, '12:00', 221660), (894, '14:55', 517530), (894, '17:40', 94390), (894, '20:15', 3460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 895, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'PMI'; -- 3181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (895, '08:15', 1230), (895, '11:05', 894130), (895, '13:10', 3290), (895, '16:20', 3340), (895, '19:10', 4320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 896, f.id, t.id, 335 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'LPA'; -- 4042 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (896, '07:40', 750), (896, '11:10', 1250), (896, '13:20', 4240), (896, '17:45', 1110), (896, '19:45', 3020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 897, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'LIS'; -- 2941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (897, '08:15', 3970), (897, '09:50', 329880), (897, '14:15', 2000), (897, '16:50', 4570), (897, '19:35', 339710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 898, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'FCO'; -- 3319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (898, '06:40', 3820), (898, '09:30', 4320), (898, '12:05', 440), (898, '14:00', 210400), (898, '16:30', 552820), (898, '18:05', 1150), (898, '20:40', 2200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 899, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MXP'; -- 2808 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (899, '07:45', 4520), (899, '09:55', 3640), (899, '11:30', 2090), (899, '13:25', 478440), (899, '16:05', 3790), (899, '18:05', 1630), (899, '19:45', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 900, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'ATH'; -- 4200 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (900, '06:30', 4150), (900, '09:10', 1260), (900, '11:40', 3110), (900, '13:30', 2030), (900, '16:30', 240), (900, '18:10', 1460), (900, '20:25', 480420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 901, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'IST'; -- 4115 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (901, '07:00', 76160), (901, '11:30', 3980), (901, '14:10', 2380), (901, '17:30', 4370), (901, '19:50', 530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 902, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'DXB'; -- 6919 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (902, '07:25', 743710), (902, '11:15', 2550), (902, '14:20', 860), (902, '16:25', 2050), (902, '20:35', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 903, f.id, t.id, 790 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'BKK'; -- 10146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (903, '07:10', 4820), (903, '09:20', 4420), (903, '11:45', 180), (903, '13:55', 3280), (903, '15:35', 600640), (903, '18:30', 1470), (903, '20:25', 2880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 904, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'JFK'; -- 4163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (904, '06:45', 1680), (904, '09:55', 830), (904, '13:10', 660), (904, '17:10', 220530), (904, '19:35', 94850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 905, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'EWR'; -- 4177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (905, '07:05', 2340), (905, '09:15', 3340), (905, '12:50', 1520), (905, '15:45', 4050), (905, '17:20', 3710), (905, '20:35', 1100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 906, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'ORD'; -- 4725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (906, '07:00', 1930), (906, '09:05', 4060), (906, '12:05', 1550), (906, '14:15', 1150), (906, '15:35', 1920), (906, '18:05', 2510), (906, '20:30', 3860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 907, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'MIA'; -- 5891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (907, '07:40', 2310), (907, '09:45', 1750), (907, '13:30', 730), (907, '17:10', 914780), (907, '20:15', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 908, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'LAX'; -- 6927 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (908, '07:25', 3100), (908, '09:30', 876570), (908, '12:00', 3200), (908, '14:35', 160), (908, '18:10', 1400), (908, '20:25', 1680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 909, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'KEF' AND t.iata = 'YYZ'; -- 4170 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (909, '07:50', 4590), (909, '09:25', 3710), (909, '13:05', 850), (909, '15:40', 4850), (909, '18:20', 430), (909, '20:45', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 910, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BMA'; -- 390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (910, '06:50', 790), (910, '08:55', 808900), (910, '10:55', 912990), (910, '13:50', 495790), (910, '16:25', 1570), (910, '18:05', 4490), (910, '20:35', 4880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 911, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'GOT'; -- 752 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (911, '07:30', 2470), (911, '10:25', 880), (911, '12:05', 340), (911, '14:40', 2290), (911, '17:05', 2760), (911, '20:55', 2400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 912, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'LLA'; -- 696 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (912, '07:15', 3060), (912, '10:35', 850), (912, '12:25', 340), (912, '14:40', 4210), (912, '17:25', 672870), (912, '20:20', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 913, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'VBY'; -- 423 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (913, '07:20', 4220), (913, '10:10', 3940), (913, '14:05', 2560), (913, '16:45', 4860), (913, '20:25', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 914, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'UME'; -- 543 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (914, '07:45', 3780), (914, '10:20', 224150), (914, '13:35', 870), (914, '16:25', 3330), (914, '20:10', 2990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 915, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'OSD'; -- 692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (915, '06:50', 490), (915, '11:30', 873340), (915, '13:05', 3020), (915, '16:15', 650), (915, '19:30', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 916, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'KRN'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (916, '06:50', 3850), (916, '09:40', 636300), (916, '11:35', 669050), (916, '13:25', 43760), (916, '16:20', 3960), (916, '17:55', 1550), (916, '20:20', 2690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 917, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'OSL'; -- 771 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (917, '07:00', 4550), (917, '11:20', 98760), (917, '14:40', 1000), (917, '16:05', 4420), (917, '19:20', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 918, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BGO'; -- 1095 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (918, '07:05', 36300), (918, '10:15', 250), (918, '13:05', 870), (918, '16:10', 760), (918, '20:50', 3310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 919, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'TRD'; -- 863 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (919, '06:50', 3040), (919, '09:20', 830), (919, '11:50', 3710), (919, '14:35', 510), (919, '17:05', 2530), (919, '20:00', 4200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 920, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'CPH'; -- 839 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (920, '07:05', 1890), (920, '10:55', 969350), (920, '13:05', 870), (920, '17:00', 4110), (920, '19:15', 2190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 921, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'AAL'; -- 911 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (921, '07:15', 1270), (921, '11:15', 4020), (921, '14:30', 1900), (921, '17:40', 500), (921, '19:30', 3490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 922, f.id, t.id, 40 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'HEL'; -- 101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (922, '07:25', 5030), (922, '09:45', 3490), (922, '11:15', 942770), (922, '13:20', 2950), (922, '15:35', 3260), (922, '17:50', 57080), (922, '20:25', 3030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 923, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'KEF'; -- 2490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (923, '07:00', 360), (923, '10:50', 1530), (923, '13:25', 5110), (923, '17:45', 3630), (923, '20:15', 20870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 924, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'RIX'; -- 281 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (924, '07:30', 4180), (924, '10:05', 536970), (924, '14:10', 4820), (924, '16:40', 230), (924, '20:45', 170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 925, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'LHR'; -- 1807 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (925, '07:05', 3850), (925, '10:55', 5280), (925, '13:30', 1370), (925, '16:30', 3510), (925, '19:30', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 926, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MAN'; -- 1784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (926, '07:45', 580), (926, '09:10', 93430), (926, '11:15', 2050), (926, '13:15', 2600), (926, '15:35', 66810), (926, '18:00', 2350), (926, '20:15', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 927, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'EDI'; -- 1706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (927, '07:20', 169530), (927, '09:05', 2320), (927, '11:20', 3110), (927, '13:10', 36350), (927, '16:20', 36910), (927, '18:25', 670), (927, '20:35', 453290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 928, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'DUB'; -- 2002 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (928, '07:15', 44110), (928, '09:00', 3410), (928, '11:10', 1530), (928, '13:30', 311700), (928, '16:15', 3180), (928, '17:45', 3630), (928, '19:55', 728310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 929, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'CDG'; -- 1838 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (929, '07:45', 2470), (929, '09:30', 1190), (929, '11:30', 2150), (929, '13:25', 4580), (929, '15:30', 2440), (929, '17:50', 1760), (929, '20:00', 3420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 930, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'NCE'; -- 2119 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (930, '06:30', 61950), (930, '09:55', 970), (930, '11:45', 3770), (930, '14:00', 2770), (930, '16:00', 142820), (930, '18:25', 740), (930, '20:55', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 931, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'AMS'; -- 1472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (931, '07:00', 3220), (931, '09:55', 882430), (931, '11:20', 4240), (931, '14:20', 3680), (931, '16:20', 838830), (931, '17:50', 1630), (931, '21:00', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 932, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BRU'; -- 1592 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (932, '06:45', 4180), (932, '10:55', 2120), (932, '13:50', 410), (932, '17:45', 2190), (932, '20:15', 890710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 933, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'FRA'; -- 1468 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (933, '07:45', 1890), (933, '09:50', 2340), (933, '14:25', 16930), (933, '16:25', 4870), (933, '19:45', 3770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 934, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MUC'; -- 1492 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (934, '06:45', 3320), (934, '09:45', 750), (934, '11:55', 556100), (934, '14:55', 540), (934, '17:40', 3670), (934, '20:30', 4180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 935, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BER'; -- 1052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (935, '07:50', 2600), (935, '10:45', 542480), (935, '13:00', 180), (935, '16:25', 460), (935, '20:30', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 936, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'ZRH'; -- 1702 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (936, '07:05', 2330), (936, '09:45', 890), (936, '11:40', 99700), (936, '14:20', 1140), (936, '15:50', 2340), (936, '18:10', 4650), (936, '20:20', 2230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 937, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'VIE'; -- 1366 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (937, '06:30', 2070), (937, '09:40', 76910), (937, '11:05', 78580), (937, '14:15', 1700), (937, '16:35', 170210), (937, '17:50', 532990), (937, '20:30', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 938, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'PRG'; -- 1234 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (938, '08:20', 1400), (938, '11:10', 97210), (938, '13:45', 4970), (938, '16:15', 2560), (938, '20:05', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 939, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'WAW'; -- 840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (939, '08:10', 3310), (939, '11:30', 3430), (939, '13:15', 868230), (939, '16:45', 85290), (939, '19:40', 3880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 940, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BCN'; -- 2554 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (940, '07:35', 434570), (940, '09:45', 2980), (940, '13:05', 790), (940, '17:20', 390), (940, '20:15', 4740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 941, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MAD'; -- 2882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (941, '06:40', 2330), (941, '08:50', 410), (941, '11:15', 1420), (941, '14:00', 2670), (941, '16:05', 4680), (941, '18:15', 4280), (941, '20:30', 1660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 942, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'AGP'; -- 3286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (942, '07:55', 2510), (942, '09:40', 2950), (942, '12:55', 3360), (942, '14:55', 210), (942, '17:55', 1470), (942, '19:40', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 943, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'PMI'; -- 2697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (943, '06:45', 83310), (943, '10:25', 3920), (943, '13:25', 1210), (943, '16:05', 4110), (943, '19:20', 870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 944, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'LPA'; -- 4638 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (944, '07:45', 2620), (944, '10:15', 3780), (944, '13:00', 3980), (944, '14:20', 530), (944, '17:25', 1660), (944, '19:55', 4960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 945, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'LIS'; -- 3309 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (945, '07:20', 61800), (945, '09:55', 59880), (945, '11:45', 410530), (945, '14:15', 382830), (945, '16:10', 963620), (945, '18:10', 304760), (945, '20:40', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 946, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'FCO'; -- 2142 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (946, '06:40', 4850), (946, '08:50', 4130), (946, '11:10', 4490), (946, '13:20', 220), (946, '16:30', 2870), (946, '18:35', 2270), (946, '20:35', 1210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 947, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MXP'; -- 1870 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (947, '07:25', 240), (947, '09:55', 1880), (947, '14:05', 18320), (947, '16:55', 2950), (947, '20:10', 60050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 948, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'ATH'; -- 2388 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (948, '07:05', 2880), (948, '09:20', 2070), (948, '11:05', 4760), (948, '13:35', 71890), (948, '15:35', 560620), (948, '18:40', 310), (948, '20:00', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 949, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'IST'; -- 2036 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (949, '07:05', 2000), (949, '10:30', 2410), (949, '12:50', 1730), (949, '15:15', 3380), (949, '18:15', 4450), (949, '20:20', 3400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 950, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'DXB'; -- 4471 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (950, '07:35', 1490), (950, '09:25', 940), (950, '12:20', 3090), (950, '15:35', 2090), (950, '17:00', 1390), (950, '20:50', 4210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 951, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'BKK'; -- 7905 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (951, '06:50', 1080), (951, '09:20', 3790), (951, '12:20', 16710), (951, '15:10', 65110), (951, '17:20', 270), (951, '20:30', 3160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 952, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'JFK'; -- 6651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (952, '07:05', 350), (952, '09:55', 91630), (952, '12:45', 4270), (952, '15:20', 2760), (952, '17:50', 4320), (952, '20:35', 484680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 953, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'EWR'; -- 6665 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (953, '07:45', 4690), (953, '09:55', 40040), (953, '11:15', 4010), (953, '13:50', 430), (953, '15:20', 818740), (953, '18:15', 1660), (953, '20:35', 470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 954, f.id, t.id, 570 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'ORD'; -- 7178 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (954, '07:05', 2270), (954, '09:30', 334720), (954, '10:55', 952780), (954, '13:40', 3200), (954, '16:15', 2830), (954, '18:40', 793580), (954, '19:45', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 955, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'MIA'; -- 8365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (955, '08:15', 920), (955, '11:15', 3310), (955, '13:35', 480), (955, '17:10', 4660), (955, '19:20', 560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 956, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'LAX'; -- 9097 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (956, '08:00', 1030), (956, '10:25', 240160), (956, '13:30', 1740), (956, '16:50', 1620), (956, '19:15', 1380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 957, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'TLL' AND t.iata = 'YYZ'; -- 6652 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (957, '07:05', 3240), (957, '09:40', 3120), (957, '11:00', 2690), (957, '14:05', 3450), (957, '16:30', 2140), (957, '17:35', 2960), (957, '19:50', 1480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 958, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'ARN'; -- 466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (958, '06:30', 480), (958, '09:30', 3860), (958, '12:00', 1230), (958, '13:35', 2630), (958, '16:00', 1050), (958, '17:40', 380), (958, '20:40', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 959, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BMA'; -- 445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (959, '06:50', 1520), (959, '10:50', 4610), (959, '12:50', 4840), (959, '16:10', 3040), (959, '20:05', 370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 960, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'GOT'; -- 706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (960, '07:05', 4670), (960, '09:25', 3490), (960, '11:00', 2560), (960, '13:15', 330690), (960, '15:35', 3360), (960, '18:20', 180400), (960, '20:20', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 961, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MMX'; -- 672 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (961, '07:20', 4970), (961, '09:15', 3490), (961, '11:45', 1310), (961, '14:40', 2080), (961, '17:20', 54940), (961, '20:55', 663250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 962, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'LLA'; -- 963 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (962, '07:20', 2660), (962, '10:00', 3260), (962, '12:25', 981580), (962, '15:45', 1050), (962, '17:25', 4380), (962, '20:40', 1680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 963, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'VBY'; -- 347 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (963, '07:55', 3030), (963, '09:50', 1470), (963, '14:30', 2320), (963, '17:45', 1220), (963, '20:50', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 964, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'UME'; -- 790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (964, '07:40', 1580), (964, '09:55', 2860), (964, '11:40', 3190), (964, '13:15', 3240), (964, '15:20', 3480), (964, '18:20', 2060), (964, '20:00', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 965, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'OSD'; -- 871 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (965, '07:10', 1080), (965, '11:30', 270), (965, '13:30', 1200), (965, '17:40', 2870), (965, '20:40', 790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 966, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'KRN'; -- 1226 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (966, '07:00', 1250), (966, '09:15', 882570), (966, '11:00', 366500), (966, '13:10', 3620), (966, '15:40', 4860), (966, '18:15', 158910), (966, '20:05', 878990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 967, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'OSL'; -- 829 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (967, '08:05', 27140), (967, '10:55', 930), (967, '13:10', 61680), (967, '17:15', 4150), (967, '19:45', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 968, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BGO'; -- 1144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (968, '07:10', 2430), (968, '09:35', 460), (968, '11:55', 1350), (968, '14:20', 4200), (968, '15:45', 2900), (968, '17:55', 4830), (968, '21:00', 3570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 969, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'TRD'; -- 1021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (969, '06:40', 4540), (969, '09:55', 2630), (969, '13:05', 589190), (969, '14:25', 3490), (969, '17:30', 1960), (969, '19:45', 443730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 970, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'CPH'; -- 713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (970, '07:20', 89700), (970, '10:30', 4810), (970, '12:50', 470), (970, '15:25', 920), (970, '17:30', 79640), (970, '20:35', 91860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 971, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'AAL'; -- 854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (971, '06:55', 3900), (971, '09:45', 1830), (971, '11:30', 2880), (971, '13:30', 150), (971, '15:20', 1410), (971, '17:45', 4960), (971, '20:30', 440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 972, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'KEF'; -- 2605 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (972, '06:40', 437530), (972, '10:45', 71220), (972, '13:25', 3880), (972, '16:05', 560), (972, '20:35', 4250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 973, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'TLL'; -- 281 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (973, '07:40', 1080), (973, '09:10', 2390), (973, '10:55', 567010), (973, '14:05', 67180), (973, '16:00', 820), (973, '18:40', 350), (973, '20:15', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 974, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'LHR'; -- 1689 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (974, '06:40', 2520), (974, '10:30', 4960), (974, '13:40', 55460), (974, '16:15', 4950), (974, '20:50', 4930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 975, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MAN'; -- 1704 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (975, '06:50', 141890), (975, '10:35', 360), (975, '12:35', 2860), (975, '14:55', 3300), (975, '18:05', 3940), (975, '20:50', 4080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 976, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'EDI'; -- 1673 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (976, '07:00', 3590), (976, '09:50', 743740), (976, '11:45', 639210), (976, '13:55', 1290), (976, '15:35', 2760), (976, '17:40', 2030), (976, '19:55', 3960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 977, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'DUB'; -- 1941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (977, '07:45', 2440), (977, '09:10', 59290), (977, '11:05', 3960), (977, '14:00', 7610), (977, '16:00', 2630), (977, '18:00', 3230), (977, '19:55', 4940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 978, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'CDG'; -- 1672 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (978, '07:20', 4010), (978, '09:30', 1220), (978, '12:25', 2600), (978, '15:00', 2130), (978, '17:20', 2150), (978, '19:40', 855570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 979, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'NCE'; -- 1884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (979, '07:00', 1230), (979, '10:25', 3770), (979, '12:05', 2620), (979, '14:40', 4840), (979, '18:20', 3460), (979, '19:50', 2560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 980, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'AMS'; -- 1333 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (980, '07:35', 550100), (980, '09:40', 853900), (980, '11:55', 2950), (980, '13:35', 900), (980, '15:50', 1720), (980, '18:50', 99730), (980, '21:00', 3350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 981, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BRU'; -- 1434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (981, '06:30', 7820), (981, '09:20', 1830), (981, '12:00', 2680), (981, '13:35', 3020), (981, '15:40', 55380), (981, '18:40', 760), (981, '20:35', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 982, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'FRA'; -- 1270 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (982, '07:45', 3050), (982, '09:15', 1100), (982, '11:20', 2380), (982, '13:30', 360), (982, '15:50', 1790), (982, '18:05', 3270), (982, '20:10', 2560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 983, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MUC'; -- 1255 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (983, '07:25', 4570), (983, '09:45', 440), (983, '11:20', 3010), (983, '13:10', 1560), (983, '16:00', 630), (983, '17:40', 320), (983, '19:55', 1220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 984, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BER'; -- 841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (984, '06:35', 450), (984, '10:30', 3990), (984, '11:55', 390980), (984, '15:45', 360), (984, '18:15', 4710), (984, '19:50', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 985, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'ZRH'; -- 1481 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (985, '06:30', 1210), (985, '09:50', 32410), (985, '10:55', 3930), (985, '14:15', 4110), (985, '15:35', 640), (985, '17:35', 2470), (985, '20:20', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 986, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'VIE'; -- 1099 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (986, '07:55', 692090), (986, '10:30', 2850), (986, '14:00', 5430), (986, '17:15', 3580), (986, '19:05', 3280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 987, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'PRG'; -- 992 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (987, '07:10', 4790), (987, '11:10', 60600), (987, '14:05', 4860), (987, '17:05', 1750), (987, '19:35', 554820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 988, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'WAW'; -- 562 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (988, '07:50', 4290), (988, '10:45', 525210), (988, '14:05', 3180), (988, '16:55', 408070), (988, '19:25', 4090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 989, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BCN'; -- 2336 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (989, '08:00', 810), (989, '09:20', 954290), (989, '12:40', 1530), (989, '15:20', 840), (989, '17:25', 480), (989, '20:55', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 990, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MAD'; -- 2691 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (990, '07:35', 58200), (990, '10:45', 2920), (990, '13:05', 4850), (990, '16:55', 1660), (990, '19:40', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 991, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'AGP'; -- 3082 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (991, '07:10', 23500), (991, '09:55', 4900), (991, '12:55', 3390), (991, '14:20', 3420), (991, '17:00', 1350), (991, '20:35', 2340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 992, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'PMI'; -- 2469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (992, '07:15', 1120), (992, '10:20', 4830), (992, '13:00', 584470), (992, '15:10', 74520), (992, '18:15', 2100), (992, '19:45', 1260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 993, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'LPA'; -- 4455 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (993, '06:35', 750), (993, '09:10', 2140), (993, '11:55', 500), (993, '13:10', 635080), (993, '16:35', 880), (993, '17:55', 388420), (993, '20:30', 720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 994, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'LIS'; -- 3137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (994, '06:50', 4510), (994, '10:35', 694830), (994, '12:50', 499360), (994, '14:35', 3340), (994, '18:05', 700), (994, '20:30', 1510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 995, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'FCO'; -- 1877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (995, '07:50', 75610), (995, '10:00', 34240), (995, '12:50', 3620), (995, '17:10', 3440), (995, '19:55', 3130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 996, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MXP'; -- 1636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (996, '08:25', 2870), (996, '09:50', 861740), (996, '14:35', 1600), (996, '16:10', 4700), (996, '20:20', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 997, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'ATH'; -- 2110 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (997, '07:00', 1890), (997, '08:50', 4430), (997, '11:15', 2760), (997, '13:25', 3600), (997, '16:25', 3760), (997, '18:35', 490), (997, '19:50', 9500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 998, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'DXB'; -- 4319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (998, '07:45', 4720), (998, '10:35', 1260), (998, '12:20', 1170), (998, '15:35', 3030), (998, '17:25', 615750), (998, '19:40', 1310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 999, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'BKK'; -- 7935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (999, '07:25', 2620), (999, '09:35', 1050), (999, '12:05', 800), (999, '13:45', 4760), (999, '15:30', 2790), (999, '18:25', 800), (999, '20:00', 4380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1000, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'JFK'; -- 6746 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1000, '08:20', 3400), (1000, '10:10', 65890), (1000, '12:55', 250), (1000, '17:10', 3700), (1000, '19:15', 1350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1001, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'EWR'; -- 6762 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1001, '07:30', 1100), (1001, '09:20', 1790), (1001, '12:00', 1430), (1001, '13:30', 531110), (1001, '15:55', 1160), (1001, '17:50', 3310), (1001, '20:25', 4960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1002, f.id, t.id, 580 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'ORD'; -- 7321 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1002, '07:05', 4690), (1002, '10:15', 880), (1002, '13:10', 1250), (1002, '15:45', 4330), (1002, '18:05', 1880), (1002, '19:40', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1003, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'MIA'; -- 8440 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1003, '08:15', 4820), (1003, '10:50', 3200), (1003, '14:20', 4760), (1003, '17:00', 33130), (1003, '19:50', 3980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1004, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'LAX'; -- 9311 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1004, '07:30', 1530), (1004, '10:10', 160010), (1004, '12:55', 4180), (1004, '15:30', 4800), (1004, '16:55', 3010), (1004, '20:45', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1005, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'RIX' AND t.iata = 'YYZ'; -- 6775 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1005, '07:25', 3200), (1005, '09:00', 4930), (1005, '11:45', 1210), (1005, '14:15', 4200), (1005, '15:40', 2310), (1005, '18:30', 4300), (1005, '20:25', 27990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1006, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BMA'; -- 1446 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1006, '07:40', 169860), (1006, '10:00', 4620), (1006, '14:20', 240), (1006, '17:00', 536730), (1006, '20:20', 3660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1007, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MMX'; -- 1017 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1007, '07:20', 1280), (1007, '11:05', 1210), (1007, '13:25', 3950), (1007, '16:25', 4310), (1007, '20:00', 300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1008, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'LLA'; -- 2018 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1008, '07:25', 589070), (1008, '09:45', 47610), (1008, '11:55', 1820), (1008, '13:55', 1280), (1008, '16:20', 2080), (1008, '18:00', 461140), (1008, '19:45', 3670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1009, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'VBY'; -- 1387 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1009, '06:55', 4410), (1009, '10:00', 2170), (1009, '11:50', 4880), (1009, '15:00', 1050), (1009, '17:40', 700), (1009, '20:50', 2510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1010, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'UME'; -- 1827 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1010, '07:10', 1270), (1010, '09:35', 1500), (1010, '11:50', 550), (1010, '13:25', 3390), (1010, '15:20', 1850), (1010, '18:45', 310), (1010, '20:50', 3610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1011, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'OSD'; -- 1574 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1011, '07:00', 1780), (1011, '11:05', 2830), (1011, '12:50', 4040), (1011, '17:35', 1140), (1011, '19:40', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1012, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'OSL'; -- 1205 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1012, '07:45', 665510), (1012, '11:05', 4900), (1012, '13:05', 2370), (1012, '16:20', 3910), (1012, '20:50', 358910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1013, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BGO'; -- 1042 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1013, '07:30', 460), (1013, '09:50', 1510), (1013, '12:30', 1140), (1013, '14:20', 540), (1013, '17:20', 4480), (1013, '20:10', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1014, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'TRD'; -- 1492 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1014, '08:05', 44130), (1014, '11:10', 92160), (1014, '12:55', 3550), (1014, '16:25', 4900), (1014, '20:45', 4010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1015, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'CPH'; -- 979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1015, '07:55', 2210), (1015, '09:40', 2070), (1015, '13:05', 1070), (1015, '15:00', 2770), (1015, '17:45', 3060), (1015, '20:55', 2170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1016, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'AAL'; -- 913 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1016, '07:35', 4800), (1016, '10:00', 420), (1016, '13:55', 730), (1016, '17:20', 710060), (1016, '20:20', 93740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1017, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'HEL'; -- 1847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1017, '08:15', 3450), (1017, '11:25', 1020), (1017, '14:30', 2120), (1017, '16:35', 890), (1017, '19:55', 2810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1018, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'KEF'; -- 1895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1018, '06:55', 4420), (1018, '09:15', 430), (1018, '12:45', 290), (1018, '15:10', 790), (1018, '17:35', 1670), (1018, '20:55', 69540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1019, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'TLL'; -- 1807 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1019, '07:55', 1150), (1019, '09:45', 490), (1019, '13:40', 90920), (1019, '16:15', 1950), (1019, '20:40', 550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1020, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'RIX'; -- 1689 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1020, '07:45', 730), (1020, '09:50', 554060), (1020, '14:35', 2380), (1020, '16:35', 792370), (1020, '19:20', 2610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1021, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'NCE'; -- 1041 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1021, '07:20', 990), (1021, '10:05', 1530), (1021, '14:35', 790), (1021, '16:40', 3440), (1021, '19:10', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1022, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'AMS'; -- 369 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1022, '07:20', 2970), (1022, '09:35', 117540), (1022, '11:00', 2330), (1022, '13:20', 2920), (1022, '16:30', 3290), (1022, '18:50', 840), (1022, '20:25', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1023, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BRU'; -- 349 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1023, '07:20', 270), (1023, '10:25', 2520), (1023, '11:50', 763370), (1023, '14:45', 235350), (1023, '18:05', 178690), (1023, '19:35', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1024, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'FRA'; -- 654 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1024, '07:20', 3460), (1024, '09:15', 479030), (1024, '11:05', 2310), (1024, '13:45', 3650), (1024, '16:30', 3560), (1024, '18:20', 41810), (1024, '20:00', 740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1025, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MUC'; -- 941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1025, '07:50', 1580), (1025, '10:05', 4730), (1025, '13:05', 978030), (1025, '16:20', 3630), (1025, '20:50', 2030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1026, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BER'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1026, '06:45', 4100), (1026, '09:25', 3570), (1026, '12:05', 510), (1026, '14:25', 97320), (1026, '17:00', 85900), (1026, '19:35', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1027, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'ZRH'; -- 788 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1027, '07:20', 1770), (1027, '09:35', 12260), (1027, '11:30', 2710), (1027, '13:45', 3140), (1027, '16:15', 480), (1027, '18:10', 584580), (1027, '20:35', 4330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1028, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'VIE'; -- 1274 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1028, '08:05', 3190), (1028, '10:50', 241430), (1028, '13:30', 811310), (1028, '17:35', 1960), (1028, '19:15', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1029, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'PRG'; -- 1043 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1029, '07:50', 730), (1029, '10:20', 1240), (1029, '12:05', 2800), (1029, '15:15', 3480), (1029, '17:25', 12540), (1029, '20:40', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1030, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'WAW'; -- 1469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1030, '07:00', 3150), (1030, '10:15', 2370), (1030, '11:50', 1950), (1030, '15:35', 3130), (1030, '18:15', 3900), (1030, '20:30', 1570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1031, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BCN'; -- 1147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1031, '07:05', 1660), (1031, '09:30', 6530), (1031, '11:35', 4330), (1031, '13:15', 4380), (1031, '15:25', 3300), (1031, '17:40', 2840), (1031, '20:00', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1032, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MAD'; -- 1244 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1032, '08:20', 830), (1032, '09:55', 2130), (1032, '13:10', 3460), (1032, '16:45', 4070), (1032, '20:25', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1033, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'AGP'; -- 1677 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1033, '07:05', 2240), (1033, '10:40', 93700), (1033, '14:35', 3760), (1033, '17:40', 3350), (1033, '19:20', 4130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1034, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'PMI'; -- 1348 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1034, '07:10', 4760), (1034, '09:20', 639680), (1034, '11:35', 520), (1034, '13:55', 293670), (1034, '15:25', 1310), (1034, '18:05', 810), (1034, '20:50', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1035, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'LPA'; -- 2900 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1035, '07:10', 4120), (1035, '09:10', 3400), (1035, '11:40', 4220), (1035, '13:40', 1070), (1035, '15:40', 55120), (1035, '18:05', 2100), (1035, '20:45', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1036, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'LIS'; -- 1565 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1036, '07:10', 27790), (1036, '10:45', 3710), (1036, '13:00', 2710), (1036, '17:05', 279620), (1036, '20:05', 720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1037, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'FCO'; -- 1444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1037, '06:55', 138610), (1037, '08:45', 3440), (1037, '11:20', 3600), (1037, '14:00', 2810), (1037, '16:35', 3150), (1037, '18:50', 3570), (1037, '20:45', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1038, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MXP'; -- 935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1038, '07:25', 3590), (1038, '09:35', 4200), (1038, '11:50', 3410), (1038, '13:25', 1520), (1038, '16:10', 3020), (1038, '17:55', 620), (1038, '20:25', 2350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1039, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'ATH'; -- 2425 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1039, '07:35', 40490), (1039, '09:20', 91140), (1039, '11:45', 3140), (1039, '14:00', 2130), (1039, '16:30', 1950), (1039, '18:15', 1590), (1039, '20:45', 62040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1040, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'IST'; -- 2488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1040, '07:30', 1240), (1040, '09:45', 2640), (1040, '12:55', 4780), (1040, '16:20', 4350), (1040, '19:30', 793570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1041, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'DXB'; -- 5497 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1041, '07:30', 960), (1041, '09:25', 1830), (1041, '11:55', 330), (1041, '15:20', 2690), (1041, '17:15', 430), (1041, '19:45', 4010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1042, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'BKK'; -- 9577 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1042, '07:05', 42010), (1042, '11:00', 1370), (1042, '13:25', 1750), (1042, '16:35', 2690), (1042, '19:45', 2190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1043, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'JFK'; -- 5541 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1043, '08:10', 4270), (1043, '10:10', 2190), (1043, '13:50', 1670), (1043, '16:15', 1790), (1043, '19:40', 2500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1044, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'ORD'; -- 6344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1044, '07:30', 720), (1044, '09:25', 610), (1044, '12:05', 1470), (1044, '14:35', 1750), (1044, '16:55', 720), (1044, '19:45', 3790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1045, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'MIA'; -- 7110 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1045, '08:15', 1650), (1045, '09:45', 1180), (1045, '13:50', 82410), (1045, '16:25', 150140), (1045, '20:00', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1046, f.id, t.id, 685 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'LAX'; -- 8761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1046, '08:05', 1320), (1046, '11:30', 620), (1046, '13:30', 1810), (1046, '17:05', 1460), (1046, '20:40', 730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1047, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'LHR' AND t.iata = 'YYZ'; -- 5708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1047, '07:50', 1150), (1047, '11:30', 3580), (1047, '14:35', 15540), (1047, '17:20', 4370), (1047, '20:35', 2620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1048, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'ARN'; -- 1416 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1048, '07:15', 54300), (1048, '10:15', 880), (1048, '12:40', 320), (1048, '15:15', 4210), (1048, '17:25', 518970), (1048, '20:45', 4490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1049, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BMA'; -- 1405 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1049, '07:40', 4390), (1049, '10:40', 1170), (1049, '14:20', 1770), (1049, '16:40', 4020), (1049, '19:50', 1870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1050, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'GOT'; -- 1033 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1050, '07:15', 500), (1050, '11:10', 4630), (1050, '14:30', 1010), (1050, '16:35', 1250), (1050, '19:30', 584550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1051, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'MMX'; -- 1038 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1051, '07:05', 4150), (1051, '11:00', 3720), (1051, '14:10', 3570), (1051, '16:40', 33070), (1051, '19:40', 95420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1052, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'LLA'; -- 1910 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1052, '07:55', 4860), (1052, '09:20', 420), (1052, '12:10', 510), (1052, '15:05', 3620), (1052, '17:25', 2460), (1052, '20:50', 730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1053, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'VBY'; -- 1378 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1053, '06:55', 2860), (1053, '09:30', 84510), (1053, '12:30', 2990), (1053, '15:45', 613530), (1053, '17:25', 248730), (1053, '19:40', 57660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1054, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'UME'; -- 1732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1054, '07:20', 57040), (1054, '10:10', 260), (1054, '12:10', 2110), (1054, '15:40', 3930), (1054, '17:45', 4510), (1054, '20:40', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1055, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'OSD'; -- 1461 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1055, '08:00', 2830), (1055, '09:25', 390), (1055, '12:05', 3950), (1055, '15:35', 3340), (1055, '18:05', 4720), (1055, '20:45', 690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1056, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'KRN'; -- 2004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1056, '07:50', 1710), (1056, '10:25', 3430), (1056, '12:45', 960), (1056, '14:25', 410), (1056, '17:50', 2450), (1056, '19:45', 3800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1057, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'OSL'; -- 1111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1057, '06:40', 360), (1057, '10:20', 148840), (1057, '12:45', 460), (1057, '14:50', 950), (1057, '17:45', 3950), (1057, '19:35', 550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1058, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BGO'; -- 895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1058, '07:25', 196020), (1058, '09:55', 938290), (1058, '13:15', 4990), (1058, '17:30', 520), (1058, '19:15', 139030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1059, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'TRD'; -- 1356 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1059, '07:25', 510), (1059, '09:30', 580), (1059, '11:35', 2100), (1059, '13:10', 2600), (1059, '15:35', 150), (1059, '18:20', 207560), (1059, '20:15', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1060, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'CPH'; -- 995 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1060, '08:05', 730), (1060, '11:00', 3820), (1060, '13:35', 4300), (1060, '16:35', 3490), (1060, '19:15', 1240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1061, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'AAL'; -- 873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1061, '07:30', 2810), (1061, '10:25', 1050), (1061, '12:35', 2130), (1061, '15:20', 1010), (1061, '18:10', 551940), (1061, '19:45', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1062, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'HEL'; -- 1812 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1062, '07:20', 3120), (1062, '09:45', 1970), (1062, '14:00', 780), (1062, '17:15', 64600), (1062, '19:20', 110510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1063, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'KEF'; -- 1653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1063, '08:25', 1250), (1063, '11:05', 970), (1063, '14:00', 3060), (1063, '17:05', 2260), (1063, '19:25', 1080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1064, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'TLL'; -- 1784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1064, '07:25', 770), (1064, '08:50', 52740), (1064, '11:40', 3980), (1064, '14:05', 590), (1064, '15:40', 2680), (1064, '18:30', 1230), (1064, '20:15', 2590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1065, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'RIX'; -- 1704 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1065, '06:55', 2200), (1065, '09:55', 1180), (1065, '12:15', 4410), (1065, '14:30', 810), (1065, '18:10', 170), (1065, '20:15', 3760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1066, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'EDI'; -- 297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1066, '06:35', 3340), (1066, '08:45', 2040), (1066, '11:00', 4390), (1066, '13:40', 450), (1066, '16:00', 645090), (1066, '18:50', 2820), (1066, '19:50', 2790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1067, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'DUB'; -- 263 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1067, '07:50', 910), (1067, '10:25', 4060), (1067, '14:25', 4630), (1067, '16:05', 3660), (1067, '20:00', 1550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1068, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'CDG'; -- 588 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1068, '07:50', 510880), (1068, '09:20', 3610), (1068, '12:55', 4010), (1068, '15:05', 600), (1068, '17:10', 2800), (1068, '20:00', 4710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1069, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'NCE'; -- 1282 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1069, '08:10', 750), (1069, '10:35', 4670), (1069, '14:15', 484680), (1069, '16:00', 4510), (1069, '20:45', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1070, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'AMS'; -- 487 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1070, '06:40', 97710), (1070, '09:15', 4680), (1070, '11:40', 220), (1070, '14:15', 1130), (1070, '15:25', 1430), (1070, '17:45', 4400), (1070, '19:50', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1071, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BRU'; -- 536 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1071, '07:00', 3950), (1071, '10:05', 230), (1071, '12:45', 2270), (1071, '14:35', 630), (1071, '17:45', 830), (1071, '19:50', 1230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1072, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'FRA'; -- 833 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1072, '06:45', 3990), (1072, '09:45', 4980), (1072, '14:00', 340), (1072, '17:40', 2500), (1072, '20:00', 660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1073, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'MUC'; -- 1131 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1073, '06:50', 2720), (1073, '10:05', 950), (1073, '12:30', 3440), (1073, '15:20', 4070), (1073, '17:55', 3930), (1073, '20:40', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1074, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BER'; -- 1063 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1074, '07:35', 3920), (1074, '09:35', 1320), (1074, '11:05', 35740), (1074, '14:00', 2100), (1074, '16:20', 3370), (1074, '18:20', 3090), (1074, '20:25', 3350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1075, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'ZRH'; -- 1007 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1075, '07:15', 3210), (1075, '09:50', 1430), (1075, '13:10', 2090), (1075, '14:50', 190), (1075, '17:00', 980560), (1075, '19:40', 1300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1076, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'VIE'; -- 1443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1076, '07:15', 161090), (1076, '09:15', 2630), (1076, '11:00', 4590), (1076, '14:10', 1430), (1076, '16:35', 572770), (1076, '18:50', 3840), (1076, '21:00', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1077, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'PRG'; -- 1192 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1077, '07:30', 3440), (1077, '09:15', 2230), (1077, '11:45', 4920), (1077, '14:20', 1300), (1077, '16:25', 548390), (1077, '18:30', 1180), (1077, '20:10', 470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1078, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'WAW'; -- 1563 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1078, '07:00', 1890), (1078, '11:05', 7520), (1078, '13:15', 1520), (1078, '17:00', 4730), (1078, '19:10', 4050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1079, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BCN'; -- 1379 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1079, '07:15', 1700), (1079, '09:30', 214440), (1079, '12:05', 1990), (1079, '14:10', 2700), (1079, '16:30', 3590), (1079, '18:45', 7320), (1079, '20:45', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1080, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'MAD'; -- 1433 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1080, '06:45', 4100), (1080, '09:30', 3100), (1080, '12:50', 200410), (1080, '14:20', 3090), (1080, '17:10', 970), (1080, '20:45', 3970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1081, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'AGP'; -- 1863 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1081, '06:50', 3420), (1081, '09:50', 1130), (1081, '13:05', 1980), (1081, '15:35', 3360), (1081, '17:20', 1010), (1081, '20:25', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1082, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'PMI'; -- 1581 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1082, '06:45', 4580), (1082, '09:10', 4710), (1082, '11:00', 380), (1082, '14:15', 582790), (1082, '16:35', 4650), (1082, '17:35', 950), (1082, '20:00', 61670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1083, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'LPA'; -- 3024 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1083, '07:40', 5710), (1083, '08:50', 95870), (1083, '11:05', 910), (1083, '13:55', 638730), (1083, '16:35', 65940), (1083, '17:50', 420), (1083, '20:55', 2090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1084, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'LIS'; -- 1703 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1084, '07:10', 24050), (1084, '09:40', 1270), (1084, '11:10', 3200), (1084, '13:40', 30040), (1084, '15:40', 52200), (1084, '17:40', 870), (1084, '19:45', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1085, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'FCO'; -- 1678 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1085, '07:05', 4510), (1085, '09:15', 695000), (1085, '11:45', 4400), (1085, '13:55', 224300), (1085, '15:45', 4180), (1085, '18:20', 320), (1085, '19:55', 2780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1086, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'MXP'; -- 1167 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1086, '06:40', 5070), (1086, '09:20', 4060), (1086, '11:45', 2860), (1086, '13:10', 4850), (1086, '16:30', 190), (1086, '18:15', 1420), (1086, '20:15', 1490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1087, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'ATH'; -- 2636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1087, '06:50', 287670), (1087, '08:40', 2650), (1087, '11:20', 4270), (1087, '13:25', 190), (1087, '15:20', 1980), (1087, '17:40', 330), (1087, '20:05', 3700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1088, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'IST'; -- 2667 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1088, '07:25', 800110), (1088, '10:05', 1160), (1088, '12:35', 3990), (1088, '14:35', 2510), (1088, '17:20', 4700), (1088, '20:50', 4120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1089, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'DXB'; -- 5655 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1089, '08:20', 10530), (1089, '10:30', 4790), (1089, '13:40', 48380), (1089, '16:45', 846570), (1089, '19:15', 3920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1090, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'BKK'; -- 9631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1090, '07:40', 3580), (1090, '08:45', 2400), (1090, '11:45', 1750), (1090, '13:15', 290), (1090, '16:00', 2720), (1090, '17:35', 729990), (1090, '19:55', 2480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1091, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'JFK'; -- 5362 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1091, '06:40', 4760), (1091, '09:20', 3940), (1091, '12:25', 4510), (1091, '15:45', 542190), (1091, '17:05', 2700), (1091, '20:25', 4530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1092, f.id, t.id, 435 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'EWR'; -- 5383 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1092, '07:25', 3310), (1092, '11:15', 1200), (1092, '13:40', 1890), (1092, '16:00', 2920), (1092, '19:30', 86550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1093, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'ORD'; -- 6139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1093, '06:40', 57130), (1093, '11:10', 1290), (1093, '13:35', 3720), (1093, '16:35', 230), (1093, '20:45', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1094, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'MIA'; -- 6957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1094, '08:20', 640), (1094, '09:45', 2460), (1094, '12:55', 170), (1094, '16:25', 4270), (1094, '20:15', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1095, f.id, t.id, 670 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'LAX'; -- 8530 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1095, '08:20', 210), (1095, '10:35', 930), (1095, '13:15', 521130), (1095, '16:50', 3090), (1095, '19:20', 57590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1096, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'MAN' AND t.iata = 'YYZ'; -- 5511 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1096, '07:30', 4190), (1096, '09:15', 510), (1096, '11:55', 2710), (1096, '13:55', 4540), (1096, '16:00', 3990), (1096, '18:35', 3020), (1096, '19:45', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1097, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'ARN'; -- 1320 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1097, '06:55', 3210), (1097, '08:55', 160), (1097, '11:10', 993440), (1097, '13:55', 4280), (1097, '15:30', 706540), (1097, '17:50', 2220), (1097, '20:50', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1098, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BMA'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1098, '07:45', 2650), (1098, '09:45', 3930), (1098, '11:45', 580), (1098, '13:55', 4290), (1098, '16:00', 3670), (1098, '18:25', 310), (1098, '20:15', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1099, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'GOT'; -- 970 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1099, '07:10', 2320), (1099, '10:05', 1650), (1099, '11:55', 4070), (1099, '14:55', 560), (1099, '18:15', 144960), (1099, '19:50', 3450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1100, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MMX'; -- 1046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1100, '07:50', 448080), (1100, '10:25', 1620), (1100, '14:30', 2720), (1100, '17:45', 81510), (1100, '19:30', 210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1101, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'LLA'; -- 1728 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1101, '07:20', 4730), (1101, '10:30', 2030), (1101, '13:25', 4980), (1101, '16:30', 610), (1101, '20:40', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1102, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'VBY'; -- 1330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1102, '07:00', 1110), (1102, '10:40', 10700), (1102, '13:35', 260), (1102, '17:40', 2290), (1102, '19:05', 913890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1103, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'UME'; -- 1568 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1103, '06:30', 38030), (1103, '09:05', 2300), (1103, '11:45', 2660), (1103, '14:10', 4030), (1103, '15:45', 489140), (1103, '18:35', 4650), (1103, '20:35', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1104, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'KRN'; -- 1790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1104, '06:55', 300950), (1104, '10:00', 1860), (1104, '13:00', 1670), (1104, '14:20', 1560), (1104, '17:05', 180), (1104, '20:50', 1980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1105, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'OSL'; -- 970 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1105, '07:25', 1170), (1105, '09:40', 2650), (1105, '11:55', 2900), (1105, '13:40', 4650), (1105, '15:20', 4880), (1105, '18:05', 4780), (1105, '20:05', 71370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1106, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BGO'; -- 697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1106, '06:30', 820), (1106, '08:50', 3170), (1106, '12:10', 4620), (1106, '13:55', 2250), (1106, '16:20', 1390), (1106, '18:05', 410220), (1106, '20:25', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1107, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'TRD'; -- 1153 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1107, '07:00', 1410), (1107, '11:10', 50710), (1107, '14:40', 2210), (1107, '16:00', 34010), (1107, '20:20', 3650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1108, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'CPH'; -- 1000 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1108, '08:25', 66530), (1108, '09:45', 3880), (1108, '13:55', 3910), (1108, '16:25', 4240), (1108, '19:05', 2190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1109, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'AAL'; -- 819 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1109, '07:35', 4040), (1109, '10:25', 2890), (1109, '12:40', 1370), (1109, '14:45', 2210), (1109, '17:30', 3050), (1109, '20:55', 442540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1110, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'HEL'; -- 1717 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1110, '07:00', 2430), (1110, '09:35', 194820), (1110, '11:45', 3390), (1110, '13:10', 3000), (1110, '15:35', 1580), (1110, '18:25', 2770), (1110, '20:25', 1640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1111, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'KEF'; -- 1385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1111, '07:40', 3440), (1111, '10:15', 77730), (1111, '12:55', 2920), (1111, '15:10', 990), (1111, '17:50', 4010), (1111, '20:00', 4930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1112, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'TLL'; -- 1706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1112, '07:10', 4700), (1112, '10:10', 4320), (1112, '12:50', 262580), (1112, '16:40', 4750), (1112, '20:40', 21480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1113, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'RIX'; -- 1673 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1113, '07:55', 662220), (1113, '10:15', 4930), (1113, '12:20', 3860), (1113, '15:45', 3750), (1113, '16:55', 4340), (1113, '20:45', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1114, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MAN'; -- 297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1114, '06:55', 1460), (1114, '10:10', 580110), (1114, '14:15', 2540), (1114, '17:05', 3230), (1114, '20:45', 3660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1115, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'DUB'; -- 336 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1115, '06:40', 930), (1115, '11:00', 10490), (1115, '13:05', 930), (1115, '17:00', 11510), (1115, '19:20', 4870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1116, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'CDG'; -- 869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1116, '06:50', 4420), (1116, '11:20', 4310), (1116, '13:45', 1410), (1116, '16:15', 768660), (1116, '19:20', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1117, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'NCE'; -- 1560 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1117, '07:05', 4560), (1117, '09:30', 1280), (1117, '11:05', 4320), (1117, '13:50', 71500), (1117, '15:40', 1570), (1117, '18:20', 3480), (1117, '20:00', 3870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1118, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'AMS'; -- 666 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1118, '07:40', 949760), (1118, '09:35', 2080), (1118, '12:35', 1910), (1118, '15:15', 2840), (1118, '18:20', 48890), (1118, '20:50', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1119, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BRU'; -- 764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1119, '06:55', 2190), (1119, '09:35', 1770), (1119, '11:50', 372360), (1119, '14:40', 1110), (1119, '17:05', 1970), (1119, '19:35', 4300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1120, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MUC'; -- 1331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1120, '07:20', 911140), (1120, '10:35', 4660), (1120, '11:55', 890), (1120, '15:35', 564470), (1120, '17:50', 2280), (1120, '19:35', 695310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1121, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BER'; -- 1165 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1121, '06:40', 4100), (1121, '09:20', 1530), (1121, '12:05', 4660), (1121, '13:10', 1780), (1121, '15:25', 2690), (1121, '18:00', 2280), (1121, '19:45', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1122, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'ZRH'; -- 1248 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1122, '06:30', 1910), (1122, '09:20', 4260), (1122, '11:15', 860), (1122, '14:05', 1110), (1122, '16:15', 2240), (1122, '18:00', 900), (1122, '20:35', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1123, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'VIE'; -- 1610 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1123, '07:20', 3840), (1123, '09:30', 2500), (1123, '12:05', 2050), (1123, '13:15', 517500), (1123, '15:35', 2630), (1123, '18:05', 87590), (1123, '20:40', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1124, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'PRG'; -- 1341 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1124, '07:00', 852760), (1124, '09:50', 18770), (1124, '11:45', 4040), (1124, '13:50', 1580), (1124, '16:20', 2680), (1124, '18:40', 4350), (1124, '20:50', 24160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1125, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'WAW'; -- 1634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1125, '07:20', 980), (1125, '09:20', 3310), (1125, '12:10', 1190), (1125, '13:10', 1150), (1125, '15:45', 2480), (1125, '17:45', 1140), (1125, '20:35', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1126, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BCN'; -- 1676 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1126, '08:05', 4950), (1126, '10:15', 2370), (1126, '13:05', 797900), (1126, '16:50', 3820), (1126, '19:55', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1127, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MAD'; -- 1719 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1127, '06:55', 4130), (1127, '09:50', 3250), (1127, '11:45', 610), (1127, '13:45', 52230), (1127, '16:10', 2490), (1127, '18:30', 2300), (1127, '20:50', 1010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1128, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'AGP'; -- 2146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1128, '07:45', 630), (1128, '10:10', 7860), (1128, '14:40', 4230), (1128, '17:45', 4940), (1128, '19:10', 818740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1129, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'PMI'; -- 1878 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1129, '06:40', 35550), (1129, '08:40', 2640), (1129, '11:10', 4520), (1129, '13:50', 1830), (1129, '16:35', 1580), (1129, '18:30', 3320), (1129, '20:35', 79290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1130, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'LPA'; -- 3260 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1130, '08:15', 530), (1130, '10:45', 1810), (1130, '14:00', 4900), (1130, '16:30', 260), (1130, '20:05', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1131, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'LIS'; -- 1957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1131, '07:05', 950), (1131, '09:40', 2910), (1131, '11:05', 4240), (1131, '13:45', 1200), (1131, '16:30', 1500), (1131, '17:40', 2040), (1131, '20:55', 850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1132, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'FCO'; -- 1935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1132, '07:10', 4350), (1132, '09:45', 390), (1132, '12:50', 2220), (1132, '15:40', 1860), (1132, '17:00', 410), (1132, '20:05', 3920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1133, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MXP'; -- 1424 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1133, '07:05', 1150), (1133, '09:55', 3890), (1133, '11:55', 953550), (1133, '13:40', 468040), (1133, '15:25', 750), (1133, '17:35', 1530), (1133, '19:45', 1370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1134, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'ATH'; -- 2847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1134, '06:55', 2590), (1134, '10:00', 649650), (1134, '13:10', 2240), (1134, '14:55', 73090), (1134, '17:25', 3390), (1134, '20:35', 816080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1135, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'IST'; -- 2830 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1135, '06:45', 730), (1135, '09:55', 4750), (1135, '14:35', 430), (1135, '16:15', 2860), (1135, '20:40', 997900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1136, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'DXB'; -- 5777 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1136, '07:25', 450), (1136, '09:05', 720), (1136, '11:20', 2840), (1136, '14:20', 327670), (1136, '15:40', 801830), (1136, '18:15', 270540), (1136, '20:20', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1137, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'BKK'; -- 9603 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1137, '07:20', 3040), (1137, '08:40', 4690), (1137, '11:40', 370), (1137, '13:35', 1230), (1137, '15:35', 940), (1137, '18:15', 2760), (1137, '20:15', 2860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1138, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'JFK'; -- 5225 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1138, '06:50', 1870), (1138, '08:45', 97490), (1138, '10:55', 365870), (1138, '14:15', 950), (1138, '16:00', 1950), (1138, '18:00', 903470), (1138, '20:40', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1139, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'EWR'; -- 5245 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1139, '06:40', 4190), (1139, '09:40', 1140), (1139, '13:10', 709910), (1139, '15:40', 2750), (1139, '18:15', 3250), (1139, '20:30', 474470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1140, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'ORD'; -- 5956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1140, '07:35', 4140), (1140, '09:20', 1230), (1140, '12:45', 99300), (1140, '14:20', 62930), (1140, '17:35', 4850), (1140, '20:20', 2030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1141, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'MIA'; -- 6857 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1141, '07:15', 1900), (1141, '09:40', 2580), (1141, '12:45', 4800), (1141, '14:40', 2150), (1141, '18:10', 1520), (1141, '19:40', 2610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1142, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'LAX'; -- 8292 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1142, '08:10', 1430), (1142, '11:10', 870), (1142, '14:30', 69510), (1142, '17:25', 530), (1142, '19:15', 2620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1143, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'EDI' AND t.iata = 'YYZ'; -- 5344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1143, '07:40', 4060), (1143, '09:15', 4670), (1143, '11:30', 2690), (1143, '13:50', 950), (1143, '15:25', 750), (1143, '18:50', 290), (1143, '20:00', 1230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1144, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'ARN'; -- 1623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1144, '07:50', 4860), (1144, '10:10', 1360), (1144, '14:40', 3520), (1144, '16:10', 3190), (1144, '20:05', 3360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1145, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BMA'; -- 1616 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1145, '07:50', 2850), (1145, '10:30', 1660), (1145, '12:30', 82950), (1145, '14:45', 3580), (1145, '18:00', 3780), (1145, '19:45', 310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1146, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'GOT'; -- 1253 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1146, '06:50', 484680), (1146, '11:20', 3620), (1146, '14:00', 4410), (1146, '17:25', 3440), (1146, '20:25', 377060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1147, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MMX'; -- 1284 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1147, '07:45', 1790), (1147, '10:20', 450), (1147, '13:55', 4230), (1147, '16:15', 3870), (1147, '19:40', 2580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1148, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'LLA'; -- 2061 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1148, '07:30', 2290), (1148, '11:20', 53840), (1148, '13:10', 881520), (1148, '17:10', 2360), (1148, '19:35', 2930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1149, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'VBY'; -- 1607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1149, '07:05', 1170), (1149, '09:50', 1330), (1149, '12:00', 3550), (1149, '14:45', 4870), (1149, '17:25', 2830), (1149, '20:25', 1660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1150, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'UME'; -- 1897 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1150, '07:15', 2340), (1150, '09:05', 281040), (1150, '12:00', 3470), (1150, '13:25', 3160), (1150, '16:35', 1920), (1150, '18:15', 2480), (1150, '20:20', 625530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1151, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'KRN'; -- 2126 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1151, '06:50', 810), (1151, '09:10', 750), (1151, '12:20', 1190), (1151, '14:30', 3150), (1151, '17:55', 3590), (1151, '20:45', 1690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1152, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'OSL'; -- 1290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1152, '06:50', 883080), (1152, '10:25', 3210), (1152, '12:00', 4470), (1152, '15:05', 2650), (1152, '17:20', 2200), (1152, '19:55', 4890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1153, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BGO'; -- 1031 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1153, '07:30', 4200), (1153, '09:30', 3650), (1153, '12:10', 3680), (1153, '14:25', 3370), (1153, '16:55', 820), (1153, '20:10', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1154, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'TRD'; -- 1488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1154, '08:25', 1820), (1154, '10:50', 228350), (1154, '13:50', 3250), (1154, '16:10', 1790), (1154, '19:50', 2250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1155, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'CPH'; -- 1240 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1155, '07:30', 3930), (1155, '10:20', 85010), (1155, '13:05', 810750), (1155, '17:05', 86330), (1155, '19:25', 3620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1156, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'AAL'; -- 1095 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1156, '06:40', 360), (1156, '09:30', 1690), (1156, '11:35', 1410), (1156, '14:10', 800), (1156, '16:20', 220), (1156, '18:40', 4630), (1156, '20:05', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1157, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'HEL'; -- 2022 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1157, '07:00', 4830), (1157, '10:10', 1890), (1157, '13:00', 1310), (1157, '14:50', 2340), (1157, '17:40', 3810), (1157, '20:15', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1158, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'KEF'; -- 1497 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1158, '06:45', 950), (1158, '09:20', 1870), (1158, '12:15', 3230), (1158, '14:55', 94040), (1158, '18:05', 718910), (1158, '19:55', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1159, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'TLL'; -- 2002 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1159, '07:05', 1170), (1159, '09:55', 3220), (1159, '12:00', 1070), (1159, '14:55', 1130), (1159, '17:50', 2070), (1159, '19:30', 995040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1160, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'RIX'; -- 1941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1160, '07:05', 34240), (1160, '09:20', 2340), (1160, '11:05', 60300), (1160, '13:40', 3700), (1160, '15:45', 820), (1160, '17:55', 4480), (1160, '20:20', 980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1161, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MAN'; -- 263 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1161, '07:20', 2900), (1161, '09:50', 2250), (1161, '11:50', 3550), (1161, '14:00', 2490), (1161, '15:55', 1900), (1161, '18:30', 2920), (1161, '20:30', 4650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1162, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'EDI'; -- 336 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1162, '07:40', 2390), (1162, '08:40', 1790), (1162, '11:35', 3900), (1162, '14:20', 1070), (1162, '16:00', 2930), (1162, '18:20', 1720), (1162, '21:00', 3080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1163, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'CDG'; -- 785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1163, '07:40', 4180), (1163, '09:05', 4330), (1163, '11:45', 3670), (1163, '14:15', 200), (1163, '16:00', 4480), (1163, '18:45', 4790), (1163, '20:15', 79070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1164, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'NCE'; -- 1466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1164, '07:25', 3100), (1164, '09:45', 608690), (1164, '13:10', 3330), (1164, '15:25', 900), (1164, '17:20', 58360), (1164, '20:05', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1165, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'AMS'; -- 749 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1165, '07:50', 230), (1165, '09:40', 3580), (1165, '11:45', 2930), (1165, '14:35', 665480), (1165, '17:15', 4730), (1165, '20:05', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1166, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BRU'; -- 783 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1166, '07:20', 256870), (1166, '09:25', 845870), (1166, '11:05', 850), (1166, '14:00', 3860), (1166, '16:05', 4370), (1166, '18:45', 3690), (1166, '20:35', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1167, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'FRA'; -- 1086 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1167, '06:40', 2040), (1167, '10:00', 2430), (1167, '12:45', 4040), (1167, '15:45', 31250), (1167, '18:00', 190), (1167, '20:40', 2320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1168, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MUC'; -- 1381 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1168, '07:15', 1220), (1168, '10:35', 170), (1168, '11:45', 2680), (1168, '14:40', 2400), (1168, '17:35', 170), (1168, '19:40', 2290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1169, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BER'; -- 1326 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1169, '07:00', 2110), (1169, '11:05', 3960), (1169, '13:25', 136170), (1169, '17:10', 1730), (1169, '20:10', 8130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1170, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'ZRH'; -- 1237 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1170, '08:10', 4470), (1170, '11:15', 105160), (1170, '13:50', 18450), (1170, '17:05', 4380), (1170, '19:20', 42050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1171, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'VIE'; -- 1701 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1171, '07:15', 330), (1171, '08:55', 1750), (1171, '11:20', 1480), (1171, '13:45', 2560), (1171, '16:30', 3220), (1171, '18:10', 3270), (1171, '20:20', 4850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1172, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'PRG'; -- 1454 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1172, '07:00', 4610), (1172, '09:00', 1250), (1172, '11:30', 4080), (1172, '13:50', 1490), (1172, '15:55', 2750), (1172, '18:35', 1820), (1172, '20:30', 87140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1173, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'WAW'; -- 1824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1173, '06:55', 170), (1173, '10:30', 1160), (1173, '12:55', 1580), (1173, '15:40', 1660), (1173, '18:05', 2860), (1173, '20:10', 352640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1174, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BCN'; -- 1485 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1174, '07:05', 1700), (1174, '09:40', 3090), (1174, '11:35', 3500), (1174, '13:40', 4280), (1174, '16:35', 1760), (1174, '18:15', 3040), (1174, '20:45', 750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1175, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MAD'; -- 1453 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1175, '07:45', 2660), (1175, '09:40', 800), (1175, '11:10', 2810), (1175, '13:55', 3890), (1175, '15:40', 4550), (1175, '18:00', 880), (1175, '21:00', 40260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1176, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'AGP'; -- 1869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1176, '08:15', 225280), (1176, '11:25', 760), (1176, '13:45', 4610), (1176, '16:20', 4910), (1176, '19:15', 1840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1177, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'PMI'; -- 1687 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1177, '08:05', 190), (1177, '11:10', 1590), (1177, '13:35', 4320), (1177, '16:35', 1250), (1177, '20:15', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1178, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'LPA'; -- 2933 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1178, '06:45', 4770), (1178, '10:35', 3070), (1178, '12:25', 70800), (1178, '15:10', 82560), (1178, '17:25', 89870), (1178, '19:40', 330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1179, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'LIS'; -- 1645 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1179, '06:40', 3170), (1179, '09:55', 750), (1179, '11:50', 4860), (1179, '14:35', 4300), (1179, '18:10', 4150), (1179, '20:25', 1500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1180, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'FCO'; -- 1886 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1180, '07:05', 63400), (1180, '10:50', 1020), (1180, '13:05', 1400), (1180, '16:30', 1180), (1180, '19:05', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1181, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MXP'; -- 1381 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1181, '07:40', 17300), (1181, '10:20', 3670), (1181, '13:15', 1500), (1181, '16:50', 4390), (1181, '20:40', 1160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1182, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'ATH'; -- 2874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1182, '07:15', 2440), (1182, '09:55', 54940), (1182, '12:00', 1560), (1182, '13:45', 2590), (1182, '16:30', 230), (1182, '17:40', 1020), (1182, '21:00', 2720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1183, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'IST'; -- 2923 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1183, '07:00', 2160), (1183, '09:15', 43650), (1183, '11:20', 1200), (1183, '13:25', 2470), (1183, '16:20', 98270), (1183, '17:55', 2770), (1183, '20:45', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1184, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'DXB'; -- 5917 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1184, '08:10', 2090), (1184, '10:45', 920), (1184, '13:05', 4010), (1184, '16:30', 4530), (1184, '20:40', 928210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1185, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'BKK'; -- 9875 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1185, '06:35', 66650), (1185, '09:45', 170430), (1185, '12:20', 94510), (1185, '15:45', 2260), (1185, '18:05', 1150), (1185, '20:35', 249710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1186, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'JFK'; -- 5104 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1186, '06:40', 4660), (1186, '08:40', 1290), (1186, '11:40', 2320), (1186, '13:10', 660), (1186, '15:55', 2850), (1186, '17:50', 916800), (1186, '19:50', 3390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1187, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'EWR'; -- 5126 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1187, '06:40', 3200), (1187, '10:05', 1200), (1187, '13:55', 600), (1187, '16:40', 2750), (1187, '20:40', 460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1188, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'ORD'; -- 5896 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1188, '06:55', 2070), (1188, '10:25', 4330), (1188, '11:55', 980010), (1188, '15:10', 542260), (1188, '17:00', 263950), (1188, '19:55', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1189, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'MIA'; -- 6694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1189, '06:40', 2130), (1189, '09:15', 1750), (1189, '13:10', 770), (1189, '14:50', 2630), (1189, '17:00', 2650), (1189, '19:45', 1510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1190, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'LAX'; -- 8319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1190, '06:40', 3380), (1190, '09:40', 765390), (1190, '12:05', 870), (1190, '13:15', 3230), (1190, '15:25', 2290), (1190, '18:10', 740), (1190, '20:10', 220890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1191, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'DUB' AND t.iata = 'YYZ'; -- 5262 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1191, '07:30', 47510), (1191, '09:15', 1050), (1191, '13:05', 2040), (1191, '14:55', 4840), (1191, '18:05', 2070), (1191, '20:50', 503740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1192, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BMA'; -- 1517 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1192, '08:25', 4350), (1192, '09:55', 520), (1192, '13:30', 92800), (1192, '16:15', 1540), (1192, '20:45', 610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1193, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'GOT'; -- 1157 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1193, '07:45', 97300), (1193, '09:25', 860), (1193, '12:00', 1960), (1193, '13:15', 2210), (1193, '16:30', 2150), (1193, '18:00', 1220), (1193, '20:25', 4330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1194, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MMX'; -- 1032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1194, '06:50', 1540), (1194, '10:25', 10050), (1194, '13:50', 330), (1194, '16:55', 1980), (1194, '19:15', 374710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1195, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'LLA'; -- 2162 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1195, '07:25', 352490), (1195, '10:15', 960), (1195, '13:25', 1630), (1195, '16:40', 1140), (1195, '19:50', 4630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1196, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'VBY'; -- 1417 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1196, '07:00', 770), (1196, '09:55', 2390), (1196, '13:05', 520), (1196, '15:00', 3210), (1196, '17:30', 160), (1196, '20:40', 154960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1197, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'UME'; -- 1958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1197, '07:25', 1500), (1197, '09:35', 2360), (1197, '11:40', 250), (1197, '13:20', 1060), (1197, '15:50', 3890), (1197, '18:40', 18340), (1197, '19:50', 4960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1198, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'OSD'; -- 1736 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1198, '07:00', 34790), (1198, '10:40', 3550), (1198, '13:30', 520), (1198, '16:05', 680590), (1198, '19:40', 1320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1199, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'KRN'; -- 2314 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1199, '07:50', 69720), (1199, '10:20', 2720), (1199, '13:25', 2200), (1199, '17:05', 1930), (1199, '20:05', 3810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1200, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'OSL'; -- 1357 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1200, '08:00', 1480), (1200, '10:05', 3670), (1200, '13:35', 1880), (1200, '17:10', 3810), (1200, '19:25', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1201, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BGO'; -- 1266 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1201, '08:05', 1440), (1201, '11:25', 62880), (1201, '14:40', 40480), (1201, '16:00', 3700), (1201, '19:15', 4400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1202, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'TRD'; -- 1685 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1202, '06:45', 3290), (1202, '11:00', 145440), (1202, '13:35', 4940), (1202, '17:20', 93270), (1202, '19:30', 2290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1203, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'CPH'; -- 1004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1203, '08:15', 1290), (1203, '11:15', 1280), (1203, '14:40', 1370), (1203, '17:00', 69790), (1203, '20:00', 2930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1204, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'AAL'; -- 1021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1204, '08:00', 1870), (1204, '10:20', 2140), (1204, '14:35', 4890), (1204, '16:20', 1960), (1204, '19:15', 3630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1205, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'HEL'; -- 1896 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1205, '07:30', 3920), (1205, '08:50', 1100), (1205, '12:00', 1690), (1205, '13:50', 3530), (1205, '16:30', 4540), (1205, '18:20', 4860), (1205, '20:55', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1206, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'KEF'; -- 2241 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1206, '06:55', 434170), (1206, '10:10', 3980), (1206, '13:00', 809110), (1206, '16:50', 58880), (1206, '20:25', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1207, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'TLL'; -- 1838 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1207, '06:50', 1570), (1207, '11:25', 3140), (1207, '14:15', 650), (1207, '16:55', 3190), (1207, '20:15', 4600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1208, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'RIX'; -- 1672 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1208, '06:55', 1310), (1208, '08:45', 4440), (1208, '12:00', 910), (1208, '14:20', 4360), (1208, '15:55', 3220), (1208, '18:45', 1970), (1208, '20:40', 1820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1209, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MAN'; -- 588 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1209, '06:50', 697750), (1209, '10:10', 3180), (1209, '12:50', 570), (1209, '17:15', 190), (1209, '19:40', 4400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1210, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'EDI'; -- 869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1210, '06:50', 4240), (1210, '08:45', 96280), (1210, '11:35', 290), (1210, '14:20', 4730), (1210, '15:35', 4160), (1210, '17:35', 2570), (1210, '20:20', 2380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1211, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'DUB'; -- 785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1211, '07:10', 4500), (1211, '10:20', 2690), (1211, '12:20', 4190), (1211, '15:45', 4960), (1211, '17:50', 510), (1211, '19:45', 3260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1212, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'NCE'; -- 694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1212, '07:15', 4070), (1212, '10:40', 580), (1212, '14:15', 2140), (1212, '17:20', 3290), (1212, '19:40', 2660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1213, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'AMS'; -- 399 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1213, '07:00', 2970), (1213, '11:20', 2360), (1213, '13:00', 3880), (1213, '16:55', 2490), (1213, '19:55', 4510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1214, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BRU'; -- 251 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1214, '08:15', 318120), (1214, '10:20', 700), (1214, '13:00', 1920), (1214, '16:25', 2190), (1214, '20:45', 3780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1215, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'FRA'; -- 449 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1215, '07:05', 690), (1215, '10:10', 860), (1215, '11:45', 2510), (1215, '14:50', 2940), (1215, '16:55', 4230), (1215, '20:05', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1216, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MUC'; -- 682 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1216, '07:10', 2060), (1216, '09:40', 76050), (1216, '11:35', 1390), (1216, '13:55', 2430), (1216, '15:30', 3510), (1216, '18:40', 520), (1216, '20:10', 2880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1217, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'ZRH'; -- 476 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1217, '07:35', 2380), (1217, '09:55', 1400), (1217, '12:05', 290280), (1217, '13:40', 43060), (1217, '15:20', 2690), (1217, '18:45', 3510), (1217, '21:00', 938710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1218, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'VIE'; -- 1035 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1218, '07:10', 2980), (1218, '09:25', 2040), (1218, '12:15', 1950), (1218, '15:20', 480), (1218, '18:15', 4050), (1218, '19:30', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1219, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'PRG'; -- 852 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1219, '06:55', 1140), (1219, '08:45', 240), (1219, '11:35', 770), (1219, '14:00', 3560), (1219, '16:10', 29290), (1219, '17:55', 66420), (1219, '19:50', 3760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1220, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'WAW'; -- 1343 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1220, '06:50', 4670), (1220, '09:40', 1950), (1220, '13:00', 390), (1220, '14:25', 1600), (1220, '17:20', 3030), (1220, '20:45', 720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1221, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BCN'; -- 858 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1221, '08:10', 3090), (1221, '11:15', 4810), (1221, '13:05', 4520), (1221, '17:00', 2070), (1221, '20:40', 93060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1222, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'AGP'; -- 1486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1222, '07:15', 3770), (1222, '08:55', 255040), (1222, '12:05', 66350), (1222, '14:05', 109660), (1222, '16:15', 640), (1222, '17:40', 550), (1222, '20:40', 70570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1223, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'PMI'; -- 1052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1223, '06:45', 431610), (1223, '10:25', 4100), (1223, '12:40', 4090), (1223, '14:50', 1750), (1223, '17:30', 976190), (1223, '20:20', 4240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1224, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'LPA'; -- 2801 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1224, '06:50', 1920), (1224, '10:00', 3340), (1224, '14:35', 2910), (1224, '17:10', 90610), (1224, '19:20', 419370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1225, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'LIS'; -- 1470 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1225, '07:35', 2360), (1225, '10:30', 4590), (1225, '12:45', 1120), (1225, '15:05', 3900), (1225, '18:10', 4770), (1225, '19:50', 901490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1226, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'FCO'; -- 1101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1226, '06:45', 2410), (1226, '10:55', 3530), (1226, '13:55', 400), (1226, '17:45', 579990), (1226, '20:45', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1227, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MXP'; -- 598 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1227, '06:55', 2670), (1227, '10:20', 3570), (1227, '12:55', 3180), (1227, '16:10', 2710), (1227, '20:10', 650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1228, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'ATH'; -- 2108 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1228, '07:00', 1220), (1228, '09:45', 1370), (1228, '11:20', 74420), (1228, '13:25', 384220), (1228, '15:50', 4780), (1228, '18:00', 1990), (1228, '20:40', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1229, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'IST'; -- 2214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1229, '07:00', 1480), (1229, '10:55', 105540), (1229, '13:40', 6350), (1229, '17:05', 2680), (1229, '19:15', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1230, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'DXB'; -- 5238 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1230, '07:40', 2470), (1230, '10:05', 2940), (1230, '12:55', 390), (1230, '15:45', 76360), (1230, '18:10', 760), (1230, '20:05', 3270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1231, f.id, t.id, 740 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'BKK'; -- 9448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1231, '07:30', 650), (1231, '09:20', 390), (1231, '12:00', 2000), (1231, '14:05', 85150), (1231, '15:50', 910), (1231, '17:35', 1980), (1231, '20:50', 200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1232, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'JFK'; -- 5834 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1232, '08:10', 930), (1232, '11:05', 1600), (1232, '13:40', 720), (1232, '17:10', 590260), (1232, '19:55', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1233, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'EWR'; -- 5857 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1233, '07:10', 68540), (1233, '09:00', 1780), (1233, '11:50', 1610), (1233, '14:15', 3210), (1233, '15:30', 1370), (1233, '18:35', 2250), (1233, '20:00', 160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1234, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'ORD'; -- 6664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1234, '07:00', 82370), (1234, '09:40', 950), (1234, '12:15', 340), (1234, '15:35', 2170), (1234, '18:10', 93840), (1234, '20:15', 3720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1235, f.id, t.id, 585 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'MIA'; -- 7372 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1235, '07:35', 828340), (1235, '09:55', 2710), (1235, '13:00', 2660), (1235, '16:50', 2990), (1235, '19:30', 4590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1236, f.id, t.id, 715 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'LAX'; -- 9103 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1236, '08:25', 2460), (1236, '11:10', 4870), (1236, '14:40', 984720), (1236, '16:55', 3840), (1236, '19:45', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1237, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'CDG' AND t.iata = 'YYZ'; -- 6020 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1237, '06:50', 92460), (1237, '10:10', 1460), (1237, '12:45', 4460), (1237, '14:25', 4360), (1237, '17:30', 1910), (1237, '20:25', 1370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1238, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'ARN'; -- 1920 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1238, '07:45', 600), (1238, '10:00', 2530), (1238, '13:40', 1420), (1238, '17:20', 1070), (1238, '20:40', 23720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1239, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BMA'; -- 1890 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1239, '06:50', 4080), (1239, '11:10', 2030), (1239, '13:15', 3630), (1239, '17:15', 920), (1239, '19:25', 3240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1240, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'GOT'; -- 1597 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1240, '07:45', 3430), (1240, '09:00', 3650), (1240, '12:05', 1490), (1240, '13:35', 2260), (1240, '15:40', 41700), (1240, '18:35', 420920), (1240, '19:50', 910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1241, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MMX'; -- 1392 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1241, '06:35', 3790), (1241, '10:05', 2380), (1241, '13:05', 3170), (1241, '15:45', 4150), (1241, '17:20', 6290), (1241, '19:50', 889000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1242, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'LLA'; -- 2600 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1242, '07:00', 3630), (1242, '09:40', 2120), (1242, '10:55', 3880), (1242, '13:15', 4870), (1242, '15:30', 44800), (1242, '18:20', 26410), (1242, '19:45', 3130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1243, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'VBY'; -- 1738 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1243, '07:30', 510), (1243, '09:15', 400), (1243, '11:00', 2000), (1243, '14:05', 2410), (1243, '15:20', 1810), (1243, '18:40', 345840), (1243, '20:10', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1244, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'UME'; -- 2387 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1244, '06:55', 1030), (1244, '09:40', 3180), (1244, '12:00', 2110), (1244, '14:10', 2080), (1244, '15:25', 509140), (1244, '18:30', 4790), (1244, '20:05', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1245, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'OSD'; -- 2221 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1245, '07:40', 670), (1245, '09:50', 2370), (1245, '11:55', 590), (1245, '14:10', 2200), (1245, '15:35', 4690), (1245, '18:25', 4030), (1245, '20:30', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1246, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'KRN'; -- 2795 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1246, '07:00', 4960), (1246, '11:05', 900), (1246, '13:20', 2910), (1246, '17:25', 660), (1246, '19:45', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1247, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'OSL'; -- 1856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1247, '08:20', 1750), (1247, '09:50', 1590), (1247, '14:20', 4940), (1247, '16:55', 3240), (1247, '19:45', 4370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1248, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BGO'; -- 1854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1248, '06:50', 1090), (1248, '08:55', 4030), (1248, '11:35', 2310), (1248, '13:10', 4460), (1248, '16:35', 180), (1248, '18:50', 66520), (1248, '20:05', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1249, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'TRD'; -- 2214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1249, '06:35', 582760), (1249, '09:35', 200), (1249, '11:20', 660), (1249, '14:10', 2760), (1249, '16:25', 2440), (1249, '17:40', 300), (1249, '19:55', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1250, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'CPH'; -- 1385 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1250, '07:00', 4350), (1250, '09:10', 1070), (1250, '10:55', 1040), (1250, '13:15', 4920), (1250, '15:30', 4990), (1250, '18:20', 3580), (1250, '20:00', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1251, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'AAL'; -- 1505 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1251, '07:20', 874310), (1251, '08:50', 2800), (1251, '11:45', 24360), (1251, '13:30', 930860), (1251, '16:35', 678490), (1251, '18:05', 1880), (1251, '20:10', 714450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1252, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'HEL'; -- 2200 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1252, '06:55', 4630), (1252, '11:00', 1460), (1252, '13:15', 3110), (1252, '16:20', 1930), (1252, '19:20', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1253, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'KEF'; -- 2935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1253, '07:20', 2840), (1253, '09:20', 54660), (1253, '11:45', 2410), (1253, '13:35', 480), (1253, '16:35', 3860), (1253, '18:30', 901020), (1253, '20:15', 283970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1254, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'TLL'; -- 2119 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1254, '07:15', 1310), (1254, '09:20', 4770), (1254, '11:35', 4810), (1254, '14:20', 260), (1254, '16:30', 1440), (1254, '18:00', 81760), (1254, '20:15', 2610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1255, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'RIX'; -- 1884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1255, '07:10', 1920), (1255, '09:00', 27660), (1255, '11:25', 470), (1255, '13:30', 2800), (1255, '16:30', 3230), (1255, '18:50', 2480), (1255, '20:30', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1256, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'LHR'; -- 1041 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1256, '08:25', 300), (1256, '11:15', 480), (1256, '13:25', 88060), (1256, '16:10', 640), (1256, '19:40', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1257, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MAN'; -- 1282 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1257, '06:45', 3550), (1257, '11:15', 680), (1257, '13:50', 3940), (1257, '16:50', 3880), (1257, '20:45', 1260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1258, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'EDI'; -- 1560 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1258, '07:10', 31260), (1258, '09:20', 4790), (1258, '12:05', 750), (1258, '14:15', 60660), (1258, '15:55', 2000), (1258, '18:20', 2510), (1258, '19:45', 483200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1259, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'DUB'; -- 1466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1259, '06:30', 4710), (1259, '09:10', 1920), (1259, '11:50', 2410), (1259, '13:40', 3040), (1259, '15:45', 1750), (1259, '17:50', 190), (1259, '19:55', 62980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1260, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'CDG'; -- 694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1260, '08:20', 997570), (1260, '10:15', 4240), (1260, '12:55', 20530), (1260, '17:20', 3590), (1260, '20:10', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1261, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'AMS'; -- 979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1261, '06:50', 851480), (1261, '08:50', 2670), (1261, '11:55', 46570), (1261, '14:10', 1100), (1261, '15:30', 980), (1261, '18:40', 230970), (1261, '19:55', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1262, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BRU'; -- 831 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1262, '07:15', 1560), (1262, '10:45', 410), (1262, '14:40', 500), (1262, '17:25', 4950), (1262, '19:40', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1263, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'FRA'; -- 716 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1263, '07:30', 75370), (1263, '09:55', 640), (1263, '11:50', 4120), (1263, '15:00', 719790), (1263, '17:45', 2080), (1263, '20:05', 2890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1264, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BER'; -- 1074 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1264, '07:45', 270), (1264, '10:30', 4660), (1264, '12:40', 3710), (1264, '15:45', 3920), (1264, '17:55', 540), (1264, '19:50', 102190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1265, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'ZRH'; -- 435 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1265, '07:25', 2000), (1265, '09:20', 65370), (1265, '12:20', 900), (1265, '15:05', 540), (1265, '17:50', 520), (1265, '20:45', 4380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1266, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'VIE'; -- 876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1266, '07:20', 1200), (1266, '09:10', 610), (1266, '11:25', 4850), (1266, '13:55', 3400), (1266, '16:30', 254290), (1266, '17:50', 910), (1266, '19:45', 74950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1267, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'PRG'; -- 893 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1267, '07:15', 3080), (1267, '09:20', 1430), (1267, '12:00', 3650), (1267, '15:45', 200), (1267, '17:20', 67370), (1267, '20:15', 2540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1268, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'WAW'; -- 1391 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1268, '07:10', 57530), (1268, '09:40', 1410), (1268, '12:25', 3910), (1268, '14:35', 516750), (1268, '18:15', 3350), (1268, '19:45', 4050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1269, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BCN'; -- 496 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1269, '07:55', 1470), (1269, '10:05', 1040), (1269, '12:35', 2270), (1269, '15:20', 3420), (1269, '18:10', 4620), (1269, '20:15', 160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1270, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MAD'; -- 957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1270, '06:55', 4520), (1270, '11:25', 2200), (1270, '14:05', 2850), (1270, '17:30', 2690), (1270, '19:55', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1271, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'AGP'; -- 1261 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1271, '07:20', 4220), (1271, '09:10', 2950), (1271, '11:05', 2030), (1271, '13:15', 1730), (1271, '16:25', 630), (1271, '18:15', 642690), (1271, '21:00', 23620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1272, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'PMI'; -- 589 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1272, '07:45', 1970), (1272, '10:00', 55680), (1272, '13:10', 3550), (1272, '17:15', 930), (1272, '19:40', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1273, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'LPA'; -- 2671 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1273, '07:50', 2930), (1273, '09:40', 2830), (1273, '12:50', 3950), (1273, '15:10', 750), (1273, '17:10', 840), (1273, '20:30', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1274, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'LIS'; -- 1469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1274, '07:05', 33710), (1274, '10:10', 86120), (1274, '12:45', 73280), (1274, '15:45', 560), (1274, '17:55', 200), (1274, '19:30', 4750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1275, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'FCO'; -- 460 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1275, '07:00', 4940), (1275, '09:05', 236180), (1275, '12:00', 290), (1275, '14:10', 2120), (1275, '16:25', 976220), (1275, '18:20', 2770), (1275, '20:05', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1276, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'ATH'; -- 1541 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1276, '07:35', 4980), (1276, '09:25', 2230), (1276, '11:10', 3550), (1276, '13:45', 1660), (1276, '16:05', 2860), (1276, '17:35', 4180), (1276, '21:00', 1090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1277, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'IST'; -- 1780 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1277, '07:05', 4670), (1277, '11:00', 3780), (1277, '14:35', 434490), (1277, '17:30', 2890), (1277, '20:30', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1278, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'DXB'; -- 4783 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1278, '07:10', 854350), (1278, '09:55', 3650), (1278, '13:20', 4030), (1278, '17:15', 3830), (1278, '19:30', 228870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1279, f.id, t.id, 725 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'BKK'; -- 9240 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1279, '06:45', 4760), (1279, '11:00', 4110), (1279, '12:55', 470), (1279, '16:25', 2940), (1279, '19:35', 192680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1280, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'JFK'; -- 6407 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1280, '07:25', 53990), (1280, '09:15', 810), (1280, '12:40', 3960), (1280, '15:15', 710), (1280, '16:55', 24630), (1280, '20:55', 686100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1281, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'EWR'; -- 6432 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1281, '07:05', 13790), (1281, '09:50', 160), (1281, '11:50', 727440), (1281, '14:00', 1470), (1281, '16:00', 3300), (1281, '18:00', 16480), (1281, '19:50', 4020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1282, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'ORD'; -- 7290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1282, '08:25', 660), (1282, '10:55', 2360), (1282, '14:10', 24730), (1282, '17:35', 1680), (1282, '19:05', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1283, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'MIA'; -- 7874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1283, '07:50', 1100), (1283, '10:00', 3510), (1283, '12:35', 1090), (1283, '14:50', 2380), (1283, '17:10', 3930), (1283, '20:10', 2220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1284, f.id, t.id, 765 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'LAX'; -- 9779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1284, '07:50', 531410), (1284, '10:20', 3520), (1284, '12:50', 3340), (1284, '14:55', 3780), (1284, '17:00', 3980), (1284, '19:40', 1570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1285, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'NCE' AND t.iata = 'YYZ'; -- 6631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1285, '07:05', 1380), (1285, '09:50', 2430), (1285, '13:30', 250), (1285, '17:15', 190), (1285, '20:05', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1286, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BMA'; -- 1132 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1286, '06:40', 700), (1286, '11:25', 3850), (1286, '12:50', 3970), (1286, '16:50', 2810), (1286, '20:25', 675430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1287, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MMX'; -- 668 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1287, '06:50', 3150), (1287, '09:30', 1040), (1287, '13:05', 49220), (1287, '15:25', 1360), (1287, '18:15', 4880), (1287, '20:35', 3700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1288, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'VBY'; -- 1049 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1288, '06:50', 3510), (1288, '10:20', 4480), (1288, '14:05', 3440), (1288, '16:35', 3350), (1288, '20:30', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1289, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'UME'; -- 1561 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1289, '07:40', 576130), (1289, '09:50', 1780), (1289, '12:45', 4310), (1289, '14:20', 44120), (1289, '17:30', 1600), (1289, '20:05', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1290, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'OSD'; -- 1337 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1290, '07:30', 68270), (1290, '10:35', 420), (1290, '12:55', 2220), (1290, '14:40', 2590), (1290, '18:10', 4130), (1290, '19:45', 4940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1291, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'KRN'; -- 1916 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1291, '07:25', 912800), (1291, '10:15', 3520), (1291, '14:05', 355780), (1291, '17:25', 1150), (1291, '20:15', 650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1292, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'OSL'; -- 959 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1292, '07:05', 1830), (1292, '09:30', 4080), (1292, '12:30', 570), (1292, '15:15', 1500), (1292, '17:10', 4080), (1292, '20:55', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1293, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BGO'; -- 888 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1293, '06:55', 61780), (1293, '10:30', 2940), (1293, '11:50', 4110), (1293, '14:30', 200), (1293, '17:45', 920), (1293, '20:00', 94460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1294, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'TRD'; -- 1291 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1294, '06:55', 2780), (1294, '10:20', 1880), (1294, '12:00', 3410), (1294, '14:20', 2170), (1294, '18:20', 2190), (1294, '20:05', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1295, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'CPH'; -- 633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1295, '07:10', 2960), (1295, '09:25', 1400), (1295, '13:00', 34550), (1295, '14:45', 1830), (1295, '17:10', 4720), (1295, '20:25', 1790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1296, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'HEL'; -- 1521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1296, '06:40', 3610), (1296, '09:40', 3190), (1296, '12:25', 2040), (1296, '15:40', 2790), (1296, '17:45', 4730), (1296, '19:35', 1400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1297, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'KEF'; -- 2037 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1297, '06:55', 36620), (1297, '09:35', 3370), (1297, '11:55', 660), (1297, '14:40', 4340), (1297, '17:05', 3320), (1297, '19:40', 2090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1298, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'TLL'; -- 1472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1298, '07:40', 75340), (1298, '09:50', 2420), (1298, '11:00', 2420), (1298, '14:00', 651560), (1298, '16:35', 52080), (1298, '18:10', 3780), (1298, '20:25', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1299, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'RIX'; -- 1333 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1299, '07:25', 4140), (1299, '10:25', 2390), (1299, '13:00', 4980), (1299, '15:25', 2590), (1299, '18:10', 286830), (1299, '19:50', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1300, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'LHR'; -- 369 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1300, '08:05', 4870), (1300, '10:15', 2700), (1300, '13:25', 97060), (1300, '16:05', 3690), (1300, '19:50', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1301, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MAN'; -- 487 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1301, '07:05', 2660), (1301, '09:25', 4570), (1301, '12:50', 4010), (1301, '15:45', 3410), (1301, '17:30', 924250), (1301, '19:40', 3230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1302, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'EDI'; -- 666 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1302, '07:50', 4070), (1302, '11:00', 360), (1302, '14:25', 810), (1302, '16:00', 2790), (1302, '20:20', 2290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1303, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'DUB'; -- 749 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1303, '07:10', 3130), (1303, '09:05', 2190), (1303, '11:00', 3360), (1303, '13:35', 1910), (1303, '16:20', 4340), (1303, '18:00', 4930), (1303, '20:00', 8600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1304, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'CDG'; -- 399 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1304, '06:45', 360), (1304, '09:15', 3640), (1304, '12:05', 1750), (1304, '14:40', 1880), (1304, '17:10', 930), (1304, '20:00', 4900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1305, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'NCE'; -- 979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1305, '07:10', 1190), (1305, '09:45', 499570), (1305, '12:20', 2500), (1305, '15:25', 3740), (1305, '17:45', 4600), (1305, '20:55', 1820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1306, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'FRA'; -- 367 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1306, '07:10', 3760), (1306, '09:05', 3910), (1306, '11:45', 4410), (1306, '14:15', 14630), (1306, '15:40', 1870), (1306, '17:50', 4890), (1306, '19:45', 3750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1307, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MUC'; -- 665 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1307, '07:35', 2960), (1307, '09:35', 3190), (1307, '12:25', 2950), (1307, '15:40', 1130), (1307, '17:50', 1260), (1307, '20:40', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1308, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BER'; -- 593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1308, '06:55', 2520), (1308, '09:20', 4410), (1308, '12:00', 2480), (1308, '14:25', 464390), (1308, '17:25', 3300), (1308, '20:05', 3960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1309, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'ZRH'; -- 604 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1309, '07:05', 2000), (1309, '09:45', 1430), (1309, '12:50', 4440), (1309, '16:40', 2150), (1309, '19:15', 4870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1310, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'VIE'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1310, '07:40', 4480), (1310, '09:55', 3730), (1310, '14:35', 3630), (1310, '16:40', 31820), (1310, '19:05', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1311, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'WAW'; -- 1102 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1311, '07:45', 3980), (1311, '09:10', 2010), (1311, '12:00', 4940), (1311, '14:55', 1920), (1311, '17:20', 3410), (1311, '19:40', 2630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1312, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BCN'; -- 1241 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1312, '07:10', 4090), (1312, '09:50', 1000), (1312, '13:10', 3650), (1312, '16:15', 4450), (1312, '20:00', 4040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1313, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MAD'; -- 1459 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1313, '07:30', 650), (1313, '09:50', 180), (1313, '11:55', 270), (1313, '13:50', 3120), (1313, '16:30', 230), (1313, '17:45', 2890), (1313, '20:50', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1314, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'AGP'; -- 1884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1314, '07:40', 32500), (1314, '08:55', 3740), (1314, '11:50', 1870), (1314, '14:20', 3930), (1314, '16:30', 720), (1314, '18:20', 55270), (1314, '19:45', 808030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1315, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'PMI'; -- 1427 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1315, '06:40', 3020), (1315, '09:40', 2870), (1315, '11:50', 1830), (1315, '15:35', 3680), (1315, '17:30', 624430), (1315, '20:45', 94340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1316, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'LIS'; -- 1847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1316, '08:00', 1370), (1316, '09:10', 2650), (1316, '12:15', 4460), (1316, '15:35', 3110), (1316, '18:10', 85330), (1316, '20:20', 1990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1317, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'FCO'; -- 1297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1317, '08:00', 800), (1317, '10:35', 3130), (1317, '12:30', 580), (1317, '15:25', 2820), (1317, '17:55', 51630), (1317, '20:55', 19130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1318, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MXP'; -- 797 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1318, '06:50', 1890), (1318, '11:20', 1730), (1318, '12:50', 2030), (1318, '17:35', 2850), (1318, '20:45', 660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1319, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'ATH'; -- 2181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1319, '06:55', 1500), (1319, '10:20', 2550), (1319, '12:05', 54720), (1319, '15:30', 4730), (1319, '17:00', 197410), (1319, '19:40', 321650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1320, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'IST'; -- 2184 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1320, '07:30', 1290), (1320, '10:20', 2860), (1320, '12:20', 3340), (1320, '14:25', 1160), (1320, '17:50', 3530), (1320, '19:45', 3540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1321, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'DXB'; -- 5169 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1321, '06:50', 3810), (1321, '09:20', 1520), (1321, '13:05', 610), (1321, '15:00', 1860), (1321, '17:05', 2580), (1321, '20:55', 2490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1322, f.id, t.id, 720 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'BKK'; -- 9207 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1322, '07:25', 488150), (1322, '11:20', 3790), (1322, '13:35', 650), (1322, '16:45', 4090), (1322, '19:10', 2070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1323, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'JFK'; -- 5847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1323, '07:05', 420), (1323, '09:10', 3190), (1323, '11:35', 1960), (1323, '13:35', 4180), (1323, '15:50', 4280), (1323, '18:45', 80250), (1323, '20:05', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1324, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'EWR'; -- 5868 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1324, '07:05', 4560), (1324, '09:50', 4320), (1324, '12:10', 2000), (1324, '15:35', 3010), (1324, '18:00', 1920), (1324, '20:45', 65670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1325, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'ORD'; -- 6611 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1325, '07:30', 3090), (1325, '09:40', 4160), (1325, '13:00', 1140), (1325, '14:45', 4070), (1325, '17:30', 1780), (1325, '19:40', 441070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1326, f.id, t.id, 590 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'MIA'; -- 7443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1326, '07:05', 4280), (1326, '10:20', 2120), (1326, '12:45', 320), (1326, '15:05', 3000), (1326, '16:55', 1900), (1326, '19:30', 3300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1327, f.id, t.id, 700 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'LAX'; -- 8956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1327, '07:30', 70130), (1327, '09:35', 4600), (1327, '11:45', 2170), (1327, '13:55', 2930), (1327, '16:15', 530), (1327, '18:25', 3330), (1327, '20:45', 610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1328, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'AMS' AND t.iata = 'YYZ'; -- 5989 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1328, '06:40', 2300), (1328, '09:45', 2250), (1328, '13:05', 2710), (1328, '14:35', 71910), (1328, '18:15', 620), (1328, '19:55', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1329, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'ARN'; -- 1288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1329, '07:10', 28390), (1329, '10:05', 370), (1329, '12:35', 300830), (1329, '15:35', 4800), (1329, '18:20', 4270), (1329, '20:55', 843750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1330, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'BMA'; -- 1266 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1330, '07:35', 3080), (1330, '10:20', 4880), (1330, '13:30', 2320), (1330, '16:30', 3350), (1330, '20:35', 775080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1331, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'GOT'; -- 906 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1331, '06:55', 4750), (1331, '09:45', 4670), (1331, '12:50', 3220), (1331, '14:30', 800), (1331, '17:00', 752180), (1331, '20:55', 2640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1332, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MMX'; -- 784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1332, '06:50', 138740), (1332, '10:15', 1150), (1332, '12:55', 1610), (1332, '15:15', 3060), (1332, '17:00', 34330), (1332, '20:40', 540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1333, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'LLA'; -- 1913 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1333, '07:50', 3650), (1333, '10:35', 3100), (1333, '11:55', 4400), (1333, '15:15', 3660), (1333, '17:20', 3930), (1333, '19:30', 246540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1334, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'VBY'; -- 1169 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1334, '07:25', 3660), (1334, '09:50', 3900), (1334, '11:25', 3620), (1334, '14:00', 889730), (1334, '16:00', 99480), (1334, '18:15', 4330), (1334, '20:55', 3390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1335, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'UME'; -- 1708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1335, '06:45', 3620), (1335, '09:15', 690), (1335, '11:00', 1160), (1335, '13:30', 680), (1335, '15:35', 1230), (1335, '18:05', 1250), (1335, '21:00', 1830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1336, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'OSD'; -- 1491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1336, '07:35', 4550), (1336, '09:45', 960), (1336, '13:55', 4850), (1336, '16:35', 885040), (1336, '20:05', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1337, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'KRN'; -- 2071 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1337, '07:45', 1110), (1337, '09:55', 590), (1337, '13:25', 868160), (1337, '17:10', 4790), (1337, '20:20', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1338, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'OSL'; -- 1112 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1338, '07:20', 951220), (1338, '09:30', 93800), (1338, '11:10', 180), (1338, '14:00', 290), (1338, '16:20', 170), (1338, '18:45', 500), (1338, '20:50', 4530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1339, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'BGO'; -- 1045 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1339, '06:50', 1500), (1339, '10:30', 1960), (1339, '12:00', 2160), (1339, '15:45', 2450), (1339, '17:15', 2400), (1339, '20:35', 81220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1340, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'TRD'; -- 1448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1340, '07:00', 66080), (1340, '09:55', 2100), (1340, '11:35', 2360), (1340, '13:45', 4760), (1340, '16:25', 3410), (1340, '18:25', 3910), (1340, '19:50', 2110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1341, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'CPH'; -- 755 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1341, '06:55', 4910), (1341, '09:50', 68970), (1341, '10:55', 388300), (1341, '13:10', 2130), (1341, '15:40', 390), (1341, '18:40', 4270), (1341, '20:35', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1342, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'AAL'; -- 772 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1342, '07:10', 690), (1342, '10:00', 51140), (1342, '11:50', 2910), (1342, '15:35', 940), (1342, '17:45', 871820), (1342, '19:35', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1343, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'HEL'; -- 1647 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1343, '07:20', 1290), (1343, '09:10', 4250), (1343, '11:50', 1340), (1343, '13:10', 2820), (1343, '16:20', 2670), (1343, '17:45', 6120), (1343, '20:20', 3570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1344, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'KEF'; -- 2148 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1344, '07:45', 1390), (1344, '10:55', 3930), (1344, '13:55', 48160), (1344, '16:10', 530), (1344, '19:20', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1345, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'TLL'; -- 1592 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1345, '07:25', 1950), (1345, '09:35', 1380), (1345, '12:35', 2550), (1345, '15:10', 2230), (1345, '18:00', 4480), (1345, '20:45', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1346, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'RIX'; -- 1434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1346, '07:55', 2830), (1346, '10:20', 261150), (1346, '13:20', 3510), (1346, '17:45', 2170), (1346, '19:55', 560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1347, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'LHR'; -- 349 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1347, '07:10', 1820), (1347, '09:30', 612380), (1347, '12:00', 54230), (1347, '13:55', 3000), (1347, '16:00', 1680), (1347, '18:25', 53110), (1347, '20:40', 44280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1348, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MAN'; -- 536 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1348, '07:40', 2060), (1348, '08:50', 1240), (1348, '12:10', 240), (1348, '13:35', 1620), (1348, '15:20', 4380), (1348, '18:40', 750), (1348, '19:45', 4790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1349, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'EDI'; -- 764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1349, '07:10', 4640), (1349, '09:10', 810), (1349, '10:55', 1890), (1349, '13:40', 590), (1349, '16:15', 170), (1349, '18:20', 1780), (1349, '20:10', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1350, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'DUB'; -- 783 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1350, '07:00', 2240), (1350, '09:55', 4940), (1350, '11:25', 2600), (1350, '13:25', 18690), (1350, '15:30', 810), (1350, '18:00', 2790), (1350, '19:55', 380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1351, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'CDG'; -- 251 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1351, '07:00', 4050), (1351, '09:40', 758030), (1351, '12:35', 4650), (1351, '15:35', 282960), (1351, '17:45', 670), (1351, '19:35', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1352, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'NCE'; -- 831 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1352, '06:35', 217020), (1352, '09:40', 1650), (1352, '11:10', 53140), (1352, '13:45', 88400), (1352, '16:15', 4410), (1352, '18:50', 4540), (1352, '20:45', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1353, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'FRA'; -- 305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1353, '07:05', 390), (1353, '10:00', 1800), (1353, '12:55', 840), (1353, '17:30', 4870), (1353, '20:30', 857880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1354, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'BER'; -- 643 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1354, '07:00', 3270), (1354, '11:30', 4990), (1354, '12:55', 2580), (1354, '16:45', 4140), (1354, '20:15', 3490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1355, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'VIE'; -- 925 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1355, '06:45', 915620), (1355, '09:40', 1640), (1355, '10:55', 1570), (1355, '13:15', 4470), (1355, '15:20', 4030), (1355, '17:45', 1550), (1355, '20:40', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1356, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'PRG'; -- 697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1356, '08:00', 3860), (1356, '09:30', 3400), (1356, '12:05', 31350), (1356, '14:55', 542100), (1356, '17:35', 2100), (1356, '20:05', 670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1357, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'WAW'; -- 1147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1357, '07:35', 870), (1357, '09:15', 65910), (1357, '12:00', 1110), (1357, '15:05', 1020), (1357, '17:50', 190), (1357, '19:55', 4540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1358, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'BCN'; -- 1083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1358, '07:25', 2110), (1358, '09:25', 9430), (1358, '11:45', 3490), (1358, '15:00', 510), (1358, '17:45', 2200), (1358, '20:45', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1359, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MAD'; -- 1314 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1359, '07:50', 1820), (1359, '10:10', 1490), (1359, '13:10', 850), (1359, '14:50', 3230), (1359, '18:05', 750), (1359, '20:25', 630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1360, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'AGP'; -- 1736 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1360, '07:50', 1360), (1360, '09:50', 1040), (1360, '13:35', 59140), (1360, '17:05', 3750), (1360, '19:20', 3420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1361, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'PMI'; -- 1269 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1361, '06:40', 4440), (1361, '09:50', 1870), (1361, '11:50', 66950), (1361, '14:55', 260), (1361, '17:30', 5000), (1361, '19:35', 3440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1362, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'LPA'; -- 3051 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1362, '07:05', 49590), (1362, '09:25', 2530), (1362, '12:05', 1510), (1362, '15:10', 4040), (1362, '17:00', 600), (1362, '19:35', 70750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1363, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'LIS'; -- 1718 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1363, '07:10', 4610), (1363, '09:10', 370), (1363, '12:05', 2590), (1363, '13:55', 4660), (1363, '15:40', 430), (1363, '18:25', 4800), (1363, '20:35', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1364, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'FCO'; -- 1173 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1364, '07:10', 2430), (1364, '09:55', 1510), (1364, '14:40', 3520), (1364, '17:15', 2030), (1364, '19:45', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1365, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MXP'; -- 664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1365, '07:40', 4460), (1365, '10:00', 890), (1365, '13:05', 2230), (1365, '17:00', 81420), (1365, '19:35', 2010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1366, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'ATH'; -- 2101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1366, '07:10', 30810), (1366, '10:50', 4990), (1366, '13:05', 3260), (1366, '16:15', 4530), (1366, '20:50', 3780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1367, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'IST'; -- 2142 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1367, '08:00', 4700), (1367, '09:15', 4370), (1367, '12:40', 1180), (1367, '15:10', 30360), (1367, '17:05', 3220), (1367, '20:50', 3540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1368, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'DXB'; -- 5148 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1368, '07:55', 1140), (1368, '09:55', 3670), (1368, '12:00', 1470), (1368, '15:30', 4710), (1368, '17:20', 2370), (1368, '20:30', 3510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1369, f.id, t.id, 725 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'BKK'; -- 9262 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1369, '07:25', 77220), (1369, '09:55', 430), (1369, '11:55', 380), (1369, '13:10', 3090), (1369, '16:10', 1020), (1369, '18:30', 700), (1369, '20:10', 200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1370, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'JFK'; -- 5885 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1370, '06:45', 2890), (1370, '10:05', 17630), (1370, '11:50', 220), (1370, '14:25', 610), (1370, '17:55', 250), (1370, '19:35', 27330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1371, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'EWR'; -- 5907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1371, '07:30', 65610), (1371, '09:15', 2040), (1371, '12:35', 4590), (1371, '15:25', 440), (1371, '17:45', 4930), (1371, '19:30', 801570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1372, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'ORD'; -- 6675 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1372, '07:00', 1920), (1372, '08:40', 2070), (1372, '11:25', 2050), (1372, '13:30', 2220), (1372, '16:10', 2130), (1372, '18:45', 3830), (1372, '19:50', 34720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1373, f.id, t.id, 590 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'MIA'; -- 7459 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1373, '06:45', 3590), (1373, '09:25', 4180), (1373, '11:20', 2700), (1373, '14:05', 730), (1373, '16:30', 970), (1373, '18:35', 510), (1373, '19:50', 3090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1374, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'LAX'; -- 9054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1374, '07:45', 1570), (1374, '09:40', 2080), (1374, '13:05', 720), (1374, '14:35', 3740), (1374, '16:55', 3410), (1374, '20:15', 190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1375, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'BRU' AND t.iata = 'YYZ'; -- 6044 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1375, '07:05', 1840), (1375, '09:45', 1350), (1375, '12:25', 3820), (1375, '15:10', 3570), (1375, '17:00', 320), (1375, '20:20', 3930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1376, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BMA'; -- 1196 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1376, '06:55', 1500), (1376, '10:15', 4220), (1376, '12:00', 3930), (1376, '15:05', 2730), (1376, '17:00', 1070), (1376, '19:35', 28250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1377, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'GOT'; -- 884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1377, '07:35', 680), (1377, '09:35', 4930), (1377, '11:05', 63540), (1377, '14:15', 290), (1377, '15:20', 3710), (1377, '18:45', 2840), (1377, '21:00', 2020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1378, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MMX'; -- 692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1378, '07:50', 1910), (1378, '09:10', 990), (1378, '12:45', 48850), (1378, '15:05', 3200), (1378, '17:50', 2680), (1378, '20:55', 3720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1379, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'LLA'; -- 1893 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1379, '07:00', 4530), (1379, '09:40', 572290), (1379, '11:15', 3450), (1379, '13:40', 133990), (1379, '16:20', 391740), (1379, '17:35', 670), (1379, '20:25', 3700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1380, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'VBY'; -- 1061 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1380, '08:15', 3700), (1380, '10:30', 21930), (1380, '13:40', 4010), (1380, '17:25', 4510), (1380, '19:30', 2310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1381, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'UME'; -- 1681 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1381, '06:30', 28940), (1381, '09:05', 3620), (1381, '11:15', 3580), (1381, '13:20', 1630), (1381, '16:10', 2250), (1381, '18:35', 629480), (1381, '20:45', 3170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1382, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'OSD'; -- 1506 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1382, '07:00', 84110), (1382, '08:50', 3950), (1382, '11:10', 3580), (1382, '14:10', 4110), (1382, '15:45', 2140), (1382, '18:50', 4220), (1382, '20:00', 884580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1383, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'OSL'; -- 1141 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1383, '07:05', 31070), (1383, '10:15', 4700), (1383, '13:05', 4580), (1383, '15:10', 930), (1383, '18:15', 2200), (1383, '20:30', 4330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1384, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BGO'; -- 1160 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1384, '07:25', 2660), (1384, '09:30', 694230), (1384, '11:15', 1120), (1384, '13:50', 3540), (1384, '16:20', 4400), (1384, '17:45', 3580), (1384, '19:45', 2360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1385, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'TRD'; -- 1500 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1385, '07:10', 2430), (1385, '09:50', 658880), (1385, '11:50', 2210), (1385, '15:40', 4480), (1385, '16:55', 440), (1385, '19:40', 3100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1386, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'CPH'; -- 679 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1386, '07:15', 1570), (1386, '10:10', 2410), (1386, '12:40', 3520), (1386, '15:35', 2390), (1386, '18:00', 3140), (1386, '19:50', 1780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1387, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'AAL'; -- 790 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1387, '07:45', 710), (1387, '08:40', 4660), (1387, '10:55', 4410), (1387, '13:10', 1140), (1387, '16:00', 580), (1387, '18:40', 4240), (1387, '21:00', 4260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1388, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'HEL'; -- 1538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1388, '07:15', 3380), (1388, '08:55', 63430), (1388, '12:05', 3440), (1388, '13:30', 50470), (1388, '16:05', 4180), (1388, '18:40', 3420), (1388, '20:45', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1389, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'KEF'; -- 2401 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1389, '06:40', 2570), (1389, '09:45', 4350), (1389, '12:10', 4310), (1389, '13:55', 4490), (1389, '16:00', 1360), (1389, '17:50', 680), (1389, '20:05', 3230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1390, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'TLL'; -- 1468 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1390, '07:45', 4910), (1390, '10:10', 2150), (1390, '13:05', 830), (1390, '16:15', 612660), (1390, '19:15', 531680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1391, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'RIX'; -- 1270 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1391, '07:05', 4990), (1391, '10:15', 4370), (1391, '11:55', 549710), (1391, '14:30', 1100), (1391, '17:05', 502270), (1391, '20:50', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1392, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'LHR'; -- 654 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1392, '07:20', 4180), (1392, '09:20', 4370), (1392, '12:55', 1440), (1392, '15:10', 554390), (1392, '17:35', 2850), (1392, '20:55', 680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1393, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MAN'; -- 833 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1393, '07:05', 666930), (1393, '10:35', 500), (1393, '13:10', 1710), (1393, '14:40', 1640), (1393, '17:50', 4980), (1393, '19:50', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1394, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'DUB'; -- 1086 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1394, '07:10', 1910), (1394, '09:55', 2850), (1394, '13:50', 354980), (1394, '16:10', 1940), (1394, '20:30', 269760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1395, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'CDG'; -- 449 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1395, '08:00', 2740), (1395, '09:45', 3090), (1395, '12:15', 3450), (1395, '15:25', 1770), (1395, '17:30', 2620), (1395, '20:45', 92690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1396, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'NCE'; -- 716 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1396, '06:50', 88610), (1396, '10:55', 610), (1396, '14:15', 3780), (1396, '17:35', 485560), (1396, '20:15', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1397, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'AMS'; -- 367 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1397, '07:45', 2410), (1397, '10:05', 509460), (1397, '14:20', 13620), (1397, '16:00', 3920), (1397, '19:20', 1980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1398, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BRU'; -- 305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1398, '06:45', 290), (1398, '10:35', 1930), (1398, '14:10', 3240), (1398, '16:35', 670), (1398, '20:30', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1399, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MUC'; -- 299 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1399, '06:50', 4400), (1399, '09:55', 900), (1399, '13:25', 4740), (1399, '17:30', 460), (1399, '19:35', 3120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1400, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BER'; -- 431 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1400, '07:10', 517740), (1400, '09:50', 9060), (1400, '11:10', 2160), (1400, '13:15', 34100), (1400, '15:25', 204160), (1400, '17:35', 4130), (1400, '20:15', 1080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1401, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'ZRH'; -- 286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1401, '07:10', 1870), (1401, '10:30', 400), (1401, '12:50', 4630), (1401, '14:40', 4210), (1401, '18:00', 1490), (1401, '19:35', 374830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1402, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'VIE'; -- 620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1402, '07:15', 4530), (1402, '09:50', 1810), (1402, '13:45', 26750), (1402, '16:35', 3770), (1402, '20:15', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1403, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'PRG'; -- 406 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1403, '07:40', 59100), (1403, '09:45', 250), (1403, '12:10', 4320), (1403, '15:40', 1880), (1403, '17:55', 530), (1403, '19:35', 170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1404, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'WAW'; -- 897 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1404, '07:05', 2550), (1404, '09:20', 3440), (1404, '10:55', 590), (1404, '14:20', 3580), (1404, '15:20', 740), (1404, '18:45', 2780), (1404, '20:40', 2980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1405, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BCN'; -- 1093 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1405, '06:45', 5000), (1405, '09:40', 3360), (1405, '13:00', 3980), (1405, '15:10', 2860), (1405, '17:55', 445080), (1405, '20:35', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1406, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MAD'; -- 1421 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1406, '06:55', 2840), (1406, '11:20', 1140), (1406, '13:00', 4020), (1406, '16:25', 1780), (1406, '20:15', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1407, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'AGP'; -- 1817 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1407, '07:50', 530), (1407, '10:05', 2210), (1407, '12:55', 647250), (1407, '15:05', 570), (1407, '17:55', 92800), (1407, '19:35', 2900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1408, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'PMI'; -- 1252 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1408, '07:10', 4230), (1408, '09:30', 2620), (1408, '12:50', 877350), (1408, '15:00', 2890), (1408, '18:20', 90100), (1408, '20:55', 1100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1409, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'LPA'; -- 3185 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1409, '07:15', 3340), (1409, '10:30', 2740), (1409, '13:00', 530), (1409, '17:40', 4230), (1409, '19:10', 4360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1410, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'FCO'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1410, '07:45', 2960), (1410, '09:55', 1840), (1410, '12:05', 760), (1410, '13:20', 2350), (1410, '15:25', 3690), (1410, '18:25', 3820), (1410, '20:35', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1411, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MXP'; -- 489 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1411, '06:45', 185710), (1411, '09:25', 28270), (1411, '10:55', 3820), (1411, '14:15', 3010), (1411, '15:25', 2460), (1411, '18:45', 2010), (1411, '19:45', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1412, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'ATH'; -- 1815 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1412, '07:25', 2780), (1412, '10:10', 4850), (1412, '14:25', 840), (1412, '16:00', 160), (1412, '19:50', 4290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1413, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'IST'; -- 1838 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1413, '07:00', 4300), (1413, '09:40', 880), (1413, '11:25', 3240), (1413, '13:15', 4100), (1413, '16:35', 4690), (1413, '18:05', 293180), (1413, '19:50', 320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1414, f.id, t.id, 395 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'DXB'; -- 4843 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1414, '06:50', 3010), (1414, '11:00', 580), (1414, '13:35', 92140), (1414, '16:15', 2940), (1414, '19:10', 277930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1415, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'BKK'; -- 8999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1415, '07:15', 3580), (1415, '09:45', 4850), (1415, '12:15', 52220), (1415, '14:35', 1730), (1415, '17:50', 1760), (1415, '20:10', 3920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1416, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'JFK'; -- 6190 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1416, '08:00', 290), (1416, '11:20', 24680), (1416, '13:00', 1950), (1416, '16:55', 284480), (1416, '19:50', 4490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1417, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'EWR'; -- 6211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1417, '06:40', 1440), (1417, '09:05', 3300), (1417, '11:55', 280670), (1417, '14:10', 2780), (1417, '15:25', 2470), (1417, '18:00', 2950), (1417, '20:30', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1418, f.id, t.id, 555 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'ORD'; -- 6971 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1418, '07:40', 592210), (1418, '09:35', 1620), (1418, '11:25', 29640), (1418, '13:40', 3980), (1418, '15:35', 89130), (1418, '18:20', 1030), (1418, '19:55', 859420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1419, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'MIA'; -- 7764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1419, '07:05', 390), (1419, '09:50', 4550), (1419, '12:15', 1700), (1419, '15:45', 2710), (1419, '17:50', 91550), (1419, '20:10', 1520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1420, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'LAX'; -- 9323 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1420, '06:45', 3700), (1420, '11:25', 3290), (1420, '14:15', 820), (1420, '16:05', 790090), (1420, '19:10', 440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1421, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'FRA' AND t.iata = 'YYZ'; -- 6344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1421, '07:50', 300), (1421, '11:05', 333680), (1421, '13:10', 3560), (1421, '17:45', 3960), (1421, '19:10', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1422, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BMA'; -- 1287 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1422, '07:50', 720680), (1422, '10:50', 3600), (1422, '14:20', 600), (1422, '17:40', 1290), (1422, '20:40', 3880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1423, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'GOT'; -- 1037 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1423, '07:10', 2150), (1423, '08:45', 3260), (1423, '11:25', 2260), (1423, '13:25', 2720), (1423, '15:50', 4100), (1423, '18:00', 4060), (1423, '21:00', 2470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1424, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'MMX'; -- 807 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1424, '07:50', 2680), (1424, '11:30', 1850), (1424, '13:10', 3040), (1424, '16:30', 860), (1424, '20:45', 1170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1425, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'LLA'; -- 2005 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1425, '07:20', 3990), (1425, '09:45', 1730), (1425, '11:45', 1160), (1425, '14:25', 390), (1425, '18:20', 4440), (1425, '20:45', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1426, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'VBY'; -- 1123 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1426, '07:05', 780), (1426, '09:10', 2600), (1426, '12:05', 89280), (1426, '13:35', 77130), (1426, '16:15', 2630), (1426, '17:50', 1610), (1426, '20:05', 4260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1427, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'UME'; -- 1792 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1427, '08:10', 4790), (1427, '10:30', 4690), (1427, '14:15', 2360), (1427, '17:40', 3840), (1427, '19:25', 85290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1428, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'OSD'; -- 1658 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1428, '06:55', 3980), (1428, '10:00', 270), (1428, '11:45', 4960), (1428, '14:25', 4520), (1428, '17:30', 60370), (1428, '19:35', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1429, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'KRN'; -- 2218 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1429, '08:25', 22760), (1429, '11:30', 1650), (1429, '12:50', 4450), (1429, '17:40', 1030), (1429, '19:40', 900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1430, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'OSL'; -- 1317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1430, '07:45', 3340), (1430, '09:55', 4830), (1430, '12:40', 2250), (1430, '15:20', 4070), (1430, '17:40', 327200), (1430, '19:30', 610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1431, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'CPH'; -- 811 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1431, '07:35', 2760), (1431, '09:30', 3090), (1431, '13:00', 2890), (1431, '15:20', 2110), (1431, '16:55', 313400), (1431, '19:55', 48690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1432, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'AAL'; -- 980 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1432, '07:00', 780), (1432, '10:35', 2560), (1432, '12:55', 1890), (1432, '17:40', 1890), (1432, '20:05', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1433, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'HEL'; -- 1575 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1433, '06:35', 4030), (1433, '09:25', 4000), (1433, '10:55', 508130), (1433, '13:55', 1900), (1433, '15:25', 790), (1433, '18:25', 510), (1433, '20:10', 2790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1434, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'KEF'; -- 2692 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1434, '06:45', 520), (1434, '08:55', 1510), (1434, '12:10', 4260), (1434, '13:45', 2620), (1434, '16:15', 850), (1434, '17:45', 4340), (1434, '20:45', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1435, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'TLL'; -- 1492 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1435, '07:55', 4630), (1435, '10:10', 4760), (1435, '12:05', 4900), (1435, '15:15', 3030), (1435, '17:30', 1870), (1435, '20:50', 4990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1436, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'RIX'; -- 1255 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1436, '08:00', 4280), (1436, '10:15', 4390), (1436, '13:40', 2830), (1436, '16:00', 250), (1436, '19:25', 29450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1437, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'LHR'; -- 941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1437, '06:35', 4590), (1437, '08:45', 1320), (1437, '10:55', 31760), (1437, '13:20', 4150), (1437, '15:30', 2090), (1437, '18:35', 181280), (1437, '21:00', 4780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1438, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'MAN'; -- 1131 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1438, '06:35', 4900), (1438, '10:30', 1210), (1438, '12:15', 4560), (1438, '15:35', 3890), (1438, '17:50', 3700), (1438, '20:00', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1439, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'EDI'; -- 1331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1439, '07:40', 3070), (1439, '10:25', 3750), (1439, '13:10', 810), (1439, '14:20', 1470), (1439, '17:50', 3750), (1439, '20:20', 4680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1440, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'DUB'; -- 1381 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1440, '07:35', 4580), (1440, '09:45', 860), (1440, '12:05', 520), (1440, '14:20', 2370), (1440, '15:35', 450), (1440, '18:30', 3620), (1440, '20:15', 3280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1441, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'CDG'; -- 682 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1441, '07:20', 1760), (1441, '11:10', 3410), (1441, '13:40', 3950), (1441, '17:45', 4160), (1441, '20:05', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1442, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'AMS'; -- 665 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1442, '07:00', 91810), (1442, '09:10', 3870), (1442, '11:25', 60230), (1442, '13:40', 3730), (1442, '16:35', 62290), (1442, '17:40', 3210), (1442, '19:45', 2580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1443, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'FRA'; -- 299 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1443, '08:00', 88220), (1443, '10:05', 2000), (1443, '11:45', 340), (1443, '15:15', 2700), (1443, '17:55', 960), (1443, '19:50', 4600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1444, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BER'; -- 463 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1444, '08:25', 4020), (1444, '10:00', 160), (1444, '13:50', 2370), (1444, '17:10', 4400), (1444, '19:05', 4880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1445, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'WAW'; -- 778 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1445, '07:15', 3620), (1445, '09:05', 4490), (1445, '11:50', 2510), (1445, '13:55', 4830), (1445, '16:30', 3890), (1445, '17:50', 3130), (1445, '20:20', 1570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1446, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BCN'; -- 1094 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1446, '07:45', 1220), (1446, '10:15', 2040), (1446, '12:00', 780), (1446, '15:45', 4990), (1446, '18:15', 4070), (1446, '20:45', 4750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1447, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'MAD'; -- 1496 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1447, '07:15', 4850), (1447, '09:35', 1620), (1447, '11:00', 1910), (1447, '14:05', 1760), (1447, '15:35', 53050), (1447, '17:35', 2080), (1447, '20:40', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1448, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'AGP'; -- 1855 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1448, '07:55', 3600), (1448, '10:20', 1290), (1448, '12:05', 2830), (1448, '15:25', 4620), (1448, '17:55', 4500), (1448, '20:20', 800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1449, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'PMI'; -- 1216 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1449, '08:25', 951240), (1449, '11:25', 163250), (1449, '14:10', 3220), (1449, '17:30', 1560), (1449, '19:05', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1450, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'LPA'; -- 3255 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1450, '07:40', 4890), (1450, '11:10', 1920), (1450, '13:45', 90060), (1450, '16:50', 900), (1450, '19:40', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1451, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'LIS'; -- 1984 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1451, '07:25', 4680), (1451, '09:15', 910), (1451, '11:10', 47810), (1451, '13:55', 419750), (1451, '16:15', 80170), (1451, '18:30', 8920), (1451, '21:00', 138250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1452, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'FCO'; -- 729 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1452, '07:25', 4180), (1452, '11:10', 450), (1452, '13:15', 51830), (1452, '16:10', 2060), (1452, '19:25', 2460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1453, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'ATH'; -- 1517 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1453, '07:15', 2510), (1453, '09:20', 56710), (1453, '11:55', 2360), (1453, '15:20', 1760), (1453, '18:10', 1570), (1453, '19:55', 2420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1454, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'IST'; -- 1547 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1454, '06:35', 4520), (1454, '10:00', 3510), (1454, '13:00', 47800), (1454, '15:45', 2870), (1454, '17:40', 2780), (1454, '20:40', 2110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1455, f.id, t.id, 370 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'DXB'; -- 4564 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1455, '06:40', 4510), (1455, '10:25', 3480), (1455, '14:40', 2870), (1455, '16:10', 560), (1455, '20:20', 2380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1456, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'BKK'; -- 8799 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1456, '07:05', 660), (1456, '10:30', 3360), (1456, '13:30', 4670), (1456, '17:10', 50640), (1456, '20:45', 750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1457, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'JFK'; -- 6482 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1457, '07:05', 576710), (1457, '11:05', 81320), (1457, '13:15', 1330), (1457, '16:15', 1260), (1457, '20:45', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1458, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'EWR'; -- 6504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1458, '08:00', 3960), (1458, '10:05', 640), (1458, '14:30', 3570), (1458, '17:25', 3350), (1458, '19:35', 3560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1459, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'ORD'; -- 7270 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1459, '06:50', 2250), (1459, '10:20', 2540), (1459, '12:25', 4160), (1459, '15:30', 2590), (1459, '17:05', 420), (1459, '20:20', 770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1460, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'MIA'; -- 8044 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1460, '07:20', 939350), (1460, '09:15', 3090), (1460, '11:50', 930), (1460, '15:40', 812760), (1460, '17:30', 4520), (1460, '20:10', 13640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1461, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'LAX'; -- 9617 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1461, '07:05', 1900), (1461, '10:25', 4040), (1461, '11:45', 639100), (1461, '15:00', 540), (1461, '17:10', 208610), (1461, '19:55', 88800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1462, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'MUC' AND t.iata = 'YYZ'; -- 6641 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1462, '07:00', 4930), (1462, '09:50', 1720), (1462, '11:40', 2610), (1462, '14:20', 767850), (1462, '15:50', 780), (1462, '17:45', 650), (1462, '21:00', 1100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1463, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'ARN'; -- 854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1463, '06:40', 368420), (1463, '10:40', 670), (1463, '13:30', 330), (1463, '17:40', 2180), (1463, '20:15', 4170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1464, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'BMA'; -- 824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1464, '06:40', 710), (1464, '09:45', 850), (1464, '12:00', 46650), (1464, '14:05', 2520), (1464, '15:35', 2250), (1464, '18:20', 810), (1464, '19:45', 2890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1465, f.id, t.id, 55 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MMX'; -- 353 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1465, '07:00', 2780), (1465, '09:05', 690), (1465, '11:15', 3010), (1465, '13:25', 2860), (1465, '16:35', 4940), (1465, '18:15', 2550), (1465, '19:50', 763210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1466, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'LLA'; -- 1542 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1466, '06:35', 254120), (1466, '09:45', 4250), (1466, '11:35', 990), (1466, '13:50', 4240), (1466, '15:35', 3470), (1466, '17:50', 253340), (1466, '19:45', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1467, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'VBY'; -- 664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1467, '08:00', 2810), (1467, '10:10', 3200), (1467, '14:40', 6720), (1467, '17:15', 3490), (1467, '20:30', 3750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1468, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'UME'; -- 1329 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1468, '07:45', 151640), (1468, '10:05', 3920), (1468, '12:10', 34340), (1468, '15:25', 2200), (1468, '17:35', 410), (1468, '19:45', 410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1469, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'OSD'; -- 1205 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1469, '06:45', 2920), (1469, '08:55', 760), (1469, '12:05', 3700), (1469, '14:20', 3000), (1469, '16:20', 28580), (1469, '18:50', 3320), (1469, '20:50', 1910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1470, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'KRN'; -- 1757 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1470, '07:25', 1080), (1470, '09:55', 2550), (1470, '11:50', 280840), (1470, '13:35', 1800), (1470, '15:25', 191680), (1470, '18:05', 93320), (1470, '21:00', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1471, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'OSL'; -- 882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1471, '06:50', 960), (1471, '09:50', 4170), (1471, '13:00', 40990), (1471, '15:25', 39710), (1471, '17:55', 4690), (1471, '20:10', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1472, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'BGO'; -- 1016 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1472, '07:35', 4760), (1472, '09:45', 427980), (1472, '11:45', 170), (1472, '15:35', 1140), (1472, '17:30', 2100), (1472, '20:40', 32390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1473, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'TRD'; -- 1242 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1473, '07:10', 19650), (1473, '10:35', 1890), (1473, '12:15', 2000), (1473, '14:40', 2650), (1473, '17:15', 760), (1473, '20:15', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1474, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'AAL'; -- 575 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1474, '07:55', 1580), (1474, '11:00', 2400), (1474, '13:50', 3290), (1474, '16:00', 3800), (1474, '19:30', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1475, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'KEF'; -- 2431 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1475, '08:25', 2070), (1475, '10:00', 4460), (1475, '14:10', 4980), (1475, '17:35', 3300), (1475, '20:50', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1476, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'TLL'; -- 1052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1476, '07:45', 2900), (1476, '09:05', 4080), (1476, '11:15', 41340), (1476, '13:40', 4280), (1476, '16:10', 21630), (1476, '18:05', 500), (1476, '20:15', 1580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1477, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'RIX'; -- 841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1477, '07:15', 3660), (1477, '09:40', 1330), (1477, '12:15', 760), (1477, '14:20', 400), (1477, '18:05', 2560), (1477, '19:50', 898470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1478, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'LHR'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1478, '07:45', 2620), (1478, '10:20', 4960), (1478, '12:35', 1750), (1478, '14:20', 841910), (1478, '17:10', 1240), (1478, '20:00', 2840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1479, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MAN'; -- 1063 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1479, '07:25', 4980), (1479, '09:50', 1430), (1479, '13:35', 1040), (1479, '16:25', 2490), (1479, '19:55', 4140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1480, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'EDI'; -- 1165 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1480, '07:55', 2680), (1480, '09:35', 1490), (1480, '12:15', 3410), (1480, '15:35', 3970), (1480, '17:30', 4150), (1480, '19:45', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1481, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'DUB'; -- 1326 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1481, '07:35', 490), (1481, '10:20', 1140), (1481, '13:55', 873980), (1481, '17:00', 2480), (1481, '20:00', 2380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1482, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'NCE'; -- 1074 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1482, '07:55', 590), (1482, '10:00', 1910), (1482, '13:30', 23160), (1482, '16:05', 1140), (1482, '20:20', 1790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1483, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'AMS'; -- 593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1483, '06:45', 2560), (1483, '10:25', 2670), (1483, '13:50', 330), (1483, '17:30', 107730), (1483, '20:25', 1840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1484, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'BRU'; -- 643 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1484, '07:30', 340), (1484, '10:30', 3110), (1484, '12:30', 473980), (1484, '14:55', 2560), (1484, '17:10', 4010), (1484, '19:55', 1290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1485, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'FRA'; -- 431 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1485, '06:50', 1200), (1485, '08:55', 3960), (1485, '12:10', 4280), (1485, '13:45', 1540), (1485, '15:20', 4160), (1485, '18:35', 1830), (1485, '20:00', 95390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1486, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MUC'; -- 463 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1486, '07:35', 460050), (1486, '09:50', 1740), (1486, '14:35', 1860), (1486, '16:15', 2280), (1486, '19:50', 240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1487, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'ZRH'; -- 651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1487, '07:30', 3810), (1487, '10:25', 3650), (1487, '11:45', 1250), (1487, '15:45', 4600), (1487, '18:05', 54320), (1487, '19:40', 4130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1488, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'VIE'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1488, '07:35', 3090), (1488, '09:00', 1020), (1488, '12:05', 670), (1488, '13:40', 3200), (1488, '16:25', 2370), (1488, '18:40', 960), (1488, '20:40', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1489, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'PRG'; -- 258 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1489, '07:00', 780), (1489, '10:30', 570), (1489, '13:50', 4150), (1489, '16:30', 2180), (1489, '20:40', 4730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1490, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'WAW'; -- 509 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1490, '07:05', 2620), (1490, '09:45', 1390), (1490, '11:45', 3770), (1490, '14:05', 1670), (1490, '16:30', 4730), (1490, '18:30', 3560), (1490, '20:40', 258500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1491, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'BCN'; -- 1503 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1491, '06:35', 2060), (1491, '09:55', 4770), (1491, '11:15', 439470), (1491, '14:10', 830), (1491, '16:05', 146270), (1491, '17:35', 1170), (1491, '20:10', 50270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1492, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MAD'; -- 1850 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1492, '07:20', 670), (1492, '11:05', 1670), (1492, '13:05', 2940), (1492, '16:40', 324340), (1492, '20:25', 5000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1493, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'AGP'; -- 2242 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1493, '07:10', 4580), (1493, '08:45', 3040), (1493, '12:10', 3900), (1493, '13:25', 2940), (1493, '15:35', 48360), (1493, '18:45', 190), (1493, '21:00', 1730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1494, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'PMI'; -- 1646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1494, '08:20', 590), (1494, '09:55', 2820), (1494, '13:45', 4690), (1494, '17:40', 440), (1494, '19:25', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1495, f.id, t.id, 300 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'LPA'; -- 3615 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1495, '07:40', 94960), (1495, '09:15', 84400), (1495, '12:45', 1740), (1495, '15:25', 2500), (1495, '17:55', 230), (1495, '20:10', 505180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1496, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'LIS'; -- 2304 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1496, '07:50', 870), (1496, '11:00', 4320), (1496, '13:40', 216560), (1496, '16:05', 4540), (1496, '19:50', 2820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1497, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'FCO'; -- 1179 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1497, '07:00', 1290), (1497, '09:40', 2960), (1497, '11:55', 2900), (1497, '15:15', 810), (1497, '18:15', 177720), (1497, '20:50', 622520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1498, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MXP'; -- 826 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1498, '07:05', 1340), (1498, '09:15', 1360), (1498, '11:45', 1010), (1498, '15:10', 4450), (1498, '17:50', 4240), (1498, '19:45', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1499, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'ATH'; -- 1797 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1499, '08:00', 1150), (1499, '09:10', 1060), (1499, '12:00', 4080), (1499, '15:00', 2890), (1499, '17:40', 977350), (1499, '19:50', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1500, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'IST'; -- 1688 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1500, '06:45', 1050), (1500, '09:55', 2900), (1500, '12:30', 793990), (1500, '14:25', 2180), (1500, '17:25', 1500), (1500, '20:35', 44200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1501, f.id, t.id, 375 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'DXB'; -- 4613 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1501, '07:00', 3980), (1501, '09:05', 2650), (1501, '11:10', 2590), (1501, '14:05', 4210), (1501, '15:20', 470), (1501, '18:00', 1510), (1501, '20:10', 1800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1502, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'BKK'; -- 8621 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1502, '07:10', 1060), (1502, '08:50', 840), (1502, '11:10', 50360), (1502, '14:05', 4600), (1502, '16:00', 412330), (1502, '17:45', 690), (1502, '19:45', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1503, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'JFK'; -- 6390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1503, '07:15', 1830), (1503, '10:20', 4880), (1503, '12:25', 4260), (1503, '15:45', 1980), (1503, '17:30', 885880), (1503, '19:40', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1504, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'EWR'; -- 6410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1504, '06:55', 58610), (1504, '10:00', 203140), (1504, '12:30', 3720), (1504, '15:20', 3620), (1504, '17:50', 914480), (1504, '19:35', 4580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1505, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'ORD'; -- 7105 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1505, '07:55', 2840), (1505, '09:25', 4630), (1505, '11:50', 4810), (1505, '14:55', 990), (1505, '17:25', 1990), (1505, '20:00', 4370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1506, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'MIA'; -- 8011 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1506, '06:30', 2570), (1506, '08:40', 3870), (1506, '10:55', 2680), (1506, '14:15', 2820), (1506, '16:00', 4390), (1506, '18:25', 4480), (1506, '20:15', 4430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1507, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'LAX'; -- 9345 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1507, '07:20', 4410), (1507, '09:05', 1580), (1507, '11:35', 3820), (1507, '13:10', 35520), (1507, '15:50', 524990), (1507, '17:45', 3560), (1507, '19:55', 4870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1508, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'BER' AND t.iata = 'YYZ'; -- 6502 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1508, '07:25', 80050), (1508, '10:10', 2040), (1508, '13:00', 460), (1508, '17:30', 4680), (1508, '19:45', 231500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1509, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BMA'; -- 1458 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1509, '07:35', 2240), (1509, '11:10', 1600), (1509, '13:10', 3610), (1509, '16:25', 730), (1509, '19:50', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1510, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'GOT'; -- 1163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1510, '07:45', 2300), (1510, '08:55', 3990), (1510, '12:05', 2450), (1510, '13:25', 195000), (1510, '16:00', 4820), (1510, '18:50', 4970), (1510, '19:50', 4870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1511, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MMX'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1511, '07:05', 86930), (1511, '09:55', 1920), (1511, '11:30', 4570), (1511, '14:20', 872120), (1511, '16:35', 2570), (1511, '18:10', 1710), (1511, '20:50', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1512, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'VBY'; -- 1311 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1512, '06:35', 390), (1512, '08:50', 38770), (1512, '11:20', 1380), (1512, '14:15', 1310), (1512, '16:35', 2750), (1512, '17:40', 4860), (1512, '19:45', 3240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1513, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'UME'; -- 1952 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1513, '07:30', 930), (1513, '09:40', 1730), (1513, '11:30', 920510), (1513, '13:25', 5000), (1513, '16:05', 1390), (1513, '18:40', 4090), (1513, '20:30', 4110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1514, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'OSD'; -- 1787 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1514, '06:30', 967010), (1514, '09:50', 3890), (1514, '12:00', 750), (1514, '13:30', 1080), (1514, '15:40', 4520), (1514, '18:00', 3430), (1514, '20:35', 3310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1515, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'KRN'; -- 2361 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1515, '08:20', 4310), (1515, '11:30', 3410), (1515, '12:50', 1640), (1515, '17:05', 1560), (1515, '20:35', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1516, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'OSL'; -- 1425 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1516, '07:35', 4680), (1516, '08:40', 1320), (1516, '11:00', 3960), (1516, '13:15', 1700), (1516, '15:50', 1990), (1516, '17:55', 58500), (1516, '19:50', 1210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1517, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BGO'; -- 1443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1517, '07:05', 781570), (1517, '10:35', 3280), (1517, '12:50', 3280), (1517, '14:30', 1730), (1517, '17:05', 2680), (1517, '19:45', 14480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1518, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'TRD'; -- 1785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1518, '07:25', 3840), (1518, '09:35', 3540), (1518, '12:50', 3040), (1518, '14:30', 1880), (1518, '17:05', 1620), (1518, '19:55', 3370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1519, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'CPH'; -- 950 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1519, '07:00', 94490), (1519, '08:55', 272210), (1519, '11:05', 4590), (1519, '13:20', 1070), (1519, '16:25', 83620), (1519, '18:20', 2350), (1519, '20:55', 3950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1520, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'AAL'; -- 1074 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1520, '06:45', 2390), (1520, '10:35', 830), (1520, '12:35', 51590), (1520, '14:45', 828500), (1520, '17:50', 1300), (1520, '20:50', 4700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1521, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'HEL'; -- 1779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1521, '07:40', 1810), (1521, '09:45', 170), (1521, '11:55', 440780), (1521, '14:15', 2570), (1521, '16:20', 4000), (1521, '18:35', 3620), (1521, '20:20', 347940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1522, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'KEF'; -- 2631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1522, '07:55', 4300), (1522, '09:30', 777620), (1522, '11:45', 4490), (1522, '14:40', 26780), (1522, '17:55', 398010), (1522, '19:50', 4620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1523, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'TLL'; -- 1702 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1523, '07:35', 1780), (1523, '10:20', 2330), (1523, '13:35', 3400), (1523, '17:00', 3180), (1523, '20:30', 2580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1524, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'RIX'; -- 1481 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1524, '07:25', 1110), (1524, '10:05', 4800), (1524, '13:05', 1100), (1524, '15:00', 2740), (1524, '17:40', 2870), (1524, '19:45', 240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1525, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'LHR'; -- 788 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1525, '08:00', 3040), (1525, '11:15', 200), (1525, '13:25', 4880), (1525, '16:25', 1510), (1525, '20:45', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1526, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MAN'; -- 1007 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1526, '06:55', 4580), (1526, '08:50', 3760), (1526, '11:40', 54700), (1526, '14:20', 1160), (1526, '15:55', 2890), (1526, '18:00', 1860), (1526, '20:40', 1660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1527, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'EDI'; -- 1248 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1527, '06:55', 4980), (1527, '09:45', 4300), (1527, '10:55', 5750), (1527, '14:10', 40900), (1527, '15:35', 170), (1527, '17:55', 1510), (1527, '20:15', 1160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1528, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'DUB'; -- 1237 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1528, '07:00', 3940), (1528, '09:35', 3000), (1528, '11:05', 2100), (1528, '13:40', 4310), (1528, '16:10', 4300), (1528, '18:30', 3630), (1528, '19:55', 95210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1529, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'CDG'; -- 476 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1529, '07:20', 4760), (1529, '09:20', 4180), (1529, '11:50', 4130), (1529, '13:40', 160), (1529, '16:35', 1990), (1529, '18:45', 680), (1529, '20:00', 2280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1530, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'NCE'; -- 435 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1530, '07:10', 881550), (1530, '08:50', 4940), (1530, '11:30', 1920), (1530, '13:35', 4190), (1530, '15:40', 4850), (1530, '17:50', 259220), (1530, '20:00', 620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1531, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'AMS'; -- 604 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1531, '07:00', 4880), (1531, '08:55', 3550), (1531, '11:20', 1400), (1531, '14:15', 470), (1531, '15:25', 3540), (1531, '17:45', 54030), (1531, '20:00', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1532, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'FRA'; -- 286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1532, '06:55', 1490), (1532, '10:30', 67610), (1532, '12:15', 2700), (1532, '15:00', 447540), (1532, '17:20', 644190), (1532, '20:30', 1170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1533, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BER'; -- 651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1533, '06:40', 1930), (1533, '09:05', 720), (1533, '11:50', 56370), (1533, '13:15', 3520), (1533, '15:20', 24620), (1533, '17:50', 1300), (1533, '20:05', 2450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1534, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'VIE'; -- 603 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1534, '07:00', 2780), (1534, '10:15', 4590), (1534, '13:05', 3020), (1534, '14:35', 340), (1534, '18:05', 4910), (1534, '20:30', 16350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1535, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'PRG'; -- 511 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1535, '07:35', 2870), (1535, '09:55', 2200), (1535, '13:10', 3660), (1535, '16:45', 1400), (1535, '19:35', 850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1536, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'WAW'; -- 1032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1536, '06:50', 1640), (1536, '09:25', 4750), (1536, '11:50', 2610), (1536, '14:20', 1490), (1536, '17:50', 3320), (1536, '19:30', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1537, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BCN'; -- 856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1537, '06:40', 2690), (1537, '09:50', 4160), (1537, '11:05', 1720), (1537, '13:30', 3470), (1537, '15:25', 880), (1537, '18:40', 449550), (1537, '19:45', 1950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1538, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MAD'; -- 1239 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1538, '07:30', 1810), (1538, '09:00', 4040), (1538, '12:10', 1260), (1538, '13:15', 4540), (1538, '16:35', 1280), (1538, '17:55', 1560), (1538, '20:00', 330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1539, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'AGP'; -- 1608 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1539, '07:50', 3370), (1539, '10:25', 1820), (1539, '12:30', 2380), (1539, '15:10', 4450), (1539, '17:45', 3470), (1539, '19:50', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1540, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'PMI'; -- 996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1540, '07:35', 3260), (1540, '09:30', 42500), (1540, '12:00', 53930), (1540, '13:50', 3790), (1540, '15:40', 4890), (1540, '18:20', 4610), (1540, '20:00', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1541, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'LPA'; -- 3001 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1541, '06:35', 3970), (1541, '09:20', 3800), (1541, '11:15', 3200), (1541, '13:35', 650), (1541, '16:35', 4420), (1541, '18:05', 1280), (1541, '21:00', 223200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1542, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'LIS'; -- 1724 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1542, '08:05', 3630), (1542, '10:35', 98520), (1542, '14:25', 890), (1542, '17:45', 4660), (1542, '20:35', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1543, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'FCO'; -- 694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1543, '06:50', 1380), (1543, '08:55', 1500), (1543, '11:55', 4480), (1543, '13:55', 2260), (1543, '15:30', 2490), (1543, '18:30', 2340), (1543, '20:25', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1544, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MXP'; -- 204 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1544, '06:45', 4600), (1544, '09:40', 3880), (1544, '12:10', 4720), (1544, '14:35', 20590), (1544, '18:10', 90020), (1544, '19:50', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1545, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'ATH'; -- 1639 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1545, '07:40', 4320), (1545, '08:50', 348770), (1545, '11:45', 3850), (1545, '14:15', 86450), (1545, '15:35', 4420), (1545, '18:05', 4020), (1545, '19:55', 1820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1546, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'IST'; -- 1740 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1546, '07:55', 92650), (1546, '10:10', 350), (1546, '12:20', 2130), (1546, '14:35', 4400), (1546, '18:15', 380), (1546, '20:40', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1547, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'DXB'; -- 4768 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1547, '06:40', 3200), (1547, '09:50', 210010), (1547, '10:55', 310), (1547, '13:25', 3050), (1547, '16:05', 2090), (1547, '17:40', 220), (1547, '20:45', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1548, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'BKK'; -- 9054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1548, '07:30', 610), (1548, '08:45', 1540), (1548, '12:00', 2950), (1548, '13:15', 21970), (1548, '16:15', 2430), (1548, '17:45', 3390), (1548, '20:05', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1549, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'JFK'; -- 6310 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1549, '07:10', 2650), (1549, '08:55', 1670), (1549, '11:50', 210), (1549, '13:20', 13880), (1549, '16:00', 970), (1549, '18:10', 380), (1549, '19:55', 2080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1550, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'EWR'; -- 6333 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1550, '08:00', 4620), (1550, '09:45', 1060), (1550, '13:00', 1160), (1550, '16:50', 630), (1550, '19:35', 1620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1551, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'ORD'; -- 7131 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1551, '07:30', 22940), (1551, '09:00', 4870), (1551, '11:05', 3290), (1551, '13:10', 2450), (1551, '15:55', 3860), (1551, '18:05', 2390), (1551, '21:00', 3130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1552, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'MIA'; -- 7845 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1552, '06:40', 2610), (1552, '09:10', 3050), (1552, '11:05', 750), (1552, '13:55', 822490), (1552, '15:25', 2140), (1552, '18:50', 446610), (1552, '21:00', 1180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1553, f.id, t.id, 745 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'LAX'; -- 9535 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1553, '06:55', 540), (1553, '09:45', 1100), (1553, '12:10', 2460), (1553, '13:30', 682340), (1553, '15:50', 4950), (1553, '18:10', 610), (1553, '20:45', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1554, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'ZRH' AND t.iata = 'YYZ'; -- 6491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1554, '08:25', 294260), (1554, '10:40', 99170), (1554, '14:10', 2710), (1554, '16:35', 2400), (1554, '19:20', 1020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1555, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'ARN'; -- 1286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1555, '07:50', 870), (1555, '09:10', 3870), (1555, '12:55', 1610), (1555, '15:40', 3090), (1555, '18:00', 4770), (1555, '19:40', 2600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1556, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BMA'; -- 1253 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1556, '06:35', 1190), (1556, '08:50', 4760), (1556, '11:30', 510), (1556, '13:20', 4160), (1556, '16:35', 1650), (1556, '18:00', 1310), (1556, '20:20', 2760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1557, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'GOT'; -- 1101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1557, '06:35', 4260), (1557, '09:50', 44090), (1557, '11:40', 270), (1557, '13:55', 4820), (1557, '15:30', 2520), (1557, '18:25', 3870), (1557, '19:55', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1558, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MMX'; -- 855 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1558, '06:50', 3340), (1558, '11:25', 991330), (1558, '13:20', 4320), (1558, '17:15', 4260), (1558, '19:10', 1650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1559, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'VBY'; -- 1069 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1559, '06:50', 630), (1559, '09:40', 1250), (1559, '12:15', 4730), (1559, '15:25', 3060), (1559, '18:20', 68300), (1559, '19:55', 80440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1560, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'UME'; -- 1758 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1560, '07:10', 270), (1560, '08:45', 4800), (1560, '11:50', 3330), (1560, '14:20', 711700), (1560, '16:10', 1440), (1560, '18:25', 4860), (1560, '20:50', 2410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1561, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'OSD'; -- 1682 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1561, '07:35', 3920), (1561, '11:20', 930430), (1561, '14:40', 200), (1561, '16:10', 1250), (1561, '20:05', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1562, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'KRN'; -- 2202 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1562, '07:15', 457370), (1562, '09:05', 2620), (1562, '11:50', 4390), (1562, '14:20', 1820), (1562, '15:55', 2970), (1562, '17:50', 3170), (1562, '20:15', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1563, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'OSL'; -- 1388 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1563, '06:55', 492840), (1563, '09:30', 2440), (1563, '12:55', 12800), (1563, '15:30', 887230), (1563, '17:30', 3260), (1563, '20:15', 3550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1564, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BGO'; -- 1538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1564, '06:50', 209210), (1564, '09:25', 550), (1564, '12:10', 3340), (1564, '14:25', 9270), (1564, '17:35', 920330), (1564, '20:45', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1565, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'TRD'; -- 1741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1565, '07:00', 3840), (1565, '10:55', 4590), (1565, '14:10', 70440), (1565, '17:15', 2970), (1565, '19:55', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1566, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'CPH'; -- 877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1566, '08:00', 65570), (1566, '10:00', 21130), (1566, '14:15', 450), (1566, '16:20', 450), (1566, '20:05', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1567, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'AAL'; -- 1096 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1567, '06:50', 4790), (1567, '10:10', 510), (1567, '12:20', 4770), (1567, '15:15', 3040), (1567, '17:15', 392020), (1567, '20:55', 3870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1568, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'HEL'; -- 1460 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1568, '06:35', 1830), (1568, '10:05', 273510), (1568, '12:30', 3530), (1568, '15:40', 1200), (1568, '17:30', 25650), (1568, '20:00', 2460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1569, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'KEF'; -- 2931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1569, '07:15', 3210), (1569, '09:00', 37050), (1569, '12:05', 40510), (1569, '13:40', 1450), (1569, '16:20', 4560), (1569, '18:00', 595990), (1569, '19:50', 3540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1570, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'TLL'; -- 1366 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1570, '07:30', 2190), (1570, '10:05', 2440), (1570, '12:40', 2910), (1570, '15:25', 2980), (1570, '18:05', 890), (1570, '20:40', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1571, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'RIX'; -- 1099 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1571, '06:55', 4430), (1571, '11:00', 2710), (1571, '13:45', 3500), (1571, '16:35', 1050), (1571, '20:25', 151480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1572, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'LHR'; -- 1274 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1572, '06:35', 4690), (1572, '10:25', 4890), (1572, '12:55', 1820), (1572, '15:15', 91820), (1572, '17:20', 2780), (1572, '20:00', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1573, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MAN'; -- 1443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1573, '08:25', 1910), (1573, '09:45', 3410), (1573, '13:30', 4340), (1573, '17:20', 490), (1573, '19:35', 186270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1574, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'EDI'; -- 1610 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1574, '06:35', 4030), (1574, '09:25', 4520), (1574, '11:35', 3120), (1574, '13:45', 4450), (1574, '16:00', 2280), (1574, '17:50', 1510), (1574, '19:50', 270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1575, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'DUB'; -- 1701 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1575, '07:50', 2980), (1575, '10:35', 4170), (1575, '13:40', 1790), (1575, '16:30', 860), (1575, '20:25', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1576, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'CDG'; -- 1035 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1576, '06:45', 1770), (1576, '09:35', 2750), (1576, '11:55', 2690), (1576, '13:45', 75030), (1576, '15:40', 4370), (1576, '18:20', 280), (1576, '20:10', 2690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1577, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'NCE'; -- 876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1577, '06:55', 720), (1577, '10:40', 2170), (1577, '13:20', 509700), (1577, '17:05', 3430), (1577, '19:05', 680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1578, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'AMS'; -- 960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1578, '06:40', 900), (1578, '10:30', 4770), (1578, '12:30', 1730), (1578, '14:40', 280), (1578, '17:10', 3310), (1578, '20:15', 289720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1579, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BRU'; -- 925 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1579, '07:00', 800), (1579, '10:05', 2560), (1579, '14:20', 693480), (1579, '17:00', 670430), (1579, '19:55', 1670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1580, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'FRA'; -- 620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1580, '07:10', 109080), (1580, '09:45', 840), (1580, '11:35', 4480), (1580, '13:40', 470), (1580, '15:35', 290), (1580, '18:50', 706800), (1580, '20:25', 410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1581, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BER'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1581, '06:55', 1710), (1581, '09:35', 2190), (1581, '11:10', 1810), (1581, '14:00', 2170), (1581, '16:10', 4220), (1581, '18:00', 390), (1581, '20:50', 754960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1582, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'ZRH'; -- 603 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1582, '07:35', 1420), (1582, '08:45', 4160), (1582, '10:55', 510), (1582, '13:10', 390820), (1582, '15:35', 4710), (1582, '18:25', 4750), (1582, '20:20', 1580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1583, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'PRG'; -- 278 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1583, '08:00', 1780), (1583, '10:25', 3820), (1583, '13:05', 104750), (1583, '14:35', 1680), (1583, '17:20', 4960), (1583, '19:35', 61560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1584, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'WAW'; -- 549 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1584, '06:50', 800), (1584, '09:55', 2520), (1584, '14:10', 1880), (1584, '16:55', 2390), (1584, '19:50', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1585, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BCN'; -- 1369 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1585, '06:50', 3860), (1585, '09:50', 1840), (1585, '13:55', 4150), (1585, '17:00', 2560), (1585, '20:10', 230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1586, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MAD'; -- 1805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1586, '07:15', 4560), (1586, '09:10', 970), (1586, '11:10', 3310), (1586, '13:30', 4750), (1586, '16:05', 4780), (1586, '18:20', 430), (1586, '20:25', 910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1587, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'AGP'; -- 2136 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1587, '06:55', 4580), (1587, '10:15', 1410), (1587, '12:40', 1560), (1587, '15:35', 2740), (1587, '17:35', 4210), (1587, '20:45', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1588, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'PMI'; -- 1458 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1588, '07:10', 3780), (1588, '09:50', 3490), (1588, '12:30', 250), (1588, '15:25', 390), (1588, '17:15', 828010), (1588, '19:35', 210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1589, f.id, t.id, 295 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'LPA'; -- 3544 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1589, '07:15', 4420), (1589, '09:30', 2250), (1589, '12:35', 10440), (1589, '14:50', 790), (1589, '18:15', 560), (1589, '20:10', 2730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1590, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'LIS'; -- 2305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1590, '07:45', 1470), (1590, '10:45', 2680), (1590, '13:20', 4940), (1590, '16:50', 1410), (1590, '19:55', 1790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1591, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'FCO'; -- 779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1591, '07:35', 3780), (1591, '08:45', 2530), (1591, '11:45', 9380), (1591, '13:25', 4810), (1591, '16:10', 2820), (1591, '18:00', 2520), (1591, '20:20', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1592, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MXP'; -- 657 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1592, '07:40', 3590), (1592, '10:55', 1640), (1592, '13:00', 980), (1592, '17:45', 80000), (1592, '20:15', 73040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1593, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'ATH'; -- 1278 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1593, '07:45', 3710), (1593, '11:30', 2900), (1593, '14:25', 2580), (1593, '17:25', 950), (1593, '20:10', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1594, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'IST'; -- 1225 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1594, '07:05', 2250), (1594, '09:45', 3520), (1594, '12:10', 1280), (1594, '13:20', 1150), (1594, '16:10', 3520), (1594, '17:50', 1790), (1594, '20:45', 250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1595, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'DXB'; -- 4223 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1595, '07:15', 309470), (1595, '11:30', 4890), (1595, '14:15', 3620), (1595, '17:40', 94890), (1595, '19:45', 4840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1596, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'BKK'; -- 8451 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1596, '06:40', 2200), (1596, '08:40', 3090), (1596, '11:35', 2430), (1596, '14:15', 3180), (1596, '15:25', 2020), (1596, '17:35', 2620), (1596, '20:15', 484400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1597, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'JFK'; -- 6805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1597, '07:20', 76290), (1597, '10:50', 2800), (1597, '14:40', 250), (1597, '17:30', 4290), (1597, '19:40', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1598, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'EWR'; -- 6827 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1598, '07:00', 400), (1598, '09:40', 14770), (1598, '11:15', 2680), (1598, '14:15', 1390), (1598, '15:35', 330), (1598, '17:50', 15560), (1598, '20:35', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1599, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'ORD'; -- 7566 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1599, '07:10', 1530), (1599, '09:20', 1400), (1599, '11:45', 1350), (1599, '13:40', 1700), (1599, '16:35', 3240), (1599, '17:35', 2070), (1599, '19:50', 2040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1600, f.id, t.id, 660 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'MIA'; -- 8384 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1600, '07:45', 3540), (1600, '09:30', 41870), (1600, '11:55', 4390), (1600, '14:20', 590), (1600, '16:15', 4650), (1600, '18:10', 4740), (1600, '20:55', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1601, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'LAX'; -- 9854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1601, '07:55', 838180), (1601, '10:20', 192980), (1601, '12:30', 178010), (1601, '15:20', 220), (1601, '18:15', 1950), (1601, '20:10', 22880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1602, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'VIE' AND t.iata = 'YYZ'; -- 6948 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1602, '06:40', 2390), (1602, '08:55', 680), (1602, '11:55', 840560), (1602, '13:25', 4300), (1602, '15:50', 4330), (1602, '18:15', 955930), (1602, '20:40', 4450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1603, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'ARN'; -- 1087 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1603, '06:30', 955390), (1603, '09:50', 863880), (1603, '11:00', 4230), (1603, '13:15', 4760), (1603, '16:35', 3910), (1603, '18:20', 541620), (1603, '19:45', 970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1604, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BMA'; -- 1055 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1604, '06:45', 1110), (1604, '08:50', 1520), (1604, '11:55', 4410), (1604, '14:20', 2360), (1604, '16:05', 1780), (1604, '18:50', 2340), (1604, '20:10', 3620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1605, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MMX'; -- 608 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1605, '08:00', 3280), (1605, '09:50', 1840), (1605, '13:10', 49830), (1605, '14:55', 2540), (1605, '17:10', 2470), (1605, '20:15', 1200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1606, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'LLA'; -- 1776 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1606, '07:25', 2400), (1606, '09:35', 3640), (1606, '12:50', 952560), (1606, '15:10', 1090), (1606, '18:05', 3900), (1606, '19:45', 4040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1607, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'VBY'; -- 882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1607, '06:55', 2070), (1607, '09:35', 4680), (1607, '12:35', 4060), (1607, '14:45', 4520), (1607, '18:10', 654400), (1607, '20:00', 1080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1608, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'UME'; -- 1564 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1608, '06:55', 3830), (1608, '11:15', 571230), (1608, '14:35', 1920), (1608, '17:40', 3230), (1608, '20:45', 390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1609, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'OSD'; -- 1456 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1609, '07:15', 2210), (1609, '09:30', 464750), (1609, '11:55', 2200), (1609, '13:20', 3170), (1609, '16:30', 1670), (1609, '18:15', 660), (1609, '20:45', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1610, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'KRN'; -- 1999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1610, '07:30', 2990), (1610, '09:25', 82200), (1610, '12:10', 4370), (1610, '15:30', 370), (1610, '18:10', 4570), (1610, '20:50', 4260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1611, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'OSL'; -- 1139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1611, '07:15', 450), (1611, '08:45', 3280), (1611, '11:20', 4310), (1611, '13:10', 2820), (1611, '15:20', 2750), (1611, '17:35', 3880), (1611, '20:10', 530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1612, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BGO'; -- 1267 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1612, '07:55', 2850), (1612, '10:55', 1420), (1612, '14:40', 3710), (1612, '16:40', 1090), (1612, '20:10', 4070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1613, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'TRD'; -- 1499 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1613, '06:50', 842840), (1613, '08:40', 1000), (1613, '11:15', 995110), (1613, '13:45', 95640), (1613, '16:25', 1560), (1613, '17:40', 2030), (1613, '20:20', 3100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1614, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'CPH'; -- 623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1614, '07:05', 750), (1614, '09:50', 682820), (1614, '11:45', 4970), (1614, '14:15', 1280), (1614, '15:55', 1920), (1614, '18:50', 1990), (1614, '20:20', 683490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1615, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'AAL'; -- 830 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1615, '06:50', 448800), (1615, '09:55', 754500), (1615, '11:15', 3070), (1615, '13:35', 2890), (1615, '15:40', 3230), (1615, '18:05', 4250), (1615, '20:25', 94110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1616, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'HEL'; -- 1320 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1616, '06:30', 1990), (1616, '08:45', 3180), (1616, '12:10', 2970), (1616, '13:35', 4670), (1616, '15:50', 2480), (1616, '18:05', 2860), (1616, '20:25', 4480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1617, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'KEF'; -- 2653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1617, '06:45', 380), (1617, '10:30', 1580), (1617, '14:40', 2450), (1617, '17:30', 2100), (1617, '20:50', 1550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1618, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'TLL'; -- 1234 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1618, '06:45', 3000), (1618, '09:40', 1110), (1618, '11:55', 1260), (1618, '14:55', 4430), (1618, '18:10', 425330), (1618, '20:25', 3210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1619, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'RIX'; -- 992 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1619, '08:25', 270), (1619, '09:45', 4520), (1619, '14:20', 46090), (1619, '16:35', 2630), (1619, '19:55', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1620, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'LHR'; -- 1043 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1620, '08:05', 2480), (1620, '10:25', 520), (1620, '13:40', 977990), (1620, '16:55', 1570), (1620, '20:15', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1621, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MAN'; -- 1192 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1621, '08:20', 421460), (1621, '10:00', 995490), (1621, '13:45', 3870), (1621, '17:35', 3300), (1621, '19:50', 4020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1622, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'EDI'; -- 1341 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1622, '07:45', 68580), (1622, '09:25', 4830), (1622, '12:00', 36390), (1622, '14:15', 94850), (1622, '16:25', 865000), (1622, '17:45', 4220), (1622, '21:00', 41840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1623, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'DUB'; -- 1454 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1623, '08:05', 3420), (1623, '09:55', 21070), (1623, '14:00', 4950), (1623, '16:35', 314900), (1623, '19:30', 4740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1624, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'CDG'; -- 852 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1624, '07:15', 3500), (1624, '09:55', 3240), (1624, '11:00', 2110), (1624, '14:20', 2180), (1624, '16:05', 2870), (1624, '18:35', 4510), (1624, '20:20', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1625, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'NCE'; -- 893 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1625, '07:50', 2390), (1625, '09:40', 4580), (1625, '12:25', 95080), (1625, '15:10', 2010), (1625, '18:20', 2500), (1625, '20:10', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1626, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BRU'; -- 697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1626, '08:00', 1730), (1626, '09:25', 1410), (1626, '12:50', 4790), (1626, '14:40', 942370), (1626, '18:10', 2390), (1626, '20:20', 370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1627, f.id, t.id, 60 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'FRA'; -- 406 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1627, '08:10', 1100), (1627, '10:30', 139160), (1627, '14:05', 1320), (1627, '16:25', 4440), (1627, '19:10', 17520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1628, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BER'; -- 258 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1628, '06:45', 3610), (1628, '11:05', 74800), (1628, '14:30', 3490), (1628, '16:50', 2300), (1628, '20:45', 271890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1629, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'ZRH'; -- 511 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1629, '07:15', 1030), (1629, '09:40', 8610), (1629, '11:50', 3170), (1629, '13:30', 320), (1629, '15:30', 2040), (1629, '18:15', 24410), (1629, '19:55', 59650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1630, f.id, t.id, 50 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'VIE'; -- 278 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1630, '07:15', 830), (1630, '10:35', 16280), (1630, '13:10', 630), (1630, '15:00', 2880), (1630, '18:00', 4360), (1630, '20:30', 270190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1631, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'WAW'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1631, '06:55', 290), (1631, '10:50', 910), (1631, '14:35', 19690), (1631, '16:10', 889930), (1631, '19:45', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1632, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BCN'; -- 1358 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1632, '08:00', 1200), (1632, '11:30', 4690), (1632, '13:45', 4520), (1632, '17:00', 899590), (1632, '19:20', 2410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1633, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MAD'; -- 1749 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1633, '06:40', 1560), (1633, '08:45', 3010), (1633, '11:35', 464140), (1633, '13:30', 394420), (1633, '15:20', 4080), (1633, '18:35', 1370), (1633, '20:25', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1634, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'AGP'; -- 2117 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1634, '07:30', 50300), (1634, '09:50', 3720), (1634, '14:10', 3840), (1634, '17:45', 1910), (1634, '20:15', 670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1635, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'PMI'; -- 1480 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1635, '07:20', 2350), (1635, '10:35', 4170), (1635, '12:55', 1460), (1635, '15:15', 4660), (1635, '17:40', 4290), (1635, '20:50', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1636, f.id, t.id, 295 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'LPA'; -- 3512 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1636, '07:40', 4990), (1636, '10:35', 1840), (1636, '13:05', 892900), (1636, '17:40', 2880), (1636, '20:05', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1637, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'LIS'; -- 2229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1637, '07:50', 3840), (1637, '10:00', 520), (1637, '14:05', 2520), (1637, '17:35', 879510), (1637, '19:15', 1380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1638, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'FCO'; -- 936 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1638, '06:45', 1180), (1638, '09:45', 3900), (1638, '12:25', 4970), (1638, '15:30', 4080), (1638, '17:15', 1480), (1638, '20:45', 3210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1639, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MXP'; -- 646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1639, '07:15', 960), (1639, '09:55', 80390), (1639, '11:35', 3520), (1639, '14:05', 2180), (1639, '15:25', 92460), (1639, '17:40', 3600), (1639, '19:45', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1640, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'ATH'; -- 1555 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1640, '08:00', 2400), (1640, '09:30', 2750), (1640, '11:55', 3830), (1640, '14:45', 28020), (1640, '17:00', 460), (1640, '19:50', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1641, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'IST'; -- 1489 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1641, '07:25', 2140), (1641, '09:40', 2970), (1641, '12:10', 1790), (1641, '14:40', 240), (1641, '18:05', 243550), (1641, '20:35', 320160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1642, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'DXB'; -- 4464 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1642, '06:35', 1050), (1642, '09:55', 3330), (1642, '12:05', 400), (1642, '14:15', 1140), (1642, '15:35', 3120), (1642, '18:20', 2760), (1642, '19:45', 500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1643, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'BKK'; -- 8596 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1643, '06:55', 175220), (1643, '11:00', 454590), (1643, '14:15', 460), (1643, '16:30', 380), (1643, '20:40', 1210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1644, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'JFK'; -- 6551 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1644, '07:45', 2800), (1644, '08:40', 2060), (1644, '11:10', 74620), (1644, '13:20', 2290), (1644, '16:05', 2350), (1644, '18:20', 2300), (1644, '20:00', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1645, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'EWR'; -- 6572 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1645, '06:40', 4530), (1645, '10:50', 3240), (1645, '14:10', 347820), (1645, '16:30', 670), (1645, '19:35', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1646, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'ORD'; -- 7297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1646, '07:40', 4800), (1646, '10:10', 2220), (1646, '12:55', 1560), (1646, '16:05', 3450), (1646, '20:40', 3170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1647, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'MIA'; -- 8147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1647, '07:45', 3330), (1647, '10:00', 4690), (1647, '12:50', 400), (1647, '14:20', 1950), (1647, '16:55', 1360), (1647, '19:40', 4110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1648, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'LAX'; -- 9576 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1648, '06:40', 4430), (1648, '09:45', 1530), (1648, '11:35', 200), (1648, '14:05', 1800), (1648, '16:30', 3890), (1648, '17:55', 3730), (1648, '20:50', 2810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1649, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'PRG' AND t.iata = 'YYZ'; -- 6684 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1649, '07:10', 3950), (1649, '10:35', 4760), (1649, '12:30', 4850), (1649, '15:05', 3210), (1649, '17:00', 3280), (1649, '19:55', 190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1650, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'ARN'; -- 853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1650, '06:35', 530), (1650, '09:35', 520950), (1650, '12:40', 4780), (1650, '15:45', 37240), (1650, '17:25', 24510), (1650, '20:15', 4710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1651, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BMA'; -- 820 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1651, '07:30', 2460), (1651, '10:35', 3200), (1651, '12:15', 3790), (1651, '14:40', 252290), (1651, '17:45', 1590), (1651, '20:10', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1652, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'GOT'; -- 824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1652, '07:10', 2130), (1652, '10:05', 1220), (1652, '12:30', 800), (1652, '15:05', 823760), (1652, '18:15', 4180), (1652, '20:50', 813060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1653, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MMX'; -- 623 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1653, '07:40', 905640), (1653, '09:50', 1060), (1653, '11:00', 510), (1653, '13:35', 227560), (1653, '16:20', 44840), (1653, '17:50', 3410), (1653, '20:40', 4490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1654, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'LLA'; -- 1488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1654, '07:50', 1930), (1654, '09:40', 260), (1654, '11:45', 1900), (1654, '14:35', 1680), (1654, '17:25', 2300), (1654, '19:40', 390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1655, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'VBY'; -- 633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1655, '08:25', 1000), (1655, '10:45', 1920), (1655, '13:00', 4860), (1655, '17:25', 2530), (1655, '19:55', 1110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1656, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'UME'; -- 1293 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1656, '06:40', 698020), (1656, '10:45', 4630), (1656, '14:35', 3290), (1656, '16:30', 24060), (1656, '19:35', 770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1657, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'OSD'; -- 1283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1657, '07:30', 3230), (1657, '09:45', 900), (1657, '14:05', 2900), (1657, '17:35', 4830), (1657, '19:35', 2790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1658, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'KRN'; -- 1741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1658, '07:00', 1710), (1658, '09:10', 4070), (1658, '11:55', 3790), (1658, '14:45', 2650), (1658, '17:20', 590), (1658, '19:50', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1659, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'OSL'; -- 1078 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1659, '07:40', 1990), (1659, '11:30', 4290), (1659, '13:50', 5000), (1659, '16:25', 276530), (1659, '19:10', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1660, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BGO'; -- 1322 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1660, '07:10', 55440), (1660, '11:00', 970), (1660, '14:25', 4740), (1660, '16:55', 185190), (1660, '20:45', 4670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1661, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'TRD'; -- 1386 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1661, '07:40', 257510), (1661, '09:00', 1010), (1661, '12:05', 5000), (1661, '14:00', 3240), (1661, '15:30', 860), (1661, '17:45', 2990), (1661, '20:10', 24030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1662, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'AAL'; -- 899 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1662, '06:45', 4520), (1662, '11:10', 3450), (1662, '13:20', 1640), (1662, '17:40', 2800), (1662, '20:50', 4060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1663, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'HEL'; -- 939 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1663, '07:50', 1770), (1663, '09:20', 3840), (1663, '11:45', 820), (1663, '15:10', 88270), (1663, '18:10', 1950), (1663, '20:00', 75180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1664, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'KEF'; -- 2804 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1664, '07:50', 683720), (1664, '10:35', 200), (1664, '11:50', 660), (1664, '14:55', 2130), (1664, '17:30', 2660), (1664, '20:35', 4680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1665, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'TLL'; -- 840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1665, '07:00', 4750), (1665, '08:50', 330), (1665, '11:45', 4350), (1665, '13:25', 165140), (1665, '16:05', 2410), (1665, '18:10', 2420), (1665, '20:10', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1666, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'RIX'; -- 562 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1666, '06:50', 529700), (1666, '10:25', 4980), (1666, '13:55', 3010), (1666, '16:30', 19020), (1666, '19:40', 4730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1667, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'LHR'; -- 1469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1667, '07:55', 57680), (1667, '10:00', 165010), (1667, '14:20', 3870), (1667, '17:40', 4170), (1667, '20:50', 1480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1668, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MAN'; -- 1563 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1668, '06:55', 642620), (1668, '09:10', 4540), (1668, '11:20', 2910), (1668, '14:05', 1300), (1668, '15:45', 3350), (1668, '18:20', 4520), (1668, '20:00', 69880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1669, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'EDI'; -- 1634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1669, '07:05', 4950), (1669, '09:10', 2980), (1669, '12:55', 10440), (1669, '15:20', 18570), (1669, '17:30', 45170), (1669, '20:50', 11750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1670, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'DUB'; -- 1824 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1670, '07:55', 3680), (1670, '10:05', 2140), (1670, '13:05', 99490), (1670, '15:30', 1910), (1670, '17:20', 4690), (1670, '20:05', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1671, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'CDG'; -- 1343 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1671, '07:40', 460), (1671, '09:00', 4520), (1671, '12:00', 1180), (1671, '14:00', 4310), (1671, '15:55', 3050), (1671, '18:35', 3880), (1671, '20:50', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1672, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'NCE'; -- 1391 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1672, '06:40', 380), (1672, '10:35', 908310), (1672, '12:30', 2340), (1672, '15:35', 400), (1672, '16:55', 2960), (1672, '20:15', 1310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1673, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'AMS'; -- 1102 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1673, '06:35', 1880), (1673, '09:10', 1070), (1673, '11:40', 63020), (1673, '14:20', 4770), (1673, '16:35', 4380), (1673, '17:55', 990), (1673, '19:50', 2330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1674, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BRU'; -- 1147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1674, '07:15', 2660), (1674, '10:20', 87240), (1674, '14:35', 4670), (1674, '17:45', 480), (1674, '20:00', 180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1675, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'FRA'; -- 897 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1675, '08:10', 69200), (1675, '11:10', 2720), (1675, '13:50', 1000), (1675, '17:00', 4640), (1675, '19:45', 4660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1676, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MUC'; -- 778 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1676, '07:45', 1490), (1676, '09:40', 2820), (1676, '12:55', 650), (1676, '14:45', 950), (1676, '17:05', 3670), (1676, '20:05', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1677, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BER'; -- 509 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1677, '07:05', 510), (1677, '10:10', 180), (1677, '12:20', 4380), (1677, '14:40', 2520), (1677, '17:15', 460), (1677, '20:30', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1678, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'ZRH'; -- 1032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1678, '07:30', 3870), (1678, '10:30', 3210), (1678, '14:05', 1230), (1678, '17:10', 713700), (1678, '20:40', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1679, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'VIE'; -- 549 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1679, '08:25', 4870), (1679, '10:10', 444700), (1679, '13:50', 1820), (1679, '17:05', 860), (1679, '19:05', 246180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1680, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'PRG'; -- 521 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1680, '08:05', 1490), (1680, '09:50', 690), (1680, '12:50', 1040), (1680, '16:05', 1120), (1680, '20:30', 13600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1681, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BCN'; -- 1870 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1681, '06:45', 2420), (1681, '10:10', 844440), (1681, '13:40', 4370), (1681, '17:40', 4340), (1681, '20:25', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1682, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MAD'; -- 2271 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1682, '06:50', 4040), (1682, '11:30', 71560), (1682, '14:00', 99300), (1682, '16:15', 510), (1682, '19:30', 3190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1683, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'AGP'; -- 2633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1683, '07:05', 3850), (1683, '10:20', 1890), (1683, '11:45', 2670), (1683, '15:40', 470), (1683, '18:05', 4480), (1683, '20:00', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1684, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'PMI'; -- 1980 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1684, '08:00', 84940), (1684, '09:45', 230), (1684, '13:00', 1310), (1684, '15:40', 4650), (1684, '17:20', 2150), (1684, '19:55', 3380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1685, f.id, t.id, 330 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'LPA'; -- 4032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1685, '07:15', 4200), (1685, '09:25', 4640), (1685, '12:05', 3760), (1685, '13:10', 320590), (1685, '15:55', 72310), (1685, '17:35', 520), (1685, '19:45', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1686, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'LIS'; -- 2750 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1686, '08:10', 3360), (1686, '10:55', 4400), (1686, '13:00', 329960), (1686, '16:25', 37660), (1686, '19:50', 3080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1687, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'FCO'; -- 1327 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1687, '07:15', 397680), (1687, '11:05', 3190), (1687, '13:35', 2360), (1687, '16:35', 1160), (1687, '19:45', 390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1688, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MXP'; -- 1151 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1688, '07:30', 320), (1688, '09:50', 4950), (1688, '13:05', 1480), (1688, '17:15', 897230), (1688, '19:40', 4760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1689, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'ATH'; -- 1599 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1689, '06:55', 1870), (1689, '09:45', 3000), (1689, '11:20', 435860), (1689, '13:45', 4490), (1689, '15:55', 4720), (1689, '18:25', 4520), (1689, '21:00', 887340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1690, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'IST'; -- 1348 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1690, '06:40', 1350), (1690, '09:45', 4970), (1690, '11:50', 314500), (1690, '14:40', 2270), (1690, '17:25', 1640), (1690, '20:25', 3490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1691, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'DXB'; -- 4156 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1691, '08:05', 300340), (1691, '10:55', 1950), (1691, '14:20', 4550), (1691, '16:05', 190), (1691, '20:00', 830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1692, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'BKK'; -- 8115 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1692, '06:45', 240), (1692, '09:35', 117000), (1692, '12:40', 2660), (1692, '15:10', 1160), (1692, '17:00', 4130), (1692, '19:35', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1693, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'JFK'; -- 6848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1693, '06:50', 457480), (1693, '09:25', 2150), (1693, '13:00', 55500), (1693, '14:50', 128320), (1693, '17:35', 46070), (1693, '20:40', 2170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1694, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'EWR'; -- 6867 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1694, '06:55', 4060), (1694, '10:35', 1560), (1694, '14:35', 35800), (1694, '17:20', 2530), (1694, '19:45', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1695, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'ORD'; -- 7518 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1695, '07:10', 1740), (1695, '10:30', 4500), (1695, '14:15', 1510), (1695, '16:50', 2760), (1695, '20:50', 2040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1696, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'MIA'; -- 8491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1696, '07:45', 1030), (1696, '11:25', 640), (1696, '14:25', 1820), (1696, '16:40', 3740), (1696, '19:30', 47710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1697, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'LAX'; -- 9658 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1697, '07:10', 2280), (1697, '08:55', 450), (1697, '12:10', 15300), (1697, '13:20', 92100), (1697, '15:30', 1630), (1697, '18:05', 860), (1697, '20:25', 740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1698, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'WAW' AND t.iata = 'YYZ'; -- 6934 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1698, '06:50', 2480), (1698, '10:25', 4080), (1698, '12:40', 4010), (1698, '15:40', 2900), (1698, '17:30', 3040), (1698, '20:50', 1350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1699, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'BMA'; -- 2288 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1699, '07:55', 812370), (1699, '09:20', 2100), (1699, '12:15', 1050), (1699, '15:00', 420), (1699, '17:10', 1500), (1699, '20:45', 3690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1700, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'GOT'; -- 1959 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1700, '06:35', 1660), (1700, '09:25', 540), (1700, '12:00', 1700), (1700, '13:15', 2300), (1700, '16:25', 783050), (1700, '18:10', 3490), (1700, '20:20', 55130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1701, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MMX'; -- 1784 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1701, '07:40', 1580), (1701, '09:50', 900), (1701, '11:20', 1710), (1701, '14:20', 465480), (1701, '16:10', 1410), (1701, '18:30', 2880), (1701, '20:55', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1702, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'LLA'; -- 2974 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1702, '07:05', 850), (1702, '11:20', 3330), (1702, '14:25', 3490), (1702, '16:50', 730), (1702, '20:35', 570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1703, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'VBY'; -- 2153 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1703, '07:35', 3120), (1703, '09:35', 2110), (1703, '12:35', 1630), (1703, '14:30', 261700), (1703, '18:15', 765590), (1703, '20:20', 737310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1704, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'UME'; -- 2764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1704, '07:00', 1100), (1704, '09:50', 3840), (1704, '13:00', 1630), (1704, '14:40', 960640), (1704, '17:45', 944680), (1704, '19:40', 3170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1705, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'OSD'; -- 2566 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1705, '07:25', 3020), (1705, '10:35', 1280), (1705, '13:25', 2210), (1705, '17:35', 1090), (1705, '20:35', 3320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1706, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'KRN'; -- 3147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1706, '06:45', 770), (1706, '09:25', 1040), (1706, '11:55', 800), (1706, '14:55', 4230), (1706, '17:20', 4180), (1706, '20:50', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1707, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'OSL'; -- 2190 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1707, '06:50', 380), (1707, '09:15', 83050), (1707, '11:15', 1590), (1707, '14:00', 673870), (1707, '16:30', 3130), (1707, '17:35', 1470), (1707, '20:25', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1708, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'BGO'; -- 2123 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1708, '07:35', 993470), (1708, '09:15', 1720), (1708, '11:05', 4010), (1708, '13:20', 450), (1708, '16:00', 626860), (1708, '17:50', 4430), (1708, '19:55', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1709, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'TRD'; -- 2531 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1709, '06:45', 2830), (1709, '08:50', 4970), (1709, '11:45', 4240), (1709, '13:15', 2910), (1709, '16:05', 4270), (1709, '18:50', 4630), (1709, '19:45', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1710, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'CPH'; -- 1768 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1710, '06:50', 2300), (1710, '09:55', 2490), (1710, '12:50', 1320), (1710, '15:40', 1860), (1710, '17:50', 1790), (1710, '19:55', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1711, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'AAL'; -- 1841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1711, '07:00', 498060), (1711, '10:10', 4520), (1711, '14:15', 1360), (1711, '16:45', 670), (1711, '20:00', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1712, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'HEL'; -- 2628 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1712, '07:00', 2450), (1712, '10:00', 890), (1712, '12:55', 3650), (1712, '17:05', 3370), (1712, '19:50', 4890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1713, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'KEF'; -- 2981 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1713, '06:55', 2400), (1713, '09:10', 462110), (1713, '11:05', 497300), (1713, '14:15', 4610), (1713, '15:55', 4260), (1713, '18:25', 2280), (1713, '19:55', 4380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1714, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'TLL'; -- 2554 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1714, '07:05', 2230), (1714, '09:10', 1720), (1714, '11:45', 180), (1714, '14:15', 4970), (1714, '16:35', 30220), (1714, '17:40', 4280), (1714, '19:45', 1220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1715, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'RIX'; -- 2336 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1715, '07:15', 2970), (1715, '08:50', 850), (1715, '12:05', 26340), (1715, '13:20', 3110), (1715, '16:10', 1060), (1715, '18:05', 4900), (1715, '20:50', 820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1716, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'LHR'; -- 1147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1716, '06:30', 2810), (1716, '08:40', 1840), (1716, '11:35', 4970), (1716, '14:00', 520), (1716, '16:15', 710), (1716, '18:05', 2750), (1716, '20:10', 727970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1717, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MAN'; -- 1379 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1717, '07:50', 1670), (1717, '11:15', 2280), (1717, '13:05', 1800), (1717, '16:55', 570), (1717, '20:30', 480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1718, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'EDI'; -- 1676 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1718, '07:20', 1730), (1718, '10:10', 3670), (1718, '13:20', 2230), (1718, '17:00', 16140), (1718, '20:50', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1719, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'DUB'; -- 1485 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1719, '07:20', 4670), (1719, '11:15', 1110), (1719, '13:20', 1220), (1719, '16:35', 2730), (1719, '19:20', 106910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1720, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'CDG'; -- 858 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1720, '07:00', 3250), (1720, '09:10', 2130), (1720, '12:35', 1250), (1720, '14:35', 1720), (1720, '18:00', 360), (1720, '19:55', 3790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1721, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'NCE'; -- 496 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1721, '06:40', 3800), (1721, '10:05', 2090), (1721, '13:25', 430), (1721, '17:25', 85280), (1721, '20:30', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1722, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'AMS'; -- 1241 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1722, '07:30', 4410), (1722, '09:40', 48070), (1722, '12:05', 3230), (1722, '13:15', 42340), (1722, '15:20', 3850), (1722, '17:45', 4240), (1722, '20:05', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1723, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'BRU'; -- 1083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1723, '08:25', 5850), (1723, '10:25', 998150), (1723, '14:25', 1060), (1723, '17:35', 2120), (1723, '20:30', 4670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1724, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'FRA'; -- 1093 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1724, '07:40', 3200), (1724, '10:00', 3940), (1724, '13:30', 4870), (1724, '16:55', 3510), (1724, '20:10', 66480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1725, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MUC'; -- 1094 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1725, '06:45', 4110), (1725, '09:50', 1430), (1725, '11:40', 226500), (1725, '13:15', 1230), (1725, '16:25', 4730), (1725, '17:40', 2010), (1725, '20:20', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1726, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'BER'; -- 1503 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1726, '07:50', 3390), (1726, '09:35', 2860), (1726, '12:50', 640), (1726, '15:45', 2170), (1726, '17:10', 4930), (1726, '20:00', 186980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1727, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'ZRH'; -- 856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1727, '07:40', 1130), (1727, '09:25', 2090), (1727, '12:10', 310), (1727, '13:50', 680920), (1727, '16:20', 1220), (1727, '17:35', 507200), (1727, '20:35', 1290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1728, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'VIE'; -- 1369 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1728, '07:45', 977570), (1728, '09:10', 560), (1728, '11:00', 1400), (1728, '13:45', 3350), (1728, '15:45', 2930), (1728, '18:35', 2590), (1728, '20:05', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1729, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'PRG'; -- 1358 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1729, '07:40', 2000), (1729, '09:40', 530), (1729, '12:45', 2830), (1729, '14:35', 290), (1729, '17:20', 4800), (1729, '20:30', 3300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1730, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'WAW'; -- 1870 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1730, '07:20', 4490), (1730, '09:20', 3460), (1730, '12:40', 2430), (1730, '14:55', 1850), (1730, '17:20', 2470), (1730, '19:30', 3640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1731, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MAD'; -- 483 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1731, '07:55', 4490), (1731, '10:25', 1730), (1731, '13:00', 780), (1731, '17:20', 230), (1731, '20:40', 99140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1732, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'AGP'; -- 767 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1732, '07:15', 21710), (1732, '09:30', 4090), (1732, '11:55', 2510), (1732, '14:10', 1470), (1732, '16:25', 1930), (1732, '17:45', 1740), (1732, '19:50', 1600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1733, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'PMI'; -- 202 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1733, '07:10', 4450), (1733, '09:25', 1290), (1733, '12:00', 2790), (1733, '15:45', 4530), (1733, '18:00', 85380), (1733, '20:05', 162030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1734, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'LPA'; -- 2175 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1734, '07:00', 594000), (1734, '09:10', 4180), (1734, '11:45', 310), (1734, '13:55', 460), (1734, '15:45', 49620), (1734, '18:30', 3220), (1734, '20:50', 1810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1735, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'LIS'; -- 994 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1735, '07:25', 179480), (1735, '09:45', 342860), (1735, '14:20', 210), (1735, '16:25', 320), (1735, '20:35', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1736, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'FCO'; -- 848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1736, '07:30', 4990), (1736, '09:25', 3450), (1736, '12:15', 882330), (1736, '15:40', 340), (1736, '17:25', 4780), (1736, '19:50', 870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1737, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MXP'; -- 720 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1737, '07:45', 70590), (1737, '09:35', 2330), (1737, '12:25', 450), (1737, '15:40', 2290), (1737, '16:55', 687990), (1737, '19:50', 38420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1738, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'ATH'; -- 1904 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1738, '07:30', 862020), (1738, '10:00', 83030), (1738, '14:10', 42490), (1738, '17:20', 4550), (1738, '19:30', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1739, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'IST'; -- 2219 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1739, '08:05', 3010), (1739, '10:10', 4450), (1739, '13:55', 1190), (1739, '16:55', 2100), (1739, '19:15', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1740, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'DXB'; -- 5175 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1740, '07:45', 2820), (1740, '09:10', 717840), (1740, '12:15', 2230), (1740, '15:15', 4960), (1740, '17:35', 66410), (1740, '19:30', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1741, f.id, t.id, 760 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'BKK'; -- 9713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1741, '07:05', 750), (1741, '10:00', 2930), (1741, '12:40', 3720), (1741, '14:35', 3170), (1741, '17:55', 54120), (1741, '19:55', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1742, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'JFK'; -- 6150 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1742, '07:25', 1790), (1742, '09:05', 4590), (1742, '10:55', 4350), (1742, '13:20', 3030), (1742, '15:35', 2420), (1742, '18:15', 2950), (1742, '21:00', 3330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1743, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'EWR'; -- 6177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1743, '07:05', 900), (1743, '11:30', 1800), (1743, '13:25', 4320), (1743, '16:30', 3720), (1743, '19:25', 37790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1744, f.id, t.id, 560 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'ORD'; -- 7093 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1744, '07:30', 3520), (1744, '10:10', 1150), (1744, '13:40', 728360), (1744, '17:35', 3830), (1744, '19:25', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1745, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'MIA'; -- 7545 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1745, '07:05', 4620), (1745, '10:10', 2770), (1745, '14:20', 3780), (1745, '16:55', 3900), (1745, '20:45', 3190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1746, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'LAX'; -- 9674 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1746, '07:00', 4160), (1746, '09:35', 4320), (1746, '11:45', 3180), (1746, '14:30', 3640), (1746, '17:00', 649520), (1746, '19:45', 700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1747, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'BCN' AND t.iata = 'YYZ'; -- 6417 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1747, '07:25', 600), (1747, '10:20', 4090), (1747, '12:05', 570), (1747, '14:45', 2240), (1747, '18:15', 192400), (1747, '20:00', 1490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1748, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'ARN'; -- 2600 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1748, '06:30', 1250), (1748, '09:20', 5880), (1748, '11:50', 100240), (1748, '13:15', 3370), (1748, '16:00', 850), (1748, '18:10', 940470), (1748, '20:45', 2430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1749, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BMA'; -- 2577 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1749, '07:30', 900), (1749, '09:55', 800), (1749, '11:20', 4050), (1749, '14:15', 950), (1749, '16:25', 4030), (1749, '17:50', 31800), (1749, '20:35', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1750, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'GOT'; -- 2220 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1750, '06:50', 1770), (1750, '09:55', 3810), (1750, '11:55', 1290), (1750, '13:55', 2360), (1750, '16:25', 2670), (1750, '18:00', 569790), (1750, '20:30', 574050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1751, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'LLA'; -- 3222 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1751, '08:25', 4010), (1751, '10:40', 90100), (1751, '14:40', 2340), (1751, '17:20', 2840), (1751, '19:15', 67170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1752, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'VBY'; -- 2466 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1752, '07:50', 4790), (1752, '09:55', 250), (1752, '12:00', 3200), (1752, '15:30', 1960), (1752, '17:15', 1070), (1752, '20:10', 2370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1753, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'UME'; -- 3020 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1753, '08:00', 4850), (1753, '09:15', 3850), (1753, '12:35', 4130), (1753, '14:45', 610), (1753, '18:05', 3030), (1753, '20:25', 2770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1754, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'KRN'; -- 3365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1754, '07:25', 2350), (1754, '10:30', 1530), (1754, '12:15', 1530), (1754, '14:25', 270), (1754, '17:20', 828120), (1754, '19:50', 820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1755, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'OSL'; -- 2413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1755, '07:20', 2340), (1755, '09:45', 880), (1755, '14:40', 4910), (1755, '17:05', 90650), (1755, '19:55', 4510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1756, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BGO'; -- 2283 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1756, '06:30', 3430), (1756, '09:15', 1750), (1756, '11:30', 550), (1756, '13:15', 3890), (1756, '16:10', 225270), (1756, '18:45', 2570), (1756, '20:45', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1757, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'TRD'; -- 2725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1757, '07:50', 500), (1757, '10:10', 4090), (1757, '13:05', 2390), (1757, '15:35', 246650), (1757, '17:00', 2710), (1757, '20:30', 600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1758, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'CPH'; -- 2059 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1758, '07:25', 3980), (1758, '10:30', 3800), (1758, '12:40', 4760), (1758, '15:05', 976730), (1758, '18:00', 3240), (1758, '20:10', 220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1759, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'AAL'; -- 2083 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1759, '07:50', 1350), (1759, '09:15', 450), (1759, '13:00', 2670), (1759, '14:55', 1670), (1759, '17:55', 3790), (1759, '20:15', 31030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1760, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'HEL'; -- 2946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1760, '06:50', 1400), (1760, '11:00', 3830), (1760, '14:40', 1980), (1760, '17:00', 3940), (1760, '20:25', 2070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1761, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'KEF'; -- 2890 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1761, '06:30', 3150), (1761, '09:20', 780), (1761, '11:20', 3090), (1761, '13:55', 90020), (1761, '15:20', 98520), (1761, '18:25', 710), (1761, '20:30', 2600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1762, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'TLL'; -- 2882 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1762, '07:20', 260), (1762, '10:15', 400), (1762, '14:30', 2410), (1762, '16:35', 1090), (1762, '19:45', 32240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1763, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'RIX'; -- 2691 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1763, '07:45', 89960), (1763, '09:05', 558170), (1763, '11:30', 4220), (1763, '13:30', 14720), (1763, '16:30', 2580), (1763, '18:05', 4080), (1763, '20:25', 3750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1764, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'LHR'; -- 1244 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1764, '06:55', 4150), (1764, '09:05', 96290), (1764, '11:05', 4030), (1764, '13:50', 59970), (1764, '15:40', 570), (1764, '18:15', 2300), (1764, '20:05', 660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1765, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'MAN'; -- 1433 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1765, '08:00', 2110), (1765, '10:40', 1360), (1765, '13:00', 36680), (1765, '17:40', 2800), (1765, '19:35', 38050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1766, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'EDI'; -- 1719 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1766, '06:50', 4010), (1766, '09:10', 2170), (1766, '11:55', 910), (1766, '15:45', 3560), (1766, '17:15', 2400), (1766, '20:55', 3120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1767, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'DUB'; -- 1453 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1767, '06:45', 4190), (1767, '08:55', 4390), (1767, '11:30', 300400), (1767, '13:15', 1540), (1767, '16:00', 3430), (1767, '18:15', 660), (1767, '20:25', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1768, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'NCE'; -- 957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1768, '07:45', 580), (1768, '10:25', 4520), (1768, '13:40', 4800), (1768, '16:15', 603920), (1768, '19:10', 2740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1769, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'AMS'; -- 1459 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1769, '07:15', 271210), (1769, '09:00', 3990), (1769, '11:30', 4350), (1769, '14:05', 3380), (1769, '15:55', 2770), (1769, '18:30', 470), (1769, '20:25', 86740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1770, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BRU'; -- 1314 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1770, '07:35', 131810), (1770, '10:20', 720250), (1770, '13:00', 230), (1770, '16:25', 4500), (1770, '20:35', 1710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1771, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'FRA'; -- 1421 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1771, '07:10', 1710), (1771, '09:15', 15800), (1771, '11:05', 2980), (1771, '13:20', 3130), (1771, '16:15', 62500), (1771, '18:00', 2110), (1771, '20:00', 7560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1772, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'MUC'; -- 1496 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1772, '07:25', 3850), (1772, '09:30', 1450), (1772, '11:25', 1000), (1772, '13:20', 4280), (1772, '15:40', 4300), (1772, '18:15', 265010), (1772, '20:10', 3050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1773, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BER'; -- 1850 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1773, '07:05', 1080), (1773, '09:45', 1610), (1773, '11:00', 3310), (1773, '13:55', 3540), (1773, '15:25', 4510), (1773, '18:15', 662070), (1773, '20:30', 47160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1774, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'ZRH'; -- 1239 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1774, '07:00', 570), (1774, '09:55', 3260), (1774, '12:20', 310), (1774, '14:30', 4030), (1774, '17:15', 2340), (1774, '20:30', 3670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1775, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'VIE'; -- 1805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1775, '07:35', 4710), (1775, '10:25', 4860), (1775, '12:30', 4950), (1775, '15:10', 4520), (1775, '16:55', 1610), (1775, '20:20', 818470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1776, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'PRG'; -- 1749 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1776, '07:55', 2940), (1776, '10:45', 4170), (1776, '13:55', 1960), (1776, '16:40', 64010), (1776, '19:40', 3010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1777, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'WAW'; -- 2271 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1777, '06:35', 4000), (1777, '09:55', 1120), (1777, '12:20', 744050), (1777, '14:45', 590), (1777, '18:20', 3920), (1777, '20:50', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1778, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BCN'; -- 483 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1778, '07:35', 4810), (1778, '10:00', 4470), (1778, '11:45', 800), (1778, '14:50', 376360), (1778, '17:25', 351640), (1778, '19:35', 1360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1779, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'FCO'; -- 1331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1779, '07:40', 4490), (1779, '09:25', 2340), (1779, '12:15', 1110), (1779, '15:40', 3060), (1779, '17:25', 490), (1779, '19:40', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1780, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'MXP'; -- 1149 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1780, '06:55', 3210), (1780, '08:50', 990), (1780, '12:10', 3320), (1780, '13:55', 94960), (1780, '16:35', 2300), (1780, '18:00', 1430), (1780, '20:40', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1781, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'ATH'; -- 2377 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1781, '07:40', 536720), (1781, '09:35', 4270), (1781, '11:30', 31300), (1781, '14:10', 4610), (1781, '15:40', 44410), (1781, '18:35', 2360), (1781, '19:50', 4610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1782, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'IST'; -- 2702 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1782, '07:25', 2430), (1782, '09:45', 3740), (1782, '13:10', 4370), (1782, '14:50', 1510), (1782, '17:00', 3580), (1782, '20:15', 1540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1783, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'DXB'; -- 5649 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1783, '06:50', 4910), (1783, '11:30', 3430), (1783, '14:20', 1120), (1783, '16:50', 2150), (1783, '19:45', 3540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1784, f.id, t.id, 795 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'BKK'; -- 10193 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1784, '07:30', 2560), (1784, '09:40', 811510), (1784, '12:25', 4030), (1784, '14:55', 450), (1784, '17:25', 3320), (1784, '20:30', 1600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1785, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'JFK'; -- 5761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1785, '06:35', 1890), (1785, '09:30', 170), (1785, '13:10', 4220), (1785, '15:05', 2850), (1785, '18:05', 2440), (1785, '20:55', 35560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1786, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'EWR'; -- 5788 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1786, '06:40', 4930), (1786, '10:40', 2180), (1786, '14:05', 4050), (1786, '16:15', 170), (1786, '20:20', 40320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1787, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'ORD'; -- 6744 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1787, '06:45', 1350), (1787, '09:50', 3790), (1787, '12:25', 4250), (1787, '14:45', 4360), (1787, '18:00', 3230), (1787, '20:05', 480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1788, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'MIA'; -- 7106 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1788, '07:30', 37520), (1788, '09:35', 2220), (1788, '11:50', 4630), (1788, '14:55', 67720), (1788, '18:00', 37840), (1788, '19:30', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1789, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'LAX'; -- 9386 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1789, '07:50', 868590), (1789, '11:10', 1910), (1789, '12:50', 51030), (1789, '16:10', 3350), (1789, '20:45', 1450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1790, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'MAD' AND t.iata = 'YYZ'; -- 6058 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1790, '06:35', 4990), (1790, '08:55', 3370), (1790, '11:55', 4820), (1790, '13:55', 2740), (1790, '15:30', 3210), (1790, '18:20', 2670), (1790, '20:55', 19810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1791, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BMA'; -- 2992 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1791, '07:35', 184960), (1791, '11:30', 510), (1791, '13:10', 2820), (1791, '17:05', 920), (1791, '20:00', 29250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1792, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'GOT'; -- 2641 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1792, '06:55', 360), (1792, '09:25', 3740), (1792, '11:50', 4120), (1792, '14:15', 69400), (1792, '15:55', 4800), (1792, '18:30', 3640), (1792, '20:50', 4790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1793, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MMX'; -- 2494 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1793, '07:20', 2370), (1793, '09:25', 4490), (1793, '11:10', 95270), (1793, '13:45', 54340), (1793, '15:35', 886360), (1793, '17:35', 68460), (1793, '19:50', 26590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1794, f.id, t.id, 305 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'LLA'; -- 3648 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1794, '07:00', 3210), (1794, '08:45', 3920), (1794, '12:00', 1930), (1794, '14:15', 94430), (1794, '16:30', 3570), (1794, '17:50', 3950), (1794, '20:40', 250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1795, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'VBY'; -- 2874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1795, '06:45', 4490), (1795, '10:15', 336770), (1795, '13:20', 4280), (1795, '17:15', 1810), (1795, '19:50', 2980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1796, f.id, t.id, 290 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'UME'; -- 3444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1796, '07:55', 4560), (1796, '09:50', 609610), (1796, '13:05', 4590), (1796, '15:40', 2350), (1796, '17:50', 2160), (1796, '20:40', 65390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1797, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'OSD'; -- 3219 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1797, '06:35', 4340), (1797, '09:15', 810), (1797, '11:55', 489180), (1797, '13:45', 3110), (1797, '15:20', 3210), (1797, '18:10', 2710), (1797, '20:25', 173580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1798, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'KRN'; -- 3795 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1798, '07:10', 4860), (1798, '08:45', 4380), (1798, '11:00', 440940), (1798, '13:10', 533560), (1798, '15:50', 50400), (1798, '18:45', 2320), (1798, '19:45', 210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1799, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'OSL'; -- 2841 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1799, '07:25', 965970), (1799, '09:20', 4090), (1799, '11:20', 219190), (1799, '13:20', 270870), (1799, '16:25', 530), (1799, '18:45', 163570), (1799, '20:45', 1250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1800, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'TRD'; -- 3156 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1800, '06:55', 3860), (1800, '09:10', 1050), (1800, '11:55', 3540), (1800, '14:05', 3100), (1800, '15:40', 3520), (1800, '18:50', 1070), (1800, '19:55', 390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1801, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'CPH'; -- 2472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1801, '07:25', 3950), (1801, '09:30', 762190), (1801, '11:45', 3580), (1801, '14:00', 310), (1801, '16:25', 1510), (1801, '18:20', 2660), (1801, '20:05', 390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1802, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'AAL'; -- 2507 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1802, '06:55', 540), (1802, '09:15', 3850), (1802, '12:00', 139870), (1802, '14:20', 3940), (1802, '17:20', 4450), (1802, '19:40', 3230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1803, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'HEL'; -- 3353 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1803, '06:50', 1960), (1803, '10:40', 1600), (1803, '14:10', 360), (1803, '17:35', 2580), (1803, '19:30', 1220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1804, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'KEF'; -- 3271 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1804, '06:55', 37390), (1804, '10:00', 2440), (1804, '12:00', 1190), (1804, '15:40', 520), (1804, '16:55', 480290), (1804, '20:25', 2260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1805, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'TLL'; -- 3286 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1805, '07:10', 2900), (1805, '10:55', 1290), (1805, '13:45', 320), (1805, '17:05', 1630), (1805, '19:55', 1330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1806, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'RIX'; -- 3082 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1806, '06:55', 85650), (1806, '09:35', 3920), (1806, '12:30', 1010), (1806, '14:20', 54280), (1806, '17:20', 934580), (1806, '20:20', 1930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1807, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'LHR'; -- 1677 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1807, '06:40', 550), (1807, '11:00', 520), (1807, '14:10', 869260), (1807, '16:55', 1100), (1807, '19:10', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1808, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MAN'; -- 1863 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1808, '07:25', 3130), (1808, '10:50', 292040), (1808, '13:05', 91600), (1808, '17:05', 41170), (1808, '19:30', 180930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1809, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'EDI'; -- 2146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1809, '06:50', 2360), (1809, '10:45', 1540), (1809, '13:35', 4500), (1809, '17:35', 2540), (1809, '19:50', 3570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1810, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'DUB'; -- 1869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1810, '06:55', 2180), (1810, '10:20', 2100), (1810, '13:25', 1070), (1810, '17:00', 2400), (1810, '19:35', 88660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1811, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'CDG'; -- 1486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1811, '06:40', 4380), (1811, '08:40', 2940), (1811, '11:25', 2060), (1811, '13:20', 630), (1811, '15:20', 968380), (1811, '18:45', 3260), (1811, '20:45', 1190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1812, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'NCE'; -- 1261 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1812, '06:45', 31800), (1812, '09:35', 2230), (1812, '11:20', 4770), (1812, '13:10', 1130), (1812, '16:00', 2080), (1812, '17:45', 51890), (1812, '20:00', 2820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1813, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'AMS'; -- 1884 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1813, '07:10', 3430), (1813, '09:35', 530), (1813, '11:35', 440), (1813, '13:35', 271940), (1813, '16:25', 670), (1813, '17:55', 4330), (1813, '19:55', 83840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1814, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BRU'; -- 1736 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1814, '07:10', 2720), (1814, '09:30', 2810), (1814, '12:20', 3850), (1814, '14:55', 2220), (1814, '18:15', 4960), (1814, '20:20', 1190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1815, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'FRA'; -- 1817 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1815, '06:40', 3710), (1815, '09:30', 3570), (1815, '12:10', 2740), (1815, '14:50', 710), (1815, '18:20', 4800), (1815, '20:20', 300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1816, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MUC'; -- 1855 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1816, '07:10', 4670), (1816, '10:10', 620), (1816, '13:00', 930), (1816, '16:20', 2170), (1816, '20:30', 1240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1817, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BER'; -- 2242 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1817, '06:55', 1600), (1817, '10:45', 4000), (1817, '13:05', 4620), (1817, '17:45', 372650), (1817, '20:05', 3320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1818, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'ZRH'; -- 1608 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1818, '07:50', 3150), (1818, '09:10', 3570), (1818, '12:45', 79040), (1818, '15:00', 4170), (1818, '18:10', 2950), (1818, '20:35', 3200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1819, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'VIE'; -- 2136 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1819, '07:00', 770), (1819, '09:55', 90990), (1819, '11:35', 2270), (1819, '14:00', 36420), (1819, '16:00', 3060), (1819, '18:20', 67680), (1819, '20:55', 2530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1820, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'PRG'; -- 2117 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1820, '07:20', 950), (1820, '11:05', 3820), (1820, '13:00', 2670), (1820, '17:10', 739230), (1820, '19:40', 243730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1821, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'WAW'; -- 2633 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1821, '08:00', 550), (1821, '10:20', 331820), (1821, '13:10', 2340), (1821, '16:50', 794650), (1821, '20:20', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1822, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BCN'; -- 767 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1822, '07:15', 4230), (1822, '10:35', 760390), (1822, '12:40', 19910), (1822, '14:50', 2360), (1822, '17:40', 2560), (1822, '20:30', 1760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1823, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'PMI'; -- 709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1823, '06:55', 3140), (1823, '09:45', 280060), (1823, '10:55', 4450), (1823, '13:30', 1940), (1823, '16:00', 42380), (1823, '17:45', 310), (1823, '20:35', 90700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1824, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'LPA'; -- 1410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1824, '07:55', 4840), (1824, '10:25', 1090), (1824, '13:30', 3920), (1824, '17:10', 2970), (1824, '20:50', 2080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1825, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'LIS'; -- 469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1825, '07:15', 152190), (1825, '09:45', 292680), (1825, '11:15', 3550), (1825, '13:35', 1000), (1825, '15:35', 101630), (1825, '18:10', 740), (1825, '19:45', 283300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1826, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'FCO'; -- 1548 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1826, '07:50', 200), (1826, '10:30', 3910), (1826, '13:10', 756700), (1826, '15:35', 87010), (1826, '18:10', 900), (1826, '20:05', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1827, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MXP'; -- 1486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1827, '06:50', 2000), (1827, '10:20', 3320), (1827, '13:05', 18390), (1827, '14:25', 716130), (1827, '17:10', 624670), (1827, '19:30', 790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1828, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'ATH'; -- 2510 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1828, '07:45', 4380), (1828, '10:00', 4160), (1828, '13:15', 4780), (1828, '17:45', 53570), (1828, '19:20', 1640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1829, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'IST'; -- 2901 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1829, '06:55', 270), (1829, '08:55', 47680), (1829, '12:00', 3120), (1829, '13:30', 2720), (1829, '15:30', 1520), (1829, '18:30', 1410), (1829, '20:00', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1830, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'DXB'; -- 5755 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1830, '06:55', 3760), (1830, '10:05', 3380), (1830, '12:20', 2250), (1830, '14:25', 518580), (1830, '18:20', 3510), (1830, '19:30', 4820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1831, f.id, t.id, 810 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'BKK'; -- 10413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1831, '06:40', 4660), (1831, '10:00', 4070), (1831, '12:50', 638140), (1831, '17:25', 1790), (1831, '19:55', 2660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1832, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'JFK'; -- 5873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1832, '06:50', 220), (1832, '09:15', 1390), (1832, '11:55', 1780), (1832, '13:10', 2440), (1832, '16:30', 3290), (1832, '17:55', 1490), (1832, '20:40', 3450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1833, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'EWR'; -- 5903 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1833, '06:30', 340), (1833, '09:45', 4610), (1833, '11:45', 3290), (1833, '13:35', 4640), (1833, '15:20', 1000), (1833, '17:40', 4990), (1833, '21:00', 4910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1834, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'ORD'; -- 6905 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1834, '07:00', 3760), (1834, '10:35', 2240), (1834, '12:10', 4520), (1834, '14:40', 4610), (1834, '17:55', 951510), (1834, '19:30', 2490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1835, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'MIA'; -- 7125 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1835, '06:35', 510), (1835, '09:00', 4800), (1835, '11:50', 2450), (1835, '13:10', 4240), (1835, '15:40', 521530), (1835, '18:20', 1670), (1835, '19:50', 490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1836, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'LAX'; -- 9601 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1836, '06:40', 4620), (1836, '10:20', 490800), (1836, '14:25', 873540), (1836, '17:25', 290), (1836, '19:25', 850300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1837, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'AGP' AND t.iata = 'YYZ'; -- 6211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1837, '07:35', 2250), (1837, '09:55', 1690), (1837, '13:35', 180), (1837, '17:45', 2700), (1837, '20:00', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1838, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'ARN'; -- 2475 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1838, '07:20', 2310), (1838, '09:40', 948480), (1838, '11:05', 182870), (1838, '13:10', 1340), (1838, '15:55', 570), (1838, '18:20', 62240), (1838, '21:00', 3830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1839, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BMA'; -- 2447 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1839, '06:40', 240), (1839, '10:35', 400), (1839, '11:55', 1230), (1839, '15:00', 3880), (1839, '18:05', 3780), (1839, '20:35', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1840, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'GOT'; -- 2129 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1840, '07:15', 1920), (1840, '09:50', 378450), (1840, '11:55', 90540), (1840, '13:55', 4980), (1840, '15:30', 2440), (1840, '18:10', 4660), (1840, '20:00', 744270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1841, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MMX'; -- 1944 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1841, '07:10', 200), (1841, '11:25', 57960), (1841, '14:00', 3240), (1841, '16:30', 4760), (1841, '19:25', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1842, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'VBY'; -- 2305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1842, '07:20', 4480), (1842, '09:35', 250), (1842, '11:05', 4920), (1842, '14:00', 2010), (1842, '15:45', 413700), (1842, '17:50', 90650), (1842, '21:00', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1843, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'UME'; -- 2931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1843, '07:40', 40900), (1843, '09:10', 1120), (1843, '12:30', 1970), (1843, '14:25', 537660), (1843, '17:20', 45410), (1843, '19:35', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1844, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'OSD'; -- 2742 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1844, '08:25', 4720), (1844, '10:45', 4650), (1844, '13:40', 1870), (1844, '17:20', 740), (1844, '20:50', 498720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1845, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'KRN'; -- 3322 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1845, '07:40', 2780), (1845, '10:15', 1140), (1845, '11:50', 1370), (1845, '15:25', 870), (1845, '17:05', 4180), (1845, '20:30', 26820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1846, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'OSL'; -- 2368 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1846, '07:25', 2790), (1846, '09:50', 2290), (1846, '12:10', 4280), (1846, '14:10', 2200), (1846, '16:15', 3240), (1846, '17:50', 84810), (1846, '20:10', 1140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1847, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BGO'; -- 2313 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1847, '07:00', 711170), (1847, '09:15', 1910), (1847, '13:10', 2430), (1847, '14:55', 49950), (1847, '17:40', 2000), (1847, '20:15', 3570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1848, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'TRD'; -- 2713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1848, '06:30', 1620), (1848, '08:45', 4760), (1848, '10:55', 37920), (1848, '14:10', 3520), (1848, '15:40', 64940), (1848, '17:50', 4360), (1848, '19:45', 24130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1849, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'CPH'; -- 1931 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1849, '06:50', 2780), (1849, '09:00', 4540), (1849, '11:25', 2240), (1849, '13:20', 1450), (1849, '15:20', 4410), (1849, '17:35', 450), (1849, '20:25', 440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1850, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'AAL'; -- 2017 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1850, '07:40', 4580), (1850, '09:20', 151630), (1850, '11:55', 3050), (1850, '14:10', 377800), (1850, '15:25', 450), (1850, '18:30', 6020), (1850, '20:30', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1851, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'HEL'; -- 2775 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1851, '06:40', 3050), (1851, '10:25', 942700), (1851, '13:35', 1300), (1851, '16:10', 2430), (1851, '20:25', 805630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1852, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'KEF'; -- 3181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1852, '07:30', 22890), (1852, '09:40', 1780), (1852, '12:15', 820), (1852, '15:10', 3400), (1852, '17:05', 2040), (1852, '20:15', 4190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1853, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'TLL'; -- 2697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1853, '07:05', 310), (1853, '10:25', 3710), (1853, '11:55', 19880), (1853, '15:20', 949230), (1853, '18:15', 250), (1853, '20:30', 4390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1854, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'RIX'; -- 2469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1854, '07:45', 3790), (1854, '09:35', 4590), (1854, '11:35', 710), (1854, '13:35', 2040), (1854, '15:30', 3180), (1854, '18:45', 84900), (1854, '20:40', 1010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1855, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'LHR'; -- 1348 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1855, '07:40', 4560), (1855, '11:25', 330), (1855, '14:35', 4360), (1855, '17:20', 3530), (1855, '20:40', 458600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1856, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MAN'; -- 1581 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1856, '08:00', 3110), (1856, '10:15', 4460), (1856, '12:50', 2230), (1856, '17:20', 1770), (1856, '20:20', 2010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1857, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'EDI'; -- 1878 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1857, '07:25', 2370), (1857, '09:20', 275290), (1857, '11:55', 4200), (1857, '13:20', 1180), (1857, '16:10', 4610), (1857, '18:15', 450), (1857, '20:30', 3490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1858, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'DUB'; -- 1687 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1858, '07:35', 2370), (1858, '09:45', 6150), (1858, '12:00', 2330), (1858, '14:20', 600), (1858, '18:15', 4820), (1858, '19:55', 4230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1859, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'CDG'; -- 1052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1859, '07:40', 1140), (1859, '10:40', 3690), (1859, '14:25', 810), (1859, '17:30', 1890), (1859, '20:10', 73420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1860, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'NCE'; -- 589 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1860, '07:05', 2110), (1860, '10:45', 3740), (1860, '12:55', 84070), (1860, '17:15', 200), (1860, '19:35', 653070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1861, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'AMS'; -- 1427 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1861, '07:35', 1380), (1861, '09:00', 500), (1861, '11:15', 2390), (1861, '13:55', 3740), (1861, '15:35', 514920), (1861, '18:35', 3060), (1861, '20:15', 3080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1862, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BRU'; -- 1269 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1862, '07:15', 3320), (1862, '09:20', 2350), (1862, '12:05', 2660), (1862, '14:40', 1660), (1862, '18:05', 711490), (1862, '19:45', 47790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1863, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'FRA'; -- 1252 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1863, '06:55', 253100), (1863, '11:15', 1510), (1863, '13:25', 2310), (1863, '16:50', 750), (1863, '20:15', 210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1864, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MUC'; -- 1216 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1864, '06:55', 1960), (1864, '10:00', 69580), (1864, '12:20', 1430), (1864, '14:35', 850), (1864, '17:50', 3680), (1864, '20:25', 42370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1865, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BER'; -- 1646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1865, '08:20', 4760), (1865, '10:55', 1550), (1865, '13:40', 260910), (1865, '16:30', 300), (1865, '19:30', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1866, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'ZRH'; -- 996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1866, '06:45', 810), (1866, '10:30', 430), (1866, '12:50', 1790), (1866, '16:30', 3570), (1866, '20:40', 843510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1867, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'VIE'; -- 1458 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1867, '07:20', 3290), (1867, '09:35', 3340), (1867, '12:55', 2510), (1867, '14:55', 422300), (1867, '17:45', 4140), (1867, '20:30', 14590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1868, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'PRG'; -- 1480 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1868, '06:45', 640), (1868, '10:30', 680), (1868, '12:55', 3040), (1868, '14:25', 2650), (1868, '17:30', 118940), (1868, '20:30', 2680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1869, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'WAW'; -- 1980 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1869, '06:50', 950), (1869, '09:50', 510), (1869, '11:55', 4640), (1869, '14:20', 590), (1869, '15:35', 2600), (1869, '18:15', 3340), (1869, '20:35', 3580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1870, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BCN'; -- 202 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1870, '06:40', 2550), (1870, '10:15', 4580), (1870, '11:45', 629940), (1870, '14:35', 3770), (1870, '16:55', 2660), (1870, '20:00', 2960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1871, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'AGP'; -- 709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1871, '07:45', 3390), (1871, '10:55', 1140), (1871, '14:25', 630), (1871, '16:45', 373850), (1871, '19:05', 4530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1872, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'LPA'; -- 2109 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1872, '06:35', 1450), (1872, '09:45', 4330), (1872, '12:55', 3080), (1872, '15:35', 1940), (1872, '18:00', 4270), (1872, '19:50', 2420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1873, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'LIS'; -- 1026 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1873, '07:10', 3770), (1873, '09:10', 756290), (1873, '12:10', 4870), (1873, '15:45', 2810), (1873, '17:05', 3320), (1873, '20:25', 700280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1874, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'FCO'; -- 840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1874, '07:30', 2500), (1874, '09:55', 4120), (1874, '12:45', 4680), (1874, '15:20', 3890), (1874, '17:45', 3710), (1874, '19:50', 37080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1875, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MXP'; -- 834 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1875, '07:45', 940), (1875, '09:50', 4650), (1875, '11:55', 1850), (1875, '14:05', 3090), (1875, '15:20', 4960), (1875, '18:30', 4470), (1875, '20:15', 2420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1876, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'ATH'; -- 1843 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1876, '07:30', 2500), (1876, '09:30', 526680), (1876, '11:05', 4900), (1876, '14:00', 930), (1876, '15:35', 3650), (1876, '18:00', 2250), (1876, '20:35', 2530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1877, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'IST'; -- 2201 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1877, '06:55', 4770), (1877, '11:25', 2020), (1877, '14:05', 1880), (1877, '16:25', 61150), (1877, '19:25', 84730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1878, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'DXB'; -- 5112 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1878, '07:30', 350), (1878, '10:25', 2310), (1878, '12:25', 2910), (1878, '15:45', 631040), (1878, '17:30', 910), (1878, '20:50', 2810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1879, f.id, t.id, 760 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'BKK'; -- 9712 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1879, '08:00', 1650), (1879, '10:05', 4570), (1879, '12:20', 300), (1879, '15:10', 34940), (1879, '16:55', 1920), (1879, '19:45', 750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1880, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'JFK'; -- 6289 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1880, '07:15', 780), (1880, '09:40', 2170), (1880, '12:15', 280), (1880, '14:45', 1510), (1880, '18:10', 400020), (1880, '20:35', 35670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1881, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'EWR'; -- 6316 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1881, '07:00', 3250), (1881, '09:55', 460), (1881, '12:20', 3110), (1881, '14:30', 445560), (1881, '18:10', 4340), (1881, '20:25', 34460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1882, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'ORD'; -- 7250 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1882, '07:05', 3410), (1882, '09:35', 2780), (1882, '12:55', 1270), (1882, '14:30', 4790), (1882, '18:15', 4730), (1882, '20:25', 520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1883, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'MIA'; -- 7653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1883, '07:50', 1520), (1883, '10:55', 1210), (1883, '13:55', 1610), (1883, '17:10', 53200), (1883, '20:10', 570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1884, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'LAX'; -- 9851 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1884, '07:55', 65380), (1884, '10:25', 643330), (1884, '11:50', 3820), (1884, '14:40', 4710), (1884, '17:50', 320), (1884, '19:45', 4540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1885, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'PMI' AND t.iata = 'YYZ'; -- 6570 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1885, '06:30', 233100), (1885, '09:05', 4090), (1885, '11:25', 2220), (1885, '14:15', 2240), (1885, '16:15', 1560), (1885, '17:45', 3730), (1885, '20:25', 2170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1886, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'ARN'; -- 4335 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1886, '06:30', 1500), (1886, '09:00', 70440), (1886, '11:40', 4720), (1886, '13:55', 1100), (1886, '15:45', 36120), (1886, '17:50', 834310), (1886, '20:25', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1887, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BMA'; -- 4315 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1887, '07:35', 1240), (1887, '11:30', 4160), (1887, '14:30', 1680), (1887, '17:05', 3650), (1887, '19:30', 4630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1888, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'GOT'; -- 3946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1888, '06:35', 329460), (1888, '09:30', 4870), (1888, '11:15', 2420), (1888, '13:10', 4540), (1888, '16:00', 3380), (1888, '17:35', 3830), (1888, '19:55', 6220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1889, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MMX'; -- 3833 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1889, '07:10', 119540), (1889, '11:20', 4340), (1889, '13:35', 320), (1889, '16:40', 3630), (1889, '19:35', 2990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1890, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'LLA'; -- 4918 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1890, '07:45', 630), (1890, '09:00', 87540), (1890, '11:40', 70320), (1890, '13:30', 230), (1890, '16:10', 2540), (1890, '17:35', 260), (1890, '20:20', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1891, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'VBY'; -- 4218 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1891, '07:35', 4450), (1891, '09:25', 3180), (1891, '13:00', 4200), (1891, '15:25', 670), (1891, '17:45', 1450), (1891, '20:10', 280380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1892, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'UME'; -- 4726 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1892, '06:50', 430), (1892, '10:05', 2670), (1892, '12:35', 3940), (1892, '15:25', 32730), (1892, '17:05', 3740), (1892, '20:30', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1893, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'OSD'; -- 4473 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1893, '07:20', 378590), (1893, '10:35', 1100), (1893, '12:15', 3660), (1893, '15:45', 356050), (1893, '18:00', 2970), (1893, '20:35', 2750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1894, f.id, t.id, 405 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'KRN'; -- 5027 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1894, '08:05', 3830), (1894, '11:25', 3010), (1894, '13:40', 86400), (1894, '16:00', 350), (1894, '20:00', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1895, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'OSL'; -- 4105 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1895, '08:00', 4900), (1895, '11:25', 2640), (1895, '13:25', 439250), (1895, '16:30', 650), (1895, '19:45', 2790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1896, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BGO'; -- 3919 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1896, '07:20', 1240), (1896, '09:50', 460), (1896, '13:30', 2760), (1896, '17:15', 260), (1896, '20:50', 87830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1897, f.id, t.id, 360 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'TRD'; -- 4379 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1897, '07:05', 35550), (1897, '09:00', 4920), (1897, '11:40', 1710), (1897, '14:15', 813500), (1897, '16:20', 160), (1897, '18:45', 43440), (1897, '20:00', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1898, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'CPH'; -- 3805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1898, '07:15', 2780), (1898, '09:20', 1580), (1898, '12:00', 3420), (1898, '14:15', 3000), (1898, '15:40', 34870), (1898, '18:05', 790), (1898, '20:30', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1899, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'AAL'; -- 3799 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1899, '07:50', 720), (1899, '11:25', 3420), (1899, '14:40', 1170), (1899, '17:00', 2840), (1899, '20:35', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1900, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'HEL'; -- 4697 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1900, '06:45', 1680), (1900, '08:55', 1030), (1900, '11:50', 2100), (1900, '13:30', 335790), (1900, '15:25', 9330), (1900, '18:35', 4460), (1900, '20:00', 4190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1901, f.id, t.id, 335 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'KEF'; -- 4042 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1901, '06:50', 3280), (1901, '09:35', 2690), (1901, '11:40', 25950), (1901, '13:25', 159160), (1901, '16:35', 970), (1901, '18:50', 650), (1901, '20:30', 3660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1902, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'TLL'; -- 4638 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1902, '06:45', 4920), (1902, '09:30', 4050), (1902, '13:00', 3540), (1902, '15:25', 1070), (1902, '17:15', 1320), (1902, '19:35', 1640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1903, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'RIX'; -- 4455 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1903, '07:00', 4850), (1903, '10:15', 4180), (1903, '12:00', 2360), (1903, '15:40', 3250), (1903, '17:45', 880), (1903, '20:30', 420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1904, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'LHR'; -- 2900 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1904, '08:15', 520), (1904, '10:15', 4450), (1904, '12:55', 4710), (1904, '16:50', 20010), (1904, '19:20', 3980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1905, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MAN'; -- 3024 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1905, '06:50', 3520), (1905, '11:05', 4790), (1905, '13:40', 970), (1905, '16:15', 2540), (1905, '19:05', 2370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1906, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'EDI'; -- 3260 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1906, '07:20', 470), (1906, '10:30', 3370), (1906, '11:50', 4780), (1906, '15:30', 4160), (1906, '17:10', 3930), (1906, '20:10', 2070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1907, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'DUB'; -- 2933 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1907, '07:30', 1470), (1907, '10:10', 1510), (1907, '12:20', 3540), (1907, '15:35', 2890), (1907, '16:55', 1770), (1907, '20:45', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1908, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'CDG'; -- 2801 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1908, '06:50', 4840), (1908, '09:50', 280), (1908, '11:55', 1860), (1908, '13:40', 1470), (1908, '16:30', 3580), (1908, '18:15', 590), (1908, '21:00', 334200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1909, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'NCE'; -- 2671 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1909, '07:30', 905450), (1909, '11:10', 2380), (1909, '12:50', 3850), (1909, '17:40', 48660), (1909, '20:20', 2050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1910, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BRU'; -- 3051 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1910, '07:35', 1580), (1910, '08:55', 2890), (1910, '11:20', 52450), (1910, '13:45', 273770), (1910, '15:50', 643240), (1910, '18:20', 4200), (1910, '20:15', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1911, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'FRA'; -- 3185 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1911, '07:10', 3330), (1911, '10:00', 805910), (1911, '12:55', 4880), (1911, '14:25', 4060), (1911, '17:20', 3400), (1911, '20:25', 680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1912, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MUC'; -- 3255 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1912, '07:35', 1290), (1912, '09:10', 299510), (1912, '13:10', 719760), (1912, '14:40', 2940), (1912, '17:55', 87520), (1912, '19:35', 250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1913, f.id, t.id, 300 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BER'; -- 3615 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1913, '06:40', 2880), (1913, '09:20', 970), (1913, '11:10', 3060), (1913, '14:15', 4430), (1913, '16:35', 59460), (1913, '18:15', 920), (1913, '20:35', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1914, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'ZRH'; -- 3001 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1914, '07:50', 1440), (1914, '09:25', 321340), (1914, '11:45', 3690), (1914, '14:30', 287540), (1914, '18:05', 67340), (1914, '20:35', 4080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1915, f.id, t.id, 295 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'VIE'; -- 3544 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1915, '07:20', 628640), (1915, '09:35', 17080), (1915, '12:45', 2530), (1915, '15:45', 1250), (1915, '17:10', 390), (1915, '20:45', 2590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1916, f.id, t.id, 295 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'PRG'; -- 3512 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1916, '07:35', 4620), (1916, '10:20', 1970), (1916, '12:25', 53890), (1916, '14:25', 3120), (1916, '18:10', 2190), (1916, '19:50', 264590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1917, f.id, t.id, 330 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'WAW'; -- 4032 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1917, '06:30', 416350), (1917, '09:35', 460), (1917, '12:00', 3270), (1917, '13:40', 280410), (1917, '16:30', 4190), (1917, '17:55', 3650), (1917, '20:15', 4910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1918, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BCN'; -- 2175 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1918, '07:35', 7550), (1918, '09:10', 2120), (1918, '11:20', 3010), (1918, '14:10', 1700), (1918, '15:35', 1210), (1918, '17:50', 3310), (1918, '20:05', 1230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1919, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'AGP'; -- 1410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1919, '06:40', 2030), (1919, '09:30', 390), (1919, '13:10', 2280), (1919, '15:40', 160), (1919, '17:55', 2890), (1919, '20:25', 4210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1920, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'PMI'; -- 2109 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1920, '07:15', 3190), (1920, '09:15', 2600), (1920, '12:05', 466690), (1920, '14:05', 1220), (1920, '15:55', 4820), (1920, '17:35', 1080), (1920, '19:55', 3160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1921, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'LIS'; -- 1337 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1921, '07:00', 4220), (1921, '10:50', 170), (1921, '13:50', 4030), (1921, '17:00', 2970), (1921, '20:50', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1922, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'FCO'; -- 2936 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1922, '07:00', 2800), (1922, '09:20', 3110), (1922, '13:00', 3480), (1922, '15:25', 1720), (1922, '17:00', 560), (1922, '20:55', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1923, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MXP'; -- 2892 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1923, '06:50', 231180), (1923, '09:40', 3200), (1923, '12:50', 636680), (1923, '14:55', 1170), (1923, '16:55', 2620), (1923, '19:45', 3060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1924, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'ATH'; -- 3804 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1924, '06:35', 4380), (1924, '10:30', 849090), (1924, '11:50', 1480), (1924, '14:50', 4520), (1924, '17:40', 3200), (1924, '19:35', 870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1925, f.id, t.id, 350 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'IST'; -- 4250 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1925, '06:50', 1000), (1925, '11:30', 3050), (1925, '13:40', 2440), (1925, '17:35', 1890), (1925, '19:30', 4110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1926, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'DXB'; -- 6939 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1926, '06:45', 1330), (1926, '09:45', 2150), (1926, '12:00', 2830), (1926, '13:20', 1930), (1926, '15:25', 676540), (1926, '18:00', 3900), (1926, '20:30', 719120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1927, f.id, t.id, 910 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'BKK'; -- 11732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1927, '07:00', 1770), (1927, '08:55', 385100), (1927, '11:05', 330), (1927, '13:45', 3260), (1927, '15:40', 500), (1927, '18:25', 1280), (1927, '21:00', 75010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1928, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'JFK'; -- 5445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1928, '07:50', 3350), (1928, '09:10', 2700), (1928, '13:00', 89940), (1928, '15:15', 19270), (1928, '17:20', 1290), (1928, '20:10', 2930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1929, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'EWR'; -- 5478 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1929, '07:55', 2470), (1929, '09:40', 3430), (1929, '12:05', 1540), (1929, '15:40', 54050), (1929, '18:15', 2200), (1929, '20:00', 620620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1930, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'ORD'; -- 6593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1930, '06:50', 3590), (1930, '10:25', 770), (1930, '11:45', 2460), (1930, '14:25', 4510), (1930, '18:15', 3740), (1930, '20:00', 3520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1931, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'MIA'; -- 6364 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1931, '07:50', 332100), (1931, '10:25', 2600), (1931, '12:40', 392990), (1931, '14:55', 3070), (1931, '18:00', 940), (1931, '20:10', 2930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1932, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'LAX'; -- 9393 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1932, '07:20', 4330), (1932, '08:40', 630), (1932, '12:10', 93090), (1932, '13:10', 3390), (1932, '16:30', 180), (1932, '18:45', 4660), (1932, '20:05', 4130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1933, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'LPA' AND t.iata = 'YYZ'; -- 5898 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1933, '07:15', 1810), (1933, '09:35', 1780), (1933, '11:25', 3500), (1933, '13:10', 220), (1933, '15:20', 4640), (1933, '18:15', 1140), (1933, '20:55', 2940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1934, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'ARN'; -- 2999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1934, '07:15', 3550), (1934, '09:35', 1570), (1934, '12:35', 4200), (1934, '15:30', 3160), (1934, '18:15', 4040), (1934, '20:35', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1935, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BMA'; -- 2979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1935, '07:15', 2540), (1935, '09:50', 5030), (1935, '11:50', 4530), (1935, '13:10', 22240), (1935, '16:35', 2270), (1935, '18:40', 2730), (1935, '20:10', 3560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1936, f.id, t.id, 300 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'LLA'; -- 3583 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1936, '07:00', 4910), (1936, '11:05', 1700), (1936, '14:40', 2810), (1936, '17:40', 811700), (1936, '19:30', 31440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1937, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'VBY'; -- 2887 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1937, '07:30', 3590), (1937, '09:40', 1510), (1937, '11:50', 640), (1937, '13:45', 48020), (1937, '15:50', 960), (1937, '18:35', 1990), (1937, '19:50', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1938, f.id, t.id, 285 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'UME'; -- 3390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1938, '08:05', 24440), (1938, '11:05', 650), (1938, '13:45', 3650), (1938, '16:45', 280), (1938, '19:20', 57110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1939, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'OSD'; -- 3139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1939, '07:05', 750410), (1939, '09:10', 480), (1939, '11:30', 4990), (1939, '14:00', 22880), (1939, '16:05', 66380), (1939, '17:50', 1060), (1939, '21:00', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1940, f.id, t.id, 305 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'KRN'; -- 3699 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1940, '06:50', 810), (1940, '10:10', 3120), (1940, '13:10', 2610), (1940, '15:40', 180), (1940, '18:10', 1800), (1940, '19:50', 561960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1941, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'OSL'; -- 2769 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1941, '07:35', 21720), (1941, '11:25', 1730), (1941, '14:05', 360), (1941, '17:35', 37720), (1941, '19:20', 1010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1942, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BGO'; -- 2594 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1942, '06:40', 690), (1942, '08:55', 2190), (1942, '11:15', 83840), (1942, '13:10', 2770), (1942, '15:30', 580), (1942, '18:20', 1210), (1942, '21:00', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1943, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'TRD'; -- 3052 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1943, '07:00', 860), (1943, '11:05', 3160), (1943, '14:30', 4870), (1943, '17:30', 2270), (1943, '19:35', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1944, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'CPH'; -- 2472 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1944, '06:40', 2080), (1944, '09:35', 4450), (1944, '11:05', 4680), (1944, '13:20', 1840), (1944, '16:25', 2060), (1944, '17:50', 2100), (1944, '20:25', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1945, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'AAL'; -- 2462 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1945, '07:30', 2810), (1945, '10:25', 4620), (1945, '13:40', 72810), (1945, '17:30', 4330), (1945, '20:50', 90920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1946, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'HEL'; -- 3365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1946, '06:45', 4240), (1946, '10:30', 2120), (1946, '13:10', 4360), (1946, '17:25', 3220), (1946, '19:45', 2140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1947, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'KEF'; -- 2941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1947, '07:40', 749180), (1947, '10:00', 3060), (1947, '13:15', 3940), (1947, '16:00', 1020), (1947, '19:30', 90510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1948, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'TLL'; -- 3309 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1948, '07:45', 2160), (1948, '11:30', 3890), (1948, '14:30', 2960), (1948, '16:05', 4880), (1948, '19:10', 694250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1949, f.id, t.id, 265 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'RIX'; -- 3137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1949, '07:00', 2200), (1949, '09:45', 2450), (1949, '14:40', 210), (1949, '17:40', 3810), (1949, '20:15', 2690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1950, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'LHR'; -- 1565 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1950, '06:40', 2120), (1950, '09:45', 512710), (1950, '11:45', 2590), (1950, '14:55', 4620), (1950, '17:45', 2240), (1950, '20:00', 1870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1951, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MAN'; -- 1703 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1951, '06:55', 2310), (1951, '10:10', 4440), (1951, '12:30', 998240), (1951, '14:20', 800), (1951, '16:55', 2630), (1951, '20:40', 360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1952, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'EDI'; -- 1957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1952, '07:40', 1940), (1952, '09:10', 4850), (1952, '12:10', 690630), (1952, '14:20', 4640), (1952, '17:15', 4570), (1952, '20:10', 665180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1953, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'DUB'; -- 1645 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1953, '08:20', 561620), (1953, '10:05', 3030), (1953, '14:05', 37600), (1953, '17:30', 3670), (1953, '20:25', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1954, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'CDG'; -- 1470 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1954, '06:40', 76390), (1954, '09:20', 4150), (1954, '11:35', 2280), (1954, '13:40', 1410), (1954, '15:35', 53290), (1954, '17:40', 17540), (1954, '20:35', 92070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1955, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'NCE'; -- 1469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1955, '07:25', 1570), (1955, '10:30', 75370), (1955, '12:00', 1680), (1955, '15:25', 2940), (1955, '17:45', 466030), (1955, '19:50', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1956, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'AMS'; -- 1847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1956, '07:40', 1920), (1956, '09:45', 1880), (1956, '11:45', 1760), (1956, '15:10', 532620), (1956, '18:00', 1930), (1956, '19:40', 67440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1957, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BRU'; -- 1718 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1957, '07:40', 490), (1957, '11:30', 1820), (1957, '13:35', 530), (1957, '16:10', 540), (1957, '19:50', 857120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1958, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MUC'; -- 1984 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1958, '06:50', 59010), (1958, '10:20', 3270), (1958, '13:10', 4850), (1958, '17:05', 160), (1958, '20:40', 4910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1959, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BER'; -- 2304 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1959, '07:55', 600), (1959, '11:00', 698960), (1959, '13:25', 1820), (1959, '17:40', 570), (1959, '20:50', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1960, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'ZRH'; -- 1724 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1960, '07:15', 3820), (1960, '11:25', 4300), (1960, '14:00', 2240), (1960, '16:20', 2030), (1960, '19:45', 94280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1961, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'VIE'; -- 2305 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1961, '07:30', 2920), (1961, '09:50', 688800), (1961, '12:05', 3860), (1961, '13:50', 4180), (1961, '16:20', 2720), (1961, '18:40', 6200), (1961, '20:25', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1962, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'PRG'; -- 2229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1962, '07:00', 68140), (1962, '09:20', 3130), (1962, '11:05', 4960), (1962, '13:40', 450), (1962, '16:35', 1450), (1962, '18:45', 2220), (1962, '20:30', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1963, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'WAW'; -- 2750 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1963, '07:10', 4510), (1963, '10:30', 2250), (1963, '13:40', 2310), (1963, '17:30', 8670), (1963, '19:30', 4020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1964, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BCN'; -- 994 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1964, '07:20', 550), (1964, '09:30', 1210), (1964, '11:35', 280), (1964, '14:10', 730), (1964, '15:40', 3080), (1964, '17:45', 1270), (1964, '20:00', 870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1965, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'AGP'; -- 469 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1965, '06:40', 4970), (1965, '08:45', 272680), (1965, '12:05', 4480), (1965, '13:10', 58480), (1965, '16:10', 3380), (1965, '17:40', 3160), (1965, '20:00', 4470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1966, f.id, t.id, 105 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'PMI'; -- 1026 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1966, '07:20', 2510), (1966, '10:00', 959010), (1966, '12:00', 4450), (1966, '15:45', 446580), (1966, '18:05', 3500), (1966, '20:40', 1670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1967, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'LPA'; -- 1337 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1967, '07:25', 2080), (1967, '11:20', 2820), (1967, '12:55', 949380), (1967, '17:45', 1300), (1967, '20:10', 500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1968, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'FCO'; -- 1840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1968, '08:10', 350), (1968, '10:50', 2380), (1968, '14:15', 1930), (1968, '17:30', 3490), (1968, '19:50', 1410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1969, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MXP'; -- 1651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1969, '07:20', 3170), (1969, '08:45', 88450), (1969, '11:50', 290), (1969, '13:20', 4860), (1969, '16:35', 3230), (1969, '18:00', 2090), (1969, '20:00', 20060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1970, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'ATH'; -- 2869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1970, '07:05', 53900), (1970, '09:45', 83790), (1970, '13:05', 2740), (1970, '15:15', 810), (1970, '17:40', 2090), (1970, '19:50', 1710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1971, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'IST'; -- 3211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1971, '07:00', 3240), (1971, '11:15', 2000), (1971, '13:50', 3110), (1971, '16:30', 83760), (1971, '19:10', 2880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1972, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'DXB'; -- 6137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1972, '07:00', 1990), (1972, '11:10', 430), (1972, '13:55', 7200), (1972, '16:10', 4290), (1972, '20:20', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1973, f.id, t.id, 835 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'BKK'; -- 10706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1973, '08:00', 2990), (1973, '09:10', 3790), (1973, '12:00', 850), (1973, '14:30', 1650), (1973, '17:50', 4900), (1973, '20:55', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1974, f.id, t.id, 435 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'JFK'; -- 5405 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1974, '07:15', 1710), (1974, '09:20', 2640), (1974, '11:50', 4320), (1974, '13:20', 311530), (1974, '16:00', 970240), (1974, '18:50', 3670), (1974, '20:10', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1975, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'EWR'; -- 5434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1975, '07:30', 4150), (1975, '09:10', 1510), (1975, '11:40', 720), (1975, '14:00', 59990), (1975, '16:00', 1620), (1975, '18:00', 971840), (1975, '19:50', 916430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1976, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'ORD'; -- 6436 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1976, '07:55', 2090), (1976, '11:05', 1100), (1976, '13:40', 2790), (1976, '16:10', 48980), (1976, '20:30', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1977, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'MIA'; -- 6678 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1977, '07:05', 4200), (1977, '09:35', 4610), (1977, '11:15', 1440), (1977, '13:30', 5980), (1977, '16:05', 1330), (1977, '18:25', 480), (1977, '20:05', 2770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1978, f.id, t.id, 715 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'LAX'; -- 9138 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1978, '07:50', 95660), (1978, '11:15', 4780), (1978, '13:30', 2130), (1978, '16:05', 290), (1978, '19:05', 330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1979, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'LIS' AND t.iata = 'YYZ'; -- 5741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1979, '06:45', 4830), (1979, '09:10', 2210), (1979, '11:05', 4940), (1979, '13:35', 1560), (1979, '16:30', 950), (1979, '18:10', 2260), (1979, '20:25', 2910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1980, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BMA'; -- 1991 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1980, '07:00', 4690), (1980, '11:30', 3250), (1980, '13:00', 4360), (1980, '17:05', 1970), (1980, '20:30', 420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1981, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'GOT'; -- 1765 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1981, '07:00', 2640), (1981, '10:00', 4780), (1981, '13:40', 2020), (1981, '17:40', 614770), (1981, '20:45', 4140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1982, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MMX'; -- 1530 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1982, '06:30', 2690), (1982, '08:55', 1860), (1982, '11:10', 2080), (1982, '14:15', 2150), (1982, '16:20', 81700), (1982, '18:10', 1580), (1982, '20:40', 3090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1983, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'LLA'; -- 2711 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1983, '06:30', 3780), (1983, '09:35', 3200), (1983, '12:10', 1270), (1983, '13:30', 4960), (1983, '16:30', 2090), (1983, '17:35', 3770), (1983, '20:15', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1984, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'VBY'; -- 1815 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1984, '06:40', 420), (1984, '09:40', 3860), (1984, '12:00', 1390), (1984, '15:20', 2070), (1984, '18:10', 2540), (1984, '20:25', 509410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1985, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'UME'; -- 2500 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1985, '07:20', 850), (1985, '09:55', 480), (1985, '11:55', 270), (1985, '15:30', 2540), (1985, '17:25', 860380), (1985, '20:30', 2010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1986, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'OSD'; -- 2383 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1986, '08:10', 440), (1986, '10:50', 4630), (1986, '13:40', 4710), (1986, '16:00', 770), (1986, '19:05', 4190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1987, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'KRN'; -- 2934 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1987, '06:40', 788410), (1987, '09:35', 641250), (1987, '12:15', 1780), (1987, '15:15', 3000), (1987, '17:45', 38410), (1987, '19:45', 740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1988, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'OSL'; -- 2046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1988, '07:35', 1590), (1988, '10:25', 432900), (1988, '14:05', 190), (1988, '17:10', 4990), (1988, '19:50', 45290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1989, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BGO'; -- 2111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1989, '07:15', 2070), (1989, '09:55', 4910), (1989, '11:35', 17850), (1989, '13:35', 1410), (1989, '16:00', 3450), (1989, '17:40', 4580), (1989, '20:30', 2670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1990, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'TRD'; -- 2410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1990, '07:55', 2690), (1990, '09:10', 3310), (1990, '13:10', 560), (1990, '14:25', 3330), (1990, '17:00', 1500), (1990, '20:20', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1991, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'CPH'; -- 1537 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1991, '07:45', 1490), (1991, '10:05', 77620), (1991, '13:50', 651230), (1991, '16:30', 4730), (1991, '20:05', 3970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1992, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'AAL'; -- 1709 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1992, '06:35', 2650), (1992, '10:05', 31910), (1992, '13:10', 1500), (1992, '14:30', 3730), (1992, '18:00', 3550), (1992, '20:40', 971350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1993, f.id, t.id, 200 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'HEL'; -- 2234 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1993, '07:10', 3230), (1993, '11:30', 290), (1993, '13:25', 270270), (1993, '16:10', 2310), (1993, '19:25', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1994, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'KEF'; -- 3319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1994, '07:15', 40280), (1994, '10:15', 2290), (1994, '12:00', 4320), (1994, '15:15', 4650), (1994, '18:20', 4440), (1994, '20:30', 4320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1995, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'TLL'; -- 2142 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1995, '07:30', 4860), (1995, '08:40', 4960), (1995, '12:05', 211640), (1995, '13:15', 2830), (1995, '16:00', 236160), (1995, '18:40', 24490), (1995, '20:05', 1870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1996, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'RIX'; -- 1877 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1996, '06:35', 900), (1996, '09:40', 1960), (1996, '12:45', 1220), (1996, '15:00', 4430), (1996, '17:10', 1640), (1996, '20:45', 1050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1997, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'LHR'; -- 1444 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1997, '07:10', 3700), (1997, '10:55', 3510), (1997, '14:20', 3310), (1997, '16:45', 480), (1997, '20:20', 1300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1998, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MAN'; -- 1678 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1998, '07:00', 660), (1998, '09:25', 4090), (1998, '12:20', 62820), (1998, '15:25', 3730), (1998, '17:20', 680), (1998, '20:40', 270970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 1999, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'EDI'; -- 1935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (1999, '07:35', 2700), (1999, '09:40', 1220), (1999, '12:40', 4210), (1999, '15:05', 1130), (1999, '18:10', 1500), (1999, '20:25', 1200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2000, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'DUB'; -- 1886 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2000, '07:10', 160200), (2000, '09:10', 2430), (2000, '12:20', 920), (2000, '14:30', 1600), (2000, '18:05', 4100), (2000, '20:55', 2250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2001, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'CDG'; -- 1101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2001, '07:55', 404000), (2001, '10:15', 253190), (2001, '14:05', 1750), (2001, '16:50', 362460), (2001, '20:15', 950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2002, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'NCE'; -- 460 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2002, '07:00', 3860), (2002, '10:40', 1030), (2002, '13:35', 2990), (2002, '16:30', 2420), (2002, '19:55', 518960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2003, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'AMS'; -- 1297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2003, '06:35', 1260), (2003, '09:30', 3490), (2003, '11:25', 1940), (2003, '13:35', 4060), (2003, '15:30', 245260), (2003, '18:40', 3070), (2003, '20:05', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2004, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BRU'; -- 1173 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2004, '07:20', 563840), (2004, '10:15', 890), (2004, '13:05', 2870), (2004, '16:25', 4820), (2004, '19:45', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2005, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'FRA'; -- 958 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2005, '06:55', 3680), (2005, '09:45', 2530), (2005, '14:10', 4640), (2005, '16:45', 4540), (2005, '20:20', 1800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2006, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MUC'; -- 729 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2006, '07:15', 420), (2006, '09:45', 3470), (2006, '13:30', 74680), (2006, '17:05', 4300), (2006, '20:20', 4540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2007, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BER'; -- 1179 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2007, '07:45', 3380), (2007, '10:15', 4900), (2007, '14:30', 15390), (2007, '17:45', 360), (2007, '19:10', 1490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2008, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'ZRH'; -- 694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2008, '07:15', 1610), (2008, '09:50', 1010), (2008, '11:55', 4950), (2008, '13:55', 1730), (2008, '16:35', 482950), (2008, '17:55', 4210), (2008, '19:50', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2009, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'VIE'; -- 779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2009, '07:20', 2430), (2009, '09:30', 78270), (2009, '11:05', 37520), (2009, '13:30', 2960), (2009, '16:35', 1480), (2009, '17:50', 4220), (2009, '19:45', 1630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2010, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'PRG'; -- 936 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2010, '06:55', 4530), (2010, '10:10', 530), (2010, '12:15', 3100), (2010, '15:15', 66840), (2010, '18:15', 1190), (2010, '20:10', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2011, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'WAW'; -- 1327 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2011, '07:40', 1980), (2011, '09:30', 2210), (2011, '12:10', 3030), (2011, '15:40', 1630), (2011, '17:55', 4090), (2011, '20:10', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2012, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BCN'; -- 848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2012, '07:55', 650), (2012, '10:30', 2770), (2012, '14:15', 4110), (2012, '17:25', 60260), (2012, '19:30', 1240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2013, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MAD'; -- 1331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2013, '08:05', 3570), (2013, '11:15', 1130), (2013, '14:30', 562640), (2013, '16:55', 2080), (2013, '19:40', 2510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2014, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'AGP'; -- 1548 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2014, '06:50', 1320), (2014, '08:55', 3890), (2014, '11:15', 1850), (2014, '14:00', 1150), (2014, '16:30', 520), (2014, '18:40', 4940), (2014, '20:45', 4820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2015, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'PMI'; -- 840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2015, '06:55', 927950), (2015, '09:35', 220), (2015, '11:30', 4290), (2015, '14:05', 38340), (2015, '16:10', 3820), (2015, '18:20', 1900), (2015, '20:25', 1970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2016, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'LPA'; -- 2936 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2016, '06:55', 2420), (2016, '09:50', 25140), (2016, '11:20', 4480), (2016, '13:25', 3640), (2016, '15:30', 4270), (2016, '17:55', 800820), (2016, '20:10', 2590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2017, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'LIS'; -- 1840 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2017, '06:45', 3580), (2017, '08:40', 4080), (2017, '12:00', 450), (2017, '13:20', 3350), (2017, '15:55', 761760), (2017, '18:05', 2270), (2017, '21:00', 3490);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2018, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MXP'; -- 512 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2018, '06:45', 4550), (2018, '09:30', 799980), (2018, '11:45', 95540), (2018, '14:50', 2290), (2018, '17:50', 3430), (2018, '20:05', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2019, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'ATH'; -- 1085 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2019, '08:00', 3700), (2019, '09:25', 3780), (2019, '11:50', 3750), (2019, '14:20', 2310), (2019, '18:00', 97600), (2019, '19:50', 32450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2020, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'IST'; -- 1372 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2020, '06:40', 3550), (2020, '09:25', 6750), (2020, '11:20', 4430), (2020, '14:20', 272040), (2020, '15:40', 8760), (2020, '18:15', 740), (2020, '20:20', 4070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2021, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'DXB'; -- 4343 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2021, '07:05', 231480), (2021, '09:05', 1140), (2021, '11:00', 4680), (2021, '14:00', 2760), (2021, '16:15', 3540), (2021, '18:30', 1210), (2021, '20:10', 4260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2022, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'BKK'; -- 8876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2022, '07:20', 3480), (2022, '10:25', 1460), (2022, '13:25', 1340), (2022, '16:50', 4660), (2022, '20:30', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2023, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'JFK'; -- 6867 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2023, '07:30', 96120), (2023, '09:05', 700), (2023, '11:05', 2040), (2023, '13:40', 4790), (2023, '15:25', 1070), (2023, '18:45', 1310), (2023, '20:35', 977510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2024, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'EWR'; -- 6891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2024, '07:20', 420), (2024, '09:20', 1600), (2024, '11:15', 1260), (2024, '13:40', 2520), (2024, '16:25', 1740), (2024, '18:50', 59690), (2024, '20:10', 2360);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2025, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'ORD'; -- 7742 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2025, '06:45', 3400), (2025, '09:35', 312190), (2025, '11:40', 3940), (2025, '13:30', 61780), (2025, '16:00', 2440), (2025, '18:05', 1920), (2025, '20:55', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2026, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'MIA'; -- 8330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2026, '07:10', 940), (2026, '09:50', 2110), (2026, '12:20', 4450), (2026, '15:15', 826890), (2026, '18:10', 3340), (2026, '20:20', 4840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2027, f.id, t.id, 795 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'LAX'; -- 10204 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2027, '07:15', 59430), (2027, '09:55', 2010), (2027, '12:10', 4790), (2027, '15:00', 378810), (2027, '17:05', 4580), (2027, '20:05', 2500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2028, f.id, t.id, 560 FROM airports f, airports t WHERE f.iata = 'FCO' AND t.iata = 'YYZ'; -- 7086 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2028, '07:00', 2100), (2028, '09:25', 450), (2028, '12:05', 3630), (2028, '15:45', 110640), (2028, '17:30', 1880), (2028, '19:40', 3530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2029, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'ARN'; -- 1674 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2029, '07:30', 2850), (2029, '11:30', 2740), (2029, '13:55', 1320), (2029, '17:25', 764780), (2029, '20:05', 2260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2030, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BMA'; -- 1645 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2030, '08:05', 4470), (2030, '10:35', 567960), (2030, '13:55', 2320), (2030, '17:05', 1000), (2030, '19:20', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2031, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'GOT'; -- 1361 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2031, '07:15', 4660), (2031, '09:10', 4480), (2031, '12:30', 3070), (2031, '14:20', 3660), (2031, '17:25', 2780), (2031, '20:40', 3670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2032, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'MMX'; -- 1149 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2032, '07:30', 4250), (2032, '09:40', 92270), (2032, '12:05', 4100), (2032, '14:05', 1170), (2032, '16:15', 1820), (2032, '18:35', 730), (2032, '20:25', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2033, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'LLA'; -- 2357 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2033, '07:35', 1030), (2033, '10:55', 2500), (2033, '14:20', 68280), (2033, '17:00', 4700), (2033, '20:05', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2034, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'VBY'; -- 1490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2034, '07:45', 1330), (2034, '09:10', 4660), (2034, '12:55', 726390), (2034, '15:10', 380), (2034, '17:45', 680), (2034, '20:10', 988480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2035, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'UME'; -- 2144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2035, '07:25', 41690), (2035, '10:35', 3380), (2035, '13:15', 868480), (2035, '16:10', 111480), (2035, '19:40', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2036, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'KRN'; -- 2557 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2036, '07:15', 36610), (2036, '11:30', 1930), (2036, '13:45', 2440), (2036, '17:30', 1210), (2036, '19:55', 4670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2037, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'OSL'; -- 1627 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2037, '07:20', 4680), (2037, '09:30', 1810), (2037, '12:00', 80930), (2037, '13:55', 2320), (2037, '16:00', 1640), (2037, '17:45', 630), (2037, '20:35', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2038, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BGO'; -- 1646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2038, '07:30', 1310), (2038, '10:05', 1870), (2038, '12:10', 1950), (2038, '14:25', 4710), (2038, '18:00', 490), (2038, '20:40', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2039, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'TRD'; -- 1987 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2039, '07:55', 4790), (2039, '10:00', 19300), (2039, '11:55', 4810), (2039, '14:25', 680), (2039, '18:15', 2720), (2039, '19:35', 1830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2040, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'CPH'; -- 1144 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2040, '08:00', 1250), (2040, '09:45', 3350), (2040, '13:40', 719990), (2040, '17:25', 2320), (2040, '19:05', 39030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2041, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'AAL'; -- 1277 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2041, '06:35', 3000), (2041, '10:05', 1050), (2041, '13:10', 1810), (2041, '15:45', 4680), (2041, '18:15', 4690), (2041, '20:55', 2140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2042, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'HEL'; -- 1951 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2042, '07:45', 2610), (2042, '11:30', 4770), (2042, '14:35', 3290), (2042, '16:10', 2010), (2042, '19:15', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2043, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'KEF'; -- 2808 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2043, '08:15', 1340), (2043, '10:20', 2650), (2043, '13:50', 3640), (2043, '17:30', 3760), (2043, '20:00', 2710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2044, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'TLL'; -- 1870 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2044, '07:45', 4080), (2044, '08:40', 3760), (2044, '12:10', 4550), (2044, '14:10', 2550), (2044, '15:40', 930), (2044, '18:10', 3560), (2044, '20:50', 1550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2045, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'RIX'; -- 1636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2045, '07:05', 4550), (2045, '09:40', 1180), (2045, '11:55', 170), (2045, '13:45', 1020), (2045, '16:25', 4250), (2045, '18:20', 740), (2045, '20:40', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2046, f.id, t.id, 100 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'LHR'; -- 935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2046, '06:45', 726390), (2046, '10:15', 802350), (2046, '12:00', 4590), (2046, '14:40', 3280), (2046, '17:05', 260140), (2046, '20:35', 4690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2047, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'MAN'; -- 1167 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2047, '08:10', 4100), (2047, '09:45', 43020), (2047, '13:45', 1890), (2047, '17:45', 4210), (2047, '20:25', 380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2048, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'EDI'; -- 1424 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2048, '06:55', 3730), (2048, '09:30', 970), (2048, '11:15', 1650), (2048, '13:20', 1330), (2048, '16:30', 4260), (2048, '18:25', 3900), (2048, '20:50', 1850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2049, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'DUB'; -- 1381 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2049, '07:00', 260), (2049, '09:30', 2690), (2049, '11:50', 3780), (2049, '14:20', 2280), (2049, '18:05', 2620), (2049, '20:55', 20940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2050, f.id, t.id, 75 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'CDG'; -- 598 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2050, '06:40', 3810), (2050, '08:55', 1880), (2050, '11:35', 1670), (2050, '13:50', 1410), (2050, '15:20', 3000), (2050, '18:10', 540), (2050, '20:35', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2051, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'AMS'; -- 797 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2051, '07:35', 160), (2051, '09:30', 96180), (2051, '11:05', 480), (2051, '13:20', 3040), (2051, '16:25', 4840), (2051, '18:10', 2850), (2051, '20:05', 3400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2052, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BRU'; -- 664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2052, '07:35', 848940), (2052, '09:45', 4970), (2052, '11:50', 4630), (2052, '15:35', 13720), (2052, '17:10', 3490), (2052, '20:00', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2053, f.id, t.id, 65 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'FRA'; -- 489 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2053, '06:50', 3340), (2053, '10:30', 2790), (2053, '11:50', 360), (2053, '15:25', 3980), (2053, '17:50', 760), (2053, '20:35', 3350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2054, f.id, t.id, 90 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BER'; -- 826 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2054, '07:10', 3340), (2054, '09:50', 1880), (2054, '14:25', 3930), (2054, '17:35', 2020), (2054, '19:30', 662730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2055, f.id, t.id, 45 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'ZRH'; -- 204 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2055, '07:55', 572770), (2055, '10:20', 61820), (2055, '12:50', 4670), (2055, '14:30', 3440), (2055, '17:20', 58500), (2055, '19:35', 1710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2056, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'VIE'; -- 657 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2056, '07:30', 70510), (2056, '09:35', 2850), (2056, '11:25', 2900), (2056, '14:05', 330), (2056, '15:20', 4540), (2056, '17:45', 4450), (2056, '20:00', 230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2057, f.id, t.id, 80 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'PRG'; -- 646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2057, '06:30', 4680), (2057, '09:15', 2800), (2057, '11:55', 4050), (2057, '13:40', 1390), (2057, '15:35', 3790), (2057, '18:30', 2400), (2057, '20:15', 3320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2058, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'WAW'; -- 1151 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2058, '06:45', 240), (2058, '09:20', 4400), (2058, '12:10', 4840), (2058, '13:45', 4350), (2058, '15:40', 4110), (2058, '18:45', 3290), (2058, '20:25', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2059, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BCN'; -- 720 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2059, '07:45', 1400), (2059, '10:00', 990), (2059, '13:35', 294900), (2059, '16:25', 29650), (2059, '19:05', 3050);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2060, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'MAD'; -- 1149 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2060, '07:10', 1360), (2060, '09:15', 40970), (2060, '11:10', 3390), (2060, '13:45', 3800), (2060, '15:45', 3960), (2060, '18:50', 2120), (2060, '20:15', 3460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2061, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'AGP'; -- 1486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2061, '07:35', 1070), (2061, '09:35', 3710), (2061, '12:10', 1520), (2061, '15:15', 3440), (2061, '18:05', 3770), (2061, '19:50', 1900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2062, f.id, t.id, 95 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'PMI'; -- 834 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2062, '08:05', 1050), (2062, '10:55', 19990), (2062, '13:40', 97280), (2062, '16:30', 568760), (2062, '20:25', 2090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2063, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'LPA'; -- 2892 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2063, '08:10', 2530), (2063, '10:10', 3280), (2063, '13:55', 320), (2063, '16:50', 3250), (2063, '20:45', 445290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2064, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'LIS'; -- 1651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2064, '07:30', 2740), (2064, '11:20', 2860), (2064, '14:10', 2790), (2064, '17:20', 7980), (2064, '19:30', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2065, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'FCO'; -- 512 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2065, '07:20', 730), (2065, '09:25', 1430), (2065, '12:15', 3350), (2065, '14:35', 4450), (2065, '17:55', 3850), (2065, '19:40', 530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2066, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'ATH'; -- 1520 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2066, '07:10', 2160), (2066, '08:50', 360), (2066, '11:25', 71120), (2066, '14:20', 3140), (2066, '16:25', 4400), (2066, '17:45', 5000), (2066, '21:00', 2230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2067, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'IST'; -- 1683 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2067, '07:25', 390), (2067, '08:40', 31730), (2067, '11:30', 4680), (2067, '13:45', 2050), (2067, '16:35', 2820), (2067, '17:45', 2040), (2067, '20:30', 4350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2068, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'DXB'; -- 4708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2068, '07:45', 4270), (2068, '10:50', 1460), (2068, '14:05', 360), (2068, '16:55', 3160), (2068, '19:35', 2740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2069, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'BKK'; -- 9080 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2069, '06:40', 4350), (2069, '10:35', 9580), (2069, '12:30', 365990), (2069, '15:40', 1130), (2069, '18:05', 220), (2069, '19:50', 4020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2070, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'JFK'; -- 6412 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2070, '07:45', 1440), (2070, '09:20', 292830), (2070, '12:50', 1230), (2070, '15:00', 220), (2070, '17:25', 2380), (2070, '19:40', 90120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2071, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'EWR'; -- 6436 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2071, '07:05', 474880), (2071, '09:40', 1770), (2071, '12:20', 820), (2071, '15:05', 1570), (2071, '16:55', 820), (2071, '19:30', 4690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2072, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'ORD'; -- 7259 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2072, '06:40', 3220), (2072, '10:10', 2100), (2072, '14:20', 99760), (2072, '17:10', 4060), (2072, '20:50', 2290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2073, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'MIA'; -- 7920 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2073, '06:40', 3340), (2073, '09:20', 390), (2073, '12:05', 43560), (2073, '15:40', 4120), (2073, '17:15', 6050), (2073, '19:50', 3380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2074, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'LAX'; -- 9696 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2074, '07:05', 3950), (2074, '09:20', 98010), (2074, '11:55', 104190), (2074, '13:20', 594550), (2074, '15:35', 3490), (2074, '18:45', 4340), (2074, '20:00', 1200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2075, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'MXP' AND t.iata = 'YYZ'; -- 6611 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2075, '06:45', 1850), (2075, '10:35', 1980), (2075, '12:15', 2740), (2075, '14:55', 4390), (2075, '17:55', 2430), (2075, '20:55', 2840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2076, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BMA'; -- 2419 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2076, '07:10', 3880), (2076, '09:20', 3230), (2076, '12:55', 2330), (2076, '15:30', 1730), (2076, '17:45', 3140), (2076, '19:45', 4960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2077, f.id, t.id, 205 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'GOT'; -- 2352 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2077, '06:55', 2260), (2077, '09:55', 610), (2077, '11:50', 4450), (2077, '15:25', 2980), (2077, '17:50', 2960), (2077, '20:55', 2060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2078, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MMX'; -- 2111 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2078, '07:45', 760320), (2078, '10:35', 29290), (2078, '12:30', 4770), (2078, '14:35', 30630), (2078, '17:45', 3690), (2078, '20:20', 57400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2079, f.id, t.id, 260 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'LLA'; -- 3071 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2079, '07:25', 2640), (2079, '09:20', 1560), (2079, '12:05', 150), (2079, '14:10', 850), (2079, '16:15', 1590), (2079, '18:10', 4980), (2079, '20:20', 1270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2080, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'VBY'; -- 2230 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2080, '08:00', 2260), (2080, '09:55', 3870), (2080, '12:55', 6220), (2080, '15:45', 4060), (2080, '17:05', 3170), (2080, '20:25', 3330);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2081, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'UME'; -- 2885 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2081, '07:30', 2320), (2081, '09:30', 1100), (2081, '12:05', 1840), (2081, '15:45', 2600), (2081, '18:05', 2760), (2081, '20:10', 4400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2082, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'OSD'; -- 2879 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2082, '07:10', 2960), (2082, '10:05', 4350), (2082, '13:10', 1420), (2082, '17:30', 3880), (2082, '19:50', 73280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2083, f.id, t.id, 280 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'KRN'; -- 3330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2083, '07:10', 790), (2083, '09:30', 765800), (2083, '11:20', 2160), (2083, '13:30', 2200), (2083, '16:05', 1410), (2083, '17:40', 3690), (2083, '19:45', 2070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2084, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'OSL'; -- 2634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2084, '07:40', 78370), (2084, '09:15', 690), (2084, '11:00', 680), (2084, '14:05', 28570), (2084, '16:30', 2050), (2084, '17:45', 180), (2084, '20:40', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2085, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BGO'; -- 2811 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2085, '06:30', 4290), (2085, '08:55', 73870), (2085, '11:15', 3910), (2085, '14:10', 4890), (2085, '16:15', 4330), (2085, '18:10', 2580), (2085, '20:45', 3950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2086, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'TRD'; -- 2969 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2086, '06:35', 4820), (2086, '09:55', 3240), (2086, '13:05', 4390), (2086, '14:20', 3560), (2086, '17:35', 4820), (2086, '20:55', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2087, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'CPH'; -- 2139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2087, '07:55', 1400), (2087, '10:25', 2500), (2087, '13:10', 1130), (2087, '14:55', 11000), (2087, '18:00', 4250), (2087, '20:10', 976990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2088, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'AAL'; -- 2367 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2088, '06:35', 4190), (2088, '09:40', 3050), (2088, '11:55', 1510), (2088, '13:20', 830), (2088, '16:00', 4570), (2088, '18:05', 4860), (2088, '19:45', 1540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2089, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'HEL'; -- 2490 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2089, '07:40', 416410), (2089, '11:10', 344450), (2089, '14:35', 79700), (2089, '17:35', 3170), (2089, '19:20', 630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2090, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'KEF'; -- 4200 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2090, '08:20', 1400), (2090, '10:15', 2310), (2090, '13:35', 3390), (2090, '16:10', 1360), (2090, '20:20', 4320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2091, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'TLL'; -- 2388 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2091, '07:40', 1450), (2091, '10:35', 129720), (2091, '14:40', 1730), (2091, '16:45', 532340), (2091, '19:55', 160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2092, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'RIX'; -- 2110 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2092, '06:55', 1480), (2092, '10:30', 80790), (2092, '12:55', 617440), (2092, '15:25', 700), (2092, '17:50', 3300), (2092, '20:40', 940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2093, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'LHR'; -- 2425 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2093, '07:20', 2530), (2093, '09:20', 220), (2093, '11:45', 2710), (2093, '15:40', 4720), (2093, '17:55', 400), (2093, '20:45', 3570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2094, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MAN'; -- 2636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2094, '07:20', 3060), (2094, '10:25', 3030), (2094, '13:05', 2240), (2094, '15:10', 3100), (2094, '17:05', 1020), (2094, '20:45', 1900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2095, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'EDI'; -- 2847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2095, '06:50', 550), (2095, '09:10', 4440), (2095, '11:55', 2240), (2095, '14:20', 63900), (2095, '15:25', 4320), (2095, '18:45', 2180), (2095, '20:20', 1970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2096, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'DUB'; -- 2874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2096, '06:40', 3660), (2096, '11:20', 37430), (2096, '14:35', 3360), (2096, '16:15', 620), (2096, '20:35', 906970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2097, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'CDG'; -- 2108 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2097, '07:40', 4990), (2097, '10:55', 3890), (2097, '14:15', 1750), (2097, '17:05', 278110), (2097, '19:05', 4640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2098, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'NCE'; -- 1541 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2098, '07:55', 4180), (2098, '10:45', 3070), (2098, '14:20', 3460), (2098, '16:40', 97360), (2098, '20:50', 3590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2099, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'AMS'; -- 2181 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2099, '06:40', 75000), (2099, '09:55', 1140), (2099, '11:50', 4540), (2099, '13:10', 3740), (2099, '16:05', 900), (2099, '17:55', 3080), (2099, '19:50', 35160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2100, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BRU'; -- 2101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2100, '07:10', 920), (2100, '08:45', 935420), (2100, '11:10', 1340), (2100, '13:45', 4230), (2100, '15:50', 3880), (2100, '18:45', 430), (2100, '19:55', 517410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2101, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'FRA'; -- 1815 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2101, '07:00', 4270), (2101, '11:15', 2450), (2101, '14:30', 3150), (2101, '17:40', 1180), (2101, '20:35', 1840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2102, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MUC'; -- 1517 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2102, '07:25', 3100), (2102, '10:25', 4630), (2102, '12:45', 3630), (2102, '15:35', 660), (2102, '18:20', 3520), (2102, '20:00', 2990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2103, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BER'; -- 1797 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2103, '06:35', 3840), (2103, '09:00', 1150), (2103, '11:35', 4670), (2103, '14:20', 4250), (2103, '15:30', 4760), (2103, '17:55', 3040), (2103, '20:05', 2310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2104, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'ZRH'; -- 1639 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2104, '07:00', 230), (2104, '08:40', 277010), (2104, '11:30', 1780), (2104, '14:15', 2140), (2104, '15:40', 4030), (2104, '18:45', 3310), (2104, '20:10', 1170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2105, f.id, t.id, 125 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'VIE'; -- 1278 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2105, '06:35', 1930), (2105, '09:00', 1200), (2105, '11:55', 4730), (2105, '13:30', 4890), (2105, '15:20', 4170), (2105, '18:25', 84360), (2105, '20:40', 830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2106, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'PRG'; -- 1555 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2106, '07:00', 360), (2106, '10:05', 1020), (2106, '13:10', 4880), (2106, '17:25', 4210), (2106, '19:20', 3310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2107, f.id, t.id, 150 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'WAW'; -- 1599 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2107, '07:00', 47830), (2107, '09:10', 4820), (2107, '12:05', 4240), (2107, '14:20', 934830), (2107, '17:55', 4390), (2107, '19:55', 4070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2108, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BCN'; -- 1904 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2108, '07:05', 1520), (2108, '08:40', 40490), (2108, '11:50', 1540), (2108, '13:55', 4330), (2108, '15:45', 4360), (2108, '18:25', 1560), (2108, '20:15', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2109, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MAD'; -- 2377 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2109, '07:05', 3080), (2109, '09:20', 2190), (2109, '12:10', 629460), (2109, '15:40', 1960), (2109, '17:20', 2920), (2109, '20:40', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2110, f.id, t.id, 220 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'AGP'; -- 2510 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2110, '07:45', 1670), (2110, '09:25', 75440), (2110, '12:35', 2030), (2110, '15:15', 4870), (2110, '18:00', 3280), (2110, '20:50', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2111, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'PMI'; -- 1843 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2111, '07:55', 82140), (2111, '10:20', 3520), (2111, '12:35', 92500), (2111, '14:40', 52450), (2111, '17:50', 563760), (2111, '20:20', 4290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2112, f.id, t.id, 315 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'LPA'; -- 3804 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2112, '07:15', 250), (2112, '09:25', 1090), (2112, '11:35', 27780), (2112, '13:55', 3370), (2112, '16:20', 1150), (2112, '17:35', 669440), (2112, '20:30', 3470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2113, f.id, t.id, 245 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'LIS'; -- 2869 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2113, '07:15', 3830), (2113, '09:50', 3250), (2113, '14:20', 2960), (2113, '16:10', 2440), (2113, '19:35', 690630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2114, f.id, t.id, 110 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'FCO'; -- 1085 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2114, '07:10', 4870), (2114, '10:05', 5000), (2114, '12:50', 64520), (2114, '16:30', 3140), (2114, '19:40', 3740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2115, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MXP'; -- 1520 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2115, '06:35', 3200), (2115, '09:10', 2040), (2115, '11:55', 2220), (2115, '13:30', 490), (2115, '15:35', 4580), (2115, '17:35', 1670), (2115, '20:25', 209350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2116, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'DXB'; -- 3272 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2116, '06:35', 3660), (2116, '10:20', 842160), (2116, '12:45', 4110), (2116, '15:20', 843270), (2116, '17:05', 1450), (2116, '19:30', 730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2117, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'BKK'; -- 7930 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2117, '07:45', 58490), (2117, '09:30', 2040), (2117, '12:00', 44510), (2117, '14:15', 2720), (2117, '15:40', 3110), (2117, '18:10', 2080), (2117, '20:30', 480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2118, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'JFK'; -- 7932 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2118, '07:40', 3520), (2118, '09:40', 844800), (2118, '12:00', 17830), (2118, '13:15', 2850), (2118, '16:10', 4850), (2118, '17:45', 690), (2118, '20:40', 21640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2119, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'EWR'; -- 7956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2119, '07:15', 2370), (2119, '10:35', 740), (2119, '11:45', 1690), (2119, '15:30', 2640), (2119, '17:50', 350), (2119, '19:30', 4450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2120, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'ORD'; -- 8769 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2120, '07:20', 220), (2120, '09:25', 55390), (2120, '12:15', 1470), (2120, '15:10', 3930), (2120, '17:45', 3530), (2120, '19:45', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2121, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'MIA'; -- 9415 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2121, '08:25', 3480), (2121, '10:50', 3270), (2121, '12:55', 880), (2121, '16:55', 1480), (2121, '19:35', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2122, f.id, t.id, 865 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'LAX'; -- 11127 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2122, '07:20', 74390), (2122, '09:35', 460440), (2122, '11:45', 4700), (2122, '14:05', 1300), (2122, '16:35', 1730), (2122, '18:45', 650), (2122, '20:50', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2123, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'ATH' AND t.iata = 'YYZ'; -- 8128 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2123, '07:25', 560), (2123, '10:05', 1280), (2123, '11:55', 76300), (2123, '14:20', 1090), (2123, '17:25', 26360), (2123, '20:20', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2124, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'ARN'; -- 2177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2124, '06:35', 2750), (2124, '08:50', 328840), (2124, '11:50', 4110), (2124, '13:30', 1250), (2124, '15:20', 1630), (2124, '18:50', 4550), (2124, '20:55', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2125, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BMA'; -- 2146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2125, '07:55', 99300), (2125, '10:30', 99250), (2125, '13:05', 3240), (2125, '16:20', 1230), (2125, '19:25', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2126, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MMX'; -- 1942 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2126, '07:20', 2620), (2126, '09:10', 2380), (2126, '12:25', 68650), (2126, '15:20', 3390), (2126, '17:50', 2710), (2126, '20:30', 1970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2127, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'LLA'; -- 2732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2127, '07:10', 1320), (2127, '11:00', 4980), (2127, '13:55', 1360), (2127, '16:00', 1320), (2127, '19:15', 3750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2128, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'VBY'; -- 1967 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2128, '07:55', 3620), (2128, '09:35', 3990), (2128, '11:55', 3720), (2128, '14:35', 4640), (2128, '17:00', 2690), (2128, '20:10', 78730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2129, f.id, t.id, 225 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'OSD'; -- 2610 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2129, '07:05', 1840), (2129, '11:10', 630), (2129, '13:00', 31630), (2129, '16:25', 3830), (2129, '19:55', 95280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2130, f.id, t.id, 255 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'KRN'; -- 2996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2130, '08:05', 19370), (2130, '10:20', 2250), (2130, '13:15', 1380), (2130, '17:00', 2380), (2130, '19:05', 319980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2131, f.id, t.id, 210 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'OSL'; -- 2426 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2131, '06:55', 4710), (2131, '09:55', 1260), (2131, '13:50', 2620), (2131, '17:15', 210), (2131, '19:10', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2132, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BGO'; -- 2655 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2132, '07:00', 960), (2132, '09:55', 18440), (2132, '11:20', 3980), (2132, '13:20', 998400), (2132, '15:50', 1610), (2132, '18:25', 1270), (2132, '20:50', 3500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2133, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'TRD'; -- 2727 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2133, '06:55', 1410), (2133, '09:25', 3060), (2133, '12:45', 1000), (2133, '15:30', 680), (2133, '17:15', 2030), (2133, '19:35', 3690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2134, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'CPH'; -- 1979 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2134, '06:30', 3580), (2134, '09:30', 4300), (2134, '11:30', 98400), (2134, '13:20', 1410), (2134, '15:30', 2790), (2134, '18:10', 605710), (2134, '20:15', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2135, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'AAL'; -- 2217 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2135, '07:10', 2850), (2135, '10:35', 4650), (2135, '12:35', 3120), (2135, '15:35', 2260), (2135, '17:25', 2440), (2135, '20:05', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2136, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'HEL'; -- 2135 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2136, '07:00', 88570), (2136, '10:15', 1040), (2136, '12:00', 3390), (2136, '15:05', 3870), (2136, '18:05', 275990), (2136, '19:50', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2137, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'KEF'; -- 4115 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2137, '07:15', 3170), (2137, '09:55', 3210), (2137, '12:45', 1050), (2137, '14:35', 2590), (2137, '17:40', 2290), (2137, '19:45', 35830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2138, f.id, t.id, 185 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'TLL'; -- 2036 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2138, '08:10', 2900), (2138, '11:05', 1310), (2138, '12:50', 1370), (2138, '16:10', 3650), (2138, '20:30', 249310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2139, f.id, t.id, 215 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'LHR'; -- 2488 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2139, '07:05', 941760), (2139, '10:40', 890), (2139, '14:00', 3000), (2139, '17:15', 1270), (2139, '20:00', 2100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2140, f.id, t.id, 230 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MAN'; -- 2667 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2140, '06:50', 344980), (2140, '09:10', 1660), (2140, '12:15', 4500), (2140, '15:05', 790), (2140, '17:15', 550830), (2140, '20:45', 2940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2141, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'EDI'; -- 2830 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2141, '06:55', 4150), (2141, '08:45', 667130), (2141, '11:50', 91160), (2141, '14:10', 10700), (2141, '15:45', 2780), (2141, '18:45', 46580), (2141, '20:35', 950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2142, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'DUB'; -- 2923 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2142, '07:40', 4290), (2142, '11:15', 4560), (2142, '12:55', 3060), (2142, '16:20', 1600), (2142, '20:00', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2143, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'CDG'; -- 2214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2143, '07:15', 4270), (2143, '10:35', 1970), (2143, '13:20', 1900), (2143, '17:25', 3110), (2143, '19:45', 1870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2144, f.id, t.id, 165 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'NCE'; -- 1780 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2144, '08:00', 70910), (2144, '09:55', 313210), (2144, '12:10', 2990), (2144, '15:20', 660), (2144, '18:10', 1380), (2144, '20:35', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2145, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'AMS'; -- 2184 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2145, '07:10', 4080), (2145, '09:55', 613240), (2145, '11:20', 49220), (2145, '13:55', 2320), (2145, '16:10', 1620), (2145, '18:10', 1890), (2145, '20:10', 3830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2146, f.id, t.id, 190 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BRU'; -- 2142 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2146, '06:40', 2440), (2146, '09:35', 36290), (2146, '12:00', 98270), (2146, '14:55', 4440), (2146, '18:15', 1310), (2146, '20:50', 1420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2147, f.id, t.id, 170 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'FRA'; -- 1838 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2147, '07:00', 2290), (2147, '11:30', 2740), (2147, '14:30', 1140), (2147, '17:45', 2270), (2147, '19:35', 600200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2148, f.id, t.id, 145 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MUC'; -- 1547 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2148, '07:25', 4220), (2148, '10:40', 860), (2148, '13:55', 420), (2148, '16:20', 4980), (2148, '19:35', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2149, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BER'; -- 1688 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2149, '06:30', 4810), (2149, '08:50', 3210), (2149, '11:35', 221350), (2149, '13:25', 20700), (2149, '15:30', 3450), (2149, '17:45', 2090), (2149, '20:40', 68110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2150, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'ZRH'; -- 1740 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2150, '07:20', 680), (2150, '10:25', 910), (2150, '14:05', 2160), (2150, '17:20', 4510), (2150, '19:10', 4780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2151, f.id, t.id, 120 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'VIE'; -- 1225 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2151, '07:50', 4670), (2151, '11:20', 1940), (2151, '14:05', 4830), (2151, '17:30', 4300), (2151, '20:50', 520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2152, f.id, t.id, 140 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'PRG'; -- 1489 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2152, '07:05', 91020), (2152, '09:20', 22920), (2152, '11:30', 3040), (2152, '13:30', 3600), (2152, '16:00', 4190), (2152, '18:45', 240), (2152, '20:50', 830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2153, f.id, t.id, 130 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'WAW'; -- 1348 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2153, '07:45', 3760), (2153, '11:20', 98520), (2153, '13:45', 790), (2153, '17:05', 1800), (2153, '19:45', 52970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2154, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BCN'; -- 2219 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2154, '06:40', 4780), (2154, '09:10', 513950), (2154, '12:10', 3420), (2154, '13:15', 162540), (2154, '15:25', 470), (2154, '18:30', 708210), (2154, '19:45', 4110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2155, f.id, t.id, 235 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MAD'; -- 2702 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2155, '08:10', 2720), (2155, '11:25', 23200), (2155, '14:30', 440), (2155, '16:30', 2790), (2155, '20:25', 570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2156, f.id, t.id, 250 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'AGP'; -- 2901 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2156, '08:10', 791100), (2156, '09:45', 1450), (2156, '14:20', 670), (2156, '17:05', 2880), (2156, '19:25', 4560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2157, f.id, t.id, 195 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'PMI'; -- 2201 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2157, '07:10', 1610), (2157, '10:00', 2300), (2157, '13:20', 1660), (2157, '17:05', 400), (2157, '19:10', 41010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2158, f.id, t.id, 350 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'LPA'; -- 4250 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2158, '06:35', 3910), (2158, '09:55', 1940), (2158, '13:05', 3280), (2158, '15:15', 1420), (2158, '17:30', 4610), (2158, '19:40', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2159, f.id, t.id, 270 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'LIS'; -- 3211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2159, '07:35', 4790), (2159, '11:00', 4010), (2159, '13:55', 950), (2159, '16:15', 2560), (2159, '19:05', 755020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2160, f.id, t.id, 135 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'FCO'; -- 1372 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2160, '07:15', 1800), (2160, '11:05', 4750), (2160, '13:10', 383540), (2160, '16:55', 4580), (2160, '20:00', 680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2161, f.id, t.id, 155 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MXP'; -- 1683 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2161, '06:40', 529250), (2161, '09:45', 4210), (2161, '11:15', 390), (2161, '14:20', 2490), (2161, '15:55', 3910), (2161, '17:50', 1030), (2161, '20:10', 1440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2162, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'BKK'; -- 7513 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2162, '07:15', 93200), (2162, '09:50', 2230), (2162, '12:30', 3470), (2162, '15:20', 3730), (2162, '17:30', 760), (2162, '20:55', 820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2163, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'JFK'; -- 8027 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2163, '07:45', 4130), (2163, '10:30', 4650), (2163, '12:45', 3430), (2163, '15:25', 2300), (2163, '17:50', 4340), (2163, '20:30', 352180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2164, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'EWR'; -- 8049 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2164, '07:40', 1100), (2164, '09:35', 589510), (2164, '11:00', 585080), (2164, '13:30', 4230), (2164, '16:35', 1470), (2164, '18:10', 4100), (2164, '20:15', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2165, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'ORD'; -- 8786 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2165, '07:20', 14180), (2165, '09:45', 1540), (2165, '11:35', 460), (2165, '13:20', 1060), (2165, '15:30', 1610), (2165, '18:30', 4930), (2165, '20:45', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2166, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'MIA'; -- 9585 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2166, '08:10', 1940), (2166, '10:50', 787370), (2166, '14:05', 3180), (2166, '16:10', 3380), (2166, '20:00', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2167, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'LAX'; -- 11004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2167, '07:25', 2970), (2167, '09:30', 670), (2167, '12:50', 1540), (2167, '15:40', 501920), (2167, '18:15', 48600), (2167, '20:55', 1150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2168, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'IST' AND t.iata = 'YYZ'; -- 8172 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2168, '07:10', 170), (2168, '09:35', 1840), (2168, '12:05', 2040), (2168, '14:45', 1370), (2168, '17:15', 690), (2168, '20:10', 71010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2169, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'ARN'; -- 4785 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2169, '07:55', 2780), (2169, '10:00', 2760), (2169, '12:45', 670), (2169, '14:40', 260), (2169, '17:40', 1820), (2169, '20:05', 3860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2170, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BMA'; -- 4764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2170, '07:20', 860), (2170, '09:25', 860), (2170, '12:40', 660), (2170, '14:25', 3020), (2170, '18:15', 650), (2170, '19:30', 290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2171, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'GOT'; -- 4943 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2171, '07:10', 630), (2171, '10:25', 31340), (2171, '12:35', 2290), (2171, '14:40', 3570), (2171, '18:00', 518330), (2171, '20:10', 293130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2172, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MMX'; -- 4774 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2172, '06:35', 702520), (2172, '09:30', 380), (2172, '11:35', 556870), (2172, '13:45', 4720), (2172, '16:15', 3100), (2172, '18:10', 1970), (2172, '20:10', 4560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2173, f.id, t.id, 410 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'LLA'; -- 5054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2173, '07:40', 4140), (2173, '09:55', 3570), (2173, '11:35', 2810), (2173, '13:10', 4500), (2173, '16:15', 4990), (2173, '18:10', 670), (2173, '19:50', 40020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2174, f.id, t.id, 380 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'VBY'; -- 4636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2174, '07:35', 880), (2174, '09:25', 350), (2174, '11:10', 1400), (2174, '13:25', 4470), (2174, '16:20', 4310), (2174, '18:30', 469700), (2174, '19:55', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2175, f.id, t.id, 405 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'UME'; -- 4981 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2175, '07:15', 2940), (2175, '09:15', 1980), (2175, '12:40', 2450), (2175, '15:15', 1130), (2175, '17:40', 2940), (2175, '20:15', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2176, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'OSD'; -- 5163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2176, '06:45', 2590), (2176, '09:30', 3650), (2176, '13:05', 32200), (2176, '15:15', 722240), (2176, '17:45', 1240), (2176, '20:20', 3250);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2177, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'KRN'; -- 5290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2177, '08:25', 210), (2177, '11:20', 3780), (2177, '14:20', 310380), (2177, '16:30', 2110), (2177, '20:30', 3080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2178, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'OSL'; -- 5137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2178, '06:40', 388550), (2178, '09:15', 4580), (2178, '11:50', 310), (2178, '14:20', 2470), (2178, '15:45', 1740), (2178, '18:25', 2050), (2178, '20:55', 2180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2179, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BGO'; -- 5434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2179, '07:00', 4350), (2179, '10:25', 4740), (2179, '12:10', 2380), (2179, '15:10', 640), (2179, '17:55', 1470), (2179, '20:25', 1780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2180, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'TRD'; -- 5329 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2180, '07:50', 3850), (2180, '11:00', 380810), (2180, '14:10', 2620), (2180, '17:15', 2200), (2180, '20:40', 1820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2181, f.id, t.id, 410 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'AAL'; -- 5045 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2181, '07:20', 1420), (2181, '09:45', 3390), (2181, '12:05', 587830), (2181, '15:20', 54210), (2181, '17:35', 3310), (2181, '20:45', 850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2182, f.id, t.id, 370 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'HEL'; -- 4538 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2182, '07:25', 694190), (2182, '09:05', 2460), (2182, '11:40', 55050), (2182, '13:55', 1380), (2182, '15:40', 3010), (2182, '18:20', 4710), (2182, '19:50', 3010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2183, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'KEF'; -- 6919 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2183, '06:45', 3540), (2183, '09:40', 3580), (2183, '11:35', 1000), (2183, '13:50', 2660), (2183, '16:10', 3080), (2183, '17:50', 680), (2183, '20:15', 2870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2184, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'TLL'; -- 4471 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2184, '08:20', 1190), (2184, '11:05', 210), (2184, '12:55', 260), (2184, '17:25', 4160), (2184, '19:55', 4090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2185, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'RIX'; -- 4319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2185, '07:30', 3000), (2185, '09:30', 529560), (2185, '10:55', 781550), (2185, '13:10', 84530), (2185, '16:05', 3910), (2185, '17:40', 640), (2185, '19:55', 3860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2186, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'LHR'; -- 5497 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2186, '07:05', 490), (2186, '10:40', 4300), (2186, '13:10', 530), (2186, '17:10', 1540), (2186, '20:25', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2187, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MAN'; -- 5655 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2187, '06:40', 4210), (2187, '09:10', 3320), (2187, '11:45', 1390), (2187, '13:25', 4770), (2187, '16:00', 98690), (2187, '17:50', 4530), (2187, '19:45', 1880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2188, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'EDI'; -- 5777 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2188, '07:15', 3950), (2188, '09:15', 150), (2188, '12:15', 260), (2188, '14:20', 929470), (2188, '18:05', 860), (2188, '19:30', 2200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2189, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'DUB'; -- 5917 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2189, '06:55', 194280), (2189, '09:45', 784360), (2189, '12:50', 74560), (2189, '14:40', 670), (2189, '17:40', 710750), (2189, '20:05', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2190, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'CDG'; -- 5238 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2190, '07:50', 2150), (2190, '10:00', 4560), (2190, '13:25', 580), (2190, '16:35', 3310), (2190, '19:30', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2191, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'NCE'; -- 4783 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2191, '07:20', 3860), (2191, '09:50', 1610), (2191, '13:45', 4750), (2191, '17:15', 650), (2191, '19:10', 3350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2192, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'AMS'; -- 5169 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2192, '07:45', 350), (2192, '11:00', 2430), (2192, '13:15', 2100), (2192, '16:45', 150), (2192, '19:50', 530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2193, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BRU'; -- 5148 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2193, '06:45', 3570), (2193, '10:50', 2660), (2193, '13:40', 1840), (2193, '16:40', 881660), (2193, '19:45', 4160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2194, f.id, t.id, 395 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'FRA'; -- 4843 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2194, '06:50', 450), (2194, '09:35', 4020), (2194, '11:45', 3260), (2194, '15:05', 87560), (2194, '18:20', 3210), (2194, '19:30', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2195, f.id, t.id, 370 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MUC'; -- 4564 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2195, '06:50', 2600), (2195, '11:05', 1590), (2195, '14:35', 33750), (2195, '16:50', 3840), (2195, '20:45', 1690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2196, f.id, t.id, 375 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BER'; -- 4613 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2196, '07:15', 3110), (2196, '09:50', 1950), (2196, '11:55', 3490), (2196, '14:15', 2500), (2196, '16:00', 4030), (2196, '18:10', 2410), (2196, '20:25', 1090);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2197, f.id, t.id, 390 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'ZRH'; -- 4768 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2197, '06:40', 2040), (2197, '09:45', 320), (2197, '14:40', 550), (2197, '16:55', 2280), (2197, '19:25', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2198, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'VIE'; -- 4223 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2198, '08:05', 3370), (2198, '09:50', 1930), (2198, '14:00', 2970), (2198, '17:40', 3290), (2198, '19:40', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2199, f.id, t.id, 365 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'PRG'; -- 4464 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2199, '07:25', 270), (2199, '10:55', 93250), (2199, '14:30', 301430), (2199, '17:05', 4750), (2199, '20:40', 865990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2200, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'WAW'; -- 4156 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2200, '06:40', 3280), (2200, '10:20', 4230), (2200, '14:30', 42150), (2200, '16:00', 1860), (2200, '19:05', 3010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2201, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BCN'; -- 5175 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2201, '06:40', 351340), (2201, '09:10', 4990), (2201, '12:05', 260), (2201, '14:45', 39470), (2201, '18:00', 3640), (2201, '20:40', 3030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2202, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MAD'; -- 5649 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2202, '06:55', 4930), (2202, '09:10', 230), (2202, '11:40', 420), (2202, '14:15', 4770), (2202, '15:20', 27090), (2202, '18:40', 580), (2202, '20:40', 440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2203, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'AGP'; -- 5755 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2203, '07:20', 4470), (2203, '09:55', 4300), (2203, '12:00', 4570), (2203, '14:05', 2010), (2203, '16:20', 4670), (2203, '17:45', 1630), (2203, '20:05', 2400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2204, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'PMI'; -- 5112 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2204, '06:55', 505530), (2204, '09:25', 2140), (2204, '12:30', 27560), (2204, '15:10', 2800), (2204, '18:20', 76750), (2204, '19:55', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2205, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'LPA'; -- 6939 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2205, '06:35', 990), (2205, '09:50', 2420), (2205, '11:45', 2480), (2205, '13:50', 1460), (2205, '16:30', 2980), (2205, '17:50', 4660), (2205, '20:30', 2480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2206, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'LIS'; -- 6137 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2206, '06:40', 1290), (2206, '10:20', 4180), (2206, '12:35', 770), (2206, '15:20', 4560), (2206, '17:35', 21330), (2206, '19:45', 4440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2207, f.id, t.id, 355 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'FCO'; -- 4343 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2207, '07:05', 1280), (2207, '10:15', 4280), (2207, '13:40', 4410), (2207, '16:05', 3510), (2207, '19:05', 83430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2208, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MXP'; -- 4708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2208, '06:40', 350), (2208, '10:00', 3000), (2208, '13:25', 4030), (2208, '16:40', 1450), (2208, '20:25', 2010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2209, f.id, t.id, 275 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'ATH'; -- 3272 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2209, '06:55', 22860), (2209, '09:25', 4220), (2209, '11:45', 3930), (2209, '15:05', 4780), (2209, '18:15', 3890), (2209, '19:55', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2210, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'BKK'; -- 4904 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2210, '06:40', 1160), (2210, '11:25', 937390), (2210, '13:10', 1610), (2210, '16:55', 2940), (2210, '20:50', 2880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2211, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'JFK'; -- 11002 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2211, '06:40', 1330), (2211, '10:35', 3910), (2211, '14:05', 2530), (2211, '16:35', 980), (2211, '19:05', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2212, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'EWR'; -- 11021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2212, '07:30', 3230), (2212, '10:10', 3520), (2212, '13:15', 3410), (2212, '16:40', 1610), (2212, '19:20', 2750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2213, f.id, t.id, 905 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'ORD'; -- 11640 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2213, '07:40', 899830), (2213, '09:10', 1400), (2213, '12:30', 3540), (2213, '15:35', 190), (2213, '17:35', 4340), (2213, '20:20', 393650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2214, f.id, t.id, 975 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'MIA'; -- 12607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2214, '07:10', 2080), (2214, '09:35', 2190), (2214, '12:10', 880930), (2214, '14:50', 4400), (2214, '18:00', 4580), (2214, '19:45', 549390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2215, f.id, t.id, 1035 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'LAX'; -- 13401 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2215, '07:20', 312360), (2215, '10:00', 4930), (2215, '12:20', 2430), (2215, '15:05', 1830), (2215, '17:35', 4290), (2215, '20:15', 970980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2216, f.id, t.id, 860 FROM airports f, airports t WHERE f.iata = 'DXB' AND t.iata = 'YYZ'; -- 11082 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2216, '07:05', 4510), (2216, '09:55', 810), (2216, '11:30', 4120), (2216, '13:10', 2620), (2216, '16:20', 4700), (2216, '18:30', 4030), (2216, '19:45', 3380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2217, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'BMA'; -- 8295 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2217, '07:30', 3740), (2217, '09:00', 1600), (2217, '12:00', 1830), (2217, '13:20', 2390), (2217, '15:45', 1120), (2217, '17:45', 1490), (2217, '19:45', 3000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2218, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'GOT'; -- 8634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2218, '06:50', 1600), (2218, '09:30', 2640), (2218, '11:05', 2340), (2218, '13:30', 750), (2218, '16:20', 966840), (2218, '18:00', 3060), (2218, '19:55', 4960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2219, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MMX'; -- 8593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2219, '07:40', 64370), (2219, '08:50', 2360), (2219, '11:45', 1150), (2219, '14:20', 716740), (2219, '15:20', 3910), (2219, '18:00', 4260), (2219, '19:50', 480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2220, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'LLA'; -- 8101 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2220, '07:05', 4750), (2220, '09:20', 2200), (2220, '11:05', 431410), (2220, '14:20', 95050), (2220, '16:10', 850), (2220, '17:55', 1870), (2220, '21:00', 4820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2221, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'VBY'; -- 8274 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2221, '07:20', 1740), (2221, '09:55', 4530), (2221, '11:05', 399720), (2221, '14:10', 3990), (2221, '16:25', 1100), (2221, '17:50', 98280), (2221, '20:40', 1790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2222, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'UME'; -- 8177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2222, '06:55', 2340), (2222, '10:50', 1850), (2222, '14:40', 1770), (2222, '17:25', 780), (2222, '19:10', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2223, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'OSD'; -- 8464 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2223, '07:30', 2710), (2223, '10:25', 420), (2223, '11:50', 679800), (2223, '15:30', 3270), (2223, '17:05', 65130), (2223, '20:15', 18460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2224, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'KRN'; -- 8198 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2224, '07:20', 75570), (2224, '11:10', 4940), (2224, '13:10', 83970), (2224, '16:15', 1480), (2224, '19:30', 740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2225, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'OSL'; -- 8671 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2225, '07:40', 4470), (2225, '09:15', 2900), (2225, '10:55', 3500), (2225, '14:15', 3610), (2225, '16:15', 2930), (2225, '18:10', 1220), (2225, '20:55', 1160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2226, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'BGO'; -- 8989 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2226, '06:50', 264870), (2226, '09:05', 561500), (2226, '11:35', 1570), (2226, '13:50', 2450), (2226, '16:10', 83450), (2226, '18:35', 2080), (2226, '20:40', 560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2227, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'TRD'; -- 8640 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2227, '07:40', 2950), (2227, '09:20', 79560), (2227, '11:10', 1520), (2227, '13:25', 3770), (2227, '15:50', 4530), (2227, '18:40', 2040), (2227, '21:00', 693400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2228, f.id, t.id, 680 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'CPH'; -- 8637 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2228, '07:25', 3210), (2228, '08:50', 945140), (2228, '11:45', 4050), (2228, '13:50', 3340), (2228, '16:05', 336270), (2228, '17:50', 857180), (2228, '20:55', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2229, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'AAL'; -- 8787 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2229, '07:15', 91130), (2229, '09:20', 108820), (2229, '11:20', 31830), (2229, '13:40', 1450), (2229, '16:00', 4150), (2229, '18:35', 4110), (2229, '20:20', 762220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2230, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'HEL'; -- 7907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2230, '07:00', 3190), (2230, '09:30', 642540), (2230, '11:20', 2220), (2230, '13:45', 4520), (2230, '16:20', 57530), (2230, '18:40', 2490), (2230, '20:30', 2170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2231, f.id, t.id, 790 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'KEF'; -- 10146 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2231, '07:50', 496800), (2231, '10:05', 271740), (2231, '12:25', 1700), (2231, '15:20', 3640), (2231, '17:40', 2020), (2231, '19:35', 1930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2232, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'TLL'; -- 7905 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2232, '07:00', 3630), (2232, '09:55', 2120), (2232, '12:55', 1650), (2232, '15:45', 2100), (2232, '17:05', 981630), (2232, '20:20', 2240);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2233, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'RIX'; -- 7935 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2233, '07:35', 5670), (2233, '09:20', 3150), (2233, '12:00', 3850), (2233, '15:05', 2310), (2233, '18:10', 2830), (2233, '20:30', 341300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2234, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'LHR'; -- 9577 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2234, '07:35', 60710), (2234, '09:25', 1190), (2234, '11:45', 4950), (2234, '15:05', 56160), (2234, '17:25', 2500), (2234, '20:05', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2235, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MAN'; -- 9631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2235, '07:00', 4020), (2235, '10:35', 993840), (2235, '11:55', 2610), (2235, '14:45', 2480), (2235, '17:35', 410), (2235, '19:45', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2236, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'EDI'; -- 9603 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2236, '06:45', 4640), (2236, '09:15', 2350), (2236, '11:05', 51150), (2236, '14:00', 3620), (2236, '16:25', 310), (2236, '18:45', 770), (2236, '20:20', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2237, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'DUB'; -- 9875 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2237, '07:15', 460), (2237, '09:40', 4150), (2237, '11:05', 4740), (2237, '14:20', 4040), (2237, '15:30', 4870), (2237, '18:45', 1000), (2237, '19:50', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2238, f.id, t.id, 740 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'CDG'; -- 9448 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2238, '07:20', 360), (2238, '08:45', 3820), (2238, '12:10', 983990), (2238, '14:10', 1800), (2238, '15:20', 1490), (2238, '17:35', 3790), (2238, '20:25', 3690);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2239, f.id, t.id, 725 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'NCE'; -- 9240 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2239, '06:30', 3110), (2239, '09:05', 2930), (2239, '11:20', 1730), (2239, '13:50', 2540), (2239, '15:35', 2260), (2239, '18:20', 98250), (2239, '19:55', 3150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2240, f.id, t.id, 720 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'AMS'; -- 9207 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2240, '07:40', 1410), (2240, '10:15', 1300), (2240, '13:45', 319560), (2240, '17:05', 500), (2240, '19:25', 851460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2241, f.id, t.id, 725 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'BRU'; -- 9262 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2241, '07:45', 3730), (2241, '09:40', 2010), (2241, '12:55', 4710), (2241, '15:10', 1610), (2241, '17:25', 940), (2241, '19:45', 79710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2242, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'FRA'; -- 8999 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2242, '08:15', 4300), (2242, '10:55', 4650), (2242, '13:30', 232200), (2242, '16:55', 410), (2242, '20:00', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2243, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MUC'; -- 8799 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2243, '06:50', 440), (2243, '10:25', 2190), (2243, '12:10', 2200), (2243, '15:00', 3040), (2243, '18:15', 180), (2243, '20:00', 2180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2244, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'BER'; -- 8621 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2244, '06:40', 1700), (2244, '09:50', 4000), (2244, '13:05', 2860), (2244, '16:30', 4980), (2244, '20:35', 3730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2245, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'ZRH'; -- 9054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2245, '07:20', 37490), (2245, '09:40', 4260), (2245, '11:50', 3380), (2245, '15:45', 15700), (2245, '17:55', 2780), (2245, '20:25', 9530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2246, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'VIE'; -- 8451 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2246, '08:10', 2590), (2246, '11:05', 4340), (2246, '13:55', 470), (2246, '17:30', 790), (2246, '19:20', 3620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2247, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'PRG'; -- 8596 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2247, '06:45', 2580), (2247, '10:50', 4510), (2247, '14:35', 1740), (2247, '17:35', 2000), (2247, '19:20', 50290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2248, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'WAW'; -- 8115 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2248, '06:35', 2400), (2248, '09:50', 3330), (2248, '12:05', 1550), (2248, '14:35', 4340), (2248, '17:10', 1420), (2248, '20:20', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2249, f.id, t.id, 760 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'BCN'; -- 9713 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2249, '06:45', 41400), (2249, '09:15', 1500), (2249, '12:50', 3100), (2249, '15:40', 4110), (2249, '17:10', 1140), (2249, '19:30', 57190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2250, f.id, t.id, 795 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MAD'; -- 10193 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2250, '07:10', 3220), (2250, '09:20', 4720), (2250, '11:50', 3000), (2250, '13:40', 4180), (2250, '15:40', 2050), (2250, '17:50', 47950), (2250, '20:25', 3630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2251, f.id, t.id, 810 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'AGP'; -- 10413 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2251, '08:00', 2520), (2251, '10:10', 4470), (2251, '12:55', 4400), (2251, '14:50', 3400), (2251, '18:00', 598560), (2251, '19:30', 19890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2252, f.id, t.id, 760 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'PMI'; -- 9712 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2252, '07:45', 3930), (2252, '10:00', 3880), (2252, '12:40', 131720), (2252, '14:45', 4040), (2252, '17:25', 3120), (2252, '19:45', 273300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2253, f.id, t.id, 910 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'LPA'; -- 11732 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2253, '07:05', 1420), (2253, '10:55', 1180), (2253, '13:15', 2110), (2253, '17:25', 4260), (2253, '20:15', 66970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2254, f.id, t.id, 835 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'LIS'; -- 10706 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2254, '07:05', 3320), (2254, '10:00', 593280), (2254, '14:00', 950850), (2254, '16:25', 970), (2254, '19:40', 1750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2255, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'FCO'; -- 8876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2255, '07:40', 92320), (2255, '09:55', 4970), (2255, '12:00', 4360), (2255, '14:00', 2080), (2255, '16:15', 4560), (2255, '17:40', 2750), (2255, '19:50', 510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2256, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MXP'; -- 9080 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2256, '07:55', 4190), (2256, '10:55', 540), (2256, '13:35', 1680), (2256, '16:35', 2670), (2256, '20:40', 159080);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2257, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'ATH'; -- 7930 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2257, '07:40', 4360), (2257, '10:05', 94470), (2257, '12:35', 486730), (2257, '14:25', 3120), (2257, '17:40', 4940), (2257, '19:45', 4950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2258, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'IST'; -- 7513 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2258, '07:50', 2880), (2258, '09:45', 320), (2258, '14:30', 3660), (2258, '17:20', 960), (2258, '20:35', 39390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2259, f.id, t.id, 400 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'DXB'; -- 4904 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2259, '06:40', 3020), (2259, '10:15', 505510), (2259, '14:15', 3700), (2259, '17:40', 94300), (2259, '20:00', 2670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2260, f.id, t.id, 1075 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'JFK'; -- 13948 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2260, '07:10', 1740), (2260, '10:20', 3400), (2260, '14:05', 1390), (2260, '16:40', 731510), (2260, '19:55', 210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2261, f.id, t.id, 1075 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'EWR'; -- 13946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2261, '06:50', 1820), (2261, '10:15', 1700), (2261, '13:35', 3760), (2261, '16:15', 3790), (2261, '19:10', 1530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2262, f.id, t.id, 1060 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'ORD'; -- 13762 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2262, '06:55', 4950), (2262, '09:50', 1080), (2262, '11:05', 3740), (2262, '13:25', 2370), (2262, '15:20', 670), (2262, '17:55', 218270), (2262, '20:15', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2263, f.id, t.id, 1200 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'MIA'; -- 15624 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2263, '07:40', 3480), (2263, '09:35', 1080), (2263, '11:50', 2590), (2263, '14:20', 159690), (2263, '17:20', 469860), (2263, '20:10', 980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2264, f.id, t.id, 1025 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'LAX'; -- 13291 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2264, '07:00', 1770), (2264, '11:15', 2220), (2264, '13:25', 570), (2264, '17:05', 2680), (2264, '20:20', 3410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2265, f.id, t.id, 1055 FROM airports f, airports t WHERE f.iata = 'BKK' AND t.iata = 'YYZ'; -- 13636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2265, '08:15', 1330), (2265, '11:15', 25420), (2265, '13:15', 221080), (2265, '17:00', 3010), (2265, '19:05', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2266, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BMA'; -- 6307 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2266, '06:35', 2580), (2266, '09:55', 1190), (2266, '12:05', 1250), (2266, '13:20', 410), (2266, '16:25', 3250), (2266, '17:55', 4880), (2266, '20:55', 688210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2267, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'GOT'; -- 6080 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2267, '08:25', 2500), (2267, '09:45', 4550), (2267, '14:30', 210), (2267, '17:35', 4710), (2267, '20:30', 2570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2268, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MMX'; -- 6233 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2268, '07:30', 2300), (2268, '10:15', 66540), (2268, '12:10', 55460), (2268, '15:15', 2770), (2268, '16:55', 3090), (2268, '20:15', 3870);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2269, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'VBY'; -- 6410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2269, '07:15', 1610), (2269, '10:20', 3880), (2269, '12:05', 430), (2269, '14:20', 458330), (2269, '16:55', 740), (2269, '19:35', 2130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2270, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'UME'; -- 6216 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2270, '07:40', 2700), (2270, '10:50', 1860), (2270, '13:05', 4200), (2270, '17:00', 85070), (2270, '20:50', 1810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2271, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'OSD'; -- 5975 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2271, '07:05', 3020), (2271, '09:05', 575830), (2271, '12:00', 3750), (2271, '14:15', 3370), (2271, '16:15', 4410), (2271, '18:10', 4950), (2271, '20:10', 147650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2272, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'KRN'; -- 6046 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2272, '07:00', 4290), (2272, '09:55', 2550), (2272, '11:00', 2520), (2272, '13:55', 4190), (2272, '15:35', 56980), (2272, '18:40', 1990), (2272, '20:45', 230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2273, f.id, t.id, 450 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BGO'; -- 5604 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2273, '07:20', 4540), (2273, '11:30', 3830), (2273, '12:55', 2090), (2273, '16:50', 3880), (2273, '20:40', 2570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2274, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'TRD'; -- 5796 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2274, '06:30', 915410), (2274, '09:35', 560), (2274, '12:05', 3740), (2274, '13:50', 2510), (2274, '16:30', 310), (2274, '18:25', 3660), (2274, '19:45', 1590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2275, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'CPH'; -- 6188 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2275, '07:55', 1340), (2275, '11:10', 4080), (2275, '14:05', 80450), (2275, '16:30', 83130), (2275, '20:25', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2276, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'AAL'; -- 5967 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2276, '08:05', 1740), (2276, '10:00', 4000), (2276, '14:20', 950), (2276, '16:10', 3050), (2276, '20:10', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2277, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'HEL'; -- 6607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2277, '08:10', 312740), (2277, '09:50', 1590), (2277, '12:50', 2340), (2277, '16:00', 4170), (2277, '19:15', 3530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2278, f.id, t.id, 340 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'KEF'; -- 4163 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2278, '06:35', 1320), (2278, '08:40', 91890), (2278, '11:10', 650), (2278, '13:55', 75560), (2278, '15:20', 4910), (2278, '18:10', 1760), (2278, '20:00', 1970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2279, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'TLL'; -- 6651 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2279, '07:10', 1220), (2279, '08:40', 310), (2279, '11:45', 2380), (2279, '13:40', 542400), (2279, '15:45', 800), (2279, '18:40', 168540), (2279, '20:15', 2270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2280, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'RIX'; -- 6746 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2280, '08:00', 310), (2280, '11:05', 4770), (2280, '13:05', 1950), (2280, '16:00', 4850), (2280, '19:15', 4460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2281, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'LHR'; -- 5541 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2281, '07:10', 2430), (2281, '10:45', 620), (2281, '13:40', 3300), (2281, '16:25', 570), (2281, '19:40', 3600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2282, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MAN'; -- 5362 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2282, '07:35', 2330), (2282, '10:55', 3530), (2282, '13:15', 97510), (2282, '16:40', 3280), (2282, '20:05', 236280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2283, f.id, t.id, 420 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'EDI'; -- 5225 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2283, '07:45', 3090), (2283, '09:15', 1690), (2283, '10:55', 4870), (2283, '13:35', 2090), (2283, '15:45', 96500), (2283, '18:50', 1050), (2283, '20:40', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2284, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'DUB'; -- 5104 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2284, '06:55', 980), (2284, '09:40', 1860), (2284, '11:50', 4530), (2284, '13:55', 2520), (2284, '15:50', 1810), (2284, '18:05', 515490), (2284, '20:30', 1180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2285, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'CDG'; -- 5834 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2285, '07:25', 93580), (2285, '09:40', 4200), (2285, '12:05', 1330), (2285, '13:30', 2080), (2285, '15:25', 3420), (2285, '17:50', 604190), (2285, '20:15', 2370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2286, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'NCE'; -- 6407 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2286, '06:55', 406010), (2286, '10:05', 2020), (2286, '13:10', 4000), (2286, '14:20', 700), (2286, '17:25', 63760), (2286, '19:45', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2287, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'AMS'; -- 5847 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2287, '06:55', 40830), (2287, '10:15', 1790), (2287, '13:00', 24210), (2287, '14:45', 4890), (2287, '17:30', 750), (2287, '20:10', 1720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2288, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BRU'; -- 5885 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2288, '07:10', 1470), (2288, '11:30', 2710), (2288, '14:15', 2930), (2288, '16:25', 3520), (2288, '20:20', 4000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2289, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'FRA'; -- 6190 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2289, '08:15', 2410), (2289, '10:00', 2570), (2289, '14:10', 4120), (2289, '16:35', 2090), (2289, '20:10', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2290, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MUC'; -- 6482 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2290, '07:10', 1570), (2290, '09:00', 2640), (2290, '11:35', 4050), (2290, '13:50', 990), (2290, '15:35', 1570), (2290, '18:40', 80000), (2290, '20:15', 171710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2291, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BER'; -- 6390 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2291, '07:15', 1190), (2291, '10:30', 3350), (2291, '12:30', 3740), (2291, '15:00', 470), (2291, '16:55', 37660), (2291, '19:50', 95060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2292, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'ZRH'; -- 6310 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2292, '06:35', 1680), (2292, '10:10', 2760), (2292, '11:45', 2690), (2292, '15:20', 600), (2292, '17:55', 619180), (2292, '20:10', 3680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2293, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'VIE'; -- 6805 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2293, '07:20', 3830), (2293, '09:20', 2590), (2293, '10:55', 4000), (2293, '13:20', 910), (2293, '15:25', 11130), (2293, '18:30', 3870), (2293, '20:55', 956620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2294, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'PRG'; -- 6551 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2294, '07:50', 3410), (2294, '10:25', 4200), (2294, '13:05', 950), (2294, '14:40', 3120), (2294, '17:05', 2340), (2294, '20:20', 340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2295, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'WAW'; -- 6848 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2295, '07:20', 4970), (2295, '08:50', 4870), (2295, '11:15', 2490), (2295, '13:35', 1150), (2295, '16:30', 4760), (2295, '18:25', 2270), (2295, '20:40', 4920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2296, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BCN'; -- 6150 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2296, '07:05', 388090), (2296, '09:05', 103020), (2296, '12:05', 2530), (2296, '13:40', 1120), (2296, '16:05', 580), (2296, '17:40', 3900), (2296, '20:15', 1500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2297, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MAD'; -- 5761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2297, '07:50', 4080), (2297, '09:40', 4680), (2297, '12:10', 2790), (2297, '15:25', 850), (2297, '17:55', 41690), (2297, '20:50', 460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2298, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'AGP'; -- 5873 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2298, '06:45', 1960), (2298, '09:35', 2760), (2298, '12:25', 60100), (2298, '15:40', 1830), (2298, '17:35', 630), (2298, '20:50', 4620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2299, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'PMI'; -- 6289 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2299, '07:35', 1490), (2299, '09:25', 4510), (2299, '10:55', 57480), (2299, '14:05', 2320), (2299, '15:45', 560), (2299, '18:45', 2440), (2299, '20:20', 4480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2300, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'LPA'; -- 5445 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2300, '07:40', 777220), (2300, '08:45', 1140), (2300, '11:10', 3940), (2300, '13:15', 3360), (2300, '15:50', 64260), (2300, '18:10', 3500), (2300, '20:10', 2010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2301, f.id, t.id, 435 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'LIS'; -- 5405 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2301, '07:10', 2060), (2301, '10:10', 1650), (2301, '12:55', 4550), (2301, '17:10', 260), (2301, '20:20', 860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2302, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'FCO'; -- 6867 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2302, '06:55', 230), (2302, '08:45', 3410), (2302, '11:10', 220), (2302, '13:40', 3050), (2302, '16:30', 790), (2302, '17:50', 51480), (2302, '20:20', 200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2303, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'MXP'; -- 6412 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2303, '07:35', 603430), (2303, '08:40', 3160), (2303, '11:50', 320), (2303, '13:55', 4490), (2303, '16:00', 3600), (2303, '18:05', 810), (2303, '20:50', 2160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2304, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'ATH'; -- 7932 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2304, '07:05', 830), (2304, '09:30', 98720), (2304, '12:25', 991830), (2304, '14:50', 642390), (2304, '17:50', 1110), (2304, '20:35', 1530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2305, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'IST'; -- 8027 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2305, '08:20', 330), (2305, '11:00', 3850), (2305, '14:05', 73880), (2305, '17:35', 4590), (2305, '20:00', 3270);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2306, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'DXB'; -- 11002 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2306, '07:05', 2420), (2306, '09:40', 746140), (2306, '11:45', 638450), (2306, '14:15', 1060), (2306, '16:10', 2650), (2306, '17:45', 31050), (2306, '21:00', 159440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2307, f.id, t.id, 1075 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'BKK'; -- 13948 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2307, '07:15', 4110), (2307, '10:00', 4780), (2307, '13:10', 980), (2307, '14:35', 666530), (2307, '17:35', 4170), (2307, '19:30', 630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2308, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'JFK' AND t.iata = 'EWR'; -- 33 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2308, '08:00', 2720), (2308, '09:50', 2890), (2308, '11:50', 3890), (2308, '14:30', 1670), (2308, '17:05', 290), (2308, '19:35', 4930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2309, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BMA'; -- 6323 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2309, '07:35', 2340), (2309, '09:15', 2700), (2309, '11:05', 3250), (2309, '14:00', 770), (2309, '15:55', 3050), (2309, '18:25', 4520), (2309, '20:30', 852890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2310, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'GOT'; -- 6097 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2310, '07:55', 1490), (2310, '11:00', 230), (2310, '14:30', 690), (2310, '17:25', 3560), (2310, '20:45', 3070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2311, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MMX'; -- 6252 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2311, '07:40', 4330), (2311, '10:25', 3630), (2311, '12:00', 3100), (2311, '15:35', 1590), (2311, '17:50', 2120), (2311, '19:30', 3520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2312, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'LLA'; -- 6228 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2312, '07:05', 4530), (2312, '10:20', 3890), (2312, '13:10', 3970), (2312, '14:20', 526250), (2312, '18:20', 3940), (2312, '19:55', 3140);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2313, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'VBY'; -- 6426 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2313, '07:20', 4600), (2313, '09:20', 4450), (2313, '12:45', 1450), (2313, '15:30', 77340), (2313, '17:45', 3320), (2313, '19:55', 4780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2314, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'UME'; -- 6229 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2314, '07:45', 4820), (2314, '10:05', 2860), (2314, '12:35', 750), (2314, '15:30', 3230), (2314, '16:55', 4310), (2314, '20:10', 4570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2315, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'OSD'; -- 5988 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2315, '07:00', 160), (2315, '09:40', 2090), (2315, '11:25', 1090), (2315, '13:10', 840), (2315, '16:00', 850), (2315, '18:00', 3940), (2315, '19:50', 230220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2316, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'KRN'; -- 6056 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2316, '07:30', 1970), (2316, '09:50', 4780), (2316, '14:15', 2950), (2316, '17:15', 3020), (2316, '19:55', 2560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2317, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'OSL'; -- 5933 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2317, '07:00', 4750), (2317, '11:20', 170), (2317, '14:40', 52410), (2317, '17:10', 33880), (2317, '19:20', 1130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2318, f.id, t.id, 450 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BGO'; -- 5620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2318, '07:05', 640), (2318, '08:55', 710970), (2318, '11:50', 1930), (2318, '13:40', 1240), (2318, '16:25', 1530), (2318, '18:25', 280360), (2318, '20:15', 2440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2319, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'TRD'; -- 5810 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2319, '06:40', 3570), (2319, '09:45', 1450), (2319, '12:55', 1590), (2319, '16:10', 30490), (2319, '19:25', 540);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2320, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'CPH'; -- 6207 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2320, '07:15', 3230), (2320, '10:00', 730), (2320, '13:25', 2630), (2320, '17:05', 4690), (2320, '20:25', 3830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2321, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'AAL'; -- 5985 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2321, '07:20', 22300), (2321, '09:20', 855650), (2321, '11:30', 4930), (2321, '13:40', 4120), (2321, '16:05', 572870), (2321, '18:00', 1760), (2321, '20:50', 4280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2322, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'HEL'; -- 6621 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2322, '07:05', 66740), (2322, '09:25', 3790), (2322, '11:40', 36430), (2322, '13:30', 3130), (2322, '16:15', 2250), (2322, '18:10', 569790), (2322, '20:00', 1500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2323, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'KEF'; -- 4177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2323, '07:30', 2760), (2323, '10:10', 4050), (2323, '12:55', 440), (2323, '16:15', 631520), (2323, '20:00', 486530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2324, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'TLL'; -- 6665 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2324, '07:10', 54320), (2324, '10:15', 2930), (2324, '12:45', 2630), (2324, '15:00', 3980), (2324, '18:20', 562540), (2324, '20:55', 80680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2325, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'RIX'; -- 6762 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2325, '07:15', 480), (2325, '09:20', 330), (2325, '12:35', 2310), (2325, '14:25', 1260), (2325, '17:00', 3580), (2325, '20:00', 650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2326, f.id, t.id, 435 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MAN'; -- 5383 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2326, '06:30', 4010), (2326, '09:25', 3630), (2326, '11:00', 4900), (2326, '13:15', 2610), (2326, '15:50', 947970), (2326, '17:40', 2970), (2326, '20:35', 29590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2327, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'EDI'; -- 5245 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2327, '08:05', 2150), (2327, '10:15', 4290), (2327, '14:05', 420), (2327, '16:30', 3110), (2327, '20:40', 4310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2328, f.id, t.id, 415 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'DUB'; -- 5126 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2328, '06:55', 210), (2328, '09:40', 3870), (2328, '11:20', 2490), (2328, '14:00', 2900), (2328, '16:25', 2500), (2328, '17:35', 2370), (2328, '20:15', 4590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2329, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'CDG'; -- 5857 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2329, '07:50', 686170), (2329, '09:10', 37940), (2329, '12:35', 470), (2329, '15:15', 2560), (2329, '18:15', 3860), (2329, '20:05', 201970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2330, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'NCE'; -- 6432 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2330, '07:20', 1560), (2330, '09:55', 65010), (2330, '12:55', 800), (2330, '17:20', 3140), (2330, '20:45', 4770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2331, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'AMS'; -- 5868 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2331, '07:15', 3680), (2331, '09:50', 3140), (2331, '13:15', 3040), (2331, '16:30', 2590), (2331, '19:10', 4100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2332, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BRU'; -- 5907 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2332, '07:15', 540), (2332, '10:15', 520), (2332, '14:30', 3610), (2332, '17:05', 2860), (2332, '20:05', 1070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2333, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'FRA'; -- 6211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2333, '06:45', 2340), (2333, '09:55', 3510), (2333, '12:10', 4600), (2333, '15:45', 4720), (2333, '18:20', 2630), (2333, '20:15', 62260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2334, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MUC'; -- 6504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2334, '07:05', 1320), (2334, '10:25', 2810), (2334, '12:55', 715680), (2334, '17:40', 940), (2334, '19:50', 1520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2335, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BER'; -- 6410 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2335, '08:20', 1370), (2335, '10:00', 2980), (2335, '14:25', 2160), (2335, '16:15', 1440), (2335, '19:20', 2680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2336, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'ZRH'; -- 6333 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2336, '07:10', 1070), (2336, '09:00', 1140), (2336, '10:55', 4960), (2336, '13:10', 310), (2336, '16:25', 3830), (2336, '18:25', 4230), (2336, '20:15', 4520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2337, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'VIE'; -- 6827 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2337, '07:30', 290), (2337, '09:50', 4730), (2337, '11:05', 119280), (2337, '13:50', 263770), (2337, '15:25', 1380), (2337, '18:20', 4360), (2337, '20:45', 3560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2338, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'PRG'; -- 6572 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2338, '07:05', 2450), (2338, '09:15', 2630), (2338, '12:40', 660), (2338, '15:30', 79570), (2338, '17:00', 4400), (2338, '19:35', 40740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2339, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'WAW'; -- 6867 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2339, '07:50', 346330), (2339, '09:25', 2960), (2339, '12:40', 1920), (2339, '14:30', 3170), (2339, '18:20', 3340), (2339, '20:00', 530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2340, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BCN'; -- 6177 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2340, '07:35', 3320), (2340, '09:05', 79260), (2340, '11:45', 240), (2340, '13:50', 3390), (2340, '15:20', 760), (2340, '17:40', 1450), (2340, '20:35', 3760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2341, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MAD'; -- 5788 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2341, '07:25', 2570), (2341, '09:30', 1720), (2341, '11:45', 4540), (2341, '15:40', 387310), (2341, '17:20', 3410), (2341, '19:30', 2990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2342, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'AGP'; -- 5903 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2342, '07:55', 4780), (2342, '09:10', 3740), (2342, '11:50', 4580), (2342, '15:15', 480), (2342, '17:00', 2540), (2342, '20:20', 1790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2343, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'PMI'; -- 6316 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2343, '07:30', 740), (2343, '10:35', 187160), (2343, '13:45', 4860), (2343, '16:20', 130780), (2343, '20:45', 3450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2344, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'LPA'; -- 5478 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2344, '07:15', 2650), (2344, '09:55', 1880), (2344, '12:10', 870), (2344, '14:10', 92710), (2344, '16:25', 1140), (2344, '17:45', 951290), (2344, '20:15', 657560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2345, f.id, t.id, 440 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'LIS'; -- 5434 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2345, '07:35', 2530), (2345, '09:35', 4380), (2345, '11:40', 490), (2345, '14:15', 1960), (2345, '16:25', 207930), (2345, '18:15', 3390), (2345, '20:45', 77990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2346, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'FCO'; -- 6891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2346, '07:50', 1830), (2346, '09:50', 4760), (2346, '13:50', 2780), (2346, '16:40', 1180), (2346, '19:15', 820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2347, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MXP'; -- 6436 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2347, '08:15', 717820), (2347, '11:20', 1050), (2347, '14:15', 710), (2347, '16:30', 1710), (2347, '19:40', 2340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2348, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'ATH'; -- 7956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2348, '07:50', 1150), (2348, '09:40', 3810), (2348, '12:20', 430), (2348, '15:35', 1810), (2348, '17:00', 1410), (2348, '19:40', 1890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2349, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'IST'; -- 8049 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2349, '06:45', 2410), (2349, '11:10', 4760), (2349, '13:55', 3660), (2349, '16:15', 940), (2349, '20:50', 3370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2350, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'DXB'; -- 11021 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2350, '06:50', 4730), (2350, '08:55', 4420), (2350, '11:20', 27550), (2350, '13:35', 4220), (2350, '15:30', 3900), (2350, '18:45', 2190), (2350, '20:20', 2310);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2351, f.id, t.id, 1075 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'BKK'; -- 13946 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2351, '08:20', 132730), (2351, '11:20', 2180), (2351, '14:25', 400), (2351, '16:20', 410), (2351, '20:15', 3860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2352, f.id, t.id, 35 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'JFK'; -- 33 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2352, '06:55', 70780), (2352, '09:40', 460), (2352, '13:05', 4970), (2352, '15:45', 2000), (2352, '18:05', 3820), (2352, '20:05', 780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2353, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'ORD'; -- 1154 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2353, '08:10', 1100), (2353, '10:15', 4190), (2353, '14:40', 1520), (2353, '16:05', 4280), (2353, '20:15', 1940);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2354, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'MIA'; -- 1751 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2354, '07:30', 3550), (2354, '10:25', 1350), (2354, '14:25', 4870), (2354, '16:30', 2560), (2354, '19:05', 700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2355, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'LAX'; -- 3941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2355, '07:30', 1100), (2355, '09:25', 1080), (2355, '12:15', 440), (2355, '15:25', 2180), (2355, '17:00', 4070), (2355, '20:00', 2970);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2356, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'EWR' AND t.iata = 'YYZ'; -- 559 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2356, '07:30', 66750), (2356, '10:05', 2990), (2356, '13:05', 17550), (2356, '15:30', 3960), (2356, '17:00', 35820), (2356, '19:50', 2720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2357, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'ARN'; -- 6856 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2357, '07:10', 7310), (2357, '10:40', 1430), (2357, '13:55', 2490), (2357, '17:35', 1690), (2357, '20:15', 52000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2358, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BMA'; -- 6876 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2358, '07:40', 1190), (2358, '09:30', 67070), (2358, '11:20', 3490), (2358, '13:10', 430), (2358, '16:15', 700), (2358, '17:55', 4100), (2358, '20:55', 326070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2359, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'GOT'; -- 6710 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2359, '07:15', 4160), (2359, '10:15', 1290), (2359, '12:05', 59500), (2359, '15:35', 601660), (2359, '17:15', 3440), (2359, '19:45', 57430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2360, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MMX'; -- 6895 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2360, '07:25', 3970), (2360, '09:00', 1380), (2360, '12:05', 1690), (2360, '13:15', 4130), (2360, '15:50', 2870), (2360, '17:45', 1990), (2360, '20:50', 4180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2361, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'LLA'; -- 6646 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2361, '08:10', 1790), (2361, '10:00', 710), (2361, '12:50', 2630), (2361, '17:45', 570), (2361, '19:45', 4830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2362, f.id, t.id, 555 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'VBY'; -- 7006 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2362, '08:05', 488760), (2362, '11:15', 3070), (2362, '13:15', 1900), (2362, '16:40', 475630), (2362, '20:30', 3890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2363, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'UME'; -- 6689 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2363, '06:55', 1160), (2363, '10:30', 1820), (2363, '12:50', 290), (2363, '17:35', 13420), (2363, '19:05', 920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2364, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'OSD'; -- 6486 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2364, '07:10', 455750), (2364, '09:25', 25830), (2364, '11:20', 3900), (2364, '13:20', 4560), (2364, '16:30', 400), (2364, '18:35', 410), (2364, '19:45', 3170);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2365, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'KRN'; -- 6437 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2365, '07:50', 1820), (2365, '09:40', 3880), (2365, '12:35', 3750), (2365, '15:30', 500), (2365, '17:50', 741810), (2365, '19:30', 190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2366, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'OSL'; -- 6504 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2366, '07:50', 3770), (2366, '09:50', 3450), (2366, '12:15', 3340), (2366, '15:15', 3170), (2366, '17:40', 2190), (2366, '20:35', 2300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2367, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BGO'; -- 6214 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2367, '06:55', 3830), (2367, '09:55', 2600), (2367, '13:45', 1440), (2367, '16:30', 4290), (2367, '19:10', 1450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2368, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'TRD'; -- 6317 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2368, '07:35', 2120), (2368, '10:10', 2440), (2368, '12:55', 86880), (2368, '16:25', 1420), (2368, '20:10', 1350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2369, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'CPH'; -- 6853 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2369, '07:40', 1590), (2369, '09:20', 3840), (2369, '12:15', 4130), (2369, '15:20', 4370), (2369, '17:45', 820), (2369, '20:15', 2800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2370, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'AAL'; -- 6620 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2370, '06:55', 1970), (2370, '09:30', 4060), (2370, '10:55', 36700), (2370, '13:20', 14460), (2370, '16:00', 4030), (2370, '18:40', 1840), (2370, '20:30', 4820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2371, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'HEL'; -- 7118 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2371, '07:20', 1870), (2371, '08:50', 4730), (2371, '12:10', 4210), (2371, '13:25', 1090), (2371, '16:00', 1190), (2371, '18:10', 1640), (2371, '20:55', 92900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2372, f.id, t.id, 385 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'KEF'; -- 4725 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2372, '07:55', 302970), (2372, '10:35', 840), (2372, '14:15', 4100), (2372, '17:45', 1950), (2372, '20:15', 45510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2373, f.id, t.id, 570 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'TLL'; -- 7178 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2373, '07:25', 3030), (2373, '08:50', 180), (2373, '12:10', 4970), (2373, '13:50', 580), (2373, '15:50', 3130), (2373, '17:50', 2680), (2373, '20:10', 3280);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2374, f.id, t.id, 580 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'RIX'; -- 7321 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2374, '07:05', 1350), (2374, '09:45', 2890), (2374, '13:55', 4510), (2374, '17:15', 2180), (2374, '20:00', 4150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2375, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'LHR'; -- 6344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2375, '07:30', 2400), (2375, '09:25', 1290), (2375, '11:05', 2040), (2375, '13:40', 1320), (2375, '16:20', 5000), (2375, '18:40', 1050), (2375, '19:45', 1120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2376, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MAN'; -- 6139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2376, '07:10', 3010), (2376, '08:50', 360), (2376, '11:55', 2150), (2376, '14:00', 3880), (2376, '16:25', 27160), (2376, '18:40', 722620), (2376, '20:00', 491580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2377, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'EDI'; -- 5956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2377, '07:00', 2960), (2377, '10:15', 450), (2377, '12:05', 84640), (2377, '14:50', 95480), (2377, '17:45', 396500), (2377, '20:10', 74450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2378, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'DUB'; -- 5896 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2378, '07:55', 4690), (2378, '10:30', 1140), (2378, '12:15', 680), (2378, '14:40', 1760), (2378, '17:15', 1180), (2378, '20:20', 1290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2379, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'CDG'; -- 6664 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2379, '07:00', 159940), (2379, '08:45', 963230), (2379, '10:55', 3430), (2379, '13:50', 90580), (2379, '16:10', 1150), (2379, '18:40', 2820), (2379, '20:05', 590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2380, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'NCE'; -- 7290 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2380, '07:45', 2800), (2380, '11:25', 2160), (2380, '13:40', 3860), (2380, '16:55', 3390), (2380, '19:50', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2381, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'AMS'; -- 6611 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2381, '07:35', 50970), (2381, '09:35', 1930), (2381, '11:55', 1460), (2381, '14:05', 1090), (2381, '16:05', 570), (2381, '18:35', 3880), (2381, '21:00', 1650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2382, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BRU'; -- 6675 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2382, '08:00', 3070), (2382, '09:10', 4090), (2382, '12:00', 180), (2382, '15:25', 425180), (2382, '18:15', 2880), (2382, '20:00', 2120);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2383, f.id, t.id, 555 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'FRA'; -- 6971 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2383, '07:50', 270), (2383, '10:20', 3360), (2383, '12:20', 4730), (2383, '15:05', 1930), (2383, '17:05', 1230), (2383, '19:50', 87860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2384, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MUC'; -- 7270 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2384, '08:00', 3240), (2384, '09:15', 3330), (2384, '12:45', 4270), (2384, '14:25', 620), (2384, '18:05', 3080), (2384, '19:45', 728260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2385, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BER'; -- 7105 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2385, '06:50', 3080), (2385, '09:20', 4490), (2385, '11:20', 15410), (2385, '14:00', 900), (2385, '15:35', 300800), (2385, '17:55', 195000), (2385, '20:10', 3160);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2386, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'ZRH'; -- 7131 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2386, '07:05', 4780), (2386, '09:55', 4060), (2386, '12:55', 3500), (2386, '15:25', 1930), (2386, '16:55', 1990), (2386, '20:35', 1290);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2387, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'VIE'; -- 7566 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2387, '08:10', 170), (2387, '11:30', 177070), (2387, '13:40', 145710), (2387, '16:15', 4460), (2387, '20:35', 833440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2388, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'PRG'; -- 7297 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2388, '07:25', 2880), (2388, '09:50', 3900), (2388, '12:10', 2060), (2388, '15:30', 1420), (2388, '17:50', 180), (2388, '20:45', 2660);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2389, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'WAW'; -- 7518 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2389, '07:15', 45660), (2389, '09:25', 800), (2389, '11:50', 66110), (2389, '13:15', 3790), (2389, '16:10', 380960), (2389, '17:40', 4880), (2389, '19:55', 25580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2390, f.id, t.id, 560 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BCN'; -- 7093 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2390, '08:15', 4220), (2390, '10:45', 790), (2390, '13:55', 4980), (2390, '17:10', 2180), (2390, '19:45', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2391, f.id, t.id, 535 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MAD'; -- 6744 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2391, '07:00', 1060), (2391, '10:35', 2180), (2391, '12:40', 745240), (2391, '15:25', 4230), (2391, '17:10', 4690), (2391, '20:05', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2392, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'AGP'; -- 6905 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2392, '07:20', 3680), (2392, '10:35', 2280), (2392, '12:25', 711620), (2392, '14:30', 4210), (2392, '17:10', 3180), (2392, '20:55', 1950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2393, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'PMI'; -- 7250 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2393, '07:05', 840), (2393, '09:25', 4810), (2393, '11:50', 2700), (2393, '15:40', 840860), (2393, '17:30', 40800), (2393, '20:15', 4600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2394, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'LPA'; -- 6593 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2394, '07:45', 451130), (2394, '08:45', 2120), (2394, '11:25', 84940), (2394, '13:45', 86720), (2394, '15:20', 4710), (2394, '18:15', 3780), (2394, '20:20', 34720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2395, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'LIS'; -- 6436 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2395, '06:35', 4400), (2395, '09:00', 73910), (2395, '11:10', 1040), (2395, '13:40', 4250), (2395, '16:05', 360710), (2395, '17:45', 180), (2395, '20:00', 2650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2396, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'FCO'; -- 7742 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2396, '07:50', 4940), (2396, '11:10', 4320), (2396, '13:30', 51420), (2396, '16:10', 3430), (2396, '19:35', 28130);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2397, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MXP'; -- 7259 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2397, '07:20', 2870), (2397, '09:00', 1140), (2397, '10:55', 3930), (2397, '13:30', 3430), (2397, '15:35', 246590), (2397, '18:35', 3910), (2397, '20:05', 1620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2398, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'ATH'; -- 8769 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2398, '06:30', 1980), (2398, '09:30', 659240), (2398, '11:45', 2020), (2398, '13:50', 990), (2398, '15:30', 250), (2398, '18:00', 3120), (2398, '20:40', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2399, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'IST'; -- 8786 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2399, '07:20', 330940), (2399, '09:45', 2520), (2399, '11:45', 700), (2399, '13:40', 1800), (2399, '16:25', 4750), (2399, '17:45', 1590), (2399, '20:50', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2400, f.id, t.id, 905 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'DXB'; -- 11640 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2400, '06:50', 3420), (2400, '09:05', 4380), (2400, '11:05', 620), (2400, '13:50', 4840), (2400, '16:25', 1680), (2400, '17:45', 840), (2400, '21:00', 3650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2401, f.id, t.id, 1060 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'BKK'; -- 13762 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2401, '06:55', 3340), (2401, '08:50', 49200), (2401, '12:10', 3230), (2401, '13:15', 3330), (2401, '16:35', 42380), (2401, '18:05', 4230), (2401, '20:25', 4880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2402, f.id, t.id, 115 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'EWR'; -- 1154 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2402, '08:20', 1940), (2402, '10:10', 4450), (2402, '14:35', 3190), (2402, '17:25', 630), (2402, '20:00', 205500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2403, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'MIA'; -- 1930 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2403, '06:55', 1170), (2403, '10:35', 2210), (2403, '13:00', 706410), (2403, '16:55', 2720), (2403, '19:55', 52110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2404, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'LAX'; -- 2803 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2404, '08:20', 670), (2404, '10:25', 450), (2404, '13:15', 4460), (2404, '16:25', 97100), (2404, '19:50', 4070);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2405, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'ORD' AND t.iata = 'YYZ'; -- 700 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2405, '07:45', 380), (2405, '09:15', 1820), (2405, '12:05', 4930), (2405, '13:15', 22070), (2405, '16:05', 1760), (2405, '18:25', 4750), (2405, '20:20', 4380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2406, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'ARN'; -- 7996 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2406, '06:55', 4120), (2406, '09:30', 4760), (2406, '12:05', 1810), (2406, '14:20', 280), (2406, '15:40', 1800), (2406, '17:55', 2430), (2406, '20:25', 2600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2407, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BMA'; -- 8009 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2407, '08:10', 3240), (2407, '11:20', 3680), (2407, '13:00', 4900), (2407, '17:05', 4710), (2407, '20:50', 2700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2408, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'GOT'; -- 7757 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2408, '07:05', 471270), (2408, '10:25', 470), (2408, '11:50', 2250), (2408, '15:25', 1410), (2408, '18:15', 3750), (2408, '20:05', 1040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2409, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'MMX'; -- 7891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2409, '08:20', 4800), (2409, '10:55', 2210), (2409, '14:00', 4850), (2409, '16:15', 2650), (2409, '20:25', 960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2410, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'LLA'; -- 7960 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2410, '06:50', 2180), (2410, '09:55', 221540), (2410, '13:05', 1360), (2410, '16:45', 86880), (2410, '20:35', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2411, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'VBY'; -- 8098 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2411, '08:05', 2410), (2411, '09:50', 830), (2411, '14:35', 3410), (2411, '17:25', 680), (2411, '19:25', 190);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2412, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'UME'; -- 7950 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2412, '07:40', 350), (2412, '09:10', 680), (2412, '11:50', 1010), (2412, '14:35', 1250), (2412, '17:15', 3450), (2412, '20:45', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2413, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'OSD'; -- 7700 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2413, '06:40', 730), (2413, '10:40', 2840), (2413, '14:05', 3250), (2413, '17:25', 4630), (2413, '20:35', 4340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2414, f.id, t.id, 615 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'KRN'; -- 7796 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2414, '06:50', 1940), (2414, '09:55', 2560), (2414, '11:45', 810), (2414, '14:30', 450), (2414, '17:40', 500), (2414, '20:30', 59510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2415, f.id, t.id, 600 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'OSL'; -- 7616 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2415, '07:30', 2630), (2415, '09:35', 3200), (2415, '11:35', 2540), (2415, '13:40', 3760), (2415, '16:30', 3240), (2415, '18:45', 1470), (2415, '20:20', 1030);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2416, f.id, t.id, 575 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BGO'; -- 7296 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2416, '06:40', 1110), (2416, '09:45', 2910), (2416, '13:00', 520), (2416, '15:45', 530), (2416, '17:00', 1590), (2416, '20:40', 98960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2417, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'TRD'; -- 7519 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2417, '07:05', 4890), (2417, '09:40', 322690), (2417, '12:55', 2700), (2417, '14:25', 2380), (2417, '17:55', 4360), (2417, '19:40', 1390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2418, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'CPH'; -- 7845 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2418, '07:20', 1910), (2418, '10:30', 4890), (2418, '14:30', 2860), (2418, '17:30', 3160), (2418, '20:10', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2419, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'AAL'; -- 7634 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2419, '06:40', 3940), (2419, '09:10', 3140), (2419, '12:00', 1800), (2419, '14:10', 1820), (2419, '15:50', 3400), (2419, '18:15', 3420), (2419, '20:05', 74110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2420, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'HEL'; -- 8327 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2420, '06:35', 74290), (2420, '09:10', 1150), (2420, '11:55', 1310), (2420, '14:50', 380), (2420, '17:20', 119150), (2420, '20:50', 4800);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2421, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'KEF'; -- 5891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2421, '08:00', 1430), (2421, '10:55', 1790), (2421, '14:30', 4630), (2421, '17:35', 1660), (2421, '19:10', 2980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2422, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'TLL'; -- 8365 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2422, '06:50', 919760), (2422, '09:45', 3780), (2422, '11:05', 311910), (2422, '13:30', 35130), (2422, '15:55', 87910), (2422, '18:10', 1890), (2422, '19:50', 3790);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2423, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'RIX'; -- 8440 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2423, '07:05', 3970), (2423, '10:10', 372630), (2423, '12:05', 3500), (2423, '15:00', 3590), (2423, '17:00', 4570), (2423, '19:40', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2424, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'LHR'; -- 7110 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2424, '07:50', 430350), (2424, '10:15', 3410), (2424, '12:25', 160), (2424, '14:20', 2170), (2424, '17:30', 3780), (2424, '20:50', 750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2425, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'MAN'; -- 6957 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2425, '06:55', 2400), (2425, '09:40', 4580), (2425, '12:00', 21530), (2425, '13:25', 93790), (2425, '16:05', 1890), (2425, '18:45', 160), (2425, '19:45', 72770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2426, f.id, t.id, 545 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'EDI'; -- 6857 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2426, '07:50', 64280), (2426, '11:20', 3760), (2426, '13:50', 3240), (2426, '16:25', 42730), (2426, '20:20', 430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2427, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'DUB'; -- 6694 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2427, '07:40', 4450), (2427, '10:00', 771660), (2427, '14:15', 1750), (2427, '17:10', 1410), (2427, '20:45', 1470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2428, f.id, t.id, 585 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'CDG'; -- 7372 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2428, '06:50', 2020), (2428, '09:50', 3890), (2428, '11:55', 2620), (2428, '14:20', 2260), (2428, '16:00', 630), (2428, '18:45', 2440), (2428, '20:25', 83850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2429, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'NCE'; -- 7874 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2429, '06:30', 637120), (2429, '09:35', 680), (2429, '11:00', 2690), (2429, '13:40', 2900), (2429, '16:35', 84310), (2429, '17:55', 4150), (2429, '20:05', 880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2430, f.id, t.id, 590 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'AMS'; -- 7443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2430, '07:05', 1700), (2430, '10:15', 3850), (2430, '11:45', 860), (2430, '15:40', 18340), (2430, '17:25', 200), (2430, '19:55', 1860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2431, f.id, t.id, 590 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BRU'; -- 7459 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2431, '07:55', 3250), (2431, '09:55', 620630), (2431, '13:25', 3900), (2431, '16:55', 2370), (2431, '19:10', 180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2432, f.id, t.id, 610 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'FRA'; -- 7764 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2432, '07:15', 2440), (2432, '10:20', 2030), (2432, '13:30', 1680), (2432, '17:25', 730), (2432, '19:10', 4720);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2433, f.id, t.id, 635 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'MUC'; -- 8044 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2433, '07:50', 3740), (2433, '10:10', 75280), (2433, '12:40', 2900), (2433, '14:35', 170), (2433, '17:25', 3230), (2433, '20:15', 4610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2434, f.id, t.id, 630 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BER'; -- 8011 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2434, '08:20', 1300), (2434, '10:50', 1220), (2434, '13:30', 910), (2434, '17:45', 3890), (2434, '19:45', 563000);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2435, f.id, t.id, 620 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'ZRH'; -- 7845 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2435, '06:35', 4040), (2435, '09:45', 3310), (2435, '11:50', 1280), (2435, '15:00', 460), (2435, '17:40', 947110), (2435, '19:50', 2320);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2436, f.id, t.id, 660 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'VIE'; -- 8384 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2436, '07:10', 2780), (2436, '08:50', 3730), (2436, '11:20', 4980), (2436, '13:50', 3570), (2436, '16:20', 162730), (2436, '17:50', 966130), (2436, '20:50', 4710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2437, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'PRG'; -- 8147 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2437, '06:55', 4400), (2437, '10:55', 8230), (2437, '13:25', 1360), (2437, '16:55', 2540), (2437, '20:30', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2438, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'WAW'; -- 8491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2438, '07:10', 2170), (2438, '09:35', 3830), (2438, '12:30', 4190), (2438, '14:30', 4120), (2438, '17:40', 3780), (2438, '20:25', 3110);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2439, f.id, t.id, 595 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BCN'; -- 7545 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2439, '07:00', 16860), (2439, '09:25', 4940), (2439, '11:45', 3540), (2439, '13:15', 1720), (2439, '15:50', 4510), (2439, '18:30', 59840), (2439, '20:30', 3990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2440, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'MAD'; -- 7106 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2440, '06:40', 2320), (2440, '09:15', 1200), (2440, '12:20', 2190), (2440, '15:25', 2700), (2440, '17:55', 2690), (2440, '20:35', 520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2441, f.id, t.id, 565 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'AGP'; -- 7125 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2441, '07:35', 91830), (2441, '10:35', 1280), (2441, '13:25', 1780), (2441, '17:00', 580), (2441, '20:30', 4380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2442, f.id, t.id, 605 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'PMI'; -- 7653 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2442, '07:05', 3740), (2442, '08:45', 3080), (2442, '11:05', 346980), (2442, '13:55', 2290), (2442, '16:05', 2170), (2442, '17:45', 4340), (2442, '20:05', 2600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2443, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'LPA'; -- 6364 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2443, '06:35', 2340), (2443, '09:20', 4250), (2443, '12:10', 1770), (2443, '14:20', 3770), (2443, '16:15', 534570), (2443, '18:15', 4190), (2443, '20:20', 570);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2444, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'LIS'; -- 6678 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2444, '06:45', 18320), (2444, '09:20', 3190), (2444, '12:05', 4820), (2444, '13:25', 2350), (2444, '16:20', 425410), (2444, '18:30', 420), (2444, '19:55', 1460);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2445, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'FCO'; -- 8330 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2445, '06:55', 592710), (2445, '09:30', 3970), (2445, '12:00', 500), (2445, '15:30', 550), (2445, '17:15', 4550), (2445, '20:40', 1450);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2446, f.id, t.id, 625 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'MXP'; -- 7920 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2446, '07:40', 4770), (2446, '09:50', 3690), (2446, '12:35', 2360), (2446, '14:20', 2200), (2446, '18:05', 1810), (2446, '20:50', 1260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2447, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'ATH'; -- 9415 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2447, '07:00', 3040), (2447, '10:05', 74620), (2447, '11:45', 4020), (2447, '15:05', 830), (2447, '16:55', 4300), (2447, '19:55', 3230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2448, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'IST'; -- 9585 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2448, '07:35', 4820), (2448, '11:00', 4640), (2448, '13:40', 2370), (2448, '16:40', 716380), (2448, '19:30', 4670);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2449, f.id, t.id, 975 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'DXB'; -- 12607 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2449, '07:20', 75740), (2449, '11:05', 4070), (2449, '13:00', 4220), (2449, '17:10', 4590), (2449, '20:50', 4410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2450, f.id, t.id, 1200 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'BKK'; -- 15624 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2450, '06:55', 370), (2450, '09:35', 2130), (2450, '12:50', 1890), (2450, '14:40', 3910), (2450, '18:15', 1550), (2450, '20:30', 3630);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2451, f.id, t.id, 160 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'EWR'; -- 1751 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2451, '07:40', 4440), (2451, '10:20', 4960), (2451, '12:40', 620), (2451, '14:35', 3270), (2451, '17:15', 4950), (2451, '19:35', 724370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2452, f.id, t.id, 175 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'ORD'; -- 1930 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2452, '07:45', 4370), (2452, '09:15', 33430), (2452, '11:20', 3620), (2452, '13:35', 2290), (2452, '15:20', 3330), (2452, '17:45', 6290), (2452, '20:20', 3910);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2453, f.id, t.id, 310 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'LAX'; -- 3763 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2453, '06:35', 4970), (2453, '09:15', 4190), (2453, '11:55', 3660), (2453, '13:55', 530), (2453, '15:25', 2890), (2453, '18:05', 3950), (2453, '20:30', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2454, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'MIA' AND t.iata = 'YYZ'; -- 1990 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2454, '08:05', 2790), (2454, '11:25', 1440), (2454, '12:55', 325990), (2454, '16:15', 2390), (2454, '19:20', 1260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2455, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'ARN'; -- 8864 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2455, '07:45', 297600), (2455, '09:00', 8150), (2455, '12:00', 60770), (2455, '13:55', 850), (2455, '16:20', 2460), (2455, '18:40', 40390), (2455, '20:30', 410);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2456, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BMA'; -- 8891 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2456, '06:35', 59760), (2456, '10:00', 3540), (2456, '12:55', 3730), (2456, '15:25', 430), (2456, '18:15', 8400), (2456, '20:55', 1230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2457, f.id, t.id, 695 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'GOT'; -- 8839 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2457, '06:55', 4340), (2457, '10:15', 3650), (2457, '12:30', 150), (2457, '14:55', 830), (2457, '17:25', 14940), (2457, '20:55', 1740);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2458, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MMX'; -- 9064 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2458, '07:25', 2110), (2458, '09:40', 2770), (2458, '12:00', 2790), (2458, '14:00', 4900), (2458, '15:30', 3410), (2458, '17:35', 400), (2458, '19:55', 17300);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2459, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'LLA'; -- 8443 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2459, '07:25', 1000), (2459, '10:05', 63990), (2459, '13:00', 2730), (2459, '14:40', 2870), (2459, '17:50', 4650), (2459, '19:30', 2920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2460, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'VBY'; -- 9058 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2460, '06:45', 4900), (2460, '09:25', 3830), (2460, '13:05', 4530), (2460, '14:25', 3000), (2460, '17:35', 3880), (2460, '20:35', 2880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2461, f.id, t.id, 670 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'UME'; -- 8557 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2461, '07:45', 36430), (2461, '09:45', 3140), (2461, '11:05', 8400), (2461, '14:05', 980), (2461, '15:35', 190), (2461, '18:10', 1590), (2461, '20:50', 4590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2462, f.id, t.id, 665 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'OSD'; -- 8440 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2462, '07:20', 974970), (2462, '09:45', 10000), (2462, '12:45', 4030), (2462, '15:40', 3860), (2462, '17:30', 496690), (2462, '20:05', 1760);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2463, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'KRN'; -- 8189 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2463, '07:40', 270), (2463, '08:45', 1860), (2463, '11:40', 4560), (2463, '13:55', 1410), (2463, '16:00', 525440), (2463, '17:50', 4640), (2463, '21:00', 3610);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2464, f.id, t.id, 675 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'OSL'; -- 8581 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2464, '06:45', 4910), (2464, '09:15', 2450), (2464, '11:10', 3400), (2464, '13:35', 2680), (2464, '15:45', 458710), (2464, '18:45', 387560), (2464, '20:35', 900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2465, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BGO'; -- 8350 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2465, '08:25', 1670), (2465, '10:45', 3720), (2465, '14:15', 19150), (2465, '16:15', 3470), (2465, '20:30', 2230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2466, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'TRD'; -- 8302 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2466, '07:50', 1830), (2466, '10:15', 3040), (2466, '13:10', 2400), (2466, '15:10', 3210), (2466, '17:25', 3190), (2466, '19:30', 3180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2467, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'CPH'; -- 9028 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2467, '07:10', 5580), (2467, '09:40', 516450), (2467, '11:55', 91970), (2467, '13:25', 3190), (2467, '15:25', 1420), (2467, '18:50', 1100), (2467, '20:45', 17470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2468, f.id, t.id, 690 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'AAL'; -- 8792 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2468, '07:30', 740), (2468, '10:30', 45010), (2468, '11:55', 1570), (2468, '15:30', 2690), (2468, '17:35', 2200), (2468, '19:45', 963750);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2469, f.id, t.id, 705 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'HEL'; -- 9013 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2469, '06:55', 3620), (2469, '09:20', 4570), (2469, '12:30', 98940), (2469, '15:45', 810), (2469, '17:15', 4750), (2469, '20:10', 2530);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2470, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'KEF'; -- 6927 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2470, '08:00', 2250), (2470, '09:25', 600), (2470, '12:50', 2390), (2470, '15:15', 4230), (2470, '17:25', 4400), (2470, '20:25', 4850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2471, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'TLL'; -- 9097 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2471, '07:45', 8900), (2471, '10:10', 870), (2471, '14:15', 2970), (2471, '16:30', 4350), (2471, '19:05', 92960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2472, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'RIX'; -- 9311 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2472, '07:10', 1810), (2472, '09:15', 503790), (2472, '10:55', 2390), (2472, '13:50', 2500), (2472, '15:35', 3180), (2472, '18:15', 730), (2472, '20:20', 30680);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2473, f.id, t.id, 685 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'LHR'; -- 8761 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2473, '07:50', 1100), (2473, '11:15', 4900), (2473, '13:40', 720), (2473, '17:40', 1890), (2473, '20:35', 560);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2474, f.id, t.id, 670 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MAN'; -- 8530 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2474, '07:20', 60770), (2474, '10:25', 220), (2474, '12:25', 1730), (2474, '15:20', 653290), (2474, '17:05', 1090), (2474, '20:05', 4180);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2475, f.id, t.id, 650 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'EDI'; -- 8292 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2475, '07:55', 3960), (2475, '10:30', 381650), (2475, '13:10', 61040), (2475, '14:30', 1170), (2475, '17:30', 1920), (2475, '19:30', 2730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2476, f.id, t.id, 655 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'DUB'; -- 8319 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2476, '06:35', 2630), (2476, '10:20', 1790), (2476, '12:15', 2700), (2476, '15:00', 2320), (2476, '18:15', 2040), (2476, '20:35', 4500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2477, f.id, t.id, 715 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'CDG'; -- 9103 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2477, '08:15', 4840), (2477, '10:55', 2130), (2477, '13:00', 2340), (2477, '17:25', 3130), (2477, '19:05', 2830);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2478, f.id, t.id, 765 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'NCE'; -- 9779 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2478, '06:50', 2460), (2478, '10:25', 830), (2478, '12:30', 3860), (2478, '14:50', 500410), (2478, '17:20', 3350), (2478, '19:40', 4590);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2479, f.id, t.id, 700 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'AMS'; -- 8956 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2479, '07:30', 2660), (2479, '09:45', 91160), (2479, '12:25', 864860), (2479, '15:30', 4060), (2479, '17:15', 2470), (2479, '20:10', 3510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2480, f.id, t.id, 710 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BRU'; -- 9054 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2480, '07:55', 61010), (2480, '11:15', 1860), (2480, '13:35', 4730), (2480, '17:15', 4860), (2480, '20:25', 155210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2481, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'FRA'; -- 9323 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2481, '07:25', 3850), (2481, '09:10', 1790), (2481, '12:15', 2810), (2481, '15:35', 1340), (2481, '17:00', 4720), (2481, '20:20', 4810);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2482, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MUC'; -- 9617 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2482, '07:30', 4920), (2482, '10:35', 2800), (2482, '14:00', 4040), (2482, '17:15', 470), (2482, '19:30', 200);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2483, f.id, t.id, 730 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BER'; -- 9345 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2483, '06:50', 2540), (2483, '10:10', 2910), (2483, '14:40', 1010), (2483, '16:15', 2200), (2483, '20:30', 2260);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2484, f.id, t.id, 745 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'ZRH'; -- 9535 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2484, '07:40', 3340), (2484, '09:45', 3910), (2484, '11:50', 4660), (2484, '14:10', 1570), (2484, '16:35', 3160), (2484, '18:05', 250950), (2484, '20:20', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2485, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'VIE'; -- 9854 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2485, '07:25', 1230), (2485, '08:45', 47040), (2485, '11:20', 2700), (2485, '13:55', 4600), (2485, '16:35', 1670), (2485, '17:40', 2780), (2485, '20:25', 2340);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2486, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'PRG'; -- 9576 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2486, '06:35', 4370), (2486, '08:40', 2470), (2486, '12:10', 4100), (2486, '13:30', 8570), (2486, '16:30', 42840), (2486, '18:25', 950), (2486, '20:55', 9840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2487, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'WAW'; -- 9658 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2487, '07:00', 3670), (2487, '09:00', 1750), (2487, '11:45', 517520), (2487, '14:05', 3180), (2487, '16:30', 82020), (2487, '17:35', 740230), (2487, '20:35', 4980);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2488, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BCN'; -- 9674 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2488, '08:00', 4300), (2488, '09:45', 4930), (2488, '12:15', 414450), (2488, '14:45', 2190), (2488, '17:20', 4050), (2488, '20:00', 64230);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2489, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MAD'; -- 9386 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2489, '07:35', 568400), (2489, '09:15', 3640), (2489, '12:20', 1970), (2489, '15:15', 95610), (2489, '18:20', 31360), (2489, '19:50', 1770);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2490, f.id, t.id, 750 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'AGP'; -- 9601 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2490, '07:35', 3900), (2490, '09:50', 700), (2490, '12:00', 1670), (2490, '13:30', 87010), (2490, '15:45', 1530), (2490, '18:50', 220), (2490, '20:50', 76920);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2491, f.id, t.id, 770 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'PMI'; -- 9851 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2491, '07:05', 86690), (2491, '08:55', 3180), (2491, '11:35', 3450), (2491, '14:10', 3130), (2491, '15:30', 1550), (2491, '18:50', 390), (2491, '19:55', 965990);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2492, f.id, t.id, 735 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'LPA'; -- 9393 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2492, '07:35', 4130), (2492, '09:15', 590), (2492, '12:55', 530), (2492, '14:45', 2870), (2492, '17:55', 2830), (2492, '20:55', 3960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2493, f.id, t.id, 715 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'LIS'; -- 9138 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2493, '06:50', 3060), (2493, '08:55', 280), (2493, '11:45', 4710), (2493, '13:55', 2780), (2493, '15:40', 29580), (2493, '18:15', 730), (2493, '20:15', 47510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2494, f.id, t.id, 795 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'FCO'; -- 10204 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2494, '07:05', 4150), (2494, '09:35', 3140), (2494, '11:15', 940), (2494, '13:15', 3740), (2494, '15:20', 2540), (2494, '17:35', 560), (2494, '20:45', 35550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2495, f.id, t.id, 755 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MXP'; -- 9696 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2495, '07:10', 83710), (2495, '09:15', 1800), (2495, '12:05', 750560), (2495, '13:10', 1210), (2495, '15:25', 3600), (2495, '18:15', 4510), (2495, '19:55', 3520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2496, f.id, t.id, 865 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'ATH'; -- 11127 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2496, '08:10', 3880), (2496, '10:35', 1790), (2496, '13:10', 3460), (2496, '16:45', 500), (2496, '19:10', 710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2497, f.id, t.id, 855 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'IST'; -- 11004 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2497, '06:55', 550), (2497, '09:15', 16080), (2497, '13:05', 95470), (2497, '14:20', 4480), (2497, '17:55', 52990), (2497, '20:00', 2350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2498, f.id, t.id, 1035 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'DXB'; -- 13401 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2498, '07:30', 2480), (2498, '09:10', 4590), (2498, '12:10', 3920), (2498, '14:50', 2280), (2498, '18:10', 2360), (2498, '19:35', 1380);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2499, f.id, t.id, 1025 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'BKK'; -- 13291 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2499, '07:00', 33550), (2499, '09:55', 2310), (2499, '13:40', 4030), (2499, '17:35', 480), (2499, '20:05', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2500, f.id, t.id, 325 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'EWR'; -- 3941 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2500, '08:00', 2430), (2500, '11:15', 2360), (2500, '13:20', 3920), (2500, '16:30', 4280), (2500, '20:50', 2520);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2501, f.id, t.id, 240 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'ORD'; -- 2803 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2501, '06:55', 4300), (2501, '11:10', 1820), (2501, '13:15', 32660), (2501, '16:10', 2530), (2501, '20:45', 408220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2502, f.id, t.id, 310 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'MIA'; -- 3763 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2502, '07:40', 73230), (2502, '09:40', 2050), (2502, '12:00', 43330), (2502, '14:10', 2580), (2502, '15:55', 613030), (2502, '18:50', 4250), (2502, '20:45', 2390);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2503, f.id, t.id, 290 FROM airports f, airports t WHERE f.iata = 'LAX' AND t.iata = 'YYZ'; -- 3494 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2503, '06:50', 880), (2503, '10:05', 4970), (2503, '13:40', 82300), (2503, '17:10', 2820), (2503, '19:30', 470);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2504, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BMA'; -- 6331 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2504, '06:55', 2420), (2504, '10:15', 3200), (2504, '13:45', 2840), (2504, '16:40', 860), (2504, '19:25', 4640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2505, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'GOT'; -- 6139 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2505, '06:45', 2700), (2505, '09:35', 2210), (2505, '11:05', 3280), (2505, '13:30', 61520), (2505, '15:35', 840), (2505, '18:35', 540), (2505, '20:45', 4400);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2506, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MMX'; -- 6312 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2506, '07:20', 220), (2506, '11:05', 3810), (2506, '13:25', 710), (2506, '16:45', 2090), (2506, '19:45', 3780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2507, f.id, t.id, 490 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'LLA'; -- 6162 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2507, '06:45', 970), (2507, '09:05', 8140), (2507, '11:30', 4340), (2507, '13:55', 904850), (2507, '16:10', 2770), (2507, '17:35', 2330), (2507, '20:20', 4650);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2508, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'VBY'; -- 6450 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2508, '07:30', 4950), (2508, '11:30', 420), (2508, '14:30', 4850), (2508, '17:05', 99780), (2508, '20:00', 582420);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2509, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'UME'; -- 6185 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2509, '07:40', 3180), (2509, '08:55', 4350), (2509, '11:30', 1940), (2509, '13:35', 216790), (2509, '16:05', 698480), (2509, '17:35', 606420), (2509, '20:55', 3880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2510, f.id, t.id, 475 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'OSD'; -- 5964 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2510, '07:35', 3380), (2510, '09:10', 4560), (2510, '11:30', 4340), (2510, '13:35', 1190), (2510, '16:15', 29410), (2510, '18:20', 2330), (2510, '20:10', 3480);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2511, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'KRN'; -- 5969 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2511, '07:30', 790), (2511, '09:20', 2580), (2511, '12:20', 4310), (2511, '14:40', 442770), (2511, '17:50', 727250), (2511, '20:00', 2150);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2512, f.id, t.id, 455 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BGO'; -- 5649 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2512, '07:20', 2960), (2512, '09:20', 500), (2512, '11:50', 10810), (2512, '14:15', 2500), (2512, '16:10', 3230), (2512, '18:45', 385370), (2512, '20:50', 4780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2513, f.id, t.id, 465 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'TRD'; -- 5789 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2513, '07:20', 2030), (2513, '09:10', 48360), (2513, '11:15', 490), (2513, '14:20', 2360), (2513, '15:30', 788370), (2513, '18:50', 2110), (2513, '21:00', 1060);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2514, f.id, t.id, 500 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'CPH'; -- 6269 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2514, '07:40', 4940), (2514, '10:20', 2570), (2514, '14:35', 36040), (2514, '17:20', 1230), (2514, '20:25', 1960);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2515, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'AAL'; -- 6039 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2515, '07:35', 680), (2515, '10:25', 1830), (2515, '13:25', 3940), (2515, '17:45', 3100), (2515, '19:20', 1730);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2516, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'HEL'; -- 6599 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2516, '08:15', 270), (2516, '10:15', 34490), (2516, '14:25', 15340), (2516, '16:05', 1250), (2516, '20:25', 3440);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2517, f.id, t.id, 345 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'KEF'; -- 4170 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2517, '06:50', 4530), (2517, '11:10', 1980), (2517, '13:05', 1360), (2517, '16:45', 4710), (2517, '20:25', 4860);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2518, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'TLL'; -- 6652 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2518, '08:05', 1690), (2518, '11:30', 2870), (2518, '13:00', 3710), (2518, '16:15', 4600), (2518, '19:40', 4890);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2519, f.id, t.id, 540 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'RIX'; -- 6775 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2519, '06:45', 4000), (2519, '10:00', 1750), (2519, '14:40', 3800), (2519, '16:45', 4970), (2519, '19:55', 657620);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2520, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'LHR'; -- 5708 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2520, '06:40', 1110), (2520, '10:15', 3070), (2520, '14:35', 490), (2520, '16:35', 2600), (2520, '20:10', 580);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2521, f.id, t.id, 445 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MAN'; -- 5511 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2521, '06:30', 2750), (2521, '09:20', 3910), (2521, '11:05', 1850), (2521, '13:50', 1990), (2521, '16:00', 2420), (2521, '18:10', 3920), (2521, '20:25', 4550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2522, f.id, t.id, 430 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'EDI'; -- 5344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2522, '06:40', 3190), (2522, '09:10', 2950), (2522, '11:55', 1440), (2522, '13:15', 70110), (2522, '16:15', 1380), (2522, '18:05', 3570), (2522, '19:45', 1430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2523, f.id, t.id, 425 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'DUB'; -- 5262 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2523, '07:30', 139310), (2523, '09:05', 3360), (2523, '11:50', 2440), (2523, '13:55', 480), (2523, '16:10', 430), (2523, '18:30', 15750), (2523, '20:05', 1640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2524, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'CDG'; -- 6020 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2524, '06:30', 4020), (2524, '09:35', 3530), (2524, '11:50', 740), (2524, '13:20', 679610), (2524, '16:05', 4540), (2524, '18:45', 3220), (2524, '20:55', 350);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2525, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'NCE'; -- 6631 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2525, '07:10', 86170), (2525, '11:05', 4760), (2525, '14:05', 3340), (2525, '16:35', 78320), (2525, '20:10', 4820);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2526, f.id, t.id, 480 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'AMS'; -- 5989 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2526, '06:40', 4890), (2526, '09:20', 3930), (2526, '11:00', 19480), (2526, '13:50', 1060), (2526, '15:55', 410), (2526, '17:35', 1130), (2526, '19:50', 67700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2527, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BRU'; -- 6044 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2527, '07:00', 64920), (2527, '09:25', 1980), (2527, '12:00', 346560), (2527, '15:15', 1050), (2527, '17:35', 3170), (2527, '19:50', 2600);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2528, f.id, t.id, 505 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'FRA'; -- 6344 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2528, '07:35', 4150), (2528, '08:50', 4010), (2528, '11:35', 4360), (2528, '13:10', 4720), (2528, '16:30', 3130), (2528, '17:35', 15910), (2528, '20:25', 3220);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2529, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MUC'; -- 6641 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2529, '08:05', 2170), (2529, '11:25', 1840), (2529, '12:50', 2970), (2529, '17:20', 57880), (2529, '20:45', 3840);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2530, f.id, t.id, 520 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BER'; -- 6502 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2530, '07:15', 310), (2530, '09:45', 930), (2530, '12:40', 48030), (2530, '14:50', 4680), (2530, '17:00', 3060), (2530, '19:55', 1700);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2531, f.id, t.id, 515 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'ZRH'; -- 6491 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2531, '07:05', 1670), (2531, '11:30', 1480), (2531, '14:30', 862960), (2531, '16:45', 4100), (2531, '20:35', 640);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2532, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'VIE'; -- 6948 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2532, '07:05', 4550), (2532, '10:35', 3310), (2532, '12:45', 85700), (2532, '14:45', 3380), (2532, '17:40', 762280), (2532, '20:50', 2500);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2533, f.id, t.id, 530 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'PRG'; -- 6684 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2533, '07:20', 62600), (2533, '09:30', 6290), (2533, '11:15', 4710), (2533, '14:05', 3230), (2533, '16:35', 2080), (2533, '18:05', 2330), (2533, '20:35', 1210);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2534, f.id, t.id, 550 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'WAW'; -- 6934 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2534, '07:00', 2250), (2534, '10:05', 542530), (2534, '13:25', 690), (2534, '16:55', 872920), (2534, '20:30', 2020);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2535, f.id, t.id, 510 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BCN'; -- 6417 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2535, '06:50', 3050), (2535, '10:35', 72560), (2535, '13:45', 260), (2535, '17:05', 667700), (2535, '19:05', 515780);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2536, f.id, t.id, 485 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MAD'; -- 6058 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2536, '06:55', 2100), (2536, '09:20', 722910), (2536, '12:05', 1710), (2536, '15:45', 2980), (2536, '18:10', 5730), (2536, '19:35', 1850);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2537, f.id, t.id, 495 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'AGP'; -- 6211 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2537, '08:20', 3060), (2537, '10:35', 96020), (2537, '13:20', 39680), (2537, '17:45', 190), (2537, '20:30', 3510);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2538, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'PMI'; -- 6570 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2538, '06:30', 1060), (2538, '08:55', 1600), (2538, '11:15', 3450), (2538, '13:15', 79330), (2538, '15:40', 650), (2538, '18:35', 4510), (2538, '19:45', 2950);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2539, f.id, t.id, 470 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'LPA'; -- 5898 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2539, '07:50', 3980), (2539, '10:35', 1800), (2539, '14:40', 4980), (2539, '17:10', 570), (2539, '20:00', 3900);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2540, f.id, t.id, 460 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'LIS'; -- 5741 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2540, '07:40', 2810), (2540, '09:35', 42360), (2540, '11:05', 44580), (2540, '13:15', 4890), (2540, '16:25', 1700), (2540, '18:30', 1740), (2540, '20:55', 930);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2541, f.id, t.id, 560 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'FCO'; -- 7086 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2541, '06:55', 4980), (2541, '10:35', 1740), (2541, '13:20', 3760), (2541, '16:40', 3440), (2541, '19:40', 2710);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2542, f.id, t.id, 525 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MXP'; -- 6611 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2542, '07:50', 1130), (2542, '10:10', 831780), (2542, '13:00', 3740), (2542, '16:05', 3710), (2542, '19:05', 1100);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2543, f.id, t.id, 640 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'ATH'; -- 8128 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2543, '06:30', 449600), (2543, '09:05', 3620), (2543, '11:45', 1800), (2543, '13:20', 280), (2543, '15:20', 3880), (2543, '17:35', 13640), (2543, '20:45', 3040);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2544, f.id, t.id, 645 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'IST'; -- 8172 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2544, '08:25', 273920), (2544, '10:30', 1170), (2544, '14:30', 4400), (2544, '16:25', 985500), (2544, '20:15', 2550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2545, f.id, t.id, 860 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'DXB'; -- 11082 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2545, '06:40', 2910), (2545, '10:00', 4170), (2545, '11:45', 4420), (2545, '14:45', 604110), (2545, '18:10', 4890), (2545, '20:30', 3880);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2546, f.id, t.id, 1055 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'BKK'; -- 13636 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2546, '07:45', 3840), (2546, '09:35', 930), (2546, '12:10', 4880), (2546, '13:50', 3330), (2546, '15:30', 3890), (2546, '17:45', 15940), (2546, '20:00', 3430);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2547, f.id, t.id, 70 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'EWR'; -- 559 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2547, '07:30', 3270), (2547, '10:25', 2800), (2547, '14:35', 3530), (2547, '17:25', 49750), (2547, '20:10', 550);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2548, f.id, t.id, 85 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'ORD'; -- 700 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2548, '07:25', 4050), (2548, '08:55', 91210), (2548, '11:15', 2500), (2548, '13:25', 1330), (2548, '15:30', 498810), (2548, '18:30', 4860), (2548, '20:20', 370);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2549, f.id, t.id, 180 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'MIA'; -- 1990 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2549, '07:10', 4210), (2549, '09:55', 1550), (2549, '12:20', 3840), (2549, '14:30', 2490), (2549, '17:35', 2300), (2549, '20:40', 3010);
INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) SELECT 2550, f.id, t.id, 290 FROM airports f, airports t WHERE f.iata = 'YYZ' AND t.iata = 'LAX'; -- 3494 km
INSERT INTO route_departures (route_id, departure_time, price) VALUES (2550, '07:45', 2030), (2550, '09:45', 2890), (2550, '11:45', 3910), (2550, '13:25', 3330), (2550, '16:15', 600), (2550, '18:05', 366880), (2550, '20:10', 550);
