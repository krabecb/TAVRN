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

router.post('/like', async (req, res, next) => {
	try {
		
		const foundThread = await Thread.findById(req.body.threadId).populate('user')
		console.log(`HERE IS THE foundThread INSIDE THE LIKE POST ROUTE\n ${foundThread}`)
		
		if(!foundThread.userLikes.includes(req.body.loggedInUser)) {

			foundThread.userLikes.push(req.body.loggedInUser)

			await foundThread.save()

			const foundUser = await User.findById(req.body.loggedInUser)
			console.log(`HERE IS THE foundUser INSIDE THE LIKE POST ROUTE\n ${foundUser}`)

			foundUser.likedPosts.push(req.body.threadId)

			await foundUser.save()

			res.redirect('/thread')

		} else {

			const userIndex = foundThread.userLikes.indexOf(req.body.loggedInUser)
			if(userIndex > -1) {
				foundThread.userLikes.splice(userIndex, 1)
			}

			console.log("LIKE REMOVED")

			await foundThread.save()

			const foundUser = await User.findById(req.body.loggedInUser)
			console.log(`HERE IS THE foundUser INSIDE THE LIKE POST ROUTE\n ${foundUser}`)

			const threadIndex = foundUser.likedPosts.indexOf(req.body.threadId)
			if(threadIndex > -1) {
				console.log("YES!!!")
				foundUser.likedPosts.splice(threadIndex, 1)
			}

			console.log("THREAD REMOVED")

			await foundUser.save()

			res.redirect('/thread')

		}
	} catch(error) {
		next(error)
	}
})

//Thread update: PUT /thread/:id
router.put('/:id', async (req, res, next) => {
	try {
		const updatedThread = await Thread.findByIdAndUpdate(
			req.params.id,
			req.body,
			{new: true}
			)
		res.redirect(`/thread/${updatedThread._id}`)
	} catch(err) {
		next(err)
	}
}) 

//Thread delete: DELETE /thread/:id
router.delete('/:id', async (req, res, next) => {
	try {
		await Thread.findByIdAndRemove(req.params.id)
		res.redirect('/thread')
	} catch(err) {
		next(err)
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