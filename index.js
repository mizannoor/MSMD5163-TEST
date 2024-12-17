//! Question (2)
//import and setting up middleware
var express = require("express"); //call express
var app = express(); //define our app using express

const mongoose = require("mongoose");
const Lecturer = require("./lecturer");
mongoose.connect("mongodb+srv://mizannoor:1q2w3e4r@cluster0.jhf6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var port = process.env.PORT || 8080; //set our port
//Setting route and path
var router = express.Router();
router.get("/", async (req, res) => {
	res.json({ message: "Hula! my API works!!!" });
});

app.use("/university/api", router);
app.listen(port); // create a server that browsers can connect to
console.log("Server started at port " + port);

// Read all by id
router.get("/lecturer", async (req, res) => {
	Lecturer.find()
		.then(function (lecturers) {
			res.json({ message: "OK", data: lecturers });
		})
		.catch(function (err) {
			res.json({ error: "message " + err });
		});
});

// Read one by id
router.get("/lecturer/:id", async (req, res) => {
	Lecturer.findById(req.params.id)
		.then((lecturer) => {
			res.json({ message: "OK", data: lecturer });
		})
		.catch((err) => {
			if (err) res.json({ error: "message " + err });
		});
});

// Update by id
router.put("/lecturer/:id", async (req, res) => {
	Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((lecturer) => {
			res.json({ message: "Lecturer updated successfully", data: lecturer });
		})
		.catch((err) => {
			res.json({ error: "message " + err });
		});
});
// Delete by id
router.delete("/lecturer/:id", async (req, res) => {
	Lecturer.findByIdAndDelete(req.params.id)
		.then((lecturer) => {
			res.json({ message: "Lecturer deleted successfully " + req.params.id, data: lecturer });
		})
		.catch((err) => {
			res.json({ error: "message " + err });
		});
});

//! Question (3) a)
// Create
router.post("/lecturer", async (req, res) => {
	let newLecturer = new Lecturer({
		name: req.body.name,
		lecturerID: req.body.lecturerID,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email,
		salary: req.body.salary,
	});
	//method save by mongoose to store Lecturer model data in db
	newLecturer
		.save()
		.then(() => {
			res.json({ message: "Lecturer successfully created!" });
		})
		.catch((err) => {
			res.json({ error: "message" + err });
		});
});

//! Question (3) b)
router.post("/lecturer/:lecturerID/publications", async (req, res) => {
	// use push() to appends a specified value to an array (Publication)
	// lecturer.publications.push(newPublication)
	try {
		const lecturer = await Lecturer.findOne({ lecturerID: { $eq: req.params.lecturerID } });
		if (!lecturer) return res.status(404).send("Lecturer not found");

		lecturer.publications.push(req.body);
		await lecturer.save();

		res.json({ message: "OK", data: lecturer.publications });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

//! Question (3) c)
// Read one by lecturerID
router.get("/lecturer/:lecturerID", async (req, res) => {
	Lecturer.findOne({ lecturerID: { $eq: req.params.lecturerID } })
		.then((lecturer) => {
			res.json({ message: "OK", data: lecturer });
		})
		.catch((err) => {
			if (err) res.json({ error: "message " + err });
		});
});

//! Question (3) d)
// Route /lecturerSalary retrieve lecturer's name, lecturerID, and salary whose salary equals or greater than 5000
router.get("/lecturerSalary", async (req, res) => {
	try {
		const lecturers = await Lecturer.find({ salary: { $gte: 5000 } })
			.sort({ salary: 1 }) // sort by salary in ascending order
			.select({ name: true, lecturerID: true, salary: true });
		res.json({ message: "OK", data: lecturers });
	} catch (err) {
		res.status(500).send(err.message);
	}
});

//! Question (3) e)
router.get("/lecturer/:lecturerID/publications", async (req, res) => {
	// list all publications of a given lecturer id req.params.id
	try {
		const lecturer = await Lecturer.findOne({ lecturerID: { $eq: req.params.lecturerID } });
		if (!lecturer) return res.status(404).send("Lecturer not found");

		res.json({ message: "OK", data: lecturer.publications });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

//? extra - retrieve specific publication from specific lecturer
router.get("/lecturer/:lecturerID/publications/:publicationID", async (req, res) => {
	try {
		const lecturer = await Lecturer.findById(req.params.lecturerID);
		if (!lecturer) return res.status(404).send("Lecturer not found");

		const publication = lecturer.publications.id(req.params.publicationID);
		if (!publication) return res.status(404).send("Publication item not found");

		res.send({ message: "OK", data: publication });
	} catch (err) {
		res.status(500).send(err.message);
	}
});

//! Question (3) f)
router.put("/lecturer/:lecturerID/publications/:publicationID", async (req, res) => {
	// updates the publication while keeping its schema
	// publication.set(req.body);
	try {
		const lecturer = await Lecturer.findOne({ lecturerID: { $eq: req.params.lecturerID } });
		if (!lecturer) return res.status(404).send("Lecturer not found");

		const publication = lecturer.publications.find((publication) => publication.publicationID === req.params.publicationID);
		if (!publication) return res.status(404).send("Publication item not found");
		publication.set(req.body);
		await lecturer.save();
		res.send({ message: "OK", data: lecturer.publications });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

//! Question (3) g)
router.delete("/lecturer/:lecturerID/publications/:publicationID", async (req, res) => {
	try {
		const lecturer = await Lecturer.findOne({ lecturerID: { $eq: req.params.lecturerID } });
		if (!lecturer) return res.status(404).send("Lecturer not found");

		// Find the index of the menu item
		const publicationIndex = lecturer.publications.findIndex((publication) => publication.publicationID.toString() === req.params.publicationID);
		if (publicationIndex === -1) return res.status(404).send("Publication item not found");

		// Remove the publication item
		lecturer.publications.splice(publicationIndex, 1);
		await lecturer.save();

		res.send({ message: "OK", data: `Successfully deleted publication id ${req.params.publicationID}` });
	} catch (err) {
		res.status(500).send(err.message);
	}
});
