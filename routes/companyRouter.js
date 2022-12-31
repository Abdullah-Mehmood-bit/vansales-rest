const express = require("express");
const router = express.Router();
const companyController = require('../controller/companyController')
const authenticateToken = require("../middleware/authentication");
const checkUsersLimit = require("../middleware/checkUsersLimit")
const checkBranchLimit = require("../middleware/checkBranchLimit")
const { checkCompanyLicense } = require("../middleware/checkLicense")

// router.use("/", authenticateToken);
router.post("/add-employee", authenticateToken, checkUsersLimit, checkCompanyLicense, companyController.add_employee)
router.post("/all-employee-info", authenticateToken, checkCompanyLicense, companyController.all_employee_info)
router.post("/one-employee-info", authenticateToken, checkCompanyLicense, companyController.one_employee_info)
router.post("/attendance-list", authenticateToken, checkCompanyLicense, companyController.attendance_list)
router.post("/change-attendance-request-status", authenticateToken, checkCompanyLicense, companyController.change_attendance_request_status)
router.post("/leave-requests-list", authenticateToken, checkCompanyLicense, companyController.leave_requests_list)
router.post("/change-leave-request-status", authenticateToken, checkCompanyLicense, companyController.change_leave_request_status)
router.post("/update-employee-info", authenticateToken, checkCompanyLicense, companyController.update_employee_info)
router.post("/available-leaves", authenticateToken, checkCompanyLicense, companyController.available_leaves)
router.post("/create-leave-type", authenticateToken, checkCompanyLicense, companyController.create_leave_type)
router.post("/delete-leave-type", authenticateToken, checkCompanyLicense, companyController.delete_leave_type)
router.post("/update-available-leave", authenticateToken, checkCompanyLicense, companyController.update_available_leave)
router.post("/get-info", authenticateToken, checkCompanyLicense, companyController.get_info) 
router.post("/add-company-branch", authenticateToken, checkCompanyLicense, checkBranchLimit, companyController.add_company_branch)
router.post("/delete-company-branch", authenticateToken, checkCompanyLicense, companyController.delete_company_branch)
router.post("/leave-types", authenticateToken, checkCompanyLicense, companyController.leave_types)
router.post("/create-department", authenticateToken, checkCompanyLicense, companyController.create_department)
router.post("/delete-department", authenticateToken, checkCompanyLicense, companyController.delete_department)
router.post("/create-designation", authenticateToken, checkCompanyLicense, companyController.create_designation)
router.post("/delete-designation", authenticateToken, checkCompanyLicense, companyController.delete_designation)
router.post("/update-info", authenticateToken, checkCompanyLicense, companyController.update_info)
router.post("/delete-employee-available-leave", authenticateToken, checkCompanyLicense, companyController.delete_employee_available_leave)
router.post("/add-employee-in-branch", authenticateToken, checkCompanyLicense, companyController.add_employee_in_branch)


module.exports = router;
