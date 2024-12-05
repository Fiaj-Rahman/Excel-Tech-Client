import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing the Edit and Delete icons

// Helper function to convert 24-hour time to 12-hour AM/PM format
const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12; // Convert 0 to 12 for midnight
  const minuteFormatted = m < 10 ? `0${m}` : m; // Add leading zero to minutes if less than 10

  return `${hour12}:${minuteFormatted} ${period}`;
};

// Helper function to format the createdAt timestamp
const formatCreatedAt = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    weekday: "long", // "Monday"
    year: "numeric", // "2024"
    month: "long", // "December"
    day: "numeric", // "3"
    hour: "numeric", // "9"
    minute: "numeric", // "45"
    second: "numeric", // "24"
    hour12: true, // 12-hour clock
  });
};

const Booking_Flight = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State to keep track of search input
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [formData, setFormData] = useState({}); // State for the form data
  const [formErrors, setFormErrors] = useState({}); // State for form errors

  // Fetch flight data from the server
  const fetchFlights = () => {
    setLoading(true);
    fetch("https://excel-server-site.vercel.app/flight-booking")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }
        return response.json();
      })
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFlights(); // Initial fetch when the component mounts
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    fetch(`https://excel-server-site.vercel.app/flight-booking/${id}`, { method: "DELETE" })
      .then(() => {
        setFlights(flights.filter((flight) => flight._id !== id));
      })
      .catch((error) => console.error("Error deleting flight:", error));
  };

  const handleEdit = (flight) => {
    setFormData({
      _id: flight._id,
      flightNumber: flight.flightNumber,
      userEmail: flight.user.email,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      flightDate: flight.flightDate,
      flightTime: flight.flightTime,
      totalCost: flight.totalCost,
    });
    setIsModalOpen(true); // Open the modal when Edit button is clicked
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "flightDate") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: new Date(value).toISOString().split("T")[0], // Ensures the date is in 'yyyy-MM-dd' format
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSave = () => {
    // Validate the form data before saving
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // Prevent saving if there are validation errors
    }

    const { _id, ...updatedData } = formData; // Exclude the _id field

    fetch(`https://excel-server-site.vercel.app/flight-booking/${_id}`, { // Use _id for the URL
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData), // Send the updated data without the _id field
    })
      .then((response) => response.json())
      .then((data) => {
        fetchFlights(); // Refresh the flight list
        setIsModalOpen(false); // Close the modal
        alert("Flight updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating flight:", error);
        alert("An error occurred while updating the flight.");
      });
  };

  // Basic form validation function
  const validateForm = (data) => {
    const errors = {};
    if (!data.flightNumber) {
      errors.flightNumber = "Flight number is required.";
    }
    if (!data.userEmail) {
      errors.userEmail = "Email is required.";
    }
    if (!data.departureAirport) {
      errors.departureAirport = "Departure airport is required.";
    }
    if (!data.arrivalAirport) {
      errors.arrivalAirport = "Arrival airport is required.";
    }
    if (!data.flightDate) {
      errors.flightDate = "Flight date is required.";
    }
    if (!data.flightTime) {
      errors.flightTime = "Flight time is required.";
    }
    if (!data.totalCost || data.totalCost <= 0) {
      errors.totalCost = "Price should be a positive number.";
    }
    return errors;
  };

  const filteredFlights = flights.filter((flight) =>
    flight.flightNumber && flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading flights...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Booking Flights</h1>

      <div className="mb-4 text-center">
        <span className="font-semibold text-lg">Total Bookings: {flights.length}</span>
      </div>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Flight Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-violet-600 text-black bg-gray-200">
              <th className="px-4 py-2 border text-center">Flight Number</th>
              <th className="px-4 py-2 border text-center">Email</th>
              <th className="px-4 py-2 border text-center">Departure</th>
              <th className="px-4 py-2 border text-center">Arrival</th>
              <th className="px-4 py-2 border text-center">Flight Date</th>
              <th className="px-4 py-2 border text-center">Flight Time</th>
              <th className="px-4 py-2 border text-center">Price</th>
              <th className="px-4 py-2 border text-center">Created At</th> {/* Added Created At column */}
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map((flight) => (
              <tr key={flight._id} className="bg-white hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 border text-center">{flight.flightNumber}</td>
                <td className="px-4 py-2 border text-center">{flight.user.email}</td>
                <td className="px-4 py-2 border text-center">{flight.departureAirport}</td>
                <td className="px-4 py-2 border text-center">{flight.arrivalAirport}</td>
                <td className="px-4 py-2 border text-center">{flight.flightDate}</td>
                <td className="px-4 py-2 border text-center">{convertTo12HourFormat(flight.flightTime)}</td>
                <td className="px-4 py-2 border text-center">{flight.totalCost}</td>
                <td className="px-4 py-2 border text-center">{formatCreatedAt(flight.createdAt)}</td> {/* Display formatted createdAt */}
                <td className="px-4 py-2 border text-center flex justify-center">
                  <button onClick={() => handleEdit(flight)} className="px-2 py-1 bg-blue-500 text-white rounded-md mx-1">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(flight._id)} className="px-2 py-1 bg-red-500 text-white rounded-md mx-1">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal code can go here */}
    </div>
  );
};

export default Booking_Flight;
