import mongoose from "mongoose";

//Admin Schema
const adminSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export const Admin =
	mongoose.models.Admin || mongoose.model("Admin", adminSchema);
