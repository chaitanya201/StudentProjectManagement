const express = require("express");
const router = express.Router();
const studentModel = require("../Database/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const joi = require("joi");
const userModel = require("../Database/studentModel");
const studentAuth = require("../middleware/studentAuth");
const SECRETKEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522";
// Registration

const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  rollNo: joi.number().required(),
  email: joi.string().email().required(),
  div: joi.string().required(),
  mobile: joi.number().min(1000000000).required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  currentEmail: joi.string().email(),
});

const registration = async (req, res) => {
  console.log("Checking student credentials for registration");

  const { error } = await registrationSchema.validate({
    name: req.body.name,
    rollNo: req.body.rollNo,
    email: req.body.email,
    div: req.body.div,
    mobile: req.body.mobile,
    password: req.body.password,
  });

  if (error) {
    console.log("error in joi");
    console.log(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  let student;
  try {
    student = await studentModel.findOne({ email: req.body.email });
    if (student) {
      console.log("student already exists");
      return res.send({ status: "failed", msg: "student already exists" });
    }
  } catch (error) {
    console.log("error while finding student");
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
  student = new studentModel({
    name: req.body.name,
    email: req.body.email,
    rollNo: req.body.rollNo,
    mobile: req.body.mobile,
    password: hashedPassword,
    div: req.body.div,
    pic: req.file ? req.file.filename : "dummy image 4.png",
  });

  student.save((err) => {
    if (err) {
      console.log("err while saving student");
      return res.send({
        status: "failed",
        msg: "server error while saving student",
      });
    }
    console.log("student saved successfully");
    return res.send({ status: "success", msg: "Student saved successfully" });
  });
};

// login

const login = async (req, res) => {
  console.log("checking credentials for login");
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let student;
  try {
    student = await studentModel.findOne({ email: req.body.email });
    if (!student) {
      console.log("student does not exists");
      return res.send({ status: "failed", msg: "Student does not exists" });
    }
  } catch (error) {
    console.log("error while getting student");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    isValid = bcrypt.compare(req.body.password, student.password);
  } catch (error) {
    console.log("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ studentId: student._id }, SECRETKEY, {
      expiresIn: "1d",
    });
    res.cookie("Backend", "hi", {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });
    console.log("login successful");
    res.send({ status: "success", msg: "Login successful", token, student });
  } else {
    console.log("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};

// edit profile

const editUser = async (req, res) => {
  console.log("in editing profile function");
  const { error } = registrationSchema.validate({
    name: req.body.name,
    rollNo: req.body.rollNo,
    email: req.body.email,
    div: req.body.div,
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
        div: req.body.div,
        rollNo: req.body.rollNo,
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
    res.send({ msg: "updating is successful", student: result });
    console.log("changes saved");
  } else {
    res.send({ msg: "error has occurred while saving. Try again later" });
    console.log("error while saving changes", result);
  }
};

router.post("/register", registration);
router.post("/login", login);
router.post("/edit-profile", studentAuth, editUser);
module.exports = router;
