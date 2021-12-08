var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

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

  // session에 정보가 저장되지 않았음에도 불구 리디렉션
  router.post('/login_process',
    passport.authenticate('local', {
      failureRedirect: '/auth/login'
    }), (req, res) => {
      req.session.save(() => {
        res.redirect('/')
      })
  })
  
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