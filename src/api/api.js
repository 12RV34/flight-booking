export const API_URL = "http://127.0.0.1:5000/api";

export const getFlights = async () => {
  const res = await fetch(`${API_URL}/flights`);
  return await res.json();
};

export const getBookings = async () => {
  const res = await fetch(`${API_URL}/bookings`);
  return await res.json();
};

export const bookFlight = async (flightId, data) => {
  const res = await fetch(`${API_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flight_id: flightId, ...data })
  });
  return await res.json();
};

export const cancelBooking = async (bookingId) => {
  const res = await fetch(`${API_URL}/cancel/${bookingId}`, {
    method: "DELETE"
  });
  return await res.json();
};
