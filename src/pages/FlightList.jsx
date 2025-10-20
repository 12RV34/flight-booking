import React, { useEffect, useState } from "react";
import { getFlights } from "../api/api";  // make sure the path is correct
import BookFlight from "../components/BookFlight";
import "./FlightList.css";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlights = async () => {
      try { 
        const data = await getFlights();
        setFlights(data);
      } catch (error) {
        console.error("Error loading flights:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFlights();
  }, []);

  const getAirlineLogo = (airline) => {
    const logos = {
      "Air India": "fas fa-plane",
      "IndiGo": "fas fa-plane-departure",
      "SpiceJet": "fas fa-fighter-jet",
      "Emirates": "fas fa-globe-americas",
      "Qatar Airways": "fas fa-star",
      "Singapore Airlines": "fas fa-rocket",
      "British Airways": "fas fa-flag-uk",
      "Lufthansa": "fas fa-feather-alt"
    };
    return logos[airline] || "fas fa-plane";
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading available flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>Available Flights</h1>
        <p>Find and book your perfect flight from our selection</p>
      </div>

      <div className="flights-container">
        {flights.map((flight, index) => (
          <div key={flight.id} className="flight-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flight-header">
              <div className="airline-info">
                <span className="airline-logo">
                  <i className={getAirlineLogo(flight.airline)}></i>
                </span>
                <div>
                  <div className="flight-number">{flight.flight_number}</div>
                  <div className="airline-name">{flight.airline}</div>
                </div>
              </div>
              <div className="price">₹{flight.price}</div>
            </div>

            <div className="flight-route">
              <div className="route-section">
                <div className="time">{flight.departure_time}</div>
                <div className="city">{flight.departure}</div>
              </div>
              <div className="route-middle">
                <div className="duration">{flight.duration}</div>
                <div className="route-line">
                  <div className="dot start"></div>
                  <div className="line"></div>
                  <div className="dot end"></div>
                </div>
              </div>
              <div className="route-section">
                <div className="time">{flight.arrival_time}</div>
                <div className="city">{flight.destination}</div>
              </div>
            </div>

            <div className="flight-footer">
              <div className="seats-info">
                <span className={`seats ${flight.available_seats === 0 ? "sold-out" : "available"}`}>
                  <i className={`fas ${flight.available_seats === 0 ? "fa-times-circle" : "fa-check-circle"}`}></i>
                  {flight.available_seats === 0 ? " Sold Out" : ` ${flight.available_seats} seats left`}
                </span>
              </div>
              <button
                className={`book-btn ${flight.available_seats === 0 ? "disabled" : ""}`}
                onClick={() => setSelectedFlight(flight)}
                disabled={flight.available_seats === 0}
              >
                <i className="fas fa-ticket-alt"></i>
                {flight.available_seats === 0 ? " Sold Out" : " Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFlight && (
        <BookFlight flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
      )}
    </div>
  );
};

export default FlightList;
