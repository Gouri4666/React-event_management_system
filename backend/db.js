const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gouri@2003",
  database: "event_management_system",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }

  console.log("✅ MySQL connected successfully");

  /* ================= ADMINS TABLE ================= */
  db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      username VARCHAR(100) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    )
  `, (err) => {
    if (err) console.error("❌ Admins table error:", err.message);
    else console.log("✅ Admins table ready");
  });

  /* ================= USERS TABLE ================= */
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `, (err) => {
    if (err) console.error("❌ Users table error:", err.message);
    else console.log("✅ Users table ready");
  });

  /* ================= EVENTS TABLE ================= */
  db.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      event_type VARCHAR(50),
      event_date DATE NOT NULL,
      registration_ends DATE NOT NULL,
      max_seats INT NOT NULL,
      available_seats INT NOT NULL,
      venue VARCHAR(100),
      coordinator_number VARCHAR(15),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("❌ Events table error:", err.message);
    else console.log("✅ Events table ready");
  });

  /* ================= BOOKINGS TABLE ================= */
  db.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone CHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Booked',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
      ON DELETE CASCADE
  )
`, (err) => {
  if (err) console.error("❌ Bookings table error:", err.message);
  else console.log("✅ Bookings table ready");
});
});

module.exports = db;
