const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');



router.route('/top-5-blogs').get(blogController.topBlogs,blogController.getAllBlogs);
router.route('/blog-stats').get(blogController.blogStats);

router.route('/')
.get(authController.protect,blogController.getAllBlogs)

router
.route('/create-blog')
.post(blogController.createBlog);

router.route('/:id')
.get(blogController.getBlog)
.patch(blogController.patchBlog)
.delete(blogController.deleteBlog)








module.exports = router;
