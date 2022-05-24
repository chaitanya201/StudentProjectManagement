import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";
import ClosingAlert from "../Auth/Alert";
import AddGroupMembers from "./AddGroupMembers";
export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [sem, setSem] = useState({ value: 1, label: "Sem 1" });
  const [projectHead, setProjectHead] = useState("");
  const [abstract, setAbstract] = useState("");
  const [subject, setSubject] = useState({
    value: "operatingSystem",
    label: "Operating System",
  });
  const [alertMsg, setAlertMsg] = useState(null);
  // const [project.totalNoOfGroupMembers, project.setTotalNoOfGroupMembers] = useState(2);
  const [validTitle, setValidTitle] = useState(true);
  // const [continueButton, setContinueButton] = useState(false);
  const [validAbstract, setValidAbstract] = useState(true);
  const [alertColor, setAlertColor] = useState("red");
  // const [groupMembersEmail, setGroupMembersEmail] = useState([]);
  const [showGroupProject, setShowGroupProject] = useState(false);
  const [cookie] = useCookies();
  const options = [
    { value: "operatingSystem", label: "Operating System" },
    { value: "dataScience", label: "Data Science" },
    { value: "signalProcessing", label: "Signal Processing" },
    { value: "sdp", label: "SDP" },
    { value: "computerVision", label: "Computer Vision" },
  ];
  console.log("subject is ", subject);
  console.log("show gp ", showGroupProject);
  const titleChange = (e) => {
    if (e.target.value.trim().length < 5) {
      setValidTitle(false);
      setAlertMsg("Title should be at least 5 characters");
      return;
    }

    setValidTitle(true);
    setAlertMsg(null);
    setTitle(e.target.value.trim());
  };

  const [teamMate1, setTeamMate1] = useState("");
  const [teamMate2, setTeamMate2] = useState("");
  const [teamMate3, setTeamMate3] = useState("");
  const [teamMate4, setTeamMate4] = useState("");
  const [teamMate5, setTeamMate5] = useState("");
  console.log("show gp ", showGroupProject);
  let isGroupProject = false;

  // form submit function
  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log("in form submit");
    if (!validAbstract || !validTitle) return;

    const project = {
      title,
      abstract,
      subject,
      projectHead,
      studentId: cookie.student._id,
      sem: sem.value,
    };

    project.groupMembers = [cookie.student.email];
    if (teamMate1.length !== 0) {
      isGroupProject = true;
      if (!project.groupMembers.includes(teamMate1))
        project.groupMembers.push(teamMate1);
      if (teamMate2.length !== 0 && !project.groupMembers.includes(teamMate2))
        project.groupMembers.push(teamMate2);
      if (teamMate3.length !== 0 && !project.groupMembers.includes(teamMate3))
        project.groupMembers.push(teamMate3);
      if (teamMate4.length !== 0 && !project.groupMembers.includes(teamMate4))
        project.groupMembers.push(teamMate4);
      if (teamMate5.length !== 0 && !project.groupMembers.includes(teamMate5))
        project.groupMembers.push(teamMate5);
    }

    project.isGroupProject = isGroupProject;
    console.log("gup me0", project.groupMembers);

    const headers = {
      authorization: `Bearer ${cookie.token}`,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/projects/add",
        project,
        { headers }
      );
      if (response.data.status === "success") {
        setAlertMsg("Project Created Successfully");
        setAlertColor("green");
      } else {
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      }
    } catch (error) {
      console.log("error in server");
      setAlertMsg("Server Error");
    }
  };

  console.log("temate type ", typeof teamMate1);
  return (
    <div className=" bg-slate-50    ">
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alertColor} />
      ) : (
        <div></div>
      )}
      <div className=" pb-10 py-2 px-10 ">
        <form method="post" onSubmit={onFormSubmit} className=' bg-slate-100 border-double shadow-lg rounded-lg relative  max-w-[100%] '>
          <div className='p-3'>
            <input
            className="rounded-md focus:ring focus:outline-none focus:outline-blue-600 focus:rounded text-center block w-full"
              type="text"
              required
              placeholder="title"
              onChange={titleChange}
            />
          </div>
          <div className='p-3'>
            <textarea
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600"
              required
              placeholder="Abstract  min 100 words"
              cols="50"
              rows="10"
              onChange={(e) => {
                if (e.target.value.trim().split(" ").length < 5) {
                  setValidAbstract(false);
                  setAlertMsg("less words");
                  return;
                }
                setValidAbstract(true);
                setAlertMsg(null);
                setAbstract(e.target.value.trim());
              }}
            ></textarea>
          </div>
          <div className='p-3'>
            <Select
              value={subject}
              options={options}
              onChange={(e) => {
                setSubject({ label: e.label, value: e.value });
              }}
            ></Select>
          </div>
          <div className='p-3'>
            <Select
              value={sem}
              onChange={(e) => {
                setSem({ label: e.label, value: e.value });
              }}
              options={[
                { value: 1, label: "Sem 1" },
                { value: 2, label: "Sem 2" },
              ]}
            />
          </div>
          <div>
            <div>
              {/* {!showGroupProject ? (
              <div>
                <button onClick={() => {
                    console.log("this function has called.")
                    setShowGroupProject((preState) => !preState)
                }}>
                  IsGroup project
                </button>
              </div>
            ) : (
              <div>
                {!continueButton ? (
                  <div>
                    <input
                      type="number"
                      value={project.totalNoOfGroupMembers}
                      placeholder="Enter total no of Group members"
                      onChange={(e) => {
                        project.setTotalNoOfGroupMembers(e.target.valueAsNumber);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        setContinueButton(!continueButton);
                      }}
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div>
                    {project.totalNoOfGroupMembers !== 1
                      ? [...Array(project.totalNoOfGroupMembers)].map((val) => {
                          return (
                            <div key={val}>
                              <project.AddGroupMembers
                                project.setGroupMembersEmail={project.setGroupMembersEmail}
                                project.groupMembersEmail={project.groupMembersEmail}
                              />
                            </div>
                          );
                        })
                      : setShowGroupProject((preState) => !preState)}
                    <div>
                      <button
                        onClick={(e) => {
                          setContinueButton(!continueButton);
                        }}
                      >
                        back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )} */}
            </div>
            <div className='p-3'>
              {!showGroupProject ? (
                <button
                  onClick={() => {
                    setShowGroupProject((preState) => !preState);
                  }}
                >
                  IsGroupProject
                </button>
              ) : (
                <div className='p-3'>
                  <div className='p-3'>
                    <input
                      type="email"
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

                      placeholder="Enter Team Mate no 1 Email Id"
                      required
                      onChange={(e) => {
                        setTeamMate1(e.target.value);
                      }}
                    />
                  </div>
                  <div className='p-3'>
                    <input
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

                      type="email"
                      placeholder="Enter Team Mate no 2 Email Id"
                      onChange={(e) => {
                        setTeamMate2(e.target.value);
                      }}
                    />
                  </div>
                  <div className='p-3'>
                    <input
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

                      type="email"
                      placeholder="Enter Team Mate no 3 Email Id"
                      onChange={(e) => {
                        setTeamMate3(e.target.value);
                      }}
                    />
                  </div>
                  <div className='p-3'>
                    <input
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

                      type="email"
                      placeholder="Enter Team Mate no 4 Email Id"
                      onChange={(e) => {
                        setTeamMate4(e.target.value);
                      }}
                    />
                  </div>
                  <div className='p-3'>
                    <input
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

                      type="email"
                      placeholder="Enter Team Mate no 5 Email Id"
                      onChange={(e) => {
                        setTeamMate5(e.target.value);
                      }}
                    />
                  </div>
                  <div className='p-3'>
                    <button
                      onClick={() => {
                        setShowGroupProject((preState) => !preState);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='p-3'>
            <input
            className="px-2 border rounded-lg focus:outline-none focus:outline-blue-600 w-full"

              type="email"
              required
              placeholder="Teachers Email"
              onChange={(e) => {
                setProjectHead(e.target.value);
              }}
            />
          </div>
          <div className='p-3'>
            <input type="submit" value={"Create Project"} />
          </div>
        </form>
      </div>
    </div>
  );
}
