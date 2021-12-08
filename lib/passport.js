var db = require('../lib/db')
const bcrypt = require('bcrypt');

module.exports = function (app) {
    // passport는 session을 참고해서 사용하기 때문에
    // 꼭꼭!! 세션 다음에 코드 작성
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session())

    // sesion 처리 
    // passport.use(LocalStrategy)에서 
    // 성공 시 authData를 user인자로 넘긴다 
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user)
        done(null, user.id); // 식별자만 저장
    });

    // 페이지 넘겨도 유저 세션 유지 유무 
    passport.deserializeUser(function (id, done) {
        var user = db.get('users').find({ id: id }).value();
        console.log('deserializeUser', id, user);
        done(null, user);
    });

    // 로그인 시도 시 사용자 유무 
    passport.use(new LocalStrategy({
        // params가 email과 password로 되어있는데
        // 이미 설정되어있는 email과 pwd로 바꿈
        emailField:'email',
        passwordField:'pwd'
    },
        function (email, password, done) {
            console.log('LocalStrategy', email, password)
        
            var user = db.get('users').find({
                email: email
                // , password: password
            }).value();

            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    // result == true
                    if (result) {
                        return done(null, user, {
                            message: 'Welcome.'
                        });
                    } else {
                        return done(null, false, {
                            message: 'Password is not correct.'
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: 'There is no email.'
                });
            }
        }
    ));
    return passport
}