const express = require("express");
const router = express.Router();
const projectModel = require("../Database/projectModel");
const joi = require("joi");
const studentModel = require("../Database/studentModel");
const studentsAuth = require("../middleware/studentAuth");
const teacherModel = require("../Database/teacherModel");
const teacherAuth = require("../middleware/teacherAuth");
const multer = require("multer");

// storage for literature review
var literatureReviewStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in multer ....................");
    console.log("multer file is ", file);
    cb(
      null,
      "D:/Node  JS Projects/Students Project Management Software/Backend/public/literatureReview"
    );
  },
  filename: function (req, file, cb) {
    cb(null, "_" + file.originalname);
  },
});

const uploadLiteratureReview = multer({
  storage: literatureReviewStorage,
}).single("literatureReview");

// storage for project report
var projectReportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in multer ....................");
    console.log("multer file is ", file);
    cb(
      null,
      "D:/Node  JS Projects/Students Project Management Software/Backend/public/report"
    );
  },
  filename: function (req, file, cb) {
    cb(null, "_" + file.originalname);
  },
});

const uploadProjectReport = multer({ storage: projectReportStorage }).single(
  "report"
);

// storage for project ppt
var projectPPTStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in multer ....................");
    console.log("multer file is ", file);
    cb(
      null,
      "D:/Node  JS Projects/Students Project Management Software/Backend/public/ppt"
    );
  },
  filename: function (req, file, cb) {
    cb(null, "_" + file.originalname);
  },
});

const uploadProjectPPT = multer({ storage: projectPPTStorage }).single("ppt");

// STUDENTS PART **************************************
const addProject = async (req, res) => {
  console.log("in add project");
  console.log("req.body is ", req.body);
  const title = req.body.title;
  const abstract = req.body.abstract;
  const projectHead = req.body.projectHead;
  const subject = req.body.subject;
  const studentId = req.body.studentId;
  let groupMembersIds = [];

  try {
    let student = await studentModel.findOne({ _id: studentId });
    if (!student || !student.position === "student") {
      console.log("invalid student", student);
      return res.send({
        status: "failed",
        msg: "Server error! Provide Valid data ",
      });
    }
  } catch (error) {
    console.log("error while finding student");
    return res.send({
      status: "failed",
      msg: "Server error! Provide valid data",
    });
  }

  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: projectHead });
    if (!teacher) {
      console.log("teacher not found");
      return res.send({
        status: "failed",
        msg: "Provided Teachers email ID is wrong",
      });
    }
  } catch (error) {
    console.log("error while finding teacher ", error);
    return res.send({ status: "failed", msg: "Server error! Try again later" });
  }

  const projectSchema = joi.object({
    title: joi.string().trim().min(10).required(),
    abstract: joi.string().trim().min(10).required(),
    subject: joi.string().min(3).required(),
    projectHead: joi.string().email().required(),
    isGroupProject: joi.boolean().required(),
    groupMembers: joi.array().min(1).max(6).required(),
    sem: joi.number().max(2).min(1),
  });
  const { error } = projectSchema.validate({
    title: req.body.title,
    abstract: req.body.abstract,
    subject: req.body.subject.value,
    projectHead: req.body.projectHead,
    isGroupProject: req.body.isGroupProject,
    groupMembers: req.body.groupMembers,
    sem: req.body.sem,
  });

  if (error) {
    console.log("error in validating data in joi ");
    console.log(error);
    return res.send({ status: "failed", msg: error });
  }

  for (let index = 0; index < req.body.groupMembers.length; index++) {
    try {
      const student = await studentModel.findOne({
        email: req.body.groupMembers[index],
      });
      if (!student) {
        console.log("unable to find student in loop");
        return res.send({ status: "failed", msg: "Provided Email is invalid" });
      } else {
        groupMembersIds.push(student._id);
      }
    } catch (error) {
      console.log("error while finding student");
      return res.send({ status: "failed", msg: "Provided email is invalid" });
    }
  }
  console.log("members ", groupMembersIds);

  const project = new projectModel({
    title,
    abstract,
    subject: subject.value,
    projectHead: teacher._id,
    students: groupMembersIds,
    isGroupProject: req.body.isGroupProject,
    sem: req.body.sem,
  });

  project.save((err) => {
    if (err) {
      console.log("error while saving project", err);
      return res.send({
        status: "failed",
        msg: "Server error while saving project. Please try again",
      });
    }
    console.log("project added");
    return res.send({ status: "success", msg: "Project added" });
  });
};

