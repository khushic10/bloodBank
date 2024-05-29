import { connectToDatabase } from "../../src/util/db";
import { Blood } from "../../src/util/model/Blood";
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
		if (decoded.role === "admin") {
			return decoded.role;
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
		await verifyToken(req.headers.authorization, res);

		if (req.method === "GET") {
			const blood = await Blood.find({ status: "available" });
			res.status(200).json(blood);
		} else if (req.method === "POST") {
			const { bloodType, donatedBy, donatorContact, donatedOn } = req.body;
			const status = "available";
			if (!bloodType || !donatedBy || !donatorContact || !donatedOn) {
				return res.status(400).json({ error: "All fields are required" });
			}

			const blood = new Blood({
				bloodType,
				donatedBy,
				donatorContact,
				donatedOn,
				status,
			});
			await blood.save();
			res.status(201).json({
				success: true,
				message: "New Blood added successfully",
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
