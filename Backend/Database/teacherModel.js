const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name : {type: String, required:true},
    email : {type: String, required: true},
    mobile : {type: String, required: true},
    password: {type: String, required: true},
    pic : {type: String, default: 'dummy image 4.png'}
})

const teacherModel = new mongoose.model("TeacherData", teacherSchema)

module.exports = teacherModel