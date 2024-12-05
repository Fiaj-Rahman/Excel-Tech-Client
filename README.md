# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



,,,,,,,,,,,,,,,,,,,,,,,,,,,,,Excel Tech.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,


Live Link: https://exceltech-aa221.web.app/

Project Overview:
Excel Tech Project is a flight seat booking website where any user can book a flight seat. The website is built using a combination of modern technologies like Tailwind CSS, React.js, Firebase, Express.js, Node.js, JWT, and MongoDB. Additionally, it uses various UI component libraries such as DaisyUI, MaterialUI, Material Tailwind, and Mamba UI.

User Functionality:

Flight Seat Booking:
A user can select and book a seat for a flight.
Once the booking is successful, the user can view the seat information on the Booking Notification Page.

Booking Cancellation & Refund:
Users can cancel their booking and apply for a refund if needed.
The user can view the status of their refund in the Refund Notification Routes.

Profile Management:
Users can update their profile information and change their profile picture through the Profile Page.

Admin Functionality:

User Management:
The admin can view all user routes and their booking information, similar to the user flow.
The admin has access to an extra route called the Dashboard Route.

Dashboard Route:
Through the Dashboard, the admin can:
Create flights.
Manage users (view, update, deactivate users).
Manage flights (add, update, remove flights).
Manage flight bookings (view all bookings).
View and handle refund requests from users.
Approve or reject refund applications.

Refund Process:
The admin can view refund applications in the Refund Management section of the dashboard.
When the admin approves the refund, the user will receive an update on their Refund Notification Routes.

How to Run the Project:
Before running the code, you need to set up some configurations:

Firebase Secret Keys:
You must add the Firebase secret keys to your .env file for Firebase authentication and integration.

Imgbb Secret Key:
You also need to include the Imgbb secret key in the .env file for image hosting purposes.

Required npm Packages:

Before running the code, you need to install the following npm packages:

tailwindcss
materialtailwind
daisyui
react-router-dom
react-icons
axios
aos (Animation on scroll)
firebase
react-chartjs-2 (For charts and analytics)
moment (For date-time formatting)
react-toastify (For notifications)
swiper (For image carousels)
This system enables a fully functional flight booking and management platform for both users and admins, utilizing the mentioned technologies to provide seamless interactions, real-time updates, and secure access control.
