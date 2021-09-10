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
    //ObjectId를 통해 참조를 저장할 수 있도록 한다. ID는 몽고DB에서 얻어온다. 그 후 Mongoose 모델 Course를 참조한다
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course"}]
    //구독자당 한 번에 하나의 강좌만 선택하게 하려 한다면 속성을 싸고 있는 대괄호를 업애면 된다. 여기서 대괄호는 다중 참조 배열을 의미한다.
    //만일 구독자가 하나의 강좌만 신청이 간능하다면 course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"} 처럼 될 것이다.
    //이 경우 구독자는 하나의 강좌로만 연결될 수 있다. 이는 구독자가 한 번에 하나의 강좌만 신청이 가능한 경우로도 생각할 수 있다.
    //이 방법으로 데이터베이스의 제한은 기능처럼 동작하며, 동시에 여러 개의 강좌를 등록하는 행위를 막을 수 있다.
    //하지만 하나의 강좌에 이미 다른 구독자들이 연결돼 있는 경우 이 강좌에 다른 구독자가 신청하는 것을 막을 수는 없다. 
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
