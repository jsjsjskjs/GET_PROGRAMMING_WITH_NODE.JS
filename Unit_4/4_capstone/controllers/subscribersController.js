const Subscriber = require('../models/subscriber'),
getSubscriberParams = body => {
  return {
    name: body.name,
    email: body.name,
    zipCode: parseInt(body.zipCode)
  }
}

module.exports = {
  index: (req, res, next) => {
    Subscriber.find({})
    .then(subscribers => {
      res.locals.subscribers = subscribers
      next()
    })
    .catch(err => {
      console.log(`Error fetching subscribers: ${err.message}`)
      next(err)
    })
  },
  indexView: (req, res) => {
    res.render('subscirbers/index')
  },
  new: (req, res) => {
    res.render('subscribers/new')
  },
  create: (req, res, next) => {
    let subscriberData = getSubscriberParams(req.body)
    Subscriber.create(subscriberData)
    .then(subscriber => {
      res.locals.subscriber = subscriber
      res.locals.redirect = "/subscibers"
      next()
    })
    .catch(err => {
      console.log(`Error saving subsciber: ${err.message}`)
      next(err)
    }) 
  },
  redirectView: (req, res, next) => {
    let view = res.locals.redirect
    if(view) res.render(`${view}`)
    else next()
  },
  show: (req, res, next) => {
    Subscriber.findById(req.params.id)
    .then(subscriber => {
      res.locals.subscriber = subscriber
      next()
    })
    .catch(err => {
      console.log(`Error fetching subscriver by ID: ${err.message}`)
      next(err)
    })
  },
  showView: (req, res, next) => {
   res.render('subscribers/show')
  },
  edit: (req, res, next) => {
    Subscriber.findById(req.params.id)
    .then(subscriber => {
      res.render('subscribers/edit', {
        subscriber: subscriber
      })
    })
    .catch(err => {
      console.log(`Error fetching subscriber by ID: ${err.message}`)
      next(err)
    })
  },
  update: (req, res, next) => {
    let updateData = getSubscriberParams(req.body),
    userId = req.params.id
    Subscriber.findByIdAndUpdate(userId, {
      $set: updateData
    })
    .then(subscirber => {
      res.locals.redirect = `/subscribers/${userId}`
      res.locals.subscirber = subscirber
      next()
    })
    .catch(err => {
      console.log(`Error updating subscriber by ID: ${err.message}`)
      next(err)
    })
  },
  delete: (req, res, next) => {
    Subscriber.findByIdAndDelete(req.params.id)
    .then(() => {
      res.locals.redirect = `/subscibers`
      next()
    })
    .catch(err => {
      console.log(`Error deleting subscriber by ID: ${err.message}`)
      next(err)
    })
  } 
}