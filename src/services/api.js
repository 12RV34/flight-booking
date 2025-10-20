// // Mock API functions - replace with actual API calls
// export const bookFlight = async (flightId, data) => {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         detail: "Booking confirmed!",
//         booking_id: `BK${Date.now()}`
//       });
//     }, 1000);
//   });
// };

// export const cancelBooking = async (bookingId) => {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         detail: "Booking canceled successfully!"
//       });
//     }, 1000);
//   });
// };

// export const getFlights = async () => {
//   // Mock flight data
//   return [
//     {
//       id: 1,
//       flight_number: "AI-101",
//       airline: "Air India",
//       departure: "DEL",
//       destination: "BOM",
//       available_seats: 45,
//       departure_time: "08:00 AM",
//       arrival_time: "10:30 AM",
//       price: 4500,
//       duration: "2h 30m"
//     },
//     {
//       id: 2,
//       flight_number: "IG-202",
//       airline: "IndiGo",
//       departure: "DEL",
//       destination: "BLR",
//       available_seats: 0,
//       departure_time: "02:15 PM",
//       arrival_time: "05:00 PM",
//       price: 6200,
//       duration: "2h 45m"
//     },
//     {
//       id: 3,
//       flight_number: "SG-303",
//       airline: "SpiceJet",
//       departure: "DEL",
//       destination: "MAA",
//       available_seats: 12,
//       departure_time: "06:30 PM",
//       arrival_time: "09:15 PM",
//       price: 5800,
//       duration: "2h 45m"
//     }
//   ];
// };
export const getFlights = async () => {
  const res = await fetch("http://127.0.0.1:5000/api/flights");
  return await res.json();
};

export const getBookings = async () => {
  const res = await fetch("http://127.0.0.1:5000/api/bookings");
  return await res.json();
};

export const bookFlight = async (flightId, data) => {
  const res = await fetch("http://127.0.0.1:5000/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flight_id: flightId, ...data })
  });
  return await res.json();
};
