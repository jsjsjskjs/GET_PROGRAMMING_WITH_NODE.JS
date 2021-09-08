const subscriber = require('../models/subscriber')

exports.getAllsubscriber = (req, res) => {
subscriber.find({})
.exec()
.then((data) => {
    res.render('subscribers', { 
        subscribers: data 
    })
})
.catch((err) => {
    console.log(err.message)
    return []
})
.then(() => {
    console.log('promise complete!')
})
}

exports.getSubscriptionPage = (req, res) => {
    res.render('contact')
}

exports.saveSubscriber = (req, res) => {
    subscriber.create({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    })
    .then((result) => {
        res.render('thanks')
    })
    .catch((err) => {
        if(err) console.log(err)
    })
}
