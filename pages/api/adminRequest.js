import { connectToDatabase } from "../../src/util/db";
import { Request } from "../../src/util/model/Request";
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
			const requests = await Request.find({ status: "pending" });
			res.status(200).json(requests);
		} else if (req.method === "PUT") {
			const { id } = req.query;
			const { status } = req.body;

			if (!status) {
				return res.status(400).json({ error: "Status is required" });
			}

			const updatedRequest = await Request.findByIdAndUpdate(id, { status });

			if (!updatedRequest) {
				return res.status(404).json({ error: "Request not found" });
			}

			try {
				await updatedRequest.save();

				if (status === "accepted") {
					const request = await Request.findById(id);
					const bloodType = request.bloodType;
					const quantity = request.quantity; // Assuming you have a quantity field in the request model

					// Check if there is available blood of the specified blood type
					const availableBlood = await Blood.find({
						bloodType,
						status: "available",
					});

					if (availableBlood.length < quantity) {
						await Request.findByIdAndUpdate(id, { status: "pending" });
						return res.status(400).json({
							error: `Not enough blood of type ${bloodType} available`,
						});
					}

					// Update the status of the first 'quantity' blood entries to "not available"
					for (let i = 0; i < quantity; i++) {
						await Blood.findOneAndUpdate(
							{ bloodType, status: "available" },
							{ status: "not available" }
						);
					}
				}
			} catch (error) {
				console.error("Error updating request:", error);
				return res.status(500).json({ error: "Error updating request" });
			}

			return res.status(200).json({ message: "Status updated successfully!!" });
		}
	} catch (error) {
		console.error("Error:", error.message);
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
}
