const Company = require('../models/Company')
const Employee = require('../models/Employee')

exports.checkCompanyLicense = async (req, res, next) => {
    const company = new Company(req.body)
    await company.notExpired()
    next()
}

exports.checkEmployeeLicense = async (req, res, next) => {
    const employee = new Employee(req.body)
    await employee.notExpired()
    next()
}