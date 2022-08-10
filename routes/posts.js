const express = require("express");
const Post = require("../schemas/post");
const router = express.Router();


/* 게시글 조회 : 완료 */
router.get("/", async (req, res) => {
  const posts = await Post.find();

  res.json({
    data: posts, 
  });
});

/* 게시글 상세조회 : createdAt 안나옴 */
router.get("/:postId", async (req, res) => {
  const _id = req.params.postId;

  const post = await Post.findOne({ _id });

  const result = {
    postId: post._id,
    user: post.user,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt, // 이거 안나옴
  }
  res.json({ result });
});

/* 게시물 작성 : 완료 */ 
router.post("/", async (req, res) => {
  const { user, title, content, password } = req.body;

  const createdPosts = await Post.create({
    user,
    title,
    content,
    password,
  });

  res.json({ posts: createdPosts });
});

/* 게시글 수정 : 완료 */
router.put("/:postId", async (req, res) => {
  const _id = req.params.postId;
  const {password, user, title, content} = req.body; 

  if(!password){
    return res.status(404).json({
      errorMessage: '비밀번호가 틀립니다.',
    })
  }; 

  await Post.updateOne({ _id }, { $set: { user, title, content } });
  
  res.status(201).json({ message: "게시글을 수정하였습니다." });
})

/* 게시글 삭제 : 완료 */
router.delete("/:postId", async (req, res) => {
  const _id = req.params.postId;
  const password = req.body["password"]; 

  const post = await Post.find({_id});

  if(!password){
    return res.status(404).json({
      errorMessage: '비밀번호가 틀립니다.',
    })
  }; 

  const deletePost = await Post.deleteOne({post});

  res.json({deletePost, "message" : "게시물이 삭제되었습니다."});

});

module.exports = router;

