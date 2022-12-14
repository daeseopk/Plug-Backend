const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

require("dotenv").config();

router.get("/getAllPost", (req, res) => {
   var { isRecruiting } = req.query;
   isRecruiting = JSON.parse(isRecruiting);

   Post.find((err, posts) => {
      var result = [];
      var posts_ = [];
      if (err) return res.status(500).send({ error: "database failure" });
      posts_ = posts.sort((a, b) => {
         return b.likeList.length - a.likeList.length; // 좋아요 개수 순으로 정렬
      });
      if (isRecruiting) {
         posts_ = posts_.filter((post) => post.recruiting === true);
      }
      posts_.map((post) => {
         if (post.isProject === true) {
            result.push(post);
         }
      });
      res.json({
         success: true,
         postList: result,
      });
   });
});

router.get("/getFilteredPostStackAndCareer", (req, res) => {
   var { stack, career, uid } = req.query;
   var post_tmp = [];
   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      if (stack !== undefined) {
         posts.map((post) => {
            var isExist = false;
            stack.map((stack_) => {
               if (
                  (post.stack.includes(stack_) && post.recruiting) ||
                  (post.career === parseInt(career) && post.recruiting)
               )
                  isExist = true;
            });
            if (isExist && post.isProject) {
               post_tmp.push(post);
            }
         });
      }
      var posts_ = post_tmp.filter((element) => element.uid !== uid); // 본인이 작성할 글 필터링
      posts_ = posts_.sort((a, b) => {
         return b.likeList.length - a.likeList.length; // 좋아요 개수 순으로 정렬
      });
      res.send({ success: true, postList: posts_ });
   });
});

router.get("/getFilteredPost", (req, res) => {
   var { category, numOfPerson, date, period, stack, uid, isRecruiting } =
      req.query;
   isRecruiting = JSON.parse(isRecruiting);
   date = `${date.split("-")[0].trim()}-${date.split("-")[1].trim()}-${date
      .split("-")[2]
      .trim()}`;

   const getDateDiff = (d1, d2) => {
      const date1 = new Date(d1);
      const date2 = new Date(d2);

      const diffDate = date1.getTime() - date2.getTime();

      return Math.sign(diffDate / (1000 * 60 * 60 * 24)); // 음수 : -1 양수 : 1 동일 값: 0
   };

   // category 0 : 프로젝트, 1 : 스터디
   // numOfPerson 0 : 인원 미정, 1: 3명 이상, 2: 5명 이상, 3: 7명 이상, 4: 10명 이상
   // date yyyy - mm - dd
   // period 0 : 기간 미정, 1 : 1개월 미만, 2: 2개월 이상, 3 : 4개월 이상, 4: 6개월 이상
   // stack = []

   var post_tmp = [];
   var post_tmp_1 = [];
   var post_tmp_2 = [];
   var date_ = new Date();
   var today = `${date_.getFullYear()}-${
      date_.getMonth() + 1
   }-${date_.getDate()}`;

   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      // category, numOfPerson, period, recruiting으로 1차 필터링
      // numOfPerson, period 항목 각각 0(상관 없음 혹은 인원, 기간 미정)인 경우 필터링 x
      const Filter_1 = (category, numOfPerson, period) => {
         post_tmp = posts.filter((post) => post.category === category);
         if (isRecruiting) {
            post_tmp = post_tmp.filter((post) => post.recruiting === true);
         }
         if (parseInt(numOfPerson) >= 1) {
            post_tmp = post_tmp.filter(
               (post) => post.numOfPerson === numOfPerson
            );
         }
         if (parseInt(period) >= 1) {
            post_tmp = post_tmp.filter((post) => post.period === period);
         }
         return post_tmp;
      };
      // stack 으로 필터링
      const Filter_2 = (stack) => {
         if (stack !== undefined) {
            post_tmp.map((post_tmp_) => {
               var isExist = false;
               stack.map((stack_) => {
                  if (post_tmp_.stack.includes(stack_)) isExist = true;
               });
               if (isExist) {
                  post_tmp_1.push(post_tmp_);
               }
            });
            return post_tmp_1;
         } else {
            return post_tmp;
         }
      };
      // date(시작 날짜)로 필터링 date가 현재날짜(선택 안 함)일 경우 필터링 x
      const Filter_3 = (today, date) => {
         if (today !== date) {
            post_tmp.map((post_tmp_) => {
               var date_ = `${post_tmp_.date
                  .split("-")[0]
                  .trim()}-${post_tmp_.date
                  .split("-")[1]
                  .trim()}-${post_tmp_.date.split("-")[2].trim()}`;
               var isTrue = getDateDiff(date, date_);
               if (isTrue === -1 || isTrue === 0) {
                  post_tmp_2.push(post_tmp_);
               }
            });
            return post_tmp_2;
         } else {
            return post_tmp;
         }
      };

      post_tmp = Filter_1(category, numOfPerson, period); // 1차 필터 category, numOfPerson, period, recruiting
      post_tmp = Filter_2(stack); // 2차 필터 stack
      post_tmp = Filter_3(today, date); // 3차 필터 date(시작 날짜)
      post_tmp = post_tmp.filter((element) => element.uid !== uid);
      res.json({ success: true, postList: post_tmp });
   });
});

router.post("/likeButton", (req, res) => {
   const { uid, postId } = req.body;

   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      posts.map(async (post) => {
         if (post.postId === postId) {
            var likeList_ = [...post.likeList];
            if (likeList_.includes(uid)) {
               likeList_ = likeList_.filter((element) => element !== uid);
            } else {
               likeList_.push(uid);
            }
            await Post.updateOne(
               { postId: postId },
               { $set: { likeList: likeList_ } }
            );
            res.json({ success: true });
         }
      });
   });
});

router.get("/getPost", (req, res) => {
   const { postId } = req.query;
   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      posts.map((post) => {
         if (post.postId === postId) {
            return res.json({ success: true, post: post });
         }
      });
   });
});
module.exports = router;
