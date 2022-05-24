import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ClosingAlert from "../Auth/Alert";
import ShowProjects from "../Projects/Students/ShowProjects";
import ViewTasksInTable from "../Projects/Students/ViewTasksInTable";
import ShowStudents from "./ShowStudents";
import TaskComponent from "./TaskComponent";

export default function AddTasks() {
  const [alertMsg, setAlertMsg] = useState(null);
  const [approvedProjects, setApprovedProjects] = useState(null);
  const [cookies] = useCookies();
  const [task, setTask] = useState("");
  const [clicked, setClicked] = useState(false);
  const [editButton, setEditButton] = useState(false);
  const [editTask, setEditTask] = useState("");
  const headers = {
    authorization: "Bearer " + cookies.token,
  };
  const getAllApprovedProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/projects/get-students-approved-projects?studentId=" +
          cookies.student._id,
        { headers }
      );
      if (response.data.status === "failed") {
        setAlertMsg(response.data.msg);
      } else {
        setApprovedProjects(response.data.projects);
      }
    } catch (error) {
      setAlertMsg("Server Error. Unable to get projects");
    }
  };
  useEffect(() => {
    getAllApprovedProjects();
  }, []);
  console.log("task is ", task);
  return (
    <div>
      {alertMsg ? <ClosingAlert msg={alertMsg} /> : <div></div>}

      {/* Show approved Projects */}
      {approvedProjects && approvedProjects.length !== 0 ? (
        <div>
          <div className="flex p-1 justify-between">
            <div>Title</div>
            <div>Abstract</div>

            <div>Subject</div>
            <div>Semester</div>
            <div>Name</div>
            <div>Email</div>
            <div>Task</div>
            <div>Action</div>
            <div>Status</div>
            <div>Remark</div>
          </div>

            <div className="justify-between p-1">
              {approvedProjects.map((project) => {
                return (
                  <div key={project._id} className="bg-green-400">
                    <ShowProjects project={project} check={true} />

                    <div>
                      {/* show previous tasks */}
                      {project.tasks && project.tasks.length !== 0 ? (
                        project.tasks.map((preTask, index) => {
                          return (
                            <ViewTasksInTable
                              project={project}
                              getAllApprovedProjects={getAllApprovedProjects}
                              setAlertMsg={setAlertMsg}
                              headers={headers}
                              task={preTask}
                              key={preTask._id}
                            />
                          );
                        })
                      ) : (
                        <div>No tasks found</div>
                      )}
                    </div>
                    <TaskComponent getAllApprovedProjects={getAllApprovedProjects} headers={headers} project={project} setAlertMsg={setAlertMsg} setClicked={setClicked} setTask={setTask} task={task} />
                    <div>
                      {/* <div>
                        {!clicked ? (
                          <button
                            onClick={() => {
                              setClicked((preState) => !preState);
                            }}
                          >
                            Add Task
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      {/* Add new tasks */}
                      {clicked ? (
                        <div></div>
                      ) : (
                        <div></div>
                      )} 
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      ) : (
        <div>No Projects Found</div>
      )}
    </div>
  );
}
