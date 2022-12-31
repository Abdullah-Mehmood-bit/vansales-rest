//const asyncMiddleware = require('../middleware/async')
const User = require('../models/User')
const Admin = require('../models/Admin')
var Messages = require("../common_string")["messages"];
const { _getFileName, _uploadImage } = require('../utils/upload-image')


// localhost:5000/admin/

exports.add_company = async function(req, res){
    const user = new User(req.body)
    await user.uniqueUserName()
    await user.uniqueEmail()

    const admin = new Admin(req.body)
    await admin.addCompany() 
    res.status(200).json({ message: Messages['en'].SUCCESS_INSERT })
}

exports.all_company_info = async function(req, res){
  const admin = new Admin(req.body)
  const response = await admin.allCompanyInfo()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, companies: response })
}

exports.one_company_info = async function(req, res){
  const admin = new Admin(req.body)
  const response = await admin.oneCompanyInfo()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, user: response })
}


exports.update_company_info = async function(req, res){
  if(req.files) req.body.image = _getFileName(req.files.photo)
  
  const admin = new Admin(req.body)
  const response = await admin.updateCompanyInfo()
  
  if(req.files) await _uploadImage(req.files.photo, req.body.image)
  
  return res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE, user: response }) 
}