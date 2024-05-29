import React from "react";
import AdminNavbar from "../../components/adminNavbar";

export default function page() {
	return (
		<div className="flex flex-col justify-center">
			<AdminNavbar />
			<div className="flex flex-col justify-center items-center border bg-gray-300 p-4 m-8 rounded-xl">
				<div className="font-semibold text-red-800 text-2xl bg-white py-24 px-52 rounded-xl">
					Welcome To The Admin Panel
				</div>
			</div>
		</div>
	);
}
