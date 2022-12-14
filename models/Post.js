var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const postSchema = new Schema({
   // 프로젝트 QnA 공통
   postId: { type: String, required: true, unique: true }, // 게시글 id
   isProject: { type: Boolean, required: true }, // 프로젝트/스터디 여부 (필수)
   uid: { type: String, required: true }, // 유저 uid (필수)
   title: { type: String, required: true }, // 제목 (필수)
   desc: { type: String, required: true }, // 본문 (필수)
   uploadDate: { type: String, required: true }, // 게시 날짜 (필수)
   likeList: { type: Array, required: false }, // 좋아요 남긴 사람
   commentList: { type: Array, required: false }, // 댓글
   // only 프로젝트
   category: { type: String, required: false }, // 프로젝트 모집구분
   numOfPerson: { type: String, required: false }, // 프로젝트 모집인원
   period: { type: String, required: false }, // 프로젝트 진행 기간
   stack: { type: Array, required: false }, // 프로젝트 기술 스택
   date: { type: String, required: false }, // 프로젝트 시작 예정일
   recruiting: { type: Boolean, required: false }, // 모집중 여부
   career: { type: Number, required: false }, // 주니어, 아마추어, 시니어
});

// CommentList=[
//    {uid:"uid",
//    date:"date",
//    desc:"desc",
//    }
// ]

module.exports = mongoose.model("Post", postSchema);
