const User = require('../models/user')

//userController.index가 쿼리를 완료하고 응답 객체에 데이터를 보내면 userController.indexView가 뷰를 렌더링하기 위해 호출된다.
//이 변경으로 나중에 다른 라우트에서의 인덱스 액션 이후 다른 미들웨어 함수 호출을 결정할 수 있게 된다.
module.exports = {
    index: (req, res, next) => {
        User.find() // index 액션에서만 쿼리 실행, find 쿼리를 사용자 모델상에서 호출한다.
        .then(users => {
            res.locals.users = users // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
            // res.locals 객체, 즉 뷰에서 가질 액세스를 할 수 있는 변수로 할당하는 응답상의 고유한 객체로 보낸다
            // 결과를 res.locals.users로 할당하면 더 이상 뷰로 액세스할 필요는 없어질 것이다
            next()
        })
        .catch(err => {
            console.log(`Error fetching users: ${err.message}`)
            next(err) // 에러를 캐치하고 다음 미들웨어로 전달
            // 쿼리에서 에러가 발생되면 에러를 로깅하고 이를 다음 미들웨어 함수로 보내 에러를 처리하게 한다.
            // 이 경우, internalServerError 함수가 그 역할을 한다.
        })
    },
    indexView: (req, res) => {
        res.render('users/index') // 분리된 액션으로 뷰 렌더링
    }
}