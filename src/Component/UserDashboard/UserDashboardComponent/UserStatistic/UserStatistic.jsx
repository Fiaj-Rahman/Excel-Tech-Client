import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Authentication/AuthProvider/AuthProvider";
import axios from "axios";
import { FaUsers, FaBuilding, FaCheckCircle, FaSignOutAlt, FaCalendarAlt, FaArrowUp, FaHandHoldingUsd } from "react-icons/fa"; 
import { Pie } from "react-chartjs-2"; 
import { Card, CardBody, CardFooter, Typography, Progress, Button } from "@material-tailwind/react"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registering chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TABLE_HEAD = ["Flight No","UserName", "Price", "Total Seat", "Total Cost", "Departure", "Arrival", "Flight Date", "Flight Time"];

const UserStatistic = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalFlights, setTotalFlights] = useState(0); // Renamed totalProperties to totalFlights
    const [totalBookings, setTotalBookings] = useState(0); // Added state for bookings
    const [newFlights, setNewFlights] = useState([]); // Renamed newProperties to newFlights
    const [newBookings, setNewBookings] = useState([]); // State to store the latest bookings
    const [totalEarn, setTotalEarn] = useState(0); // State to hold the total earnings
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    // Fetch user data
                    const { data: usersData } = await axios.get("https://excel-server-site.vercel.app/signup");
                    const matchedUser = usersData.find((u) => u.email === user.email);
                    setUserData(matchedUser || {});

                    // Fetch statistics
                    setTotalUsers(usersData.length); // Total number of users

                    // Fetch flight data
                    const { data: flightData } = await axios.get("https://excel-server-site.vercel.app/flight");
                    setTotalFlights(flightData.length); // Total number of flights

                    // Fetch booking data and filter out refunded bookings
                    const { data: bookingData } = await axios.get("https://excel-server-site.vercel.app/flight-booking");
                    const validBookings = bookingData.filter(booking => booking.refund !== "yes" && booking.status!=="refund");
                    setTotalBookings(validBookings.length); // Total number of valid bookings

                    // Calculate total earnings from non-refunded bookings
                    const earnedAmount = validBookings.reduce((total, booking) => total + booking.totalCost, 0);
                    setTotalEarn(earnedAmount); // Set total earned amount

                    // Sort the flight data by the flightDate (descending) and get the latest 5 flights
                    const sortedFlights = flightData.sort((a, b) => new Date(b.flightDate) - new Date(a.flightDate));
                    setNewFlights(sortedFlights.slice(0, 5)); // Get the last 5 flights

                    // Sort the booking data by createdAt (descending) and get the latest 5 bookings
                    const sortedBookings = validBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNewBookings(sortedBookings.slice(0, 5)); // Get the last 5 bookings

                } catch (error) {
                    setError("Failed to fetch data.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) return <div className="text-center py-8 text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-8 text-lg text-red-500">{error}</div>;

    // Pie chart data
    const pieChartData = {
        labels: ['Users', 'Flights', 'Booking'],
        datasets: [
            {
                data: [totalUsers, totalFlights, totalBookings],
                backgroundColor: ['#36A2EB', '#FF6384', '#F69409'], // Blue for Users, Red for Flights
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto rounded-lg p-6 space-y-6 pb-10">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
                    {/* User Avatar and Greeting */}
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full w-16 h-16 bg-blue-200 overflow-hidden">
                            <img src={userData?.image || "/path/to/default/avatar.png"} alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-gray-800">Hi, {userData?.fullName}</p>
                            <p className="text-gray-600 text-lg">Good Morning</p>
                            <p className="text-gray-500">Here's an overview of your properties</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
                    {/* Total Users */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-blue-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-blue-500">
                            <FaUsers className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalUsers}</p>
                            <p className="capitalize">Total Users</p>
                        </div>
                    </div>

                    {/* Total Flights */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-green-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-green-500">
                            <FaBuilding className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalFlights}</p>
                            <p className="capitalize">Total Flights</p>
                        </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-yellow-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-yellow-500">
                            <FaCheckCircle className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalBookings}</p>
                            <p className="capitalize">Total Bookings</p>
                        </div>
                    </div>

                    {/* Total Earn */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-red-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-red-500">
                            <FaHandHoldingUsd className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">${totalEarn}</p> {/* Display total earned value */}
                            <p className="capitalize">Total Earn</p>
                        </div>
                    </div>
                </div>

                {/* New Activities Section */}
                <div className="space-y-6">
                    {/* Latest Booking Properties Table */}
                    <div className="bg-gray-100 p-3 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold my-10 text-center">Latest Bookings</h2>
                        <Card className="h-full w-full overflow-scroll">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {newBookings.map((booking) => (
                                        <tr key={booking._id} className="even:bg-blue-gray-50/50">
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.flightNumber}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.user.name}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    ${booking.totalCost}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.seatCount}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.totalCost}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.departureAirport}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.arrivalAirport}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.flightDate}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {booking.flightTime}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Pie Chart for Users and Flights */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center my-10">Statistics</h2>
                        <div className="w-full h-64 ">
                            <Pie className="mx-auto" data={pieChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStatistic;
