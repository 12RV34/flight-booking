import React, { useState } from "react";
import { bookFlight } from "../api/api";
import "./BookFlight.css";

const BookFlight = ({ flight, onClose }) => {
  const [passenger, setPassenger] = useState("");
  const [passport, setPassport] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = { passenger_name: passenger, passport_number: passport, email, phone };
      const res = await bookFlight(flight.id, data);

      if (res.success) {
        setBookingId(res.booking_id);
        setShowSuccessModal(true);
        setPassenger("");
        setPassport("");
        setEmail("");
        setPhone("");
      } else {
        setMessage(res.detail || "Booking failed. Please try again.");
      }
    } catch (error) {
      setMessage("Booking failed. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the booking modal as well
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleSuccessClose();
    }
  };

  // Close modal with Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showSuccessModal) {
        handleSuccessClose();
      }
    };

    if (showSuccessModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showSuccessModal]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Book Flight {flight.flight_number}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="flight-summary">
          <div className="route">
            <span className="city">{flight.departure}</span>
            <span className="arrow">→</span>
            <span className="city">{flight.destination}</span>
          </div>
          <div className="details">
            <span>{flight.airline}</span>
            <span>•</span>
            <span>{flight.departure_time} - {flight.arrival_time}</span>
            <span>•</span>
            <span>{flight.duration}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Passenger Name</label>
            <input type="text" placeholder="Enter full name" value={passenger} onChange={e => setPassenger(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Passport Number</label>
            <input type="text" placeholder="Enter passport number" value={passport} onChange={e => setPassport(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>

        {message && !showSuccessModal && (
          <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Success Popup Modal */}
        {showSuccessModal && (
          <div className="success-modal-backdrop" onClick={handleBackdropClick}>
            <div className="success-modal-container">
              <div className="success-modal-content">
                <div className="success-modal-header">
                  <div className="success-icon">✓</div>
                  <h3>Booking Successful!</h3>
                  <button 
                    className="success-close-btn" 
                    onClick={handleSuccessClose}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
                
                <div className="success-modal-body">
                  <p>Your flight has been booked successfully!</p>
                  <div className="booking-id-section">
                    <span className="booking-id-label">Booking ID:</span>
                    <span className="booking-id-value">{bookingId}</span>
                  </div>
                  <div className="success-details">
                    <div className="success-detail-item">
                      <span className="detail-label">Flight:</span>
                      <span className="detail-value">{flight.flight_number}</span>
                    </div>
                    <div className="success-detail-item">
                      <span className="detail-label">Route:</span>
                      <span className="detail-value">{flight.departure} → {flight.destination}</span>
                    </div>
                    <div className="success-detail-item">
                      <span className="detail-label">Passenger:</span>
                      <span className="detail-value">{passenger}</span>
                    </div>
                  </div>
                </div>
                
                <div className="success-modal-footer">
                  <button 
                    className="success-okay-btn" 
                    onClick={handleSuccessClose}
                    autoFocus
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFlight;