import { connectToDatabase } from "../../src/util/db";
import { Request } from "../../src/util/model/Request";
import jwt from "jsonwebtoken";

async function verifyToken(authorizationHeader, res) {
	if (!authorizationHeader) {
		return res.status(403).json({ error: "Authorization header is missing" });
	}
	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		return res.status(403).json({ error: "Token is null" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role === "user") {
			return decoded.userId;
		} else {
			return res.status(403).json({ error: "Unauthorized Access" });
		}
	} catch (error) {
		return res.status(403).json({ error: "Invalid Token" });
	}
}

export default async function handler(req, res) {
	try {
		await connectToDatabase();
		const userId = await verifyToken(req.headers.authorization, res);
		const status = "pending";

		if (req.method === "GET") {
			const request = await Request.find({ userId: userId });
			res.status(200).json(request);
		} else if (req.method === "POST") {
			const { bloodType, contactNumber, fullName, quantity, requestedOn } =
				req.body;

			if (
				!bloodType ||
				!contactNumber ||
				!fullName ||
				!quantity ||
				!requestedOn
			) {
				return res.status(400).json({ error: "All fields are required" });
			}

			const request = new Request({
				bloodType,
				contactNumber,
				fullName,
				quantity,
				requestedOn,
				userId,
				status,
			});
			await request.save();
			res.status(201).json({
				success: true,
				message: "Blood has been requested successfully",
			});
		}
	} catch (error) {
		console.error("Error:", error.message);
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
}
