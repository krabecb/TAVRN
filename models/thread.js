const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
	title: String,
	threadDescription: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
})

const Thread = mongoose.model('Thread', threadSchema)