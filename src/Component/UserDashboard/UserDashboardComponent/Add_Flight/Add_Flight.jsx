import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Authentication/AuthProvider/AuthProvider";
import axios from "axios";

const Add_Flight = () => {
    const { user } = useContext(AuthContext);  // Access user from AuthContext

    const [formData, setFormData] = useState({
        flightNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        flightDate: "",
        flightTime: "",
        aircraftType: "",
        duration: "",
        seatAvailability: "",
        price: "",
    });

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});  // For form validation errors

    // Fetch user data when user.email is available
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    const { data } = await axios.get("https://excel-server-site.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    setUserData(matchedUser || {});
                } catch (error) {
                    setError("Failed to fetch user data.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Basic form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.flightNumber) newErrors.flightNumber = "Flight number is required.";
        if (!formData.departureAirport) newErrors.departureAirport = "Departure airport is required.";
        if (!formData.arrivalAirport) newErrors.arrivalAirport = "Arrival airport is required.";
        if (!formData.flightDate) newErrors.flightDate = "Flight date is required.";
        if (!formData.flightTime) newErrors.flightTime = "Flight time is required.";
        if (!formData.aircraftType) newErrors.aircraftType = "Aircraft type is required.";
        if (!formData.duration) newErrors.duration = "Duration is required.";
        if (!formData.seatAvailability) newErrors.seatAvailability = "Seat availability is required.";
        if (!formData.price) newErrors.price = "Price is required.";

        setFormErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }

        const flightData = {
            ...formData,
            userEmail: user?.email,
            userImage: userData?.image || "",
        };

        try {
            const response = await axios.post("https://excel-server-site.vercel.app/flight", flightData, {
                withCredentials: true,
            });
            console.log("Flight added:", response.data);
            alert("Flight added successfully!");
        } catch (error) {
            console.error("Error submitting flight data:", error);
            alert("There was an error submitting the flight data.");
        }

        // Clear form after submission
        setFormData({
            flightNumber: "",
            departureAirport: "",
            arrivalAirport: "",
            flightDate: "",
            flightTime: "",
            aircraftType: "",
            duration: "",
            seatAvailability: "",
            price: "",
        });
    };

    // Loading state rendering
    if (loading) {
        return <div>Loading user data...</div>;
    }

    // If there's an error in fetching user data
    if (error) {
        return <div>{error}</div>;
    }

    // If user is not logged in
    if (!user) {
        return <div>Please log in to add a flight.</div>;
    }

    return (
        <section className="p-8 bg-gray-100 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Add Flight</h1>
            <form onSubmit={handleSubmit} className="container mx-auto space-y-8 max-w-4xl">
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-lg">
                    {/* Flight Number */}
                    <div>
                        <label htmlFor="flightNumber" className="font-medium text-gray-700">
                            Flight Number
                        </label>
                        <input
                            type="text"
                            name="flightNumber"
                            value={formData.flightNumber}
                            onChange={handleChange}
                            placeholder="Enter flight number"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.flightNumber && <p className="text-red-500 text-sm">{formErrors.flightNumber}</p>}
                    </div>

                    {/* Departure Airport */}
                    <div>
                        <label htmlFor="departureAirport" className="font-medium text-gray-700">
                            Departure Airport
                        </label>
                        <input
                            type="text"
                            name="departureAirport"
                            value={formData.departureAirport}
                            onChange={handleChange}
                            placeholder="Enter departure airport"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.departureAirport && <p className="text-red-500 text-sm">{formErrors.departureAirport}</p>}
                    </div>

                    {/* Arrival Airport */}
                    <div>
                        <label htmlFor="arrivalAirport" className="font-medium text-gray-700">
                            Arrival Airport
                        </label>
                        <input
                            type="text"
                            name="arrivalAirport"
                            value={formData.arrivalAirport}
                            onChange={handleChange}
                            placeholder="Enter arrival airport"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.arrivalAirport && <p className="text-red-500 text-sm">{formErrors.arrivalAirport}</p>}
                    </div>

                    {/* Flight Date */}
                    <div>
                        <label htmlFor="flightDate" className="font-medium text-gray-700">
                            Flight Date
                        </label>
                        <input
                            type="date"
                            name="flightDate"
                            value={formData.flightDate}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.flightDate && <p className="text-red-500 text-sm">{formErrors.flightDate}</p>}
                    </div>

                    {/* Flight Time */}
                    <div>
                        <label htmlFor="flightTime" className="font-medium text-gray-700">
                            Flight Time
                        </label>
                        <input
                            type="time"
                            name="flightTime"
                            value={formData.flightTime}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.flightTime && <p className="text-red-500 text-sm">{formErrors.flightTime}</p>}
                    </div>

                    {/* Aircraft Type */}
                    <div>
                        <label htmlFor="aircraftType" className="font-medium text-gray-700">
                            Aircraft Type
                        </label>
                        <input
                            type="text"
                            name="aircraftType"
                            value={formData.aircraftType}
                            onChange={handleChange}
                            placeholder="Enter aircraft type"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.aircraftType && <p className="text-red-500 text-sm">{formErrors.aircraftType}</p>}
                    </div>

                    {/* Duration */}
                    <div>
                        <label htmlFor="duration" className="font-medium text-gray-700">
                            Duration (in hours)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Enter flight duration"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.duration && <p className="text-red-500 text-sm">{formErrors.duration}</p>}
                    </div>

                    {/* Seat Availability */}
                    <div>
                        <label htmlFor="seatAvailability" className="font-medium text-gray-700">
                            Seat Availability
                        </label>
                        <input
                            type="number"
                            name="seatAvailability"
                            value={formData.seatAvailability}
                            onChange={handleChange}
                            placeholder="Enter available seats"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.seatAvailability && <p className="text-red-500 text-sm">{formErrors.seatAvailability}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="font-medium text-gray-700">
                            Price (in USD)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                        {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Add Flight
                </button>
            </form>
        </section>
    );
};

export default Add_Flight;
