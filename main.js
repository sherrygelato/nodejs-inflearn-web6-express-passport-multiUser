var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());

var session = require('express-session')
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use(flash())

var passport = require('./lib/passport')(app)

// // 1회용 메세지다 
// app.get('/flash', function(req, res){
//   // Set a flash message by passing the key, followed by the value, to req.flash().
//   req.flash('msg', 'Flash is back!!')
//   res.send('flash')
// });

// app.get('/flash-display', function(req, res){
//   // Get an array of flash messages by passing the key to req.flash()
//   var fmsg = req.flash()
//   console.log(fmsg)
//   res.send(fmsg)
// });

// // /login으로 로그인 정보를 보냈을 때
// app.post('/auth/login_process',
// // callback 함수가 passport 
// passport.authenticate('local', {
//     // local: id, pwd 로그인 방식
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     failureMessage: true,
//     successFlash: true
// }));

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});
