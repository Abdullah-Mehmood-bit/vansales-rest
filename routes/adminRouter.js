const express = require("express");
const router = express.Router();
const adminController = require('../controller/adminController')
const authenticateToken = require("../middleware/authentication");

// router.use("/", authenticateToken);

router.post("/add-company", authenticateToken, adminController.add_company)
router.post("/all-company-info", authenticateToken, adminController.all_company_info)
router.post("/one-company-info", authenticateToken, adminController.one_company_info)
router.post("/update-company-info", authenticateToken, adminController.update_company_info)

module.exports = router;
 