import axios from "axios";
import React from "react";

export default function TaskComponent({
  task,
  headers,
  setAlertMsg,
  setClicked,
  getAllApprovedProjects,
  project,
  setTask,
}) {
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (task.length < 4) return;

          try {
            const response = await axios.patch(
              "http://localhost:5000/projects/add-task",
              { task, projectId: project._id },
              { headers }
            );
            if (response.data.status !== "success") {
              setAlertMsg(response.data.msg);
              setClicked((preState) => !preState);
              getAllApprovedProjects();
            } else {
              setClicked((preState) => !preState);
              setTask('')
            }
          } catch (error) {
            setAlertMsg("Server Error. try again later");
          }
        }}
      >
        <div>
          <textarea
          value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
            placeholder="Add task"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <input type="submit" value={"Add"} />
        </div>
      </form>
    </div>
  );
}
