const User = require('../models/User')

exports.isActive = async (req, res, next) => {
    const user = new User(req.body)
    await user.active()
    next()
}
