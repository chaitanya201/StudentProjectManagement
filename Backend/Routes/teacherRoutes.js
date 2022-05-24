const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const joi = require("joi");
const teacherAuth = require("../middleware/teacherAuth");
const teacherModel = require("../Database/teacherModel");
const projectModel = require("../Database/projectModel");
const SECRETKEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522";
const TEACHERKEYFORVALIDATION =
  'KALGJAHFkasvnvksalhaajliwlurh&@#^@%@14141563&#$^@532:}{:{>":';
// Registration

const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),

  email: joi.string().email().required(),
  secreteKey: joi.string().required(),
  mobile: joi.number().min(1000000000).required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const registration = async (req, res) => {
  console.log("Checking teacher credentials for registration");

  const { error } = await registrationSchema.validate({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    secreteKey: req.body.secreteKey,
  });

  if (error) {
    console.log("error in joi");
    console.log(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  if (TEACHERKEYFORVALIDATION !== req.body.secreteKey) {
    console.log("invalid secrete key");
    return res.send({
      status: "failed",
      msg: "Please provide valid Secrete Key",
    });
  }
  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: req.body.email });
    if (teacher) {
      console.log("teacher already exists");
      return res.send({ status: "failed", msg: "Teacher already exists" });
    }
  } catch (error) {
    console.log("error while finding teacher");
    return res.send({ status: "failed", msg: "Server error has occurred" });
  }

  let salt;
  try {
    salt = await bcrypt.genSalt(20);
  } catch (error) {
    console.log("error in bcrypt");
    return res.send({
      status: "failed",
      msg: "server error while generating salt",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  } catch (error) {
    console.log("error while hashing password");
  }
  teacher = new teacherModel({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: hashedPassword,
    pic: req.file ? req.file.filename : "dummy image 4.png",
  });

  teacher.save((err) => {
    if (err) {
      console.log("err while saving teacher");
      return res.send({
        status: "failed",
        msg: "server error while saving teacher",
      });
    }
    console.log("teacher saved successfully");
    return res.send({ status: "success", msg: "teacher saved successfully" });
  });
};

// login

const login = async (req, res) => {
  console.log("checking teachers for login");
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: req.body.email });
    if (!teacher) {
      console.log("teacher does not exists");
      return res.send({ status: "failed", msg: "teacher does not exists" });
    }
  } catch (error) {
    console.log("error while getting teacher");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    isValid = bcrypt.compare(req.body.password, teacher.password);
  } catch (error) {
    console.log("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ teacherId: teacher._id }, SECRETKEY, {
      expiresIn: "1d",
    });
    console.log("login successful");
    res.send({ status: "success", msg: "Login successful", token, teacher });
  } else {
    console.log("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};

// teacher edit profile
const editTeacherProfile = async (req, res) => {
  console.log("in teacher edit profile function");
  const { error } = registrationSchema.validate({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    currentEmail: req.body.currentEmail,
  });

  if (error) {
    console.log("error in joi");
    return res.send({ status: "failed", msg: "Please Provide valid data" });
  }

  if (req.body.email !== req.body.currentEmail) {
    try {
      const userExists = await userModel.findOne({
        email: req.body.currentEmail,
      });
      if (userExists) {
        console.log("email has already taken");
        return res.send({ status: "failed", msg: "Email has already taken" });
      }
    } catch (error) {
      console.log("error while finding user");
      return res.send({ status: "failed", msg: "Please provide valid email" });
    }
  }
  let salt;
  try {
    salt = await bcrypt.genSalt(20);
  } catch (error) {
    console.log("error in bcrypt");
    return res.send({
      status: "failed",
      msg: "server error while generating salt",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  } catch (error) {
    console.log("error while hashing password");
  }
  const result = await userModel.findOneAndUpdate(
    { email: req.body.currentEmail },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        pic: req.file
          ? req.file.filename
          : req.body.myFile
          ? req.body.myFile
          : null,
        password: hashedPassword,
      },
    },
    { new: true }
  );
  if (result) {
    res.send({ msg: "updating is successful", teacher: result });
    console.log("changes saved");
  } else {
    res.send({ msg: "error has occurred while saving. Try again later" });
    console.log("error while saving changes", result);
  }
};

// Search Project Queries

const search = async (req, res) => {
  console.log("In search part");
  console.log(req.query.year, req.query.status, req.query.subject);
  console.log("teacher is " + req.teacher);
  if (req.query.year || req.query.division || req.query.subject) {
    var result;
    try {
      result = await projectModel.find({
        year: parseInt(req.query.year),
        sem: parseInt(req.query.sem),
        subject: req.query.subject,

        isApproved : req.query.status === "true" ? true : false,
        projectHead:  req.teacher._doc._id
      });

      if (result.length > 0) {
        console.log("result found");
        console.log(result);
        return res.send({ status: "success", result, teacher : req.teacher._doc._id });
      }
      return res.send({ status: "failed", msg : "No result found" });
    } catch (error) {
      console.log("error has occurred*************");
      console.log(error);
      return res.send({ status: "failed", msg: "Server Error" });
    }
  } else {
    console.log("parameters are not valid");
    return res.send({
      status: "failed",
      msg: "Please provide valid parameters",
    });
  }
};

const searchYearAndSubject = async (req, res) => {
  console.log("In search by year");
  var result
  if (!req.query.year && !req.query.status && !req.query.subject) {
   console.log("Data is missing"); 
   return res.send({status: "failed", msg :"Provide valid data"})
  }
  try {
    result = await projectModel.find({
      year: req.query.year,
      subject : req.query.subject,
      isApproved : req.query.status,
      projectHead : req.teacher._doc._id
    })
    if(result.length > 0) {
      console.log("data found ");
      return res.send({status: "success", result})
    }
    return res.send({status : "failed", msg :"No records found"})
  } catch (error) {
    console.log("error has occurred");
    return res.send({status : "failed", msg : "Server Error"})
  }
}

router.post("/register", registration);
router.post("/login", login);
router.get("/get-all-projects", teacherAuth, search);

module.exports = router;
