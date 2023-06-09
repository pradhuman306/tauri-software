import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { writeTextFile, readTextFile,BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";

export default function Set() {
  const navigate = useNavigate();

  const [addFormData, setAddFormData] = useState({
  });
  const addFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(addFormData);
    addNote();
    navigate('/customer');
  };

  const [setData, updateSetdata] = useState([]);

  const updateData = async (data) => {
    updateSetdata([...data]);
    await writeTextFile({ path: 'set.json', contents: JSON.stringify(data) }, { dir: BaseDirectory.Resource });
  };

  const addNote = async () => {
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"+ (currentdate.getMonth()+1)+ "/"+ currentdate.getFullYear() + " " + currentdate.getHours() + ":"+ currentdate.getMinutes() + ":"+ currentdate.getSeconds();
    addFormData.date = datetime;
    addFormData.id= Date.now();
    updateData([{ ...addFormData }, ...setData]);
  };
  
  useEffect(() => {
    const getdataFromFile = async () => {
      try {
        const myfiledata = await readTextFile('set.json', { dir: BaseDirectory.Resource });
        const mydata = JSON.parse(myfiledata);
        updateSetdata(mydata);
        console.log('list rendered');
      } catch (error) {
    await writeTextFile({ path: 'set.json', contents: JSON.stringify(setData) }, { dir: BaseDirectory.Resource });
    getdataFromFile();
        console.log(error);
      }
    };
    getdataFromFile();
  },[]);


  return (
    <>
    <Navbar/>
    <main>
    <div className="container">
      <div className="add-customer-popup">
        <div className="add-customer-header">
          <h4>Add new Set</h4>
        </div>
        <div className="customer-body">
        <form onSubmit={submitHandler}>
          <div className="add-customer-body">
            <div className="add-suctomer-right">
              <div className="customer-set">
                <label htmlFor="set">Set</label>
                <input type="number" name="set" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="commission">Commision</label>
                <input type="number" name="commission" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="pana">Pana</label>
                <input type="number" name="pana" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="partnership">Partmership</label>
                <input type="number" name="partnership" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="multiple">Multiple</label>
                <input type="number" name="multiple" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="sp">SP</label>
                <input type="number" name="sp" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="dp">DP</label>
                <input type="number" name="dp" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="jodi">JODI</label>
                <input type="number" name="jodi" onChange={addFormHandler} required/>
              </div>
              <div>
                <label htmlFor="tp">TP</label>
                <input type="number" name="tp" onChange={addFormHandler} required/>
              </div>
            </div>
          </div>
          <div className="add-button">
            <button type="submit">
              Add Set
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </main>
    </>
  );
}
