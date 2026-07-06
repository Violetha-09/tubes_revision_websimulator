USE wc_simulator_db;

-- 1. Seed default Admin (Password: admin123)
-- bcrypt hash of 'admin123' is '$2b$10$gMpeD6rT4M0nU6x17iVnFumUoe56yqKpe82tI1o5iL/F5R.p5C3uS'
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$gMpeD6rT4M0nU6x17iVnFumUoe56yqKpe82tI1o5iL/F5R.p5C3uS', 'Admin')
ON DUPLICATE KEY UPDATE username=username;

-- 2. Seed 48 Teams
INSERT INTO teams (code, name, group_name, flag) VALUES
('MEX', 'Mexico', 'A', '🇲🇽'),
('JPN', 'Japan', 'A', '🇯🇵'),
('RSA', 'South Africa', 'A', '🇿🇦'),
('CZE', 'Czech Republic', 'A', '🇨🇿'),
('BRA', 'Brazil', 'B', '🇧🇷'),
('SUI', 'Switzerland', 'B', '🇨🇭'),
('CAN', 'Canada', 'B', '🇨🇦'),
('TUN', 'Tunisia', 'B', '🇹🇳'),
('ARG', 'Argentina', 'C', '🇦🇷'),
('POL', 'Poland', 'C', '🇵🇱'),
('KSA', 'Saudi Arabia', 'C', '🇸🇦'),
('ECU', 'Ecuador', 'C', '🇪🇨'),
('FRA', 'France', 'D', '🇫🇷'),
('DEN', 'Denmark', 'D', '🇩🇰'),
('AUS', 'Australia', 'D', '🇦🇺'),
('PER', 'Peru', 'D', '🇵🇪'),
('ESP', 'Spain', 'E', '🇪🇸'),
('GER', 'Germany', 'E', '🇩🇪'),
('CRC', 'Costa Rica', 'E', '🇨🇷'),
('NZL', 'New Zealand', 'E', '🇳🇿'),
('BEL', 'Belgium', 'F', '🇧🇪'),
('CRO', 'Croatia', 'F', '🇭🇷'),
('MAR', 'Morocco', 'F', '🇲🇦'),
('SEN', 'Senegal', 'F', '🇸🇳'),
('ENG', 'England', 'G', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
('USA', 'USA', 'G', '🇺🇸'),
('IRN', 'Iran', 'G', '🇮🇷'),
('WAL', 'Wales', 'G', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'),
('POR', 'Portugal', 'H', '🇵🇹'),
('URU', 'Uruguay', 'H', '🇺🇾'),
('KOR', 'South Korea', 'H', '🇰🇷'),
('GHA', 'Ghana', 'H', '🇬🇭'),
('ITA', 'Italy', 'I', '🇮🇹'),
('COL', 'Colombia', 'I', '🇨🇴'),
('ALG', 'Algeria', 'I', '🇩🇿'),
('UKR', 'Ukraine', 'I', '🇺🇦'),
('NED', 'Netherlands', 'J', '🇳🇱'),
('CHI', 'Chile', 'J', '🇨🇱'),
('NGA', 'Nigeria', 'J', '🇳🇬'),
('SWE', 'Sweden', 'J', '🇸🇪'),
('EGY', 'Egypt', 'K', '🇪🇬'),
('AUT', 'Austria', 'K', '🇦🇹'),
('TUR', 'Turkey', 'K', '🇹🇷'),
('JAM', 'Jamaica', 'K', '🇯🇲'),
('NOR', 'Norway', 'L', '🇳🇴'),
('SRB', 'Serbia', 'L', '🇷🇸'),
('CMR', 'Cameroon', 'L', '🇨🇲'),
('PAN', 'Panama', 'L', '🇵🇦')
ON DUPLICATE KEY UPDATE code=code;

-- 3. Seed 72 Group Matches (Initial match schedule)
-- Group A
INSERT INTO matches (id, type, group_name, home_team_code, away_team_code, home_score, away_score, status, stadium, match_date, kickoff) VALUES
('G-1', 'group', 'A', 'MEX', 'JPN', 2, 1, 'finished', 'Azteca Stadium, Mexico City', 'Jun 11, 2026', '18:00'),
('G-2', 'group', 'A', 'RSA', 'CZE', 1, 2, 'finished', 'MetLife Stadium, East Rutherford', 'Jun 11, 2026', '21:00'),
('G-3', 'group', 'A', 'MEX', 'RSA', NULL, NULL, 'scheduled', 'SoFi Stadium, Los Angeles', 'Jun 15, 2026', '15:00'),
('G-4', 'group', 'A', 'JPN', 'CZE', NULL, NULL, 'scheduled', 'Mercedes-Benz Stadium, Atlanta', 'Jun 15, 2026', '18:00'),
('G-5', 'group', 'A', 'CZE', 'MEX', NULL, NULL, 'scheduled', 'AT&T Stadium, Arlington', 'Jun 19, 2026', '17:00'),
('G-6', 'group', 'A', 'JPN', 'RSA', NULL, NULL, 'scheduled', 'Hard Rock Stadium, Miami', 'Jun 19, 2026', '20:00'),

-- Group B
('G-7', 'group', 'B', 'BRA', 'SUI', 2, 1, 'finished', 'MetLife Stadium, East Rutherford', 'Jun 11, 2026', '18:00'),
('G-8', 'group', 'B', 'CAN', 'TUN', 1, 2, 'finished', 'SoFi Stadium, Los Angeles', 'Jun 11, 2026', '21:00'),
('G-9', 'group', 'B', 'BRA', 'CAN', NULL, NULL, 'scheduled', 'Mercedes-Benz Stadium, Atlanta', 'Jun 15, 2026', '15:00'),
('G-10', 'group', 'B', 'SUI', 'TUN', NULL, NULL, 'scheduled', 'AT&T Stadium, Arlington', 'Jun 15, 2026', '18:00'),
('G-11', 'group', 'B', 'TUN', 'BRA', NULL, NULL, 'scheduled', 'Hard Rock Stadium, Miami', 'Jun 19, 2026', '17:00'),
('G-12', 'group', 'B', 'SUI', 'CAN', NULL, NULL, 'scheduled', 'Lincoln Financial Field, Philadelphia', 'Jun 19, 2026', '20:00'),

-- Group C
('G-13', 'group', 'C', 'ARG', 'POL', 2, 1, 'finished', 'SoFi Stadium, Los Angeles', 'Jun 12, 2026', '18:00'),
('G-14', 'group', 'C', 'KSA', 'ECU', 1, 2, 'finished', 'Mercedes-Benz Stadium, Atlanta', 'Jun 12, 2026', '21:00'),
('G-15', 'group', 'C', 'ARG', 'KSA', NULL, NULL, 'scheduled', 'AT&T Stadium, Arlington', 'Jun 16, 2026', '15:00'),
('G-16', 'group', 'C', 'POL', 'ECU', NULL, NULL, 'scheduled', 'Hard Rock Stadium, Miami', 'Jun 16, 2026', '18:00'),
('G-17', 'group', 'C', 'ECU', 'ARG', NULL, NULL, 'scheduled', 'Lincoln Financial Field, Philadelphia', 'Jun 20, 2026', '17:00'),
('G-18', 'group', 'C', 'POL', 'KSA', NULL, NULL, 'scheduled', 'CenturyLink Field, Seattle', 'Jun 20, 2026', '20:00'),

-- Group D
('G-19', 'group', 'D', 'FRA', 'DEN', 2, 1, 'finished', 'Mercedes-Benz Stadium, Atlanta', 'Jun 12, 2026', '18:00'),
('G-20', 'group', 'D', 'AUS', 'PER', 1, 2, 'finished', 'AT&T Stadium, Arlington', 'Jun 12, 2026', '21:00'),
('G-21', 'group', 'D', 'FRA', 'AUS', NULL, NULL, 'scheduled', 'Hard Rock Stadium, Miami', 'Jun 16, 2026', '15:00'),
('G-22', 'group', 'D', 'DEN', 'PER', NULL, NULL, 'scheduled', 'Lincoln Financial Field, Philadelphia', 'Jun 16, 2026', '18:00'),
('G-23', 'group', 'D', 'PER', 'FRA', NULL, NULL, 'scheduled', 'CenturyLink Field, Seattle', 'Jun 20, 2026', '17:00'),
('G-24', 'group', 'D', 'DEN', 'AUS', NULL, NULL, 'scheduled', 'Levi\'s Stadium, Santa Clara', 'Jun 20, 2026', '20:00'),

-- Group E
('G-25', 'group', 'E', 'ESP', 'GER', 2, 1, 'finished', 'AT&T Stadium, Arlington', 'Jun 13, 2026', '18:00'),
('G-26', 'group', 'E', 'CRC', 'NZL', 1, 2, 'finished', 'Hard Rock Stadium, Miami', 'Jun 13, 2026', '21:00'),
('G-27', 'group', 'E', 'ESP', 'CRC', NULL, NULL, 'scheduled', 'Lincoln Financial Field, Philadelphia', 'Jun 17, 2026', '15:00'),
('G-28', 'group', 'E', 'GER', 'NZL', NULL, NULL, 'scheduled', 'CenturyLink Field, Seattle', 'Jun 17, 2026', '18:00'),
('G-29', 'group', 'E', 'NZL', 'ESP', NULL, NULL, 'scheduled', 'Levi\'s Stadium, Santa Clara', 'Jun 21, 2026', '17:00'),
('G-30', 'group', 'E', 'GER', 'CRC', NULL, NULL, 'scheduled', 'Gillette Stadium, Foxborough', 'Jun 21, 2026', '20:00'),

-- Group F
('G-31', 'group', 'F', 'BEL', 'CRO', 2, 1, 'finished', 'Hard Rock Stadium, Miami', 'Jun 13, 2026', '18:00'),
('G-32', 'group', 'F', 'MAR', 'SEN', 1, 2, 'finished', 'Lincoln Financial Field, Philadelphia', 'Jun 13, 2026', '21:00'),
('G-33', 'group', 'F', 'BEL', 'MAR', NULL, NULL, 'scheduled', 'CenturyLink Field, Seattle', 'Jun 17, 2026', '15:00'),
('G-34', 'group', 'F', 'CRO', 'SEN', NULL, NULL, 'scheduled', 'Levi\'s Stadium, Santa Clara', 'Jun 17, 2026', '18:00'),
('G-35', 'group', 'F', 'SEN', 'BEL', NULL, NULL, 'scheduled', 'Gillette Stadium, Foxborough', 'Jun 21, 2026', '17:00'),
('G-36', 'group', 'F', 'CRO', 'MAR', NULL, NULL, 'scheduled', 'BC Place, Vancouver', 'Jun 21, 2026', '20:00'),

-- Group G
('G-37', 'group', 'G', 'ENG', 'USA', 2, 1, 'finished', 'Lincoln Financial Field, Philadelphia', 'Jun 14, 2026', '18:00'),
('G-38', 'group', 'G', 'IRN', 'WAL', 1, 2, 'finished', 'CenturyLink Field, Seattle', 'Jun 14, 2026', '21:00'),
('G-39', 'group', 'G', 'ENG', 'IRN', NULL, NULL, 'scheduled', 'Levi\'s Stadium, Santa Clara', 'Jun 18, 2026', '15:00'),
('G-40', 'group', 'G', 'USA', 'WAL', NULL, NULL, 'scheduled', 'Gillette Stadium, Foxborough', 'Jun 18, 2026', '18:00'),
('G-41', 'group', 'G', 'WAL', 'ENG', NULL, NULL, 'scheduled', 'BC Place, Vancouver', 'Jun 22, 2026', '17:00'),
('G-42', 'group', 'G', 'USA', 'IRN', NULL, NULL, 'scheduled', 'BMO Field, Toronto', 'Jun 22, 2026', '20:00'),

-- Group H
('G-43', 'group', 'H', 'POR', 'URU', 2, 1, 'finished', 'CenturyLink Field, Seattle', 'Jun 14, 2026', '18:00'),
('G-44', 'group', 'H', 'KOR', 'GHA', 1, 2, 'finished', 'Levi\'s Stadium, Santa Clara', 'Jun 14, 2026', '21:00'),
('G-45', 'group', 'H', 'POR', 'KOR', NULL, NULL, 'scheduled', 'Gillette Stadium, Foxborough', 'Jun 18, 2026', '15:00'),
('G-46', 'group', 'H', 'URU', 'GHA', NULL, NULL, 'scheduled', 'BC Place, Vancouver', 'Jun 18, 2026', '18:00'),
('G-47', 'group', 'H', 'GHA', 'POR', NULL, NULL, 'scheduled', 'BMO Field, Toronto', 'Jun 22, 2026', '17:00'),
('G-48', 'group', 'H', 'URU', 'KOR', NULL, NULL, 'scheduled', 'Azteca Stadium, Mexico City', 'Jun 22, 2026', '20:00'),

-- Group I
('G-49', 'group', 'I', 'ITA', 'COL', 2, 1, 'finished', 'Levi\'s Stadium, Santa Clara', 'Jun 15, 2026', '18:00'),
('G-50', 'group', 'I', 'ALG', 'UKR', 1, 2, 'finished', 'Gillette Stadium, Foxborough', 'Jun 15, 2026', '21:00'),
('G-51', 'group', 'I', 'ITA', 'ALG', NULL, NULL, 'scheduled', 'BC Place, Vancouver', 'Jun 19, 2026', '15:00'),
('G-52', 'group', 'I', 'COL', 'UKR', NULL, NULL, 'scheduled', 'BMO Field, Toronto', 'Jun 19, 2026', '18:00'),
('G-53', 'group', 'I', 'UKR', 'ITA', NULL, NULL, 'scheduled', 'Azteca Stadium, Mexico City', 'Jun 23, 2026', '17:00'),
('G-54', 'group', 'I', 'COL', 'ALG', NULL, NULL, 'scheduled', 'MetLife Stadium, East Rutherford', 'Jun 23, 2026', '20:00'),

-- Group J
('G-55', 'group', 'J', 'NED', 'CHI', 2, 1, 'finished', 'Gillette Stadium, Foxborough', 'Jun 15, 2026', '18:00'),
('G-56', 'group', 'J', 'NGA', 'SWE', 1, 2, 'finished', 'BC Place, Vancouver', 'Jun 15, 2026', '21:00'),
('G-57', 'group', 'J', 'NED', 'NGA', NULL, NULL, 'scheduled', 'BMO Field, Toronto', 'Jun 19, 2026', '15:00'),
('G-58', 'group', 'J', 'CHI', 'SWE', NULL, NULL, 'scheduled', 'Azteca Stadium, Mexico City', 'Jun 19, 2026', '18:00'),
('G-59', 'group', 'J', 'SWE', 'NED', NULL, NULL, 'scheduled', 'MetLife Stadium, East Rutherford', 'Jun 23, 2026', '17:00'),
('G-60', 'group', 'J', 'CHI', 'NGA', NULL, NULL, 'scheduled', 'SoFi Stadium, Los Angeles', 'Jun 23, 2026', '20:00'),

-- Group K
('G-61', 'group', 'K', 'EGY', 'AUT', 2, 1, 'finished', 'BC Place, Vancouver', 'Jun 16, 2026', '18:00'),
('G-62', 'group', 'K', 'TUR', 'JAM', 1, 2, 'finished', 'BMO Field, Toronto', 'Jun 16, 2026', '21:00'),
('G-63', 'group', 'K', 'EGY', 'TUR', NULL, NULL, 'scheduled', 'Azteca Stadium, Mexico City', 'Jun 20, 2026', '15:00'),
('G-64', 'group', 'K', 'AUT', 'JAM', NULL, NULL, 'scheduled', 'MetLife Stadium, East Rutherford', 'Jun 20, 2026', '18:00'),
('G-65', 'group', 'K', 'JAM', 'EGY', NULL, NULL, 'scheduled', 'SoFi Stadium, Los Angeles', 'Jun 24, 2026', '17:00'),
('G-66', 'group', 'K', 'AUT', 'TUR', NULL, NULL, 'scheduled', 'Mercedes-Benz Stadium, Atlanta', 'Jun 24, 2026', '20:00'),

-- Group L
('G-67', 'group', 'L', 'NOR', 'SRB', 2, 1, 'finished', 'BMO Field, Toronto', 'Jun 16, 2026', '18:00'),
('G-68', 'group', 'L', 'CMR', 'PAN', 1, 2, 'finished', 'Azteca Stadium, Mexico City', 'Jun 16, 2026', '21:00'),
('G-69', 'group', 'L', 'NOR', 'CMR', NULL, NULL, 'scheduled', 'MetLife Stadium, East Rutherford', 'Jun 20, 2026', '15:00'),
('G-70', 'group', 'L', 'SRB', 'PAN', NULL, NULL, 'scheduled', 'SoFi Stadium, Los Angeles', 'Jun 20, 2026', '18:00'),
('G-71', 'group', 'L', 'PAN', 'NOR', NULL, NULL, 'scheduled', 'Mercedes-Benz Stadium, Atlanta', 'Jun 24, 2026', '17:00'),
('G-72', 'group', 'L', 'SRB', 'CMR', NULL, NULL, 'scheduled', 'AT&T Stadium, Arlington', 'Jun 24, 2026', '20:00')
ON DUPLICATE KEY UPDATE id=id;

-- 4. Seed 31 Knockout Matches (Initial tree structure with connections)
-- Round of 32
INSERT INTO matches (id, type, round_name, name, home_team_code, away_team_code, home_score, away_score, status, winner_code, next_match_id, is_home_in_next_match, placeholder_home, placeholder_away, stadium, match_date, kickoff) VALUES
('R32-1', 'knockout', 'R32', 'Round of 32', 'MEX', 'ARG', 2, 1, 'finished', 'MEX', 'R16-1', 1, 'Winner Group A', 'Best 3rd Place 1', 'Azteca Stadium, Mexico City', 'Jun 26, 2026', '18:00'),
('R32-2', 'knockout', 'R32', 'Round of 32', 'BRA', 'POL', 3, 0, 'finished', 'BRA', 'R16-1', 0, 'Runner-up Group B', 'Runner-up Group C', 'MetLife Stadium, East Rutherford', 'Jun 26, 2026', '21:00'),
('R32-3', 'knockout', 'R32', 'Round of 32', 'FRA', 'USA', 1, 2, 'finished', 'USA', 'R16-2', 1, 'Winner Group D', 'Best 3rd Place 2', 'SoFi Stadium, Los Angeles', 'Jun 27, 2026', '18:00'),
('R32-4', 'knockout', 'R32', 'Round of 32', 'ESP', 'CRO', 2, 2, 'finished', 'ESP', 'R16-2', 0, 'Winner Group E', 'Runner-up Group F', 'Mercedes-Benz Stadium, Atlanta', 'Jun 27, 2026', '21:00'),
('R32-5', 'knockout', 'R32', 'Round of 32', 'BEL', 'JPN', 1, 0, 'finished', 'BEL', 'R16-3', 1, 'Winner Group F', 'Best 3rd Place 3', 'AT&T Stadium, Arlington', 'Jun 28, 2026', '18:00'),
('R32-6', 'knockout', 'R32', 'Round of 32', 'ENG', 'POR', 0, 1, 'finished', 'POR', 'R16-3', 0, 'Runner-up Group G', 'Runner-up Group H', 'Hard Rock Stadium, Miami', 'Jun 28, 2026', '21:00'),
('R32-7', 'knockout', 'R32', 'Round of 32', 'URU', 'SUI', 2, 0, 'finished', 'URU', 'R16-4', 1, 'Winner Group H', 'Best 3rd Place 4', 'Lincoln Financial Field, Philadelphia', 'Jun 29, 2026', '18:00'),
('R32-8', 'knockout', 'R32', 'Round of 32', 'ITA', 'NED', 1, 3, 'finished', 'NED', 'R16-4', 0, 'Winner Group I', 'Runner-up Group J', 'CenturyLink Field, Seattle', 'Jun 29, 2026', '21:00'),
('R32-9', 'knockout', 'R32', 'Round of 32', 'CAN', 'KSA', 2, 1, 'finished', 'CAN', 'R16-5', 1, 'Winner Group B', 'Best 3rd Place 5', 'Levi\'s Stadium, Santa Clara', 'Jun 30, 2026', '18:00'),
('R32-10', 'knockout', 'R32', 'Round of 32', 'CZE', 'DEN', 1, 2, 'finished', 'DEN', 'R16-5', 0, 'Runner-up Group A', 'Runner-up Group D', 'Gillette Stadium, Foxborough', 'Jun 30, 2026', '21:00'),
('R32-11', 'knockout', 'R32', 'Round of 32', 'KSA', 'GER', 0, 4, 'finished', 'GER', 'R16-6', 1, 'Winner Group C', 'Best 3rd Place 6', 'BC Place, Vancouver', 'Jul 01, 2026', '18:00'),
('R32-12', 'knockout', 'R32', 'Round of 32', 'WAL', 'CRC', 2, 1, 'finished', 'WAL', 'R16-6', 0, 'Winner Group G', 'Runner-up Group E', 'BMO Field, Toronto', 'Jul 01, 2026', '21:00'),
('R32-13', 'knockout', 'R32', 'Round of 32', 'CHI', 'EGY', 3, 1, 'finished', 'CHI', 'R16-7', 1, 'Winner Group J', 'Best 3rd Place 7', 'Azteca Stadium, Mexico City', 'Jul 02, 2026', '18:00'),
('R32-14', 'knockout', 'R32', 'Round of 32', 'AUT', 'SRB', 1, 1, 'finished', 'SRB', 'R16-7', 0, 'Runner-up Group K', 'Runner-up Group L', 'MetLife Stadium, East Rutherford', 'Jul 02, 2026', '21:00'),
('R32-15', 'knockout', 'R32', 'Round of 32', 'TUR', 'NOR', 0, 2, 'finished', 'NOR', 'R16-8', 1, 'Winner Group K', 'Best 3rd Place 8', 'SoFi Stadium, Los Angeles', 'Jul 03, 2026', '18:00'),
('R32-16', 'knockout', 'R32', 'Round of 32', 'CMR', 'COL', 1, 2, 'finished', 'COL', 'R16-8', 0, 'Winner Group L', 'Runner-up Group I', 'Mercedes-Benz Stadium, Atlanta', 'Jul 03, 2026', '21:00'),

-- Round of 16
('R16-1', 'knockout', 'R16', 'Round of 16', 'MEX', 'BRA', 1, 3, 'finished', 'BRA', 'QF-1', 1, 'Winner R32-1', 'Winner R32-2', 'AT&T Stadium, Arlington', 'Jul 05, 2026', '18:00'),
('R16-2', 'knockout', 'R16', 'Round of 16', 'USA', 'ESP', 0, 2, 'finished', 'ESP', 'QF-1', 0, 'Winner R32-3', 'Winner R32-4', 'Hard Rock Stadium, Miami', 'Jul 05, 2026', '21:00'),
('R16-3', 'knockout', 'R16', 'Round of 16', 'BEL', 'POR', 2, 1, 'finished', 'BEL', 'QF-2', 1, 'Winner R32-5', 'Winner R32-6', 'Lincoln Financial Field, Philadelphia', 'Jul 06, 2026', '18:00'),
('R16-4', 'knockout', 'R16', 'Round of 16', 'URU', 'NED', 1, 1, 'finished', 'NED', 'QF-2', 0, 'Winner R32-7', 'Winner R32-8', 'CenturyLink Field, Seattle', 'Jul 06, 2026', '21:00'),
('R16-5', 'knockout', 'R16', 'Round of 16', 'CAN', 'DEN', 1, 2, 'finished', 'DEN', 'QF-3', 1, 'Winner R32-9', 'Winner R32-10', 'Levi\'s Stadium, Santa Clara', 'Jul 07, 2026', '18:00'),
('R16-6', 'knockout', 'R16', 'Round of 16', 'GER', 'WAL', 3, 0, 'finished', 'GER', 'QF-3', 0, 'Winner R32-11', 'Winner R32-12', 'Gillette Stadium, Foxborough', 'Jul 07, 2026', '21:00'),
('R16-7', 'knockout', 'R16', 'Round of 16', 'CHI', 'SRB', 2, 0, 'finished', 'CHI', 'QF-4', 1, 'Winner R32-13', 'Winner R32-14', 'BC Place, Vancouver', 'Jul 08, 2026', '18:00'),
('R16-8', 'knockout', 'R16', 'Round of 16', 'NOR', 'COL', 0, 1, 'finished', 'COL', 'QF-4', 0, 'Winner R32-15', 'Winner R32-16', 'BMO Field, Toronto', 'Jul 08, 2026', '21:00'),

-- Quarter-finals
('QF-1', 'knockout', 'QF', 'Quarter-final', 'BRA', 'ESP', 2, 1, 'finished', 'BRA', 'SF-1', 1, 'Winner R16-1', 'Winner R16-2', 'Azteca Stadium, Mexico City', 'Jul 11, 2026', '18:00'),
('QF-2', 'knockout', 'QF', 'Quarter-final', 'BEL', 'NED', 0, 2, 'finished', 'NED', 'SF-1', 0, 'Winner R16-3', 'Winner R16-4', 'MetLife Stadium, East Rutherford', 'Jul 11, 2026', '21:00'),
('QF-3', 'knockout', 'QF', 'Quarter-final', 'DEN', 'GER', 1, 3, 'finished', 'GER', 'SF-2', 1, 'Winner R16-5', 'Winner R16-6', 'SoFi Stadium, Los Angeles', 'Jul 12, 2026', '18:00'),
('QF-4', 'knockout', 'QF', 'Quarter-final', 'CHI', 'COL', 1, 0, 'finished', 'CHI', 'SF-2', 0, 'Winner R16-7', 'Winner R16-8', 'Mercedes-Benz Stadium, Atlanta', 'Jul 12, 2026', '21:00'),

-- Semi-finals
('SF-1', 'knockout', 'SF', 'Semi-final', 'BRA', 'NED', 3, 2, 'finished', 'BRA', 'F', 1, 'Winner QF-1', 'Winner QF-2', 'AT&T Stadium, Arlington', 'Jul 15, 2026', '20:00'),
('SF-2', 'knockout', 'SF', 'Semi-final', 'GER', 'CHI', 2, 0, 'finished', 'GER', 'F', 0, 'Winner QF-3', 'Winner QF-4', 'Hard Rock Stadium, Miami', 'Jul 16, 2026', '20:00'),

-- Final
('F', 'knockout', 'F', 'Final', 'BRA', 'GER', 2, 1, 'finished', 'BRA', NULL, NULL, 'Winner SF-1', 'Winner SF-2', 'MetLife Stadium, East Rutherford', 'Jul 19, 2026', '20:00')
ON DUPLICATE KEY UPDATE id=id;

-- Link penalty ad-hoc adu penalti winners
UPDATE matches SET penalty_winner_code = 'ESP' WHERE id = 'R32-4';
UPDATE matches SET penalty_winner_code = 'SRB' WHERE id = 'R32-14';
UPDATE matches SET penalty_winner_code = 'NED' WHERE id = 'R16-4';
