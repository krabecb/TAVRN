const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	likedPosts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Thread'
	}],
	firstName: String,
	lastName: String,
	dateOfBirth: Date,
	hometown: String,
	email: String,
	profilePic: String
})

const User = mongoose.model('User', userSchema)

module.exports = User