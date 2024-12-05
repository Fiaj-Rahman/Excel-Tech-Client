import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const AllFlight = () => {
  const [flights, setFlights] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(8); // Change this value to control the number of flights per page

  // Fetch data from API
  useEffect(() => {
    fetch("https://excel-server-site.vercel.app/flight")
      .then((response) => response.json())
      .then((data) => {
        // Filter out flights with flightDate before today
        const filteredFlights = data.filter((flight) => {
          const currentDate = moment().startOf("day"); // current date at 00:00
          const flightDate = moment(flight.flightDate);
          return flightDate.isSameOrAfter(currentDate);
        });
        setFlights(filteredFlights);
        setSearchResults(filteredFlights); // Initialize search results
      })
      .catch((error) => console.error("Error fetching flights:", error));
  }, []);

  // Handle search filter
  const handleSearch = () => {
    const filteredFlights = flights.filter((flight) => {
      const isOriginMatch = flight.departureAirport
        .toLowerCase()
        .includes(origin.toLowerCase());
      const isDestinationMatch = flight.arrivalAirport
        .toLowerCase()
        .includes(destination.toLowerCase());
      const isDateMatch = date
        ? moment(flight.flightDate).format("YYYY-MM-DD") === date
        : true;

      return isOriginMatch && isDestinationMatch && isDateMatch;
    });

    setSearchResults(filteredFlights);
    setCurrentPage(1); // Reset to first page after a search
  };

  // Get current flights for the page
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = searchResults.slice(indexOfFirstFlight, indexOfLastFlight);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(searchResults.length / flightsPerPage);

  return (
    <div className="dark:bg-gray-100 dark:text-gray-800">
      <div className="container max-w-screen-xl px-6 py-8 mx-auto rounded-lg shadow-lg dark:bg-gray-50">
        {/* Search Form */}
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-200"
              placeholder="Origin (e.g., Rajshahi)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-200"
              placeholder="Destination (e.g., Chittagong)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-2 bg-violet-600 font-bold bg-gray-700 text-white rounded-lg hover:bg-red-700"
            >
              Search
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center my-8">Flights</h2>

        {/* Display search results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentFlights.length > 0 ? (
            currentFlights.map((flight) => (
              <div
                key={flight._id}
                className="flex justify-between items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{flight.flightNumber}</span>
                  <span className="text-sm text-gray-600">
                    {flight.departureAirport} to {flight.arrivalAirport}
                  </span>
                  <span className="mt-2 text-gray-700 font-medium">
                    {moment(flight.flightDate).format("MMMM D, YYYY")} - {moment(flight.flightTime, "HH:mm").format("hh:mm A")}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-semibold text-violet-600">${flight.price}</span>
                  <Link
                    to={`/flight-details/${flight._id}`}  // Assuming you're using React Router to navigate to the details page
                    className="text-sm text-violet-600 font-bold hover:underline mt-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-10 col-span-2 md:col-span-3 lg:col-span-4">
              <p className="text-lg text-gray-600">No flights match your search criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav>
            <ul className="flex space-x-2">
              {/* Previous Page */}
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 ${currentPage === index + 1 ? "bg-violet-600 text-white" : ""}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {/* Next Page */}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AllFlight;
