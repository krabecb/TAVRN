const mongoose = require('mongoose')

const repliesSchema = new mongoose.Schema({
	text: String,
	date: {
		type: Date,
		default: Date.now
	},
	username: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

const Replies = mongoose.model('Replies', repliesSchema)

module.exports = Replies