const Movie = require("../models/Movie");
const UpcomingMovie = require("../models/UpcomingMovie");

// Get all movies (with search/filter)
exports.getMovies = async (req, res) => {
    try {
        const { categories, search } = req.query;
        let query = {};

        if (categories) {
            const categoryArray = Array.isArray(categories)
                ? categories
                : categories.split(",");

            if (categoryArray.length > 0) {
                const categoryConditions = categoryArray.map((category) => ({
                    genre: { $regex: category.trim(), $options: "i" },
                }));
                query.$and = categoryConditions;
            }
        }

        if (search) {
            const searchCondition = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            };

            if (query.$and) {
                query.$and.push(searchCondition);
            } else {
                query = searchCondition;
            }
        }

        const movies = await Movie.find(query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movies" });
    }
};

// Get single movie
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie" });
    }
};

// Get upcoming movies
exports.getUpcomingMovies = async (req, res) => {
    try {
        const { categories, search } = req.query;
        let query = {};

        if (categories) {
            const categoryArray = Array.isArray(categories)
                ? categories
                : categories.split(",");

            if (categoryArray.length > 0) {
                const categoryConditions = categoryArray.map((category) => ({
                    genre: { $regex: category.trim(), $options: "i" },
                }));
                query.$and = categoryConditions;
            }
        }

        if (search) {
            const searchCondition = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { director: { $regex: search, $options: "i" } },
                ],
            };

            if (query.$and) {
                query.$and.push(searchCondition);
            } else {
                query = searchCondition;
            }
        }

        const upcomingMovies = await UpcomingMovie.find(query).sort({
            releaseDate: 1,
        });

        res.json(upcomingMovies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching upcoming movies" });
    }
};

// Get single upcoming movie
exports.getUpcomingMovieById = async (req, res) => {
    try {
        const movie = await UpcomingMovie.findById(req.params.id);
        if (!movie) {
            return res
                .status(404)
                .json({ message: "Upcoming movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error fetching upcoming movie" });
    }
};

// Seed upcoming movies
exports.seedUpcomingMovies = async (req, res) => {
    try {
        // Basic upcoming movies data for seeding
        const upcomingMoviesData = [
            {
                title: "Captain America: Brave New World",
                description:
                    "Sam Wilson takes on the mantle of Captain America in a world full of new threats.",
                poster: "https://image.tmdb.org/t/p/original/twFcwq0d6fWq57z5g2bL3g.jpg",
                releaseDate: new Date("2025-02-14"),
                genre: "Action, Adventure, Sci-Fi",
                director: "Julius Onah",
                videoId: "1pHDWnXmK7Y",
            },
            {
                title: "Superman: Legacy",
                description:
                    "A new vision for the Man of Steel as he balances his Kryptonian heritage with his human upbringing.",
                poster: "https://image.tmdb.org/t/p/original/zVMyvNowgbsBAL6O6esWfRpAcArg.jpg",
                releaseDate: new Date("2025-07-11"),
                genre: "Action, Adventure, Sci-Fi",
                director: "James Gunn",
                videoId: "T5W3g4VPolI",
            },
            {
                title: "The Fantastic Four",
                description:
                    "Marvel's first family returns to the big screen in a new MCU adaptation.",
                poster: "https://image.tmdb.org/t/p/original/8gLhu8UeZgQ2ZlX9r1B1H.jpg",
                releaseDate: new Date("2025-05-02"),
                genre: "Action, Adventure, Sci-Fi",
                director: "Matt Shakman",
                videoId: "eOrK6oW-q1I",
            },
            {
                title: "Thunderbolts",
                description:
                    "A group of anti-heroes is assembled for a government mission.",
                poster: "https://image.tmdb.org/t/p/original/t0M4v1w5K.jpg",
                releaseDate: new Date("2025-05-05"),
                genre: "Action, Adventure, Crime",
                director: "Jake Schreier",
                videoId: "P5uK-2WfE.jpg",
            },
        ];

        const existingUpcoming = await UpcomingMovie.countDocuments();

        if (existingUpcoming > 0) {
            return res.json({
                success: true,
                message: `${existingUpcoming} upcoming movies already exist in database`,
                moviesCount: existingUpcoming,
                skipReason: "already_exists",
            });
        }

        const insertedMovies = await UpcomingMovie.insertMany(
            upcomingMoviesData,
            {
                ordered: false,
            },
        );

        res.json({
            success: true,
            message: `Successfully added ${insertedMovies.length} upcoming movies to database`,
            moviesCount: insertedMovies.length,
            insertedIds: insertedMovies.map((m) => m._id),
            totalUpcomingMovies: await UpcomingMovie.countDocuments(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to seed upcoming movies",
            error: error.message,
        });
    }
};

// ADMIN: Add Movie
exports.createMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            genre,
            duration,
            poster,
            releaseDate,
            language,
            director,
            cast,
            price,
        } = req.body;

        const movie = new Movie({
            title,
            description,
            genre,
            duration: Number(duration),
            poster,
            releaseDate: new Date(releaseDate),
            language,
            director,
            cast: Array.isArray(cast)
                ? cast
                : cast.split(",").map((c) => c.trim()),
            price: Number(price),
        });

        await movie.save();
        res.status(201).json({
            success: true,
            message: "Movie saved to Atlas!",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ADMIN: Update Movie
exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updatedMovie)
            return res.status(404).json({ message: "Movie not found" });
        res.json({
            success: true,
            movie: updatedMovie,
            message: "Movie updated",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// ADMIN: Delete Movie
exports.deleteMovie = async (req, res) => {
    try {
        const result = await Movie.findByIdAndDelete(req.params.id);
        if (!result)
            return res
                .status(404)
                .json({ success: false, message: "Movie not found" });

        res.json({ success: true, message: "Deleted from Atlas" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ADMIN: Add Upcoming Movie
exports.createUpcomingMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            genre,
            poster,
            releaseDate,
            director,
            videoId,
        } = req.body;

        const movie = new UpcomingMovie({
            title,
            description,
            genre,
            poster,
            releaseDate: new Date(releaseDate),
            director,
            videoId,
        });

        await movie.save();
        res.status(201).json({
            success: true,
            message: "Upcoming Movie saved to Atlas!",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ADMIN: Update Upcoming Movie
exports.updateUpcomingMovie = async (req, res) => {
    try {
        const updatedMovie = await UpcomingMovie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updatedMovie)
            return res
                .status(404)
                .json({ message: "Upcoming Movie not found" });
        res.json({
            success: true,
            movie: updatedMovie,
            message: "Upcoming Movie updated",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// ADMIN: Delete Upcoming Movie
exports.deleteUpcomingMovie = async (req, res) => {
    try {
        const result = await UpcomingMovie.findByIdAndDelete(req.params.id);
        if (!result)
            return res
                .status(404)
                .json({ success: false, message: "Upcoming Movie not found" });

        res.json({ success: true, message: "Deleted from Atlas" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
