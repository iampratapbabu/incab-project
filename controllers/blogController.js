const Blog = require('../models/blogModel');


exports.topBlogs = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-views';

  next();
}


exports.getAllBlogs = async (req, res) => {
  try {

    //api features

    //getting query
    const queryObj = {
      ...req.query
    }
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);



    //filtering query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


    //main query yhi se find out kar rha hai
    let query = Blog.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    //limitting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    //executing query
    const blogs = await query;
    res.status(200).json({
      status: "success",
      result: blogs.length,
      data: blogs
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }

}

exports.createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    console.log(newBlog);
    res.status(201).json({
      data: newBlog
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }
};


exports.getBlog = async (req, res) => {
  try {
    const tour = await Blog.findById(req.params.id);
    if (!tour) {
      res.status(404).json({
        message: "There is no Blog with this id"
      })
    }
    res.status(200).json({
      tour
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }
}


exports.patchBlog = async (req, res) => {
  try {
    const tour = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!tour) {
      res.status(404).json({
        message: "There is no Blog with this id"
      })
    }
    res.status(201).json({
      data: tour
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }
}


exports.deleteBlog = async (req, res) => {
  try {
    const tour = await Blog.findByIdAndDelete(req.params.id);
    if (!tour) {
      res.status(404).json({
        message: "There is no Blog with this id"
      })
    }
    res.status(203).json({
      message: "succesfully deleted"
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }
}

//aggeration features of mongoose
exports.blogStats = async (req, res) => {
  try {

    const stats = await Blog.aggregate([{
        $group: {
          // _id:'$rating',
          _id: null,
          minViews: {
            $min: '$views'
          },
          maxViews: {
            $max: '$views'
          },
          totalViews: {
            $sum: '$views'
          },
          averageRatings: {
            $avg: '$rating'
          }
        }
      },




    ]);

    res.status(200).json({
      status: "success",
      stats
    })

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });

  }
}
