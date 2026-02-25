const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const Student = require("./models/student.model.js");
const Cohort = require("./models/cohort.model.js");

// MONGOOSE CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://example.com']
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:

// --- STUDENT ROUTES ---

//  POST /api/students - Creates a new student
app.post("/api/students", (req, res) => {
  Student.create(req.body)
    .then((createdStudent) => res.status(201).json(createdStudent))
    .catch((err) => res.status(500).json({ error: "Failed to create student" }));
});

//  GET /api/students - Retrieves all students with cohort details
app.get("/api/students", (req, res) => {
  Student.find()
    .populate("cohort") // Research Team: replaces cohort ID with actual cohort document
    .then((students) => res.status(200).json(students))
    .catch((err) => res.status(500).json({ error: "Failed to retrieve students" }));
});

//  GET /api/students/cohort/:cohortId - Retrieves all students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => res.status(200).json(students))
    .catch((err) => res.status(500).json({ error: "Failed to retrieve students for this cohort" }));
});

//  GET /api/students/:studentId - Retrieves a specific student by id
app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => res.status(200).json(student))
    .catch((err) => res.status(500).json({ error: "Failed to retrieve the student" }));
});

//  PUT /api/students/:studentId - Updates a specific student
app.put("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => res.status(200).json(updatedStudent))
    .catch((err) => res.status(500).json({ error: "Failed to update student" }));
});

//  DELETE /api/students/:studentId - Deletes a specific student
app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: "Failed to delete student" }));
});


// --- COHORT ROUTES ---

//  POST /api/cohorts - Creates a new cohort
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((createdCohort) => res.status(201).json(createdCohort))
    .catch((err) => res.status(500).json({ error: "Failed to create cohort" }));
});

//  GET /api/cohorts - Retrieves all cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find()
    .then((cohorts) => res.status(200).json(cohorts))
    .catch((err) => res.status(500).json({ error: "Failed to retrieve cohorts" }));
});

//  GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => res.status(200).json(cohort))
    .catch((err) => res.status(500).json({ error: "Failed to retrieve the cohort" }));
});

//  PUT /api/cohorts/:cohortId - Updates a specific cohort
app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => res.status(200).json(updatedCohort))
    .catch((err) => res.status(500).json({ error: "Failed to update cohort" }));
});

//  DELETE /api/cohorts/:cohortId - Deletes a specific cohort
app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: "Failed to delete cohort" }));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});