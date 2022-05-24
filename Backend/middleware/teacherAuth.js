const teacherModel = require("../Database/teacherModel");
const jwt = require("jsonwebtoken");
const SECRETKEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522"

const teacherAuth = async (req, res, next) => {
  console.log("In teacher Auth");
  const { authorization } = req.headers;
  console.log("auth ", authorization);
  console.log("req.file ", req.file);
  console.log("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, SECRETKEY);
    } catch (error) {
      return res.send({status : "failed", msg : "Your session has expired.  Please login again to continue. "})
    }
    const { teacherId } = jwt.verify(token, SECRETKEY);
    let teacher
    try {
        teacher = await teacherModel.findOne({ _id: teacherId }).select("-password");
        
    } catch (error) {
     console.log("error while finding teacher with given id");
     return res.send({status : "failed" ,msg :"invalid token"})   
    }
    if (teacher) {
      console.log("auth is successful");
      req.teacher = { ...teacher };
      next();
    } else {
      console.log("teacher id is invalid ", teacherId);
      res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    console.log("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = teacherAuth;
