"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  Subscriber = require("./subscriber");

var userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    password: {
      type: String,
      required: true
    },
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  },
  {
    timestamps: true
  }
);

//fullName이라는 가상 속성을 추가하는 작업
//데이터베이스에는 저장되지 않지만
//사용자 모델에서 user.fullName과 같이 동작이 가능하다
userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`
})

userSchema.pre('save', (next) => {
    let user = this
    if(user.subscribedAccount === undefined) {
        Subscriber.findOne({
            email: user.email
        })
        .then(subscriber => {
            user.subscribedAccount = subscriber
            next() //다음 미들웨어 함수 호출
        })
        .catch(err => {
            console.log(`Error in connecting subscriber: ${err.message}`)
            next(err)
        })
    } else {
        next()
    }
})

module.exports = mongoose.model("User", userSchema)