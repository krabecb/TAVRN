const express = require('express')
const router = express.Router()
const Thread = require('../models/thread')
const User = require('../models/user')

//Index: GET /thread/
router.get('/', async (req, res, next) => {
	try {
		const foundThreads = await Thread.find().populate('user')
		console.log(foundThreads)
		res.render('threads/index.ejs', {
			threads: foundThreads,
			userId: req.session.userId
		})
	} catch(err) {
		next(err)
	}
})

//Thread form: GET /thread/new
router.get('/new', (req, res) => {
	res.render('threads/new.ejs', {
		userId: req.session.userId
	})
})

//Thread form: POST /thread/new
router.post('/', async (req, res, next) => {
	try {
		const postToCreate = {
			title: req.body.title,
			threadDescription: req.body.description,
			user: req.session.userId
		}
		console.log('Here is req.session:')
		console.log(req.session)

		const createdThread = await Thread.create(threadToCreate)
		req.session.message = `${createdThread.title} successfully added!`
		res.redirect('/') //Maybe later redcirect to show?? 

	} catch(error) {
		next(error)
	}
})

module.exports = router