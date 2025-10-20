import React, { useState } from "react";
import { cancelBooking } from "../api/api";
import "./CancelBooking.css";

const CancelBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await cancelBooking(bookingId);
      const successMessage = res.detail || "Booking canceled successfully!";
      setMessage(successMessage);
      setModalMessage(successMessage);
      setShowModal(true);
      
      if (res.success) setBookingId("");
    } catch (error) {
      const errorMessage = "Cancellation failed. Please try again.";
      setMessage(errorMessage);
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close modal with Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  return (
    <div className="container">
      <div className="cancel-section">
        <div className="cancel-header">
          <div className="cancel-icon">✕</div>
          <h2>Cancel Booking</h2>
        </div>  
        <div className="cancel-description">
          <p>Enter your booking ID to cancel your flight reservation.</p>
        </div>

        <form onSubmit={handleCancel} className="cancel-form">
          <div className="form-group">
            <label>Booking ID</label>
            <input
              type="text"
              placeholder="Enter your booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !bookingId} 
            className="cancel-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Canceling...
              </>
            ) : (
              "Cancel Booking"
            )}
          </button>
        </form>

        {message && !showModal && (
          <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="cancel-info">
          <h4>Need Help?</h4>
          <p>Contact our customer support:</p>
          <ul>
            <li>📞 +1-800-FLY-BOOK</li>
            <li>✉️ support@flightbook.com</li>
          </ul>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-container">
            <div className={`modal-content ${modalMessage.includes("successfully") ? "success" : "error"}`}>
              <div className="modal-header">
                <div className={`modal-icon ${modalMessage.includes("successfully") ? "success" : "error"}`}>
                  {modalMessage.includes("successfully") ? "✓" : "!"}
                </div>
                <h3>
                  {modalMessage.includes("successfully") 
                    ? "Cancellation Successful" 
                    : "Cancellation Failed"}
                </h3>
                <button 
                  className="modal-close-btn" 
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="modal-okay-btn" 
                  onClick={closeModal}
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
  );
};

export default CancelBooking;