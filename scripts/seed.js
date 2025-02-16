import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const { 'sqlite_path': sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    date_of_birth: '1990-05-15',
    job_title: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    start_date: '2020-06-01',
    end_date: null,
    photo_path: null,
    document_path: null,
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '987-654-3210',
    date_of_birth: '1985-09-22',
    job_title: 'HR Manager',
    department: 'Human Resources',
    salary: 65000,
    start_date: '2018-04-15',
    end_date: null,
    photo_path: null,
    document_path: null,
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone_number: '555-789-1234',
    date_of_birth: '1992-07-30',
    job_title: 'Marketing Specialist',
    department: 'Marketing',
    salary: 55000,
    start_date: '2019-09-10',
    end_date: null,
    photo_path: null,
    document_path: null,
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 10:00',
    end_time: '2025-02-10 11:00',
    summary: 'Developed new feature for client dashboard.',
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 10:00',
    end_time: '2025-02-11 11:00',
    summary: 'Conducted interviews for software engineering candidates.',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 10:00',
    end_time: '2025-02-12 11:00',
    summary: 'Worked on a new marketing campaign strategy.',
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});
