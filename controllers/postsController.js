const { createPostsSchema } = require('../middlewares/validator');
const Post = require('../models/postsModel');

exports.getPosts = async (req, res) => {
     const {page} = req.query;
     const postsPerPage = 10;  

     try {
        let pageNum = 0;
        if(page <=1){
            pageNum = 0
        }else{
            pageNum = page - 1
        }
        const result = await Post.find()
        .sort({createdAt: -1})
        .skip(pageNum * postsPerPage)
        .limit(postsPerPage)
        .populate({
            path:'userId',
            select:'email'
        })
        res.status(200).json({success: true, message: 'posts', data: result})



     } catch (error) {
        
        console.log(error);
        
        
     }
}
exports.createPosts = async (req, res) => {
    const {title, description} = req.body
    const {userId} = req.user;
    try {
        const { error, value } = createPostsSchema.validate({ 
            title, 
            description, 
            userId });
                if (error) {
                    return res
                    .status(401)
                    .json({ success: false, message: error.details[0].message });
                }
      const existingPost = await Post.create({
        title, description, userId,
      })  
      if(!existingPost){
                    return res
                    .status(401)
                    .json({ success: false, message: "Post unavailable" });
                }   
      res.status(201).json({success: true, message: 'posts created', data: existingPost})
 

    } catch (error) {
        console.log(error);
        
    }
}


exports.singlePost = async (req, res) => {
     const {_id} = req.query;

     try {
        
        const existingPost = await Post.findOne({_id})
        
        .populate({
            path:'userId',
            select:'email'
        })
        if(!existingPost){
                    return res
                    .status(401)
                    .json({ success: false, message: "Post unavailable" });
                }
        res.status(200).json({success: true, message: ' single post', data: existingPost})



     } catch (error) {
        
        console.log(error);
        
        
     }
}


exports.updatePosts = async (req, res) => {
    const {_id} = req.query;
    const {title, description} = req.body
    const {userId} = req.user;
    try {
        const { error, value } = createPostsSchema.validate({ 
            title, 
            description, 
            userId });
                if (error) {
                    return res
                    .status(401)
                    .json({ success: false, message: error.details[0].message });
                }
                const existingPost = await Post.findOne({_id})
                if(!existingPost){
                    return res
                    .status(401)
                    .json({ success: false, message: "Post unavailable" });
                }
                if (existingPost.userId.toString() !== userId){
                    return res
                    .status(403)
                    .json({ success: false, message: "unauthorized access" });
                }
                existingPost.title = title;
                existingPost.description = description;
                const result = await existingPost.save();
      res.status(200).json({success: true, message: 'Post updated', data: result})
 

    } catch (error) {
        console.log(error);
        
    }
}
exports.deletePosts = async (req, res) => {
    const {_id} = req.query;
    const {userId} = req.user;
    try {
        
                const existingPost = await Post.findOne({_id})
                if(!existingPost){
                    return res
                    .status(401)
                    .json({ success: false, message: "Post is already unavailable" });
                }
                if (existingPost.userId.toString() !== userId){
                    return res
                    .status(403)
                    .json({ success: false, message: "unauthorized access" });
                }
               await Post.deleteOne({_id})

      res.status(200).json({success: true, message: 'Deleted'})
 

    } catch (error) {
        console.log(error);
        
    }
}