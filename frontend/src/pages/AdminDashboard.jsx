import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
   const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const [eventData, setEventData] = useState({
    event_name: "",
    event_type: "",
    event_date: "",
    registration_ends: "",
    max_seats: "",
    venue: "",
    coordinator_number: "",
  });

  /* FETCH EVENTS */
  const fetchEvents = () => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  /* CREATE EVENT */
  const handleCreateEvent = async () => {
    if (
      !eventData.event_name ||
      !eventData.event_date ||
      !eventData.registration_ends ||
      !eventData.max_seats
    ) {
      alert("Please fill all required fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      alert("Event created successfully ✅");
      setShowModal(false);
      fetchEvents();
      setEventData({
        event_name: "",
        event_type: "",
        event_date: "",
        registration_ends: "",
        max_seats: "",
        venue: "",
        coordinator_number: "",
      });
    } else {
      alert("Failed to create event ");
    }
  };
   /* 🚪 LOGOUT FUNCTION (THIS WAS MISSING) */
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };
  return (
    <>
      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-logo">EventMS - AdminDashboard</div>
        <nav className="admin-nav">
          <button className="header-btn" onClick={() => setShowModal(true)}>
            Create Event
          </button>
          <button className="header-btn logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* CONTENT */}
      <div className="admin-content">

        {/* ALL EVENTS */}
        <h2 className="section-heading">All Events</h2>
        <div className="all-events">
          {events.map((e) => (
            <div key={e.id} className="event-line">
              <span
                className={
                  new Date(e.registration_ends) < new Date()
                    ? "ended-text"
                    : "live-text"
                }
              >
                {e.event_name} – {new Date(e.event_date).toDateString()}
              </span>
            </div>
          ))}
        </div>

        {/* LIVE EVENT DETAILS */}
        <h2 className="section-heading">Live Event Details</h2>

        <div className="table-wrapper">
          <table className="event-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Date</th>
                <th>Registration Ends</th>
                <th>Max Seats</th>
                <th>Available Seats</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((e) => new Date(e.registration_ends) >= new Date())
                .map((e) => (
                  <tr key={e.id}>
                    <td>{e.event_name}</td>
                    <td>{e.event_date}</td>
                    <td>{e.registration_ends}</td>
                    <td>{e.max_seats}</td>
                    <td className="seat-highlight">{e.available_seats}</td>
                    <td>{e.venue}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>

            <h2>Create New Event</h2>

            <form className="event-form">
              <input name="event_name" placeholder="Event Name" value={eventData.event_name} onChange={handleChange} />
              <input name="event_type" placeholder="Event Type" value={eventData.event_type} onChange={handleChange} />

              <label className="date-label">Event Date</label>
              <input type="date" name="event_date" value={eventData.event_date} onChange={handleChange} />

              <label className="date-label">Registration Ends On</label>
              <input type="date" name="registration_ends" value={eventData.registration_ends} onChange={handleChange} />

              <input type="number" name="max_seats" placeholder="Maximum Seats" value={eventData.max_seats} onChange={handleChange} />
              <input name="venue" placeholder="Venue" value={eventData.venue} onChange={handleChange} />
              <input name="coordinator_number" placeholder="Coordinator Number" value={eventData.coordinator_number} onChange={handleChange} />

              <button type="button" className="submit-btn" onClick={handleCreateEvent}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
