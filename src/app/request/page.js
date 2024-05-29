"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ToastContainer, toast } from "react-toastify";

export default function AddRequest() {
	const initialData = {
		bloodType: "",
		contactNumber: "",
		fullName: "",
		requestedOn: "",
		quantity: "",
	};
	const [formData, setFormData] = useState(initialData);
	const [token, setToken] = useState(null);
	const router = useRouter();
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("BloodToken");
			if (storedToken) {
				setToken(storedToken);
			} else {
				router.push("/login");
			}
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		const validationErrors = validateField(name, value);
		setErrors({
			...errors,
			[name]: validationErrors,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const allData = { ...formData };
		delete allData.requestedOn;
		const validationErrors = validateForm(allData);

		if (Object.keys(validationErrors).length === 0) {
			try {
				const currentDate = new Date();
				const formattedDate = currentDate.toDateString();
				setFormData({
					...formData,
					requestedOn: formattedDate,
				});
				if (token) {
					const response = await fetch("/api/userRequest", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							...formData,
							requestedOn: formattedDate,
						}),
					});

					if (!response.ok) {
						const error = await response.json();
						setError(error.error);
					} else {
						const data = await response.json();
						toast.success(data.message);
						setFormData(initialData);
					}
				} else {
					router.push("/login");
				}
			} catch (error) {
				console.error("Error adding request:", error);
			}
		} else {
			setErrors(validationErrors);
		}
	};

	const validateForm = (data) => {
		let errors = {};
		for (let field in data) {
			const fieldErrors = validateField(field, data[field]);
			if (fieldErrors) {
				errors[field] = fieldErrors;
			}
		}
		return errors;
	};

	const validateField = (fieldName, value) => {
		let fieldErrors = null;
		fieldErrors = !value.trim() ? `${fieldName} is required` : null;
		return fieldErrors;
	};

	return (
		<>
			<ToastContainer position="top-center" />
			<div className="bg-gray-50 h-screen overflow-auto flex flex-col">
				<Navbar />
				<div className="mx-24 flex flex-col justify-center items-center ">
					<div className="m-4 flex justify-between">
						<img
							src="/img/saveLife.jpg"
							alt="Blood Drop"
							className="rounded-3xl w-auto h-32 m-2"
						/>
						<img
							src="/img/saveLife1.jpg"
							alt="Blood Drop"
							className="rounded-3xl w-auto h-32 m-2"
						/>
					</div>
					<div className="flex flex-col justify-center items-center w-1/2 mb-4">
						<div className="container h-96 mx-auto text-center">
							<div className="flex flex-col justify-center items-center p-8 mx-12 bg-gray-50 rounded-lg shadow-lg border">
								<h1 className="text-2xl font-bold mb-4 text-green-700">
									Blood Request
								</h1>
								<form onSubmit={handleSubmit} className="space-y-4">
									{error && <div className="text-red-700 mb-4">{error}</div>}
									<div className="flex flex-col items-start space-y-2">
										<label htmlFor="bloodType" className="text-sm font-medium">
											Blood Type:
										</label>
										<select
											id="bloodType"
											name="bloodType"
											value={formData.bloodType}
											onChange={handleChange}
											className="rounded-xl w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
										>
											<option>--Select--</option>
											<option value="A+">A+</option>
											<option value="O+">O+</option>
											<option value="B+">B+</option>
											<option value="AB+">AB+</option>
											<option value="A-">A-</option>
											<option value="O-">O-</option>
											<option value="B-">B-</option>
											<option value="AB-">AB-</option>
										</select>
										{errors.bloodType && (
											<div className="text-red-600 text-sm">
												{errors.bloodType}
											</div>
										)}
									</div>
									<div className="flex space-x-4">
										<div className="flex flex-col items-start space-y-2 flex-1">
											<label
												htmlFor="contactNumber"
												className="text-sm font-medium"
											>
												Contact Number:
											</label>
											<input
												type="text"
												id="contactNumber"
												name="contactNumber"
												value={formData.contactNumber}
												onChange={handleChange}
												className="rounded-xl w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
											/>
											{errors.contactNumber && (
												<div className="text-red-600 text-sm">
													{errors.contactNumber}
												</div>
											)}
										</div>
										<div className="flex flex-col items-start space-y-2 flex-1">
											<label htmlFor="fullName" className="text-sm font-medium">
												Full Name:
											</label>
											<input
												type="text"
												id="fullName"
												name="fullName"
												value={formData.fullName}
												onChange={handleChange}
												className="rounded-xl w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
											/>
											{errors.fullName && (
												<div className="text-red-600 text-sm">
													{errors.fullName}
												</div>
											)}
										</div>
									</div>
									<div className="flex flex-col items-start space-y-2">
										<label htmlFor="quantity" className="text-sm font-medium">
											Quantity:
										</label>
										<input
											type="number"
											id="quantity"
											name="quantity"
											value={formData.quantity}
											onChange={handleChange}
											className="rounded-xl w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
										{errors.quantity && (
											<div className="text-red-600 text-sm">
												{errors.quantity}
											</div>
										)}
									</div>
									<button
										type="submit"
										className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										Submit
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
