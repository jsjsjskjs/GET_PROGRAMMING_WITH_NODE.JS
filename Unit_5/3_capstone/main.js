"use strict";

const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController.js"),
  usersController = require("./controllers/usersController.js"),
  coursesController = require("./controllers/coursesController.js"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session'),
  expressValidator = require('express-validator'),
  connectFlash = require('connect-flash'),
  User = require("./models/user")

mongoose.connect(
  "mongodb://localhost:27017/confetti_cuisine",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator()) // 유효성 체크 및 세니타이징을 위한 메소드 사용

router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

router.use(cookieParser("secretCuisine123")) //비밀 키로 cookieParser 설정
router.use(expressSession({
  secret: "secretCuisine123",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}))
router.use(connectFlash())

router.use(passport.initialize()) //passport 사용 및 초기화를 위한 Express.js 설정
router.use(passport.session()) //passport에게 세션을 사용하도록 함
passport.use(User.createStrategy()) //기본 로그인 스트래티지 설정. passport-local-mongoose 모듈을 통해 제공되며 나중에 사용자 모델이 추가될 것
//아래의 2줄은 passport가 서버와 클라이언트 사이로 전달되는 사용자 데이터를 압축 및 암호화, 복호화를 하게 된다
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash()
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.currentUser = req.user
  next()
})

router.get("/", homeController.index);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login)
router.post("/users/login", usersController.authenticate)
router.get("/users/logout", usersController.logout, usersController.redirectView)
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
