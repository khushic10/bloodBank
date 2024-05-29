"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
	const [formData, setFormData] = useState({
		fullName: "",
		phoneNumber: "",
		location: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");
	const router = useRouter();
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
				const res = await fetch("/api/userRegister", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (!res.ok) {
					const error = await res.json();
					setError(error.error);
				}

				const data = await res.json();
				toast.success(data.message);
				router.push("/login");
			} catch (error) {
				setError(error.message);
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
		if (fieldName === "email") {
			fieldErrors =
				!value.trim() || !/\S+@\S+\.\S+/.test(value)
					? "Email is invalid"
					: null;
		} else {
			fieldErrors = !value.trim() ? `${fieldName} is required` : null;
		}
		return fieldErrors;
	};

	return (
		<>
			<ToastContainer position="top-center" />
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
					<h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
						User Register
					</h1>
					<form onSubmit={handleSubmit}>
						{error && <div className="text-red-700 mb-4">{error}</div>}

						<div className="mb-4 flex space-x-4">
							<div className="w-1/2">
								<label
									htmlFor="fullName"
									className="block text-sm font-semibold text-gray-700"
								>
									Full Name
								</label>
								<input
									className="w-full h-10 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									type="text"
									id="fullName"
									value={formData.fullName}
									name="fullName"
									onChange={handleChange}
								/>
								{errors.fullName && (
									<div className="text-red-600 text-sm mt-1">
										{errors.fullName}
									</div>
								)}
							</div>
							<div className="w-1/2">
								<label
									htmlFor="phoneNumber"
									className="block text-sm font-semibold text-gray-700"
								>
									Phone Number
								</label>
								<input
									className="w-full h-10 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									type="text"
									id="phoneNumber"
									value={formData.phoneNumber}
									name="phoneNumber"
									onChange={handleChange}
								/>
								{errors.phoneNumber && (
									<div className="text-red-600 text-sm mt-1">
										{errors.phoneNumber}
									</div>
								)}
							</div>
						</div>

						<div className="mb-4 flex space-x-4">
							<div className="w-1/2">
								<label
									htmlFor="location"
									className="block text-sm font-semibold text-gray-700"
								>
									Location
								</label>
								<input
									className="w-full h-10 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									type="text"
									id="location"
									value={formData.location}
									name="location"
									onChange={handleChange}
								/>
								{errors.location && (
									<div className="text-red-600 text-sm mt-1">
										{errors.location}
									</div>
								)}
							</div>
							<div className="w-1/2">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-gray-700"
								>
									Email
								</label>
								<input
									className="w-full h-10 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
									type="email"
									id="email"
									value={formData.email}
									name="email"
									onChange={handleChange}
								/>
								{errors.email && (
									<div className="text-red-600 text-sm mt-1">
										{errors.email}
									</div>
								)}
							</div>
						</div>

						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-sm font-semibold text-gray-700"
							>
								Password
							</label>
							<input
								className="w-full h-10 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
							/>
							{errors.password && (
								<div className="text-red-600 text-sm mt-1">
									{errors.password}
								</div>
							)}
						</div>

						<div className="flex justify-center mb-6">
							<button
								type="submit"
								className="bg-red-700 hover:bg-red-500 text-white font-semibold py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
							>
								Register
							</button>
						</div>
						<div className="text-center">
							Already Have an Account?
							<Link href="/login">
								<span className="text-red-700 font-semibold cursor-pointer">
									Login
								</span>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
