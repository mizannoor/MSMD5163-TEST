//? Repository https://github.com/mizannoor/MSMD5163-TEST
//! Question (1)

const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
	title: { type: String, require: true },
	publicationID: { type: String, require: true, unique: true },
	publisher: { type: String },
	year: Number,
});

const lecturerSchema = new mongoose.Schema({
	name: { type: String, require: true },
	lecturerID: { type: String, require: true, unique: true, uppercase: true },
	address: { type: String, require: true },
	phone: { type: String, require: true, match: [/^\d{3}-\d{3}-\d{4}$/, "Please enter a valid phone number"] }, //? eg: 123-456-7890
	email: { type: String, require: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"] }, //? eg: email@example.com
	salary: { type: Number, default: 4500, min: 1500, max: 4500 }, //? eg: 4500
	publications: [publicationSchema],
});

module.exports = mongoose.model("Lecturer", lecturerSchema);
