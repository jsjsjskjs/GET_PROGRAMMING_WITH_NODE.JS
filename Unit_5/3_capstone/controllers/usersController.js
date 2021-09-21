"use strict";

const User = require("../models/user"),
passport = require('passport'),
  getUserParams = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },

  new: (req, res) => {
    res.render("users/new");
  },

  create: (req, res, next) => {
    if(req.skip) return next()
    let newUser = new User(getUserParams(req.body))

    User.register(newUser, req.body.password, (e, user) => {
      if(user) {
        req.flash("success", `${user.fullName}'s account created successfully!`)
        res.locals.redirect = "/users"
        next()
      } else {
        req.flash("error", `Failed to create user accout because: ${e.message}.`)
        res.locals.redirect = "/users/new"
        next()
      }
    })
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);

    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
    res.render('users/login')
  },
  validate: (req, res, next) => {
    req.sanitizeBody("email")
    .normalizeEmail({
      all_lowercase: true
    })
    .trim()

    req.check("email", "Email is invalid").isEmail()
    
    req.check("zipCode", "Zip code is invalid")
    .notEmpty()
    .isInt()
    .isLength({
      min: 5,
      max: 5
    })
    .equals(req.body.zipCode)

    req.check("password", "Password cannot be empty").notEmpty()
    req.getValidationResult().then((err) => {
      if(!err.isEmpty()) {
        let messages = err.array().map(e => e.msg)
        req.skip = true
        req.flash("error", messages.join(" and "))
        res.locals.redirect = '/users/new'
        next()
      } else {
        next()
      }
    })
  },
  //passport.authenticate를 사용하기 위한 액션을 추가
  //이 액션은 passport.register 메소드를 가리킨다
  //이미 main.js에서 사용자 모델을 위한 로컬 스트래티지를 생성했고
  //사용자가 데이터를 인증 성공 여부에 따라 직렬화와 역직렬화를 하도록 했다
  //아래에 추가한 옵션들은 플래시 메세지와 함께 인증이 성공 또는 실패했는지에 따라 경로를 결정한다
  authenticate: passport.authenticate('local', { 
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login',
    successRedirect: '/',
    successFlash: 'Logged in!'
  }),
  logout: (req, res, next) => {
    req.logout() //passport가 제공하는 메소드로 활성 중인 사용자 세션을 삭제한다
    req.flash("success", "You have been logged out!")
    res.locals.redirect = "/"
    next()
  }
};
