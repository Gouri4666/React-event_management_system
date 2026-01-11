import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const [liveEvents, setLiveEvents] = useState([]);
  const [endedEvents, setEndedEvents] = useState([]);

  // 🔹 Booking modal state
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [phone, setPhone] = useState("");

  /* 🔹 DATE FORMATTER */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🔒 Protect page
  useEffect(() => {
    if (!userEmail) {
      navigate("/user/login");
    }
  }, [navigate, userEmail]);

  // 📥 Fetch events
  const fetchEvents = () => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        const live = [];
        const ended = [];

        data.forEach((event) => {
          const regEnd = new Date(event.registration_ends);
          if (regEnd >= today) live.push(event);
          else ended.push(event);
        });

        setLiveEvents(live);
        setEndedEvents(ended);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ BOOK EVENT
  const handleBooking = async () => {
    if (!selectedEvent || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          user_name: userName,
          email: userEmail,
          phone: phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Booking successful ✅");
        setShowBooking(false);
        setPhone("");
        setSelectedEvent(null);
        setSelectedEventId("");
        fetchEvents();
      } else {
        alert(data.message || "Booking failed ❌");
      }
    } catch (err) {
      alert("Server error ❌");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="user-header">
        <h2>EventMS</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {/* BODY */}
      <div className="user-container">
        <h1 className="welcome-text">Welcome, {userName}</h1>
        <p className="subtitle">Book your seats now. Click here</p>

        <button
          className="book-now-btn"
          onClick={() => setShowBooking(true)}
        >
          Book Now
        </button>

        {/* CARDS */}
        <div className="cards">

          {/* LIVE EVENTS */}
          <div className="card live">
            <h3>Live Events</h3>

            {liveEvents.length === 0 && (
              <p className="muted">No live events</p>
            )}

            {liveEvents.map((e) => (
              <div key={e.id} className="event-item">
                <p className="event-title">{e.event_name}</p>
                <p className="event-sub">
                  Registration ends on {formatDate(e.registration_ends)}
                </p>
              </div>
            ))}
          </div>

          {/* ENDED EVENTS */}
          <div className="card ended">
            <h3>Ended Events</h3>

            {endedEvents.length === 0 && (
              <p className="muted">No ended events</p>
            )}

            {endedEvents.map((e) => (
              <div key={e.id} className="event-item">
                <p className="event-title">{e.event_name}</p>
                <p className="event-sub">
                  Registration ended on {formatDate(e.registration_ends)}
                </p>
              </div>
            ))}
          </div>

          {/* PROFILE */}
          <div className="card profile">
            <h3>Profile</h3>
            <p><strong>Username:</strong> {userName}</p>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {showBooking && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Book Event</h2>

            <label>Select Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedEventId(id);
                const ev = liveEvents.find(
                  (event) => event.id === Number(id)
                );
                setSelectedEvent(ev);
              }}
            >
              <option value="">-- Select Event --</option>
              {liveEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.event_name}
                </option>
              ))}
            </select>

            {selectedEvent && (
              <>
                <p><strong>Max Seats:</strong> {selectedEvent.max_seats}</p>
                <p><strong>Available Seats:</strong> {selectedEvent.available_seats}</p>
              </>
            )}

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input type="email" value={userEmail} disabled />

            <button className="confirm-btn" onClick={handleBooking}>
              Book Now
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowBooking(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
