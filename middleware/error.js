const winston = require('winston')

module.exports = function(err, req, res, next){
    winston.log("error", err)
    console.log("error======================>", err)
    res.status(err.code).json({ message: err.message })
}