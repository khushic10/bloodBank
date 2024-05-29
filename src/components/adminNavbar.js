"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AdminNavbar() {
	const [login, setLogin] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [token, setToken] = useState("");
	const router = useRouter(); // Add parentheses here

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("BloodAdminToken");
			if (storedToken) {
				setToken(storedToken);
				setLogin(true);
			}
		}
	}, []);
	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem("BloodAdminToken");
		localStorage.removeItem("BloodRole");
		setLogin(false);
		setToken("");
		router.push("/admin/login");
	};

	return (
		<div className="bg-gray-500 p-4 flex items-end justify-between">
			<div className="text-white text-lg font-bold">Admin Panel</div>
			<div className="relative">
				{login && (
					<button onClick={handleDropdownToggle} className="focus:outline-none">
						<img
							src="/img/profile.png"
							alt="User Icon"
							className="w-10 h-10 rounded-full"
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
		</div>
	);
}
