const express = require("express");
const router = express.Router();
const userController = require('../controller/userController')
const { isActive } = require("../middleware/checkactive")

// router.use("/", authenticateToken);
router.post("/unique-user-name", userController.unique_user_name)
router.post("/unique-email", userController.unique_email)
router.post("/login", isActive, userController.login)
router.post("/get-otp", userController.get_otp)
router.post("/verify-otp", userController.verify_otp)
router.post("/reset-password", userController.reset_password)
router.post("/log-out", userController.log_out)

router.get("/all-countries", userController.all_countries)
router.get("/all-banks", userController.all_banks)
router.get("/all-branches", userController.all_branches)


module.exports = router;
