const mongoose = require('mongoose')
const Replies = require('./replies')

const threadSchema = new mongoose.Schema({
	title: String,
	threadDescription: String,
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
	replies: [Replies.schema]
})

const Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread