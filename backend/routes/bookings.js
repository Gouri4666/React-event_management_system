const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= CREATE BOOKING ================= */
router.post("/create", (req, res) => {
  const { event_id, user_name, email, phone } = req.body;
  // 🔴 Required fields check
  if (!event_id || !user_name || !email || !phone) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // 🔴 PHONE VALIDATION (THIS WAS MISSING)
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits"
    });
  }

  // Check seats
  db.query(
    "SELECT event_name, available_seats FROM events WHERE id = ?",
    [event_id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ message: "Event not found" });
      }

      if (result[0].available_seats <= 0) {
        return res.status(400).json({ message: "No seats available" });
      }

      const eventName = result[0].event_name;

      // Insert booking
      db.query(
        `
        INSERT INTO bookings (event_id, event_name, user_name, email, phone)
        VALUES (?, ?, ?, ?, ?)
        `,
        [event_id, eventName, user_name, email, phone],
        (err2) => {
          if (err2) {
            return res.status(500).json({ message: "Booking failed" });
          }

          // Decrement seats
          db.query(
            "UPDATE events SET available_seats = available_seats - 1 WHERE id = ?",
            [event_id]
          );

          res.status(201).json({ message: "Booking successful" });
        }
      );
    }
  );
});

module.exports = router;
