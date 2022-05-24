import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Registration";
import Home from "./components/Home";
import AddTasks from "./components/Students/AddTasks";
import CreateProject from "./components/Students/CreateProject";
import StudentNavbar from "./components/Students/Navbar";
import ShowDocumentsStudents from "./components/Students/ShowDocuments";
import StudentHome from "./components/Students/StudentHome";
import TeacherLogin from "./components/TeacherAuth/Login";
import TeacherRegister from "./components/TeacherAuth/Register";
import Navbar from "./components/Teachers/Navbar";
import ProjectApprovalRequests from "./components/Teachers/ProjectApprovalRequests";
import ShowApprovedProjects from "./components/Teachers/ShowApprovedProjects";
import ShowDocuments from "./components/Teachers/ShowDocuments";
import TeacherHome from "./components/Teachers/TeacherHome";
function App() {
  const [cookies] = useCookies();
  console.log(cookies);
  

  return (
    <BrowserRouter>
      {/* {cookies.student &&
        cookies.token &&
        cookies.student !== "undefined" &&
        cookies.token !== "undefined" && <StudentNavbar />
      } */}

      {/* {
        cookies.teacher && cookies.token && <Navbar />
      } */}
      <Routes>
        <Route path="/" element={<Home />}></Route>

        {/* Public Routes */}
        {/* Student's Routes */}

        <Route
          path="/register"
          element={
            !cookies.student && !cookies.token ? <Register /> : <StudentHome />
          }
        ></Route>
        <Route
          path="/login"
          element={
            (!cookies.student && !cookies.token) ||
            cookies.student === "undefined" ||
            cookies.token === "undefined" ? (
              <Login />
            ) : (
              <StudentHome />
            )
          }
        ></Route>

        {/* Teachers Routes */}
        <Route
          path="/teacher-register"
          element={
            !cookies.teacher && !cookies.teacherToken ? (
              <TeacherRegister />
            ) : (
              <TeacherHome />
            )
          }
        ></Route>
        <Route
          path="/teacher-login"
          element={
            !cookies.teacher && !cookies.teacherToken ? (
              <TeacherLogin />
            ) : (
              <TeacherHome />
            )
          }
        ></Route>

        {/* Protected Routes */}
        {/* Students Routes */}
        <Route path="/student/">
          <Route
            path="create-project"
            element={
              cookies.student && cookies.student.position === "student" ? (
                <CreateProject />
              ) : (
                <Login />
              )
            }
          ></Route>
          <Route
            path="add-task"
            element={
              cookies.student && cookies.student.position === "student" ? (
                <AddTasks />
              ) : (
                <Login />
              )
            }
          ></Route>
          <Route
            path="show-documents"
            element={
              cookies.student && cookies.student.position === "student" ? (
                <ShowDocumentsStudents />
              ) : (
                <Login />
              )
            }
          ></Route>
          <Route
            path="home"
            element={
              cookies.student && cookies.student.position === "student" ? (
                <StudentHome />
              ) : (
                <Login />
              )
            }
          ></Route>
        </Route>

        {/* Teachers Routes */}
        <Route path="/teacher/">
          <Route
            path="home"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <TeacherHome />
              ) : (
                <TeacherLogin />
              )
            }
          >
            {" "}
          </Route>
          <Route
            path="show-pending-projects"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ProjectApprovalRequests />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route>
          <Route
            path="show-approved-projects"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ShowApprovedProjects />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route>
          <Route
            path="show-documents"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ShowDocuments />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route>
          <Route path="*" element={<h1>Path not found</h1>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
