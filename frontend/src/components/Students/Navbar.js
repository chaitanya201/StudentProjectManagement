import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [cookies,removeCookie] = useCookies(['studentCookies']);
  console.log(cookies.student);
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const handleNav = () => {
    console.log("clicked")
    setNav(!nav)
  }
  return (
    <>
    <div className="flex space-x-10  h-[10%]  ">
      <div className="flex justify-between  px-2 py-2">
        <div className="justify-between h-24  ">
          <ul className=" hidden  w-full md:flex bg-purple-500  ">
            <li className="p-4">
            <Link to={'/student/home'}>{cookies.student.name}</Link>
            </li>
            <li className="p-4">
            <Link to={"/student/create-project"}  >Create Project</Link>
            </li>
            <li className="p-4">
            <Link to={"/student/add-task"}>Add Task</Link>
            </li>
            <li className="p-4">
            <Link to={"/student/show-documents"}>Show Documents</Link>
            </li>
            <li className="p-4">
            <button
            onClick={() => {
              removeCookie('student'); 
              removeCookie("token");
              localStorage.clear()
              navigate("/login");
            }}
          >
            LogOut
          </button>
            </li>
          </ul>
        </div>
        
        <div className={!nav ? 'fixed mt-10 justify-between bg-green-300 left-0 h-[100%] w-[60%] py-3 ease-in-out duration-500' : 'fixed left-[-100%]'}>
          <ul className="flex-col   ">
            <li className="p-4 border-b">
              <Link to={'/student/home'} onClick={handleNav}>{cookies.student.name}</Link>
            </li>
            <li className="p-4 border-b">
            <Link to={"/student/create-project"} onClick={handleNav}>Create Project</Link>
            </li>
            <li className="p-4 border-b">
            <Link to={"/student/add-task"} onClick={handleNav}>Add Task</Link>
            </li>
            <li className="p-4 border-b">
            <Link to={"/student/show-documents"} onClick={handleNav}>Show Documents</Link>
            </li>
            <li className="p-4 border-b">
            <button
            onClick={() => {
              removeCookie('student'); 
              removeCookie("token");
              localStorage.clear()
              navigate("/login");
              handleNav()
            }}
          >
            LogOut
          </button>
            </li>
          </ul>
        </div>
        <div   className=' px-2 py-2  md:hidden '>
          {
            nav ? <AiOutlineMenu size={20} onClick={handleNav}/> : <AiOutlineClose size={20} onClick={handleNav}  />
          }
        </div>
        
      </div>
    </div>
      
      <ul className="flex space-x-2">
        <li>
           <br />
        </li>
        <li>
          
        </li>

        <li>
          
        </li>
        <li>
          
        </li>
      </ul>
    </>
  );
}
