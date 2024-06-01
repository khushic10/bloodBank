import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [login, setLogin] = useState(false);
	const [token, setToken] = useState(null); // Initialize token state
	const router = useRouter();

	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen);
	};

	useEffect(() => {
		// Check if token is stored in local storage on initial render
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("BloodToken");
			if (storedToken) {
				setToken(storedToken);
				setLogin(true); // Set login state to true
			}
		}
	}, []);

	const handleLogout = () => {
		// Handle logout by removing token from local storage
		localStorage.removeItem("BloodToken");
		localStorage.removeItem("BloodRole");
		setToken(null); // Clear token state
		setLogin(false);
		router.push("/login");
	};

	return (
		<div>
			<div className="flex mx-12 my-4 items-center justify-between">
				<div className="flex items-center">
					<img
						src="/img/GovernmentLogo.png"
						alt="Donation Information"
						className="rounded-3xl h-20 w-auto"
					/>
					<div className="ml-8">
						<div className="text-sm leading-none">Government Of Nepal</div>
						<div className="font-semibold text-blue-800">
							Ministry Of Health and Population
						</div>
						<div className="font-semibold leading-none">
							Department of Health Services
						</div>
						<div className="text-lg text-red-700 font-semibold">
							Online Blood Bank System
						</div>
					</div>
				</div>
				<div>
					<img
						src="/img/NepalFlag.gif"
						alt="Donation Information"
						className="rounded-3xl h-20 w-auto"
					/>
				</div>
			</div>
			<nav className="bg-red-800 w-full py-2 px-4 flex justify-between items-center">
				<div className="text-center">
					<div className="text-white text-lg font-bold font-sans">
						Hamro Blood
					</div>
					<div className="text-white text-xl font-bold font-serif">Connect</div>
				</div>
				<div className="flex-grow flex justify-center">
					<ul className="flex space-x-8 font-serif">
						<Link href="/">
							<li className="text-white text-lg mx-4 hover:text-gray-300">
								Home
							</li>
						</Link>
						<Link href="/request">
							<li className="text-white text-lg mx-4 hover:text-gray-300">
								Request Blood
							</li>
						</Link>
						<Link href="/yourRequest">
							<li className="text-white text-lg mx-4 hover:text-gray-300">
								Your Requests
							</li>
						</Link>
					</ul>
				</div>
				<div className="relative">
					{login && (
						<button
							onClick={handleDropdownToggle}
							className="focus:outline-none"
						>
							<img
								src="/img/profile.png"
								alt="User Icon"
								className="w-8 h-8 rounded-full"
							/>
						</button>
					)}
					{dropdownOpen && login && (
						<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
							<a
								href="#"
								onClick={handleLogout}
								className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
							>
								Logout
							</a>
						</div>
					)}
				</div>
			</nav>
		</div>
	);
}
