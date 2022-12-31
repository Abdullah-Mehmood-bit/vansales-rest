const Company = require('../models/Company')

async function checkBranchLimit(req, res, next){
    const company = new Company(req.body)
    await company.isPossibleToCreateBranch()
    next()
}

module.exports = checkBranchLimit