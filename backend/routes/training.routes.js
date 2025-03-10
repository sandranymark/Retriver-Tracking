const express = require('express')
const router = express.router()

//Getting all
router.get('/', (req, res) => {
    res.send('hello world')
})

//Getting one
router.get('/:id', (req, res) => {

})
//Creating new
router.post('/', (req, res) => {

})

//Updating one
router.patch('/:id', (req, res) => {

})

//Deleteing one
router.delete('/:id', (req, res) => {

})

module.exports = router;
