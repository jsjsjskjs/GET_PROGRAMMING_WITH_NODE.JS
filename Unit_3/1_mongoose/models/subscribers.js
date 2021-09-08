const mongoose = require('mongoose'),
subscriberSchema = mongoose.Schema({
    name: String,
    email: String,
    zipCode: Number
})

module.exports = mongoose.model("Subscriber", subscriberSchema); // 모델을 적용하는 명령어