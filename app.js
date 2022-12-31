require('express-async-errors');
const userRouter = require('./routes/userRouter')
const employeeRouter = require('./routes/employeeRouter')
const companyRouter = require('./routes/companyRouter')
const adminRouter = require('./routes/adminRouter')
const error = require('./middleware/error')
const winston = require('winston')
const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')
var cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express();



const port = process.env.PORT || 5000;


// configure middleware

app.use(cors())
app.set('port', port) // set express to use this port
app.use(bodyParser.json({limit: '1000mb'}))
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true }))
app.use(fileUpload()) // configure fileupload
winston.add(new winston.transports.File({ filename: 'logfile.log' }))
app.set('views', __dirname + '/views') // set express to look in this folder to render our view
app.set('view engine', 'ejs') // configure template engine
app.use(express.static(path.join(__dirname, 'public'))) // configure express to use public folder



app.use('/user', userRouter)
app.use('/employee/', employeeRouter)
app.use('/company/', companyRouter)
app.use('/admin/', adminRouter)  
app.use(error)

app.get('/', function(req, res){
    res.render('index')
})

// server listening to the port 5000
app.listen(port, () => console.log(`Listening the port ${port}...`))
// server = app.listen(5000,function(){
//     var port = server.address().port;
//     console.log('Running on port no. '+port);
// })
