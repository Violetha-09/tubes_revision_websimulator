-- Active: 1712345678901@@127.0.0.1@3306

CREATE DATABASE IF NOT EXISTS wc_simulator_db;
USE wc_simulator_db;

-- 1. Table Users (Admin & User Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table Teams
CREATE TABLE IF NOT EXISTS teams (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    group_name VARCHAR(1) NOT NULL,
    flag VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_group (group_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table Matches
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(10) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'group' or 'knockout'
    group_name VARCHAR(1) DEFAULT NULL, -- 'A' through 'L' for group stage
    round_name VARCHAR(10) DEFAULT NULL, -- 'R32', 'R16', 'QF', 'SF', 'F' for knockout stage
    name VARCHAR(50) DEFAULT NULL, -- e.g. 'Round of 32', 'Final'
    home_team_code VARCHAR(3) DEFAULT NULL,
    away_team_code VARCHAR(3) DEFAULT NULL,
    home_score INT DEFAULT NULL,
    away_score INT DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'live', 'finished'
    next_match_id VARCHAR(10) DEFAULT NULL,
    is_home_in_next_match TINYINT(1) DEFAULT NULL, -- 1 = true, 0 = false
    placeholder_home VARCHAR(50) DEFAULT NULL,
    placeholder_away VARCHAR(50) DEFAULT NULL,
    winner_code VARCHAR(3) DEFAULT NULL,
    penalty_winner_code VARCHAR(3) DEFAULT NULL,
    stadium VARCHAR(100) DEFAULT NULL,
    match_date VARCHAR(50) DEFAULT NULL,
    kickoff VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (home_team_code) REFERENCES teams(code) ON DELETE SET NULL,
    FOREIGN KEY (away_team_code) REFERENCES teams(code) ON DELETE SET NULL,
    FOREIGN KEY (winner_code) REFERENCES teams(code) ON DELETE SET NULL,
    FOREIGN KEY (penalty_winner_code) REFERENCES teams(code) ON DELETE SET NULL,
    FOREIGN KEY (next_match_id) REFERENCES matches(id) ON DELETE SET NULL,
    
    INDEX idx_match_type (type),
    INDEX idx_match_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
