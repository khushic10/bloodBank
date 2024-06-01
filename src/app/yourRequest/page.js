"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Home() {
	const [requests, setRequests] = useState([]);
	const [token, setToken] = useState("");
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/userRequest", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setRequests(data);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};
		if (token) {
			fetchData();
		}
	}, [token]);

	return (
		<div className="bg-gray-50 h-screen overflow-auto flex flex-col">
			<Navbar />
			<div className="marquee-container bg-blue-800 text-white w-full flex items-center p-4 my-4">
				<p className="marquee-text">
					If your request status is accepted, please contact the nearest health
					center or government hospital to receive your blood.
				</p>
			</div>
			<div className="flex-1 flex justify-center items-center">
				<div className="mx-8 my-2">
					<img
						src="/img/bloodType.jpg"
						alt="Blood Drop"
						className="rounded-3xl h-96 w-auto"
					/>
				</div>
				<div className="flex flex-col justify-center items-center w-4/5">
					<div className="">
						<h1 className="text-2xl font-bold mb-4 text-red-800 text-center">
							Your Blood Requests
						</h1>
						<div className="container h-96 mx-auto overflow-auto">
							<table className="table-auto w-full rounded-lg overflow-hidden">
								<thead>
									<tr className="bg-green-600 text-white text-lg font-normal p-2">
										<td className="px-2 py-2 font-normal">S.N.</td>
										<th className="px-2 py-2 font-normal">Blood Type</th>
										<th className="px-2 py-2 font-normal">Full Name</th>
										<th className="px-2 py-2 font-normal">Contact</th>
										<th className="px-2 py-2 font-normal">Quantity</th>
										<th className="px-2 py-2 font-normal">Date</th>
										<th className="px-2 py-2 font-normal">Status</th>
									</tr>
								</thead>
								{requests &&
									requests.map((request, index) => (
										<tbody key={index}>
											<tr
												className={
													index % 2 === 0
														? "bg-gray-100 text-center p-4"
														: "bg-red-100 text-center p-4"
												}
												key={request._id}
											>
												<td className="px-2 py-2">{index + 1}.</td>
												<td className="px-2 py-2">{request.bloodType}</td>
												<td className="px-2 py-2">{request.fullName}</td>
												<td className="px-2 py-2">{request.contactNumber}</td>
												<td className="px-2 py-2">{request.quantity}</td>
												<td className="px-2 py-2">{request.requestedOn}</td>
												<td className="px-2 py-2">{request.status}</td>
											</tr>
										</tbody>
									))}
							</table>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<style jsx>{`
				.marquee-container {
					overflow: hidden;
					white-space: nowrap;
					position: relative;
				}
				.marquee-text {
					display: inline-block;
					animation: marquee 30s linear infinite;
					animation-delay: 1s; /* Delay start by 1 second */
				}
				@keyframes marquee {
					0% {
						transform: translateX(100%);
					}
					100% {
						transform: translateX(-100%);
					}
				}
			`}</style>
		</div>
	);
}
