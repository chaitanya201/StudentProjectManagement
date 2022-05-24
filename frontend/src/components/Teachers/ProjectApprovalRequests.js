import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import ClosingAlert from '../Auth/Alert';
import ShowAllPendingProjects from '../Projects/Teacher/ShowAllPendingProjects';

export default function ProjectApprovalRequests() {
    const [cookies] = useCookies()
    const [allPendingProjects, setAllPendingProjects] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);
    useEffect(() => {
        const getAllPendingProjects = async () => {
            try {
                const headers = {
                    authorization : "Bearer " + cookies.teacherToken
                }
                const response = await axios.get('http://localhost:5000/projects/get-all-pending-projects?teacherId=' + cookies.teacher._id, {headers})
                console.log("response is ", response);
                if(response.data.status === 'success') {
                    setAllPendingProjects(response.data.allPendingProjects)
                }
                else {
                    setAlertMsg(response.data.msg)
                }
            } catch (error) {
                setAlertMsg("Server Error! Try again later")
            }
        }
        getAllPendingProjects()
        
    }, []);
  return (
    <div>
        {
            alertMsg ? <ClosingAlert msg={alertMsg} alertColor={'red'} /> : <span></span>
        }

        {
            allPendingProjects && allPendingProjects.length !== 0 ? allPendingProjects.map((project) => {
                return (
                    <div key={project._id}>
                <ShowAllPendingProjects project={project} setAlertMsg={setAlertMsg} />
            </div>
                )
            }) : <div>No pending projects found</div>
        }

    </div>
  )
}
