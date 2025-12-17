const express = require('express');
const router = express.Router();
const db = require('../db');

/* =========================
   ADMIN REGISTER
========================= */
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password required'
    });
  }

  const insertQuery =
    'INSERT INTO admins (username, password) VALUES (?, ?)';

  db.query(insertQuery, [username, password], (err) => {
    if (err) {
      return res.status(409).json({
        message: 'Admin already exists'
      });
    }

    res.status(201).json({
      message: 'Admin registered successfully'
    });
  });
});

/* =========================
   ADMIN LOGIN
========================= */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password required'
    });
  }

  const loginQuery =
    'SELECT * FROM admins WHERE username = ? AND password = ?';

  db.query(loginQuery, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Server error'
      });
    }

    if (results.length === 1) {
      // ✅ LOGIN SUCCESS
      res.status(200).json({
        message: 'Login successful'
      });
    } else {
      // ❌ LOGIN FAILED
      res.status(401).json({
        message: 'Invalid username or password'
      });
    }
  });
});

module.exports = router;
