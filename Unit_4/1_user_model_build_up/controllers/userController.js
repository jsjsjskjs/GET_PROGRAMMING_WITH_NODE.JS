const User = require('../models/course')

module.exports = {
    index: (req, res) => {
        User.find({})
        .then(users => {
            res.render('users/index', { users: users })
        })
        .catch(err => {
            console.log(`Error fetching users: ${err.message}`)
            res.redirect('/')
        })
    }
}