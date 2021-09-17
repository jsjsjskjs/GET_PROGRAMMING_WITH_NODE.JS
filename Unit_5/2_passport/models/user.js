"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,
  Subscriber = require("./subscriber"),
  bcrypt = require("bcrypt"),
  passportLocalMongoose = require('passport-local-mongoose'),
  userSchema = new Schema(
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
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber"
      }
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
        console.log(`Error in connecting subscriber:${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

//Mongoose 플러그인 메소드를 사용해 userSchema가 passportLocalMongoose를 패스워드의 해싱과 저장에 사용한다
//아래의 코드가 추가되면 플러그인은 자동적으로 패스워드 저장에 관여하며 userSchema에서 패스워드 속성은 없앨 수 있다
//이 플러그인은 스키마를 수정해 hash, salt 필드를 사용자 모델에 password 필드 대신 추가시킨다
userSchema.plugin(passportLocalMongoose, {
  //passportLocalMongoose가 이메일 필드를 사용자 이름 대신 로그인 파라미터로 사용하게 한다
  usernameField: "email"
})

module.exports = mongoose.model("User", userSchema);
