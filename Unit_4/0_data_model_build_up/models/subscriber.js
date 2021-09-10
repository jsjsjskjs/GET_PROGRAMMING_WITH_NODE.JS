"use strict";
//기존 모델 개선을 위해 유효성 평가자를 추가한다
const mongoose = require("mongoose"),
  subscriberSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [10000, 'Zip code too short'], //10000보다 작은 값이 들어온다면 1번째 요소의 문자를 에러 메세지로 출력
      max: 99999
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course"}] //ObjectId를 통해 참조를 저장할 수 있도록 한다. ID는 몽고DB에서 얻어온다.
  });

  subscriberSchema.method.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`
  }

  subscriberSchema.method.findLocalSubscribers = function() {
    return this.model("Subscriber")
    .find({ zipCode: this.zipCode })
    .exec()//exec()는 프로미스를 돌려주기 위한 쿼리 실행
  }

//다른 파일에서 이 모듈을 import하는 것만으로도 직접 Subscriber 모델을 요청할 수 있도록 한다
module.exports = mongoose.model("Subscriber", subscriberSchema);
