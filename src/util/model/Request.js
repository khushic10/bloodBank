import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	bloodType: { type: String, required: true },
	contactNumber: { type: String, required: true },
	fullName: { type: String, required: true },
	quantity: { type: Number, required: true },
	requestedOn: { type: String, required: true },
	status: { type: String, required: true },
});

export const Request =
	mongoose.models.Request || mongoose.model("Request", requestSchema);
