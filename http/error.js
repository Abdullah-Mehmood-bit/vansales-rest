const Messages = require("../common_string")["messages"];

exports.unauthorized = function(message){
    if(!message) message = Messages['en'].UNAUTHORIZED 

    const error = new Error(message)
    error.code = 401
    return error
}

exports.notFound = function(message){
    if(!message) message = Messages['en'].NOT_FOUND

    const error = new Error(message)
    error.code = 404
    return error
}

exports.internalServerError = function(message){
    if(!message) message = Messages['en'].INTERNAL_SERVER_ERROR

    const error = new Error(message)
    error.code = 500
    return error
}

exports.unableToHandle = function(message){
    if(!message) message = Messages['en'].UNABLE_TO_HANDLE

    const error = new Error(message)
    error.code = 503
    return error
}

exports.exceedLimit = function(message){
    const error = new Error(message)
    error.code = 402
    return error
}

exports.expired = function(message){
    const error = new Error(message)
    error.code = 402
    return error
}

exports.deActivated = function(message){
    const error = new Error(message)
    error.code = 402
    return error
}

