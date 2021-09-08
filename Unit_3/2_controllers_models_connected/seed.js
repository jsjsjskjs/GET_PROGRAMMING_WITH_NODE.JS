const mongoose = require('mongoose'),
Subscriber = require('./models/subscriber')

mongoose.connect(
    'mongodb://localhost:27017/recipe_db',
    {useNewUrlParser: true}
)

mongoose.connection

let contacts = [
    {
      name: "Jon Wexler",
      email: "jon@jonwexler.com",
      zipCode: 10016
    },
    {
      name: "Chef Eggplant",
      email: "eggplant@recipeapp.com",
      zipCode: 20331
    },
    {
      name: "Professor Souffle",
      email: "souffle@recipeapp.com",
      zipCode: 19103
    }
  ]

  Subscriber.deleteMany()
  .exec()
  .then(() => {
      console.log('Subscriber data is empty!!!')
  })

  let commands = []

  contacts.forEach((e) => {
      commands.push(Subscriber.create({
          name: e.name,
          email: e.email
      }))
  })

  Promise.all(commands)
  .then((data) => {
      console.log(JSON.stringify(data))
      mongoose.connection.close()
  })
  .catch(err => {
      console.log(`Error: ${err}`)
  }) 