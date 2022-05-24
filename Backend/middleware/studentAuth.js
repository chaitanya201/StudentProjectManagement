const studentModel = require("../Database/studentModel");
const jwt = require("jsonwebtoken");
const SECRETKEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522"

const studentAuth = async (req, res, next) => {
  console.log("In student Auth");
  const { authorization } = req.headers;
  console.log("auth ", authorization);
  console.log("req.file ", req.file);
  console.log("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    const { studentId } = jwt.verify(token, SECRETKEY);
    let student
    try {
        student = await studentModel.findOne({ _id: studentId }).select("-password");
        
    } catch (error) {
     console.log("error while finding student with given id");
     return res.send({status : "failed" ,msg :"invalid token"})   
    }
    if (student) {
      console.log("auth is successful");
      req.student = { ...student };
      next();
    } else {
      console.log("student id is invalid ", studentId);
      res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    console.log("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = studentAuth;
