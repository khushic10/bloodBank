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
		if (decoded.role === "user" || decoded.role === "admin") {
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
			const { bloodType } = req.query;
			if (!bloodType) {
				return res.status(404).json({ message: "blood Type is required" });
			}
			const count = await Blood.countDocuments({
				status: "available",
				bloodType: bloodType,
			});
			if (count === 0) {
				return res.status(404).json({ message: "Blood is not available" });
			}
			res.status(200).json({ count });
		} else {
			return res.status(500).json({ error: "Internal server error" });
		}
	} catch (error) {
		console.error("Error:", error.message);
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
}
