

const blogModel = require("../models/blogModel")
const BlogModel = require ("../models/blogModel")
//const BlogModel = require("../models/blogModel")


const createBlog = async function (req, res) {                                    // Second API

    try {
        let data = req.body
        let savedData = await BlogModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    }

    catch (error) {
        console.log(error)
        res.status(400).send({ status: false, msg: "connection failed" })
    }

    
}
// PUT API 
 const updateBlogs= async function(req,res){
     try{
     let blogId=req.params.blogId
     
      let gotblog=await blogModel.findById(blogId)//Finding blogId in blogModel
     // console.log(gotblog)
     if(!gotblog){ return res.status(404).send("No blogs exist")//check blogId is valid or not
    }
    let detailsToUpdate=req.body
    let updatedBlog=await blogModel.findOneAndUpdate({_id:blogId},detailsToUpdate,{new:true})//Updating the details are coming from request
res.status(200).send({status:true,data:updatedBlog})
     }
 catch(err){
     console.log(err)
     res.status(500).send({msg:err.message})
}
}


const deleteBlogs = async function(req, res){
    let id = req.params.blogId
    let allBlogs = await BlogModel.findOneAndUpdate({_id : id, isDeleted : false}, {$set: {isDeleted : true}},{new : true})
    if(allBlogs)res.status(200).send({status : true, msg : allBlogs})
    else res.status(404).send({status: false, msg : " "})
}

// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like

const deleteBlogsByFields = async function(req, res){
    let data = req.query
    let any = await BlogModel.find(data)
    if(Object.keys(any).length !== 0){
        let all = await BlogModel.updateMany(data , {$set : {isDeleted : true}}, {new : true})
        res.status(200).send({status : true, msg : all})
    }
    else res.status(404).send({status : false, msg : ""})
    } 


// module.exports.deleteBlogsByFields = deleteBlogsByFields
//module.exports.deleteBlogs = deleteBlogs
//module.exports.createBlog = createBlog

  // module.exports.createBlog = createBlog
  
const getBlog = async function (req, res) {
    let data = req.query
    let authorId = data.authorId
    let category = data.category
    let tags = data.tags
    let subcategory = data.subcategory
    console.log(data)
    if (Object.keys(data).length === 0) {
        let allBlogs = await blogModel.find({ isPublished: true, isDeleted: false })
        if (allBlogs.length == 0) return res.status(404).send({status:false, msg: "not found" })
        return res.status(200).send({ status:true,msg: allBlogs })
    }

    let filterBlogs = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory}]})
    res.status(200).send({status:true, msg: filterBlogs })



}
module.exports.getBlog = getBlog
module.exports.createBlog = createBlog
module.exports.updateBlogs=updateBlogs
module.exports.deleteBlogsByFields = deleteBlogsByFields
module.exports.deleteBlogs = deleteBlogs