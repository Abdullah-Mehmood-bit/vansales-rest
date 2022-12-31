const Company = require('../models/Company')

async function checkUsersLimit(req, res, next){
    const company = new Company(req.body)
    await company.isPossibleToCreateEmployee()
    next()
}

module.exports = checkUsersLimit