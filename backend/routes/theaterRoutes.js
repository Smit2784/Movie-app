const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theaterController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// Public
router.get("/theaters", theaterController.getTheaters);

// Admin
router.post(
    "/theaters",
    authenticateToken,
    authAdmin,
    theaterController.createTheater,
);  

router.post(
    "/admin/theaters",
    authenticateToken,
    authAdmin,
    theaterController.createTheater,
);
router.put(
    "/admin/theaters/:id",
    authenticateToken,
    authAdmin,
    theaterController.updateTheater,
);
router.delete(
    "/admin/theaters/:id",
    authenticateToken,
    authAdmin,
    theaterController.deleteTheater,
);

module.exports = router;
