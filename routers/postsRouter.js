const express = require('express');
const postsController = require('../controllers/postsController');
const { identifier } = require('../middlewares/identification');

const router = express.Router();

router.get('/all-posts', postsController.getPosts);
router.post('/create-post', identifier,postsController.createPosts);
router.get('/single-post', postsController.singlePost);
router.put('/update-post', identifier,postsController.updatePosts);
router.delete('/delete-post', identifier,postsController.deletePosts);






module.exports = router;