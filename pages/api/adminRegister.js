import { connectToDatabase } from "../../src/util/db";
import { Admin } from "../../src/util/model/Admin";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					error: "Email and password are required",
				});
			}

			// Check if username or email already exists
			const existingAdmin = await Admin.findOne({
				$or: [{ email }],
			});
			if (existingAdmin) {
				return res.status(400).json({ error: "Email already exists" });
			}

			// Hash the password
			const hashedPassword = await bcryptjs.hash(password, 10);

			// Create a new user
			const newAdmin = new Admin({
				email,
				password: hashedPassword,
			});

			await newAdmin.save();

			return res.status(201).json({ message: "Admin registered successfully" });
		} catch (error) {
			console.error("Error registering Admin:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
