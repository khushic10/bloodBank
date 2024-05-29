"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import AdminNavbar from "../../../components/adminNavbar";

export default function AddRequest() {
	const initialFormData = {
		bloodType: "",
		donatedBy: "",
		donatorContact: "",
		donatedOn: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [token, setToken] = useState(null);
	const router = useRouter();
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("BloodAdminToken");
			const storedRole = localStorage.getItem("BloodRole");
			if (storedToken) {
				console.log(storedRole);
				setToken(storedToken);
			} else {
				router.push("/admin/login");
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
		const validationErrors = validateForm(formData);
		console.log(errors);
		if (Object.keys(validationErrors).length === 0) {
			try {
				if (token) {
					const response = await fetch("/api/blood", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(formData),
					});

					if (!response.ok) {
						const error = await response.json();
						setError(error.error);
					}
					const data = await response.json();
					toast.success(data.message);
					setFormData(initialFormData);
				} else {
					router.push("/admin/login");
				}
			} catch (error) {
				console.error("Error adding request:", error.message);
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
			<AdminNavbar />
			<div className="flex justify-center items-center mt-4">
				<div className="flex flex-col justify-center items-center w-1/2 mb-4">
					<div className="container h-96 mx-auto text-center">
						<div className="flex flex-col justify-center items-center p-8 mx-12 bg-gray-50 rounded-lg shadow-lg border">
							<h1 className="text-2xl font-bold mb-4 text-red-800">
								Add New Blood
							</h1>
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && <div className="text-red-700 mb-4">{error}</div>}
								<div>
									<label
										htmlFor="bloodType"
										className="block text-sm font-medium text-gray-700"
									>
										Blood Type:
									</label>
									<select
										id="bloodType"
										name="bloodType"
										value={formData.bloodType}
										onChange={handleChange}
										className="mt-1 block w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
										<div className="text-red-600 text-sm mt-1">
											{errors.bloodType}
										</div>
									)}
								</div>
								<div>
									<label
										htmlFor="donatedBy"
										className="block text-sm font-medium text-gray-700"
									>
										Donator Name:
									</label>
									<input
										type="text"
										id="donatedBy"
										name="donatedBy"
										value={formData.donatedBy}
										onChange={handleChange}
										className="mt-1 block w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									/>
									{errors.donatedBy && (
										<div className="text-red-600 text-sm mt-1">
											{errors.donatedBy}
										</div>
									)}
								</div>
								<div>
									<label
										htmlFor="donatorContact"
										className="block text-sm font-medium text-gray-700"
									>
										Donator Contact:
									</label>
									<input
										type="text"
										id="donatorContact"
										name="donatorContact"
										value={formData.donatorContact}
										onChange={handleChange}
										className="mt-1 block w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									/>
									{errors.donatorContact && (
										<div className="text-red-600 text-sm mt-1">
											{errors.donatorContact}
										</div>
									)}
								</div>
								<div>
									<label
										htmlFor="donatedOn"
										className="block text-sm font-medium text-gray-700"
									>
										Donated On:
									</label>
									<input
										type="date"
										id="donatedOn"
										name="donatedOn"
										value={formData.donatedOn}
										onChange={handleChange}
										className="mt-1 block w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									/>
									{errors.donatedOn && (
										<div className="text-red-600 text-sm mt-1">
											{errors.donatedOn}
										</div>
									)}
								</div>
								<button
									type="submit"
									className="bg-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-red-500"
								>
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
