import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
	return (
		<div className="grid grid-cols-5">
			<div className="col-span-1 bg-red-800 h-screen overflow-auto ">
				<div className="flex flex-col text-white items-center m-2 text-center">
					<Link href="/admin" className="p-4 mb-4">
						<div className="text-center">
							<div className="text-white text-lg font-bold font-sans">
								Hamro Blood
							</div>
							<div className="text-white text-xl font-bold font-serif">
								Connect
							</div>
						</div>
					</Link>
					<Link
						href="/admin/addBlood"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Add New Blood
					</Link>
					<Link
						href="/admin/bloodList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Available Blood
					</Link>
					<Link
						href="/admin/previousBloodList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Previous Blood
					</Link>
					<Link
						href="/admin/requestList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Pending Requests
					</Link>
					<Link
						href="/admin/acceptedList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Accepted Requests
					</Link>
					<Link
						href="/admin/rejectedList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						Rejected Requests
					</Link>
					<Link
						href="/admin/userList"
						className="py-4 w-full hover:bg-red-300 hover:text-red-800"
					>
						List of Users
					</Link>
				</div>
			</div>

			<div className="col-span-4">
				<div className="">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
