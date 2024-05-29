"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
	const [token, setToken] = useState(null);
	const [search, setSearch] = useState(null);
	const [searcherror, setSearcherror] = useState("");
	const [type, setType] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem("BloodToken");
			if (storedUserId) {
				setToken(storedUserId);
			} else {
				router.push("/login");
			}
		}
	}, []);
	const handleSearch = async (e) => {
		e.preventDefault();
		setSearch("");
		setSearcherror("");
		try {
			if (token) {
				console.log(type);
				const response = await fetch(`api/search?bloodType=${type}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					const error = await response.json();
					setSearcherror(error.message);
				} else {
					const data = await response.json();
					setSearch(data.count);
				}
			} else {
				router.push("/login");
			}
		} catch (error) {
			console.error("Error adding request:", error.message);
			// Handle errors or provide feedback to the user
		}
	};
	return (
		<div className="bg-gray-50 h-screen overflow-auto flex flex-col">
			<Navbar />
			<div className="mx-12">
				<div className="m-12 row-span-1 flex flex-col justify-center items-center">
					<div className="flex flex-col items-center border shadow-lg rounded-xl p-8">
						<h1 className="text-2xl font-bold mb-4 text-red-800">
							Check Blood Availability
						</h1>
						<form
							onSubmit={handleSearch}
							className="flex flex-col justify-center items-center"
						>
							<label
								htmlFor="type"
								className="block text-lg font-medium mb-2 text-red-800"
							>
								Blood Type:
							</label>
							<div className="flex">
								<select
									id="type"
									name="type"
									value={type}
									onChange={(e) => setType(e.target.value)}
									className="rounded-xl w-32 p-2 mb-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
								>
									<option value="">--Select--</option>
									<option value="A%2B">A+</option>
									<option value="O%2B">O+</option>
									<option value="B%2B">B+</option>
									<option value="AB%2B">AB+</option>
									<option value="A%2D">A-</option>
									<option value="O%2D">O-</option>
									<option value="B%2D">B-</option>
									<option value="AB%2D">AB-</option>
								</select>
								<button
									type="submit"
									className="bg-green-700 mx-2 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 h-10"
								>
									Check
								</button>
							</div>
							{search ? (
								<div className="text-green-600 font-semibold mt-4">
									{search} blood pouch is available
								</div>
							) : (
								<div className="text-red-600 font-semibold mt-4">
									{searcherror}
								</div>
							)}
						</form>
					</div>
				</div>

				<div className="grid grid-cols-2">
					<div className="">
						<img
							src="/img/bloodDonation.png"
							alt="Blood Donation"
							className="rounded-3xl m-4"
						/>
					</div>
					<div className="mt-12 mb-4 mr-12 flex flex-col justify-center items-center">
						<h2 className=" text-green-700 text-2xl font-semibold m-2">
							Learn About Donation
						</h2>
						<img
							src="/img/Donation.png"
							alt="Donation Information"
							className="rounded-3xl h-full w-auto"
						/>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
