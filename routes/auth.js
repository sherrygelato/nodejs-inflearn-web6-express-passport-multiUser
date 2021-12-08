var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var shortid = require('shortid')

var db = require('../lib/db')

module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash()
    var feedback = ''
    if (fmsg.error) {
      feedback = fmsg.error[0]
    }
    console.log(fmsg)
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
    <div style="color:red;">${feedback}</div>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
    `, '');
    response.send(html);
  });

  // // /login으로 로그인 정보를 보냈을 때
  // router.post('/login_process',
  //   // callback 함수가 passport
  //   passport.authenticate('local', {
  //     // local: id, pwd 로그인 방식
  //     successRedirect: '/',
  //     failureRedirect: '/login',
  //     failureMessage: true,
  //     successFlash: true
  //   })
  // );

  // // session 파일에 로그인 정보가 저장이 되기도 하고 안되기도 하고
  // // /login으로 로그인 정보를 보냈을 때
  // router.post('/login_process',
  //   // callback 함수가 passport
  //   passport.authenticate('local', {
  //     // local: id, pwd 로그인 방식
  //     failureRedirect: '/login',
  //     function(request, response) {
  //       request.session.save(function () {
  //         response.redirect(`/`);
  //       })
  //     }
  //   })
  // );

  // // session에 정보가 저장되지 않았음에도 불구 리디렉션
  // router.post('/login_process',
  //   passport.authenticate('local', {
  //     failureRedirect: '/auth/login'
  //   }), (req, res) => {
  //     req.session.save(() => {
  //       res.redirect('/')
  //     })
  // })

  // 메모리에 있는 session 정보가 redirect되기 전에 파일로 기록되지 않은 문제
  router.post('/login_process', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('error', info.message);
        return req.session.save(function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/auth/login');
        })
      }
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        req.flash('success', info.message);
        return req.session.save(function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      });
    })(req, res, next);
  })

  router.get('/register', function (request, response) {
    var fmsg = request.flash()
    var feedback = ''
    if (fmsg.error) {
      feedback = fmsg.error[0]
    }
    console.log(fmsg)
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
    <div style="color:red;">${feedback}</div>
    <form action="/auth/register_process" method="post">
      <p><input type="text" name="email" placeholder="email" value="test1@example.com"></p>
      <p><input type="password" name="pwd" placeholder="password" value="1234321!"></p>
      <p><input type="password" name="pwd2" placeholder="password" value="1234321!"></p>
      <p><input type="text" name="displayName" placeholder="displayName" value="sherry"></p>
      <p>
        <input type="submit" value="register">
      </p>
    </form>
    `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    // 1. 이미 사용자 있는지?
    // 2. pwd 값이 없다면 오류 발생
    // 3. 값 입력되지 않은채 submit 했다면 오류 발생
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if (pwd !== pwd2) {
      request.flash('error', 'Password Must Same!')
      response.redirect('/auth/register')
    } else {
      var user = {
        id: shortid.generate(),
        email: email,
        password: pwd,
        displayName:displayName
      }
      db.get('users').push({user}).write()
      request.login(user, function(err) {
        return response.redirect('/')
      })
    }
  });
  
  // destroy : 세션이 삭제됨
  router.get('/logout', function (request, response) {

    // passport logout
    request.logout();

    // session delete
    // request.session.destroy(function (err) {
    //   response.redirect('/');
    // });

    request.session.save(function () {
      response.redirect('/');
    });
  })

  return router;
};