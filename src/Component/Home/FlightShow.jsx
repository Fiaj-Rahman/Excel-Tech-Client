import React, { useEffect, useState } from "react";
import moment from "moment";  // Import moment for time formatting
import { Link } from "react-router-dom";

const FlightShow = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Fetching data from the API
    const fetchFlights = async () => {
      try {
        const response = await fetch("https://excel-server-site.vercel.app/flight");
        const data = await response.json();

        // Get the current date and time
        const currentDate = new Date();

        // Filter flights to only show those whose flightDate is today or in the future
        const upcomingFlights = data.filter(flight => {
          const flightDate = new Date(flight.flightDate);
          return flightDate >= currentDate;
        });

        setFlights(upcomingFlights.slice(0, 5)); // Show 5 flights
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };

    fetchFlights();
  }, []);

  return (
    <div className="dark:bg-gray-100 dark:text-gray-800">
      <div className="container max-w-4xl px-10 py-6 mx-auto rounded-lg shadow-sm dark:bg-gray-50">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Available Flights
        </h1>

        {/* Flight Cards */}
        <div className="space-y-8">
          {flights.length === 0 ? (
            <p className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
              No upcoming flights available.
            </p>
          ) : (
            flights.map((flight) => (
              <div
                key={flight._id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
              >
                <div className="relative">
                  {/* Removed image and added gradient color for design */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500 opacity-50"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-gray-600">
                      {new Date(flight.flightDate).toLocaleDateString()}
                    </span>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="px-2 py-1 font-bold rounded dark:bg-violet-600 dark:text-gray-50"
                    >
                      Flight #{flight.flightNumber}
                    </a>
                  </div>

                  <div className="mt-3">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="text-2xl font-bold hover:underline dark:text-gray-200"
                    >
                      {flight.departureAirport} to {flight.arrivalAirport}
                    </a>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      <strong>Aircraft Type:</strong> {flight.aircraftType}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      <strong>Time:</strong> {moment(flight.flightTime, "HH:mm").format("hh:mm A")} | <strong>Duration:</strong> {flight.duration} hrs
                    </p>
                    <p className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">
                      Price: ${flight.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/flight-details/${flight._id}`}  // Assuming you're using React Router to navigate to the details page
                    className="text-sm text-violet-600 font-bold hover:underline mt-2"
                  >
                    Read More
                  </Link>
                    
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightShow;
