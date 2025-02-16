-- This file contains the SQL schema, it drops all tables and recreates them

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL CHECK (salary >= 15000), -- Example minimum wage check
    start_date DATE NOT NULL,
    end_date DATE NULL,
    photo_path TEXT NULL, -- Store path to employee photo
    document_path TEXT NULL -- Store path to uploaded documents (e.g., CV, ID)
);


-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL CHECK (end_time > start_time), -- Ensures valid times
    summary TEXT NULL, -- Work summary
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
