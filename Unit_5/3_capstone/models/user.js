"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  passportLocalMongoose = require('passport-local-mongoose'), //사용자 모델에 passport-local-mongoose를 요청
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
    /*password: {
      type: String,
      required: true
    }, passport 사용으로 이 부분은 사용하지 않아도 된다*/ 
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  },
  {
    timestamps: true
  }
);

userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

//userSchema에 passport-local-mongoose 모듈을 플러그인으로 추가
//아래의 코드는 passportLocalMongoose를 설정해 salt와 hash 필드를 데이터베이스 내 사용자 모델을 위해 만든다.
//email 속성을 로그인 시 인증을 위한 유효성 평가 필드로 사용한다
//이 코드는 module.export 라인 전에 위치해야 한다
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
})

module.exports = mongoose.model("User", userSchema);
