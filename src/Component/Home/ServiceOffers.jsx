import React from "react";
import { FaPlaneDeparture, FaCalendarAlt, FaTicketAlt, FaCheckCircle, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const ServiceOffers = () => {
    const flightServices = [
        {
            title: 'Flight Search',
            description: 'Easily search for available flights by specifying origin, destination, and travel date.',
            icon: <FaPlaneDeparture className="text-4xl mb-4 text-blue-600" />,
        },
        {
            title: 'Booking Management',
            description: 'Manage your bookings, view, edit, or cancel them directly from your profile.',
            icon: <FaTicketAlt className="text-4xl mb-4 text-blue-600" />,
        },
        {
            title: 'Flight Scheduling',
            description: 'View detailed flight schedules including departure times, prices, and availability.',
            icon: <FaCalendarAlt className="text-4xl mb-4 text-blue-600" />,
        },
        {
            title: 'Flight Confirmation',
            description: 'Receive real-time flight booking confirmation and notifications.',
            icon: <FaCheckCircle className="text-4xl mb-4 text-blue-600" />,
        },
        {
            title: 'Track Your Flight',
            description: 'Get real-time updates on your flight status, including delays, cancellations, and gate information.',
            icon: <FaMapMarkerAlt className="text-4xl mb-4 text-blue-600" />,
        },
        {
            title: 'Customer Support',
            description: '24/7 customer support to help you with flight inquiries, bookings, and assistance.',
            icon: <FaUser className="text-4xl mb-4 text-blue-600" />,
        },
    ];

    return (
        <div className="py-20 bg-gray-100 flex flex-col md:flex-row">
            {/* Left Section: Header and SVG Animation */}
            <div className="flex-1 text-center md:text-left mb-12 md:mb-0 p-6">
                <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">Our Flight Booking Services</h2>
                <p className="text-lg text-gray-700 mb-8">
                    We offer a comprehensive range of services to ensure you have a smooth flight booking experience. 
                    Explore our offerings and let us assist you on your journey.
                </p>
                <img
                    src="./services.jpg"
                    style={{ width: '100%', height: '300px', border: 'none' }}
                    title="Flight Booking Animation"
                ></img>
            </div>

            {/* Right Section: Flight Services Offered */}
            <div className="flex-1 container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {flightServices.map((service, index) => (
                        <div key={index} className="service-card p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                            <div className="flex justify-center mb-4">
                                <div className="bg-blue-50 p-3 rounded-full shadow">
                                    {service.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-blue-600">{service.title}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceOffers;
