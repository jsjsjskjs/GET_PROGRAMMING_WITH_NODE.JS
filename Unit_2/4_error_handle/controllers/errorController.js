const e = require('express')
const httpStatus = require('http-status-codes')

exports.logErrors = (err, req, res, next) => { // 에러처리를 위한 미들웨어 추가
    console.log(err.stack) // 에러 스택 로깅
    next(err) // 다음 미들웨어 함수로 에러 전달
}

exports.resNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND
    res.status(errorCode)
    res.sendFile(`./public/${errorCode}.html`) // 404.html 파일의 콘텐츠 전송
}

exports.resInternalError = (err, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR
    console.log(`ERROR occurred: ${err.stack}`)
    res.status(errorCode)
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`)
}