// get all students pending projects
const getAllStudentsPendingProjects = async (req, res) => {
  console.log("in students");
  try {
    const student = await studentModel.findOne({ _id: req.query.studentId });
    if (!student) {
      console.log("wrong student id");
      return res.send({ status: "failed", msg: "Invalid Student" });
    }
  } catch (error) {
    console.log("error in student id");
    return res.send({
      status: "failed",
      msg: "Invalid Student, Something is fishy here",
    });
  }
  try {
    const projects = await projectModel.find({
      studentId: req.query.studentId,
    });
    if (!projects) {
      console.log("unable to find projects");
      return res.send({ status: "failed", msg: "No pending projects found" });
    }
    console.log("pending projects **************");
    console.log(projects);
    return res.send({ status: "success", projects });
  } catch (error) {
    console.log("error in finding projects***********");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Unable to find pending projects",
    });
  }
};

// get all students approved projects
const getAllStudentsApprovedProjects = async (req, res) => {
  console.log("in get all approved projects");
  try {
    const student = await studentModel.findOne({ _id: req.query.studentId });
    if (!student) {
      console.log("student not found");
      return res.send({ status: "failed", msg: "Invalid Student" });
    }
  } catch (error) {
    console.log("error in student id");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Invalid Student. Something is wrong. Try again later",
    });
  }

  try {
    const projects = await projectModel
      .find({ students: req.query.studentId, isApproved: true })
      .populate("students");
    if (!projects) {
      console.log("no projects found");
      return res.send({ status: "failed", msg: "No projects found" });
    }
    console.log("projects found", projects);
    return res.send({ status: "success", projects });
  } catch (error) {
    console.log("error while finding projects");
    return res.send({ status: "failed", msg: "Unable to find projects" });
  }
};

// add task
const addTask = async (req, res) => {
  console.log("in add task");
  console.log("data ", req.body);
  if (!req.body.task) {
    console.log("task not found");
    return res.send({ status: "failed", msg: "Provide task to add" });
  }
  let project;
  try {
    project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Invalid project. Try again with valid project",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    return res.send({ status: "failed", msg: "Invalid project" });
  }

  try {
    const updatedProject = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      {
        $set: {
          tasks: project.tasks
            ? [...project.tasks, { task: req.body.task }]
            : [{ task: req.body.task }],
        },
      },
      { new: true }
    );
    if (!updatedProject) {
      console.log("not updated");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to add task. Try again later",
      });
    }
    console.log("task added");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while updating");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong. Try again later",
    });
  }
};

