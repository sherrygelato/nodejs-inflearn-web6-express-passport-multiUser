module.exports = function (app) {
    
    var authData = {
        email:'test@example.com',
        password:'1234321!',
        nickname:'sherrygelato'
    }

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
        done(null, user.email); // 식별자만 저장
    });

    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id)
        done(null, authData);
    });

    // 로그인 시도 시 사용자 유무 
    passport.use(new LocalStrategy({
        // params가 username과 password로 되어있는데
        // 이미 설정되어있는 email과 pwd로 바꿈
        usernameField:'email',
        passwordField:'pwd'
    },
    function (username, password, done) {
        console.log('LocalStrategy', username, password)

        if (username === authData.email) {
            console.log(1)
            if (password === authData.password) {
                console.log(2)
                return done(null, authData);
            } else {
                console.log(3)
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        } else {
            console.log(4)
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }}
    ));
    return passport
}