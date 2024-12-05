import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';  // Importing the Edit and Delete icons

// Helper function to convert 24-hour time to 12-hour AM/PM format
const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12; // Convert 0 to 12 for midnight
  const minuteFormatted = m < 10 ? `0${m}` : m; // Add leading zero to minutes if less than 10

  return `${hour12}:${minuteFormatted} ${period}`;
};

const Flight_Management = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    flightDate: '',
    flightTime: '',
    price: '',
  });
  const [searchTerm, setSearchTerm] = useState(''); // State to keep track of search input

  // Fetch flight data from the server
  const fetchFlights = () => {
    setLoading(true);
    fetch('https://excel-server-site.vercel.app/flight')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
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
    const confirmDelete = window.confirm('Are you sure you want to delete this flight?');
    if (!confirmDelete) return;

    fetch(`https://excel-server-site.vercel.app/flights/${id}`, { method: 'DELETE' })
      .then(() => {
        setFlights(flights.filter((flight) => flight._id !== id));
      })
      .catch((error) => console.error('Error deleting flight:', error));
  };

  const handleEdit = (flight) => {
    setSelectedFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      flightDate: flight.flightDate,
      flightTime: flight.flightTime,
      price: flight.price,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Show a confirmation prompt before proceeding with the update
    const confirmUpdate = window.confirm('Are you sure you want to update the flight details?');
    if (!confirmUpdate) return; // If the user cancels, exit the function

    // Proceed with the update after confirmation
    fetch(`https://excel-server-site.vercel.app/flights/${selectedFlight._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Refetch the flights after the update
        fetchFlights(); // This fetches the updated list of flights from the server
        setIsModalOpen(false);
        alert('Flight updated successfully!');  // Show success alert after successful update
      })
      .catch((error) => {
        console.error('Error updating flight:', error);
        alert('An error occurred while updating the flight.');  // Show error alert on failure
      });
  };

  const filteredFlights = flights.filter((flight) =>
    flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter flights based on search term

  if (loading) {
    return <div>Loading flights...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-violet-600">Flight Management</h1>

      {/* Display total flight count */}
      <div className="mb-4 text-center">
        <span className="font-semibold text-lg">Total Flights: {flights.length}</span>
      </div>

      {/* Search input */}
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
              <th className="px-4 py-2 border text-center">Departure</th>
              <th className="px-4 py-2 border text-center">Arrival</th>
              <th className="px-4 py-2 border text-center">Flight Date</th>
              <th className="px-4 py-2 border text-center">Flight Time</th>
              <th className="px-4 py-2 border text-center">Price</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map((flight) => (
              <tr key={flight._id} className="bg-white hover:bg-gray-100 transition duration-300">
                <td className="px-4 py-2 border text-center">{flight.flightNumber}</td>
                <td className="px-4 py-2 border text-center">{flight.departureAirport}</td>
                <td className="px-4 py-2 border text-center">{flight.arrivalAirport}</td>
                <td className="px-4 py-2 border text-center">{new Date(flight.flightDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{convertTo12HourFormat(flight.flightTime)}</td>
                <td className="px-4 py-2 border text-center">${flight.price}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-violet-700 mr-2 my-2 transition duration-300"
                    onClick={() => handleEdit(flight)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    onClick={() => handleDelete(flight._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing flight details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Flight</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Flight Number</label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Departure Airport</label>
              <input
                type="text"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Arrival Airport</label>
              <input
                type="text"
                name="arrivalAirport"
                value={formData.arrivalAirport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Flight Date</label>
              <input
                type="date"
                name="flightDate"
                value={formData.flightDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Flight Time</label>
              <input
                type="time"
                name="flightTime"
                value={formData.flightTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flight_Management;
