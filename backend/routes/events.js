const express = require("express");
const router = express.Router();
const db = require("../db");

/* =========================
   CREATE EVENT (ADMIN)
========================= */
router.post("/create", (req, res) => {
  const {
    event_name,
    event_type,
    event_date,
    registration_ends,
    max_seats,
    venue,
    coordinator_number
  } = req.body;

  if (
    !event_name ||
    !event_date ||
    !registration_ends ||
    !max_seats
  ) {
    return res.status(400).json({
      message: "Required fields missing"
    });
  }

  const insertQuery = `
    INSERT INTO events
    (event_name, event_type, event_date, registration_ends,
     max_seats, available_seats, venue, coordinator_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [
      event_name,
      event_type,
      event_date,
      registration_ends,
      max_seats,
      max_seats,          
      venue,
      coordinator_number
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to create event"
        });
      }

      res.status(201).json({
        message: "Event created successfully"
      });
    }
  );
});


/* =========================
   GET ALL EVENTS (USER)
========================= */
router.get("/all", (req, res) => {
  const query = "SELECT * FROM events ORDER BY event_date";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch events" });
    }

    res.status(200).json(results);
  });
});


module.exports = router;