// upload project ppt
const uploadPPT = async (req, res) => {
  console.log("In upload ppt");
  if (!req.file) {
    console.log("file is not attached");
    return res.send({ status: "failed", msg: "Please attach valid ppt " });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("invalid project id");
      return res.send({ status: "failed", msg: "Invalid project" });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      { $set: { ppt: req.file.filename } }
    );
    if (!project) {
      console.log("not uploaded");
      return res.send({ status: "failed", msg: "Unable to upload ppt" });
    }
    console.log("uploaded");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while uploading");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};

// upload literature review
const literatureReview = async (req, res) => {
  console.log("In lit review");
  if (!req.file) {
    console.log("file is not attached");
    return res.send({
      status: "failed",
      msg: "Please attach valid literature review ",
    });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("invalid project id");
      return res.send({ status: "failed", msg: "Invalid project" });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      { $set: { literatureReview: req.file.filename } }
    );
    if (!project) {
      console.log("not uploaded");
      return res.send({
        status: "failed",
        msg: "Unable to upload literature review",
      });
    }
    console.log("uploaded");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while uploading");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};
// upload project report
const uploadReport = async (req, res) => {
  console.log("In report ppt");
  if (!req.file) {
    console.log("file is not attached");
    return res.send({ status: "failed", msg: "Please attach valid ppt " });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("invalid project id");
      return res.send({ status: "failed", msg: "Invalid project" });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      { $set: { report: req.file.filename } }
    );
    if (!project) {
      console.log("not uploaded");
      return res.send({ status: "failed", msg: "Unable to upload report" });
    }
    console.log("uploaded");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while uploading");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};

// update task
const updateTask = async (req, res) => {
  console.log("In update task");
  console.log("req.body ", req.body);
  if (req.body.task && req.body.task.isCompleted) {
    console.log("task is approved/complete so can not edit it");
    return res.send({
      status: "failed",
      msg: "Task is already approved. So can not edit it now.",
    });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Unable to find project. Invalid Project",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    return res.send({
      status: "failed",
      msg: "Something is wrong. Invalid Project. Try again later",
    });
  }

  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
      "task.isCompleted": false,
    });
    if (!task) {
      console.log("unable to find task");
      return res.send({
        status: "failed",
        msg: "Unable to find task. Something is wrong",
      });
    }
  } catch (error) {
    console.log("invalid task id");
    return res.send({ status: "failed", msg: "Invalid task. Try again later" });
  }

  try {
    const updateTask = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId, "tasks._id": req.body.taskId },
      { $set: { "tasks.$.task": req.body.task } },
      { new: true }
    );
    if (!updateTask) {
      console.log("task not updated");
      return res.send({
        status: "failed",
        msg: "Unable to update task. Try again later",
      });
    }
    console.log("task updated");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while updating");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong while updating task. Try again later",
    });
  }
};

// TEACHERS PART *****************************

// get all pending projects
const getAllPendingProjects = async (req, res) => {
  console.log("getting all pending projects");
  try {
    const teacher = await teacherModel.findOne({ _id: req.query.teacherId });
    if (!teacher) {
      console.log("teacher not found");
      return res.send({ status: "failed", msg: "Invalid Teacher Id" });
    }
  } catch (error) {
    console.log("error while finding teacher", error);
    return res.send({ status: "failed", msg: "Invalid Teacher Id" });
  }

  const allProjects = await projectModel
    .find({ isApproved: false, projectHead: req.query.teacherId })
    .populate("students");
  console.log("all projects ", allProjects);
  res.send({ status: "success", allPendingProjects: allProjects });
};
// get all approved projects
const getAllApprovedProjects = async (req, res) => {
  console.log("getting all approved projects");
  try {
    const teacher = await teacherModel.findOne({ _id: req.query.teacherId });
    if (!teacher) {
      console.log("teacher not found");
      return res.send({ status: "failed", msg: "Invalid Teacher Id" });
    }
  } catch (error) {
    console.log("error while finding teacher", error);
    return res.send({ status: "failed", msg: "Invalid Teacher Id" });
  }

  const allProjects = await projectModel
    .find({ isApproved: true, projectHead: req.query.teacherId })
    .populate("students");
  console.log("all projects ", allProjects);
  res.send({ status: "success", allApprovedProjects: allProjects });
};

// add teachers remark

const addRemark = async (req, res) => {
  console.log("In add remark");

  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Project Id is invalid",
      });
    }
  } catch (error) {
    console.log("invalid project id");
    return res.send({
      status: "failed",
      msg: "Server Error. Project Id is invalid.",
    });
  }

  const project = await projectModel.findOneAndUpdate(
    { _id: req.body.projectId },
    {
      $set: {
        comments: req.body.remark,
      },
    },
    { new: true }
  );

  if (!project) {
    console.log("error while updating project");
    return res.send({
      status: "failed",
      msg: "Server Error, Can not add comment",
    });
  }

  return res.send({ status: "success" });
};

