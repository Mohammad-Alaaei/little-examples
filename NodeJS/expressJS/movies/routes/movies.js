const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");

router.get("/", (req, res) => {
    res.render("movies/index");
});

router.get("/add", (req, res) => {
    res.render("movies/add", { Movie: new Movie() });
});

router.post("/", (req, res) => {
    const movie = new Movie({
        name: req.body.name,
        description: req.body.description || null,
        score: parseInt(req.body.score) || null
    })
    movie.save();
    // res.send(req.body.name);
});

module.exports = router;