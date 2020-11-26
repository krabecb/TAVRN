const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Thread = require('../models/thread')

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

//Thread show: GET /thread/:id
router.get('/:id', async (req, res, next) => {
	try {
		const foundThread = await Thread.findById(req.params.id).populate('user')
		console.log(foundThread)
		console.log(foundThread.user.username)
		res.render('threads/show.ejs', {
			thread: foundThread,
			user: req.session.username
		})	
	} catch(err) {
		next(err)
	}
})

//Thread form: POST /thread/new
router.post('/', async (req, res, next) => {
	try {
		const threadToCreate = {
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

//Thread edit: GET /thread/:id/edit
router.get('/:id/edit', async (req, res, next) => {
	try {
		const foundThread = await Thread.findById(req.params.id).populate('user')
		req.session.userId == foundThread.user._id

		if(req.session.username == foundThread.user.username) {
			res.render('threads/edit.ejs', {
			thread: foundThread,
			})
		} else {
			req.session.message = "YOU DO NOT HAVE PERMISSION TO ACCESS THIS."
			res.redirect('/')
		}
	} catch(err) {
		next(err)
	}
})

module.exports = router