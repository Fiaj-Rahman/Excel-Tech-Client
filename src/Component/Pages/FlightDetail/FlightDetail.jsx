import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the flight ID from the URL
import { AuthContext } from '../../Authentication/AuthProvider/AuthProvider';

// Function to convert time to 12-hour AM/PM format
const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = minute.padStart(2, '0'); // Ensure minutes are always 2 digits
    return `${hours}:${minutes} ${ampm}`;
};

const FlightDetail = () => {
    const { id } = useParams(); // Extract the flight ID from the URL
    const {user} = useContext(AuthContext)
    const [signData, setsignData] = useState(null);
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seatCount, setSeatCount] = useState(1); // Default seat count
    const [transactionId, setTransactionId] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });


      // Fetch user data when user.email is available
      useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    const { data } = await axios.get("https://excel-server-site.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    setsignData(matchedUser || {});
                } catch (error) {
                    setError("Failed to fetch user data.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);



    useEffect(() => {
        // Fetch the flight details by ID
        fetch(`https://excel-server-site.vercel.app/flight-details/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setFlight(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching flight details');
                setLoading(false);
            });
    }, [id]);

    // Handle booking form submission
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        const totalCost = seatCount * flight.price; // Calculate total cost

        // Create booking data
        const bookingData = {
            flightId: id,
            flightNumber: flight.flightNumber,
            departureAirport: flight.departureAirport,
            arrivalAirport: flight.arrivalAirport,
            flightDate: flight.flightDate,
            flightTime: flight.flightTime,
            seatCount,
            totalCost,
            transactionId,
            user: userData,
            loginPerson: user?.email,
            loginUserImage: signData?.image,

        };

        try {
            const response = await axios.post('https://excel-server-site.vercel.app/flight-booking', bookingData);
            console.log('Booking successful:', response.data);
            alert('Booking successful!');
            setIsModalOpen(false); // Close the modal after successful booking
        } catch (error) {
            console.error('Error during booking:', error);
            alert('Booking successful!');
        }
    };

    if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

    return (
        <div className="dark:bg-gray-100 dark:text-gray-800">
            <div className="container max-w-screen-xl px-6 py-12 mx-auto rounded-lg shadow-lg dark:bg-gray-50">
                {flight ? (
                    <div className="space-y-8">
                        {/* Flight Header */}
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-violet-600 mb-4">{flight.flightNumber}</h2>
                            <h3 className="text-xl text-gray-700 dark:text-gray-300">
                                {flight.departureAirport} to {flight.arrivalAirport}
                            </h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                Flight Date: {new Date(flight.flightDate).toLocaleDateString()} at {convertTo12HourFormat(flight.flightTime)}
                            </p>
                            <div className="mt-4 text-2xl font-semibold text-violet-600">
                                Price: ${flight.price}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-700 to-violet-800 text-white hover:from-violet-700 hover:to-violet-900 shadow-lg transition-all duration-300 transform hover:scale-105"
                                onClick={() => setIsModalOpen(true)} // Open modal when clicking "Book Now"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        No flight details available
                    </div>
                )}

                {/* Modal for Booking */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Flight Booking</h3>
                            <form onSubmit={handleBookingSubmit}>
                                {/* User Info */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Seat Count */}
                                <div className="mb-4">
                                    <label htmlFor="seatCount" className="block">Number of Seats</label>
                                    <input
                                        type="number"
                                        id="seatCount"
                                        value={seatCount}
                                        onChange={(e) => setSeatCount(e.target.value)}
                                        min="1"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Payment Transaction ID */}
                                <div className="mb-4">
                                    <label htmlFor="transactionId" className="block">Bkash Transaction ID</label>
                                    <input
                                        type="text"
                                        id="transactionId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Total Cost */}
                                <div className="mb-4">
                                    <label htmlFor="totalCost" className="block">Total Cost</label>
                                    <input
                                        type="text"
                                        id="totalCost"
                                        value={`$${seatCount * flight.price}`}
                                        readOnly
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightDetail;
