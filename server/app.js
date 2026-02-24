const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const mongoose = require("mongoose");
const Student = require("./models/student.model"); 

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: ${x.connections[0].name}`))
  .catch(err => console.error("Error connecting to MongoDB", err));
 

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

// GET ALL STUDENTS FROM THE DATABASE
app.get("/api/students", (req, res) => {
  Student.find()
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/cohorts.json");
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});