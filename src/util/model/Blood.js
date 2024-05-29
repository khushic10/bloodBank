import mongoose from "mongoose";

//Blood Schema
const bloodSchema = new mongoose.Schema({
	bloodType: { type: String, required: true },
	donatedBy: { type: String, required: true },
	donatorContact: { type: String, required: true },
	donatedOn: { type: String, required: true },
	status: { type: String, required: true },
});

export const Blood =
	mongoose.models.Blood || mongoose.model("Blood", bloodSchema);
