import mongoose from "mongoose";

//User Schema
const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	phoneNumber: { type: String, required: true, unique: true },
	location: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
