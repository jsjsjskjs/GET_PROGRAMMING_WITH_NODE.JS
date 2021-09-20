"use strict";

const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  passport = require('passport'),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  User = require("./models/user");

mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(express.json());
router.use(cookieParser("secret_passcode"));
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize()) //passport 초기화
router.use(passport.session()) //passport가 Express.js 내 세션을 사용하도록 설정
passport.use(User.createStrategy()) //사용자의 로그인 스트래티지 설정
passport.serializeUser(User.serializeUser()) //passport가 사용자 데이터의 직렬화 및 역직렬화 작업을 하도록 설정
passport.deserializeUser(User.deserializeUser())
router.use(connectFlash());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  //사용자 정의 미들웨어를 추가해 모든 새로운 요청에서 응답으로의 전달 데이터에 아래의 변수들을 추가한다
  //isAuthenticated는 Passport.js 에서 제공되며 이를 통해 유입된 요청상에서 존재하는 사용자가 요청 쿠키에 저장돼 있는지 확인할 수 있다
  //이 때 loggedIn 값은 true나 false가 된다
  //만일 사용자가 요청 단계라면 이 값을 추출해서 할당할 수 있다!
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.currentUser = req.user
  next();
});
router.use(expressValidator());
router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);router.get("/users/login", usersController.login);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate, usersController.redirectView); //usersController는 더 이상 쓰이지 않는다.
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

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
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
