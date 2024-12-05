import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import {
    ChevronDownIcon,
    Bars2Icon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../Authentication/AuthProvider/AuthProvider";
import axios from "axios";
import { FaBloggerB, FaPlane } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { TbBrandBooking } from "react-icons/tb";
import { RiRefund2Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

// Profile menu component
const profileMenuItems = [
    { label: "Sign Out", icon: PowerIcon, action: "signout" },
    { label: "Booking Notification", icon: TbBrandBooking, action: "/bookingNotification" },
    { label: "Refund Notification", icon: RiRefund2Fill, action: "/refundNotification" },
    { label: "Profile", icon: CgProfile, action: "/profile" },
];

function ProfileMenu({ closeMenu, onSignOut }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                try {
                    const { data } = await axios.get("https://excel-server-site.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    if (matchedUser) {
                        setUserData(matchedUser);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [user]);

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-1 pr-2 pl-1 lg:ml-auto hover:bg-gray-200 transition duration-300"
                >
                    <Tooltip content={userData?.fullName || user.email} placement="bottom">
                        <Avatar
                            variant="circular"
                            size="sm"
                            alt="Profile Avatar"
                            className="border border-gray-900 p-0.5"
                            src={userData?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        />
                    </Tooltip>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon, action }, key) => {
                    const handleClick = action === "signout" ? onSignOut : () => closeMenu();
                    return (
                        <div key={label} onClick={handleClick}>
                            {action === "signout" ? (
                                <MenuItem className="flex items-center gap-2 rounded p-2 hover:bg-gray-100 transition duration-200 text-red-500">
                                    {React.createElement(icon, { className: "h-5 w-5" })}
                                    <Typography as="span" variant="small" className="font-normal">
                                        {label}
                                    </Typography>
                                </MenuItem>
                            ) : (
                                <Link to={action} onClick={closeMenu}>
                                    <MenuItem className="flex items-center gap-2 rounded p-2 hover:bg-gray-100 transition duration-200">
                                        {React.createElement(icon, { className: "h-5 w-5" })}
                                        <Typography as="span" variant="small" className="font-normal">
                                            {label}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

// Navigation Links
const NavList = ({ isAdmin }) => {
    const navListItems = [
        { label: "Home", icon: FaBloggerB, link: "/" },
        { label: "Flight", icon: FaPlane, link: "/flight" },
    ];

    // If the user is admin, include Dashboard link
    if (isAdmin) {
        navListItems.push({ label: "Dashboard", icon: MdDashboardCustomize, link: "/dashboard/statistic" });
    }

    return (
        <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-center">
            {navListItems.map(({ label, icon, link }) => (
                <Typography key={label} as={Link} to={link} variant="small" color="gray" className="font-medium text-blue-gray-500">
                    <MenuItem className="flex items-center gap-2 lg:rounded-full hover:bg-gray-100 transition duration-200">
                        {React.createElement(icon, { className: "h-[18px] w-[18px]" })}
                        <span className="text-gray-900">{label}</span>
                    </MenuItem>
                </Typography>
            ))}
        </ul>
    );
};

const NavBars = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { user, logOut } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);  // State to store the role (admin or user)
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');

    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) {
                setIsNavOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Fetch user data and determine the role
        const fetchUserData = async () => {
            if (user?.email) {
                try {
                    const { data } = await axios.get("https://excel-server-site.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    if (matchedUser) {
                        setIsAdmin(matchedUser.role === "admin");  // Set the role
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logOut();
            setIsLoading(false);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const localTheme = localStorage.getItem('theme');
        document.querySelector('html').setAttribute('data-theme', localTheme);
    }, [theme]);

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme('synthwave');
        } else {
            setTheme('light');
        }
    };

    return (
        <Navbar className="mx-auto max-w-screen-2xl p-2 lg:bg-white shadow-lg">
            <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
                <Typography as={Link} to="/" className="mr-4 ml-2 cursor-pointer py-1.5 font-semibold text-lg text-blue-600">
                Excel Tech
                </Typography>
                <div className="hidden lg:block m-auto">
                    <NavList isAdmin={isAdmin} />  {/* Pass the isAdmin state */}
                </div>
                <IconButton size="sm" color="blue-gray" variant="text" onClick={toggleIsNavOpen} className="ml-auto mr-2 lg:hidden">
                    <Bars2Icon className="h-6 w-6" />
                </IconButton>
                {/* Conditionally render Login or Profile button */}
                {!user ? (
                    <Button size="sm" variant="outlined" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-200">
                        <Link to="/login">Log In</Link>
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <ProfileMenu closeMenu={() => setIsNavOpen(false)} onSignOut={handleLogout} />
                    </div>
                )}
                {/* Attractive Theme Toggle */}
                <div className="flex items-center gap-2">
                    <label htmlFor="theme-toggle" className="cursor-pointer">
                        <input
                            type="checkbox"
                            id="theme-toggle"
                            checked={theme === 'synthwave'}
                            onChange={handleToggle}
                            className="hidden"
                        />
                        <div className="relative inline-flex items-center">
                            <span className="block w-10 h-5 bg-gray-400 rounded-full"></span>
                            <span className="absolute left-0 w-4 h-4 bg-white rounded-full transition-all transform" style={{ transform: theme === 'synthwave' ? 'translateX(20px)' : 'translateX(0)' }}></span>
                        </div>
                    </label>
                </div>
            </div>
            <MobileNav open={isNavOpen}>
                <div className="flex flex-col gap-4">
                    <NavList isAdmin={isAdmin} />  {/* Pass the isAdmin state */}
                </div>
            </MobileNav>
        </Navbar>
    );
};

export default NavBars;
