-- TECH-005: alla priser i hela kronor i stället för ören.
-- SQLite delar heltal som heltal, så +50 före divisionen avrundar till
-- närmaste krona (en halv krona avrundas uppåt): 1250 öre blir 13 kr.

UPDATE addons SET price = (price + 50) / 100;
UPDATE flight_prices SET price = (price + 50) / 100;
UPDATE booking_flights SET price = (price + 50) / 100;
UPDATE booking_flight_addons SET price = (price + 50) / 100;
