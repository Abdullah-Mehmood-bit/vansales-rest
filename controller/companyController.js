const { _getFileName, _uploadImage } = require('../utils/upload-image')
var Messages = require("../common_string")["messages"];
const Company = require('../models/Company')
const User = require('../models/User')


// localhost:5000/admin/

exports.add_employee = async function(req, res){
  const user = new User(req.body)
  await user.uniqueUserName()
  await user.uniqueEmail()

  const company = new Company(req.body)
  await company.addEmployee()
  res.status(200).json({ message: Messages['en'].SUCCESS_INSERT })
}

exports.all_employee_info = async function(req, res){
  const company = new Company(req.body)
  const response = await company.allEmployeeInfo()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, employees: response })
}


exports.one_employee_info = async function(req, res){
  const company = new Company(req.body)
  const response = await company.oneEmployeeInfo()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, user: response })
}

exports.update_employee_info = async function(req, res){
  if(req.files) req.body.image = _getFileName(req.files.photo)
  
  const company = new Company(req.body)
  const response = await company.updateEmployeeInfo()
  
  if(req.files) await _uploadImage(req.files.photo, req.body.image)
  
  return res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE, user: response }) 
}

exports.add_company_branch = async function(req, res){
  const company = new Company(req.body)
  const response = await company.addCompanyBranch()
  return res.status(200).json({ message: Messages['en'].SUCCESS_INSERT, added_branch: response }) 
}

exports.delete_company_branch = async function(req, res){
  const company = new Company(req.body)
  const response = await company.deleteCompanyBranch()
  return res.status(200).json({ message: Messages['en'].SUCCESS_DELETE }) 
}

exports.attendance_list = async function(req, res) {
    const company = new Company(req.body)
    const response = await company.getAttendanceList()
    res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, attendance_list: response })
}


exports.change_attendance_request_status = async function(req, res) {
    const company = new Company(req.body)
    await company.changeAttendanceRequestStatus()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
}


exports.leave_requests_list = async function(req, res) {
    const company = new Company(req.body)
    const response = await company.getLeaveRequestsList()  
    res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, leave_requests_list: response })
}




exports.change_leave_request_status = async function(req, res){
    const company = new Company(req.body)
    await company.changeLeaveRequestStatus()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
}

exports.available_leaves = async function(req, res){
  const company = new Company(req.body)
  const response = await company.showAvailableLeaves()
  return res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, balance: response })
}

exports.leave_types = async function(req, res){
    const company = new Company(req.body)
    const response = await company.leaveTypes()
    res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, leave_types: response })
}

exports.create_leave_type = async function(req, res){
    const company = new Company(req.body)
    const response = await company.createLeaveType()
    res.status(200).json({ message: Messages['en'].SUCCESS_INSERT, leave_type: response })
}


exports.delete_leave_type = async function(req, res){
    const company = new Company(req.body)
    await company.deleteLeaveType()
    res.status(200).json({ message: Messages['en'].SUCCESS_DELETE })
}


exports.update_available_leave = async function(req, res){
    const company = new Company(req.body)
    const response = await company.updateAvailableLeave() 
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE, available_leave: response })
}


exports.get_info = async function(req, res){
    const company = new Company(req.body)
    const response = await company.getInfo()
    res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, user: response })
}


exports.create_department = async function(req, res){
    const company = new Company(req.body)
    const response = await company.createDepartment()
    res.status(200).json({ message: Messages['en'].SUCCESS_INSERT, added_department: response })
}

exports.delete_department = async function(req, res){
    const company = new Company(req.body)
    await company.deleteDepartment()
    res.status(200).json({ message: Messages['en'].SUCCESS_DELETE })
}

exports.create_designation = async function(req, res){
    const company = new Company(req.body)
    const response = await company.createDesignation()
    res.status(200).json({ message: Messages['en'].SUCCESS_INSERT, added_designation: response })
}

exports.delete_designation = async function(req, res){
    const company = new Company(req.body)
    await company.deleteDesignation()
    res.status(200).json({ message: Messages['en'].SUCCESS_DELETE })
} 

exports.update_info = async function(req, res){
  if(req.files) req.body.image = _getFileName(req.files.photo)
  
  const company = new Company(req.body)
  const response = await company.updateInfo()
  
  if(req.files) await _uploadImage(req.files.photo, req.body.image)
  
  return res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE, user: response }) 
}

exports.delete_employee_available_leave = async function(req, res){
    const company = new Company(req.body)
    await company.deleteEmployeeAvailableleave()
    res.status(200).json({ message: Messages['en'].SUCCESS_DELETE })
} 

exports.add_employee_in_branch = async function(req, res){
    const company = new Company(req.body)
    await company.addEmployeeInBranch()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
} 