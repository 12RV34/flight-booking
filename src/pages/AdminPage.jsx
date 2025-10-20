import React, { useState, useEffect } from "react";
import { getFlights } from "../api/api";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    flight_number: "",
    airline: "",
    departure: "",
    destination: "",
    available_seats: 0,
    departure_time: "",
    arrival_time: "",
    price: 0,
    duration: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = "adminfly@123";

  // Fetch flights on load
  const fetchFlights = async () => {
    try {
      const data = await getFlights();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    if (!showPasswordModal) {
      fetchFlights();
    }
  }, [showPasswordModal]);

  // Password verification
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      setMessage("");
    } else {
      setMessage("Incorrect password. Please try again.");
    }
  };

  const handleCancel = () => {
    window.location.href = "/"; // Redirect to home page
  };

  // Handle input change for new flight
  const handleNewFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prev) => ({ ...prev, [name]: value }));
  };

  // Add new flight
  const handleAddFlight = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/api/flights", newFlight);
      fetchFlights();
      setNewFlight({
        flight_number: "",
        airline: "",
        departure: "",
        destination: "",
        available_seats: 0,
        departure_time: "",
        arrival_time: "",
        price: 0,
        duration: "",
      });
      setMessage("Flight added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding flight:", err);
      setMessage("Error adding flight. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Delete flight
  const handleDeleteFlight = async (id) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/flights/${id}`);
        fetchFlights();
        setMessage("Flight deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting flight:", err);
        setMessage("Error deleting flight. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  // Open edit modal
  const handleEditClick = (flight) => {
    setEditingFlight({ ...flight });
    setShowEditModal(true);
  };

  // Handle edit modal input changes
  const handleEditChange = (field, value) => {
    setEditingFlight(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save edited flight
  const handleUpdateFlight = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/flights/${editingFlight.id}`, editingFlight);
      fetchFlights();
      setShowEditModal(false);
      setEditingFlight(null);
      setMessage("Flight updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating flight:", err);
      setMessage("Error updating flight. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingFlight(null);
  };

  // Password Modal Backdrop Click
  const handlePasswordBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Edit Modal Backdrop Click
  const handleEditBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeEditModal();
    }
  };

  // Escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showEditModal) closeEditModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showEditModal]);

  // Show password modal
  if (showPasswordModal) {
    return (
      <div className="password-modal-backdrop" onClick={handlePasswordBackdropClick}>
        <div className="password-modal-container">
          <div className="password-modal-content">
            <div className="password-modal-header">
              <div className="lock-icon">🔒</div>
              <h3>Admin Access Required</h3>
            </div>
            
            <div className="password-modal-body">
              <p>Please enter the admin password to access this page:</p>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                {message && <div className="error-message">{message}</div>}
                <div className="password-actions">
                  <button type="submit" className="btn-primary">
                    Access Admin
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Edit Flight Modal */}
      {showEditModal && editingFlight && (
        <div className="edit-modal-backdrop" onClick={handleEditBackdropClick}>
          <div className="edit-modal-container">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3>Edit Flight {editingFlight.flight_number}</h3>
                <button className="close-btn" onClick={closeEditModal}>×</button>
              </div>

              <div className="edit-modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Flight Number</label>
                    <input
                      value={editingFlight.flight_number}
                      onChange={(e) => handleEditChange("flight_number", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Airline</label>
                    <input
                      value={editingFlight.airline}
                      onChange={(e) => handleEditChange("airline", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Departure</label>
                    <input
                      value={editingFlight.departure}
                      onChange={(e) => handleEditChange("departure", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      value={editingFlight.destination}
                      onChange={(e) => handleEditChange("destination", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Available Seats</label>
                    <input
                      type="number"
                      value={editingFlight.available_seats}
                      onChange={(e) => handleEditChange("available_seats", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      value={editingFlight.price}
                      onChange={(e) => handleEditChange("price", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Departure Time</label>
                    <input
                      value={editingFlight.departure_time}
                      onChange={(e) => handleEditChange("departure_time", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Arrival Time</label>
                    <input
                      value={editingFlight.arrival_time}
                      onChange={(e) => handleEditChange("arrival_time", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Duration</label>
                  <input
                    value={editingFlight.duration}
                    onChange={(e) => handleEditChange("duration", e.target.value)}
                  />
                </div>
              </div>

              <div className="edit-modal-footer">
                <button onClick={handleUpdateFlight} className="btn-primary">
                  Save Changes
                </button>
                <button onClick={closeEditModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage Flight Operations</p>
      </div>

      {message && (
        <div className={`admin-message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {/* Add Flight Form */}
      <div className="add-flight-section">
        <h3>Add New Flight</h3>
        <div className="add-flight-form">
          <div className="form-row">
            <div className="form-group">
              <input
                name="flight_number"
                placeholder="Flight Number"
                value={newFlight.flight_number}
                onChange={handleNewFlightChange}
              />
            </div>
            <div className="form-group">
              <input
                name="airline"
                placeholder="Airline"
                value={newFlight.airline}
                onChange={handleNewFlightChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                name="departure"
                placeholder="Departure City"
                value={newFlight.departure}
                onChange={handleNewFlightChange}
              />
            </div>
            <div className="form-group">
              <input
                name="destination"
                placeholder="Destination City"
                value={newFlight.destination}
                onChange={handleNewFlightChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                name="available_seats"
                type="number"
                placeholder="Available Seats"
                value={newFlight.available_seats}
                onChange={handleNewFlightChange}
              />
            </div>
            <div className="form-group">
              <input
                name="price"
                type="number"
                placeholder="Price ($)"
                value={newFlight.price}
                onChange={handleNewFlightChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                name="departure_time"
                placeholder="Departure Time (HH:MM)"
                value={newFlight.departure_time}
                onChange={handleNewFlightChange}
              />
            </div>
            <div className="form-group">
              <input
                name="arrival_time"
                placeholder="Arrival Time (HH:MM)"
                value={newFlight.arrival_time}
                onChange={handleNewFlightChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <input
              name="duration"
              placeholder="Duration (e.g., 2h 30m)"
              value={newFlight.duration}
              onChange={handleNewFlightChange}
            />
          </div>

          <button onClick={handleAddFlight} className="btn-primary add-flight-btn">
            Add Flight
          </button>
        </div>
      </div>

      {/* Flights Table */}
      <div className="flights-section">
        <h3>Manage Existing Flights</h3>
        <div className="table-container">
          <table className="flights-table">
            <thead>
              <tr>
                <th>Flight No.</th>
                <th>Airline</th>
                <th>Route</th>
                <th>Seats</th>
                <th>Schedule</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td data-label="Flight No.">{flight.flight_number}</td>
                  <td data-label="Airline">{flight.airline}</td>
                  <td data-label="Route">
                    <div className="route-cell">
                      <span className="departure">{flight.departure}</span>
                      <span className="arrow">→</span>
                      <span className="destination">{flight.destination}</span>
                    </div>
                  </td>
                  <td data-label="Seats">{flight.available_seats}</td>
                  <td data-label="Schedule">
                    <div className="schedule-cell">
                      <div>{flight.departure_time}</div>
                      <div>{flight.arrival_time}</div>
                    </div>
                  </td>
                  <td data-label="Price">${flight.price}</td>
                  <td data-label="Duration">{flight.duration}</td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEditClick(flight)} 
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteFlight(flight.id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;