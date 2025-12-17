const express = require("express");
const cors = require("cors");

/* ROUTES */
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users"); 
const eventRoutes = require("./routes/events");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTE CONNECTIONS */
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", require("./routes/bookings"));

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

/* START SERVER */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
