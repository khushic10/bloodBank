import { connectToDatabase } from "../../src/util/db";
import { User } from "../../src/util/model/User";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { email, password } = req.body;

			// Find the user by email
			const user = await User.findOne({ email });

			if (!user || !(await bcryptjs.compare(password, user.password))) {
				return res.status(401).json({ error: "Invalid email or password" });
			}

			// User authenticated successfully
			const token = sign(
				{ userId: user._id, email: user.email, role: "user" },
				process.env.JWT_SECRET,
				{
					expiresIn: "100y", // Adjust token expiration as needed
				}
			);
			return res.status(200).json({
				token: token,
				userId: user._id,
				userEmail: user.email,
				role: "user",
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
