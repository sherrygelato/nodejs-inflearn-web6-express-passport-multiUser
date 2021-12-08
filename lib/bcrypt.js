// 비동기 방식
const bcrypt = require('bcrypt');
const saltRounds = 10;
// 남들이 알아보기 힘들게 하는 노이즈
// 숫자를 올릴수록 해독 확률 ㄴㄴ
const myPlaintextPassword = 's0/\/\P4$$w0rD'; // 나의 비밀번호 예시
const someOtherPlaintextPassword = 'not_bacon'; // 

// Technique 2 (auto-gen a salt and hash):
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB. 
    // hash를 저장하면 됨
    console.log(hash)

    // 비밀번호 확인
    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result == true
        console.log('my password', result)
    });
    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        // result == false
        console.log('other password', result)
    });
});

