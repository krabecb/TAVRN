require('dotenv').config()
const express = require('express')
const server = express()
const PORT = process.env.PORT

//Middleware
server.use(express.static('public'))

server.listen(PORT, () => {
	const d = new Date()
	console.log(`${d.toLocaleString()}: Server is running on port: ${PORT}`)
})