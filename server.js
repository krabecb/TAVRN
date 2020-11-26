require('dotenv').config()
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const PORT = process.env.PORT

//Database
require('./db/db')

//Middleware
server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: false}))
server.use(methodOverride('_method'))

//Sessions
server.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

server.use((req, res, next) => {
	console.log("Here is the session in the custom app-level middleware.")
	console.log(req.session)
	res.locals.loggedIn = req.session.loggedIn
	res.locals.username = req.session.username
	res.locals.userId = req.session.userId
	//flash messaging
	res.locals.message = req.session.message
	//clears out so it only appears once
	req.session.message = undefined
	next()
})

//Controllers
const authController = require('./controllers/authController')
server.use('/auth', authController)
const userController = require('./controllers/userController')
server.use('/user', userController)
const threadController = require('./controllers/threadController')
server.use('/thread', threadController)


//Routes
server.get('/', (req, res) => {
	res.render('home.ejs')
})

//404
server.get('*', (req, res) => {
	res.status(404).render('404.ejs')
})

server.listen(PORT, () => {
	const d = new Date()
	console.log(`${d.toLocaleString()}: Server is running on port: ${PORT}`)
})