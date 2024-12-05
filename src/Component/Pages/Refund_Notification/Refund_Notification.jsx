import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthProvider/AuthProvider";

const Refund_Notification = () => {
  const { user } = useContext(AuthContext); // Access the logged-in user from AuthContext
  const [refundBookings, setRefundBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to format the createdAt date and time
  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",  // "Thursday"
      year: "numeric",  // "2024"
      month: "long",     // "December"
      day: "numeric",    // "5"
      hour: "2-digit",   // "10"
      minute: "2-digit", // "30"
      hour12: true,      // AM/PM format
    });
  };

  // Fetch booking data from the API
  const fetchRefundBookings = () => {
    setLoading(true);
    fetch("https://excel-server-site.vercel.app/flight-booking")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return response.json();
      })
      .then((data) => {
        // Filter bookings where the user's email matches and the status is "refund" and refund is "yes"
        const filteredBookings = data.filter(
          (booking) => booking.loginPerson === user?.email && booking.refund === "yes"
        );
        setRefundBookings(filteredBookings);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      fetchRefundBookings(); // Fetch refund bookings only when user is available
    }
  }, [user]); // Runs when the user changes

  if (loading) {
    return <div>Loading refund bookings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Refund Notifications</h1>

      <div className="mb-4 text-center">
        <span className="font-semibold text-lg">Total Refunds: {refundBookings.length}</span>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-violet-600 text-black bg-gray-200">
              <th className="px-4 py-2 border text-center">Flight Number</th>
              <th className="px-4 py-2 border text-center">Departure</th>
              <th className="px-4 py-2 border text-center">Arrival</th>
              <th className="px-4 py-2 border text-center">Flight Date</th>
              <th className="px-4 py-2 border text-center">Flight Time</th>
              <th className="px-4 py-2 border text-center">Seat Count</th>
              <th className="px-4 py-2 border text-center">Total Cost</th>
              <th className="px-4 py-2 border text-center">Created At</th> {/* New column for createdAt */}
            </tr>
          </thead>
          <tbody>
            {refundBookings.map((booking) => (
              <tr key={booking._id} className="bg-white hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 border text-center">{booking.flightNumber}</td>
                <td className="px-4 py-2 border text-center">{booking.departureAirport}</td>
                <td className="px-4 py-2 border text-center">{booking.arrivalAirport}</td>
                <td className="px-4 py-2 border text-center">{new Date(booking.flightDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{booking.flightTime}</td>
                <td className="px-4 py-2 border text-center">{booking.seatCount}</td>
                <td className="px-4 py-2 border text-center">${booking.totalCost}</td>
                <td className="px-4 py-2 border text-center">{formatCreatedAt(booking.createdAt)}</td> {/* Display formatted createdAt */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refund_Notification;
