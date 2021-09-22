"use strict";

const Course = require("../models/course"),
httpStatus = require("http-status-codes"),
User = require('../models/user')

module.exports = {
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.courses);
    } else {
      res.render("courses/index");
    }
  },
  new: (req, res) => {
    res.render("courses/new");
  },

  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")],
      zipCode: req.body.zipCode
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")],
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  respondJSON: (req, res) => { // 이전 미들웨어로부터의 요청 처리 및 응답 전달
    res.json({
      status: httpStatus.OK,
      data: res.locals //로컬 데이터를 JSON 포맷으로 응답
    })
  },
  errorJSON: (err, req, res, next) => {
    let errObject
    
    if(err) {
      errObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message
      }
    } else {
      errObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown Error.'
      }
    }
    res.json(errObject)
  },
  join: (req, res, next) => {
    let courseId = req.params.id,
    currentUser = req.user

    if(currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId
        }
      })
      .then(() => {
        res.locals.success = true
        next()
      })
      .catch(e => {
        next(e)
      })
    } else {
      next(new Error("User must log in."))
    }
  },
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser
    if(currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id)
        })
        return Object.assign(course.toObject(), {joined: userJoined})
      })
      res.locals.courses = mappedCourses
      next()
    } else {
      next()
    }
  }
};
