const express = require("express");
const router = express.Router();
const employeeController = require('../controller/employeeController')
const authenticateToken = require("../middleware/authentication"); 
const { checkEmployeeLicense } = require("../middleware/checkLicense")

// router.use("/", authenticateToken);
router.post('/info', authenticateToken, employeeController.get_info)
router.post("/check-in", authenticateToken, checkEmployeeLicense, employeeController.check_in)
router.post("/check-out", authenticateToken, checkEmployeeLicense, employeeController.check_out)
router.post("/create-leave-request", authenticateToken, checkEmployeeLicense, employeeController.create_leave_request)
router.post("/available-leaves", authenticateToken, checkEmployeeLicense, employeeController.available_leaves)
router.post("/attendance-list", authenticateToken, checkEmployeeLicense, employeeController.attendance_list)
router.post("/leave-requests-list", authenticateToken, checkEmployeeLicense, employeeController.leave_requests_list)
router.post("/cancel-leave-request", authenticateToken, checkEmployeeLicense, employeeController.cancel_leave_request)
router.post("/company-all-branches", authenticateToken, checkEmployeeLicense, employeeController.company_all_branches)
router.post("/leave-types", authenticateToken, checkEmployeeLicense, employeeController.leave_types)
router.post("/change-attendance-request-status", authenticateToken, checkEmployeeLicense, employeeController.change_attendance_request_status)
router.post("/change-leave-request-status", authenticateToken, checkEmployeeLicense, employeeController.change_leave_request_status)
module.exports = router;
