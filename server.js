require('dotenv').config()
const express = require('express')
const server = express()
const PORT = process.env.PORT

//Database
require('./db/db')

//Middleware
server.use(express.static('public'))

//Controllers

//Routes
server.get('/', (req, res) => {
	res.render('home.ejs')
})

//404
server.get('*', (req, res) => {
	rest.status(404).render('404.ejs')
})

server.listen(PORT, () => {
	const d = new Date()
	console.log(`${d.toLocaleString()}: Server is running on port: ${PORT}`)
})