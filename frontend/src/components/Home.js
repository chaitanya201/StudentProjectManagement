import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

export default function Home() {
  const [nav, setNav] = useState(true);
  const handleNav = () => {
    console.log("clicked")
    setNav(!nav)
  }
  return (
    <div>
      <div className="flex justify-between  px-2 py-2">
        <div className="justify-between h-24  ">
          <ul className=" hidden  w-full md:flex bg-purple-500  ">
            <li className="p-4">
              <Link to={"/register"}>Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/login"}>Sign In</Link>
            </li>
            <li className="p-4">
              <Link to={"/teacher-register"}>Teacher Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/teacher-login"}>Teacher Sign In</Link>
            </li>
          </ul>
        </div>
        
        <div className={!nav ? 'fixed mt-10 justify-between bg-green-300 left-0 h-[100%] w-[60%] py-3 ease-in-out duration-500' : 'fixed left-[-100%]'}>
          <ul className="flex-col   ">
            <li className="p-4 border-b">
              <Link to={"/register"}>Sign Up</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/login"}>Sign In</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/teacher-register"}>Teacher Sign Up</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/teacher-login"}>Teacher Sign In</Link>
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
  );
}
