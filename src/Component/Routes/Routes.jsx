import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../Error/ErrorPage";
import HomePage from "../Home/Home";
import Login from "../Authentication/Login/Login";
import SignUp from "../Authentication/SignUp/SignUp";
import UserStatistic from "../UserDashboard/UserDashboardComponent/UserStatistic/UserStatistic";
import UserLayOut from "../UserDashboard/UserLayout/UserLayout";
import PrivateRoute from "../Authentication/PrivateRoute/PrivateRoute"
import Add_Flight from "../UserDashboard/UserDashboardComponent/Add_Flight/Add_Flight";
import Flight_Management from "../UserDashboard/UserDashboardComponent/Flight_Management/Flight_Management";
import Booking_Flight from "../UserDashboard/UserDashboardComponent/Booking_Flight/Booking_Flight";
import AllFlight from "../Pages/AllFlight/AllFlight";
import FlightDetail from "../Pages/FlightDetail/FlightDetail";
import Booking_Notification from "../Pages/Booking_Notification/Booking_Notification";
import Booking_Refund from "../UserDashboard/UserDashboardComponent/Booking_Refund/Booking_Refund";
import Refund_Notification from "../Pages/Refund_Notification/Refund_Notification";
import MainProfile from "../Pages/Profile/MainProfile";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children:[
            {
                path: "/",
                element: <HomePage></HomePage>,
            },
            {
                path: "/flight",
                element: <PrivateRoute><AllFlight></AllFlight></PrivateRoute>
            },
            {
                path: "/flight-details/:id",
                element: <PrivateRoute><FlightDetail></FlightDetail></PrivateRoute>
            },
            {
                path: "/login",
                element:<Login></Login>
            },
            {
                path:"/signUp",
                element:<SignUp></SignUp>
            },
            {
                path:"/bookingNotification",
                element:<PrivateRoute><Booking_Notification></Booking_Notification></PrivateRoute>
            },
            {
                path: "/refundNotification",
                element:<PrivateRoute><Refund_Notification></Refund_Notification></PrivateRoute>
            },
            {
                path:'/profile',
                element: <PrivateRoute><MainProfile></MainProfile></PrivateRoute>
            }
        ]

    },

     // Admin dashboard 
     {
        path:'/dashboard',
        element:<PrivateRoute><UserLayOut></UserLayOut></PrivateRoute>,
        errorElement:<ErrorPage></ErrorPage>,
        children:[
            {
                path: "statistic",
                element: <PrivateRoute><UserStatistic></UserStatistic></PrivateRoute>
            },
            {
                path: "Add-Flight",
                element: <PrivateRoute><Add_Flight></Add_Flight></PrivateRoute>
            },
            {
                path: 'Flight-Management',
                element:<PrivateRoute><Flight_Management></Flight_Management></PrivateRoute>
            },
            {
                path:'Booking-Flight',
                element: <PrivateRoute><Booking_Flight></Booking_Flight></PrivateRoute>
            },
            {
                path:'Booking-Refund',
                element: <PrivateRoute><Booking_Refund></Booking_Refund></PrivateRoute>
            },
            
            
           
        ]
    }

])