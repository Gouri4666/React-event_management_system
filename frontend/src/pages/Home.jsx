import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h2 className="logo">EventMS</h2>
        <nav>
          <Link to="/admin/login" className="admin-link">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Manage Events Effortlessly</h1>
          <p>
            Plan, organize, and manage your events with ease using our
            simple and powerful event management system.
          </p>

          {/*  FIXED */}
          <Link to="/user/login" className="get-started-btn">
            Get Started
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
            alt="Event management"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