// approve project
const approveProject = async (req, res) => {
  console.log("In approve project part");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Couldn't find the project",
      });
    }
  } catch (error) {
    console.log("invalid project id");
    return res.send({
      status: "failed",
      msg: "Provided project is invalid, Try again later.",
    });
  }
  const project = await projectModel.findOneAndUpdate(
    { _id: req.body.projectId },
    {
      $set: {
        isApproved: true,
      },
    },
    { new: true }
  );
  if (!project) {
    console.log("Unable to update project status");
    return res.send({
      status: "failed",
      msg: "Server Error. Unable to update project status",
    });
  }

  console.log("project added");
  return res.send({ status: "success", msg: "Project updated" });
};

// add task remark
const addTaskRemark = async (req, res) => {
  console.log("In add task remark");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Project. Something is wrong",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Project is invalid. Try again later",
    });
  }
  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
    });
    if (!task) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Task. Something is wrong",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Task is invalid. Try again later",
    });
  }
  try {
    const updateTask = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId, "tasks._id": req.body.taskId },
      { $set: { "tasks.$.remark": req.body.remark } }
    );
    if (!updateTask) {
      console.log("error while updating");
      return res.send({
        status: "failed",
        msg: "Unable to update task status. Try again later",
      });
    }
    console.log("task updated");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while updating");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server error while updating task. Try again later.",
    });
  }
};

// Change task status
const updateTaskStatus = async (req, res) => {
  console.log("In update task status");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Project. Something is wrong",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Project is invalid. Try again later",
    });
  }
  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
    });
    if (!task) {
      console.log("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Task. Something is wrong",
      });
    }
  } catch (error) {
    console.log("error while finding project");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Task is invalid. Try again later",
    });
  }
  try {
    const updateTask = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId, "tasks._id": req.body.taskId },
      { $set: { "tasks.$.isCompleted": true } }
    );
    if (!updateTask) {
      console.log("error while updating");
      return res.send({
        status: "failed",
        msg: "Unable to update task status. Try again later",
      });
    }
    console.log("task updated");
    return res.send({ status: "success" });
  } catch (error) {
    console.log("error while updating");
    console.log(error);
    return res.send({
      status: "failed",
      msg: "Server error while updating task. Try again later.",
    });
  }
};

// Query part
const filterStudents = async (req, res) => {
  console.log("filtering students");
  const year = ["FY", "SY", "TY", "FINAL"];
  const branch = ["ET", "CS", "IT", "MECH", "INST", "CH"];
  const div = ["A", "B", "C", "D", "E"];
  if(!req.query.year || !req.query.branch || !req.query.div || !year.includes(req.query.year) || !div.includes(req.query.div) || !branch.includes(req.query.branch)) {
    console.log("div or branch not found");
    return res.send({status : "failed", msg : "Please select requested fields. Do not send incomplete data"})
  }
  // try {
  //   const projects = await 
  // } catch (error) {
    
  // }
};

//students routes
router.post("/add", studentsAuth, addProject);
router.get(
  "/students/get-all-pending-projects",
  studentsAuth,
  getAllStudentsPendingProjects
);
router.get(
  "/get-students-approved-projects",
  studentsAuth,
  getAllStudentsApprovedProjects
);
router.patch("/add-task", studentsAuth, addTask);
router.patch("/update-task", studentsAuth, updateTask);
router.patch("/upload-ppt", studentsAuth, uploadProjectPPT, uploadPPT);
router.patch("/upload-report", studentsAuth, uploadProjectReport, uploadReport);
router.patch(
  "/upload-literature-review",
  studentsAuth,
  uploadLiteratureReview,
  literatureReview
);

// teachers routes
router.get("/get-all-pending-projects", teacherAuth, getAllPendingProjects);
router.get("/get-all-approved-projects", teacherAuth, getAllApprovedProjects);
router.patch("/addRemark", teacherAuth, addRemark);
router.patch("/approve-project", teacherAuth, approveProject);
router.patch("/update-task-status", teacherAuth, updateTaskStatus);
router.patch("/add-task-remark", teacherAuth, addTaskRemark);

module.exports = router;
