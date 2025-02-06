const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    html: String,
    css: String,
    js: String,
});

module.exports = mongoose.model("Project", ProjectSchema);