import React from "react";

export default function Footer() {
	return (
		<footer className="bg-red-900 w-full p-4 text-white flex justify-between  items-center mt-4">
			<div className="flex flex-col items-center justify-center ml-12">
				<div className="mb-4">
					<h2 className="text-lg font-bold">Contact Information</h2>
				</div>
				<div className="flex flex-col">
					<p className="mb-2">
						<span className="font-semibold">Address:</span> 123 Blood Bank,
						SaveLife City, House 12345
					</p>
					<p className="mb-2">
						<span className="font-semibold">Phone:</span> +1 (234) 567-8900
					</p>
					<p className="mb-2">
						<span className="font-semibold">Email:</span> info@bloodbank.com
					</p>
				</div>
			</div>
			<div className="m-8">
				<p>&copy; 2024 Blood Bank. All rights reserved.</p>
			</div>
		</footer>
	);
}
