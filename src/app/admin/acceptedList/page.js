"use client";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../components/adminNavbar";
import React, { useState, useEffect } from "react";

import {
	Card,
	CardContent,
	Typography,
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	CircularProgress,
} from "@mui/material";

export default function Request() {
	const [requests, setRequests] = useState([]);
	const [token, setToken] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem("BloodAdminToken");
			if (storedUserId) {
				setToken(storedUserId);
			} else {
				router.push("/admin/login");
			}
		}
	}, []);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(6);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		getData();
	}, [token]);

	const getData = async () => {
		setLoading(true);
		if (token) {
			try {
				const response = await fetch(`/api/acceptedRequest`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const apiData = await response.json();
					setRequests(apiData);
					setTotalPages(Math.ceil(apiData.length / itemsPerPage));
					setLoading(false);
				} else {
					const error = await response.json();
					setError(error.error);
					console.log(error.error);
					setLoading(false);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	};

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentData = requests.slice(indexOfFirstItem, indexOfLastItem);

	function handlePageClick(pageNumber) {
		setCurrentPage(pageNumber);
	}

	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}
	return (
		<>
			<AdminNavbar />
			<Box>
				<Card variant="outlined">
					<CardContent>
						<Typography variant="h6">Accepted Requests List</Typography>
						<Box
							sx={{
								overflow: {
									xs: "auto",
									sm: "unset",
								},
							}}
						>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography color="textSecondary">S.N.</Typography>
										</TableCell>
										<TableCell>
											<Typography color="textSecondary">Blood Type</Typography>
										</TableCell>
										<TableCell>
											<Typography color="textSecondary">Full Name</Typography>
										</TableCell>
										<TableCell>
											<Typography color="textSecondary">Contact</Typography>
										</TableCell>
										<TableCell>
											<Typography color="textSecondary">Quantity</Typography>
										</TableCell>
										<TableCell>
											<Typography color="textSecondary">Date</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{currentData.map((request, index) => (
										<TableRow key={index}>
											<TableCell>
												<Typography
													sx={{
														fontSize: "15px",
														fontWeight: "500",
													}}
												>
													{index + 1}.
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														fontSize: "15px",
														fontWeight: "500",
													}}
												>
													{request.bloodType}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography>{request.fullName}</Typography>
											</TableCell>
											<TableCell>
												<Typography>{request.contactNumber}</Typography>
											</TableCell>
											<TableCell>
												<Typography>{request.quantity}</Typography>
											</TableCell>
											<TableCell>
												<Typography>{request.requestedOn}</Typography>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{loading ? (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "200px",
									}}
								>
									<CircularProgress />
								</Box>
							) : null}
							{error ? (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "200px",
									}}
								>
									{error}
								</Box>
							) : null}
							<div className="flex justify-center mt-8">
								<div className="flex">
									<button
										className={`px-3 py-1 border border-gray-300 rounded-l ${
											currentPage === 1
												? "bg-gray-200 cursor-not-allowed"
												: "bg-white hover:bg-gray-100"
										}`}
										onClick={() => setCurrentPage(currentPage - 1)}
										disabled={currentPage === 1}
									>
										Previous
									</button>
									{pageNumbers.map((pageNumber) => (
										<button
											key={pageNumber}
											className={`px-3 py-1 border-t border-b border-gray-300 ${
												currentPage === pageNumber
													? "bg-red-700 text-white"
													: "bg-white hover:bg-gray-100"
											}`}
											onClick={() => handlePageClick(pageNumber)}
											disabled={currentPage === pageNumber}
										>
											{pageNumber}
										</button>
									))}
									<button
										className={`px-3 py-1 border border-gray-300 rounded-r ${
											indexOfLastItem >= requests.length
												? "bg-gray-200 cursor-not-allowed"
												: "bg-white hover:bg-gray-100"
										}`}
										onClick={() => setCurrentPage(currentPage + 1)}
										disabled={indexOfLastItem >= requests.length}
									>
										Next
									</button>
								</div>
							</div>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</>
	);
}
