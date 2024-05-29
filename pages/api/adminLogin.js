import { connectToDatabase } from "../../src/util/db";
import { Admin } from "../../src/util/model/Admin";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { email, password } = req.body;

			// Find the user by email
			const admin = await Admin.findOne({ email });

			// If user not found or password doesn't match, return error
			if (!admin || !(await bcryptjs.compare(password, admin.password))) {
				return res.status(401).json({ error: "Invalid email or password" });
			}

			// User authenticated successfully
			const token = sign(
				{ adminId: admin._id, email: admin.email, role: "admin" },
				process.env.JWT_SECRET,
				{
					expiresIn: "100y", // Adjust token expiration as needed
				}
			);
			return res.status(200).json({
				token: token,
				adminId: admin._id,
				adminEmail: admin.email,
				role: "admin",
				message: "Login successful",
			});
		} catch (error) {
			console.error("Error logging in:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
