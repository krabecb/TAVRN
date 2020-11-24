const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//Routes

//Registration form: GET /auth/register
router.get('/register', (req, res) => {
	res.render('auth/register.ejs')
})

//Registration form: POST /auth/register
router.post('/register', async (req, res, next) => {
	try {
		console.log(req.body)
		const requestedUsername = req.body.username
		const requestedPassword = req.body.password
		const userFirstName = req.body.firstname
		const userLastName = req.body.lastname
		const userDOB = req.body.date
		const userHometown = req.body.hometown
		const requestedEmail = req.body.email

		const userWithThisUsername = await User.findOne({
			username: requestedUsername
		})
		console.log("Here is userWithThisUsername: " + userWithThisUsername)

		if(userWithThisUsername) {
			console.log("username exists")
			req.session.message = `Username ${requestedUsername} has already been taken.`
			res.redirect('/auth/register')
		} else {
			const salt = bcrypt.genSaltSync(10)
			const hashedPassword = bcrypt.hashSync(requestedPassword, salt)
			const createdUser = await User.create({
				username: requestedUsername,
				password: hashedPassword,
				firstName: userFirstName,
				lastName: userLastName,
				dateOfBirth: userDOB,
				hometown: userHometown,
				email: requestedEmail
			})
			req.session.loggedIn = true
			req.session.userId = createdUser._id
			req.session.username = createdUser.username
			req.session.firstName = createdUser.firstName
			req.session.lastName = createdUser.lastName
			req.session.dateOfBirth = createdUser.dateOfBirth
			req.session.hometown = createdUser.hometown
			req.session.email = createdUser.email
			req.session.message = `Thanks for signing up, ${createdUser.username}!`
			res.redirect('/')
		}
	} catch(err) {
		next(err)
	}
})

//Login form: GET /auth/login
router.get('/login', (req, res) => {
	res.render('auth/login.ejs')
})

//Login form: POST /auth/login
router.post('/login', async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.body.username })

		if(!user) {
			console.log("Bad username or password")
			req.session.message = "Invalid username or password"
			res.redirect('/auth/login')
		} else {
			const validLoginInfo = bcrypt.compareSync(req.body.password, user.password)

			if(validLoginInfo) {
				req.session.loggedIn = true
		        req.session.userId = user._id
		        req.session.username = user.username
		        req.session.firstName = user.firstName
		        req.session.lastName = user.lastName
		        req.session.dateOfBirth = user.dateOfBirth
		        req.session.hometown = user.hometown
		        req.session.email = user.email
		        req.session.message = `Welcome back, ${user.username}!`
		        res.redirect('/')
			} else {
				console.log("Bad username or password")
				req.session.message = "Invalid username or password"
				res.redirect('/auth/login')
			}
		}
	} catch(err) {
		next(err)
	}
})

module.exports = router