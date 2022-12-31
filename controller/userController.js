const nodemailer = require('nodemailer')
var Messages = require("../common_string")["messages"];
const User = require('../models/User')


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "anjumsoft.jordan@gmail.com", // generated ethereal user
    pass: "@Open3242" // generated ethereal password
  }
});

// localhost:5000/admin/

// exports.login = asyncMiddleware(async function(req, res){
//   const employee = new Employee(req.body)
//   const response = await employee.login()
//   res.status(200).json({ message: Messages['en'].LOGIN_SUCCESS, info: response })
// })

exports.unique_user_name = async function(req, res){
  const user = new User(req.body)
  await user.uniqueUserName()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH })
}


exports.unique_email = async function(req, res){
  const user = new User(req.body)
  await user.uniqueEmail()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH })
}


exports.login = async function(req, res){
  const user = new User(req.body)
  const response = await user.login()
  res.status(200).json({ message: Messages['en'].LOGIN_SUCCESS, info: response })
}

exports.get_otp = async function(req, res){
    console.log(req.body)
    const user = new User(req.body)

    const response = await user.registered()
    console.log('employee registered ===================>', response)

    const otp = await user.otpSaved()
    console.log('Saved the opt ===================>', otp)
    
    const mailOptions = {
      from: 'anjumsoft.jordan@gmail.com', // sender address
      to: req.body.email, // list of receivers
      subject: "Forget Password ✔",
      text: "Your 6 digits otp", // plain text body
      html: `<b>${otp}</b>` // html body
    } 

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'mail sent successfully' })
}

exports.verify_otp = async function(req, res) {
  const user = new User(req.body)
  await user.verifyOtp()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, result: 'OTP is valid'})
}

exports.reset_password = async function(req, res) {
  const user = new User(req.body)
  await user.resetPassword()
  res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE})
}

exports.log_out = async function(req, res) {
    const user = new User(req.body)
    await user.logOut()
    res.status(200).json({ message: Messages['en'].SUCCESS_UPDATE })
}

exports.all_countries = async function(req, res) {
  const user = new User()
  const response = await user.getAllCountries()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, countries: response })
}


exports.all_banks = async function(req, res) {
  const user = new User()
  const response = await user.getAllBanks()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, banks: response })
}


exports.all_branches = async function(req, res) {
  const user = new User()
  const response = await user.getAllBranches()
  res.status(200).json({ message: Messages['en'].SUCCESS_FETCH, branches: response })
}
