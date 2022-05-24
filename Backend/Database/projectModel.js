const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  // projectId: {
  //   type: String,
  //   required: true,
  // },
  year: {
    type: Number, default: new Date().getFullYear()
  },
  projectHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherData",
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
  }],
  isGroupProject : {
    type: Boolean, default: false
  },
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  sem : {
    type: Number,
    default : 1
  },
  // duration: {
  //   type: Number,
  //   required: true,
  // },
  tasks: [
    {
      task: {
        type: String,
        required: true,
      },
      remark : {
        type: String
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  report: {
    type: String,
  },
  ppt: String,
  literatureReview : String,
  comments: 
    {
      type: String,
    },
  
});

const projectModel = new mongoose.model("Projects", projectSchema);

module.exports = projectModel;
