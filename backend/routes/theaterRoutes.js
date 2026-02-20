const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theaterController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authVendor = require("../middleware/authVendor");

// Public
router.get("/theaters", theaterController.getTheaters);

// Vendor
router.get(
    "/admin/theaters",
    authenticateToken,
    authVendor,
    theaterController.getVendorTheaters,
);

router.post(
    "/theaters",
    authenticateToken,
    authVendor,
    theaterController.createTheater,
);

router.post(
    "/admin/theaters",
    authenticateToken,
    authVendor,
    theaterController.createTheater,
);
router.put(
    "/admin/theaters/:id",
    authenticateToken,
    authVendor,
    theaterController.updateTheater,
);
router.delete(
    "/admin/theaters/:id",
    authenticateToken,
    authVendor,
    theaterController.deleteTheater,
);

module.exports = router;
