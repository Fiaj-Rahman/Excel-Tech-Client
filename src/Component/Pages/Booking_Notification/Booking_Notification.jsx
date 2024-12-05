import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthProvider/AuthProvider";
import { FaTrash } from "react-icons/fa"; // Import the Trash icon

const Booking_Notification = () => {
  const { user } = useContext(AuthContext); // Access the logged-in user from AuthContext
  const [bookings, setBookings] = useState([]);
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
  const fetchBookings = () => {
    setLoading(true);
    fetch("https://excel-server-site.vercel.app/flight-booking")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return response.json();
      })
      .then((data) => {
        // Filter bookings where the user's email matches and the status is not "refund"
        const filteredBookings = data.filter(
          (booking) => booking.loginPerson === user?.email && booking.status !== "refund"
        );
        setBookings(filteredBookings);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      fetchBookings(); // Fetch bookings only when user is available
    }
  }, [user]); // Runs when the user changes

  const handleRefund = (bookingId) => {
    const confirmRefund = window.confirm("Are you sure you want to refund this booking?");
    if (!confirmRefund) return;

    // Send PUT request to update the booking's status to "refund"
    fetch(`https://excel-server-site.vercel.app/flight-bookings/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Please wait. We will check all your information, and once everything is verified, we will process your dollar refund.");
        fetchBookings(); // Refresh the bookings list after update
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
        alert("An error occurred while updating the booking.");
      });
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Booking Notifications</h1>

      <div className="mb-4 text-center">
        <span className="font-semibold text-lg">Total Bookings: {bookings.length}</span>
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
              <th className="px-4 py-2 border text-center">Created Booking</th> {/* New column for createdAt */}
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="bg-white hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 border text-center">{booking.flightNumber}</td>
                <td className="px-4 py-2 border text-center">{booking.departureAirport}</td>
                <td className="px-4 py-2 border text-center">{booking.arrivalAirport}</td>
                <td className="px-4 py-2 border text-center">{new Date(booking.flightDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{booking.flightTime}</td>
                <td className="px-4 py-2 border text-center">{booking.seatCount}</td>
                <td className="px-4 py-2 border text-center">${booking.totalCost}</td>
                <td className="px-4 py-2 border text-center">{formatCreatedAt(booking.createdAt)}</td> {/* Display formatted createdAt */}
                <td className="px-4 py-2 border text-center">
                  <button
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-violet-700 mr-2 my-2 transition duration-300"
                    onClick={() => handleRefund(booking._id)} // Trigger refund action
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking_Notification;
