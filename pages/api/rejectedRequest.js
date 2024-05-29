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
		if (decoded.role === "admin") {
			return decoded.adminId;
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
		const adminId = await verifyToken(req.headers.authorization, res);
		if (req.method === "GET") {
			const request = await Request.find({ status: "rejected" });
			res.status(200).json(request);
		}
	} catch (error) {
		console.error("Error:", error.message);
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
}
