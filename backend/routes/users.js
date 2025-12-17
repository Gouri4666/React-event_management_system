const express = require('express');
const router = express.Router();
const db = require('../db');

/* =========================
   USER REGISTER
========================= */
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fields required'
    });
  }

  const insertQuery =
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(insertQuery, [name, email, password], (err) => {
    if (err) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    res.status(201).json({
      message: 'User registered successfully'
    });
  });
});

/* =========================
   USER LOGIN  
========================= */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const loginQuery =
    'SELECT id, name, email FROM users WHERE email = ? AND password = ?';

  db.query(loginQuery, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Server error'
      });
    }

    if (result.length === 1) {
      res.status(200).json({
        message: 'Login successful',
        user: result[0]   // { id, name, email }
      });
    } else {
      res.status(401).json({
        message: 'Invalid email or password'
      });
    }
  });
});

module.exports = router;
