// const asyncMiddleware = require('../middleware/async')
const { _getFileName, _uploadImage } = require('../utils/upload-image')
var Messages = require("../common_string")["messages"];
const Employee = require('../models/Employee')


// localhost:5000/employee/

exports.get_info = async function(req, res){
  const employee = new Employee(req.body)

  const response = await employee.getInfo()

  console.log('One Employee info ===========> ', response)
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, employee: response })
}

exports.check_in = async function(req, res){
  const employee = new Employee(req.body)
  const response = await employee.checkIn()
  res.status(200).json({ message: response })
}

exports.check_out = async function(req, res){
  const employee = new Employee(req.body)
  const response = await employee.checkOut()
  res.status(200).json({ message: response })
}

exports.create_leave_request = async function(req, res){
  if(req.files) req.body.image = _getFileName(req.files.photo)
  
  const employee = new Employee(req.body)
  await employee.createLeaveRequest()
  
  if(req.files) await _uploadImage(req.files.photo, req.body.image)
  
  return res.status(200).json({ message: Messages['en'].SUCCESS_INSERT })
}

exports.available_leaves = async function(req, res){
  const employee = new Employee(req.body)

  const response = await employee.showAvailableLeaves()
  
  console.log('Available leaves result ====================>', response)
  return res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, balance: response })
}

exports.attendance_list = async function(req, res) {
  const employee = new Employee(req.body)
  const response = await employee.getAttendanceList()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, attendance_list: response })
}

exports.leave_requests_list = async function(req, res) {
  const employee = new Employee(req.body)
  const response = await employee.getLeaveRequestsList()  
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, leave_requests_list: response })
}

exports.cancel_leave_request = async function(req, res){
  const employee = new Employee(req.body)
  await employee.cancelLeaveRequest()
  res.status(200).json({ message: Messages['en'].SUCCESS_DELETE })
}

exports.leave_types = async function(req, res){
  const employee = new Employee(req.body)
  const response = await employee.leaveTypes()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, leave_types: response })
}

exports.company_all_branches = async function(req, res){
  const employee = new Employee(req.body)
  const response = await employee.getCompanyAllBranches()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, company_branches: response })
}

exports.change_attendance_request_status = async function(req, res) {
    const employee = new Employee(req.body)
    await employee.changeAttendanceRequestStatus()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
}

exports.change_leave_request_status = async function(req, res){
    const employee = new Employee(req.body)
    await employee.changeLeaveRequestStatus()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
}