const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync'); // 분기 방법으로 파일 저장
const adapter = new FileSync('db.json') // 해당 파일에 저장
const db = low(adapter) // 동기화 된 방식으로 처리 
db.defaults({ users: [], sessions: [], topics:[] }).write() // user에 넣어줘~
module.exports = db