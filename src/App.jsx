import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightList from "./pages/FlightList";
import CancelBooking from "./components/CancelBooking";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FlightList />} />
        <Route path="/my-bookings" element={<FlightList />} />
        <Route path="/cancel" element={<CancelBooking />} />
        <Route path="/admin-dashboard" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
