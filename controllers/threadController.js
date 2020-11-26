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

module.exports = router