import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import delet from './assets/delet.svg';
import edit from './assets/edit.svg';
import { toast } from 'react-toastify';


export default function Set() {
  const navigate = useNavigate();

  const [addFormData, setAddFormData] = useState({});
  const [editSet, setEditSet] = useState({});
  const [deleteSetID, setDeleteSetID] = useState("");
  const addFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const handleEditSet = (id, param) => {
    let tmp = setData.filter((item) => item.id === id)
    setEditSet(tmp[0]);
    modalOpen(param);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    addNote();
    navigate("/customer");
    toast.success('Set added successfully');
    modalOpen('addSet');
  };

  const editFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData1 = { ...editSet };
    newFormData1[fieldName] = fieldValue;
    setEditSet(newFormData1);
  };

  const updateSet = async () => {
    let tmp = setData.map((obj) => {
      if (obj.id == editSet.id) {
        return {
          ...editSet
        };
      }
      //else return the object
      return { ...obj };
    });
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(tmp) },
      { dir: BaseDirectory.Resource }
    );
    toast.success('Set updated successfully');
    getdataFromFile();
  };
  const updateHandler = (event) => {
    updateSet();
    event.preventDefault();
  
    modalOpen('editSet');
  };

  const [setData, updateSetdata] = useState([]);
  const [isVisible, setIsVisible] = useState({ addSet: false, editSet: false, deleteSet: false });
  const modalOpen = (id) => {
    let isVisibleTemp = { ...isVisible };
    if (isVisibleTemp[id]) {
      isVisibleTemp[id] = false;
      setIsVisible(isVisibleTemp);
    } else {
      isVisibleTemp[id] = true;
      setIsVisible(isVisibleTemp);
    }
  };

  const modalAction = () => {
    setIsVisible(false);
  };
  const updateData = async (data) => {
    updateSetdata([...data]);
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(data) },
      { dir: BaseDirectory.Resource }
    );
  };

  const deletehandler = async (id) => {
    let tmp = setData.filter(function (a) {
      return a.id != id;
    });
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(tmp) },
      { dir: BaseDirectory.Resource }
    );
    getdataFromFile();
    toast.success('Set deleted successfully');
    modalOpen('deleteSet');
  }

  const addNote = async () => {
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    // addFormData.date = datetime;
    addFormData.date = new Date(Date.now());
    addFormData.id = Date.now();
    updateData([{ ...addFormData }, ...setData]);
  };
  const getdataFromFile = async () => {
    try {
      const myfiledata = await readTextFile("set.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      updateSetdata(mydata);
    } catch (error) {
      await writeTextFile(
        { path: "set.json", contents: JSON.stringify(setData) },
        { dir: BaseDirectory.Resource }
      );
      getdataFromFile();
      console.log(error);
    }
  };
  useEffect(() => {

    getdataFromFile();
  }, []);

  return (
    <>
      <main>
        <div className="container">
        <div className="customer-main-sec">
          <div className="set-list">
          <div className="add-button">
                  <button type="button" onClick={()=> modalOpen('addSet')}>Add New Set</button>
                </div>
          <table>
                <thead>
                  <tr>
                    <th style={{minWidth:70+'px'}}>Set</th>
                    <th style={{minWidth:120+'px'}}>Commision</th>
                    <th style={{minWidth:80+'px'}}>Pana</th>
                    <th style={{minWidth:140+'px'}}>Partmership</th>
                    <th style={{minWidth:120+'px'}}>Multiple</th>
                    <th style={{minWidth:80+'px'}}>SP</th>
                    <th style={{minWidth:80+'px'}}>DP</th>
                    <th style={{minWidth:80+'px'}}>JODI</th>
                    <th style={{minWidth:80+'px'}}>TP</th>
                    <th style={{minWidth:100+'px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {setData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.set}</td>
                      <td>{data.commisiom}</td>   
                      <td>{data.pana}</td>     
                      <td>{data.partmership}</td>
                      <td>{data.multiple}</td>
                      <td>{data.sp}</td>        
                      <td>{data.dp}</td>
                      <td>{data.jodi}</td>
                      <td>{data.TP}</td> 
                      <td>
                        <div className="action-btns">
                        <button onClick={() => handleEditSet(data.id, 'editSet')}>
                          <img src={edit} alt="" />
                          </button>
                          <button onClick={() => {
                          modalOpen('deleteSet')
                          setDeleteSetID(data.id)
                        }
                        }>
                            <img src={delet} alt="" />
                          </button>
                        </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="set-add-frame">
            <div className="add-set-popup">
            <div className="add-set-header">
              <h4>Add new Set</h4>
             
            </div>
            <div className="customer-body">
              <form onSubmit={submitHandler}>
              <div className="add-suctomer-right">
                    <div className="customer-set">
                      <label htmlFor="set">Set</label>
                      <input
                        type="number"
                        step="any"
                        name="set"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="commission">Commision</label>
                      <input
                        type="number"
                        step="any"
                        name="commission"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pana">Pana</label>
                      <input
                        type="number"
                        step="any"
                        name="pana"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="partnership">Partmership</label>
                      <input
                        type="number"
                        step="any"
                        name="partnership"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="multiple">Multiple</label>
                      <input
                        type="number"
                        step="any"
                        name="multiple"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sp">SP</label>
                      <input
                        type="number"
                        step="any"
                        name="sp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dp">DP</label>
                      <input
                        type="number"
                        step="any"
                        name="dp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="jodi">JODI</label>
                      <input
                        type="number"
                        step="any"
                        name="jodi"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="tp">TP</label>
                      <input
                        type="number"
                        step="any"
                        name="tp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                  </div>
                <div className="add-button">
                  <button type="submit">Add Set</button>
                </div>
              </form>
            </div>
          </div>
            </div> */}
          </div>
          <div className={isVisible.addSet ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('addSet')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('addSet')}>Add Set</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
              <div className="">
              <div className="add-set-popup">
           
            <div className="customer-body">
              <form onSubmit={submitHandler}>
              <div className="add-suctomer-right">
                    <div className="customer-set">
                      <label htmlFor="set">Set</label>
                      <input
                        type="number"
                        step="any"
                        name="set"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="commission">Commision</label>
                      <input
                        type="number"
                        step="any"
                        name="commission"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pana">Pana</label>
                      <input
                        type="number"
                        step="any"
                        name="pana"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="partnership">Partmership</label>
                      <input
                        type="number"
                        step="any"
                        name="partnership"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="multiple">Multiple</label>
                      <input
                        type="number"
                        step="any"
                        name="multiple"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sp">SP</label>
                      <input
                        type="number"
                        step="any"
                        name="sp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dp">DP</label>
                      <input
                        type="number"
                        step="any"
                        name="dp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="jodi">JODI</label>
                      <input
                        type="number"
                        step="any"
                        name="jodi"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="tp">TP</label>
                      <input
                        type="number"
                        step="any"
                        name="tp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                  </div>
                <div className="add-button">
                  <button type="submit">Add Set</button>
                </div>
              </form>
            </div>
          </div>
          </div>
              </div>
            </div>
          </div>
        </div>
        <div className={isVisible.editSet ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('editSet')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('editSet')}>Update Set</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
              <div className="">
              <div className="add-set-popup">
           
            <div className="customer-body">
              <form onSubmit={updateHandler}>
              <div className="add-suctomer-right">
                    <div className="customer-set">
                      <label htmlFor="set">Set</label>
                      <input
                        type="number"
                        step="any"
                        name="set"
                        value={editSet.set}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="commission">Commision</label>
                      <input
                        type="number"
                        step="any"
                        value={editSet.commission}
                        name="commission"
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pana">Pana</label>
                      <input
                        type="number"
                        step="any"
                        name="pana"
                        value={editSet.pana}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="partnership">Partmership</label>
                      <input
                        type="number"
                        step="any"
                        name="partnership"
                        value={editSet.partnership}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="multiple">Multiple</label>
                      <input
                        type="number"
                        step="any"
                        name="multiple"
                        value={editSet.multiple}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sp">SP</label>
                      <input
                        type="number"
                        step="any"
                        name="sp"
                        value={editSet.sp}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dp">DP</label>
                      <input
                        type="number"
                        step="any"
                        name="dp"
                        value={editSet.dp}
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="jodi">JODI</label>
                      <input
                        type="number"
                        step="any"
                        value={editSet.jodi}
                        name="jodi"
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="tp">TP</label>
                      <input
                        type="number"
                        step="any"
                        value={editSet.tp}
                        name="tp"
                        onChange={editFormHandler}
                        required
                      />
                    </div>
                  </div>
                <div className="add-button">
                  <button type="submit">Update Set</button>
                </div>
              </form>
            </div>
          </div>
          </div>
              </div>
            </div>
          </div>
        </div>
        <div className={isVisible.deleteSet ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('deleteSet')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('deleteSet')}>Delete Set</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
                <div className="">
                  Are you sure you want to delete this set!
                </div>
                <button onClick={() =>deletehandler(deleteSetID)}>Yes</button>
                <button onClick={() =>modalOpen('deleteSet')}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
