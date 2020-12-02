const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Thread = require('../models/thread')
const Replies = require('../models/replies')

router.post('/:id', async (req, res, next) => {
	try {
	const thread = await Thread.findById(req.params.id).populate('user')
	const replyToCreate = {
		text: req.body.text,
		username: res.locals.username,
		user: res.locals.userId
	}
	thread.replies.push(replyToCreate)

	console.log('This is commentToCreate');
	console.log(replyToCreate);

	await thread.save()

	res.redirect('/thread/' + thread.id)


	} catch(err) {
		next(err)
	} 
})



module.exports = router