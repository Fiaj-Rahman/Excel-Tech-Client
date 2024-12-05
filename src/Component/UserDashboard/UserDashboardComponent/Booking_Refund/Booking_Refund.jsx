import React, { useState, useEffect } from "react";

const Booking_Refund = () => {
  const [refundFlights, setRefundFlights] = useState([]); // State to store refund flights
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
 

  // Fetch flights with status = 'refund'
  const fetchRefundFlights = () => {
    setLoading(true);
    fetch("https://excel-server-site.vercel.app/flight-booking")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }
        return response.json();
      })
      .then((data) => {
        const refundData = data.filter(flight => flight.status === "refund");
        setRefundFlights(refundData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRefundFlights(); // Fetch refund flights when the component mounts
  }, []);

  // Handle refund approval with confirmation
  const handleRefundApproval = (id) => {
    if (window.confirm("Are you sure you want to approve this refund?")) {
      fetch(`https://excel-server-site.vercel.app/flights-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refund: "yes" }),
      })
        .then((response) => response.json())
        .then(() => {
          // After successful update, refresh the flight list
          fetchRefundFlights();
          alert("Refund Approved!");
        })
        .catch((error) => {
          console.error("Error approving refund:", error);
          alert("An error occurred while approving the refund.");
        });
    }
  };

  if (loading) {
    return <div>Loading refund flights...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Booking Refunds</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-violet-600 text-black">
              <th className="px-4 py-2 border text-center">Flight Number</th>
              <th className="px-4 py-2 border text-center">User Email</th>
              <th className="px-4 py-2 border text-center">Departure Airport</th>
              <th className="px-4 py-2 border text-center">Arrival Airport</th>
              <th className="px-4 py-2 border text-center">Flight Date</th>
              <th className="px-4 py-2 border text-center">Refund Status</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {refundFlights.map((flight) => (
              <tr key={flight._id} className="bg-white hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 border text-center">{flight.flightNumber}</td>
                <td className="px-4 py-2 border text-center">{flight.user.email}</td>
                <td className="px-4 py-2 border text-center">{flight.departureAirport}</td>
                <td className="px-4 py-2 border text-center">{flight.arrivalAirport}</td>
                <td className="px-4 py-2 border text-center">{new Date(flight.flightDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{flight.refund === 'yes' ? 'Refunded' : 'Pending'}</td>
                <td className="px-4 py-2 border text-center">
                  {flight.refund !== "yes" && (
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                      onClick={() => handleRefundApproval(flight._id)}
                    >
                      Approve Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking_Refund;
