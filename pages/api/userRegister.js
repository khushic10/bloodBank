import { connectToDatabase } from "../../src/util/db";
import { User } from "../../src/util/model/User";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { fullName, phoneNumber, location, email, password } = req.body;

			if (!fullName || !email || !password || !phoneNumber || !location) {
				return res.status(400).json({
					error: "All fields are required",
				});
			}

			// Check if username or email already exists
			const existingUser = await User.findOne({
				$or: [{ phoneNumber }, { email }],
			});
			if (existingUser) {
				return res
					.status(400)
					.json({ error: "phone Number or Email already exists" });
			}

			// Hash the password
			const hashedPassword = await bcryptjs.hash(password, 10);

			// Create a new user
			const newUser = new User({
				fullName,
				phoneNumber,
				location,
				email,
				password: hashedPassword,
			});

			await newUser.save();

			return res.status(201).json({ message: "User registered successfully" });
		} catch (error) {
			console.error("Error registering user:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
