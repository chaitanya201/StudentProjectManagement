import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";

export default function SelectQuery({div, setDiv,sem, setSem,subject, setSubject,isApproved, setIsApproved,year, setYear, getAllApprovedProjects}) {
  
  const semester = [
    { label: "Semester 1", value: 1 },
    { label: "Semester 2", value: 2 },
  ];
  const subjects = [
    { value: "operatingSystem", label: "Operating System" },
    { value: "dataScience", label: "Data Science" },
    { value: "signalProcessing", label: "Signal Processing" },
    { value: "sdp", label: "SDP" },
    { value: "computerVision", label: "Computer Vision" },
  ];
  const years = [
    {
      label: 2022,
      value: 2022,
    },
    {
      label: 2023,
      value: 2023,
    },
    {
      label: 2024,
      value: 2024,
    },
    {
      label: 2025,
      value: 2025,
    },
    {
      label: 2026,
      value: 2026,
    },
    {
      label: 2027,
      value: 2027,
    },
    {
      label: 2028,
      value: 2028,
    },
    {
      label: 2029,
      value: 2029,
    },
    {
      label: 2030,
      value: 2030,
    },
  ];
  const division = [];

  const yr = ["FY", "SY", "TY", "FINAL"];
  const branch = ["ET", "CS", "IT", "MECH", "INST", "CH"];
  const divs = ["A", "B", "C", "D", "E"];
  
  for (const y in yr) {
    for (const b in branch) {
      for (const d in divs) {
        division.push({label : yr[y]+branch[b]+divs[d], value : yr[y]+ " " +  branch[b]+ " "+divs[d]})
      }
    }
  }

  const approved = [{label : "Approved" , value : true }, {label : "Not Approved", value : false}]






  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        getAllApprovedProjects()
      }}>
      <div>
      <div>
        <Select
          options={semester}
          value={sem}
          onChange={(e) => {
            setSem({ label: e.label, value: e.value });
          }}
        ></Select>
      </div>
      <div>
        <Select
        value={subject}
          options={subjects}
          onChange={(e) => {
            setSubject({ label: e.label, value: e.value });
          }}
        ></Select>
      </div>
      <div>
        <Select
          options={years}
          value={year}
          onChange={(e) => {
            setYear({ label: e.label, value: e.value });
          }}
        ></Select>
      </div>
      
      <div>
        <Select
          options={division}
          value={div}
          onChange={(e) => {
            setDiv({ label: e.label, value: e.value });
          }}
        ></Select>
      </div>
      <div>
        <Select
          options={approved}
          value={isApproved}
          onChange={(e) => {
            setIsApproved({ label: e.label, value: e.value });
          }}
        ></Select>
      </div>
      <div>
        <input type="submit" value={"Show Result"} />
      </div>
    </div>

      </form>
    </div>
  );
}
