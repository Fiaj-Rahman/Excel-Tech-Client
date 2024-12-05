import React, { useState } from "react";

const FlightSearch = () => {
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch flights based on the search criteria
  const searchFlights = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch("https://excel-server-site.vercel.app/flight");
      const data = await response.json();

      // Filter flights based on user inputs
      const filteredFlights = data.filter((flight) => {
        return (
          (departureAirport === "" || flight.departureAirport.toLowerCase().includes(departureAirport.toLowerCase())) &&
          (arrivalAirport === "" || flight.arrivalAirport.toLowerCase().includes(arrivalAirport.toLowerCase())) &&
          (flightDate === "" || new Date(flight.flightDate).toLocaleDateString() === new Date(flightDate).toLocaleDateString())
        );
      });

      setFlightResults(filteredFlights); // Update state with filtered flights
    } catch (err) {
      setError("Error fetching flight data.");
      console.error("Error fetching flight data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-100 dark:text-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Flight Search
        </h1>

        {/* Search Form */}
        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="departureAirport" className="block text-gray-600 dark:text-gray-400">
                Departure Airport
              </label>
              <input
                type="text"
                id="departureAirport"
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter Departure Airport"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="arrivalAirport" className="block text-gray-600 dark:text-gray-400">
                Arrival Airport
              </label>
              <input
                type="text"
                id="arrivalAirport"
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter Arrival Airport"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="flightDate" className="block text-gray-600 dark:text-gray-400">
                Flight Date
              </label>
              <input
                type="date"
                id="flightDate"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={searchFlights}
              className="px-6 py-2 bg-violet-600 text-black font-bold rounded-lg shadow-md hover:bg-violet-700"
            >
              Search Flights
            </button>
          </div>
        </div>

        {/* Display loading indicator */}
        {loading && <div className="text-center mt-6">Loading...</div>}

        {/* Display error message */}
        {error && <div className="text-center mt-6 text-red-600">{error}</div>}

        {/* Search Results */}
        {flightResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Search Results
            </h2>
            <div className="space-y-6">
              {flightResults.map((flight) => (
                <div
                  key={flight._id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      Flight #{flight.flightNumber}
                    </span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      Price: ${flight.price}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <strong>From:</strong> {flight.departureAirport} <br />
                    <strong>To:</strong> {flight.arrivalAirport} <br />
                    <strong>Flight Date:</strong> {new Date(flight.flightDate).toLocaleDateString()} <br />
                    <strong>Flight Time:</strong> {flight.flightTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If no results */}
        {flightResults.length === 0 && !loading && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            No flights found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
