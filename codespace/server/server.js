const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/docsEditor", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Import Model
const Project = require("./models/Project");

// Debugging API
app.post("/debug", (req, res) => {
    const { html, css, js } = req.body;
    let errors = "";

    if (!html.includes("<html>")) {
        errors += "⚠️ Missing <html> tag.\n";
    }

    if (css.includes(";;")) {
        errors += "❌ Double semicolon in CSS.\n";
    }

    try {
        new Function(js);
    } catch (e) {
        errors += `❌ JS Error: ${e.message}\n`;
    }

    res.json({ errors });
});

// Save Project API
app.post("/save", async(req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.json({ message: "Project saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving project" });
    }
});

// Fetch All Projects API
app.get("/projects", async(req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));