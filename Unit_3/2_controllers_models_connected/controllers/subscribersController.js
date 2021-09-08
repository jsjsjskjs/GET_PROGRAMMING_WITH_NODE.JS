"use strict";

const { ResumeToken } = require("mongodb");
const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
  .exec() //find 쿼리로부터의 Promise 리턴
  .then((data) => { //저장된 데이터를 다음 then 코드 블록에 전달
    res.render('subscribers', { 
       subscribers: data //데이터베이스로부터 결과 제공
      })
  })
  .catch((err) => { //Promise에서 리젝트 된 에러들을 처리
    console.log(err.message)
    return []
  })
  .then(() => {
    console.log('promise complete')
  })
};

//구독 페이지를 렌더링하기 위한 액션 추가
exports.getSubscriptionPage = (req, res) => { 
  res.render('contact')
}

//새로운 구독자 추가
exports.saveSubscriber = (req, res) => {
  Subscriber.create({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  })
  .then((result) => {
    res.render('thanks')
  })
  .catch(err => {
    if(err) res.send(err)
  })
}
