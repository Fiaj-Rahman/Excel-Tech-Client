import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthProvider/AuthProvider";
import { FaTrash } from "react-icons/fa"; // Import the Trash icon

const Booking_History = () => {
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

  // Helper function to convert flightTime to AM/PM format
  const formatFlightTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-violet-600">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Booking Notifications</h1>

      <div className="mb-4 text-center">
        <span className="font-semibold text-lg">Total Bookings: {bookings.length}</span>
      </div>

      {/* Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="flex flex-col p-6 space-y-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-violet-600">{booking.flightNumber || "Unknown Flight"}</h3>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Departure: <span className="font-medium">{booking.departureAirport || "N/A"}</span></p>
                <p className="text-sm text-gray-600">Arrival: <span className="font-medium">{booking.arrivalAirport || "N/A"}</span></p>
                <p className="text-sm text-gray-600">Flight Date: <span className="font-medium">{new Date(booking.flightDate).toLocaleDateString()}</span></p>
                <p className="text-sm text-gray-600">Flight Time: <span className="font-medium">{formatFlightTime(booking.flightTime)}</span></p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-lg font-semibold text-violet-600">Total Cost: ${booking.totalCost}</p>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <p>Create Booking: {formatCreatedAt(booking.createdAt)}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleRefund(booking._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FaTrash className="inline mr-2" /> Refund Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking_History;
